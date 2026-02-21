<script>
	import { cn } from '$lib/utils.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { onMount } from 'svelte';

	let { ref = $bindable(null), value = $bindable(), class: className, autosize = false, ...props } = $props();

	let elementHeight = $state('auto');

	function resizeTextArea(el) {
		if (autosize && el) {
			elementHeight = el.scrollHeight + 'px';
		}
	}

	function autosizeInputBox(e) {
		resizeTextArea(e.target);
	}

	onMount(() => {
		resizeTextArea(ref);
	});
</script>

<Textarea
	oninput={autosizeInputBox}
	bind:ref
	style="min-height: {elementHeight}"
	data-slot="input-group-control"
	class={cn(
		'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
		autosize ? 'bg-background' : '',
		className
	)}
	bind:value
	{...props}
/>
