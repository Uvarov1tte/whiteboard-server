import type { Request, Response } from 'express';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketActions } from './socket/index.js';
import cors from 'cors'
import logInRouter from '@/routes/logIn.js';
import resetRouter from '@/routes/reset.js';
import sessionRouter from '@/routes/session.js';
import { tokenExtractor } from './utils/middleware.js';
import boardRouter from '@/routes/board.js';
import userRouter from '@/routes/user.js';
import shapeRouter from '@/routes/shape.js';
import logOutRouter from '@/routes/logOut.js';
import editorRouter from '@/routes/editor.js';

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:8000' }
})

app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:8000',
};
app.use(cors(corsOptions))

app.use('/logIn', logInRouter)
app.use('/logOut', logOutRouter)
app.use('/reset', resetRouter)
app.use('/session', tokenExtractor, sessionRouter)
app.use('/board', tokenExtractor, boardRouter)
app.use('/user', userRouter)
app.use('/shape', shapeRouter)
app.use('/editor', tokenExtractor, editorRouter)

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ msg: 'hello' })
})

io.on('connection', socketActions)

export default httpServer