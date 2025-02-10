/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Socket service for helth and inviroment related stream
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import { Server } from "socket.io";
import { httpServer } from "./apiService";
import LogHandler from "../lib/LogHandler";


/**
 * Initialize Socket.IO and attach it to the HTTP server
 */
const socketIo = new Server( httpServer, {
    cors: {
        origin: "*",  // Allow all origins
    },
});

/**
 * Handle user connection
 */
socketIo.on( 'connection' , ( socket ) => {
    
    LogHandler.log( { log: `User[${socket.id}] connection via socket successfull` } );
  
    /**
     * Handle user disconnect
     */
    socket.on( 'disconnect', () => {
        LogHandler.log( { log: `User[${socket.id}] disconnected from socket server` } );
    });

});

/**
 * Function to emit events from anywhere in your app
 * @param event 
 * @param data s
 */
export const emitEvent = ( event: string, data: any ) => {
    if ( socketIo ) {
        socketIo.emit( event, data );
    }
};