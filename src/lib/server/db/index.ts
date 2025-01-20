import { drizzle } from 'drizzle-orm/bun-sqlite';
import { building } from '$app/environment';
import { Database } from 'bun:sqlite';
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
const client = new Database(getDatabaseURL());
export const db = drizzle(client);
