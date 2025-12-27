import db from '$lib/server/database.js';

export function getWorkspace(workspace) {
	const stmt = db.prepare(`
		SELECT passphrase, description
		FROM workspaces
		WHERE passphrase = ?
			AND password = ?;
	`);

	return stmt.run(workspace.passphrase, workspace.password);
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
			description;
	`);

	return stmt.run(workspace.passphrase, workspace.description, workspace.password);
}

export function deleteWorkspace(workspace) {
	const stmt = db.prepare(`
		DELETE FROM workspaces
		WHERE passphrase = ?
		AND password = ?;
	`);

	return stmt.run(workspace.passphrase, workspace.password).changes > 0;
}
