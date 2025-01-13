/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: This file contian the console capture functionility
 *       It capture the console's print statement in certen execution time.
 *       We can start by startCapture() and end capture by endCapture() method
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

/**
 * Interface for outputchank store in console buffer
 */
interface OutputChank {
    type: string,
    output: any,
}

/**
 * Console Capture main class
 */
class ConsoleCapture {
    /**
     * Flag for indicate capture state
     */
    private captureFlag = false;
    
    /**
     * Maximum number of output to store in buffer
     */
    private maxCapture = 999;

    /**
     * Buffer to store console output
     */
    private consoleBuffer: Array<OutputChank> = [];

    /**
     * Check output capturing is on or not
     * @returns true if capture is running
     */
    private isCapturing() {
        return this.captureFlag;
    }

    /**
     * Clear the console buffer
     */
    public fluskBuffer() {
        this.consoleBuffer = [];
    }

    /**
     * Start the capture of output
     */
    public startCapture() {

        // clear the console buffer
        this.fluskBuffer();

        // Set the capture flug up
        this.captureFlag = true;
    }

    /**
     * End the capture of output
     * @returns captured data
     */
    public endCapture() {

        // set the capture flug down
        this.captureFlag = false;

        // coppy console buffer
        const tempConsoleBuffer = [ ...this.consoleBuffer ];
        
        // clear console buffer
        this.fluskBuffer();

        return tempConsoleBuffer;
    }

    /**
     * Insert a new output chank to output buffer
     */
    public insertOutput( { type, output }: { type: string, output: any } ) {
        
        // Check the maximum output store limit
        if (this.consoleBuffer.length > this.maxCapture) {
            
            // Remove the earliest chank
            this.consoleBuffer.shift();
        }

        // Insert new output chank
        this.consoleBuffer.push({
            type: type,
            output: output
        });

    }

    /**
     * console.log
     * @param args 
     * @returns 
     */
    public log(...args: any[]) {
        
        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'log', output: args } );
    }

    /**
     * console.error
     * @param args 
     * @returns 
     */
    public error(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'error', output: args } );
    }

    /**
     * console.warn
     * @param args 
     * @returns 
     */
    public warn(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'warn', output: args } );
    }

    /**
     * console.info
     * @param args 
     * @returns 
     */
    public info(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'info', output: args } );
    }

    /**
     * console.table
     * @param args 
     * @returns 
     */
    public table(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'table', output: args } );
    }

    /**
     * console.assert
     * @param condition 
     * @param args 
     * @returns 
     */
    public assert( condition: any, ...args: any[] ) {
        
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
    public count(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'count', output: args } );
    }

    /**
     * console.group
     * @param groupId 
     * @returns 
     */
    public group( groupId: any ) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'group', output: groupId } );
    }

    /**
     * console.groupEnd
     * @returns 
     */
    public groupEnd() {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'groupEnd', output: {} } );
    }

    /**
     * console.trace
     * @returns 
     */
    public trace() {

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
    public dir(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'dir', output: args } );
    }

    /**
     * console.clear
     */
    public clear() {
        this.fluskBuffer();
    }

    /**
     * console.debug
     * @param args 
     * @returns 
     */
    public debug(...args: any[]) {

        if ( ! this.isCapturing() ) return;

        this.insertOutput( { type: 'debug', output: args } );
    }
}

export default new ConsoleCapture();