import { writable } from 'svelte/store';
import { api } from '$lib/utils/api.js';

const COLORS = [
	'bg-red-200 dark:bg-red-600',
	'bg-amber-200 dark:bg-amber-600',
	'bg-orange-200 dark:bg-orange-600',
	'bg-yellow-200 dark:bg-yellow-600',
	'bg-lime-200 dark:bg-lime-600',
	'bg-green-200 dark:bg-green-600',
	'bg-emerald-200 dark:bg-emerald-600',
	'bg-teal-200 dark:bg-teal-600',
	'bg-cyan-200 dark:bg-cyan-600',
	'bg-sky-200 dark:bg-sky-600',
	'bg-blue-200 dark:bg-blue-600',
	'bg-indigo-200 dark:bg-indigo-600',
	'bg-violet-200 dark:bg-violet-600',
	'bg-purple-200 dark:bg-purple-600',
	'bg-fuchsia-200 dark:bg-fuchsia-600',
	'bg-pink-200 dark:bg-pink-600',
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
				const { data } = await api.get('/notes');
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

				update((notes) => [...notes, data]);
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
