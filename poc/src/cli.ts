import { spawnSync } from 'node:child_process';
import { writeFileSync, renameSync } from 'node:fs';
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

    if(outputEntrypoint.endsWith(']].js')) {
        // it is a Pages function, I think we should not support this and get frameworks
        // to always produce standard worker.js dirs/files

        // we can however handle such files if we want, here I am handling it in a very
        // very quick and dirty way just for POCing the solution

        writeFileSync(outputEntrypoint,
            `
            import {
                onRequestDelete as originalOnRequestDelete,
                onRequestGet as originalOnRequestGet,
                onRequestHead as originalOnRequestHead,
                onRequestPatch as originalOnRequestPatch,
                onRequestPost as originalOnRequestPost
            } from './__poc_index.js';
    
            export const onRequestDelete = originalOnRequestDelete;
            export const onRequestHead = originalOnRequestHead;
            export const onRequestPatch = originalOnRequestPatch;
            export const onRequestPost = originalOnRequestPost;

            export const onRequestGet = async ({ request, next, env }) => {
                const reqCtxSymbol = Symbol.for('__poc_request_context');
                const ctx = {};
                globalThis[reqCtxSymbol] = { req: request, env, ctx };
                return originalOnRequestGet({ request, next, env });
            };
            `
        );

        console.log(`\x1b[35m\n\n 🥴 POC lib updated pages functions entrypoint worker \n\n\x1b[0m`);
    } else {
            // Note: source maps aren't properly handled, we can consider it later

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
            );
        
            console.log(`\x1b[34m\n\n 🦾 POC lib updated entrypoint worker \n\n\x1b[0m`);
        }
    }