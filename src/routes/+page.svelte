<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<main>
	<h1>shrtn.to</h1>
	<p>A small easy to setup open-source link shortener.</p>
	<form method="POST" use:enhance>
		<input name="link" />
	</form>
</main>

<style lang="postcss">
	main {
		@apply flex min-h-screen flex-col items-center justify-center gap-3;
		@apply bg-zinc-700 text-white;
	}
	h1 {
		@apply text-4xl;
	}
	input {
		@apply w-full px-5 py-3;
		@apply bg-zinc-700;
		@apply rounded-md border-2 border-solid border-zinc-500;
	}

	input:focus,
	input:active,
	input:hover {
		@apply border-zinc-300;
	}
</style>
