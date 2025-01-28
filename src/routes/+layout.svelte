<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';

	import '../app.css';
	import Footer from '$lib/comp/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>m.title()</title>
	<meta name="description" content={m.meta_description()} />
	<meta name="keywords" content={m.meta_keywords()} />
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}

	<Footer />
</ParaglideJS>
