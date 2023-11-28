import type { KVNamespace } from '@cloudflare/workers-types';

export type RequestContext = {
    req: any,
    env: { MY_KV: KVNamespace },
    ctx: any
};

// Note: the request context is stored on the global scope with a symbol
//       this is an implementation detail, it can use ALS, Greg's aviation utils
//       etc...

const reqCtxSymbol = Symbol.for('__poc_request_context');

globalThis[reqCtxSymbol] = null;

export function _setRequestContext(reqCtx: RequestContext) {
    globalThis[reqCtxSymbol] = reqCtx;
}

export function _getRequestContext(): RequestContext {
    return globalThis[reqCtxSymbol];
}
