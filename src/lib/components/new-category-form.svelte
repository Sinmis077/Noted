<script>


	import { toast } from 'svelte-sonner';
	import { api } from '$lib/utils/api.js';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupInput,
		InputGroupText, InputGroupTextarea
	} from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let label = $state(null);
	let description = $state(null);

	let { open = $bindable(true) } = $props();

	async function handleSubmit() {
		try {
			await api.post('/categories', {
				label: label,
				description: description
			});

			open = false;

			toast.success('Category added!');
		} catch (err) {
			toast.error(err.message);
		}
	}

	function handleCancel() {
		open = false;
	}

	function handleEnter(e) {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
			e.preventDefault();

			handleSubmit();
		}
	}

</script>

<form class="flex flex-col gap-3">
	<InputGroup>
		<InputGroupAddon>
			<Label>Label:</Label>
		</InputGroupAddon>
		<InputGroupInput
			onkeydown={handleEnter}
			bind:value={label}
			placeholder="Homework" />
	</InputGroup>
	<InputGroup>
		<InputGroupAddon align="block-start">
			<Label>Description:</Label>
		</InputGroupAddon>
		<InputGroupTextarea
			onkeydown={handleEnter}
			bind:value={description}
			placeholder="An informative description" />
		<InputGroupAddon class="ms-auto" align="end">
			<InputGroupText class="italic me-3">Optional</InputGroupText>
		</InputGroupAddon>
	</InputGroup>
	<span class="ms-auto mt-3">
		<Button variant="destructive" onclick={handleCancel} size="sm" type="cancel">Cancel</Button>
		<Button onclick={handleSubmit} size="sm" type="submit">Submit</Button>
	</span>
</form>