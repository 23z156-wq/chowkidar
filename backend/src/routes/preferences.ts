import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const preferencesRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // Get current user's preference weights and display currency
  fastify.get('/', async (request, reply) => {
    const userId = (request as any).userId as string;
    const pref = await prisma.attentionPreference.findUnique({ where: { userId } });
    if (!pref) {
      return reply.code(404).send({ error: 'Preferences not found' });
    }
    return pref;
  });

  // Update weights (increment/decrement) – for demo we allow partial updates
  fastify.patch('/', async (request, reply) => {
    const userId = (request as any).userId as string;
    const body = request.body as Partial<{
      priceWeight: number;
      volumeWeight: number;
      divergenceWeight: number;
      noveltyWeight: number;
      displayCurrency: string;
    }>;
    const updated = await prisma.attentionPreference.update({
      where: { userId },
      data: body,
    });
    return updated;
  });
};

export default preferencesRoutes;

