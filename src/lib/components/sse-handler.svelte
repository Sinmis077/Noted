<script>
	import { source } from 'sveltekit-sse';
	import { notes } from '$lib/stores/notes.js';
	import { categories } from '$lib/stores/categories.js';

	const connection = source("/api/sse");

	let newNote = connection.select('newNote').json();
	let updatedNote = connection.select('updateNote').json();
	let deleteNoteId = connection.select('deleteNote').json();
	let clearAllNotes = connection.select('clearAllNotes').json();

	$effect(() => {
		if($newNote) {
			notes.addSSENote($newNote);
		}

		if($updatedNote) {
			notes.updateSSENote($updatedNote);
		}

		if($deleteNoteId) {
			notes.deleteSSENote($deleteNoteId);
		}

		if($clearAllNotes) {
			notes.clearAllSSENotes();
		}
	})

	let newCategory = connection.select('newCategory').json();
	let updatedCategory = connection.select('updateCategory').json();
	let deleteCategoryId = connection.select('deleteCategory').json();

	$effect(() => {
		if($newCategory) {
			categories.addSSECategory($newCategory);
		}

		if($updatedCategory) {
			console.log($updatedCategory);
			categories.updateSSECategory($updatedCategory);
		}

		if($deleteCategoryId) {
			categories.deleteSSECategory($deleteCategoryId);
		}
	})
</script>