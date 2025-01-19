<script lang="ts">
	const { children, ...props } = $props();
</script>

<button {...props}>
	{@render children()}
</button>

<style lang="postcss">
	button {
		@apply flex flex-row items-center justify-center gap-3 text-nowrap;
		@apply bg-teal-400 p-3 hover:bg-teal-500 hover:opacity-100;
		@apply transform rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-600;
	}

	:global(.dark) {
		button {
			@apply bg-teal-800 hover:bg-teal-700;
		}
	}
</style>
