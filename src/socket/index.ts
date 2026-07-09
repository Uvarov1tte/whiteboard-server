import { db } from "@/db/index.js"
import { shapes } from "@/db/schema.js"
import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on('change-tool', (tool: string) => {
    socket.broadcast.emit('receive-tool', tool, socket.id)
    console.log(tool)
  })
  socket.on('add-shape', async (boardId, shape, allShapes) => {
    console.log(boardId, shape, allShapes)
    // const newShape = await db.insert(shapes).values(shape)
    // console.log(newShape)
    socket.broadcast.emit('receive-shape', shape, shapes)
  })
  socket.on('change-shape', (shape) => {
    socket.broadcast.emit('edit-shape', shape)
  })
}