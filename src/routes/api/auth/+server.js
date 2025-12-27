import { generateJws } from '$lib/services/jws.service.js';
import { get } from '$lib/services/workspace.service.js';
import { error } from '@sveltejs/kit';

export async function GET({ request })  {
	const token = request.headers.get('authorization');

	if(!token) {
		return error(401);
	}

	return new Response()
}

export async function POST({ request, setHeaders }) {
	const workspace = await request.json();

	let dbWorkspace = await get(workspace);

	setHeaders({ Authorization: `Bearer ${generateJws(dbWorkspace)}` });
	return new Response('Successfully authenticated');
}