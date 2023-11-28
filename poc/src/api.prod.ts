import { _getRequestContext } from './api-shared.js';

export async function getRequestContext() {
    const reqCtx = _getRequestContext();

    if(!reqCtx) {
        // throw or anything we deem appropriate
    }

    return reqCtx;
}