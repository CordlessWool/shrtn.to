import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import type { Link } from '$lib/definitions';

export const GET: RequestHandler = ({ params }) => {
	const { shorten } = params;
	const link = db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			createdAt: schema.link.createdAt,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(eq(schema.link.id, shorten))
		.get();
	if (!link) {
		return error(404, 'Not Found');
	}

	return json(link satisfies Link);
};
