declare global {
    interface Env {
    }
}

export type RequestContext = {
    req: any,
    // Note: here the MY_KV type is hardcoded, maybe we could do something clever
    //       and get the types correctly inferred in dev mode (with a dev cli option?)
    //       otherwise this env object could be a Record<string, Binding> or something
    //       like that
    env: Env,
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
