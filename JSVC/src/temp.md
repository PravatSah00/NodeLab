# VirtualEnvChild — child-process runtime (drop-in replacement for your `VirtualEnv`)

This small library mirrors your current API (`run({ code })`) but executes user code inside a **persistent child process** with a **VM context** that remembers state between runs. It forwards console output to your existing `consoleCapture`, supports **Babel transpilation** on the parent, and lets code `require` npm packages installed inside the container.

> Key features
>
> * Persistent child process (lives until you call `terminate()`)
> * Persistent `vm` context inside the child (variables survive across chunks)
> * Console forwarding to your `consoleCapture`
> * Optional wall-time timeout per run (no auto-kill by default)
> * You can expose native `require` (works with `npm i` in the container)
>
> Folder layout (suggested):
>
> ```text
> src/
>   VirtualEnvChild.ts          # parent-side manager (TypeScript)
>   child-runner.js             # child entry (CommonJS)
>   consoleCapture.ts           # your existing module (used on parent only)
>   LogHandler.ts               # your existing module
>   babelTranspiler.ts          # your existing module (used on parent)
> ```

---

## 1) `src/child-runner.js` (child process entry — CommonJS)

```js
// src/child-runner.js
// Runs inside the child process. Maintains a persistent VM context and forwards console calls to parent.

const vm = require('vm');

let sandbox = createSandbox();
let context = vm.createContext(sandbox);

function createSandbox() {
  // Forward console calls to parent (parent will route to consoleCapture)
  const sendConsole = (method, args) => {
    if (process && typeof process.send === 'function') {
      try { process.send({ type: 'console', method, args }); } catch {}
    }
  };

  const consoleProxy = {
    log: (...a) => sendConsole('log', a),
    error: (...a) => sendConsole('error', a),
    warn: (...a) => sendConsole('warn', a),
    info: (...a) => sendConsole('info', a),
    debug: (...a) => sendConsole('debug', a),
    table: (...a) => sendConsole('table', a),
    assert: (...a) => sendConsole('assert', a),
    count: (...a) => sendConsole('count', a),
    group: (...a) => sendConsole('group', a),
    groupEnd: (...a) => sendConsole('groupEnd', a),
    trace: (...a) => sendConsole('trace', a),
    dir: (...a) => sendConsole('dir', a),
    clear: (...a) => sendConsole('clear', a),
  };

  return {
    // NOTE: You can restrict what's exposed here. Exposing require gives full power within the container.
    require,
    console: consoleProxy,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
  };
}

function runCode(runId, code, vmTimeoutMs) {
  try {
    const script = new vm.Script(code, { filename: 'user-code.js' });
    script.runInContext(context, { timeout: Math.max(1, vmTimeoutMs || 1000) });
    process.send && process.send({ type: 'done', runId });
  } catch (err) {
    const msg = (err && err.stack) || String(err);
    process.send && process.send({ type: 'error', runId, error: msg });
  }
}

process.on('message', (msg) => {
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'run': {
      runCode(msg.runId, msg.code, msg.vmTimeoutMs);
      break;
    }
    case 'reset': {
      // soft reset: new sandbox/context (does not cancel timers started earlier)
      sandbox = createSandbox();
      context = vm.createContext(sandbox);
      process.send && process.send({ type: 'reset-done' });
      break;
    }
    case 'ping': {
      process.send && process.send({ type: 'pong' });
      break;
    }
    default:
      process.send && process.send({ type: 'warn', message: `unknown message: ${msg.type}` });
  }
});

// Keep the child alive indefinitely (IPC listener is usually enough, this is just a guard)
setInterval(() => {}, 1 << 30);
```

---

## 2) `src/VirtualEnvChild.ts` (parent-side manager — TypeScript)

```ts
// src/VirtualEnvChild.ts
import { ChildProcess, fork } from 'child_process';
import path from 'path';
import consoleCapture from './consoleCapture';
import LogHandler from './LogHandler';
import babelTranspiler from './babelTranspiler';

export type RunOptions = {
  transpile?: boolean;   // default true (use your babelTranspiler)
  vmTimeoutMs?: number;  // timeout for synchronous VM runInContext (inside child)
  wallTimeoutMs?: number; // overall wall time; if exceeded we optionally kill child (default: no auto-kill)
  killOnTimeout?: boolean; // default false; if true, SIGKILL child on wall-timeout
};

export default class VirtualEnvChild {
  private child: ChildProcess | null = null;
  private readonly childPath: string;

  constructor(childRunnerPath?: string) {
    this.childPath = childRunnerPath ?? path.join(__dirname, 'child-runner.js');
    this.spawnChild();
  }

  private spawnChild() {
    if (this.child) return;
    const cp = fork(this.childPath, [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    this.child = cp;

    cp.on('message', (msg: any) => {
      if (!msg || !msg.type) return;
      if (msg.type === 'console') {
        const method = msg.method || 'log';
        const args = Array.isArray(msg.args) ? msg.args : [msg.args];
        const fn = (consoleCapture as any)[method] ?? consoleCapture.log;
        try { fn(...args); } catch (e) { LogHandler.log({ log: `consoleCapture failed: ${e}` }); }
      }
    });

    cp.on('exit', (code, signal) => {
      LogHandler.log({ log: `child exited (code=${code}, signal=${signal})` });
      this.child = null;
    });

    cp.on('error', (err) => {
      LogHandler.log({ log: `child error: ${(err && (err.stack || err.message)) || String(err)}` });
      this.child = null;
    });

    // optional: forward stdio for debugging
    cp.stdout?.on('data', d => LogHandler.log({ log: `[child stdout] ${d}` }));
    cp.stderr?.on('data', d => LogHandler.log({ log: `[child stderr] ${d}` }));
  }

  /** Run a chunk of code in the persistent child VM context. */
  async run({ code }: { code: string }, opts: RunOptions = {}) {
    const {
      transpile = true,
      vmTimeoutMs = 1000,
      wallTimeoutMs,
      killOnTimeout = false,
    } = opts;

    if (!this.child) this.spawnChild();
    if (!this.child) throw new Error('Failed to start child process');

    // Transpile on parent to keep child small/simple
    let payload = code;
    if (transpile) {
      try {
        payload = babelTranspiler({ code });
      } catch (err: any) {
        consoleCapture.startCapture();
        consoleCapture.insertOutput?.({ type: 'error', output: err?.stack || String(err) });
        return consoleCapture.endCapture();
      }
    }

    const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // start capture so forwarded console events are collected
    consoleCapture.startCapture();

    return await new Promise((resolve) => {
      let finished = false;
      let wallTimer: NodeJS.Timeout | undefined;

      const onMsg = (msg: any) => {
        if (!msg || !msg.type) return;
        if (msg.runId !== runId) return; // ignore other runs

        if (msg.type === 'done') {
          if (finished) return; finished = true;
          if (wallTimer) clearTimeout(wallTimer);
          const out = consoleCapture.endCapture();
          cleanup();
          resolve(out);
        }
        if (msg.type === 'error') {
          if (finished) return; finished = true;
          if (wallTimer) clearTimeout(wallTimer);
          consoleCapture.insertOutput?.({ type: 'error', output: msg.error });
          const out = consoleCapture.endCapture();
          cleanup();
          resolve(out);
        }
      };

      const cleanup = () => {
        this.child?.off('message', onMsg);
      };

      this.child!.on('message', onMsg);

      if (wallTimeoutMs && wallTimeoutMs > 0) {
        wallTimer = setTimeout(() => {
          if (finished) return; finished = true;
          if (killOnTimeout) {
            try { this.child?.kill('SIGKILL'); } catch {}
            this.child = null; // force respawn next call
          }
          consoleCapture.insertOutput?.({ type: 'error', output: `Execution timed out after ${wallTimeoutMs}ms${killOnTimeout ? ' and child was killed' : ''}.` });
          const out = consoleCapture.endCapture();
          cleanup();
          resolve(out);
        }, wallTimeoutMs);
      }

      // send run request to child
      this.child!.send({ type: 'run', runId, code: payload, vmTimeoutMs });
    });
  }

  /** Soft reset: rebuild VM context inside the child (does NOT cancel running timers). */
  async reset() {
    if (!this.child) this.spawnChild();
    return new Promise((resolve) => {
      const onMsg = (m: any) => {
        if (m && m.type === 'reset-done') { this.child?.off('message', onMsg); resolve(true); }
      };
      this.child!.on('message', onMsg);
      this.child!.send({ type: 'reset' });
    });
  }

  /** Hard kill the child; next run() will spawn a fresh one. */
  async terminate() {
    if (!this.child) return;
    try { this.child.kill('SIGKILL'); } catch {}
    this.child = null;
  }
}
```

---

## 3) Example usage

```ts
// src/example.ts
import VirtualEnvChild from './VirtualEnvChild';

async function demo() {
  const env = new VirtualEnvChild(); // spawns and keeps a persistent child

  // First chunk — define a variable in the child's VM context
  let out = await env.run({ code: `
    console.log('Hello from child VM');
    var counter = 1;
  `});
  console.log('OUT 1:', out);

  // Second chunk — uses the same context (counter is remembered)
  out = await env.run({ code: `
    counter += 5;
    console.log('counter now', counter);
  `});
  console.log('OUT 2:', out);

  // Install & require an npm package (inside the container)
  out = await env.run({ code: `
    const { execSync } = require('child_process');
    console.log('npm -v:', execSync('npm -v').toString().trim());
    execSync('npm i nanoid@4', { stdio: 'pipe' });
    const { nanoid } = require('nanoid');
    console.log('id', nanoid());
  `}, { vmTimeoutMs: 2000, wallTimeoutMs: 15000 });
  console.log('OUT 3:', out);

  // When done, you can keep the child alive or kill it explicitly:
  await env.terminate();
}

demo().catch(console.error);
```

---

## Notes & knobs

* **Persistence**: the child stays alive until you call `terminate()`. The VM context remembers variables across runs.
* **Timeouts**:

  * `vmTimeoutMs` aborts *synchronous* code inside `runInContext` (Node/V8 timeout).
  * `wallTimeoutMs` is a host-side wall timer; if it fires and `killOnTimeout` is true, the child is **hard-killed**.
* **Security**: Exposing `require` gives full access *inside the container*. If you want to restrict it, replace `require` in the sandbox with a whitelist loader.
* **npm install**: Works as long as you `npm i` inside the container’s working directory that the child uses. You don’t need to restart the child; subsequent `require()` will find modules.
* **No auto-exit**: The child has an IPC listener and a long `setInterval` guard so it will not exit automatically.

---

## Optional: safer `require` (whitelist)

Replace `require` in `child-runner.js` with a whitelisted loader:

```js
const ALLOWED = new Set(['nanoid', 'lodash', 'path']);
function safeRequire(name) {
  if (!ALLOWED.has(name)) {
    throw new Error(`Module not allowed: ${name}`);
  }
  return require(name);
}
// ... in sandbox:
return { require: safeRequire, console: consoleProxy, setTimeout, setInterval, clearTimeout, clearInterval };
```

---

That’s it — this gives you a **drop-in child-process library** that matches your original `VirtualEnv.run({ code })` behavior, with stronger isolation and better lifecycle control. Adjust file paths/imports to your project structure and you’re good to go.
