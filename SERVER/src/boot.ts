/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Manage booting the resourc
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import { connectDB } from "@config/database";
import { connectDocker } from "@config/docker";

/**
 * Boot the application
 */
async function boot() {
    
    /**
     * Connect with database
     */
    await connectDB();

    /**
     * Connect with docker
     */
    await connectDocker();
}

boot();