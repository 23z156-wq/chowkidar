import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const watchlistRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // All routes expect auth plugin to have populated request.userId
  fastify.get('/', async (request, reply) => {
    const userId = (request as any).userId as string;
    const items = await prisma.watchlistStock.findMany({
      where: { userId },
      include: { stock: true },
    });
    return items.map((i) => ({
      id: i.id,
      symbol: i.stock.symbol,
      name: i.stock.name,
      sector: i.stock.sector,
      addedAt: i.addedAt,
    }));
  });

  fastify.post('/', async (request, reply) => {
    const userId = (request as any).userId as string;
    const { symbol, name, sector } = request.body as {
      symbol: string;
      name?: string;
      sector?: string;
    };
    if (!symbol) {
      return reply.code(400).send({ error: 'symbol required' });
    }
    // Upsert stock record
    const stock = await prisma.stock.upsert({
      where: { symbol },
      update: {},
      create: { symbol, name: name ?? symbol, sector: sector ?? '' },
    });
    // Create watchlist entry
    const entry = await prisma.watchlistStock.create({
      data: { userId, stockId: stock.id },
    });
    return { success: true, entryId: entry.id };
  });

  fastify.delete('/:watchId', async (request, reply) => {
    const userId = (request as any).userId as string;
    const { watchId } = request.params as { watchId: string };
    // Ensure it belongs to user
    const existing = await prisma.watchlistStock.findUnique({ where: { id: watchId } });
    if (!existing || existing.userId !== userId) {
      return reply.code(404).send({ error: 'Not found' });
    }
    await prisma.watchlistStock.delete({ where: { id: watchId } });
    return { success: true };
  });
};

export default watchlistRoutes;

