import { _getRequestContext, _setRequestContext, type RequestContext } from './api-shared.js';

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