/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Serves api
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import http from "http";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";

import { bodyParser } from "./middleware";
import { errorHandler } from "./middleware";

import { executeController } from "./controller";
import { executeCmdController } from "./controller";
import { contentTreeController } from "./controller";
import { createDirectoryController } from "./controller";
import { removeDirectoryController } from "./controller";
import { renameDirectoryController } from "./controller";
import { uploadFileController } from "./controller";
import { removeFileController } from "./controller";
import { renameFileController } from "./controller";
import { getFileController } from "./controller";
import { getLogController } from "./controller";

// Create express app
const app = express();

// Create an HTTP server from the Express app
export const httpServer = http.createServer( app );


/////////////////////////////////PRE MIDDLEWARES//////////////////////////////

/**
 * Temperory cors access
 */
app.use(cors());

/**
 * Middleware for body parser
 */
app.use(bodyParser);

/**
 * Middleware for file upload
 */
app.use(fileUpload());

/////////////////////////////////ROUTERS////////////////////////////////////////

/**
 * Router for code execution
 */
app.post('/execute', executeController);

/**
 * Router for command execution
 */
app.post('/execute-cmd', executeCmdController);

/**
 * Router for content tree
 */
app.get('/content', contentTreeController);

/**
 * Router for create directory
 */
app.post('/create-directory', createDirectoryController);

/**
 * Router for remove directory
 */
app.post('/remove-directory', removeDirectoryController);

/**
 * Router for rename directory
 */
app.post('/rename-directory', renameDirectoryController);

/**
 * Router for upload file
 */
app.post('/upload-file', uploadFileController);

/**
 * Router for remove file
 */
app.post('/remove-file', removeFileController);

/**
 * Router for rename file
 */
app.post('/rename-file', renameFileController);

/**
 * Router for get file
 */
app.get('/get-file', getFileController);

/**
 * Router for get log
 */
app.get('/logs', getLogController);

////////////////////////////////POST MIDDLEWARES///////////////////////////////

/**
 * Register the error handling middleware after all other middleware and routes
 */
app.use(errorHandler);