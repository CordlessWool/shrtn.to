import type { RequestHandler } from './$types';
import { eq, and, gte } from 'drizzle-orm';
import { db, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params }) => {
	const { shorten } = params;
	const data = db
		.select({
			link: schema.link.url
		})
		.from(schema.link)
		.where(and(eq(schema.link.id, shorten), gte(schema.link.expiresAt, new Date())))
		.get();
	if (data == null) {
		error(404);
	}
	redirect(302, data.link);
};
