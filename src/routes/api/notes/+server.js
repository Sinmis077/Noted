import { error, json } from '@sveltejs/kit';
import {
	deleteNotes,
	getNotesByPassphrase,
	saveNote
} from '$lib/server/database/notes_repository.js';

export async function GET({ locals }) {
	const passphrase = locals.workspace.passphrase;

	if (!passphrase) {
		return json([]);
	}

	try {
		let notes = getNotesByPassphrase(passphrase);

		return json(notes);
	} catch (err) {
		throw error(500, 'Failed to get notes from the database: ' + err.message);
	}
}

export async function POST({ request, locals }) {
	const { passphrase } = await locals.workspace;

	if (!passphrase) {
		throw error(401, 'No passphrase provided. Please set a passphrase first');
	}

	const note = await request.json();

	if (!note.id || !note.text) {
		throw error(400, 'Invalid note data');
	}

	const savedNote = saveNote(passphrase, note);

	return json(savedNote, { status: 201 });
}

export async function DELETE({ locals }) {
	const passphrase = locals.workspace.passphrase;

	if (!passphrase) {
		throw error(401, 'No passphrase provided');
	}

	const success = deleteNotes(passphrase);

	if (!success) {
		throw error(404, `Couldn't find the notes`);
	}

	return new Response(null, { status: 204 });
}
