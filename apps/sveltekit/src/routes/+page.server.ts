import { getRequestContext } from "poc";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return {
		text: await getText(),
	};
};

async function getText() {
	try {
		const { env } = await getRequestContext();
	
		const numOfKeys = (await env.MY_KV.list()).keys.length;
	
		return `The number of keys in MY_KV is: ${numOfKeys}`;
	} catch {
		return 'ERROR: Could not access MY_KV!';
	}
}