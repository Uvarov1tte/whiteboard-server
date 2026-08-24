import { relations } from 'drizzle-orm'
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core'

export const shapeTypesEnum = pgEnum('shapes_types', ['rect', 'circle'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull().default(''),
  token: text('token'),
})

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().default('Untitled board'),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const shapes = pgTable('shapes', {
  id: serial('id').primaryKey(),
  type: shapeTypesEnum('type').notNull(),
  data: jsonb('data').notNull(),
  zIndex: integer('z_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const shape_lists = pgTable('shape_lists', {
  id: serial('id').primaryKey(),
  shapeId: integer('shape_id')
    .notNull()
    .references(() => shapes.id),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
})

export const board_editors = pgTable('board_editors', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
})

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
  board_editors: many(board_editors),
}))

export const boardsRelations = relations(boards, ({ one, many }) => ({
  user: one(users, {
    fields: [boards.userId],
    references: [users.id],
  }),
  shape_lists: many(shape_lists),
  board_editors: many(board_editors),
}))

export const shapesRelations = relations(shapes, ({ one }) => ({
  shape_lists: one(shape_lists),
}))

export const shapeListsRelations = relations(shape_lists, ({ one }) => ({
  shape: one(shapes, {
    fields: [shape_lists.shapeId],
    references: [shapes.id],
  }),
  board: one(boards, {
    fields: [shape_lists.boardId],
    references: [boards.id],
  }),
}))

export const boardUsersRelations = relations(
  board_editors,
  ({ one, many }) => ({
    boards: one(boards, {
      fields: [board_editors.boardId],
      references: [boards.id],
    }),
    users: one(users, {
      fields: [board_editors.userId],
      references: [users.id],
    }),
  }),
)
