import { PrismaClient, Stock, MarketSnapshot } from '@prisma/client';
import fetch from 'node-fetch';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || '';
const POLL_INTERVAL_MS = 90_000; // 90 seconds default

/**
 * Fetch latest quote for a symbol from Twelve Data.
 * Returns minimal fields needed for snapshot.
 */
async function fetchQuote(symbol: string) {
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(
    symbol,
  )}&apikey=${TWELVE_DATA_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'error') {
    throw new Error(`Twelve Data error: ${data.message}`);
  }
  return {
    price: Number(data.price),
    previousClose: Number(data.previous_close),
    dayHigh: Number(data.day_high),
    dayLow: Number(data.day_low),
    volume: Number(data.volume),
    // For the demo we set 52wk values to zero – could be fetched via another endpoint.
    fiftyTwoWkHigh: 0,
    fiftyTwoWkLow: 0,
  };
}

/**
 * Store snapshot in DB and cache the latest snapshot in Redis.
 */
async function storeSnapshot(stockId: string, symbol: string, quote: any) {
  const snapshot = await prisma.marketSnapshot.create({
    data: {
      stockId,
      price: quote.price,
      previousClose: quote.previousClose,
      dayHigh: quote.dayHigh,
      dayLow: quote.dayLow,
      volume: quote.volume,
      fiftyTwoWkHigh: quote.fiftyTwoWkHigh,
      fiftyTwoWkLow: quote.fiftyTwoWkLow,
    },
  });
  // Cache latest snapshot JSON for fast read by SSE workers.
  await redis.set(`stock:${symbol}:latest`, JSON.stringify(snapshot));
  return snapshot;
}

/**
 * Main polling loop – iterates over all distinct symbols in the DB.
 */
async function pollAllSymbols() {
  const symbols = await prisma.stock.findMany({
    select: { symbol: true, id: true },
  });
  for (const { symbol, id } of symbols) {
    try {
      const quote = await fetchQuote(symbol);
      await storeSnapshot(id, symbol, quote);
      console.log(`Fetched snapshot for ${symbol}`);
    } catch (e) {
      console.error(`Failed to fetch ${symbol}:`, (e as Error).message);
    }
  }
}

async function main() {
  console.log('Market ingestion worker started');
  while (true) {
    await pollAllSymbols();
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main().catch((e) => {
  console.error('Worker crashed', e);
  process.exit(1);
});

