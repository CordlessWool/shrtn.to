import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { nanoid } from 'nanoid';
import { db, schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { getNumber, getString, getURL } from '$lib/helper/form';

const idLength = Number(env.PUBLIC_ID_LENGTH ?? 5);
const DAY = 86400;

export const load = (() => {
	// TODO: Get ref to load data
	const data = db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.limit(3)
		.all();
	return {
		links: data
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const url: string = getURL(data.get('link'));
		const short: string = getString(data.get('short'), () => nanoid(idLength));
		const ttl: number = getNumber(data.get('ttl'), DAY);
		const userId = locals.user?.id ?? 'default';
		db.insert(schema.link)
			.values([
				{
					id: short,
					url,
					userId,
					createdAt: new Date(),
					expiresAt: new Date(Date.now() + ttl * 1000)
				}
			])
			.run();

		redirect(301, `/link/${short}`);
	}
} satisfies Actions;
