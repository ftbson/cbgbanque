ALTER TABLE `users` ADD `password_hash` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE TABLE `registration_otps` (
	`email` text PRIMARY KEY NOT NULL,
	`otp_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`verified_at` integer,
	`attempts` integer DEFAULT 0 NOT NULL
);
