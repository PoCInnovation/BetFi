# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BetFi is a Next.js trading platform where "Traders" propose automated trading strategies and "Bettors" can bet YES or NO on strategy success. The capital is invested in the strategy, and returns are shared between winners and the trader.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Custom components using Radix UI primitives
- **Charts**: Recharts for data visualization
- **Styling**: Custom purple crypto theme with CSS variables

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── strategy/[id]/     # Dynamic strategy detail pages
│   ├── ai/                # AI advisor chat interface
│   ├── portfolio/         # User betting history
│   └── layout.tsx         # Root layout with navigation
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   ├── navigation.tsx    # Main navigation bar
│   └── strategy-card.tsx # Strategy display component
└── lib/                  # Utilities and mock data
    ├── mock-data.ts      # Mock strategies, traders, bets
    └── utils.ts          # Utility functions
```

### Key Features
1. **Homepage**: Grid of strategy cards with betting options
2. **Strategy Detail**: Full strategy view with charts and betting interface
3. **AI Advisor**: Chat interface with mock AI responses and recommendations
4. **Portfolio**: User betting history with statistics and pie charts

### Data Models
- **Strategy**: Trading strategy with trader, objective, current return, votes, deadline
- **Trader**: Trader profile with reputation, success rate, historical strategies
- **UserBet**: User betting record with amount, position, status, payout

### Custom Theme
Uses purple crypto-inspired color scheme with CSS variables for light/dark mode support. Key colors:
- Primary: `278 74% 37%` (purple)
- Background: `278 100% 95%` (light purple)
- Card: `278 50% 90%` (purple tint)

### Mock Data
All data is currently mocked in `src/lib/mock-data.ts` including:
- 5 sample trading strategies
- 3 trader profiles
- User betting history
- Chart data for strategy performance

### Development Notes
- All pages are responsive and mobile-optimized
- Uses TypeScript for type safety
- Tailwind CSS with custom design system
- Icons from Lucide React
- Charts rendered with Recharts library
- Navigation highlights current page