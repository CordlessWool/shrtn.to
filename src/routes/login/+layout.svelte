<script lang="ts">
	import Header from '$lib/comp/Header.svelte';
	let { children } = $props();
</script>

<Header></Header>

{@render children()}
