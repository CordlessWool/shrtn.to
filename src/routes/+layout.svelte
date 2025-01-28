<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';

	import '../app.css';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	{@render children()}

	<footer>
		{m.made_with_love()} <a href="https://dropanote.de">CordlessWool</a>
	</footer>
</ParaglideJS>
