import { drizzle } from 'drizzle-orm/better-sqlite3';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
export * as schema from './schema';

const getDatabaseURL = () => {
	if (building) {
		return ':memory:';
	}
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}
	return env.DATABASE_URL;
};
export const db = drizzle(getDatabaseURL());
