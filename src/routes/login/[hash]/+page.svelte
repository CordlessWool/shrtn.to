<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import KeyInput from '$lib/comp/KeyInput.svelte';
	import Button from '$lib/comp/Button.svelte';
	import { ShieldCheck } from 'lucide-svelte';
	import InputFrame from '$lib/comp/InputFrame.svelte';
	const { data }: { data: PageData } = $props();

	const { form, enhance, errors } = superForm(data.form);
	errors.subscribe(console.log);
</script>

<main class="flex flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold">Enter verification key</h1>
	<p class="mb-6 text-lg">Please enter the 4-character key that was sent to your email.</p>
	<form class="flex flex-col items-center gap-7" action="?/verify" method="POST" use:enhance>
		<InputFrame error={$errors.key?.[0]}>
			<KeyInput type="text" name="key" length={4} bind:value={$form.key} />
		</InputFrame>
		<Button class="text-lg"><ShieldCheck />Verify</Button>
	</form>
</main>
