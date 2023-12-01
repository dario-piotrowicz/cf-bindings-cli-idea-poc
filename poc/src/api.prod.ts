import type { RequestContext } from './api-shared.js';
import type { AsyncLocalStorage } from "node:async_hooks";

// Note: in production we want to rely on AsyncLocalStorage as that is the only proper way to store
//       the request context in a robust and reliable manner, this does however require nodejs_compat,
//       so we do check, if we cannot get a hold of an AsyncLocalStorage (no nodejs_compat flag set)
//       then we do fallback on storing the request context on the global scope, it is not as robust
//       and it might produce issue, but it should work reasonably well

type ALS = AsyncLocalStorage<{
    reqCtx: RequestContext
}>;

const reqCtxSymbol = Symbol.for('__poc_request_context');
const reqCtxAlsSymbol = Symbol.for('__poc_request_context_ALS');

export async function setReqCtxAls() {
    try {
        const nodeAsync = 'node:async_hooks';
        const { AsyncLocalStorage } = await import(nodeAsync);
        const als: ALS = new AsyncLocalStorage();
        (globalThis as any)[reqCtxAlsSymbol] = als;
    } catch {
        (globalThis as any)[reqCtxAlsSymbol] = null;
    }
}

export function runWithRequestContext<T>(reqCtx: RequestContext, callback: () => T): T {
    const als: ALS = (globalThis as any)[reqCtxAlsSymbol];
    if(als) {
        return als.run({ reqCtx }, callback);
    }
    console.warn('AsyncLocalStorage not found (no nodejs_compat set?), falling back to globalThis');
    (globalThis as any)[reqCtxSymbol] = reqCtx;
    return callback();
}

export function getRequestContext(): RequestContext {
    const als: ALS = (globalThis as any)[reqCtxAlsSymbol];
    if(!als) {
        // nodejs_compat not set
        return (globalThis as any)[reqCtxSymbol];
    }
    const store = als.getStore();
    if(store) {
        return store.reqCtx;
    }
    throw new Error('Could not access the AsyncLocalStorage store');
}
