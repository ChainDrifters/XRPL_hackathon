# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Toss Foreigner Flow Layer** — an XRPL hackathon project. A passport-based workflow wallet for foreigners in Korea that streamlines tax-refund, hotel check-in, rental, and deposit flows using:
- Passport verification + Toss Face Pay
- W3C Verifiable Credentials stored in wallet
- XRPL trust anchors & pairwise relationship IDs
- Privacy-preserving proof chains
- Encrypted off-chain evidence storage

Architecture docs are in `docs/en/` (English) and `docs/ko/` (Korean). UI mockups in `docs/mockups/` (HTML files using Toss Design System) are the primary UI reference.

## Repository Structure

```
/
├── docs/           # Architecture, security docs, and HTML mockups
│   ├── mockups/    # home-v1.html, refund-v1.html — UI reference
│   ├── en/         # English architecture & security docs
│   └── ko/         # Korean architecture & security docs
├── frontend/       # Vite + React + TypeScript app
│   └── src/
│       ├── pages/       # Route-level page components
│       └── components/  # Shared UI components
└── learning-site/  # Unused (empty)
```

## Frontend Commands

All commands run from `frontend/`:

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Type-check + build (tsc -b && vite build)
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Frontend Stack

- React 19 + TypeScript (strict mode)
- Vite 8 with `@vitejs/plugin-react` (Oxc transformer)
- ESLint flat config with typescript-eslint + react-hooks + react-refresh
- No router installed yet — add if needed

## Key Conventions

- Pages go in `src/pages/`, shared components in `src/components/`
- Refer to `docs/mockups/*.html` for screen designs before implementing any UI
- No backend — this is a frontend-only prototype for the hackathon demo
