import { db } from '@/db/index.js';
import { boards, users } from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { tokenExtractor } from '@/utils/middleware.js';
import type { Request, Response } from 'express';
import express from "express";
const boardRouter = express.Router()

boardRouter.get('/', async (req: RequestCustom, res: Response) => {
  const result = await db.query.boards.findMany({
    with: { user: true }
  })
  res.status(200).send(result)
})

boardRouter.post('/', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newBoard = {
    title: req.body.title,
    userId: user!.id,
  }
  console.log(newBoard)

  try {
    const addedBoard = await db.insert(boards).values(newBoard).returning()
    console.log(addedBoard)
    res.status(200).send(addedBoard)
  } catch (error) {
    console.log(error)
    res.sendStatus(400).send({msg: 'failed request'})
  }

})

export default boardRouter