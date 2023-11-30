import { getRequestContext } from "poc";
import { createResource } from "solid-js";

export default function Home() {
  
  const [text] = createResource(async () => {
    try {
    	const { env } = await getRequestContext();
    
    	const numOfKeys = (await env.MY_KV.list()).keys.length;
    
    	return `The number of keys in MY_KV is: ${numOfKeys}`;
    } catch {
    	return 'ERROR: Could not access MY_KV!';
    }
  });

  return (
    <main>
      <h1>{text()}</h1>
    </main>
  );
}
