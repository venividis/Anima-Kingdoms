CREATE TABLE `commons_arrivals` (
	`key_hash` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`credential_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `commons_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`player_id` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commons_credentials_token_hash` ON `commons_credentials` (`token_hash`);--> statement-breakpoint
CREATE TABLE `commons_journal` (
	`revision` integer PRIMARY KEY NOT NULL,
	`at` integer NOT NULL,
	`player_id` text NOT NULL,
	`credential_id` text NOT NULL,
	`op` text NOT NULL,
	`transfers` text NOT NULL,
	`previous_hash` text NOT NULL,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `commons_limits` (
	`principal` text PRIMARY KEY NOT NULL,
	`window` integer NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `commons_realm` (
	`id` integer PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`checksum` text NOT NULL,
	`revision` integer NOT NULL,
	`secret` text NOT NULL,
	`head_hash` text NOT NULL,
	`commit_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `commons_receipts` (
	`credential_id` text NOT NULL,
	`command_key` text NOT NULL,
	`bytes` text NOT NULL,
	`receipt` text NOT NULL,
	`checksum` text NOT NULL,
	PRIMARY KEY(`credential_id`, `command_key`)
);
