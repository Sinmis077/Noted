<script>

	let { open = $bindable(false), ...restProps } = $props();
</script>

<TooltipPrimitive.Root bind:open {...restProps} />
