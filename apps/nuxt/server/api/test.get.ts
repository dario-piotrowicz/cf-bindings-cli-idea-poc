import { KVS } from 'poc';

export default defineEventHandler(async (event) => {
    const numOfKeys = (await KVS.MY_KV.list()).keys.length;
 
    return `The number of keys in env.MY_KV is: ${numOfKeys}`;
});
