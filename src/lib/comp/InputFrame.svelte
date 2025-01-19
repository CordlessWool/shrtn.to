<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		for?: string;
		label?: string;
		children: Snippet;
		info?: string;
		error?: string;
	};

	const { label, children, info, error, ...props }: Props = $props();
</script>

<div class="frame">
	{#if label && props.for}
		<label for={props.for}>{label}</label>
	{/if}
	<div class="inputs">
		{@render children()}
	</div>
	{#if info}
		<small>{info}</small>
	{:else if error}
		<small>{error}</small>
	{:else}
		<small>&nbsp;</small>
	{/if}
</div>

<style lang="postcss">
	.frame {
		@apply grid gap-0;
	}
	label {
		@apply pl-1 text-zinc-600;
	}
	small {
		@apply pl-1 text-zinc-600;
	}

	:global(.dark) {
		label {
			@apply text-zinc-400;
		}
		small {
			@apply text-zinc-400;
		}

		.inputs {
			@apply bg-zinc-700;
			@apply border-zinc-600;
		}
	}

	.inputs {
		@apply flex flex-row flex-nowrap items-center gap-3;
		@apply w-full px-5 py-3;
		@apply bg-zinc-200 dark:bg-zinc-700;
		@apply rounded-md border-zinc-500;
	}
</style>
