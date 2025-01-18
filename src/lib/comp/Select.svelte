<script lang="ts">
	const { children, ...props } = $props();
</script>

<select {...props}>
	{@render children()}
</select>

<style lang="postcss">
	select {
		@apply border-0 bg-transparent py-3;
		@apply cursor-pointer outline-none;
		@apply ring-0;
	}
</style>
