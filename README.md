# 🛡️ Chowkidar — Notice What Matters

> **A calm, consumer-first stock-watchlist attention triage platform.**  
> Chowkidar does not execute trades; it tells you what changed, why it matters, and whether your attention is required. Designed with a Groww-inspired minimal visual language ("boring by design").

---

## 🌟 Key USPs Implemented

1. **Meaningful Change Engine**: Evaluates price anomalies, volume velocity, market divergence, and signal novelty rather than raw price noise.
2. **Personal Historical Baseline**: Detects statistical anomalies relative to each stock's own rolling baseline (e.g. 2.8x 4-hour rolling volume average, 2.0σ volatility envelopes).
3. **Additive Attention Scoring (0–100)**: Transparent 0–100 score composed of 4 auditable factors (Price, Volume, Divergence, Novelty).
4. **Market Context Engine**: Distinguishes stock-specific moves from market-wide moves (e.g., *"HDFC Bank diverged -1.2% while NIFTY index rose +0.8%"*).
5. **Since-Last-Visit Checkpoint**: Summary card on Dashboard and before/after diffs on Stock Detail (*"₹1,402 → ₹1,477"*).
6. **Data Trust Engine**: Freshness, source, and confidence badges (`Live · 12s ago`, `Twelve Data Feed Live`) tagged on every asset card and table.
7. **Confidence Gating**: Structural stale data warnings (*"Stale Data — Last updated > 5m ago"*) prevent delayed feeds from masking as fresh alerts.
8. **Provider-Agnostic Market Adapter**: `utils/twelvedata.ts` encapsulates Twelve Data API behind clean provider signatures.
9. **Change Timeline State Machine**: Audit event feed tracking full lifecycle (`DETECTED` → `SURFACED` → `VIEWED` → `RESOLVED`) with bulk resolution.
10. **4-Factor "Why" Breakdown**: Math modal breakdown on Stock Detail (`WhyExplanationPanel`).
11. **Groq Llama 3.3 AI Explanation with Zero-Call Fallback**: Plain-English anomaly summaries generated via Groq API (Llama 3.3 70B), falling back to template text if LLM is offline.
12. **Behavioral Preference Weighting**: Dynamic weight visualization under *"Learned Attention Weights"* on the `/you` page.
13. **Multi-Currency Global Sync**: Top navbar currency selector (`INR`, `USD`, `EUR`, `GBP`, `JPY`, `SGD`, `AED`). Native INR (`₹`) is **always displayed alongside converted values**.
14. **Data Status Screen**: Dedicated *"Feed Health & Data Freshness"* table on the `/you` page tracking symbol status (`Live` vs `Delayed`) and poll age.
15. **Context-Aware AI Chatbot**: Floating `Chowkidar AI` widget powered by Llama 3.3 that inspects the active page & stock context in real-time.
16. **Observability**: Telemetry logging, SWR auto-refresh, and per-symbol data age tracking.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript, React 18
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer, CSS Variables (Design Tokens)
- **Icons**: Lucide React
- **Data Fetching**: SWR
- **Market Data API**: Twelve Data API (`api.twelvedata.com`)
- **AI Engine**: Groq API (`llama-3.3-70b-versatile`)

---

## 🚀 Quick Start Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step-by-Step Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify Environment Variables (`frontend/.env.local`)**:
   An `.env.local` file is already included in the `frontend` folder with default working API keys:
   ```env
   NEXT_PUBLIC_TWELVE_DATA_API_KEY=your_twelve_data_api_key_here
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3002](http://localhost:3002)) in your web browser.

---

## 📱 Page Route Sitemap

| Route | Page | Description |
|---|---|---|
| `/` | **Dashboard** | Unified attention feed ("N things deserve your attention", ranked cards, "Since you last checked" summary card, collapsed quiet section). |
| `/explore` | **Explore** | Search-first stock discovery with real-time symbol/sector filtering and instant "+ Add" watchlist toggles. |
| `/you` | **You (Account)** | Watchlist management (rename/delete), Read-only Learned Attention Weights, Data Status Feed Health table, Currency Selector, and Sign Out. |
| `/timeline` | **Change Timeline** | Chronological, grouped-by-day event audit feed (`DETECTED` → `SURFACED` → `VIEWED` → `RESOLVED`) with bulk "Mark all as seen". |
| `/stock/[symbol]` | **Stock Detail** | Tabular prices, teal/red deltas, interactive 1D/1W/1M/1Y chart, 4-factor breakdown, Groq Llama 3.3 AI output, and **NO buy/sell button**. |
| `/watchlist` | **Watchlist** | Monitored stock table with search and quick deletion. |
| `/login` & `/onboarding` | **Auth & Seeding** | Sign-in card and initial stock seeding selector. |

---

## 🧪 Production Build Verification

To test a full production build locally:

```bash
cd frontend
npm run build
npm start
```

