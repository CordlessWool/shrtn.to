<script lang="ts">
	import { enhance } from '$app/forms';
	import IconButton from '$lib/comp/IconButton.svelte';
	import Input from '$lib/comp/Input.svelte';
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import LinkTile from '$lib/comp/LinkTile.svelte';
	import {
		DAY_IN_MS,
		HOUR_IN_MS,
		MONTH_IN_MS,
		WEEK_IN_MS,
		YEAR_IN_MS,
		type Link
	} from '$lib/definitions.js';
	import { Link as LinkIcon } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Select from '$lib/comp/Select.svelte';

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
			<InputFrame>
				<Input name="link" placeholder="Enter link to shorten" autocomplete="off" />
				<Select name="ttl">
					<option value={HOUR_IN_MS}>a hour</option>
					<option value={DAY_IN_MS}>a day</option>
					<option value={WEEK_IN_MS}>a week</option>
					<option value={MONTH_IN_MS}>a month</option>
					<option value={YEAR_IN_MS}>a year</option>
					<option value={-1}>for ever</option>
				</Select>
				<IconButton type="submit">
					<LinkIcon size={16} />
				</IconButton>
			</InputFrame>
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

	section.links {
		@apply grid gap-3 md:grid-cols-2;
		@apply m-3 w-full max-w-4xl md:m-7;
	}
</style>
