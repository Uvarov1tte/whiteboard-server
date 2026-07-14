import type { Response } from 'express';
import express from "express";
const logoutRouter = express.Router()
import { db } from '@/db/index.js';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema.js';
import { tokenExtractor } from '@/utils/middleware.js';
import { RequestCustom } from '@/types/index.js';

logoutRouter.put('/', tokenExtractor, async (req: RequestCustom, res: Response) => {
  const id = req.user?.id
  await db.update(users)
    .set({
      token: null
    })
    .where(eq(users.id, Number(id)))
  
  res.sendStatus(204)
})

export default logoutRouter