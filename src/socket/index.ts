import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on("join-room", (room: string, cb: (msg: string) => void) => {
    socket.join(room)
    cb(`Joined ${room}`)
  })
  socket.on('change-tool', (tool: string, room) => {
    socket.to(room).emit('receive-tool', tool, socket.id)
  })
  socket.on('add-shape', async (shape, allShapes, room) => {
    const addedShapeArr = allShapes.concat([shape])
    socket.to(room).emit('receive-shape', shape, addedShapeArr)
  })
  socket.on('edit-shape', (shape, room) => {
    socket.to(room).emit('receive-edited-shape', shape)
  })
}