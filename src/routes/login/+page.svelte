<script lang="ts">
	import InputFrame from '$lib/comp/InputFrame.svelte';
	import Input from '$lib/comp/Input.svelte';
	import Button from '$lib/comp/Button.svelte';
	import { LogIn, Mail } from 'lucide-svelte';
	import { enhance } from '$app/forms';
</script>

<main>
	<section>
		<h1>Login</h1>
		<form method="POST" use:enhance class="inputs">
			<InputFrame for="mail" label="E-Mail" info="We will send you a link to login">
				<Mail />
				<Input id="mail" name="email" />
				<Button formaction="?/mail">
					<LogIn size={16} />
				</Button>
			</InputFrame>
			<div></div>
		</form>
	</section>
</main>

<style lang="postcss">
	main {
		@apply flex flex-col items-center justify-center gap-3 p-3 md:p-7;
		@apply bg-zinc-800 text-zinc-200;
	}

	h1 {
		@apply mb-7 text-3xl font-bold;
	}

	.inputs {
		@apply rounded-md border-2 border-zinc-700;
		@apply p-3;
	}
</style>
