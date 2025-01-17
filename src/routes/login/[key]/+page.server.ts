import { db, schema } from '$lib/server/db';
import { eq, lte, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { loginUser } from '$lib/helper/auth.server';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { key } = event.params;
	const { locals } = event;

	const user = db
		.select({
			id: schema.user.id,
			temp: schema.user.temp
		})
		.from(schema.magicLink)
		.rightJoin(schema.user, eq(schema.user.id, schema.magicLink.userId))
		.where(and(eq(schema.magicLink.id, key), lte(schema.magicLink.expiresAt, new Date())))
		.get();

	if (!user) {
		error(401, 'Not Authorized');
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
		db.delete(schema.user).where(eq(schema.user.id, locals.user.id)).run();
	}
	db.delete(schema.magicLink).where(eq(schema.magicLink.id, key)).run();

	loginUser(event, user.id);
	redirect(302, '/');
};
