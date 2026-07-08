CREATE TYPE "public"."shapes_types" AS ENUM('rect', 'circle');--> statement-breakpoint
CREATE TABLE "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'Untitled board' NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shape_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_id" integer NOT NULL,
	"board_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "shapes_types" NOT NULL,
	"data" jsonb NOT NULL,
	"z_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	"token" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shape_lists" ADD CONSTRAINT "shape_lists_shape_id_shapes_id_fk" FOREIGN KEY ("shape_id") REFERENCES "public"."shapes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shape_lists" ADD CONSTRAINT "shape_lists_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;