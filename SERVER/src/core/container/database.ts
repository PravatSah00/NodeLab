/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Handle database operation for container
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import logger from "@utils/logger";
import ContainerModel, { IContainer } from "@models/container.model";
import { ContainerInfo } from "./interface";
import { RootFilterQuery } from "mongoose";

/**
 * @param uid id of the user container assign to
 * @param cinfo Container information
 * Insert a new container in database
 */
export async function insertContainerDb( userId: number, cinfo: ContainerInfo ) {
    try {
        const container = new ContainerModel({
            userId:      userId,
            containerId: cinfo.id,
            name:        cinfo.name,
            status:      cinfo.status,
            IPAddress:   cinfo.IPAddress,
            createdAt:   cinfo.created,
            startedAt:   cinfo.startedAt,
            finishedAt:  cinfo.finishedAt,
        });

        const containerDocument = await container.save();

        return containerDocument.toObject();
        
    } catch ( error: any ) {
        logger.error( `Unable to insert container in database: ${error.stack}`);
    }
}

/**
 * Find a container by its id
 * @param containeId contaienr's id
 * @returns 
 */
export async function findContainerById( containeId: string ) {
    try{
        const container = await ContainerModel.findById( containeId );
        
        return container?.toObject();

    } catch( error: any ) {
        logger.error( `Unable to find container in database: ${error.stack}`);
    }
}

/**
 * Find a single container by filter 
 * @param filter filter object
 * @returns 
 */
export async function findContainer( filter: RootFilterQuery<IContainer> ) {
    try{
        const container = await ContainerModel.findOne( filter );
        
        return container?.toObject();

    } catch( error: any ) {
        logger.error( `Unable to find container in database: ${error.stack}`);
    }
}

/**
 * Find multiple containers
 * @param filter filter object
 * @returns 
 */
export async function findContainers(filter: RootFilterQuery<IContainer>) {
    try{
        const containers = await ContainerModel.find( filter );
        
        return containers?.map( ( container ) => container.toObject() );

    } catch( error: any ) {
        logger.error( `Unable to find container in database: ${error.stack}`);
    }
}
