import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { setupSocket } from '@/lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT ?? 3000);
const hostname = '0.0.0.0';

async function start() {
  const nextApp = next({
    dev,
    dir: process.cwd(),
    conf: dev ? undefined : { distDir: './.next' },
  });

  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  const server = createServer((req, res) => {
    if (req.url?.startsWith('/api/socketio')) {
      return;
    }
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NEXTAUTH_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  setupSocket(io);

  server.listen(port, hostname, () => {
    console.warn(`> HVPS Sports ready on http://${hostname}:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
