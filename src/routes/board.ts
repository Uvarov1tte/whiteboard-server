import { addNewBoard, addNewEditor, addShapeToBoard, deleteBoard, deleteEditor, getAllBoards, getAllEditors, getOneBoard } from '@/controllers/board.js';
import { validateNewBoard } from '@/utils/middleware.js';
import express from 'express';
const boardRouter = express.Router()

boardRouter.route('/')
  .get(getAllBoards)
  .post(validateNewBoard, addNewBoard)
  
boardRouter.route('/:id')
  .get(getOneBoard)
  .post(addShapeToBoard)
  .delete(deleteBoard)

boardRouter.route('/:id/editor')
  // .get(getAllEditors)
  .post(addNewEditor)
  .delete(deleteEditor)

export default boardRouter