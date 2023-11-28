import type { RequestHandler } from '@builder.io/qwik-city';
import { getRequestContext } from 'poc';
 
export const onGet: RequestHandler = async ({ json }) => {
  const { env } = await getRequestContext();
  const numOfKeys = (await env.MY_KV.list()).keys.length;

  json(200, { numOfKeys });
};

export const onPost: RequestHandler = async ({ json }) => {
  const { env } = await getRequestContext();
  await env.MY_KV.put("TEST_KEY", "test value");
  json(200, { success: true });
};