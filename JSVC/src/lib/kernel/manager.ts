import babelTranspiler from "../babelTranspiler";
import VirtualEnv from "./parent-process";

/**
 * Define new virtual run time.
 */
const virtualRuntime = new VirtualEnv();
export default virtualRuntime;

/**
 * Execute a code in virtual run time.
 */
export async function execute( code: string ) {

    // Transpile code of ES6 to commonJS
    const transpiledCode = babelTranspiler( { code: code } );

    // Execute code in vm;
    const output = virtualRuntime.run( transpiledCode );

    return output;
}

/**
 * Reset the vm context
 */
export async function reset() {
    await virtualRuntime.hardReset();
}