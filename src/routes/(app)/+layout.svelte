<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/comp/Header.svelte';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<Header showName={false}>
	{#if !data.user || data.user.temp}
		<a href="/login">Add links to your account</a>
	{:else}
		<form method="POST" action="/login/?/logout">
			<button type="submit">Sign out</button>
		</form>
	{/if}
</Header>

{@render children()}
