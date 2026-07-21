import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const userRouter = express.Router()
import { validateRegister } from '@/utils/middleware.js';
import { addNewUser, getUserById } from '@/controllers/user.js';

userRouter.post('/', validateRegister, addNewUser)

userRouter.get('/:id', getUserById)

export default userRouter