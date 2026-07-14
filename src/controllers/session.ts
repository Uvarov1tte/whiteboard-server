import dotenv from 'dotenv';
dotenv.config();
import type { Response } from 'express';
import express from 'express';
const sessionRouter = express.Router()
import { RequestCustom } from '@/types/index.js';

sessionRouter.get('/', async (req: RequestCustom, res: Response) => {
  const user = req.user
  res.status(200).send(user)
})

export default sessionRouter