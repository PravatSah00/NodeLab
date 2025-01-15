/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: This file contian the logging functionility
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import fs from 'fs';

/**
 * Interface for logBlock
 */
interface LogBlock {
    log: string,
    time: number,
}

/**
 * Log file handler class
 */
class LogHandler {

    /**
     * Varaible represent maximum number log to store
     */
    public maxLogCount = 100;

    public log({ log }: { log: string }) {
        
        // Get already store logs
        let currentLogs = this.load();
        
        // Remove the last node of the current log if it reach its maximum size
        if ( currentLogs.length >= this.maxLogCount ) {
            currentLogs.pop();
        }

        // Insert the new log
        currentLogs.unshift(this.createLogBlock({ log: log }));
        
        // Save the logs
        this.save( { logs: currentLogs } );
    }

    /**
     * Create a new logBlock
     * @param log log string 
     * @returns a new logBlock
     */
    private createLogBlock({ log } : { log: string }): LogBlock {
        return {
            log: log,
            time: Date.now()
        }
    }

    /**
     * Load the json file as json object
     */
    private load() : Array<LogBlock> {
        try {

            // Read and parse the json data
            const data = fs.readFileSync( 'log.json' , 'utf-8' );
            let currentLogs = JSON.parse(data);
            
            // Check current log already exist or not
            // If current log is not exist then set it to a empty array
            if ( ! Array.isArray( currentLogs ) ) {
                currentLogs = [];
            }

            return currentLogs;

        } catch ( error: any ) {
            console.error(`Error loading JSON file: ${error.message}`);

            return [];
        }
    }

    /**
     * Save the log's json
     */
    private save({ logs } : { logs: Array<LogBlock> } ) {
        try {
            const data = JSON.stringify( logs, null, 2 );
            fs.writeFileSync( 'log.json', data, 'utf-8' );
        } catch ( error: any ) {
            console.error(`Error saving JSON file: ${error.message}`);
        }
    }
}

export default new LogHandler();