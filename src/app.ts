import type { Request, Response } from "express";
import express from "express";
import loginRouter from "./controllers/login.js";
import resetRouter from "./controllers/reset.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketActions } from "./socket/index.js";

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:8000' }
})

app.use(express.json())

app.use('/login', loginRouter)
app.use('/reset', resetRouter)

app.get('/', (req: Request, res: Response) => {
    console.log('hello')
    res.status(200).send({ msg: 'hello' })
})

io.on("connection", socketActions )

export default httpServer