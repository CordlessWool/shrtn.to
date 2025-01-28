<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import KeyInput from '$lib/comp/KeyInput.svelte';
	import Button from '$lib/comp/Button.svelte';
	import { ShieldCheck, Send, Shell, CircleX } from 'lucide-svelte';
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import ThemeHiddenInput from '$lib/comp/ThemeHiddenInput.svelte';
	import * as m from '$lib/paraglide/messages';

	const { data }: { data: PageData } = $props();
	let sendMailFailed = $state(false);
	const {
		form: verifyForm,
		enhance: verifyEnhance,
		errors: verifyErrors,
		submitting: verifySubmitting
	} = superForm(data.verificationForm);
	const { enhance: resendEnhance, submitting: resendSubmitting } = superForm(data.resendForm, {
		onError: () => {
			sendMailFailed = true;
		}
	});
</script>

<main class="flex flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold">{m.verification_headline()}</h1>

	<p>{m.verification_subline({ keyLength: data.keyLength })}</p>
	<form
		method="POST"
		action="?/resend"
		use:resendEnhance
		class="mb-7 flex flex-row items-center gap-3"
	>
		<p class=" text-xl">{data.mail}</p>
		<ThemeHiddenInput />
		<Button
			disabled={$resendSubmitting}
			class="text-sm"
			transparent
			error={sendMailFailed}
			type="submit"
			>{#if $resendSubmitting}
				<Shell class="animate-spin" size={14} />{m.sending()}
			{:else if sendMailFailed}
				<CircleX size={14} />{m.send_failed()}
			{:else}<Send size={14} />{m.send_again()}{/if}
		</Button>
	</form>
	<form class="flex flex-col items-center gap-3" action="?/verify" method="POST" use:verifyEnhance>
		<InputFrame error={$verifyErrors.key?.[0]}>
			<KeyInput type="text" name="key" length={data.keyLength} bind:value={$verifyForm.key} />
		</InputFrame>
		<Button disabled={$verifySubmitting} class="text-lg"
			><ShieldCheck class={$verifySubmitting ? 'animate-spin' : ''} />{m.verify()}</Button
		>
	</form>
</main>
