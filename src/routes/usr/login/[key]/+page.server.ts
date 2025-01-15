import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { loginUser } from '$lib/helper/auth.server';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { key } = event.params;
	const user = db
		.select({
			id: schema.user.id,
			temp: schema.user.temp
		})
		.from(schema.magicLink)
		.leftJoin(schema.user, eq(schema.user.id, schema.magicLink.userId))
		.where(eq(schema.magicLink.id, key))
		.get();
	console.log(user);
	if (!user) {
		error(401, 'Not Authorized');
	}

	if (user.temp === true) {
		db.update(schema.user).set({ temp: false }).where(eq(schema.user.id, user.id)).run();
	}
	db.delete(schema.magicLink).where(eq(schema.magicLink.id, key)).run();

	loginUser(event, user.id);
	redirect(302, '/');
};
