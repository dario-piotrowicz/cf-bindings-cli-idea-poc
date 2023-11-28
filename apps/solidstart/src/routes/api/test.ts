import { json } from "solid-start";
import { getRequestContext } from 'poc';

export async function GET() {
  const { env } = await getRequestContext();
  return json({ kv: await env.MY_KV.get("TEST_KEY") });
}

export async function POST() {
  const { env } = await getRequestContext();
  env.MY_KV.put("TEST_KEY", "test value");
  return json({ success: true });
}
