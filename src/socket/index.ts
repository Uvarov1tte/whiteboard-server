import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on('change-tool', (tool: string) => {
    socket.broadcast.emit('receive-tool', tool, socket.id)
    console.log(tool)
  })
  socket.on('add-rect', (rectangles, shapes) => {
    // console.log(rectangles, shapes)
    socket.broadcast.emit('receive-rect', rectangles, shapes)
  })
  socket.on('change-rect', (rectangles) => {
    socket.broadcast.emit('edit-rect', rectangles)
  })
}