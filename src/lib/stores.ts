import { writable } from 'svelte/store';
import { THEME } from './helper/defaults';
import { browser } from '$app/environment';

const getThemeColor = () => {
	if (browser) {
		return document.documentElement.classList.contains('dark') ? THEME.DARK : THEME.LIGHT;
	} else {
		return THEME.LIGHT;
	}
};

const themeStore = writable(getThemeColor());
export const theme = {
	set: (value: 'dark' | 'light') =>
		value === 'dark' ? themeStore.set(THEME.DARK) : themeStore.set(THEME.LIGHT),
	subscribe: themeStore.subscribe
};
