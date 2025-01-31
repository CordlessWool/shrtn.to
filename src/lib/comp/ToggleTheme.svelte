<script lang="ts">
	import type { Action } from 'svelte/action';
	import { Sun, Moon } from 'lucide-svelte';
	import { theme as themeStore } from '$lib/stores';

	const darkLightModeAction: Action = (node) => {
		const toggle = () => {
			document.documentElement.classList.toggle('dark');
			const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
			themeStore.set(theme);
			localStorage.theme = theme;
		};

		node.addEventListener('click', toggle);

		$effect(() => {
			return () => {
				node.removeEventListener('click', toggle);
			};
		});
	};
</script>

<svelte:head>
	<script type="text/javascript">
		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<button class="transparent" aria-label="button" use:darkLightModeAction>
	<Sun class="hidden dark:block" />
	<Moon class="block dark:hidden" />
</button>

<style>
	@import './Button.css';
</style>
