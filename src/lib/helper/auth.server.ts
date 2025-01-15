import { db, schema } from '$lib/server/db';
import { nanoid } from 'nanoid';
import * as auth from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const createAndLoginTempUser = (event: RequestEvent) => {
	const userId = nanoid();
	const user = {
		id: userId,
		temp: true,
		email: null,
		lastSeen: new Date(),
		createdAt: new Date()
	};
	db.insert(schema.user).values([user]).run();

	const sessionToken = auth.generateSessionToken();
	const session = auth.createSession(sessionToken, userId);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return { user, session } satisfies App.Locals;
};
