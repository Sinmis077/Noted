<script>
	import AutoSizeGridComponent from '$lib/components/auto-size-grid-component.svelte';
	import Note from '$lib/components/note.svelte';
	import NoteLoading from '$lib/components/note-loading.svelte';
	import NoteError from '$lib/components/noted-error.svelte';
	import { notes } from '$lib/stores/notes.js';

	let loadingValue = $state(0);
	let initialRender = $derived(loadingValue < 100);
	let error = $state(null);

	let { searchCategoryParam, showCompleted } = $props();

	$effect(() => {
		loadingValue = 0;

		async function load() {
			try {
				await notes.loadNotes(searchCategoryParam);
			} catch (err) {
				error = err;
			} finally {
				loadingValue = 50;
			}

			if ($notes.length === 0) {
				loadingValue = 100;
			}
		}

		load()
	})

	const renderedNote = () => {
		loadingValue += 50 / $notes.length;
	}

	let filteredNotes = $derived($notes.filter(note => searchCategoryParam === 'completed' || (!note.isCompleted || note.isCompleted === showCompleted)));
</script>

{#if error}
	<NoteError title="I've run into a problem loading your notes" {error} />
{:else if loadingValue < 100}
	<NoteLoading value={loadingValue} />
{/if}

{#if loadingValue >= 50 && !error}
	<div>
		{#if $notes.length > 0}
			<div class="board {loadingValue >= 100 ? 'visible' : 'invisible'}">
				{#each filteredNotes as note (note.id)}
					<AutoSizeGridComponent {initialRender} autosized={renderedNote}>
						{#snippet children(resize)}
							<Note {resize} {note} />
						{/snippet}
					</AutoSizeGridComponent>
				{/each}
			</div>
		{:else}
			<p>No notes found, add a new one!</p>
		{/if}
	</div>
{/if}

<style>
	.board {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
			grid-auto-rows: 10px;
			gap: 12px;
	}
</style>