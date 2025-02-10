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
import { emitEvent } from './socketService';
import LogHandler from '../lib/LogHandler';

/**
 * Utility function for get relative path
 * @param filePath actual file path
 * @returns relative file path
 */
const getRelativePath = ( filePath: string ): string => {
    return path.relative( path.join( process.cwd(), 'content' ), filePath );
};

// Define the folder path
const folderPath: string = path.join( process.cwd(), 'content' );

// Log for debug purpose
LogHandler.log({ log: `Watching for changes in folder: ${folderPath}` });

// Initialize the file watcher
const watcher = chokidar.watch( folderPath, {
    persistent:    true,
    ignoreInitial: true,
    depth:         99,
});

// Set up event listeners
watcher
    /**
     * Event listener when add a new file
     */
    .on( 'add', ( filePath: string ) => {
        
        // Get the relative path
        const relativePath = getRelativePath( filePath );

        // Get the info about the directory
        const info = {
            action: 'add',
            path:   relativePath,
            name:   path.basename( relativePath ),
            parent: path.dirname( relativePath ),
        }

        // Trigger the socket event
        emitEvent( 'content', info );

        // Log the event
        LogHandler.log( { log: `File created: ${relativePath}` } );
    })

    /**
     * Event listener when remove a file
     */
    .on( 'unlink', ( filePath: string ) => {

        // Get the relative path
        const relativePath = getRelativePath( filePath );

        // Get the info about the directory
        const info = {
            action: 'unlink',
            path:   relativePath,
            name:   path.basename( relativePath ),
            parent: path.dirname( relativePath ),
        }

        // Trigger the socket event
        emitEvent( 'content', info );

        // Log the event
        LogHandler.log( { log: `File removed: ${relativePath}` } );
    })

    /**
     * Event listener when change in a file
     */
    // .on( 'change', ( filePath: string ) => {

    //     // Get the relative path
    //     const relativePath = getRelativePath(filePath);

    //     // Log the event
    //     LogHandler.log( { log: `File changed: ${relativePath}` } );
    // })

    /**
     * Event listener when directory created
     */
    .on( 'addDir', ( dirPath: string ) => {

        // Get the relative path
        const relativePath = getRelativePath( dirPath );

        // Get the info about the directory
        const info = {
            action: 'addDir',
            path:   relativePath,
            name:   path.basename( relativePath ),
            parent: path.dirname( relativePath ),
        }

        // Trigger the socket event
        emitEvent( 'content', info );

        // Log the event
        LogHandler.log( { log: `Directory added: ${relativePath}` } );
    })

    /**
     * Event listener when directory removed
     */
    .on( 'unlinkDir', ( dirPath: string ) => {

        // Get the relative path
        const relativePath = getRelativePath( dirPath );

        // Get the info about the directory
        const info = {
            action: 'unlinkDir',
            path:   relativePath,
            name:   path.basename( relativePath ),
            parent: path.dirname( relativePath ),
        }

        // Trigger the socket event
        emitEvent( 'content', info );

        // Log the event
        LogHandler.log( { log: `Directory removed: ${relativePath}` } );
    })

    /**
     * Handle error event
     */
    .on( 'error', ( error: any ) => {
        // Log for debug purpose
        LogHandler.log({ log: `Error in monitoring: ${error.message}`});
    });
