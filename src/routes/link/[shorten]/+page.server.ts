import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pathWithLang } from '$lib/helper/path';

export const load = (() => {
	redirect(302, pathWithLang('/'));
}) satisfies PageServerLoad;
