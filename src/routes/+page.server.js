import { redirect } from '@sveltejs/kit';
import { get } from '$lib/server/services/workspace.service.js';
import { generateJws } from '$lib/server/services/jws.service.js';
import { JWT_EXPIRY } from '$env/static/private';

export async function load({ locals }) {
	if (locals.workspace?.passphrase) {
		throw redirect(303, '/notes');
	}
}

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const workspace = {
			passphrase: formData.get('passphrase'),
			password: formData.get('password')
		};

		let dbWorkspace = await get(workspace);

		cookies.set('authentication', generateJws(dbWorkspace), {
			path: '/',
			expires: new Date(Date.now() + parseInt(JWT_EXPIRY)),
			sameSite: 'strict'
		});

		throw redirect(303, '/notes');
	}
};