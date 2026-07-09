import { db } from '@/db/index.js';
import { boards, shape_lists, shapes } from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { tokenExtractor } from '@/utils/middleware.js';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from "express";
const shapeRouter = express.Router()

shapeRouter.post('/', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newShape = await db.insert(shapes).values(req.body).returning()
  // console.log(newShape)
  await db.insert(shape_lists).values({ shapeId: newShape[0].id, boardId: 1 })
  
  res.status(201).send({ newShape })
})

export default shapeRouter