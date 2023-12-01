import { spawnSync } from 'node:child_process';
import { writeFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';

const command = process.argv[2];

const requestContextSetup = `
    const reqCtxSymbol = Symbol.for('__poc_request_context');
    const reqCtxAlsSymbol = Symbol.for('__poc_request_context_ALS');
 
    export async function setReqCtxAls() {
        try {
            const { AsyncLocalStorage } = await import('node:async_hooks');
            const als = new AsyncLocalStorage();
            globalThis[reqCtxAlsSymbol] = als;
        } catch {
            globalThis[reqCtxAlsSymbol] = null;
        }
    }

    export function runWithRequestContext(reqCtx, callback) {
        const als = globalThis[reqCtxAlsSymbol];
        if(als) {
            return als.run({ reqCtx }, callback);
        }
        console.warn('AsyncLocalStorage not found (no nodejs_compat set?), falling back to globalThis');
        globalThis[reqCtxSymbol] = reqCtx;
        return callback();
    }
`;

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
            import * as original from './__poc_index.js';
    
            ${requestContextSetup}

            await setReqCtxAls();

            export const onRequestDelete = original.onRequestDelete ?? undefined;
            export const onRequestHead = original.onRequestHead ?? undefined;
            export const onRequestPatch = original.onRequestPatch ?? undefined;
            export const onRequestPost = original.onRequestPost ?? undefined;

            export const onRequestGet = async ({ request, next, env }) => {
                return runWithRequestContext({ req: request, env, ctx: {} }, () => {
                    if(original.onRequestGet) {
                        return original.onRequestGet({ request, next, env });
                    } else {
                        return original.onRequest({ request, next, env });
                    }
                });
            };
            `
        );

        console.log(`\x1b[35m\n\n 🥴 POC lib updated pages functions entrypoint worker \n\n\x1b[0m`);
    } else {
            // Note: source maps aren't properly handled, we can consider it later

            writeFileSync(outputEntrypoint,
                `
                import originalExport from './__poc_index.js';

                ${requestContextSetup}

                await setReqCtxAls();

                export default {
                    fetch(req, env, ctx) {
                        return runWithRequestContext({ req, env, ctx }, () => {
                            return originalExport.fetch(req, env, ctx);
                        });
                    }
                }
                `
            );
        
            console.log(`\x1b[34m\n\n 🦾 POC lib updated entrypoint worker \n\n\x1b[0m`);
        }
    }