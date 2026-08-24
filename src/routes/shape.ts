import { db } from '@/db/index.js'
import { shape_lists, shapes } from '@/db/schema.js'
import { RequestCustom } from '@/types/index.js'
import { tokenExtractor } from '@/utils/middleware.js'
import { eq, sql } from 'drizzle-orm'
import type { Response } from 'express'
import express from 'express'
const shapeRouter = express.Router()

shapeRouter.put(
  '/:id',
  tokenExtractor,
  async (req: RequestCustom, res: Response) => {
    const editedShape = await db
      .update(shapes)
      .set({
        updatedAt: sql`NOW()`,
        data: req.body.data,
      })
      .where(eq(shapes.id, req.body.id))
      .returning()
    res.status(200).send(editedShape[0])
  },
)

shapeRouter.delete(
  '/:id',
  tokenExtractor,
  async (req: RequestCustom, res: Response) => {
    const id = Number(req.params.id)
    await db.delete(shape_lists).where(eq(shape_lists.shapeId, id))
    await db.delete(shapes).where(eq(shapes.id, id))
    res.status(204).send({ msg: 'deleted' })
  },
)

export default shapeRouter
