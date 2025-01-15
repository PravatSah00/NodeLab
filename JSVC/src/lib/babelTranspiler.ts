/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Transpilel ES6 code to commonJS code
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import * as babel from '@babel/core';


export default function babelTranspiler({ code }: { code: string }): string {

    // Transpile the ES module code to CommonJS using Babel
    const result = babel.transformSync(code, {
        presets: ['@babel/preset-env'],
    });

    // Ensure the result is defined and return the code
    if (!result || !result.code) {
        throw new Error( 'Babel failed to transpile the code.' );
    }

    return result.code;
}
