<script>
	import Note from '$lib/components/note.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { notes } from '$lib/stores/notes.js';
	import Masonry from 'svelte-bricks';
	import { resizeNote } from '$lib/utils/resizer.js';
	import { tick } from 'svelte';

	let isLoading = $state(false);
	let error = $state(null);

	let { searchCategoryParam, showCompleted } = $props();

	let [minColWidth, maxColWidth, gap] = [250, 400, 12];

	$effect(() => {
		isLoading = true;

		try {
			notes.loadNotes(searchCategoryParam);
		} catch (err) {
			error = err;
		} finally {
			isLoading = false;
		}
	})
</script>

{#if isLoading}
	<Loading class="h-full" description="Loading notes..." />
{:else if error}
	Failed to load your notes... <br />
	<p class="text-red-500">
		{error}
	</p>
{:else}
	<div>
		{#if $notes.length > 0}
			<div class="board">
				{#each $notes as note (note.id)}
					<Note class="note" noted-type="note" note={note} />
				{/each}
			</div>
			<!--
			<Masonry
				animate={true}
				duration={100}
				items={$notes.filter(note => searchCategoryParam === 'completed' || (!note.isCompleted || note.isCompleted === showCompleted))}
				idKey='id'
				{minColWidth}
				{maxColWidth}
				{gap}
				class="p-4"
			>
				{#snippet children({ item: note })}
					<Note {note} />
				{/snippet}
			</Masonry>
			-->
		{:else}
			<p>No notes found, add a new one!</p>
		{/if}
	</div>
{/if}

<style type="text/css">
	.board {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			grid-auto-rows: 10px;
			gap: var(--gap);
	}
</style>