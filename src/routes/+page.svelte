<script lang="ts">
	import { enhance } from '$app/forms';
	import LinkTile from '$lib/comp/LinkTile.svelte';

	const { data } = $props();
	console.log(data);
</script>

<main>
	<h1>shrtn.to</h1>
	<p>A small easy to setup open-source link shortener.</p>
	<section class="links">
		<form method="POST" use:enhance action="?/add">
			<input name="link" />
		</form>
		{#if data}
			{#each data.links as link}
				<LinkTile {...link} />
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
