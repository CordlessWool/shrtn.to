<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import '../app.css';
	import Footer from '$lib/comp/Footer.svelte';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	{@render children()}

	<Footer />
</ParaglideJS>
