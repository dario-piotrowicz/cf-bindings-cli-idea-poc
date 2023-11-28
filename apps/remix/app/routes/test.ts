import { json } from "@remix-run/cloudflare";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { getRequestContext } from 'poc';

export const loader: LoaderFunction = async () => {
  const { env } = await getRequestContext();
  const value = await env.MY_KV.get("TEST_KEY");
  return json({ value });
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const { env } = await getRequestContext();
    await env.MY_KV.put(`TEST_KEY`, "test value");
    return json({ success: true });
  }
};
