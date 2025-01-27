ALTER TABLE `magic_link` ADD `email` text NOT NULL;--> statement-breakpoint
CREATE INDEX `magic_expires_idx` ON `magic_link` (`expires_at`);--> statement-breakpoint
CREATE INDEX `link_expires_idx` ON `link` (`expires_at`);
