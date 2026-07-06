import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express';
import express from "express";
const loginRouter = express.Router()
import config from '@/utils/config.js'
import { db } from '@/db/index.js';
import { eq } from 'drizzle-orm';
const { SECRET } = config

loginRouter.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await db.query.users.findFirst({
    where: eq(username, username)
  })

  const passwordCorrect = user === null
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

  const token = jwt.sign(userForToken, SECRET, { algorithm: "HS256", })
  res.status(200).send({
    token: token,
    username: user.username,
    name: user.name
  })
})

export default loginRouter