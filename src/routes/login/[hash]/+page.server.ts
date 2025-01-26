import { db, schema } from '$lib/server/db';
import { eq, and, gte } from 'drizzle-orm';
import type { Actions } from './$types';
import { loginUser } from '$lib/helper/auth.server';
import { error, redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth';
import { VerificationSchema } from '$lib/helper/form';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const actions = {
	verify: async (event) => {
		const { locals, params, request } = event;
		const { hash } = params;

		const form = await superValidate(request, valibot(VerificationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const user = db
			.select({
				id: schema.user.id,
				temp: schema.user.temp
			})
			.from(schema.magicLink)
			.innerJoin(schema.user, eq(schema.magicLink.userId, schema.user.id))
			.where(
				and(
					eq(schema.magicLink.id, hash),
					eq(schema.magicLink.verification, form.data.key),
					gte(schema.magicLink.expiresAt, new Date())
				)
			)
			.get();

		if (!user) {
			return message(form, 'Invalid key');
		}

		if (locals.user?.temp === false && locals.user?.id !== user.id) {
			//TODO: redirect to a page to switch user
			error(401, 'Logout to switch user');
		}

		if (user.temp === true) {
			db.update(schema.user).set({ temp: false }).where(eq(schema.user.id, user.id)).run();
		} else if (locals.user?.id && locals.user.temp === true) {
			db.update(schema.link)
				.set({ userId: user.id })
				.where(eq(schema.link.userId, locals.user.id))
				.run();
			if (locals.session) {
				invalidateSession(locals.session.id);
			}
			db.delete(schema.user).where(eq(schema.user.id, locals.user.id)).run();
		}
		db.delete(schema.magicLink).where(eq(schema.magicLink.id, hash)).run();

		loginUser(event, user.id);
		redirect(302, '/');
	}
} satisfies Actions;
