/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Contain middlewares
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import express from "express";

/**
 * Bodyparser for express request
 */
export function bodyParser(req: any, res: any, next: any) {
    express.json()(req, res, next);
}

/**
 * Middleware function for error filtering process
 */
export const errorHandler = (error: any, req: any, res: any, next: any) => {

    // Get the status and error message
    const status  = error.status || 500;
    const message = error.message || 'Internal Server Error';

    // Send response for debugmode with extra information
    res.status(status).json(
        {
            name: error.name,
            stack: error.stack,
            message,
            status,
        }
    );
};