<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import KeyInput from '$lib/comp/KeyInput.svelte';
	import Button from '$lib/comp/Button.svelte';
	import { ShieldCheck, Send, Shell, CircleX } from 'lucide-svelte';
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import { enhance as svelteEnhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	const { data }: { data: PageData } = $props();

	const { form, enhance: superEnhance, errors } = superForm(data.form);
	const SEND = {
		READY: 0,
		SENDING: 1,
		FAILED: 2
	};
	let mailStatus = $state(SEND.READY);

	const handleSendResult = (result: ActionResult) => {
		if (result.type === 'success') {
			setTimeout(() => {
				mailStatus = SEND.READY;
			}, 11000);
		} else if (result.type === 'error') {
			mailStatus = SEND.FAILED;
		}
	};
</script>

<main class="flex flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold">Enter verification key</h1>

	<p>Please enter the 4-character key that was sent to your email.</p>
	<form
		method="POST"
		action="?/resend"
		use:svelteEnhance={() =>
			({ result }) => {
				mailStatus = SEND.SENDING;
				return handleSendResult(result);
			}}
		class="mb-7 flex flex-row items-center gap-3"
	>
		<p class=" text-xl">{data.mail}</p>
		<Button
			disabled={mailStatus === SEND.SENDING}
			class="text-sm"
			transparent
			error={mailStatus === SEND.FAILED}
			type="submit"
			>{#if mailStatus === SEND.SENDING}
				<Shell class="animate-spin" size={14} />sending
			{:else if mailStatus === SEND.FAILED}
				<CircleX size={14} />failed
			{:else}<Send size={14} />send again{/if}
		</Button>
	</form>
	<form class="flex flex-col items-center gap-3" action="?/verify" method="POST" use:superEnhance>
		<InputFrame error={$errors.key?.[0]}>
			<KeyInput type="text" name="key" length={4} bind:value={$form.key} />
		</InputFrame>
		<Button class="text-lg"><ShieldCheck />Verify</Button>
	</form>
</main>
