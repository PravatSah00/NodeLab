/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Contain controllers
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import LogHandler from "../lib/LogHandler";

/**
 * Controller for execute code
 */
export function executeController( req: any, res: any, next: any ) {
    try {

        console.log(req.body);

        res.status(200).json("Hellod");

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

        console.log( req.body );

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

        console.log( req.body );

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

        console.log( req.body );

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

        console.log( req.body );

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

        console.log( req.body );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}

/**
 * Controller for upload file
 */
export function uploadFileController( req: any, res: any, next: any ) {
    try {

        console.log( req.body );

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

        console.log( req.body );

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

        console.log( req.body );

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

        console.log( req.body );

    } catch ( error: any ) {

        LogHandler.log({ log: error.stack });
        throw( error );
    
    }
}