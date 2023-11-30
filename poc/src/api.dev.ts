import { KVNamespace } from '@cloudflare/workers-types';
import { _getRequestContext, _setRequestContext, type RequestContext } from './api-shared.js';

let kvs: Record<string, KVNamespace> = {};

export async function getRequestContext(): Promise<RequestContext> {
    // Note: this is hardcoded here, in theory it would be read from a toml file
    const kvsNames = ['MY_KV'];

    const reqCtx = _getRequestContext();

    if(!reqCtx) {
        const { Miniflare } = await import('miniflare');
        const mf = new Miniflare({
            modules: true,
            script: '',
            // the bindings should be read from a wrangler.toml file
            kvNamespaces: kvsNames
        });
    
        const bindings = await mf.getBindings();

        for(const kvName of kvsNames) {
            kvs[kvName] = bindings[kvName] as any;
        }

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

await getRequestContext();

export const KVS = kvs;