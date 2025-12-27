import db from '$lib/server/database.js';

export function getCategoriesByPassphrase(passphrase) {
	const stmt = db.prepare(`
		SELECT *
		FROM categories
		WHERE passphrase = ?;
	`);

	return stmt.all(passphrase)
}

export function saveCategory(workspace, category) {
	const stmt = db.prepare(`
		INSERT INTO categories (label,
														description,
														passphrase)
		VALUES (?, ?, ?)
		ON CONFLICT (passphrase, label) DO UPDATE SET label       = excluded.label,
																									description = excluded.description
		RETURNING *;
	`);

	return stmt.run(category.label, category.description, workspace.passphrase);
}

export function deleteCategory(workspace, label) {
	const stmt = db.prepare(`
		DELETE
		FROM categories
		WHERE label = ?
			AND passphrase = ?;
	`);

	const result = stmt.run(label, workspace.passphrase);
	return result.changes > 0
}