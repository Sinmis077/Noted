import bcrypt from 'bcrypt';
import {
	deleteWorkspace,
	getWorkspace,
	saveWorkspace
} from '$lib/server/database/workspaces_repository.js';
import { error } from '@sveltejs/kit';

export async function get(workspace) {
	let dbWorkspace = getWorkspace(workspace);

	if (dbWorkspace && dbWorkspace.password) {
		if (await bcrypt.compare(workspace.password, dbWorkspace.password)) {
			return dbWorkspace;
		} else throw error(400, 'Some or all your credentials are incorrect.');
	} else if (dbWorkspace) {
		return dbWorkspace;
	}

	return workspace;
}

export async function getFromPassphrase(passphrase) {
	return passphrase ? ((await get({ passphrase })) ?? { passphrase }) : null;
}

export function save(workspace) {
	workspace.password = bcrypt.hashSync(workspace.password, 10);

	saveWorkspace(workspace);
}

export function remove(workspace) {
	let dbWorkspace = getWorkspace(workspace);

	if (dbWorkspace && dbWorkspace.password) {
		if (bcrypt.compare(workspace.password, dbWorkspace.password)) {
			deleteWorkspace(workspace);
		}
	}
}
