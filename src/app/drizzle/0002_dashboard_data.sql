CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`balance_cents` integer DEFAULT 0 NOT NULL,
	`reserved_cents` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'virtual_demo' NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cards_reference_unique` ON `cards` (`reference`);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`read_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `vaults` ADD `target_cents` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `vaults` ADD `current_cents` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `vaults` ADD `created_at` text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE `vaults`
SET `target_cents` = `target` * 100,
	`current_cents` = coalesce(`current`, 0) * 100,
	`created_at` = datetime('now');
