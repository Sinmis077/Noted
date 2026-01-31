<script>
	import AutoSizeGridComponent from '$lib/components/auto-size-grid-component.svelte';
	import Note from '$lib/components/note.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { notes } from '$lib/stores/notes.js';
	import Masonry from 'svelte-bricks';

	let isLoading = $state(false);
	let error = $state(null);

	let { searchCategoryParam, showCompleted } = $props();

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
				{#each $notes.filter(note => searchCategoryParam === 'completed' || (!note.isCompleted || note.isCompleted === showCompleted)) as note (note.id)}
					<AutoSizeGridComponent>
						{#snippet children(resize)}
							<Note {resize} {note} />
						{/snippet}
					</AutoSizeGridComponent>
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

<style>
	.board {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			grid-auto-rows: 10px;
			gap: 12px;
	}
</style>