<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/comp/Header.svelte';
	import * as m from '$lib/paraglide/messages';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<Header showName={false}>
	{#if !data.user || data.user.temp}
		<a href="/login">{m.sign_in_link()}</a>
	{:else}
		<form method="POST" action="/login/?/logout">
			<button type="submit">{m.sign_out()}</button>
		</form>
	{/if}
</Header>

{@render children()}
