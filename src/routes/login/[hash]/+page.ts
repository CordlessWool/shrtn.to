import { VerificationSchema } from '$lib/helper/form';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const form = await superValidate(valibot(VerificationSchema));
	return {
		form
	};
};
