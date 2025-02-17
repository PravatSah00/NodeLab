/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Connect with docker
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import Docker from 'dockerode';
import logger from '../utils/logger';

/**
 * Connect to Docker socker
 */
export const docker = new Docker();

/**
 * Check connection with docker
 */
export async function connectDocker() {
    try {
        /**
         * Check docker connectivity
         */
        await docker.ping();

        logger.info( `Docker connection successfull` );
        
    } catch ( error: any ) {
        logger.error( `Docker connection error: ${error.stack}` );
        process.exit(1);
    }
}
