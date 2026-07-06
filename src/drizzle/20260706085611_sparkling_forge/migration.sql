CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL
);
