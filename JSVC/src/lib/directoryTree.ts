/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Get the tree structor of a directory
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

/**
 * Interface of node of the tree
 */
interface TreeNode {
    name: string,
    path: string,
    type: string,
    children: Array<TreeNode>
}

/**
 * Declear empty node
 */
const EMPTY_NODE: TreeNode = {
    name: '',
    path: '',
    type: '',
    children: []
};

/**
 * Function to get the tree structure of a folder
 * @param folderPath path of the folder
 * @returns 
 */
function getDirTreeActual( folderPath: string, basePath: string ): TreeNode {
    
    const stats = fs.statSync( folderPath );

    // Check for the leaf node
    if ( stats.isFile() ) {
        
        // Return leaf node
        return {
            type: 'file',
            name: path.basename( folderPath ),
            path: path.relative(basePath, folderPath),
            children: []
        };
    }

    // Check for the directory node
    if ( stats.isDirectory() ) {
        
        // Read folder content
        const folderContent = fs.readdirSync( folderPath );
       
        // Return the node
        return {
            type: 'directory',
            name: path.basename( folderPath ),
            path: path.relative(basePath, folderPath),
            children: folderContent.map( subFolder => {
                // Get the full path of the subfolder
                const fullPath = path.join(folderPath, subFolder );
                
                // Recursively call 
                return getDirTreeActual( fullPath, basePath ); 
            })
        }
    }

    // Return a empty node
    return EMPTY_NODE;
}

/**
 * Get the dir tree of a folder
 * @param folderPath path of a folder
 * @returns 
 */
export default function getDirTree( folderPath: string ): TreeNode {
    return getDirTreeActual( folderPath, folderPath );
} 
