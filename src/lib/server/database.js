import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import migrate from '$lib/server/database_migration.js';

const dbPath = dev ? 'notes-dev.db' : '/app/data/notes.db';

let db;

export function getDB() {
	if (!db) {
		// Create directory if needed
		const dir = dirname(dbPath);
		if (dir !== '.') {
			mkdirSync(dir, { recursive: true });
		}

		db = new Database(dbPath, {
			// verbose: dev ? console.log : undefined
		});

		db.pragma('journal_mode = WAL');
		db.pragma('user_version = 1');

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

		CREATE TABLE IF NOT EXISTS migrations (
			label TEXT PRIMARY KEY,
			run_at TEXT DEFAULT CURRENT_TIMESTAMP
		);
	
		CREATE INDEX IF NOT EXISTS idx_passphrase ON notes(passphrase);		
		`);

	migrate(database);
}

export default db;