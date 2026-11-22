CREATE TABLE IF NOT EXISTS `orders` (
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
CREATE TABLE IF NOT EXISTS `bizum_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`recipient_name` text,
	`phone_number` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `analytics_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`visit_date` text NOT NULL,
	`country` text NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL
);
