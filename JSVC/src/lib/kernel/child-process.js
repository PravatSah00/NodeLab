/**
 * Child runner for kernel
 */

const vm = require('vm');
const consoleCapture = require('./console-capture');

/**
 * Sandbox init
 */
const sandbox = Object.assign({}, globalThis);

// forward require to parent (simple)
sandbox.require = require;

// forward console to parent (simple)
sandbox.console = {
    log     : (...args) => consoleCapture.log(...args),
    error   : (...args) => consoleCapture.error(...args),
    warn    : (...args) => consoleCapture.warn(...args),
    info    : (...args) => consoleCapture.info(...args),
    table   : (...args) => consoleCapture.table(...args),
    assert  : (condition, ...args) => consoleCapture.assert(condition, ...args),
    count   : (...args) => consoleCapture.count(...args),
    group   : (groupId) => consoleCapture.group(groupId),
    groupEnd: () => consoleCapture.groupEnd(),
    trace   : () => consoleCapture.trace(),
    dir     : (...args) => consoleCapture.dir(...args),
    debug   : (...args) => consoleCapture.debug(...args),
    clear   : () => consoleCapture.clear(),
};

/**
 * Context for sendbox
 */
let context = vm.createContext(sandbox);

/**
 * Execute code in child process 
 */
function executeCode(runId, code) {

    // Start console output capture
    consoleCapture.startCapture();
    
    try {
        vm.runInContext(code, context);
    } catch (error) {

        // Insert error in output buffer
        consoleCapture.insertOutput({
            type  : 'error',
            output: error.stack,
        });

    } finally {
        // Return the output buffer
        const output = consoleCapture.endCapture();
        process.send({ type: 'done', runId, output });

    }
}

/**
 * Listen for parent messages
 */
process.on( 'message', (message) => {
    if ( !message || !message.code ) return;
    executeCode( message.runId, message.code );
});

/**
 * Keep child alive indefinitely
 */
setInterval(() => { }, 1 << 30);
