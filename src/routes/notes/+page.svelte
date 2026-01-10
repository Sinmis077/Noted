<script>
	import NoteTopBar from '$lib/components/note-top-bar.svelte';
	import NotesMasonry from '$lib/components/note-masonry.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Dialog from '$lib/components/noted-dialog.svelte';
	import CategoryForm from '$lib/components/new-category-form.svelte';
	import { toTitleCase } from '$lib/utils.js';

	let { data } = $props();
	let categories = $derived([
		{ label: 'to-dos', description: 'Things left to-do' },
		...data.categories,
		{ label: 'completed', description: 'I\'ve completed these, I should be proud!' }
	]);

	let currentCategory = $state(categories[0].label);

	let isDialogOpen = $state(false);

	function changeTab(categoryLabel) {
		if(currentCategory === categoryLabel) return;

		currentCategory = categoryLabel;
	}
</script>

<div class="p-5">
	<NoteTopBar {currentCategory} />

	<hr class="border border-gray-500 mb-5" />

	<Tabs value={currentCategory}>
		<TabsList class="bg-primary/10">
			{#each categories as category (category.label)}
				{#if category.label === 'completed'}
					<Button class="hover:text-orange-400 transition-colors duration-200" onclick={() => {isDialogOpen=true}}
									variant="icon">
						<Plus />
					</Button>
					<Dialog bind:open={isDialogOpen}
									noClose={true}
									title="Add new category"
									description="Add new category to keep your notes neatly sorted!">
						<CategoryForm bind:open={isDialogOpen} />
					</Dialog>
				{/if}
				<TabsTrigger value={category.label} onclick={() => changeTab(category.label)}>{toTitleCase(category.label)}</TabsTrigger>
			{/each}
		</TabsList>
		<TabsContent value={currentCategory}>
			<NotesMasonry searchCategoryParam={currentCategory} />
		</TabsContent>
	</Tabs>
</div>
