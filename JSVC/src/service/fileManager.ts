/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Contain fileupload function
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import path from "path";

/**
 * File info interface
 */
interface FileInfo {
    success:  boolean,
    fileName: string,
    filePath: string,
    error:    any,
    
}

/**
 * Upload a file
 * @param uploadPath 
 * @param file 
 * @returns 
 */
export function fileSave( uploadDir: string, file: any ): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
        
        const uploadPath = path.join( uploadDir, file.name );
        
        file.mv(uploadPath, (error: any) => {
            
            if (error) {
                return reject({
                    success:  false,
                    fileName: file.name,
                    filePath: `${uploadPath}/${file.name}`,
                    error:    error.stack,
                });
            }

            resolve({
                success:  true,
                fileName: file.name,
                filePath: `${uploadPath}/${file.name}`,
                error:    null
            });
        });
    });
}