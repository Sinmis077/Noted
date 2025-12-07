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

	let newNoteText = '';

	const passphrase = page.data.passphrase;

	let isDialogOpen = false;

	async function handleNewNote(event) {
		event?.preventDefault();

		try {
			if (newNoteText.trim()) {
				await notes.addNote(newNoteText);
				newNoteText = '';
			}
		} catch (err) {
			// will add toasts or something later
		}
	}

	async function handleClearAll() {
		isDialogOpen = true;
		try {
			await notes.clearAll();
		} catch (err) {
			// will add toasts or something later
		}
		isDialogOpen = false;
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
			throw err;
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

	<AlertDialog bind:open={isDialogOpen}>
		<AlertDialogTrigger
			class="cursor-pointer bg-red-600 hover:bg-red-700 transition-colors font-bold ms-auto p-1 px-2 md:mt-0 mt-3 rounded text-white"
		>
			Clear All
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
					class="bg-red-600 hover:bg-red-700 transition-colors"
					onclick={handleClearAll}
				>
					Confirm
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
	<Button onclick={handleLeaveWorkspace} class="xl:w-1/6 lg:w-1/4 md:w-1/3 w-1/2 ms-auto"
		>Leave workspace</Button
	>
</div>
