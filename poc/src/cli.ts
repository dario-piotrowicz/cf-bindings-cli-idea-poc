import { spawnSync } from 'node:child_process';

const command = process.argv[2];

if(command === 'build') {
    const buildCommand = process.argv[3];
    if(!buildCommand) {
        throw new Error('No build command provided');
    }

    spawnSync("pnpm", [buildCommand], { stdio: 'inherit' });

    console.log(`

        >>>>> get worker.js/index.js and wrap it in our own entrypoint

    `);
}