import path from 'path';
import { fork, ChildProcess } from 'child_process';
import LogHandler from '../LogHandler';
import consoleCapture from '../consoleCapture';
import { newError } from '../errorManager';

/**
 * Set the child path
 */
const DEFAULT_CHILD_PATH = path.join(__dirname, 'child-process.js');

/**
 * Virtual enviroment manage child process
 */
export default class VirtualEnv {

    /**
     * Variable that store chicld process file path
     */
    private childPath: string;

    /**
     * Object contain child process
     */
    private childProcess: ChildProcess | null = null;

    /**
     * Variable for running state
     */
    private running = false;

    /**
     * Virtual env constructor
     */
    constructor(childPath?: string) {
        this.childPath = childPath ?? DEFAULT_CHILD_PATH;
        this.spawnChild();
    }

    /**
     * Spawn a new child process
     */
    private spawnChild() {
        if (this.childProcess) return;

        try {
            const cp = fork(this.childPath, [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
            this.childProcess = cp;

            // Handle exist event
            cp.on('exit', (_code, _signal) => {
                this.childProcess = null;
                this.running = false;
            });

            // Handle error event
            cp.on('error', (_err) => {
                this.childProcess = null;
                this.running = false;
            });

        } catch (err) {
            this.childProcess = null;
            this.running = false;
        }
    }

    /** Run code sequentially — throws if another run is pending. */
    async run(code: string) {

        if (this.running) throw newError({
            message: 'A run is already pending.',
            name: 'ALREADY_PENDING_EXECUTION_EXCEPTION'
        })

        if (!this.childProcess) this.spawnChild();

        if (!this.childProcess) throw newError({
            message: 'Failed to spawn child process.',
            name: 'CHILD_PROCESS_SPAWN_EXCEPTION'
        })

        this.running = true;

        /**
         * Return execution promise
         */
        return new Promise((resolve) => {

            // make a run id so we can be certain the done message belongs to this run
            const runId = Date.now() + Math.floor(Math.random() * 10000);

            /**
             * Define done handler 
             */
            const doneHandler = (message: any) => {
                try {
                    // Validate message
                    if (!message || typeof message !== 'object') return;
                    if (message.type !== 'done') return;
                    if (message.runId !== runId) return;

                    cleanup();
                    resolve(message.output);

                } catch (error) {

                    cleanup();
                    resolve([{
                        type: 'error',
                        output: 'Unable to recive output buffer (rare-case)'
                    }]);
                }
            };

            /**
             * `exit` handler: child died while run pending
             */
            const exitHandler = async (_code: number | null, _signal: string | null) => {

                cleanup();
                await this.terminate();

                resolve([{
                    type: 'error',
                    output: 'Process terminated before execution (rare-case)'
                }]);
            };

            /**
             * Cleanup after code execution
             */
            const cleanup = () => {
                try { this.childProcess?.removeListener('message', doneHandler) } catch { }
                try { this.childProcess?.removeListener('exit', exitHandler) } catch { }
                this.running = false;
            };

            // Attach listeners BEFORE sending — avoids missing immediate responses.
            this.childProcess!.on('message', doneHandler);
            this.childProcess!.once('exit', exitHandler);

            // send the run request
            try {
                this.childProcess!.send({ type: 'run', runId, code });
            } catch ( error ) {
                // Handle error
                cleanup();
                resolve([{
                    type:   'error',
                    output: 'Unable to execute code in vm (rare-case)'
                }]);
            }
        });
    }

    /**
     * Hard reset: kill child and spawn a new one.
     */
    async hardReset(): Promise<void> {
        if (this.childProcess) {
            try { this.childProcess.kill('SIGKILL') } catch { }
            this.childProcess = null;
        }

        this.running = false;
        this.spawnChild();
    }

    /**
     * Terminate child and cleanup.
     */
    async terminate(): Promise<void> {
        if (!this.childProcess) {
            this.running = false;
            return;
        }

        try { this.childProcess.kill('SIGKILL'); } catch { }
        this.childProcess = null;
        this.running = false;
    }
}
