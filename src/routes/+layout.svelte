<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Loading from '$lib/components/loading.svelte';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Moon, Sun } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { data, children } = $props();

	let hasPassphrase = $derived(data.hasPassphrase);

	let isLoading = $state(true);

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
	<meta name="description"
				content="Sinmis' first real web app that went into production; Here to serve all your post-it note needs via passphrase workspace implementation" />
</svelte:head>

<div class="flex flex-row items-center gap-5 absolute top-5 right-5">
	<Button onclick={toggleMode} variant="outline" size="icon">
		<Sun size={24} class="dark:hidden block" />
		<Moon size={24} class="dark:block hidden" />
	</Button>

	<img class="w-15 md:block hidden" src="./icon.png" alt="Icon" />
</div>

<ModeWatcher />
<Toaster position="top-center" />
{#if isLoading}
	<Loading description="Trying to load your passphrase" />
{:else}
	{@render children()}
{/if}
