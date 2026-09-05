# 🛡️ Chowkidar — Solution Architecture & Complete Feature Guide

> **Chowkidar** ("The Watchman") is a calm, consumer-first stock-watchlist attention triage platform.  
> Rather than bombarding users with noisy price ticks or forcing them to read complex candlestick charts, Chowkidar evaluates market data relative to individual baseline envelopes, cross-references corporate filings, groups correlated movements, and tells the user **what changed, why it matters, and whether action is required**.

---

## 🎯 Executive Summary & Architectural Philosophy

Financial monitoring tools suffer from **alert fatigue**, **black-box scoring**, and **noisy raw feeds**. Chowkidar solves this through a 5-layer pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHOWKIDAR PLATFORM                              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Ingestion Layer      Twelve Data Live Quotes + Provider Adapter     │
│ 2. Context Engine       Sector Divergence & Volatility Bounds (2.0σ)   │
│ 3. Scoring Engine       0–100 Additive & Auditable Factor Breakdown    │
│ 4. Explainability Layer NSE Corporate Filings + Groq Llama 3.3 AI      │
│ 5. Presentation Layer   Groww-Style 3-Tab UI (Explore | Dashboard | You) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Complete Feature Breakdown

### 1. 🏢 Corporate-Action Tagging
- Cross-references flagged movements against NSE corporate announcement filings.
- Replaces raw mathematical output with contextual business reasons (e.g. *"Coincides with Q2 Financial Results & Board Meeting filing"* or *"Coincides with Dividend Record Date announcement"*).
- Upgrades the platform pitch from **"we detect price movement"** to **"we understand why it moved"**.

### 2. ⚡ Auto-Resolve on Reversion
- Automatically flips a `MarketEvent` state to `RESOLVED` when a stock's price or volume settles back inside its personal baseline envelope (*"Spiked +4.5%, returned to normal baseline 35 min later — Auto-resolved"*).
- Prevents stale alerts from cluttering the user's focus when the market has already normalized.

### 3. 👥 Correlated-Move Grouping
- Leverages the Context Engine's sector-divergence telemetry to detect when multiple stocks in the same sector move simultaneously (e.g., Energy or Tech sector rallies).
- Groups correlated stocks into a **single unified attention card** (*"Correlated Sector Move: RELIANCE & ONGC (Energy Sector)"*), eliminating alert fatigue.

### 4. 📊 Unified Attention Feed ("Dashboard")
- **"N things deserve your attention"**: Consolidates all watchlists into a single, ranked attention feed sorted by descending score.
- **"Since You Last Checked" Checkpoint Card**: Summarizes key anomalies detected since the user's last session.
- **Collapsed Quiet Section**: Keeps tranquil, baseline stocks hidden below the fold (*"Already seen, nothing new"*).

### 5. 🔍 Search-First Stock Discovery ("Explore")
- Prominent top search bar filtering stocks instantly by symbol, company name, or sector.
- One-tap "+ Add" watchlist toggle with visual state feedback.

### 6. 👤 Account & Feed Health ("You")
- **Watchlist Management**: Inline rename, reorder, and deletion actions.
- **Learned Attention Weights**: Visual horizontal bar chart displaying dynamic factor sensitivities.
- **Data Status Health Table**: Honest, transparent table showing real-time ingestion health (`Live · 12s ago` vs `Delayed · 6m old`).
- **Global Currency Switcher**: Toggles active display units (`INR`, `USD`, `EUR`, `GBP`, `JPY`, `SGD`, `AED`) across all screens in real-time.

### 7. ⏳ Change Timeline & State Machine ("Timeline")
- Implements the complete audit state machine: `DETECTED` → `SURFACED` → `VIEWED` → `RESOLVED`.
- Features bulk *"Mark all as seen"* action and historical severity badges.

### 8. 🤖 Context-Aware Chowkidar AI Chatbot
- Floating widget (`✨ Ask Chowkidar AI`) powered by **Groq Llama 3.3 70B**.
- Automatically inspects current route and stock symbol context to answer questions (*"Why is RELIANCE on my radar?"*, *"Explain volume velocity for HDFCBANK"*).

### 9. 📈 Interactive Stock Detail & 4-Factor Math
- Timeframe toggles (`1D`, `1W`, `1M`, `1Y`) with interactive crosshair tooltips.
- 4-factor additive breakdown (Price Anomaly + Volume Velocity + Sector Divergence + Signal Novelty = Total Score / 100).
- **NO Buy/Sell buttons** (strict PRD enforcement).

---

## 🛠️ Installation & Setup

1. **Clone/Unzip project**:
   ```bash
   cd chowkidar
   ```

2. **Install & Launch Frontend**:
   ```bash
   npm run dev
   ```
   *Or navigate to `frontend/`:*
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3002` (or `http://localhost:3000`).

