import { Socket } from "socket.io"

export const socketActions = (socket: Socket) => {
  console.log("user connected", socket.id)
  socket.on('change-tool', (tool: string) => {
    console.log(tool)
  })
}