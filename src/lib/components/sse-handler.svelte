<script>
	import { source } from 'sveltekit-sse';
	import { notes } from '$lib/stores/notes.js';

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
</script>