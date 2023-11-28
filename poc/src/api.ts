import type { KVNamespace } from '@cloudflare/workers-types';

const reqCtxSymbol = Symbol.for('__poc_request_context');

export async function getRequestContext(): Promise<{req: any, env: { MY_KV: KVNamespace }, ctx: any}> {
    return globalThis[reqCtxSymbol];
}