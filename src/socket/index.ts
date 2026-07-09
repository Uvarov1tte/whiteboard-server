import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on('change-tool', (tool: string) => {
    socket.broadcast.emit('receive-tool', tool, socket.id)
    console.log(tool)
  })
  socket.on('add-shape', async (shape, allShapes) => {
    // console.log(boardId, shape, allShapes)
    const addedShapeArr = allShapes.concat([shape])
    console.log(addedShapeArr)
    socket.broadcast.emit('receive-shape', shape, addedShapeArr)
  })
  socket.on('change-shape', (shape) => {
    socket.broadcast.emit('edit-shape', shape)
  })
}