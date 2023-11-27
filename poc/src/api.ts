import { Miniflare } from 'miniflare';
import type { KVNamespace } from '@cloudflare/workers-types';

const reqCtxSymbol = Symbol.for('__poc_request_context');

globalThis[reqCtxSymbol] = null;

export async function getRequestContext(): Promise<{req: any, env: { MY_KV: KVNamespace }, ctx: any}> {
    if(!globalThis[reqCtxSymbol]) {
        const mf = new Miniflare({
            modules: true,
            script: '',
            // the bindings should be read from a wrangler.toml file
            kvNamespaces: ['MY_KV']
        });

        globalThis[reqCtxSymbol] = {
            req: null,
            env: await mf.getBindings(),
            ctx: null,
        };
    }

    return globalThis[reqCtxSymbol];
}