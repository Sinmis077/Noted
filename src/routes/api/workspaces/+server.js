import { error, json } from '@sveltejs/kit';
import { save } from '$lib/server/services/workspace.service.js';

export async function POST({ request, locals }) {
	const { description, password } = await request.json();

	if (!description) throw error(400, 'Missing description');

	const workspace = locals.workspace;
	workspace.description = description;
	workspace.password = password;

	save(workspace);

	return json({
		...workspace,
		password: undefined
	});
}
