import "./boot";

// import os from "os";

// const totalRAM = os.totalmem(); // Total system RAM
// const freeRAM = os.freemem();   // Available (free) RAM

// console.log(`Total RAM: ${(totalRAM / 1024 / 1024).toFixed(2)} MB`);
// console.log(`Free RAM: ${(freeRAM / 1024 / 1024).toFixed(2)} MB`);


import { createContainer } from "@core/container/service";
import { getDockerContainer } from "@core/container/docker";

const start = async () => {
    // await createContainer( 1 );
    // await createContainer( 2 );
    // await createContainer( 3 );

    const info = getDockerContainer( 'container-1' );
    console.log( info );
}

// start();