import { getRequestContext } from 'poc';

export default defineEventHandler(async (event) => {
    try {
        const { env } = await getRequestContext();

        const numOfKeys = (await env.MY_KV.list()).keys.length;
    
        return `The number of keys in MY_KV is: ${numOfKeys}`;
    } catch {
        return 'ERROR: Could not access MY_KV!';
    }
});