/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Provide container utils
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import os from 'os';
import { docker } from "@config/docker";
import logger from "@utils/logger";
import config from "@utils/config";

import { ContainerInfo } from './interface';

/**
 * Check docker is running or not
 */
export async function checkDockerConnection() {
    // Check docker is running or not
    try {
        await docker.ping();
    } catch( error: any ) {
        logger.error( `Unable to connect with docker: ${error.stack}` );
        throw error;
    }
}

/**
 * Monitor the containers status
 */
export async function monitorDockerContainers() {
    
}

/**
 * Span a new container
 * @param name unique name of the container
 */
export async function createDockerContainer( name: string ): Promise<ContainerInfo> {

    // Check docker is running or not
    checkDockerConnection();

    // Get the image name and network name
    const IMAGE   = config.get('dockerConfig.image') as string;
    const NETWORK = config.get('dockerConfig.network') as string;
    
    try {

        // Create container
        const container = await docker.createContainer({
            Image:  IMAGE,
            name:   name,
            Labels: {
                name: name,
            },
            HostConfig: {
                // Network settings
                NetworkMode: NETWORK,

                // CPU settings
                CpuShares:  config.get('dockerConfig.CpuShares') as number,
                CpuQuota:   config.get('dockerConfig.CpuQuota') as number,
                CpuPeriod:  config.get('dockerConfig.CpuPeriod') as number,

                // Memory settings
                Memory:     config.get('dockerConfig.Memory') as number * 1024 * 1024,
                MemorySwap: config.get('dockerConfig.MemorySwap') as number,
            },
        });
  
        // Start the container
        await container.start();
        logger.info(`Container [${name}] started with ID: ${container.id}`);

        // Return info of newly created container
        const info = await container.inspect();

        return {
            id:         info.Id,
            name:       info.Name,
            created:    info.Created,
            status:     info.State.Status,
            startedAt:  info.State.StartedAt,
            finishedAt: info.State.FinishedAt,
            privateIP:  info.NetworkSettings.Networks[NETWORK].IPAddress,
        }
  
    } catch ( error: any ) {
        logger.error(`Unable to start container [${name}] : ${error.stack}`);
        throw new Error( 'Unable to create container' );
    }
}

/**
 * Cleanup container before create a new container if needed
 */
export async function preCleanupDockerContainer() {
    
}