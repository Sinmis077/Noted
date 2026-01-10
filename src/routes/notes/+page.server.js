import { getCategoriesByPassphrase } from '$lib/server/database/catagories_repository.js';

export async function load({ locals }) {
	return {
		categories: getCategoriesByPassphrase(locals.workspace.passphrase),
		workspace: {
			...locals.workspace,
			password: undefined
		}
	};
}