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
export default function installPackage({ packageName }: { packageName: string }) {
    try {
        
        // Execute install process
        execSync(`npm install ${packageName}`, { stdio: 'inherit' });
        
        return true;

    } catch (error: any) {
        
        LogHandler.log({ log: error.stack });
        
        return false;
    }
}