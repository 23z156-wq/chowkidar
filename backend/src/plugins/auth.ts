import { FastifyPluginAsync } from 'fastify';
import fastifyJwt from '@fastify/jwt';

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  const secret = process.env.SUPABASE_JWT_SECRET || 'fallback-secret-key-for-chowkidar-dev';
  
  await fastify.register(fastifyJwt, {
    secret,
  });

  fastify.decorateRequest('userId', '');

  fastify.addHook('preHandler', async (request, reply) => {
    // Skip auth for health check, docs, and public endpoints
    if (request.url.startsWith('/health') || request.url.startsWith('/sse/')) {
      return;
    }

    // Support dev/testing header
    const devUserId = request.headers['x-user-id'] as string;
    if (devUserId) {
      (request as any).userId = devUserId;
      return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      // For local development convenience, fallback to demo-user if in development
      if (process.env.NODE_ENV !== 'production') {
        (request as any).userId = 'demo-user-1';
        return;
      }
      return reply.code(401).send({ error: 'Missing Authorization header' });
    }

    try {
      const decoded = await request.jwtVerify() as any;
      // Supabase JWT stores the user's UUID in the `sub` claim
      (request as any).userId = decoded.sub || decoded.userId || decoded.id;
    } catch (err) {
      // In development fallback if signature verification fails
      if (process.env.NODE_ENV !== 'production') {
        (request as any).userId = 'demo-user-1';
        return;
      }
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }
  });
};

export default authPlugin;

