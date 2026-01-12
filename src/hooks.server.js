import '$lib/server/database/database.js';
import { getFromPassphrase } from '$lib/server/services/workspace.service.js';
import { error, redirect } from '@sveltejs/kit';
import { extractPayload } from '$lib/server/services/jws.service.js';

console.log('Initialized server...');

const publicRoutes = ['/', '/api/auth'];

function isPublicRoute(dest) {
	if (dest === '/') {
		return true;
	}

	return publicRoutes.some((route) => route !== '/' && dest.startsWith(route));
}

export async function handle({ event, resolve }) {
	if (isPublicRoute(event.url.pathname)) {
		return resolve(event);
	}

	const token = event.cookies.get('noted-authentication');

	const payload = extractPayload(token);

	if (!payload) {
		if(event.url.pathname.startsWith('/api')) {
			throw error(403, "You are unauthorized");
		} else throw redirect(303, '/');
	}

	const { passphrase } = payload.data;

	if (!passphrase) {
		event.cookies.delete('noted-authentication', { path: '/' });
	}

	const workspace = await getFromPassphrase(passphrase);

	event.locals.workspace = {
		...workspace,
		password: undefined
	};

	return resolve(event);
}
