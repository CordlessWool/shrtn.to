<script lang="ts">
	import Button from '$lib/comp/Button.svelte';
	import Input from '$lib/comp/Input.svelte';
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import LinkTile from '$lib/comp/LinkTile.svelte';
	import { type Link } from '$lib/definitions.js';
	import { Link as LinkIcon } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Select from '$lib/comp/Select.svelte';
	import { getLinkSchema, getTTLs } from '$lib/helper/form.js';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { SHORTEN_LENGTH } from '$lib/helper/defaults.js';
	import { nanoid } from 'nanoid';
	import * as m from '$lib/paraglide/messages.js';

	const { data }: { data: PageData } = $props();
	let links = $state(data.links);
	const isLoggedIn = (user: PageData['user'] | null | undefined): boolean => {
		return user != null && !user.temp;
	};
	const { form, errors, enhance } = superForm(data.form, {
		validators: valibotClient(getLinkSchema(isLoggedIn(data.user))),
		onResult: async ({ result, cancel }) => {
			if (result.type === 'redirect') {
				const data = await loadLink(result.location);
				addLink(data);
				$form.link = '';
				$form.short = nanoid(SHORTEN_LENGTH);
				cancel();
			}
		}
	});

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
	<h1>shrtn</h1>
	<p>{m.teaser()} - <b>{m.teaser_sub()}</b>.</p>

	<section class="links">
		<form method="POST" use:enhance action="?/add">
			<InputFrame error={$errors.link?.[0] || $errors.ttl?.[0] || $errors.short?.[0]}>
				<Input
					name="link"
					placeholder={m.link_input_placeholder()}
					autocomplete="off"
					bind:value={$form.link}
				/>
				<Select name="ttl" aria-label={m.ttl()}>
					{#each getTTLs(isLoggedIn(data.user)).reverse() as [time, text]}
						<option value={time}>{m[text]()}</option>
					{/each}
				</Select>
				<Button type="submit" title={m.create_link()}>
					<LinkIcon size={16} />
				</Button>
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
		@apply text-5xl font-bold;
	}
	form {
		@apply md:col-span-2;
	}

	section.links {
		@apply grid gap-3 md:grid-cols-2;
		@apply m-3 w-full max-w-4xl md:m-7;
	}
</style>
