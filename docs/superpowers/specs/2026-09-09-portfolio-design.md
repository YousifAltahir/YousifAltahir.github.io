# Yousif Ahmed — Portfolio Design Spec

**Date:** 2026-09-09
**Status:** Approved, building

## Goal
A recruiter-fast (10–20s scan) personal portfolio that answers *who / what / where* + shows proof + gives a way to reach out. Simple fundamentals, one delightful twist (calm craft — polish, not spectacle).

## Direction (chosen via brainstorming)
- **Layout:** Bento grid — everything visible, compact, modern.
- **Twist:** "Calm craft" — no animated centerpiece; delight comes from micro-interactions (hover lifts, smooth light↔dark morph, buttery load-in).
- **Stack:** Framework-free **Web Components** (Custom Elements in **light DOM** so global CSS + theme variables cascade). No build step. GitHub Pages compatible (all relative paths).

## Visual system
- **Light (base):** warm off-white background (`#F7F6F2`), near-black text (`#0B0B0C`).
- **Dark:** inverted — near-black background (`#0B0B0C`), off-white text.
- **Accent:** none — strictly monochrome. Emphasis via weight, contrast, and a neutral hairline. Focus/hover use ink/neutral tones only.
- **Type:** Archivo (headings), Space Grotesk (body).
- Palette driven by CSS custom properties in `css/tokens.css` — one file to restyle.
- Theme toggle persists in `localStorage`; respects `prefers-color-scheme` on first visit.

## Persistent header (sticky)
- Left: `Yousif Ahmed`.
- Right (all as their own logos / icons): **Email**, **GitHub**, **LinkedIn**, **Download CV** button, **theme toggle**.
- Inline SVG icons (no external requests).

## Bento tiles
1. **Identity (hero):** name, title "Software Engineer — AI-powered backend & full-stack", location **Sharjah, UAE**, 1–2 line summary.
2. **InVox** (flagship, wide): 9-stage OCR+LLM invoice pipeline, hybrid RAG. Tech chips. GitHub-logo link (placeholder `#`).
3. **Mental Health Text Classifier:** DistilBERT, 42k statements, 83% acc / F1 0.81. Tech chips. GitHub-logo link (placeholder `#`).
4. **Football Match Analysis:** YOLOv8 player/ball tracking. Tech chips. GitHub-logo link (placeholder `#`).
5. **Experience — Quenet (QMS Dashboard):** real-time full-stack KPI dashboard, Qmatic APIs. Tech chips. GitHub-logo link → `https://github.com/YousifAltahir/QMS-dashboard`.
6. **Skills:** grouped — Languages / AI-ML / Frameworks / Data & Vector Stores.
7. **Contact:** email `yousifaltahir138@gmail.com`, LinkedIn, GitHub.

Each project card's repo link **is the GitHub logo**. Placeholders are real `<a>` tags — swap one URL to activate.

## Contact / privacy decisions
- Email shown publicly (persistent in header + contact tile): `yousifaltahir138@gmail.com`.
- Phone: **omitted** from public page.
- Golden Visa: **skipped**.

## File structure
```
portfolio/
├─ index.html            # thin: header markup + bento tiles as content
├─ css/
│  ├─ tokens.css         # colors, spacing, type scale, light/dark vars  ← edit to restyle
│  ├─ base.css           # reset + typography + fonts
│  ├─ layout.css         # bento grid + responsive
│  └─ components.css     # header, tiles, buttons, chips, icons
├─ js/
│  ├─ icons.js           # inline SVG registry (github, linkedin, mail, sun, moon)
│  ├─ theme-toggle.js    # <theme-toggle> custom element + persistence
│  └─ bento-card.js      # <bento-card> reusable tile element
└─ assets/
   └─ yousifCV.pdf
```

## Non-negotiables
- Works on `*.github.io` with zero config.
- Readable, low-boilerplate, easy to edit later (add a project = copy one tile block).
- Accessible: 4.5:1 contrast, visible focus rings, aria-labels on icon links, keyboard nav, `prefers-reduced-motion` respected, 44px touch targets.
- Responsive at 375 / 768 / 1024 / 1440.
