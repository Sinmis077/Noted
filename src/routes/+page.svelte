<script>
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { InputGroup, InputGroupInput } from '$lib/components/ui/input-group/index.js';
	import { api } from '$lib/utils/api.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	let passphrase = '';
	let isLoading = false;

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			handlePassphraseSubmission();
		}
	}

	async function handlePassphraseSubmission() {
		if (!passphrase.trim()) {
			toast.error('No passphrase found');
			return;
		}

		isLoading = true;

		try {
			await api.post('/passphrase', { passphrase: passphrase.trim() });

			await invalidateAll();

			await goto(resolve('/notes'));
		} catch (err) {
			toast.error(err.message);
			toast.error('Failed to set passphrase, please try again');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto h-screen flex flex-col justify-center items-center">
	<Card class="md:w-1/2 w-full">
		<CardHeader>
			<CardTitle>Passphrase Gate</CardTitle>
			<CardDescription>Enter a passphrase to access a notes board</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={handlePassphraseSubmission} noValidate>
				<InputGroup>
					<InputGroupInput
						type="text"
						bind:value={passphrase}
						onkeydown={handleKeyDown}
						placeholder="Enter your passphrase"
					/>
				</InputGroup>
				<Button type="submit" class="mt-5" size="lg" disabled={isLoading}>
					{#if isLoading}
						<Spinner />
						Processing...
					{:else}
						Submit
					{/if}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
