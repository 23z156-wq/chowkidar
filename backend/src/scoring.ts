import { PrismaClient, AttentionEvent, Stock, MarketSnapshot, AttentionPreference } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

const prisma = new PrismaClient();

/**
 * Helper to compute standard deviation.
 */
function stdDev(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Compute rolling baseline statistics for a stock.
 * Returns mean and stddev for price % change and mean volume.
 */
export async function computeBaseline(stockId: string, windowSize = 20) {
  const snapshots = await prisma.marketSnapshot.findMany({
    where: { stockId },
    orderBy: { timestamp: 'desc' },
    take: windowSize,
  });
  if (snapshots.length < 2) {
    return null; // not enough data
  }
  const priceChanges: number[] = [];
  const volumes: number[] = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i];
    const cur = snapshots[i - 1];
    const pct = ((cur.price.toNumber() - prev.price.toNumber()) / prev.price.toNumber()) * 100;
    priceChanges.push(pct);
    volumes.push(cur.volume.toNumber());
  }
  const meanMove = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
  const stdMove = stdDev(priceChanges);
  const meanVol = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  return { meanMove, stdMove, meanVol };
}

/**
 * Compute attention score for a new snapshot compared to baseline and user preferences.
 */
export async function computeScore(params: {
  userId: string;
  stockId: string;
  snapshot: MarketSnapshot;
}) {
  const { userId, stockId, snapshot } = params;
  const baseline = await computeBaseline(stockId);
  if (!baseline) {
    // No baseline yet – treat as novelty bonus only
    const novelty = await isNovel(userId, stockId);
    const weight = await getUserWeights(userId);
    const score = novelty * weight.noveltyWeight * 10; // scaled
    return { score: Math.min(100, Math.round(score)), components: { novelty: Math.round(score) } };
  }

  // price anomaly component (0‑30 points)
  const prior = await prisma.marketSnapshot.findFirst({
    where: { stockId },
    orderBy: { timestamp: 'desc' },
    skip: 1,
  });
  const priceMovePct = ((snapshot.price.toNumber() - prior!.price.toNumber()) / prior!.price.toNumber()) * 100;
  const priceAnomalyRaw = Math.abs(priceMovePct - baseline.meanMove) / baseline.stdMove;
  const priceAnomaly = Math.min(30, Math.round(priceAnomalyRaw * 10)); // simple scaling

  // volume anomaly component (0‑30 points)
  const volumeMultiple = snapshot.volume.toNumber() / baseline.meanVol;
  const volumeAnomaly = Math.min(30, Math.round((volumeMultiple - 1) * 15)); // scaling

  // market divergence – placeholder (requires sector index data)
  const marketDivergence = 0; // TODO: fetch sector move

  // novelty – binary tiered bonus
  const novelty = (await isNovel(userId, stockId)) ? 15 : 0;

  const weights = await getUserWeights(userId);
  const rawScore =
    priceAnomaly * weights.priceWeight +
    volumeAnomaly * weights.volumeWeight +
    marketDivergence * weights.divergenceWeight +
    novelty * weights.noveltyWeight;

  const normalized = Math.min(100, Math.round(rawScore));
  return {
    score: normalized,
    components: { priceAnomaly, volumeAnomaly, marketDivergence, novelty },
    priceMovePct,
    volumeMultiple,
  };
}

async function isNovel(userId: string, stockId: string): Promise<boolean> {
  const obs = await prisma.userObservation.findFirst({
    where: { userId, stockId },
    orderBy: { observedAt: 'desc' },
  });
  return !obs; // if never observed, it's novel
}

async function getUserWeights(userId: string): Promise<AttentionPreference> {
  const pref = await prisma.attentionPreference.findUnique({ where: { userId } });
  if (pref) return pref;
  // create default if missing
  return await prisma.attentionPreference.create({
    data: { userId },
  });
}

/**
 * After computing a score, persist an AttentionEvent if the score passes a threshold.
 */
export async function maybeCreateEvent(params: {
  userId: string;
  stockId: string;
  snapshot: MarketSnapshot;
  scoreInfo: ReturnType<typeof computeScore>;
}) {
  const { userId, stockId, snapshot, scoreInfo } = params;
  const THRESHOLD = 30; // simple threshold for demo
  if (scoreInfo.score >= THRESHOLD) {
    await prisma.attentionEvent.create({
      data: {
        userId,
        stockId,
        score: scoreInfo.score,
        state: 'detected',
        reasons: scoreInfo.components as any,
        detectedAt: new Date(),
      },
    });
  }
}

