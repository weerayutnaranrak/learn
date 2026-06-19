# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thai-language educational website covering Software Architecture & Design patterns. Pure static HTML/CSS/JS — no build tools, no package manager, no framework. Open any `.html` file directly in a browser.

**23 topics across 5 categories.** Each topic is a self-contained HTML file. Quick-read summaries for every topic live in `summaries/` — start there to get the lay of the land before opening any HTML file.

## Custom Agent

โปรเจกต์นี้มี custom agent สำหรับสร้าง/แก้ไขหัวข้อ:

```
.claude/agents/topic-builder.md
```

**ใช้งาน:** พิมพ์ `/topic-builder` แล้วบอกว่าต้องการทำอะไร เช่น:
- `"สร้างหน้า Service Mesh"` — agent จะอ่าน summaries ที่เกี่ยวข้องก่อน แล้วสร้าง HTML + summary + อัปเดต index/README
- `"แก้ไขหน้า Kong Gateway เพิ่มเรื่อง rate limiting"` — agent อ่าน summary เดิมก่อน แก้ HTML แล้ว sync summary
- `"อัปเดต summary ของ Kubernetes"` — อัปเดตเฉพาะ summaries/15-kubernetes.md

Agent จะ: อ่าน summaries → อ่าน reference HTML → สร้าง/แก้ไข → อัปเดต summary → อัปเดต index/README ครบทุกไฟล์

## Topic Summaries

All 23 topic summaries are in `summaries/` — one `.md` file per topic. Read `summaries/README.md` for the full index with categories and key concepts.

| Category | Topics |
|----------|--------|
| Design Principles & Patterns | DDD, HTDP, Repository, CQRS, Clean/Onion, SOLID, GoF Patterns, Testing |
| Architecture Styles | Hexagonal, Layered, MVC, SOA |
| Go Concurrency | Worker Pool, Pipeline, Fan-out, Semaphore, Context |
| Distributed & Communication | Event Driven, BFF, Client-Server, Microservice, P2P, Saga |
| Infrastructure & Orchestration | Kubernetes, Observability, Kong Gateway |
| UI & Integration | Atomic Design |

## Adding a New Topic

1. Create `<N>-<slug>.html` (next number in sequence) following the structure of an existing page such as `15-k8s.html` or `23-kong-gateway.html`.
2. Add a card entry to `index.html` under the appropriate category `<div class="grid">`.
3. Update the badge count in `index.html` (`<div class="badge">📚 สื่อการสอน Software Architecture · N หัวข้อ</div>`) and the footer text.
4. Create a matching summary file in `summaries/NN-slug.md`.
5. Add a row to `summaries/README.md` under the correct category table.
6. Add a row to the main `README.md` topic table.

## Page Structure

Every topic page follows this layout:

```
<nav> — sticky top bar with ← กลับหน้าหลัก + TOC links
<div class="hero"> — badge, h1, hero-sub, hero-chips
<div class="container">
  <section id="…"> — one section per major concept
</div>
<footer>
<script> — hljs.highlightAll() call
```

Each page has **all CSS inlined in `<head>`** — there is no external stylesheet except `common.css` (code-block controls) and highlight.js from CDN.

## Code Block Pattern

Code blocks must use this structure to get the copy/collapse buttons from `common.js`:

```html
<link rel="stylesheet" href="common.css">   <!-- in <head> -->
<script src="common.js"></script>            <!-- before </body> -->

<div class="code-block">
  <div class="code-header">
    <span>filename.go</span>
    <!-- common.js injects copy + collapse buttons here -->
  </div>
  <pre data-lang="go"><code class="language-go">…</code></pre>
  <!-- Optional: add a TS variant for language toggle -->
  <pre data-lang="ts" style="display:none"><code class="language-typescript">…</code></pre>
</div>
```

`common.js` auto-detects blocks that have both `data-lang="go"` and `data-lang="ts"` pre elements and shows a Go/TypeScript toggle. highlight.js must run **before** `common.js` (put `hljs.highlightAll()` in a `<script>` tag before the `common.js` script tag, or call it with `DOMContentLoaded`).

## Visual Components (shared across pages)

- **`.vbox` / `.vb-grid`** — info cards in grid (use `.vb-2` `.vb-3` `.vb-4` classes for column count)
- **`.callout`** — info/warning/tip callout with left border (modifiers: `.info` `.warn` `.tip`)
- **`.diagram-wrap`** — dark bordered container for SVG diagrams
- **Accent colour per page** — each page picks its own gradient palette; K8s uses `#326ce5`, Observability uses `#06b6d4`, Kong uses `#00b4d8`

## Index Card Format

```html
<a href="N-slug.html" class="card" style="--c:linear-gradient(90deg,#COLOR1,#COLOR2)">
  <div class="card-num">NN</div><span class="card-icon">EMOJI</span>
  <h2>Title</h2>
  <p>Thai description (1–2 sentences)</p>
  <div class="tags"><span class="tag">Tag1</span>…</div>
  <span class="arrow">→</span>
</a>
```

The `--c` CSS variable controls the top-border accent that animates on hover.

## Content Language

All user-visible text is in **Thai**. Code comments and identifiers stay in English.

## kong-video — HyperFrames Animation Project

`kong-video/` คือ [HyperFrames](https://hyperframes.heygen.com) project สำหรับสร้าง video animation ของ Kong Gateway request flow

```
kong-video/
├── index.html          ← composition หลัก (GSAP timeline, 1920×1080, 16s)
├── renders/
│   ├── kong-flow.mp4            ← animation ไม่มี subtitle
│   └── kong-flow-subtitled.mp4  ← animation พร้อม subtitle ภาษาไทย
├── hyperframes.json    ← HyperFrames project config
└── package.json
```

### วิธี re-render

```bash
cd kong-video

# preview ใน browser (background)
npm run dev

# lint ก่อน render เสมอ
npm run check

# render เป็น MP4
npm run render
# หรือระบุ output path
npx hyperframes render . --output renders/kong-flow-subtitled.mp4 --fps 30
```

### โครงสร้าง index.html

- **Canvas:** 1920×1080, `data-duration="16"` (16 วินาที)
- **Animation library:** GSAP 3 (CDN) — timeline register ด้วย `window.__timelines["main"] = tl`
- **Subtitle system:** `#subtitle-bar` + `#sub-text` — ใช้ฟังก์ชัน `setSub(html)` / `clearSub()` เรียกผ่าน `tl.call()` ตาม timestamp
- **Subtitle ภาษาไทย:** 10 บรรทัด ซิงค์กับ animation (0.5s → 16s) — highlight ด้วย `<span class="hi">`, `.hi-green`, `.hi-yellow`

### HyperFrames Key Rules (จาก `kong-video/CLAUDE.md`)
- ทุก timed element ต้องมี `data-start`, `data-duration`, `data-track-index` และ `class="clip"`
- Timeline ต้อง `paused: true` และ register บน `window.__timelines`
- ห้ามใช้ `Date.now()`, `Math.random()`, network fetch — ต้อง deterministic เท่านั้น
- TTS (`npx hyperframes tts`) รองรับแค่ภาษา en/es/fr/ja/zh — **ไม่รองรับไทย** ใช้ subtitle แทน
