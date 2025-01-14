import type { Actions } from './$types';
import { env } from '$env/dynamic/public';
import { nanoid } from 'nanoid';
import { db, schema } from '$lib/server/db';

const idLength = Number(env.PUBLIC_ID_LENGTH ?? 5);
const DAY = 86400;
const getNumber = (value: string | FormDataEntryValue | null, defaultValue?: number): number => {
	const number = Number(value);
	if (number) {
		return number;
	} else if (defaultValue) {
		return defaultValue;
	}

	throw new Error('Value is required');
};

const getURL = (value: string | FormDataEntryValue | null): string => {
	if (value == null) {
		throw new Error('Value is required');
	}

	const url = String(value);
	if (url.match(/^[A-Za-z]+:\/\//)) {
		return url;
	}
	return `https://${url}`;
};

const getString = (
	value: string | FormDataEntryValue | null,
	defaultValue?: string | (() => string)
) => {
	if (value != null && value.length >= idLength) {
		const string = String(value);
		return string;
	} else if (defaultValue != null) {
		if (typeof defaultValue === 'string') {
			return defaultValue;
		}
		console.log(defaultValue(), idLength);
		return defaultValue();
	}

	throw new Error('Value is required');
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const url: string = getURL(data.get('link'));
		const short: string = getString(data.get('short'), () => nanoid(idLength));
		const ttl: number = getNumber(data.get('ttl'), DAY);
		const userId = locals.user?.id ?? 'default';
		db.insert(schema.link)
			.values([
				{
					id: short,
					url,
					userId,
					createdAt: new Date(),
					expiresAt: new Date(Date.now() + ttl * 1000)
				}
			])
			.run();

		return { success: true };
	}
} satisfies Actions;
