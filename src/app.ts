import type { Request, Response } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketActions } from "./socket/index.js";
import cors from 'cors'
import loginRouter from "./controllers/login.js";
import resetRouter from "./controllers/reset.js";
import sessionRouter from "./controllers/session.js";
import { tokenExtractor } from "./utils/middleware.js";
import boardRouter from "./controllers/board.js";

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

app.use('/login', loginRouter)
app.use('/reset', resetRouter)
app.use('/session', tokenExtractor, sessionRouter)
app.use('/board', boardRouter)

app.get('/', (req: Request, res: Response) => {
    console.log('hello')
    res.status(200).send({ msg: 'hello' })
})

io.on("connection", socketActions)

export default httpServer