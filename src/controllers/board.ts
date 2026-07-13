import { db } from '@/db/index.js';
import { boards, shape_lists, shapes } from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { tokenExtractor } from '@/utils/middleware.js';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from "express";
const boardRouter = express.Router()

boardRouter.get('/', async (req: RequestCustom, res: Response) => {
  const result = await db.query.boards.findMany({
    // with: { shape_lists: true }
  })
  res.status(200).send(result)
})

boardRouter.get('/:id', async (req: RequestCustom, res: Response) => {
  const { id } = req.params
  const result = await db.query.boards.findFirst({
    where: eq(boards.id, Number(id)),
    with: { shape_lists: true }
  })

  if (result) {
    const shapesArray: any[] = []
    for (let sh of result.shape_lists) {
      const shape = await db.query.shapes.findFirst({
        where: eq(shapes.id, sh.id)
      })
      if (shape) shapesArray.push(shape)
    }
    const sortedShapes = shapesArray.sort((a, b) => a.zIndex - b.zIndex)
    res.status(200).send({ board: result, shapes: sortedShapes})
  }
})

boardRouter.post('/', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newBoard = {
    title: req.body.title,
    userId: user!.id,
  }

  try {
    const addedBoard = await db.insert(boards).values(newBoard).returning()
    res.status(200).send(addedBoard)
  } catch (error) {
    console.log(error)
    res.sendStatus(400).send({ msg: 'failed request' })
  }

})

boardRouter.post('/:id', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const id = req.params.id
  const newShape = await db.insert(shapes).values(req.body).returning()
  await db.insert(shape_lists).values({ shapeId: newShape[0].id, boardId: Number(id) })
  res.status(201).send(newShape[0])
})

export default boardRouter