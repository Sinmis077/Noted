const STORAGE_KEY = 'notes-app-data';

export function saveNotes(notes) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
	} catch (error) {
		console.error('Failed to save notes to local storage: ', error);
	}
}

export function getNotes() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
	} catch (error) {
		console.error('Failed to get notes from local storage: ', error);
		return [];
	}
}
