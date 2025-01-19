<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<header>
	{#if !data.user || data.user.temp}
		<a href="/login">Add links to your account</a>
	{:else}
		<form method="POST" action="/login/?/logout">
			<button type="submit">Sign out</button>
		</form>
	{/if}
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
