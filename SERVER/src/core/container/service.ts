/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Provide container service
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import containerCache from './cache';
import { findContainer, insertContainerDb } from './database';
import { createDockerContainer } from './docker';

/**
 * Create a new container for user
 * Remove old container assign to the same user
 * @param userId id of user the container assign
 */
export async function createContainer( userId: number ) {
    
    // Create docker container
    const containerInfo = await createDockerContainer( `container-${userId}` );

    // Store container into cache
    containerCache.set( containerInfo.name, containerInfo );

    // Store container into database
    insertContainerDb( userId, containerInfo );
}

/**
 * Remove a container assign to user
 * @param userId id of user the container assign
 */
export async function removeContainer( userId: number ) {

    // Get the container's id assing to the user
    const containeId = await getContainerId( userId );

    // Check container exist or not
    if ( ! containeId ) return;

    // Remove

}

/**
 * Get the container's id assign to user
 * @param userId id of user the container assign
 * @returns 
 */
export async function getContainerId( userId: number ): Promise< string | null > {
    
    // Prepare container name
    const containerName = `container-${userId}`;

    // Get the container from cache
    const cacheContainer = containerCache.get( containerName );

    // Check the contaienr exist in cache
    if ( cacheContainer ) return cacheContainer.id;

    // Get the container from database
    const dbContainer = await findContainer({ name: containerName } );

    // Check the container exist in database
    if ( dbContainer ) return dbContainer.containerId;

    return null;
}
