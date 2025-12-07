import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = dev ? 'notes-dev.db' : '/app/data/notes.db';

let db;

function getDB() {
	if (!db) {
		// Create directory if needed
		const dir = dirname(dbPath);
		if (dir !== '.') {
			mkdirSync(dir, { recursive: true });
		}

		db = new Database(dbPath, {
			verbose: dev ? console.log : undefined
		});

		db.pragma('journal_mode = WAL');
		initializeDB();
	}
	return db;
}

function initializeDB() {
	const database = getDB();
	database.exec(`
		CREATE TABLE IF NOT EXISTS notes (
			id TEXT PRIMARY KEY,
			passphrase TEXT NOT NULL,
			text TEXT NOT NULL,
			backgroundColor TEXT NOT NULL,
			isCompleted INTEGER NOT NULL DEFAULT 0,
			createdAt TEXT NOT NULL,
			completedAt TEXT,
			note_order INTEGER NOT NULL,
			UNIQUE(passphrase, id)
		);

		CREATE INDEX IF NOT EXISTS idx_passphrase ON notes(passphrase);		
		`);
}

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