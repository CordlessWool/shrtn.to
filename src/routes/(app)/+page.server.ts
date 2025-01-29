import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getLinkSchema, getString } from '$lib/helper/form';
import { createAndLoginTempUser } from '$lib/helper/auth.server';
import { and, eq, gte, isNull, or } from 'drizzle-orm';
import { pathWithLang } from '$lib/helper/path';
import { nanoid } from 'nanoid';
import { SHORTEN_LENGTH } from '$lib/helper/defaults';

export const load: PageServerLoad = async ({ locals }) => {
	const form = superValidate(valibot(getLinkSchema(!!locals.user && !locals.user.temp)));
	if (!locals.user) {
		return {
			links: [],
			form: await form
		};
	}
	const data = db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			createdAt: schema.link.createdAt,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(
			and(
				eq(schema.link.userId, locals.user.id),
				or(gte(schema.link.expiresAt, new Date()), isNull(schema.link.expiresAt))
			)
		)
		.all();

	return {
		links: data,
		form: await form
	};
};

export const actions = {
	add: async (event) => {
		const { locals, request } = event;
		let { user } = locals;

		if (user == null) {
			// create tmp user
			({ user } = createAndLoginTempUser(event));
		}

		const LinkSchema = getLinkSchema(!user.temp);
		const form = await superValidate(request, valibot(LinkSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { ttl, link: url, short } = form.data;
		const expiresAt = ttl === Infinity ? null : new Date(Date.now() + ttl);
		console.log(form.data, expiresAt);
		let counter = 10;
		let id = 'abc';
		do {
			try {
				db.insert(schema.link)
					.values([
						{
							id,
							url,
							userId: user.id,
							createdAt: new Date(),
							expiresAt
						}
					])
					.run();
				counter = 0;
			} catch (err) {
				if (
					err != null &&
					typeof err === 'object' &&
					!Array.isArray(err) &&
					'code' in err &&
					err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
				) {
					id = nanoid(SHORTEN_LENGTH - (counter - 10));
					continue;
				} else {
					throw err;
				}
			}
		} while (counter-- > 0);

		redirect(302, pathWithLang(`/link/${short}`));
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
