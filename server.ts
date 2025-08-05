import { createServer } from 'http';
import { Server } from 'socket.io';
import { Socket } from "socket.io";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket: Socket) => {
  console.log(`user connect: ${socket.id}`);
  
  socket.on('message', (data: string[]) => {
    socket.broadcast.emit('message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on PORT:${PORT}`);
});