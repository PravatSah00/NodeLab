/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Connect with mongo db database
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import mongoose from "mongoose";
import config from "../utils/config";
import logger from "../utils/logger";


export const connectDB = async () => {
    
    // Get the connection string
    let mongoUri = config.get( 'dbConfig.mongoUri' ) as string;
    let dbName   = config.get( 'dbConfig.dbName' ) as string;
    let dbPass   = config.get( 'dbConfig.dbPass' ) as string;

    mongoUri = mongoUri.replace( '<db_password>', dbPass );
    mongoUri = mongoUri.replace( '<db_name>', dbName );

    try {
        // Connect to mongodb server
        await mongoose.connect( mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });

        logger.info( 'Databse connected successfully' );
    
    } catch (error: any) {
        logger.error( `Database Connection Error: ${error.stack}` );
        process.exit(1);
    }
};
