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

	const loadLink = async (url: string) => {
		const response = await fetch(url);
		return (await response.json()) as Link;
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
						const data = await loadLink(result.location);
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
		@apply flex min-h-full flex-col items-center justify-center gap-3 p-3 md:p-7;
	}
	h1 {
		@apply text-4xl;
	}
	form {
		@apply md:col-span-2;
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

	section.links {
		@apply grid gap-3 md:grid-cols-2;
		@apply m-3 w-full max-w-4xl md:m-7;
	}
</style>
