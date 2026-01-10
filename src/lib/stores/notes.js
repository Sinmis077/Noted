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
	'bg-mauve'
];

function generateId() {
	return Date.now().toString(36);
}

function randomBackgroundColor() {
	return COLORS[Math.floor(((Math.random() + Math.random() + Math.random()) % 1) * COLORS.length)];
}

// export const notes = {
// 	list: [],
// 	category: 'to-dos',
//
// 	subscribe: (
// 		run = async (category) => {
// 			this.category = category;
// 			try {
// 				const { data } = await api.get('/notes', { params: { category: this.category } });
// 				this.set(data);
// 			} catch (err) {
// 				this.set([]);
// 				throw err;
// 			}
// 		}
// 	) => {
// 		this.category = null;
// 		this.list = null;
// 		return null;
// 	},
//
// 	set: (notes) => {
// 		this.list = notes;
// 	},
//
// 	add: async (text) => {
// 		const newNote = {
// 			id: generateId(),
// 			text,
// 			backgroundColor: randomBackgroundColor(),
// 			isCompleted: false,
// 			createdAt: new Date().toISOString(),
// 			completedAt: null,
// 			category: this.category !== 'to-dos' ? this.category : null,
// 			order: this.list.length
// 		};
//
// 		const { data } = await api.post('/notes', newNote);
//
// 		this.list = [...this.list, data];
// 	},
//
// 	toggleComplete: async (note) => {
// 		await this.update({
// 			...note,
// 			isCompleted: !note.isCompleted,
// 			completedAt: !note.isCompleted ? new Date().toISOString() : null
// 		});
// 	},
//
// 	update: async (note) => {
// 		const { data } = await api.put('/notes', note);
//
// 		this.list = this.list.map((note) => {
// 			if (note.id === data.id) {
// 				return data;
// 			}
// 			return note;
// 		});
// 	},
//
// 	remove: async (noteId) => {
// 		await api.delete(`/notes/${noteId}`);
//
// 		this.list = this.list.filter((note) => note.id !== noteId);
// 	},
//
// 	clear: async () => {
// 		await api.delete(`/notes`);
//
// 		this.list = [];
// 	}
// };

function createNotesStore() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,

		loadNotes: async (category) => {
			try {
				const { data } = await api.get('/notes', { params : { category } });
				set(data);
			} catch (err) {
				set([]);
				throw err;
			}
		},

		addNote: async (text, category) => {
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
				category,
				order: currentLength
			};

			const { data } = await api.post('/notes', newNote);

			update((notes) => [...notes, data]);
		},

		editNote: async (note) => {
			const { data } = await api.put(`/notes/${note.id}`, note);

			update((notes) => notes.map((oldNote) => (oldNote.id === note.id ? data : oldNote)));
		},

		deleteNote: async (id) => {
			await api.delete(`/notes/${id}`);

			update((notes) => notes.filter((note) => note.id !== id));
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

			const { data } = await api.put(`/notes/${id}`, updatedNote);

			update((notes) => notes.map((note) => (note.id === id ? data : note)));
		},

		clearAll: async () => {
			await api.delete(`/notes`);
			update(() => {
				return [];
			});
		}
	};
}

export const notes = createNotesStore();
