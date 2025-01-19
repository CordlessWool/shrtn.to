import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { nanoid } from 'nanoid';
import { db, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getMaxTTL, getNumber, getString, getTTLs, getURL } from '$lib/helper/form';
import { createAndLoginTempUser } from '$lib/helper/auth.server';
import { and, eq } from 'drizzle-orm';
import { HOUR_IN_MS, type Link } from '$lib/definitions';

const idLength = Number(env.PUBLIC_ID_LENGTH ?? 5);

type LoadData = {
	links: Link[];
};

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) {
		return {
			links: []
		} satisfies LoadData;
	}
	const data = db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			createdAt: schema.link.createdAt,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(eq(schema.link.userId, locals.user.id))
		.all();
	return {
		links: data
	} satisfies LoadData;
};

export const actions = {
	add: async (event) => {
		const { locals, request } = event;
		let { user } = locals;

		if (user == null) {
			// create tmp user
			({ user } = createAndLoginTempUser(event));
		}

		const data = await request.formData();
		const url: string = getURL(data.get('link'));
		const short: string = getString(data.get('short'), () => nanoid(idLength));
		const ttl: number = getNumber(data.get('ttl'), HOUR_IN_MS);
		const expiresAt = ttl === -1 ? null : new Date(Date.now() + ttl);

		if (ttl > getMaxTTL(!user.temp)) {
			return error(400, 'TTL too high');
		}
		db.insert(schema.link)
			.values([
				{
					id: short,
					url,
					userId: user.id,
					createdAt: new Date(),
					expiresAt
				}
			])
			.run();

		redirect(302, `/link/${short}`);
	},
	remove: async ({ locals, request }) => {
		const { user } = locals;
		if (user == null) {
			return error(401, 'Not Authenticated');
		}

		const data = await request.formData();
		const key = getString(data.get('key'));
		db.delete(schema.link)
			.where(and(eq(schema.link.id, key), eq(schema.link.userId, user.id)))
			.run();
		return { success: true };
	}
} satisfies Actions;
