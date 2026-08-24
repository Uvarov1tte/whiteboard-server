import { db } from '@/db/index.js';
import { board_editors, boards, users} from '@/db/schema.js';
import { RequestCustom } from '@/types/index.js';
import { and, eq } from 'drizzle-orm';
import type { Response } from 'express';

export const getAllEditors = async (req: RequestCustom, res: Response) => {
  
}

export const addNewEditor = async (req: RequestCustom, res: Response) => {
  const user = req.user
  const newEditor = req.body
  const board = await db.query.boards.findFirst({
    where: and(
      eq(boards.id, newEditor.boardId),
      eq(boards.userId, user!.id)
    ),
  })
  const toAddEditor = await db.query.users.findFirst({
    where: eq(newEditor.username, users.username)
  })

  if (board && toAddEditor) {
    const addedEditor = await db.insert(board_editors).values({boardId: board.id, userId: toAddEditor.id}).returning()
    console.log(addedEditor[0])
    res.status(200).send(addedEditor[0])
  } else {
    res.sendStatus(400).send({ error: 'invalid board or unauthorized user' })
  }

}

export const deleteEditor = async (req: RequestCustom, res: Response) => {
  const user = req.user
  const toBeDeleted = req.body
  const board = await db.query.boards.findFirst({
    where: and(
      eq(boards.id, toBeDeleted.boardId),
      eq(boards.userId, user!.id)
    ),
  })

  if (board) {
    await db.delete(board_editors)
      .where(
        and(
          eq(board_editors.boardId, toBeDeleted.boardId),
          eq(board_editors.userId, toBeDeleted.userId)
        )
      )
    res.status(204).send({msg: 'deleted'})
  } else {
    res.sendStatus(400).send({ error: 'invalid board or unauthorized user' })
  }
}