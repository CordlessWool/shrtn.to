import { db, schema } from '$lib/server/db';
import { sendVerificationMail } from '$lib/server/mail';
import type { Actions } from './$types';
import { customAlphabet } from 'nanoid';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { LoginMailSchema } from '$lib/helper/form';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createUUID } from '$lib/helper/identifiers';
import { HOUR_IN_MS } from '$lib/helper/defaults';

const nanokey = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 4);

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
		const form = await superValidate(request, valibot(LoginMailSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, theme } = form.data;
		const userId = getUserId(email, locals.user?.id);

		const magicid = createUUID();
		const verification = nanokey();
		db.insert(schema.magicLink)
			.values([
				{
					id: magicid,
					userId,
					expiresAt: new Date(Date.now() + HOUR_IN_MS),
					verification
				}
			])
			.run();
		try {
			//send mail
			await sendVerificationMail(email, verification, theme);
		} catch (e) {
			console.error(e);
			error(500);
		}
		redirect(302, `/login/${magicid}`);
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
