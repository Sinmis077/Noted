<script>
	const { children } = $props();

	let rowSpan = $state(null);

	const ROW_HEIGHT = 10;
	const GAP = 12;

	function resize(node) {

		const calculateRowSpan = () => {
			rowSpan = Math.ceil((node.scrollHeight + GAP) / (ROW_HEIGHT + GAP));
		};

		calculateRowSpan();

		const resizeObserver = new ResizeObserver(() => {
			calculateRowSpan();
		});
		const mutationObserver = new MutationObserver(() => {
			requestAnimationFrame(() => {
				rowSpan = 8;
				requestAnimationFrame(() =>
					calculateRowSpan()
				);
			});
		});

		resizeObserver.observe(node);
		mutationObserver.observe(node, {
			childList: true,
			subtree: true,
			characterData: true
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}
</script>

<div style="grid-row: span {rowSpan}">
	{@render children(resize)}
</div>