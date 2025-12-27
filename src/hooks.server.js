import '$lib/server/database.js';
import { getFromPassphrase } from '$lib/services/workspace.service.js';
import { error } from '@sveltejs/kit';
import { extractPayload, isAuthenticated } from '$lib/services/jws.service.js';

console.log('Initialized server...')

export async function handle({ event, resolve }) {
	if(await event.url.pathname === "/api/auth") return await resolve(event);

	const request = await event.request;

	const authHeader = await request.headers.get('authorization');

	const token = authHeader?.substring(7);

	if (!isAuthenticated(token)) {
		return error(401, 'Unauthorized');
	} else {
		const { passphrase } = extractPayload(token);

		const workspace = await getFromPassphrase(passphrase);
		workspace.password = '';

		event.locals.workspace = workspace;

		return await resolve(event);
	}
}