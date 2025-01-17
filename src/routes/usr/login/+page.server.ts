import { getString } from '$lib/helper/form';
import { db, schema } from '$lib/server/db';
import { mail } from '$lib/server/mail';
import type { Actions } from './$types';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const HOUR_IN_MS = 3600000;

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
		const id = nanoid(20);
		db.insert(schema.user).values([
			{
				id,
				temp: true,
				email: email.toLowerCase(),
				createdAt: new Date(),
				lastSeen: new Date()
			}
		]);
		return id;
	}
};

export const actions = {
	mail: async ({ request, locals }) => {
		const data = await request.formData();
		const email = getString(data.get('email'));
		const userId = getUserId(email, locals.user?.id);

		const magicid = nanoid(20);
		db.insert(schema.magicLink)
			.values([
				{
					id: magicid,
					userId,
					expiresAt: new Date(Date.now() + HOUR_IN_MS * 3)
				}
			])
			.run();
		mail(
			email,
			'Your login link',
			`
		Hello there!
		Click the link below to login:
		http://localhost:5173/usr/login/${magicid}
		`
		);
		// send email
		return { success: true };
	}
} satisfies Actions;
