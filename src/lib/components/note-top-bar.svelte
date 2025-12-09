<script>
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog/index.js';
	import { notes } from '$lib/stores/note.js';
	import { InputGroup, InputGroupAddon, InputGroupButton } from '$lib/components/ui/input-group/index.js';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import { api } from '$lib/utils/api.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { LogOut, Paintbrush } from 'lucide-svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	let newNoteText = $state('');

	const passphrase = page.data.passphrase;

	let isDialogOpen = $state(false);
	let isDeleting = $state(false);

	async function handleNewNote(event) {
		event?.preventDefault();

		try {
			if (newNoteText.trim()) {
				toast.loading('Saving note...');
				await notes.addNote(newNoteText);
				toast.success('Saved note');
				newNoteText = '';
			}
		} catch (err) {
			toast.error(err.message);
		}
	}

	async function handleClearAll() {
		isDialogOpen = true;
		isDeleting = true;
		try {
			toast.loading('Clearing all notes...');
			await notes.clearAll();
			toast.success('Successfully cleared all notes');
		} catch (err) {
			toast.error(err.message);
		} finally {
			isDialogOpen = false;
			isDeleting = false;
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
			handleNewNote();
		}
	}

	async function handleLeaveWorkspace() {
		try {
			await api.delete('/passphrase');

			await invalidateAll();

			await goto(resolve('/'));
		} catch (err) {
			toast.error(err.message);
		}
	}
</script>

<div class="flex flex-col gap-2 justify-center mb-5">
	<h2 class="font-bold text-2xl">Current workspace: {passphrase}</h2>
	<h3>Write and press enter to add a new note</h3>
	<form onsubmit={handleNewNote} class="lg:w-1/4 md:w-1/2 w-full" noValidate>
		<InputGroup>
			<textarea
				class="field-sizing-content flex min-h-16 w-full md:resize-y resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
				data-slot="input-group-control"
				bind:value={newNoteText}
				onkeydown={handleKeyDown}
				placeholder="What would you like to do?"
			></textarea>
			<InputGroupAddon align="block-end">
				<InputGroupButton class="ms-auto" type="submit" variant="default">Submit</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	</form>

	<div class="flex row gap-2 justify-end md:mt-0 mt-3">
		<AlertDialog bind:open={isDialogOpen}>
			<AlertDialogTrigger
				class="cursor-pointer bg-red-700 hover:bg-red-800 transition-colors p-1 px-10 rounded-[8px] text-white"
			>
				<div class="flex flex-row items-center gap-2">
					<Paintbrush size={16} />
					Clear All
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent
				onkeydown={(e) => {
				if (e.key === 'Enter') {
					handleClearAll();
				}
			}}
			>
				<AlertDialogHeader>Are you sure?</AlertDialogHeader>
				<AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						class="bg-red-700 hover:bg-red-800 transition-colors"
						onclick={handleClearAll}
						disabled={isDeleting}
					>
						{#if isDeleting}
							<Spinner size="icon" />
							Processing
						{:else}
							Confirm
						{/if}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
		<Button onclick={handleLeaveWorkspace} class="flex flex-row gap-2 items-center px-10">
			<LogOut size={16} />
			Leave workspace
		</Button>
	</div>
</div>
