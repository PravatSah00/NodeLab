/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Manage booting the resourc
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import { connectDB } from "./database";


connectDB()
    .then(() => {
        // Stuff after connecting the database
    })