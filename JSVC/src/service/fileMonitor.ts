/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Monitor file activity of content folder
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import chokidar from 'chokidar';
import path from 'path';
import LogHandler from '../lib/LogHandler';

/**
 * Utility function for get relative path
 * @param filePath actual file path
 * @returns relative file path
 */
const getRelativePath = ( filePath: string ): string => {
    return path.relative( process.cwd(), filePath );
};

// Define the folder path
const folderPath: string = path.join( process.cwd(), 'content' );

// Log for debug purpose
LogHandler.log({ log: `Watching for changes in folder: ${folderPath}` });

// Initialize the file watcher
const watcher = chokidar.watch( folderPath, {
    persistent:    true,
    ignoreInitial: true,
});

// Set up event listeners
watcher
    // Event listener when add a new file
    .on('add', ( filePath: string ) => {
        const relativePath = getRelativePath( filePath );
        console.log(`File added: ${relativePath}`);
    })

    // Event listener when remove a file
    .on('unlink', ( filePath: string ) => {
        const relativePath = getRelativePath(filePath);
        console.log(`File removed: ${relativePath}`);
    })

    // Event listener when change in a file
    .on('change', ( filePath: string ) => {
        const relativePath = getRelativePath(filePath);
        console.log(`File changed: ${relativePath}`);
    })

    // Handle error event
    .on('error', (error: any) => {
        // Log for debug purpose
        LogHandler.log({ log: `Error in monitoring: ${error.message}`});
    });
