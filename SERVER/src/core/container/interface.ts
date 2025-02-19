/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Provide container related interface
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

/**
 * Interface of container info
 */
export interface ContainerInfo {
    id:         string,
    name:       string,
    status:     string,
    created:    string,
    privateIP:  string,
    startedAt:  string,
    finishedAt: string,
}