import { json, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getRequestContext } from 'poc';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const { env } = await getRequestContext();
  const numOfKeys = (await env.MY_KV.list()).keys.length;

  return json({ numOfKeys });
};

export default function Index() {
  const { numOfKeys } = useLoaderData<typeof loader>();
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <h2>numOfKeys = {numOfKeys}</h2>
    </div>
  );
}
