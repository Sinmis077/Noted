import { getDB } from '$lib/server/database.js';

export function getNotesByPassphrase(passphrase) {
	const db = getDB();
	const stmt = db.prepare(`
	SELECT
		id,
		text,
		backgroundColor,
		isCompleted,
		createdAt,
		completedAt,
		note_order as "order"
	FROM notes
	WHERE passphrase = ?
	ORDER BY note_order ASC;
`);

	const rows = stmt.all(passphrase);

	return rows.map((row) => ({
		...row,
		isCompleted: Boolean(row.isCompleted)
	}));
}

export function saveNote(passphrase, note) {
	const db = getDB();
	const stmt = db.prepare(`
		INSERT INTO notes (id,
											 passphrase, text, backgroundColor, isCompleted,
											 createdAt, completedAt, note_order)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (passphrase, id) DO
		UPDATE SET
			text = excluded.text,
			backgroundColor = excluded.backgroundColor,
			isCompleted = excluded.isCompleted,
			completedAt = excluded.completedAt,
			note_order = excluded.note_order 
		RETURNING 
			id,
			text,
			backgroundColor,
			isCompleted,
			createdAt,
			completedAt,
			note_order as "order";
	`);

	let dbNote = stmt.get(
		note.id,
		passphrase,
		note.text,
		note.backgroundColor,
		note.isCompleted ? 1 : 0,
		note.createdAt,
		note.completedAt,
		note.order
	);

	return {
		...dbNote,
		isCompleted: Boolean(dbNote.isCompleted)
	};
}

export function deleteNote(passphrase, noteId) {
	const db = getDB();
	const stmt = db.prepare(`
		DELETE
		FROM notes
		WHERE passphrase = ?
			AND id = ?
	`);

	const result = stmt.run(passphrase, noteId);
	return result.changes > 0;
}

export function deleteNotes(passphrase) {
	const db = getDB();
	const stmt = db.prepare(`
	DELETE FROM notes
	WHERE passphrase = ?
	`);

	const result = stmt.run(passphrase);
	return result.changes > 0;
}

export function passphraseExists(passphrase) {
	const db = getDB();
	const stmt = db.prepare(`
		SELECT COUNT(*) as count
		FROM notes
		WHERE passphrase = ?
	`);

	const result = stmt.get(passphrase);
	return result.count > 0;
}