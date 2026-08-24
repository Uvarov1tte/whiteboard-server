import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';


export interface RequestCustom extends Request {
  token?: string,
  decodedToken?: string | JwtPayload,
  user?: {
    username: string,
    name: string,
    token: string | null,
    id: number
  }
  registerData?: {
    username: string,
    name: string,
    password: string
  }
  logInData?: {
    username: string,
    password: string
  }
  newBoardData?: {
    title: string
  }
}
