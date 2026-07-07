import { relations } from "drizzle-orm"
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""),
  token: text("token")
})

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled board"),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards)
}))

export const boardsRelations = relations(boards, ({ one }) => ({
  user: one(users, {
    fields: [boards.userId],
    references: [users.id],
  }),
}))

// export const usersRelations = relations(users, ({ many }) => ({}))