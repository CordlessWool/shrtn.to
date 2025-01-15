<script lang="ts">
	import type { Link } from '$lib/definitions.js';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { Copy, Trash2 } from 'lucide-svelte';
	import IconButton from './IconButton.svelte';

	type Props = Link & {
		deletePath?: string;
	};

	const { url, key, expiresAt, deletePath }: Props = $props();
	const shrtnUrl = new URL(key, PUBLIC_BASE_URL);
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

	const getExpiresInText = (expiresAt: Date) => {
		const { days, hours, minutes } = calcTimeLeft(expiresAt);
		if (days > 1) return `${days} days`;
		if (hours > 2) return `${days * 24 + hours} hours`;
		return `${hours * 60 + minutes} minutes`;
	};

	let expiresText = $state(getExpiresInText(expiresAt));

	onMount(() => {
		const interval = setInterval(() => {
			expiresText = getExpiresInText(expiresAt);
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<section>
	<img src={favicon} alt={`Icon of ${hostname}`} />
	<a href={url} target="_blank" class="link">
		<h2>
			{shrtnUrl.hostname}{shrtnUrl.pathname}
		</h2>
		<p class="tourl">
			{url}
		</p>
	</a>

	<small class="expires">
		Expires in ~ {expiresText}
	</small>
	<div class="actions">
		<IconButton onclick={() => navigator.clipboard.writeText(shrtnUrl.href)}>
			<Copy />
		</IconButton>
		{#if deletePath}
			<form method="POST" action={deletePath}>
				<IconButton submit>
					<Trash2 />
				</IconButton>
				<input name="key" value={key} hidden />
			</form>
		{/if}
	</div>
</section>

<style lang="postcss">
	section {
		@apply grid grid-flow-col grid-cols-3 grid-rows-3 items-center gap-x-3;
		@apply rounded-md bg-zinc-700 p-3;
		grid-template-columns: auto 1fr auto;
	}

	img {
		@apply row-span-3 items-center justify-center p-1;
	}
	h2 {
		@apply text-lg;
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
