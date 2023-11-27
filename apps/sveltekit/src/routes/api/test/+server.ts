import { getRequestContext } from 'poc';

export async function GET() {
  const { env } = await getRequestContext();
  const numOfKeys = (await env.MY_KV.list()).keys.length;

  // return success
  return new Response(JSON.stringify({ numOfKeys }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function POST() {
  const { env } = await getRequestContext();
  await env.MY_KV.put("TEST_KEY", "test value from bindings");

  // return success
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}