import { db } from '@/db/index.js';
import { boards, shape_lists, shapes } from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { tokenExtractor } from '@/utils/middleware.js';
import { eq, sql } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from "express";
const shapeRouter = express.Router()

shapeRouter.post('/', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const newShape = await db.insert(shapes).values(req.body).returning()
  await db.insert(shape_lists).values({ shapeId: newShape[0].id, boardId: 1 })

  res.status(201).send(newShape[0])
})

shapeRouter.put('/:id', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const editedShape = await db.update(shapes)
    .set({
      updatedAt: sql`NOW()`,
      data: req.body.data
    })
    .where(eq(shapes.id, req.body.id))
    .returning()
  res.status(200).send(editedShape[0])
})

export default shapeRouter