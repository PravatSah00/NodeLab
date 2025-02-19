/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Cashe the active containers
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import CacheHandler from "@libs/cacheHandler";
import { ContainerInfo } from "./interface";

/**
 * Cache container actively in memory for performace boost
 */
class ContainerCache extends CacheHandler<ContainerInfo> {}


export default new ContainerCache();
