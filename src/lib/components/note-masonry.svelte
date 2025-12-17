<script>
	import Note from '$lib/components/note.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { notes } from '$lib/stores/note.js';
	import { onMount } from 'svelte';
	import Masonry from 'svelte-bricks';

	let isLoading = $state(false);
	let error = $state(null);

	let { noteStatus = { completed: false } } = $props();

	let [minColWidth, maxColWidth, gap] = [250, 400, 12];

	onMount(async () => {
		isLoading = true;

		if($notes.length) {
			isLoading = false;
			return;
		}

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
	Failed to load your notes... <br />
	<p class="text-red-500">
		{error}
	</p>
{:else}
	<div>
		{#if $notes.length > 0}
			<Masonry
				animate={true}
				duration={100}
				items={$notes.filter((note) => note.isCompleted === noteStatus.completed)}
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
		{:else}
			<p>No notes found, add a new one!</p>
		{/if}
	</div>
{/if}