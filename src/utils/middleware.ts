import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from './config.js'
import { eq } from 'drizzle-orm'
import { db } from '@/db/index.js'
import { users } from '@/db/schema.js'
import { RequestCustom } from '@/types/index.js'
import { BoardValidation, LogInValidation, RegisterValidation } from '@/zod/schema.js'

export const tokenExtractor = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  // console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.token = authorization.substring(7)
      req.decodedToken = jwt.verify(authorization.substring(7), config.SECRET)

      const user = await db.query.users.findFirst({
        where: eq(users.token, authorization.substring(7))
      })

      if (!user) {
        return res.status(404).json({ error: 'user does not exist' })
      } else {
        req.user = {
          id: user.id,
          name: user.name,
          username: user.username,
          token: user.token
        }
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

export const validateRegister = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, username, password } = req.body
  const result = RegisterValidation.safeParse({ name, username, password });
  if (!result.success) {
    const errors = JSON.parse(result.error.message)
    // console.log(errors)
    const errorMsg: { [key: string]: string | null } = {
      name: null,
      username: null,
      password: null
    }
    for (const i of errors) {
      const path: string = i.path[0]
      errorMsg[path] = i.message
    }
    // console.log(errorMsg)

    res.status(400).send({ error: errorMsg })
  } else {
    req.registerData = result.data
    next()
  }
}

export const validateLogin = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  const result = LogInValidation.safeParse({ username, password });
  if (!result.success) {
    const errors = JSON.parse(result.error.message)
    // console.log(errors)
    const errorMsg: { [key: string]: string | null } = {
      username: null,
      password: null
    }
    for (const i of errors) {
      const path: string = i.path[0]
      errorMsg[path] = i.message
    }
    // console.log(errorMsg)

    res.status(401).send({ error: errorMsg })
  } else {
    req.logInData = result.data
    next()
  }
}

export const validateNewBoard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { title } = req.body
  const result = BoardValidation.safeParse({ title });
  if (!result.success) {
    const errors = JSON.parse(result.error.message)
    // console.log(errors)
    const errorMsg: { [key: string]: string | null } = {
      title: null,
    }
    for (const i of errors) {
      const path: string = i.path[0]
      errorMsg[path] = i.message
    }
    // console.log(errorMsg)

    res.status(400).send({ error: errorMsg })
  } else {
    req.newBoardData = result.data
    next()
  }
}