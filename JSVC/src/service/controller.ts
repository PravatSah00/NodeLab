/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Contain controllers
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

import LogHandler from "../lib/LogHandler";
import executeCommand from "../lib/cmdExecuter";
import getDirTree from '../lib/directoryTree';
import { fileSave } from './fileManager';
import { execute } from '../lib/kernel/manager';

/**
 * Controller for execute code
 */
export async function executeController( req: any, res: any, next: any ) {
    try {

        // Get the codeBlock from request body
        const { codeBlock } = req.body;

        // Check code block is present
        if( ! codeBlock ) {
            throw new Error( 'Codeblock is missing' );
        }

        // Execute the code and get the result
        // const result = virtualEnv.run({ code: codeBlock });
        const result = await execute(codeBlock);

        // Send the response
        res.status(200).json( result );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for execute comand
 */
export function executeCmdController( req: any, res: any, next: any ) {
    try {

        // Get the command from request body
        const { command } = req.body;

        // Check command is present
        if( ! command ) {
            throw new Error( 'Command is missing' );
        }

        // Execute the command and get the result
        const result = executeCommand( { command: command } );

        // Send the response
        res.status(200).json( result );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for get file tree of content folder
 */
export function contentTreeController( req: any, res: any, next: any ) {
    try {

        // Get the folder path of content
        const folderPath = path.join( process.cwd(), 'content' );

        // Get the tree
        const tree = getDirTree( folderPath );

        // Send the response
        res.status(200).json( tree );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for create directory
 */
export function createDirectoryController( req: any, res: any, next: any ) {
    try {

        // Get the directory name from request body
        const { directory } = req.body;

        // Check directory is present
        if( ! directory ) {
            throw new Error( 'Directory is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of directory will be create
        const fullDirectoryPath = path.join( baseDirectory, directory );
        
        // Create the directory
        fs.mkdirSync( fullDirectoryPath, { recursive: true } );

        // Send the response
        res.status(200).json( true );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for remove directory
 */
export function removeDirectoryController( req: any, res: any, next: any ) {
    try {

        // Get the directory name from request body
        const { directory } = req.body;

        // Check directory is present
        if( ! directory ) {
            throw new Error( 'Directory is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of directory will be removed
        const fullDirectoryPath = path.join( baseDirectory, directory );
        
        // remove the directory
        fs.rmSync(fullDirectoryPath, { recursive: true, force: true });

        // Send the response
        res.status(200).json( true );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for rename directory
 */
export function renameDirectoryController( req: any, res: any, next: any ) {
    try {

        // Get the old directory name from request body
        const { oldDirectory } = req.body;

        // Get the new directory name from request body
        const { newDirectory } = req.body;

        // Check old directory is present
        if( ! oldDirectory ) {
            throw new Error( 'Old directory is missing' );
        }

        // Check new directory is present
        if( ! newDirectory ) {
            throw new Error( 'New directory is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of old directory
        const oldDirectoryPath = path.join(baseDirectory, oldDirectory);
        
        // Get the full path of new directory
        const newDirectoryPath = path.join( baseDirectory, newDirectory );
        
        // Rename the directory
        fs.renameSync(oldDirectoryPath, newDirectoryPath);

        // Send the response
        res.status(200).json( true );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for upload file
 */
export async function uploadFileController( req: any, res: any, next: any ) {
    try {

        // Get all fiels
        const files = req.files;

        // Verify files present
        if ( ! files || Object.keys( files ).length === 0) {
            throw new Error( 'No files were uploaded.' );
        }
        
        // Get upload directory
        const { directory } = req.body;

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of directory will be removed
        const fullDirectory = path.join(baseDirectory, directory ?? '');

        // Create the directory if not exist
        fs.mkdirSync( fullDirectory, { recursive: true } );

        // Store file upload status
        const uploadStatus = [];

        for( const [ key, file ] of Object.entries( files ) ) {
            try {
                uploadStatus.push( await fileSave( fullDirectory, file ) );
            } catch ( error: any ) {
                uploadStatus.push( error );
            }
        }

        // Send the response
        res.status(200).json( uploadStatus );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    }
}

/**
 * Controller for remove file
 */
export function removeFileController( req: any, res: any, next: any ) {
    try {

        // Get the file name from request body
        const { file } = req.body;

        // Check file is present in request body
        if( ! file ) {
            throw new Error( 'File name is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of file will be removed
        const fullFilePath = path.join( baseDirectory, file );
        
        // remove the file
        fs.unlinkSync( fullFilePath );

        // Send the response
        res.status(200).json( true );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for rename file
 */
export function renameFileController( req: any, res: any, next: any ) {
    try {

        // Get the old file name from request body
        const { oldFile } = req.body;

        // Get the new file name from request body
        const { newFile } = req.body;

        // Check old file is present
        if( ! oldFile ) {
            throw new Error( 'Old file name is missing' );
        }

        // Check new file is present
        if( ! newFile ) {
            throw new Error( 'New file name is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of old file
        const oldFilePath = path.join(baseDirectory, oldFile);
        
        // Get the full path of new file
        const newFilePath = path.join( baseDirectory, newFile );
        
        // Rename the directory
        fs.renameSync(oldFilePath, newFilePath);

        // Send the response
        res.status(200).json( true );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for get file
 */
export function getFileController( req: any, res: any, next: any ) {
    try {

        // Get the file name from request body
        const { file } = req.query;

        // Check file is present in request body
        if( ! file ) {
            throw new Error( 'File name is missing' );
        }

        // Get the base directory path
        const baseDirectory = path.join( process.cwd(), 'content' );
        
        // Get the full path of file will be removed
        const fullFilePath = path.join( baseDirectory, file );
        
        // Check file is exist 
        if ( fs.existsSync( fullFilePath ) ) {
            
            // Send the file
            res.sendFile( fullFilePath, ( err: any ) => {
                if ( err ) {
                    throw err;
                } else {
                    LogHandler.log( { log: `send file ${ fullFilePath } ` } );
                }
            });
        } else {
            throw new Error( `Unable to access file "content/${file}"` );
        }

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for getting the log 
 */
export function getLogController(req: any, res: any, next: any) {
    try {
        // Send the response
        res.status(200).json( LogHandler.getLogs() );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}