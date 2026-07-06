CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
