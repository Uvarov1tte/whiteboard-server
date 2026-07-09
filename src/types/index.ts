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