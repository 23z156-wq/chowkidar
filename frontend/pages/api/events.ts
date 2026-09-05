import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    events: [
      {
        id: 'evt_1',
        symbol: 'RELIANCE',
        type: 'PRICE_SPIKE',
        title: 'Reliance spikes +4.2% on high volume',
        description: 'Unusual volume velocity detected in the last 15 minutes, 2.8x 4-hour rolling average.',
        status: 'SURFACED',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        dayGroup: 'Today',
        severity: 'high',
        corporateActionTag: 'Coincides with Q2 Financial Results & Board Meeting filing',
        reversionNote: null,
        correlatedSector: 'Energy Sector Move',
      },
      {
        id: 'evt_2',
        symbol: 'HDFCBANK',
        type: 'MARKET_DIVERGENCE',
        title: 'HDFC Bank drops against NIFTY index',
        description: 'NIFTY index is up +0.8% while HDFC Bank diverged downwards by -1.2%.',
        status: 'SURFACED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        dayGroup: 'Today',
        severity: 'high',
        corporateActionTag: 'Coincides with RBI Regulatory Reporting disclosure',
        reversionNote: null,
        correlatedSector: null,
      },
      {
        id: 'evt_3',
        symbol: 'TCS',
        type: 'VOLATILITY',
        title: 'TCS intraday swing breached 2.2 sigma',
        description: 'Intraday swing spiked +4.5%, returned to 4-hour baseline 35 mins later.',
        status: 'RESOLVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        dayGroup: 'Today',
        severity: 'medium',
        corporateActionTag: null,
        reversionNote: 'Auto-resolved: Spiked +4.5%, returned to normal baseline 35 min later',
        correlatedSector: 'Tech Rally',
      },
      {
        id: 'evt_4',
        symbol: 'INFY',
        type: 'BASELINE_RETURN',
        title: 'Infosys returned to normal baseline',
        description: 'Trading activity normalized after earlier 2.1x volume surge.',
        status: 'RESOLVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        dayGroup: 'Yesterday',
        severity: 'normal',
        corporateActionTag: 'Coincides with Dividend Record Date NSE filing',
        reversionNote: 'Auto-resolved on reversion to baseline parameters',
        correlatedSector: 'Tech Rally',
      },
    ]
  });
}
