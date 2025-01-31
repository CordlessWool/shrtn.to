<script lang="ts">
	const { children, transparent = false, error = false, disabled = false, ...props } = $props();
</script>

<button disabled={error === true || disabled === true} class:error class:transparent {...props}>
	{@render children()}
</button>

<style>
	@reference "tailwindcss/theme";
	button {
		@apply flex flex-row items-center justify-center gap-2 text-nowrap;
		@apply p-3;
		@apply rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none;
	}

	button:enabled {
		@apply transform transition-all duration-300 ease-in-out hover:scale-105;
	}

	button:not(.transparent) {
		@apply bg-teal-400 shadow-md;

		&.error {
			@apply bg-red-400;
		}

		&:enabled {
			@apply hover:bg-teal-500;
		}
	}

	button.transparent {
		@apply bg-transparent text-teal-700;

		&.error {
			@apply text-red-700;
		}

		&:enabled {
			@apply hover:text-teal-800;
		}
	}

	:global(.dark) {
		button:not(.transparent) {
			@apply bg-teal-800 hover:bg-teal-700;

			&.error {
				@apply hover:bg-red-700;
			}

			&:enabled {
				@apply hover:bg-teal-700;
			}
		}

		button.transparent {
			@apply text-teal-600;

			&.error {
				@apply text-red-400;
			}

			&:enabled {
				@apply hover:text-teal-500;
			}
		}
	}
</style>
