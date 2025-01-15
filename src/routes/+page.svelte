<script lang="ts">
	import { enhance } from '$app/forms';
	import LinkTile from '$lib/comp/LinkTile.svelte';
	import type { Link } from '$lib/definitions.js';
	import type { PageData } from './$types.js';

	const { data }: { data: PageData } = $props();
	let links = $state(data.links);

	const addLink = (link: Link) => {
		links.push({
			...link,
			expiresAt: link.expiresAt ? new Date(link.expiresAt) : null
		});
	};

	const removeLink = (key: string) => {
		links = links.filter((l) => l.key !== key);
	};
</script>

<main>
	<h1>shrtn.to</h1>
	<p>A small easy to setup open-source link shortener.</p>
	<section class="links">
		<form
			method="POST"
			use:enhance={({ formElement }) => {
				return async ({ result }) => {
					if (result.type === 'redirect') {
						const response = await fetch(result.location);
						const data = (await response.json()) as Link;
						addLink(data);
						formElement.reset();
					}
				};
			}}
			action="?/add"
		>
			<input name="link" placeholder="Enter link to shorten" />
		</form>
		{#if data}
			{#each links as link (link.key)}
				<LinkTile {...link} deletePath="?/remove" ondeleted={removeLink} />
			{/each}
		{/if}
	</section>
</main>

<style lang="postcss">
	main {
		@apply flex min-h-screen flex-col items-center justify-center gap-3;
		@apply bg-zinc-800 text-zinc-200;
	}
	h1 {
		@apply text-4xl;
	}
	input {
		@apply w-full px-5 py-3;
		@apply bg-zinc-700;
		@apply rounded-md border-zinc-500;
	}

	input:focus,
	input:active,
	input:hover {
		@apply border-zinc-300;
	}

	.links {
		@apply grid min-w-96 gap-3;
	}
</style>
