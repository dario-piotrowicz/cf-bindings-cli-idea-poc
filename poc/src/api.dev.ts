import type { RequestContext } from './api-shared.js';

// Note: the request context in dev mode is stored in the global scope, this is totally fine
//       since the dev server runs in a standard nodejs process.
//       This doesn't use AsyncLocalStorage because in dev mode we don't have
//       a clean/unobtrusive way of entering the ALS as we do in production.

const reqCtxSymbol = Symbol.for('__poc_request_context');

globalThis[reqCtxSymbol] = null;

function _setRequestContext(reqCtx: RequestContext) {
    globalThis[reqCtxSymbol] = reqCtx;
}

function _getRequestContext(): RequestContext {
    return globalThis[reqCtxSymbol];
}

export async function getRequestContext(): Promise<RequestContext> {
    const reqCtx = _getRequestContext();

    if(!reqCtx) {
        const { getBindingsProxy } = await import('wrangler');
        const { bindings } = await getBindingsProxy();
    
        const newReqCtx: RequestContext = {
            req: null,
            env: bindings as any,
            ctx: null,
        };

        _setRequestContext(newReqCtx);
        return _getRequestContext();
    }

    return reqCtx;
}