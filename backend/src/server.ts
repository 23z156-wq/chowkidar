import Fastify from 'fastify';
import cors from '@fastify/cors';
import FastifySSEPlugin from 'fastify-sse-v2';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authPlugin from './plugins/auth';
import watchlistRoutes from './routes/watchlist';
import stockRoutes from './routes/stock';
import preferencesRoutes from './routes/preferences';
import eventsRoutes from './routes/events';

dotenv.config();

const prisma = new PrismaClient();
const server = Fastify({ logger: true });

// Root & Health check
server.get('/', async () => ({
  name: 'Chowkidar API',
  tagline: 'Your market. Watched.',
  status: 'online',
  endpoints: {
    health: '/health',
    watchlist: '/api/watchlist',
    stock: '/api/stock/latest/:symbol',
    events: '/api/events',
    preferences: '/api/preferences',
    sse: '/sse/:userId',
  },
}));

server.get('/health', async () => ({ status: 'ok' }));

// SSE endpoint for user‑specific events
server.get('/sse/:userId', async (req, reply) => {
  const { userId } = req.params as { userId: string };
  const stream = reply.sse();
  const interval = setInterval(() => {
    stream.write({ event: 'ping', data: JSON.stringify({ timestamp: new Date() }) });
  }, 30000);
  req.raw.on('close', () => clearInterval(interval));
});

const start = async () => {
  try {
    await server.register(cors, { origin: true });
    await server.register(FastifySSEPlugin);
    await server.register(authPlugin);

    // Protected API routes
    await server.register(watchlistRoutes, { prefix: '/api/watchlist' });
    await server.register(stockRoutes, { prefix: '/api/stock' });
    await server.register(preferencesRoutes, { prefix: '/api/preferences' });
    await server.register(eventsRoutes, { prefix: '/api/events' });

    const port = Number(process.env.PORT) || 4000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Chowkidar server running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

