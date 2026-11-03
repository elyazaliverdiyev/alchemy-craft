# Alchemy Craft — Swiss Bento Reader, Focus & Pointer

> **A warm, distraction-free reading, focus, and presentation mode for Obsidian (Swiss Bento Design System).**

[![Obsidian Downloads](https://img.shields.io/badge/Obsidian-Community%20Plugin-7C3AED?logo=obsidian)](https://obsidian.md/plugins)
[![Version](https://img.shields.io/badge/version-3.4.0-16A34A)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **📜 Warm Archival Canvas:** Eye-friendly warm paper background (`#F4F3EF`) with crisp 1px borders (`#D0CEC7` and `#111111`) — zero harsh dark mode glare or sterile white light.
- **📊 Excel Light Green Tables:** Clean tabular data with `#69BD28` green header accents and high legibility.
- **🏷️ Bento Badge Numbers:** Automatic transformation of numbered lists `(1-4)` and markers `[01]-[04]` into vibrant Swiss square badges.
- **🎯 Sentence Focus Mode:** Hover and click to highlight key thoughts with interactive color pinning.
- **🔦 Pixel-Perfect Laser Pointer & Drawing Canvas:** Present your thoughts effortlessly with a real-time glowing laser trail and freehand highlighter. Zero cursor offset, clean hidden OS pointer in laser mode.
- **⏱️ Flexible Focus Dock & Pomodoro:** Customizable focus intervals (15m sprint, 25m classic, 45m deep work, 60m flow, 90m ultradian, plus short/long breaks). Includes right-click preset menu and pleasant audio chime.
- **🧹 AI Watermark Cleaner (Optional Toggle):** Remove invisible zero-width characters (`\u200B-\u200D`, `\uFEFF`, soft hyphens) and robotic AI artifacts from notes or selections with 1 click.
- **🌐 Bilingual & Western Ready:** English by default for global Obsidian users, with optional Russian localization.
- **🌙 Midnight Dark Craft Mode (Pro):** Deep dark aesthetic engineered specifically for late-night focus and coding.

---

## 📖 Interactive Showcase Note

Want to test all visual features, Excel tables, laser pointer, and thought pinning in action?
Download or preview our ready-to-use demo note: **[`Alchemy Craft — Interactive Showcase.md`](./demo/Alchemy%20Craft%20—%20Interactive%20Showcase.md)**.

Simply drop this `.md` file into your Obsidian vault to explore:
- Live updating task progress bar
- Auto-transformed Swiss square badges (`01`–`04`)
- Excel-style `#69BD28` financial tables
- Thought pinning with 4 color channels
- Interactive AI Cleaner test block with invisible zero-width characters

---

## 🚀 Quickstart & Installation

### Option 1: Via Obsidian Community Plugins (Recommended)
1. Open **Obsidian Settings** → **Community plugins**.
2. Turn on Community plugins.
3. Click **Browse** and search for `Alchemy Craft`.
4. Click **Install**, then **Enable**.

### Option 2: Manual Installation
1. Download the latest release (`main.js`, `manifest.json`, `styles.css`) from [Releases](https://github.com/elyazaliverdiyev/alchemy-craft/releases).
2. Create a folder named `artcraft-reader` inside your vault's `.obsidian/plugins/` directory.
3. Copy the 3 files into that folder.
4. Reload Obsidian (`Ctrl+R`) and enable **Alchemy Craft** in Settings.

---

## ⏱️ Flexible Pomodoro Controls

- **Left-Click:** Start / Pause the timer.
- **Double-Click:** Reset timer to selected duration.
- **Right-Click:** Open instant presets menu:
  - `⚡ 15 min — Sprint Focus`
  - `🍅 25 min — Standard Pomodoro`
  - `🎯 45 min — Deep Work`
  - `🌊 60 min — Flow State`
  - `🚀 90 min — Ultradian Rhythm`
  - `☕ 5 min — Short Break`
  - `🌴 15 min — Long Break`
  - `⏱ Stopwatch (Count Up: 00:00+)`

---

## 💎 Alchemy Craft Pro

Alchemy Craft is 100% free and open-source for core productivity and reading. 

If you want to support independent development, you can unlock **Alchemy Craft Pro** for **$4.99 / year** (the price of one coffee):
- 🌙 **Midnight Dark Craft Theme** (exclusive dark aesthetic)
- 🎨 **Expanded 8-Color Palette** (Amber Gold, Crimson, Neon Cyan, Rose Pink)
- 📊 **Pro Focus Analytics**
- ⚡ **Direct Crypto / Peer-to-Peer Checkout** right inside the plugin settings (BNB Chain, Bybit UID, TRON TRC-20, Solana).

---

## 🛠️ Tech Stack & Architecture

- Native TypeScript / Obsidian API
- High-performance HTML5 Canvas rendering for pointer trails (zero DOM overhead)
- Web Audio API for lightweight, synthetic chimes (no audio assets required)
- Zero external cloud dependencies for core reading features

---

## 📄 License

MIT License © 2026 Elyas Aliverdiyev (@elyazaliverdiyev)
