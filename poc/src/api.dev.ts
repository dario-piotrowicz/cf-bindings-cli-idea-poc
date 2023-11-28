import type { KVNamespace } from '@cloudflare/workers-types';

const reqCtxSymbol = Symbol.for('__poc_request_context');

globalThis[reqCtxSymbol] = null;

export async function getRequestContext(): Promise<{req: any, env: { MY_KV: KVNamespace }, ctx: any}> {
    if(!globalThis[reqCtxSymbol]) {
      // Note: this should be tree shaken for prod builds
      // but seems not to be for frameworks using vite
      // if(process.env.NODE_ENV === 'development') {
      const { Miniflare } = await import('miniflare');
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
      // } else {
      //     throw new Error('reqCtx not set!');
      // }
    }

    return globalThis[reqCtxSymbol];
}