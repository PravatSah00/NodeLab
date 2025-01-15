/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: This file contin the core class responsible for manupulating virtual inviroment.
 *       It create virtual inviroment. Manage virtual inviroment and Execute code in virtual inviroment
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import vm from 'vm';

import LogHandler from './LogHandler';

import consoleCapture from './consoleCapture';

import babelTranspiler from './babelTranspiler';

/**
 * Virtual enviroment class
 */
class VirtualEnv {

    // Sandbox context
    private sandbox = {
        require: require, // Provide require context
        console: { // Overwrite the console method
            log:      (...args: any[]) => consoleCapture.log(...args),
            error:    (...args: any[]) => consoleCapture.error(...args),
            warn:     (...args: any[]) => consoleCapture.warn(...args),
            info:     (...args: any[]) => consoleCapture.info(...args),
            table:    (...args: any[]) => consoleCapture.table(...args),
            assert:   (condition: any, ...args: any[]) => consoleCapture.assert(condition, ...args),
            count:    (...args: any[]) => consoleCapture.count(...args),
            group:    (groupId: any) => consoleCapture.group(groupId),
            groupEnd: () => consoleCapture.groupEnd(),
            trace:    () => consoleCapture.trace(),
            dir:      (...args: any[]) => consoleCapture.dir(...args),
            debug:    (...args: any[]) => consoleCapture.debug(...args),
            clear:    () => consoleCapture.clear(),
        }
    }

    /**
     * Constructor class of virtual env class.
     * It init virtual matching for executing the code
     */
    constructor() {
        try {
            // Initialize the context (sandbox)
            vm.createContext( this.sandbox );
        } catch ( error: any ) {
            LogHandler.log( { log: error.stack } );
        }
    }

    /**
     * Code executer function
     */
    run({ code }: { code: string }) {
        
        // Start console output capture
        consoleCapture.startCapture();

        try {
            // Transpile code of ES6 to commonJS
            const transpiledCode = babelTranspiler( { code: code } );
            
            // Execute the code within the context
            vm.runInContext(transpiledCode, this.sandbox);

        } catch (error: any) {
            // Insert error in output buffer
            consoleCapture.insertOutput({
                type: 'error',
                output: error.stack,
            });

        } finally {
            // Return the output buffer
            return consoleCapture.endCapture();
        }
    }
}

export default new VirtualEnv();
