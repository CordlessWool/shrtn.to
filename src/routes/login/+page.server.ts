import { db, schema } from '$lib/server/db';
import { mail } from '$lib/server/mail';
import type { Actions } from './$types';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/public';
import { error, fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { LoginMailSchema } from '$lib/helper/form';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createUUID } from '$lib/helper/identifiers';

const HOUR_IN_MS = 3600000;
const EXPIRE_IN_HOURS = 3;
const EXPIRE_IN_MS = HOUR_IN_MS * EXPIRE_IN_HOURS;

const getUserId = (email: string, userId: string | null | undefined): string => {
	const user = db
		.select({ id: schema.user.id })
		.from(schema.user)
		.where(eq(schema.user.email, email.toLowerCase()))
		.get();

	if (user) {
		return user.id;
	} else if (userId) {
		db.update(schema.user)
			.set({ email: email.toLowerCase() })
			.where(eq(schema.user.id, userId))
			.run();
		return userId;
	} else {
		const id = createUUID();
		db.insert(schema.user)
			.values([
				{
					id,
					temp: true,
					email: email.toLowerCase(),
					createdAt: new Date(),
					lastSeen: new Date()
				}
			])
			.run();
		return id;
	}
};

export const actions = {
	mail: async ({ request, locals }) => {
		try {
			const form = await superValidate(request, valibot(LoginMailSchema));
			if (!form.valid) {
				return fail(400, { form });
			}
			const { email } = form.data;
			const userId = getUserId(email, locals.user?.id);

			const magicid = createUUID();
			db.insert(schema.magicLink)
				.values([
					{
						id: magicid,
						userId,
						expiresAt: new Date(Date.now() + EXPIRE_IN_MS)
					}
				])
				.run();
			const magicLinkUrl = new URL(`login/${magicid}`, env.PUBLIC_BASE_URL);

			await mail(
				email,
				'Your login link',
				`
		Hello there!

		Click the link below to login:
		${magicLinkUrl.href}

		The link will expire in ${EXPIRE_IN_HOURS} hours.
		`
			);
			// send email
			return message(form, 'Mail sent');
		} catch (e) {
			console.error(e);
			error(500);
		}
	},
	logout: (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
} satisfies Actions;
