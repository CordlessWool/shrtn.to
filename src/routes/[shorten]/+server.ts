import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { db, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params }) => {
	const { shorten } = params;
	const data = db
		.select({
			link: schema.link.link
		})
		.from(schema.link)
		.where(eq(schema.link.id, shorten))
		.get();
	if (data == null) {
		error(404);
	}
	redirect(301, data.link);
};
