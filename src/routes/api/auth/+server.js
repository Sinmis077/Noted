import { generateJws } from '$lib/server/services/jws.service.js';
import { get } from '$lib/server/services/workspace.service.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { JWT_EXPIRY } from '$env/static/private';

export async function GET({ request }) {
	const token = request.headers.get('authorization');

	if (!token) {
		return error(401, 'Not authenticated');
	}

	return new Response();
}

export async function POST({ request, cookies }) {
	try {
		const workspace = await request.json();

		let dbWorkspace = await get(workspace);

		cookies.set('authentication', generateJws(dbWorkspace), {
			path: '/',
			expires: new Date(Date.now() + parseInt(JWT_EXPIRY)),
			sameSite: 'strict'
		});

		// noinspection ExceptionCaughtLocallyJS
		throw redirect(303, '/notes');
	} catch (err) {
		if (err.status === 303) throw err;

		throw fail(401, { error: 'Invalid passphrase' });
	}
}

export async function DELETE({ cookies }) {
	cookies.delete('authentication', { path: '/' });

	throw redirect(303, '/');
}
