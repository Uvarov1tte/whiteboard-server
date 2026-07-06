import type { Request, Response } from "express";
import express from "express";
import loginRouter from "./controllers/login.js";
import resetRouter from "./controllers/reset.js";

const app = express()
app.use(express.json())

app.use('/login', loginRouter)
app.use('/reset', resetRouter)

app.get('/', (req: Request, res: Response) => {
    console.log('hello')
    res.status(200).send({ msg: 'hello' })
})

export default app