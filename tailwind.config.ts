import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [forms]
} satisfies Config;
