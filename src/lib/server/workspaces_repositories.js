import db from '$lib/server/database.js';

export function getWorkspace(workspace) {
	const stmt = db.prepare(`
		SELECT *
		FROM workspaces
		WHERE passphrase = ?;
	`);

	return stmt.get(workspace.passphrase);
}

export function saveWorkspace(workspace) {
	const stmt = db.prepare(`
		INSERT INTO workspaces (passphrase,
														description,
														password)
		VALUES (?, ?, ?)
		ON CONFLICT (passphrase) DO UPDATE SET description = excluded.description,
																					 password    = excluded.password
		RETURNING
			passphrase,
			description,
			password;
	`);

	return stmt.get(workspace.passphrase, workspace.description, workspace.password);
}

export function deleteWorkspace(workspace) {
	const stmt = db.prepare(`
		DELETE FROM workspaces
		WHERE passphrase = ?;
	`);

	return stmt.run(workspace.passphrase).changes > 0;
}
