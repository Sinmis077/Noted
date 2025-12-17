<script>
    import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { buttonVariants } from './ui/button';
	import NotesMasonry from '$lib/components/note-masonry.svelte';

</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>Archived</Drawer.Trigger>

	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Archived notes</Drawer.Title>
				<Drawer.Description>View your archived notes.</Drawer.Description>
			</Drawer.Header>
			<NotesMasonry noteStatus='completed'/>
		</div>
	</Drawer.Content>
</Drawer.Root>
