/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: configaration handler class
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import path from 'path';
import JSONHandler from '../libs/JSONHandler';

/**
 * CONFIG file path
 */// Export an instance of the Config class to ensure singleton-like behavior

const CONFIG_PATH: string = 'config.json';

/**
 * Config handler class
 */
class Config extends JSONHandler {
    /**
     * Config class constructor function
     */
    constructor() {
        

        // Get the directory name and config path
        const configPath = path.join( process.cwd(), CONFIG_PATH )

        super(configPath);
    }
}

export default new Config();
