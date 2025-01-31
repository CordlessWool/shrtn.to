<script lang="ts">
	const { children, transparent = false, error = false, disabled = false, ...props } = $props();
</script>

<button disabled={error === true || disabled === true} class:error class:transparent {...props}>
	{@render children()}
</button>

<style>
	@import './Button.css';
</style>
