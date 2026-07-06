import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express';
import express from "express";
const loginRouter = express.Router()
import config from '@/utils/config.js'
import { db } from '@/db/index.js';
const { SECRET } = config

loginRouter.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body

  // const user = await User.findOne({
  //   where: { username }
  // })
  // const passwordCorrect = user === null
  //   ? false
  //   : await bcrypt.compare(password, user.passwordHash)
  // const User = await db.query.users.findFirst();
  console.log(db.query)

  const user = {
    id: 1,
    name: 'test',
    username: 'test',
    password: 'qwerty'
  }

  const passwordCorrect = user === null
    ? false 
    : password === user.password


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
  // const result = await Session.create({ token: token })
  res.status(200).send({
    token: token,
    username: user.username,
    name: user.name
  })
})

export default loginRouter