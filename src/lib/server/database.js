import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import migrate from '$lib/server/database_migration.js';

const dbPath = dev ? 'notes-dev.db' : '/app/data/notes.db';

// Create directory if needed
const dir = dirname(dbPath);
if (dir !== '.') {
	mkdirSync(dir, { recursive: true });
}

console.log("Initializing database...");

const db = new Database(dbPath, {
	verbose: dev ? console.log : undefined
});

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

if(db.pragma('user_version', { simple: true }) === null) {
	db.pragma('user_version = 2');
}

db.exec(`
	CREATE TABLE IF NOT EXISTS workspaces
	(
		passphrase TEXT PRIMARY KEY,
		description TEXT,
		password   TEXT
	);

	CREATE TABLE IF NOT EXISTS categories
	(
		label      TEXT PRIMARY KEY,
		description TEXT,
		passphrase TEXT REFERENCES workspaces (passphrase)
	);

	CREATE TABLE IF NOT EXISTS notes
	(
		id              TEXT PRIMARY KEY,
		passphrase      TEXT    NOT NULL REFERENCES workspaces (passphrase),
		text            TEXT    NOT NULL,
		backgroundColor TEXT    NOT NULL,
		isCompleted     INTEGER NOT NULL DEFAULT 0,
		createdAt       TEXT    NOT NULL,
		completedAt     TEXT,
		note_order      INTEGER NOT NULL,
		category_label  TEXT             DEFAULT null REFERENCES categories (label),
		UNIQUE (passphrase, id)
	);

	CREATE TABLE IF NOT EXISTS migrations
	(
		label  TEXT PRIMARY KEY,
		run_at TEXT DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_passphrase ON notes (passphrase);
`);

migrate(db);

export default db;
