import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { db, schema } from '$lib/server/db/index.js';
import { lte } from 'drizzle-orm';
import { HOUR_IN_MS } from '$lib/helper/defaults';

const cleanupLinks = () => {
	// Remove expired links and magic links
	db.delete(schema.link).where(lte(schema.link.expiresAt, new Date())).run();
	db.delete(schema.magicLink).where(lte(schema.magicLink.expiresAt, new Date())).run();
};

setInterval(cleanupLinks, HOUR_IN_MS);

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}

	const { session, user } = auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return await resolve(event);
};

export const handle: Handle = sequence(handleAuth, i18n.handle());
