import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	temp: integer('temp', { mode: 'boolean' }).notNull(),
	email: text('email').unique(),
	service: text('service'),
	serviceId: text('service_id'),
	lastSeen: integer('last_seen', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const magicLink = sqliteTable(
	'magic_link',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		verification: text('verification').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
		email: text('email').notNull()
	},
	(table) => ({
		expiresIdx: index('expires_idx').on(table.expiresAt)
	})
);

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const link = sqliteTable(
	'link',
	{
		id: text('id').primaryKey(),
		url: text('url').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' })
	},
	(table) => ({
		expiresIdx: index('expires_idx').on(table.expiresAt)
	})
);

export type Session = typeof session.$inferSelect;
export type Link = typeof link.$inferSelect;
export type User = typeof user.$inferSelect;
