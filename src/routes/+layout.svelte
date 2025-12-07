<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Loading from '$lib/components/loading.svelte';

	let { data, children } = $props();

	let hasPassphrase = $derived(data.hasPassphrase);

	let isLoading = $derived(true);

	onMount(async () => {
		if (hasPassphrase) {
			await goto(resolve('/notes'));
		} else await goto(resolve('/'));

		isLoading = false;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Noted</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="author" content="Ioannis Panagi" />
	<meta name="description" content="Sinmis' first real web app that went into production; Here to serve all your post-it note needs via passphrase workspace implementation" />
</svelte:head>

<img class="w-15 md:block hidden absolute top-5 right-5" src="./icon.png" alt="Icon" />

{#if isLoading}
	<Loading description="Trying to load your passphrase" />
{:else}
	{@render children()}
{/if}
