import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""),
  // token: text("token")
})

// export const usersRelations = relations(users, ({ many }) => ({}))