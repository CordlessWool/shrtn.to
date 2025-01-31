<script lang="ts">
	import type { Snippet } from 'svelte';
	import ToggleTheme from './ToggleTheme.svelte';

	type Props = {
		children?: Snippet;
		showName?: boolean;
	};

	const { children, showName = true }: Props = $props();
</script>

<header class:name={showName}>
	{#if showName}
		<a href="/" class="name">shrtn</a>
	{/if}
	<nav>
		<ToggleTheme />
		{@render children?.()}
	</nav>
</header>

<style>
	@reference "tailwindcss/theme";
	header {
		@apply flex items-center justify-end gap-3 p-3;
	}

	header.name {
		@apply justify-between;
	}

	header > .name {
		@apply justify-self-start text-2xl font-bold;
	}

	nav {
		@apply flex items-center gap-3;
	}
	nav :global(button),
	nav :global(a) {
		@apply cursor-pointer underline-offset-4 hover:font-bold hover:underline;
		@apply transform transition-all duration-300 ease-in-out hover:scale-105;
	}
</style>
