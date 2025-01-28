<script>
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
</script>

<footer>
	<a rel="alternative" hreflang="en" href={i18n.route(page.url.pathname)}>EN</a>
	<a rel="alternative" hreflang="de" href={i18n.route(page.url.pathname)}>DE</a>
	<span>{m.made_with_love()} <a href="https://dropanote.de">CordlessWool</a></span>
</footer>

<style lang="postcss">
	footer {
		@apply my-3 flex justify-center text-zinc-600;
		@apply divide-x-2 divide-zinc-600;
	}

	footer > * {
		@apply px-5;
	}

	:global(.dark) {
		footer {
			@apply text-zinc-400;
		}
	}
	a {
		@apply underline-offset-4 hover:font-bold hover:underline;
		@apply transform transition-all duration-300 ease-in-out hover:scale-105;
	}
</style>
