import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const link = sqliteTable('link', {
	id: text('id').primaryKey(),
	link: text('link').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' })
});

export type Session = typeof session.$inferSelect;
export type Link = typeof link.$inferSelect;
export type User = typeof user.$inferSelect;
