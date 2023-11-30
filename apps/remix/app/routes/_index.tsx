import { type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getRequestContext } from 'poc';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
	try {
		const { env } = await getRequestContext();
	
		const numOfKeys = (await env.MY_KV.list()).keys.length;
	
		return `The number of keys in MY_KV is: ${numOfKeys}`;
	} catch {
		return 'ERROR: Could not access MY_KV!';
	}
};

export default function Index() {
  const text = useLoaderData<typeof loader>();
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <h2>{text}</h2>
    </div>
  );
}
