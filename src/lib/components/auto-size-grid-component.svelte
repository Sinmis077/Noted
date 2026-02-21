<script>
	let { children, initialRender, autosized } = $props();

	let rowSpan = $state(8);

	const ROW_HEIGHT = 10;
	const GAP = 12;

	function resize(node) {

		const calculateRowSpan = () => {
			let mathematicalHeight = node.scrollHeight + GAP;
			if (mathematicalHeight >= node.offsetWidth) {
				rowSpan = Math.ceil(mathematicalHeight / (ROW_HEIGHT + GAP));
			} else {
				rowSpan = Math.ceil(node.offsetWidth / (ROW_HEIGHT + GAP));
			}
		};

		calculateRowSpan();

		const handleUpdates = () => {
			requestAnimationFrame(() => {
				rowSpan = 12;
				requestAnimationFrame(() =>
					calculateRowSpan()
				);
			});
		};

		const resizeObserver = new ResizeObserver(() => calculateRowSpan());
		const mutationObserver = new MutationObserver(() => handleUpdates());


		addEventListener('resize', () => handleUpdates());

		resizeObserver.observe(node);
		mutationObserver.observe(node, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['style']
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			removeEventListener('resize', handleUpdates);
		};
	}

	$effect(() => {
		if (initialRender && rowSpan) {
			autosized();
		}
	});
</script>

<div style="grid-row: span {rowSpan}">
	{@render children(resize)}
</div>