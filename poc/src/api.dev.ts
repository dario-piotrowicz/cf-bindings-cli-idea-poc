import { _getRequestContext, _setRequestContext, type RequestContext } from './api-shared.js';

export async function getRequestContext(): Promise<RequestContext> {
    const reqCtx = _getRequestContext();

    if(!reqCtx) {
        const { Miniflare } = await import('miniflare');
        const mf = new Miniflare({
            modules: true,
            script: '',
            // the bindings should be read from a wrangler.toml file
            kvNamespaces: ['MY_KV']
        });
    
        const newReqCtx: RequestContext = {
            req: null,
            env: await mf.getBindings(),
            ctx: null,
        };

        _setRequestContext(newReqCtx);
        return _getRequestContext();
    }

    return reqCtx;
}