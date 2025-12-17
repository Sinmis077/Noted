import { writable } from 'svelte/store';
import { api } from '$lib/utils/api.js';

const COLORS = [
	'bg-powder-blush',
	'bg-apricot-cream',
	'bg-cream',
	'bg-tea-green',
	'bg-electric-aqua',
	'bg-baby-blue-ice',
	'bg-periwinkle',
	'bg-mauve',
];

function generateId() {
	return Date.now().toString(36);
}

function randomBackgroundColor() {
	return COLORS[Math.floor(((Math.random() + Math.random() + Math.random()) % 1) * COLORS.length)];
}

function createNotesStore() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,

		loadNotes: async () => {
			try {
				const { data } = await api.get('/notes', { params: { status: 'unfinished' } });
				set(data);
			} catch (err) {
				set([]);
				throw err;
			}
		},

		loadFinishedNotes: async () => {
			try {
				const { data } = await api.get('/notes', { params: { status: 'finished' } });
				set(data);
			} catch (err) {
				set([]);
				throw err;
			}
		},

		addNote: async (text) => {
			let currentLength = 0;
			update((notes) => {
				currentLength = notes.length;
				return notes;
			});

			const newNote = {
				id: generateId(),
				text,
				backgroundColor: randomBackgroundColor(),
				isCompleted: false,
				createdAt: new Date().toISOString(),
				completedAt: null,
				order: currentLength
			};

			try {
				const { data } = await api.post('/notes', newNote);

				update((notes) => [data, ...notes]);
			} catch (err) {
				throw err;
			}
		},

		editNote: async (note) => {
			try {
				const { data } = await api.put(`/notes/${note.id}`, note);

				update((notes) => notes.map((oldNote) => (oldNote.id === note.id ? data : oldNote)));
			} catch (err) {
				throw err;
			}
		},

		deleteNote: async (id) => {
			try {
				await api.delete(`/notes/${id}`);

				update((notes) => notes.filter((note) => note.id !== id));
			} catch (err) {
				throw err;
			}
		},

		toggleNoteComplete: async (id) => {
			let noteToUpdate = null;
			update((notes) => {
				noteToUpdate = notes.find((note) => note.id === id);
				return notes;
			});

			if (!noteToUpdate) {
				return;
			}

			const updatedNote = {
				...noteToUpdate,
				isCompleted: !noteToUpdate.isCompleted,
				completedAt: !noteToUpdate.isCompleted ? new Date().toISOString() : null
			};

			try {
				const { data } = await api.put(`/notes/${id}`, updatedNote);

				update((notes) => notes.map((note) => (note.id === id ? data : note)));
			} catch (err) {
				throw err;
			}
		},

		clearAll: async () => {
			try {
				await api.delete(`/notes`);
				update(() => {
					return [];
				});
			} catch (err) {
				throw err;
			}
		}
	};
}

export const notes = createNotesStore();
