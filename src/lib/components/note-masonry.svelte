<script>
	import Note from '$lib/components/note.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { notes } from '$lib/stores/note.js';
	import { onMount } from 'svelte';

	let isLoading = false;
	let error = null;

	onMount(async () => {
		isLoading = true;

		try {
			await notes.loadNotes();
		} catch (err) {
			error = err;
		} finally {
			isLoading = false;
		}
	});
</script>

{#if isLoading}
	<Loading class="h-full" description="Loading notes..." />
{:else if error}
	Failed to load your notes... <br/>
	<p class="text-red-500">
		{error}
	</p>
{:else}
	<div>
		{#if $notes.length > 0}
			<div class="2xl:columns-6 xl:columns-5 lg:columns-4 md:columns-3 columns-2 gap-2 w-full">
				{#each $notes as note (note.id)}
					<div class="break-inside-avoid mb-2">
						<Note {note} />
					</div>
				{/each}
			</div>
		{:else}
			<p>No notes found, add a new one!</p>
		{/if}
	</div>
{/if}