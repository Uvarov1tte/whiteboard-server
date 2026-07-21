import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Response } from 'express';
import express from 'express';
const logInRouter = express.Router()
import config from '@/utils/config.js'
import { db } from '@/db/index.js';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema.js';
import { validateLogin } from '@/utils/middleware.js';
import { RequestCustom } from '@/types/index.js';
const { SECRET } = config

logInRouter.post('/', validateLogin, async (req: RequestCustom, res: Response) => {
  const { username, password } = req.logInData!

  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  })

  const passwordCorrect = user === undefined || null
    ? false
    : await bcrypt.compare(password, user!.passwordHash)


  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, { algorithm: 'HS256', })
  await db.update(users)
    .set({ token: token })
    .where(eq(users.username, username))

  res.status(200).send({
    token: token,
    username: user.username,
    name: user.name,
    id: user.id
  })
})

export default logInRouter