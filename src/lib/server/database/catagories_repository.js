import db from '$lib/server/database/database.js';

const getStmt = db.prepare(`
		SELECT *
		FROM categories
		WHERE passphrase = ?;
	`);

const saveStmt = db.prepare(`
		INSERT INTO categories (label,
														description,
														passphrase)
		VALUES (?, ?, ?)
			ON CONFLICT (passphrase, label) DO UPDATE SET
																					 description = excluded.description
																				 RETURNING *;
	`);

const deleteStmt = db.prepare(`
		DELETE
		FROM categories
		WHERE label = ?
			AND passphrase = ?;
	`);

export function getCategoriesByPassphrase(passphrase) {
	return getStmt.all(passphrase);
}

export function saveCategory(workspace, category) {
	return saveStmt.get(category.label, category.description, workspace.passphrase);
}

export function deleteCategory(workspace, label) {
	return deleteStmt.run(label, workspace.passphrase).changes > 0;
}