<script lang="ts">
	const { children, ...props } = $props();
</script>

<button {...props}>
	{@render children()}
</button>

<style lang="postcss">
	button {
		@apply rounded-full bg-teal-700 p-2 opacity-50 hover:bg-teal-400 hover:opacity-100 dark:border-teal-700 dark:hover:bg-teal-600;
	}
</style>
