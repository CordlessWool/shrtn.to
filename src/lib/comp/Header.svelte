<script lang="ts">
	import type { Snippet } from 'svelte';
	import ToggleTheme from './ToggleTheme.svelte';

	type Props = {
		children?: Snippet;
	};

	const { children }: Props = $props();
</script>

<header>
	<ToggleTheme />
	<nav>
		{@render children?.()}
	</nav>
</header>

<style lang="postcss">
	header {
		@apply flex items-center justify-end gap-3 p-3;
	}

	nav > :global(*) {
		@apply flex items-center gap-3;
		@apply underline-offset-2 hover:underline;
	}
</style>
