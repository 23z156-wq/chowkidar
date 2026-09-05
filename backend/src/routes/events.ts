import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // Get all attention events for the authenticated user
  fastify.get('/', async (request, reply) => {
    const userId = (request as any).userId as string;
    const events = await prisma.attentionEvent.findMany({
      where: { userId },
      orderBy: { detectedAt: 'desc' },
    });
    return events;
  });

  // Mark an event as viewed
  fastify.patch('/:eventId/view', async (request, reply) => {
    const userId = (request as any).userId as string;
    const { eventId } = request.params as { eventId: string };
    const event = await prisma.attentionEvent.findUnique({ where: { id: eventId } });
    if (!event || event.userId !== userId) {
      return reply.code(404).send({ error: 'Not found' });
    }
    await prisma.attentionEvent.update({
      where: { id: eventId },
      data: { state: 'viewed', seenAt: new Date() },
    });
    return { success: true };
  });
};

export default eventsRoutes;

