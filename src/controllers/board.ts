import { db } from '@/db/index.js';
import { board_editors, boards, shape_lists, shapes } from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { validateNewBoard } from '@/utils/middleware.js';
import { and, eq } from 'drizzle-orm';
import type { Response } from 'express';
import express from 'express';
const boardRouter = express.Router()

boardRouter.get('/', async (req: RequestCustom, res: Response) => {
  const userId = req.user!.id
  const editorStatus = await db.query.board_editors.findMany({
    where: and(
      eq(board_editors.userId, userId)
    ),
  })

  const boardList: number[] = editorStatus.map(e => e.boardId)

  let allBoards: {
    id: number;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }[] = []

  for (let i of boardList) {
    const result = await db.query.boards.findFirst({
      // with: { shape_lists: true } 
      where: eq(boards.id, i),
    })
    if (result && !allBoards.includes(result)) {
      allBoards.push(result)
    }
  }

  res.status(200).send(allBoards)
})

boardRouter.get('/:id', async (req: RequestCustom, res: Response) => {
  const userId = req.user!.id
  const { id } = req.params
  const resultBoard = await db.query.boards.findFirst({
    where: and(
      eq(boards.id, Number(id)),
      eq(boards.userId, userId)
    ),
    with: { shape_lists: true },
  })

  const editorStatus = await db.query.board_editors.findFirst({
    where: and(
      eq(board_editors.boardId, Number(id)),
      eq(board_editors.userId, userId)
    ),
  })

  if (resultBoard && editorStatus) {
    const shapesArray: any[] = []
    for (const sh of resultBoard.shape_lists) {
      const shape = await db.query.shapes.findFirst({
        where: eq(shapes.id, sh.id)
      })
      if (shape) shapesArray.push(shape)
    }
    const sortedShapes = shapesArray.sort((a, b) => a.zIndex - b.zIndex)
    res.status(200).send({ board: resultBoard, shapes: sortedShapes })
  } else {
    res.status(404).send({ error: 'board does not exist or unauthorised user' })
  }
})

boardRouter.post('/', validateNewBoard, async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newBoard = {
    title: req.newBoardData!.title,
    userId: user!.id,
  }

  try {
    const addedBoard = await db.insert(boards).values(newBoard).returning()
    const newEditor = { userId: user!.id, boardId: addedBoard[0].id }
    await db.insert(board_editors).values(newEditor)
    res.status(200).send(addedBoard)
  } catch (error) {
    console.log(error)
    res.sendStatus(400).send({ msg: 'failed request' })
  }

})

boardRouter.post('/:id', async (req: RequestCustom, res: Response) => {
  const id = Number(req.params.id)
  const newShape = await db.insert(shapes).values(req.body).returning()
  await db.insert(shape_lists).values({ shapeId: newShape[0].id, boardId: id })
  res.status(201).send(newShape[0])
})

boardRouter.delete('/:id', async (req: RequestCustom, res: Response) => {
  const id = Number(req.params.id)
  const user = req.user
  try {
    await db.delete(board_editors)
      .where(
        eq(board_editors.boardId, id)
      )
    await db.delete(boards)
      .where(
        and(
          eq(boards.userId, user!.id),
          eq(boards.id, id)
        )
      )
    res.status(204).send({ msg: 'deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'invalid request' })
  }
})

export default boardRouter