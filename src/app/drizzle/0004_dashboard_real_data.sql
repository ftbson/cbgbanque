ALTER TABLE `transactions` ADD `related_id` text;
--> statement-breakpoint
DELETE FROM `cards` WHERE `type` = 'virtual_demo';
--> statement-breakpoint
DELETE FROM `transactions` WHERE `type` IN ('card_created', 'card_status');
--> statement-breakpoint
DELETE FROM `notifications` WHERE `type` = 'card';
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`duration_months` integer NOT NULL,
	`interest_rate` real DEFAULT 0 NOT NULL,
	`monthly_payment` real DEFAULT 0 NOT NULL,
	`total_payment` real DEFAULT 0 NOT NULL,
	`dossier_fees` real DEFAULT 0 NOT NULL,
	`purpose` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
