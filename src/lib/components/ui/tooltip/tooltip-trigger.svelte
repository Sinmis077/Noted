<script>

	let { ref = $bindable(null), ...restProps } = $props();
</script>

<TooltipPrimitive.Trigger bind:ref data-slot="tooltip-trigger" {...restProps} />
