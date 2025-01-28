import { db, schema } from '$lib/server/db';
import { eq, and, gte } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { loginUser } from '$lib/helper/auth.server';
import { error, redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth';
import { ThemeSchema, VerificationSchema } from '$lib/helper/form';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { sendVerificationMail } from '$lib/server/mail';
import { pathWithLang } from '$lib/helper/path';

const maskmail = (mail: string) => {
	const [name, domain] = mail.split('@');
	const half = Math.ceil(name.length / 2);
	return `${name.slice(0, half)}${'*'.repeat(half)}@${domain}`;
};

export const load: PageServerLoad = async (event) => {
	const { locals, params } = event;
	if (locals.user && locals.user.temp === false) {
		redirect(302, pathWithLang('/'));
	}

	const data = db
		.select({
			mail: schema.magicLink.email,
			key: schema.magicLink.verification,
			expiresAt: schema.magicLink.expiresAt
		})
		.from(schema.magicLink)
		.where(and(eq(schema.magicLink.id, params.hash), gte(schema.magicLink.expiresAt, new Date())))
		.get();

	if (!data) {
		redirect(302, pathWithLang('/login'));
	}

	const [verificationForm, resendForm] = await Promise.all([
		superValidate(valibot(VerificationSchema)),
		superValidate(valibot(ThemeSchema))
	]);

	return {
		resendForm,
		verificationForm,
		mail: maskmail(data.mail),
		keyLength: data.key.length,
		expiresAt: data.expiresAt
	};
};

export const actions = {
	resend: async (event) => {
		const { params } = event;
		const { hash } = params;
		const form = await superValidate(event.request, valibot(ThemeSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const data = db
			.select({
				email: schema.magicLink.email,
				key: schema.magicLink.verification
			})
			.from(schema.magicLink)
			.where(and(eq(schema.magicLink.id, hash), gte(schema.magicLink.expiresAt, new Date())))
			.get();

		if (!data) {
			redirect(302, pathWithLang('/login'));
		}

		await sendVerificationMail(data.email, data.key, form.data.theme);
		return message(form, 'Mail sent');
	},
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
			setError(form, 'key', 'Key is invalid or expired');
			return fail(400, { form });
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
		redirect(302, pathWithLang('/'));
	}
} satisfies Actions;
