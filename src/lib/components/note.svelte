<script>
	import { notes } from '$lib/stores/note.js';
	import { Card, CardAction, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card/index.js';
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
	import { PenBox, Square, SquareCheck, TextAlignJustify, Trash2 } from 'lucide-svelte';
	import { InputGroup, InputGroupAddon, InputGroupButton } from '$lib/components/ui/input-group/index.js';

	let { note } = $props();

	let isEditing = $state(false);
	let editingNoteText = $derived(note.text);

	async function handleMarkComplete() {
		try {
			await notes.toggleNoteComplete(note.id);
		} catch (err) {
			// Will add toasts or something later
		}
	}

	async function handleEditNote() {
		try {
			note.text = editingNoteText;
			await notes.editNote(note);
		} catch (err) {
			// Will add toasts or something later
		} finally {
			isEditing = false;
		}
	}

	async function handleDelete() {
		try {
			await notes.deleteNote(note.id);
		} catch (err) {
			// Will add toasts or something later
		}
	}

	function handleToggleEdit() {
		isEditing = !isEditing;
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
			e.preventDefault();
			handleEditNote();
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			editingNoteText = note.text;
			isEditing = false;
		}
	}

	function formatDate(isoString) {
		return new Date(isoString).toLocaleDateString('en-AU');
	}
</script>

<Card class="aspect-square {note.backgroundColor}">
	<CardHeader>
		<CardAction>
			<div class="flex flex-row gap-2">
				{#if note.isCompleted}
					<SquareCheck class="cursor-pointer text-green-500" onclick={handleMarkComplete} />
				{:else}
					<Square class="cursor-pointer" onclick={handleMarkComplete} />
				{/if}

				<TextAlignJustify class="cursor-grab" size={25} />
				<PenBox class="cursor-pointer" size={25} onclick={handleToggleEdit} />
			</div>
		</CardAction>
	</CardHeader>
	<CardContent>
		{#if isEditing}
			<form onsubmit={handleEditNote} class="w-full" noValidate>
				<InputGroup class="bg-background">
					<textarea
						class="field-sizing-content flex min-h-16 w-full md:resize-y resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
						data-slot="input-group-control"
						bind:value={editingNoteText}
						onkeydown={handleKeyDown}
						placeholder="What would you like to do?"
					></textarea>
					<InputGroupAddon align="block-end">
						<InputGroupButton class="ms-auto" type="submit" variant="default"
							>Submit</InputGroupButton
						>
					</InputGroupAddon>
				</InputGroup>
			</form>
		{:else}
			<p class:line-through={note.isCompleted} class="wrap-break-word">{note.text}</p>
		{/if}
	</CardContent>
	<CardFooter class="flex flex-col gap-1 mt-auto">
		<p class="w-full">
			Created:
			{formatDate(note.createdAt)}
		</p>
		{#if note.isCompleted}
			<p class="text-green-600 w-full">Completed: {formatDate(note.completedAt)}</p>
		{/if}

		<AlertDialog>
			<AlertDialogTrigger
				class="cursor-pointer bg-red-600 hover:bg-red-700 transition-colors font-bold ms-auto p-2 rounded text-white"
			>
				<Trash2 class="text-white" />
			</AlertDialogTrigger>
			<AlertDialogContent
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						handleDelete();
					}
				}}
			>
				<AlertDialogHeader>Are you sure?</AlertDialogHeader>
				<AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						class="bg-red-600 hover:bg-red-700 transition-colors"
						onclick={handleDelete}
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</CardFooter>
</Card>
