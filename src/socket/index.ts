import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on('change-tool', (tool: string) => {
    socket.broadcast.emit('receive-tool', tool, socket.id)
    console.log(tool)
  })
}