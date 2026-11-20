CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`balance_cents` integer DEFAULT 0 NOT NULL,
	`reserved_cents` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`iban` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analytics_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`visit_date` text NOT NULL,
	`country` text NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bizum_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`recipient_name` text,
	`phone_number` text
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'virtual_demo' NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`card_number` text,
	`expiry` text,
	`cvv` text,
	`pin` text DEFAULT '4812',
	`card_holder` text,
	`card_tier` text DEFAULT 'Classic',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cards_reference_unique` ON `cards` (`reference`);--> statement-breakpoint
CREATE TABLE `loans` (
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
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`country` text NOT NULL,
	`street_address` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text NOT NULL,
	`subtotal` real NOT NULL,
	`shipping_cost` real NOT NULL,
	`grand_total` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`stripe_session_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registration_otps` (
	`email` text PRIMARY KEY NOT NULL,
	`otp_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`verified_at` integer,
	`attempts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`related_id` text,
	`description` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`civility` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text NOT NULL,
	`birth_date` text NOT NULL,
	`birth_place` text NOT NULL,
	`nationality` text NOT NULL,
	`residence_country` text NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`postal_code` text NOT NULL,
	`profession` text NOT NULL,
	`monthly_income` text,
	`document_type` text NOT NULL,
	`id_card_front` text,
	`id_card_back` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`transfers_blocked` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vaults` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`target_cents` integer NOT NULL,
	`current_cents` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `withdrawal_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`recipient_name` text NOT NULL,
	`iban` text NOT NULL,
	`bic` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`description` text,
	`otp_code` text DEFAULT '',
	`status` text DEFAULT 'pending_review' NOT NULL,
	`halt_percent` integer DEFAULT 75,
	`halt_message` text,
	`error_code` text DEFAULT 'ERR_SEPA_75',
	`created_at` text NOT NULL
);
