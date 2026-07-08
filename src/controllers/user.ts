import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import express from "express";
const userRouter = express.Router()
import { db } from '@/db/index.js';
import { users } from '@/db/schema.js';
import { eq } from 'drizzle-orm';

userRouter.post('/', async (req: Request, res: Response) => {
  const { name, username, password } = req.body
  const newUser = { name, username, password }
  try {
    const insertedUser = await db.insert(users).values({ ...newUser })
      .returning({ id: users.id, name: users.name, username: users.username })
    res.status(201).send(insertedUser)
  } catch (err) {
    console.log(err)
    res.sendStatus(400).send({ msg: 'failed request' })
  }
})

userRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(id))
  })
  if (user) {
    const foundUser = {
      id: user.id,
      name: user.name,
      username: user.username
    }
    res.status(200).send(foundUser)
  } else {
    res.sendStatus(404).send({ msg: 'not found' })
  }

})

export default userRouter