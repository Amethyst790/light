# Lighty — Personal Website

A world-class personal website built with React + Vite + Tailwind + Framer Motion.

## Features
- Cinematic intro screen
- Custom glowing cursor with comet trail
- Shimmer hero name with mouse-tilt 3D effect
- Floating gradient orbs (galaxy vibes)
- Grain texture overlay
- Glassmorphism cards throughout
- Typewriter fact cycling with blur transitions
- Scroll-triggered staggered animations
- Frosted glass navbar (hide on scroll down)
- Live Chess.com rating via API
- Among Us "sus" tooltip easter egg
- Ambient sound toggle (Web Audio API — no file needed)
- 5-click footer easter egg with confetti + glitch text
- Fully responsive

---

## 🚀 Deploy on Vercel (easiest)

### Option A — Drag & Drop (no account needed)
1. Run `npm install && npm run build` locally
2. Drag the `dist/` folder to [vercel.com/new](https://vercel.com/new)
3. Done ✅

### Option B — GitHub + Vercel (recommended, auto-deploys)
1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — just click **Deploy**
4. Done ✅ — every push to main auto-deploys

### Option C — Vercel CLI
```bash
npm install -g vercel
npm install
vercel
```

---

## 🖥️ Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

---

## 📁 Project Structure

```
lighty-site/
├── src/
│   ├── App.jsx        # Everything — all components in one file
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles, grain, shimmer, orbs
├── index.html         # HTML entry (loads Google Fonts)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json        # SPA routing for Vercel
└── package.json
```
