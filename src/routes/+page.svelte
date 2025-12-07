<script>
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { InputGroup, InputGroupInput } from '$lib/components/ui/input-group/index.js';
	import { api } from '$lib/utils/api.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';

	let passphrase = '';
	let error = '';
	let isLoading = false;

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			handlePassphraseSubmission();
		}
	}

	async function handlePassphraseSubmission() {
		if (!passphrase.trim()) {
			error = 'No passphrase found';
			return;
		}

		error = '';
		isLoading = true;

		try {
			await api.post('/passphrase', { passphrase: passphrase.trim() });

			await invalidateAll();

			await goto(resolve('/notes'));
		} catch (err) {
			error = 'Failed to set passphrase, please try again';
			throw err;
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
				<Button type="submit" class="mt-5" size="lg">Submit</Button>
			</form>
		</CardContent>
	</Card>
</div>
