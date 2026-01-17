<script>
	import NoteTopBar from '$lib/components/note-top-bar.svelte';
	import NotesMasonry from '$lib/components/note-masonry.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Eraser, Pen, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Dialog from '$lib/components/noted-dialog.svelte';
	import CategoryForm from '$lib/components/category-form.svelte';
	import { toTitleCase } from '$lib/utils.js';
	import { categories } from '$lib/stores/categories.js';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/loading.svelte';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
		AlertDialogHeader
	} from '$lib/components/ui/alert-dialog/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(true);
	let errors = $state(null);

	onMount(async () => {
		try {
			await categories.loadCategories();
			currentCategory = $categories[0];
		} catch (e) {
			errors = e.message;
		} finally {
			isLoading = false;
		}
	});

	let currentCategory = $state(null);
	let currentCategoryLabel = $derived(currentCategory?.label);

	let isDialogOpen = $state(false);
	let isEditDialogOpen = $state(false);
	let isDeleteAlertDialogOpen = $state(false);

	let isDeletingCategory = $state(false);

	function changeTab(category) {
		if (currentCategory.label === category.label) return;

		currentCategory = category;
	}

	async function handleDelete() {
		isDeletingCategory = true;
		try {
			toast.loading('Deleting...');
			await categories.deleteCategory(currentCategory.id);
			toast.success('Successfully deleted category');
		} catch (err) {
			toast.error(err.message);
		} finally {
			isDeletingCategory = false;
			isDeleteAlertDialogOpen = false;

			currentCategory = $categories[0];
		}
	}
</script>

<div class="p-5">
	<NoteTopBar {currentCategory} />

	<hr class="border border-gray-500 mb-5" />

	{#if isLoading}
		<Loading description="Loading categories..." />
	{:else if errors?.length > 0}
		<p class="text-red-600">{errors}</p>
	{:else}
		<Tabs value={currentCategoryLabel}>
			<TabsList class="bg-primary/10">
				{#each $categories.filter((category) => category.label !== 'completed') as category (category.label)}
					<TabsTrigger value={category.label}
											 onclick={() => changeTab(category)}>
						{toTitleCase(category.label)}
						{#if currentCategoryLabel === category.label && category.label !== 'to-dos'}
							<span class="ms-1">
								<Button size="icon" variant="ghost" class="text-blue-500" onclick={
									() => {isEditDialogOpen = !isEditDialogOpen}
								}><Pen /></Button>
								<Button size="icon" variant="ghost" class="text-red-500"
												onclick={() => {isDeleteAlertDialogOpen = !isDeleteAlertDialogOpen}}><Eraser /></Button>
							</span>
						{/if}
					</TabsTrigger>
				{/each}
				<Button class="hover:text-orange-400 transition-colors duration-200" onclick={() => {isDialogOpen=true}}
								variant="icon">
					<Plus />
				</Button>
				{#if isDialogOpen}
					<Dialog bind:open={isDialogOpen}
									noClose={true}
									title="Add new category"
									description="Add new category to keep your notes neatly sorted!">
						<CategoryForm bind:open={isDialogOpen} bind:currentCategory={currentCategory} />
					</Dialog>
				{/if}
				<TabsTrigger value='completed'
										 onclick={() => changeTab($categories.find((category) => category.label === 'completed'))}>
					Completed
				</TabsTrigger>
			</TabsList>
			<TabsContent value={currentCategoryLabel}>
				{#if currentCategory.description}
					<p class="text-primary/77 italic">{currentCategory.description}</p>
				{/if}
				<NotesMasonry searchCategoryParam={currentCategoryLabel} />
			</TabsContent>
		</Tabs>
	{/if}
</div>

{#if isEditDialogOpen}
	<Dialog bind:open={isEditDialogOpen}
					noClose={true}
					title="Edit {currentCategoryLabel}"
					description="Add or edit the description">
		<CategoryForm bind:open={isEditDialogOpen} category={currentCategory} bind:currentCategory={currentCategory} />
	</Dialog>
{/if}
{#if isDeleteAlertDialogOpen}
	<AlertDialog bind:open={isDeleteAlertDialogOpen}>
		<AlertDialogContent
			onkeydown={(e) => {
												if (e.key === 'Enter') {
													handleDelete();
												}}}>
			<AlertDialogHeader>Are you sure?</AlertDialogHeader>
			<AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
					class="bg-red-600 hover:bg-red-700 text-white transition-colors"
					onclick={handleDelete}
					disabled={isDeletingCategory}
				>
					{#if isDeletingCategory}
						<Spinner size="icon" />
						Processing
					{:else}
						Confirm
					{/if}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/if}
