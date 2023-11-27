import { getRequestContext } from 'poc';

export default defineEventHandler(async (event) => {
    const { env } = await getRequestContext();

    const numOfKeys = (await env.MY_KV.list()).keys.length;

    return `The number of keys in env.MY_KV is: ${numOfKeys}`;
});