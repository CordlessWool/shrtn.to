import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const { shorten } = params;
	const link = db
		.select({
			url: schema.link.url,
			id: schema.link.id,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(eq(schema.link.id, shorten))
		.get();
	return json(link);
};
