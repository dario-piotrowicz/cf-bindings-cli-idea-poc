
            import * as original from './__poc_index.js';
    
            
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
            