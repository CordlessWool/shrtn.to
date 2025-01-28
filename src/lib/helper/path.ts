import { languageTag, sourceLanguageTag } from '$lib/paraglide/runtime';
import { join } from 'path';

export const pathWithLang = (path: string): string => {
	const lang = languageTag();
	if (lang === sourceLanguageTag) {
		return path;
	}

	return join('/', lang, path);
};
