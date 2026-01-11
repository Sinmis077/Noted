import { error, json } from '@sveltejs/kit';
import {
	deleteNotes,
	getNotesByPassphrase,
	getNotesByPassphraseAndCategory,
	saveNote
} from '$lib/server/database/notes_repository.js';

export async function GET({ url, locals }) {
	const passphrase = locals.workspace.passphrase;
	const params = url.searchParams;

	if (!passphrase) {
		return json([]);
	}

	try {
		let notes = [];

		if (!params || params.get('category') === 'to-dos') {
			notes = getNotesByPassphrase(passphrase).filter(note => note.isCompleted === false);
		} else if(params.get('category') !== 'completed') {
			notes = getNotesByPassphraseAndCategory(passphrase, params.get('category'));
		} else {
			if (notes.length > 0) {
				notes = notes.filter((note) => note.isCompleted === params?.get('completed'));
			} else {
				notes = getNotesByPassphrase(passphrase).filter(
					(note) =>
						note.isCompleted === (params?.get('completed') ?? params?.get('category') !== null)
				);
			}
		}

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

	if (!note.text) {
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
