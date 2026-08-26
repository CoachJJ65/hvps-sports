import { Server } from 'socket.io';

export function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    socket.emit('message', {
      text: 'Connected to HVPS Sports',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
      // no-op
    });
  });
}
