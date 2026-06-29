import type { Request, Response } from "express";
import express from "express";

const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    console.log('hello')
    res.status(200).send({ msg: 'hello' })
})

export default app