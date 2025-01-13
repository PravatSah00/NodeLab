/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Contain helper function to install package through npm
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import { execSync } from 'child_process';

import LogHandler from './LogHandler';

/**
 * Function for install package through npm
 */
export default function executeCommand({ command }: { command: string }) {
    try {
        
        // Execute install process
        const stdOut = execSync( command );
        
        return {
            success: true,
            output: stdOut.toString(),
        }

    } catch (error: any) {

        LogHandler.log({ log: error.stack });

        return {
            success: false,
            output: error.message,
        }        
    }
}