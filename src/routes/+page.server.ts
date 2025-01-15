import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { nanoid } from 'nanoid';
import { db, schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { getNumber, getString, getURL } from '$lib/helper/form';
import { createAndLoginTempUser } from '$lib/helper/auth.server';
import { eq } from 'drizzle-orm';

const idLength = Number(env.PUBLIC_ID_LENGTH ?? 5);
const DAY = 86400;

export const load = (({ locals }) => {
	if (!locals.user) {
		return {};
	}
	const data = db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(eq(schema.link.userId, locals.user.id))
		.limit(3)
		.all();
	return {
		links: data
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async (event) => {
		const { locals, request } = event;
		let { user } = locals;

		if (user == null) {
			// create tmp user
			({ user } = createAndLoginTempUser(event));
		}

		const data = await request.formData();
		console.log(data, user);
		const url: string = getURL(data.get('link'));
		const short: string = getString(data.get('short'), () => nanoid(idLength));
		const ttl: number = getNumber(data.get('ttl'), DAY);

		db.insert(schema.link)
			.values([
				{
					id: short,
					url,
					userId: user.id,
					createdAt: new Date(),
					expiresAt: new Date(Date.now() + ttl * 1000)
				}
			])
			.run();

		redirect(302, `/link/${short}`);
	}
} satisfies Actions;
