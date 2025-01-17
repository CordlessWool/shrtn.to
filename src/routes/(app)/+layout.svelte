<script lang="ts">
	let { children } = $props();
</script>

<header>
	<a href="/login">Add links to your account </a>
</header>

{@render children()}

<style lang="postcss">
	header {
		@apply flex justify-end gap-3 p-3;
	}

	a {
		@apply text-zinc-400;
	}

	a:hover {
		@apply text-zinc-300 underline underline-offset-2;
	}
</style>
