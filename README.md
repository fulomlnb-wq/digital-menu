# Ember & Vine — Smart Digital Menu

A premium, psychology-driven restaurant menu web app built with React, Vite, Tailwind CSS, Framer Motion, and Three.js.

## Features

- Dark/light mode, glassmorphism UI, mobile-first layout
- Categories, search, tag filters, swipe between categories
- Psychological cues: popular badges, anchor pricing, scarcity, social proof
- 3D table-preview modal (rotating plate with food texture)
- Cart with floating button, quantity controls, subtle sound feedback
- AI-style recommendations based on cart contents
- QR-ready: welcome screen + `?table=5` URL parameter

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Test table number:** [http://localhost:5173/?table=5](http://localhost:5173/?table=5)

## Build for production

```bash
npm run build
npm run preview
```

## Edit menu data

Update `src/data/menu.json` — add items, prices, tags, `popular`, `highMargin`, `scarcity`, and `socialProof` fields.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- Three.js + React Three Fiber
- Lucide icons
