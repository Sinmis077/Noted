<script>
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupInput,
		InputGroupText
	} from '$lib/components/ui/input-group/index.js';
	import { api } from '$lib/utils/api.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import Loading from '$lib/components/loading.svelte';

	let { data } = $props();

	let isHealthy = $derived(data.isHealthy)

	let passphrase = $state("");
	let password = $state(null)
	let isLoading = $state(false);

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
			if(password) {
				await api.post('/passphrase', {
					passphrase: passphrase.trim(),
					password: password.trim()
				});
			} else {
				await api.post('/passphrase', {
					passphrase: passphrase.trim(),
				})
			}


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

{#if !isHealthy}
	<Loading description="Server is currently starting...." />
{:else}
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
					<InputGroup class="mt-4">
						<InputGroupInput
							type="text"
							bind:value={password}
							onkeydown={handleKeyDown}
							placeholder="Enter your password"
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText class="italic">Optional</InputGroupText>
						</InputGroupAddon>
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
{/if}

