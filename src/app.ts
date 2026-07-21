import type { Request, Response } from 'express';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketActions } from './socket/index.js';
import cors from 'cors'
import logInRouter from './controllers/logIn.js';
import resetRouter from './controllers/reset.js';
import sessionRouter from './controllers/session.js';
import { tokenExtractor } from './utils/middleware.js';
import boardRouter from './controllers/board.js';
import userRouter from './controllers/user.js';
import shapeRouter from './controllers/shape.js';
import logOutRouter from './controllers/logOut.js';
import editorRouter from './controllers/editor.js';

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