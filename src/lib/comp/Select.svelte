<script lang="ts">
	const { children } = $props();
</script>

<select>
	{@render children()}
</select>

<style lang="postcss">
	select {
		@apply w-full border-0 bg-transparent py-3;
		@apply outline-none;
	}
</style>
