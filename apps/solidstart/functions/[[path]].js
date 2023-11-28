
            import * as original from './__poc_index.js';
    
            export const onRequestDelete = original.onRequestDelete ?? undefined;
            export const onRequestHead = original.onRequestHead ?? undefined;
            export const onRequestPatch = original.onRequestPatch ?? undefined;
            export const onRequestPost = original.onRequestPost ?? undefined;

            export const onRequestGet = async ({ request, next, env }) => {
                const reqCtxSymbol = Symbol.for('__poc_request_context');
                const ctx = {};
                globalThis[reqCtxSymbol] = { req: request, env, ctx };
                if(original.onRequestGet) {
                    return original.onRequestGet({ request, next, env });
                } else {
                    return original.onRequest({ request, next, env });
                }
            };
            