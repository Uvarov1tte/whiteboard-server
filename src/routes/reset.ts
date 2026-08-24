import { db } from '@/db/index.js'
import { users } from '@/db/schema.js'
import bcrypt from 'bcrypt'
import { sql } from 'drizzle-orm'

import type { Request, Response } from 'express'
import express from 'express'
const resetRouter = express.Router()

const resetDatabase = async () => {
  try {
    const tablesResult = await db.execute<{ table_name: string }>(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
    `)

    for (const table of tablesResult.rows || []) {
      await db.execute(
        sql`TRUNCATE "${sql.raw(table.table_name)}"  RESTART IDENTITY CASCADE;`,
      )
      console.log(`Dropped table: ${table.table_name}`)
    }
  } catch (error) {
    console.error('Error resetting database:', error)
    throw error
  }
}

interface newUser {
  username: string
  name: string
  password: string
}

export const addTestUser = async ({ username, name, password }: newUser) => {
  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(users).values({ username, name, passwordHash })
}

resetRouter.delete('/', async (req: Request, res: Response) => {
  await resetDatabase()
  res.status(204)
})

export default resetRouter
