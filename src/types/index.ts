import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import type { ZodError } from 'zod';

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
  } | ZodError
  loginData?: {
    username: string,
    password: string
  } | ZodError
  newBoardData?: {
    title: string
  } | ZodError
}


// export type ShapeType = 'rect' | 'circle' | 'line' | 'txt'

// export interface ShapeObj {
//   id: number,
//   type: ShapeType,
//   data: RectObj | CircObj,
//   zIndex: number
// }

// export interface RectObj {
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   // zIndex: number,
//   fill: string,
//   // id: string
// }

// export interface CircObj {
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   // zIndex: number,
//   fill: string,
//   // id: string
// }