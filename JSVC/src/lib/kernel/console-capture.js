/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: This file contains the console capture functionality
 *       It captures console output during a specific execution session.
 *       Use startCapture() to begin and endCapture() to finish capturing.
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

class ConsoleCapture {

    /**
     * Console capture class constructure function
     */
    constructor() {
        this.captureFlag   = false;  // capture state
        this.maxCapture    = 999;    // maximum output to store
        this.consoleBuffer = [];     // buffer to store outputs
    }

    // check if capturing is on
    isCapturing() {
        return this.captureFlag;
    }

    // clear the buffer
    fluskBuffer() {
        this.consoleBuffer = [];
    }

    // start capturing
    startCapture() {
        this.fluskBuffer();
        this.captureFlag = true;
    }

    // end capturing and return buffer
    endCapture() {
        this.captureFlag = false;
        const tempBuffer = [...this.consoleBuffer];
        this.fluskBuffer();
        return tempBuffer;
    }

    // insert a new output
    insertOutput({ type, output }) {
        if (this.consoleBuffer.length > this.maxCapture) {
            this.consoleBuffer.shift();
        }
        this.consoleBuffer.push({ type, output });
    }

    /**
     * console.log
     * @param args 
     * @returns 
     */
    log(...args) {
        
        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'log', output: args } );
    }

    /**
     * console.error
     * @param args 
     * @returns 
     */
    error(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'error', output: args } );
    }

    /**
     * console.warn
     * @param args 
     * @returns 
     */
    warn(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'warn', output: args } );
    }

    /**
     * console.info
     * @param args 
     * @returns 
     */
    info(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'info', output: args } );
    }

    /**
     * console.table
     * @param args 
     * @returns 
     */
    table(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'table', output: args } );
    }

    /**
     * console.assert
     * @param condition 
     * @param args 
     * @returns 
     */
    assert( condition, ...args ) {
        
        if ( ! this.isCapturing() ) return;

        // Check the condition is true or not.
        if ( ! condition ) {
            return;
        }

        this.insertOutput( { type: 'assert', output: args } );
    }

    /**
     * console.count
     * @param args 
     * @returns 
     */
    count(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'count', output: args } );
    }

    /**
     * console.group
     * @param groupId 
     * @returns 
     */
    group( groupId ) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'group', output: groupId } );
    }

    /**
     * console.groupEnd
     * @returns 
     */
    groupEnd() {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'groupEnd', output: {} } );
    }

    /**
     * console.trace
     * @returns 
     */
    trace() {

        if ( ! this.isCapturing() ) return;

        // Get the error object
        const error = new Error();

        // Get the stack track
        const stack = error.stack || '';
    
        // Format stack trace by removing the first line and indenting
        const formattedStack = stack
            .split("\n")
            .slice(1) // Remove the first line (Error line)
            .map(line => `  ${line.trim()}`) // Indent for better readability
            .join("\n");
    
        this.insertOutput( { type: 'trace', output: formattedStack } );
    }

    /**
     * console.dir
     * @param args 
     * @returns 
     */
    dir(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'dir', output: args } );
    }

    /**
     * console.clear
     */
    clear() {
        this.fluskBuffer();
    }

    /**
     * console.debug
     * @param args 
     * @returns 
     */
    debug(...args) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'debug', output: args } );
    }
}

// export singleton instance
module.exports = new ConsoleCapture();
