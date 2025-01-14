import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { db, schema } from '$lib/server/db/index.js';
import { lte } from 'drizzle-orm';

const HOUR = 3600000;
const TEN_MINUTES = 600000;
const cleanupLinks = () => {
	// Remove expired links
	db.delete(schema.link).where(lte(schema.link.expiresAt, new Date())).run();
};

setInterval(cleanupLinks, TEN_MINUTES);

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth);
