
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
            