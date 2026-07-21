import { addNewEditor, deleteEditor } from '@/controllers/editor.js';
import express from 'express';
const editorRouter = express.Router()

editorRouter.route('/')
  .post(addNewEditor)
  .delete(deleteEditor)

export default editorRouter