<script lang="ts">
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import Input from '$lib/comp/Input.svelte';
	import Button from '$lib/comp/Button.svelte';
	import { LogIn, Mail } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { LoginMailSchema } from '$lib/helper/form';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores';

	const { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.user && !data.user.temp) {
			goto('/');
		}
	});

	const { form, errors, enhance } = superForm(data.form, {
		applyAction: true,
		validators: valibotClient(LoginMailSchema)
	});
</script>

<main>
	<section>
		<h1>Login</h1>
		<form method="POST" use:enhance action="?/mail" class="inputs">
			<InputFrame
				for="mail"
				label="E-Mail"
				info="We will send you a link to login"
				error={$errors.email?.[0]}
			>
				<Mail />
				<Input id="mail" name="email" bind:value={$form.email} />
				<Button type="submit">
					<LogIn size={16} />
				</Button>
			</InputFrame>
			<input type="hidden" name="theme" value={$theme} />
		</form>
	</section>
</main>

<style lang="postcss">
	main {
		@apply flex flex-col items-center justify-center gap-3 p-3 md:p-7;
	}

	h1 {
		@apply mb-7 text-3xl font-bold;
	}

	.inputs {
		@apply rounded-md border-2 border-zinc-300;
		@apply p-3;
	}

	:global(.dark) {
		.inputs {
			@apply border-zinc-700;
		}
	}
</style>
