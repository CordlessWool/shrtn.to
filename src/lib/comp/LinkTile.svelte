<script lang="ts">
	import type { Link } from '$lib/definitions.js';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { Copy, Trash2 } from 'lucide-svelte';
	import Button from './Button.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	type Props = Link & {
		deletePath: string;
		ondeleted: (key: string) => void;
	};

	const { url, key, expiresAt, deletePath, ondeleted }: Props = $props();
	const shrtnUrl = new URL(key, env.PUBLIC_BASE_URL);
	const { hostname } = new URL(url);
	const favicon = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

	const calcTimeLeft = (expiresAt: Date) => {
		const now = new Date();
		const diff = expiresAt.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		return { days, hours, minutes, seconds };
	};

	const getExpiresInText = (expiresAt: Date | null) => {
		if (!expiresAt) return 'never';
		const { days, hours, minutes } = calcTimeLeft(expiresAt);
		if (days > 1) return `${days} days`;
		if (hours > 2) return `${days * 24 + hours} hours`;
		return `${hours * 60 + minutes} minutes`;
	};

	let expiresText = $state(getExpiresInText(expiresAt));

	onMount(() => {
		if (expiresAt != null) {
			const interval = setInterval(() => {
				if (expiresAt.getTime() <= Date.now()) {
					clearInterval(interval);
					ondeleted(key);
					return;
				}

				expiresText = getExpiresInText(expiresAt);
			}, 5000);
			return () => clearInterval(interval);
		}
	});
</script>

<section transition:slide>
	<img src={favicon} alt={`Icon of ${hostname}`} />
	<a href={url} target="_blank" class="link">
		<div class="shorted">
			{shrtnUrl.hostname}{shrtnUrl.pathname}
		</div>
		<p class="tourl">
			{url}
		</p>
	</a>

	<small class="expires">
		Expires in ~ {expiresText}
	</small>
	<div class="actions">
		<Button onclick={() => navigator.clipboard.writeText(shrtnUrl.href)}>
			<Copy size={20} />
		</Button>
		{#if deletePath}
			<form
				method="POST"
				action={deletePath}
				use:enhance={() => {
					return ({ result }) => {
						if (result.type === 'success') {
							ondeleted(key);
						}
					};
				}}
			>
				<Button submit>
					<Trash2 size={20} />
				</Button>
				<input name="key" value={key} hidden />
			</form>
		{/if}
	</div>
</section>

<style lang="postcss">
	section {
		@apply grid grid-flow-col grid-cols-3 grid-rows-3 items-center gap-x-3;
		@apply w-full rounded-md bg-zinc-200 p-3;
		grid-template-columns: auto 1fr auto;
	}

	:global(.dark) section {
		@apply bg-zinc-700;
	}

	img {
		@apply row-span-3 w-12 items-center justify-center p-1;
	}
	.shorted {
		@apply font-bold;
	}
	.link {
		@apply row-span-2;
	}
	.tourl {
		@apply ml-3 text-xs;
	}

	.expires {
		@apply text-xs;
		@apply self-end;
	}

	.actions {
		@apply flex flex-row gap-3;
		@apply row-span-3;
		@apply justify-self-end;
	}
</style>
