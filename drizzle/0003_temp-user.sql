DROP INDEX `user_username_unique`;--> statement-breakpoint
ALTER TABLE `user` ADD `temp` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
ALTER TABLE `user` ADD `service` text;--> statement-breakpoint
ALTER TABLE `user` ADD `service_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `last_seen` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `age`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `password_hash`;