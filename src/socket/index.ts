import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on("join-room", (room: string, cb: (msg: string) => void) => {
    socket.join(room)
    cb(`Joined ${room}`)
  })
  socket.on('change-tool', (tool: string, room) => {
    socket.to(room).emit('receive-tool', tool, socket.id)
    console.log(tool)
  })
  socket.on('add-shape', async (shape, allShapes, room) => {
    // console.log(boardId, shape, allShapes)
    const addedShapeArr = allShapes.concat([shape])
    console.log(room)
    socket.to(room).emit('receive-shape', shape, addedShapeArr)
  })
  socket.on('edit-shape', (shape, room) => {
    console.log(room)
    socket.to(room).emit('receive-edited-shape', shape)
  })
}