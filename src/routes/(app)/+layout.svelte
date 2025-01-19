<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/comp/Header.svelte';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<Header>
	{#if !data.user || data.user.temp}
		<a href="/login">Add links to your account</a>
	{:else}
		<form method="POST" action="/login/?/logout">
			<button type="submit">Sign out</button>
		</form>
	{/if}
</Header>

{@render children()}

<style lang="postcss">
	a {
		@apply text-zinc-400;
	}

	a:hover {
		@apply text-zinc-300 underline underline-offset-2;
	}
</style>
