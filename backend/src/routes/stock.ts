import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { computeScore, maybeCreateEvent } from '../scoring';

const prisma = new PrismaClient();

const stockRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // Get latest snapshot and score for a specific stock for the authenticated user
  fastify.get('/latest/:symbol', async (request, reply) => {
    const userId = (request as any).userId as string;
    const { symbol } = request.params as { symbol: string };
    const stock = await prisma.stock.findUnique({ where: { symbol } });
    if (!stock) {
      return reply.code(404).send({ error: 'Stock not found' });
    }
    const latest = await prisma.marketSnapshot.findFirst({
      where: { stockId: stock.id },
      orderBy: { timestamp: 'desc' },
    });
    if (!latest) {
      return reply.code(404).send({ error: 'No market data' });
    }
    const scoreInfo = await computeScore({ userId, stockId: stock.id, snapshot: latest });
    // Persist event if needed
    await maybeCreateEvent({ userId, stockId: stock.id, snapshot: latest, scoreInfo });
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: latest.price,
      timestamp: latest.timestamp,
      score: scoreInfo.score,
      components: scoreInfo.components,
    };
  });
};

export default stockRoutes;

