<script lang="ts">
	let { value = $bindable(), length, ...props } = $props();
</script>

<input bind:value maxlength={length} minlength={length} {...props} style="--n-char:{length}" />

<style>
	@reference "tailwindcss/theme";
	input {
		all: unset;
		@apply mb-3 text-7xl outline-none focus:ring-0;
		--char-w: 1ch;
		--gap: calc(0.4 * var(--char-w));
		/* --n-char: 4; */
		--in-w: calc(var(--n-char) * (var(--char-w) + var(--gap)));

		display: block;
		border: none;
		padding: 0;
		width: var(--in-w);
		background: repeating-linear-gradient(
				90deg,
				dimgrey 0,
				dimgrey var(--char-w),
				transparent 0,
				transparent calc(var(--char-w) + var(--gap))
			)
			0 100% / calc((var(--in-w) - var(--gap))) 2px no-repeat;
		letter-spacing: var(--gap);
	}
</style>
