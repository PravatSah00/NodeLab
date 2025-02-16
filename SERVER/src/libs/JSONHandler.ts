/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Json file handler class
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */


import fs from 'fs';

/**
 * JSON file handler class
 */
class JSONHandler {

    /**
     * JSON file path
     */
    private filePath: string = '';

    /**
     * JSON object to cashe
     */
    private jsonObject: Record<string, any> = {};

    /**
     * JSONHandler class constructor function
     * @param filePath Path to the JSON file
     */
    constructor(filePath: string) {
        this.filePath = filePath;
        this.load();
    }

    /**
     * Load the JSON file as an object
     */
    private load(): void {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.jsonObject = JSON.parse(data);
        } catch (error) {
            console.error(`Error loading JSON file: ${(error as Error).message}`);
            this.jsonObject = {};
        }
    }

    /**
     * Get a value by key
     * @param key Key to search
     * @returns Value associated with the key, or undefined if not found
     */
    get<T>(key: string): T | undefined {
        
        // Split key
        const keys = key.split('.');
        let current: any = this.jsonObject;

        for ( const key of keys ) {
            
            // Check key exist or not
            if ( current[key] === undefined ) {
                return undefined;
            }

            current = current[key];
        }

        return current as T;
    }

    /**
     * Set a value by key
     * @param key Key to store the data under. Key can be like this "key.subkey"
     * @param value Value to store
     * @param fileSave If true, saves the file immediately after setting the value
     */
    set<T>(key: string, value: T, fileSave: boolean = true): void {
        
        // Split keys
        const keys = key.split('.');
        
        // Set current pointer to root
        let current = this.jsonObject;

        // Traverse and create nested objects if they don’t exist
        for ( let i = 0; i < keys.length - 1; i++ ) {
            
            const k = keys[i];
            
            if ( typeof current[k] !== 'object' || current[k] === null ) {
                // Initialize if not an object
                current[k] = {};
            }
            
            current = current[k];
        }

        // Assign the final value
        current[ keys[ keys.length - 1 ] ] = value;

        // Save the file if required
        if ( fileSave ) {
            this.save();
        }
    }

    /**
     * Save the JSON object back to the file
     */
    private save(): void {
        try {
            const data = JSON.stringify(this.jsonObject, null, 2);
            fs.writeFileSync(this.filePath, data, 'utf-8');
        } catch (error) {
            console.error(`Error saving JSON file: ${(error as Error).message}`);
        }
    }
}

export default JSONHandler;
