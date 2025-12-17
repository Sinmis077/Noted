import { error, json } from '@sveltejs/kit';
import { deleteNotes, getNotesByPassphrase, saveNote, getFinishedNotesByPassphrase } from '$lib/server/notes_repository.js';

export async function GET({ cookies }) {
	const passphrase = cookies.get('passphrase');

	if (!passphrase) {
		return json([]);
	}

	try {
		let notes = getNotesByPassphrase(passphrase);

		return json(notes);
	} catch (err) {
		throw error(500, 'Failed to get notes from the database');
	}
}

export async function POST({ request, cookies }) {
	const passphrase = cookies.get('passphrase');

	if (!passphrase) {
		throw error(401, 'No passphrase provided. Please set a passphrase first');
	}

	try {
		const note = await request.json();

		if (!note.id || !note.text) {
			throw error(400, 'Invalid note data');
		}

		const savedNote = saveNote(passphrase, note);

		return json(savedNote, { status: 201 });
	} catch (err) {
		if (err.status) throw err;

		throw error(500, 'Failed to create note');
	}
}

export async function DELETE({ cookies }) {
	const passphrase = cookies.get('passphrase');

	if (!passphrase) {
		throw error(401, 'No passphrase provided');
	}

	try {
		const success = deleteNotes(passphrase);

		if (!success) {
			throw error(404, `Couldn't find the notes`);
		}

		return new Response(null, { status: 204 });
	} catch (err) {
		if (err.status) throw err;

		throw error(500, 'Failed to delete notes');
	}
}
