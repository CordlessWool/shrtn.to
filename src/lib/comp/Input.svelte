<script>
	const { ...props } = $props();
</script>

<input {...props} />

<style lang="postcss">
	input {
		all: unset;
		@apply w-full border-0 bg-transparent py-3;
		@apply outline-none;
	}
</style>
