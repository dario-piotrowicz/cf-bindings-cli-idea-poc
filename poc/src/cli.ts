import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';

const command = process.argv[2];

if(command === 'build') {
    const buildCommand = process.argv[3];
    if(!buildCommand) {
        throw new Error('No build command provided');
    }

    const outputEntrypoint = process.argv[4];
    if(!outputEntrypoint) {
        throw new Error('No output entrypoint provided');
    }

    spawnSync("pnpm", [buildCommand], { stdio: 'inherit' });

    renameSync(outputEntrypoint, join(dirname(outputEntrypoint), '__poc_index.js'));

    writeFileSync(outputEntrypoint,
        `
        import originalExport from './__poc_index.js';

        export default {
            fetch(req, env, ctx) {
                const reqCtxSymbol = Symbol.for('__poc_request_context');
                globalThis[reqCtxSymbol] = { req, env, ctx };

                return originalExport.fetch(req, env, ctx);
            }
        }
        `
    )
}