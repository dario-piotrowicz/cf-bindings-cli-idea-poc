import type { RequestHandler } from '@builder.io/qwik-city';
import { getRequestContext } from 'poc';
 
export const onGet: RequestHandler = async ({ json }) => {
  const { env } = await getRequestContext();
  const value = await env.MY_KV.get("TEST_KEY");
  json(200, { value });
};

export const onPost: RequestHandler = async ({ json }) => {
  const { env } = await getRequestContext();
  await env.MY_KV.put("TEST_KEY", "test value");
  json(200, { success: true });
};