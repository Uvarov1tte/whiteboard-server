import { db } from '@/db/index.js'
import {
  board_editors,
  boards,
  shape_lists,
  shapes,
  users,
} from '@/db/schema.js'
import { RequestCustom } from '@/types/index.js'
import { and, eq } from 'drizzle-orm'
import type { Response } from 'express'

export const getAllBoards = async (req: RequestCustom, res: Response) => {
  const userId = req.user!.id
  const editorStatus = await db.query.board_editors.findMany({
    where: and(eq(board_editors.userId, userId)),
  })

  const boardList: number[] = editorStatus.map((e) => e.boardId)

  const allBoards: {
    id: number
    title: string
    userId: number
    createdAt: Date
    updatedAt: Date
  }[] = []

  for (const i of boardList) {
    const result = await db.query.boards.findFirst({
      // with: { shape_lists: true }
      where: eq(boards.id, i),
    })
    if (result && !allBoards.includes(result)) {
      allBoards.push(result)
    }
  }

  res.status(200).send(allBoards)
}

export const getOneBoard = async (req: RequestCustom, res: Response) => {
  const userId = req.user!.id
  const { id } = req.params
  const resultBoard = await db.query.boards.findFirst({
    where: and(eq(boards.id, Number(id))),
    with: {
      shape_lists: true,
      user: {
        columns: {
          username: true,
        },
      },
      board_editors: {
        with: {
          users: {
            columns: {
              username: true,
            },
          },
        },
      },
    },
  })
  console.log(resultBoard)

  const editorStatus = await db.query.board_editors.findFirst({
    where: and(
      eq(board_editors.boardId, Number(id)),
      eq(board_editors.userId, userId),
    ),
  })

  if (resultBoard && editorStatus) {
    const shapesArray: any[] = []
    for (const sh of resultBoard.shape_lists) {
      const shape = await db.query.shapes.findFirst({
        where: eq(shapes.id, sh.shapeId),
      })
      if (shape) shapesArray.push(shape)
    }
    const sortedShapes = shapesArray.sort((a, b) => a.zIndex - b.zIndex)
    res.status(200).send({ board: resultBoard, shapes: sortedShapes })
  } else {
    res.status(404).send({ error: 'board does not exist or unauthorised user' })
  }
}

export const addNewBoard = async (req: RequestCustom, res: Response) => {
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
}

export const addShapeToBoard = async (req: RequestCustom, res: Response) => {
  const id = Number(req.params.id)
  const newShape = await db.insert(shapes).values(req.body).returning()
  await db.insert(shape_lists).values({ shapeId: newShape[0].id, boardId: id })
  res.status(201).send(newShape[0])
}

export const deleteBoard = async (req: RequestCustom, res: Response) => {
  const id = Number(req.params.id)
  const user = req.user
  try {
    await db.delete(board_editors).where(eq(board_editors.boardId, id))
    await db
      .delete(boards)
      .where(and(eq(boards.userId, user!.id), eq(boards.id, id)))
    res.status(204).send({ msg: 'deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'invalid request' })
  }
}

export const getAllEditors = async (req: RequestCustom, res: Response) => {
  const userId = req.user!.id
  const { id } = req.params
  const resultBoard = await db.query.boards.findFirst({
    where: and(eq(boards.id, Number(id))),
    with: {
      board_editors: {
        with: {
          users: {
            columns: {
              username: true,
            },
          },
        },
      },
    },
  })

  const editorIdList = resultBoard?.board_editors.map((i) => i.userId)

  if (editorIdList?.includes(userId)) {
    const editorList = resultBoard?.board_editors.map((i) => i.users.username)
    res.status(200).send(editorList)
  } else {
    return res.status(401).json({ error: 'unauthorized' })
  }
}

export const addNewEditor = async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newEditor = req.body
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, newEditor.boardId), eq(boards.userId, user!.id)),
  })
  const toAddEditor = await db.query.users.findFirst({
    where: eq(newEditor.username, users.username),
  })

  if (board && toAddEditor) {
    const addedEditor = await db
      .insert(board_editors)
      .values({ boardId: board.id, userId: toAddEditor.id })
      .returning()
    console.log(addedEditor[0])
    res.status(200).send(addedEditor[0])
  } else {
    res.sendStatus(400).send({ error: 'invalid board or unauthorized user' })
  }
}

export const deleteEditor = async (req: RequestCustom, res: Response) => {
  const user = req.user
  console.log(req.params)
  const id = req.params.id as string
  const username = req.params.username as string

  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, Number(id)), eq(boards.userId, user!.id)),
  })

  const toDeleteEditor = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (board && toDeleteEditor) {
    await db
      .delete(board_editors)
      .where(
        and(
          eq(board_editors.boardId, board.id),
          eq(board_editors.userId, toDeleteEditor.id),
        ),
      )
    res.status(204).send({ msg: 'deleted' })
  } else {
    res.sendStatus(400).send({ error: 'invalid board or unauthorized user' })
  }
}
