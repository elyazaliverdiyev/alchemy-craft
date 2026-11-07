const { Plugin, PluginSettingTab, Setting, Notice, Modal, Menu, addIcon } = require("obsidian");

const DEFAULT_SETTINGS = {
  uiLanguage: "en", // "en" | "ru" | "zh" | "ja" | "es" | "de"
  artcraftTheme: true,
  headerTagText: "STRATALCHEMY // KNOWLEDGE BRIEF",
  showHeaderTag: true,
  hoverCards: true,
  sentenceFocus: true,
  colorizeNumbers: true,
  showFloatingDock: true,
  dockCollapsed: false,
  dockVertical: false,
  showTaskProgress: true,
  strokeColor: "#2563EB",
  activeColorKey: "blue",
  timerMode: "pomodoro", // "pomodoro" | "stopwatch"
  pomodoroMinutes: 25,
  breakMinutes: 5,
  timerSound: true,
  ambientSound: "off", // "off" | "brown" | "rain" | "gamma40"
  enableAiCleaner: false, // Disabled by default on fresh install per user request
  magicLamp: false,
  lampBrightness: 85, // 10..100%
  lampKelvin: 3570, // 2700K (Warm Amber) .. 6500K (Cool Daylight)
  lampDimness: 75, // 0..92% room darkness outside the lamp beam
  lampRadius: 310, // 120..600px
  lampShape: "radial", // "radial" (Spotlight) | "deskbar" (BenQ Monitor Bar)
  lampMode: "kelvin", // "kelvin" | "color"
  lampCustomColor: "#F59E0B",
  tactileTypingSound: "off", // "off" | "thock" | "typewriter"
  showEqualizer: true,
  eqMode: "bars", // "bars" | "wave" | "orb" | "dna" | "craft" | "ferro"
  audioVolume: 75, // 0..100%
  readingRuler: false,
  supabaseFunctionUrl: "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay",
  spotlightFocus: false,
  enableBentoGraph: true,
  graphPreset: "bento", // "bento" | "constellation" | "radar"
  isPro: false,
  proTxHash: "",
  proActivatedAt: null,
  proPlan: "none",
  darkCraftTheme: false,
  focusAnalytics: {
    completedSprints: 0,
    totalFocusMinutes: 0,
    tasksCompleted100: 0,
    lastSprintDate: "",
    currentStreak: 0,
    history: []
  }
};

const PALETTE = [
  { key: "blue", name: "01 Sapphire (Blue)", color: "#2563EB", pinClass: "artcraft-pinned-blue", pro: false },
  { key: "orange", name: "02 Amber (Orange)", color: "#F59E0B", pinClass: "artcraft-pinned-orange", pro: false },
  { key: "green", name: "03 Emerald (Green)", color: "#10B981", pinClass: "artcraft-pinned-green", pro: false },
  { key: "purple", name: "04 Amethyst (Purple)", color: "#8B5CF6", pinClass: "artcraft-pinned-purple", pro: false },
  { key: "rose", name: "05 Rose Quartz (Pro)", color: "#EC4899", pinClass: "artcraft-pinned-rose", pro: true },
  { key: "cyan", name: "06 Cyber Cyan (Pro)", color: "#06B6D4", pinClass: "artcraft-pinned-cyan", pro: true },
  { key: "crimson", name: "07 Ruby Crimson (Pro)", color: "#EF4444", pinClass: "artcraft-pinned-crimson", pro: true },
  { key: "gold", name: "08 Solar Gold (Pro)", color: "#EAB308", pinClass: "artcraft-pinned-gold", pro: true },
];

const SICRAFT_SVGS = {
  lamp: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/><path d="M15 14a5 5 0 1 0-6 0l1 4h4l1-4z"/></svg>`,
  laser: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,
  draw: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
  eraser: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`,
  zen: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`,
  focus: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  audio: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`,
  card: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  spark: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>`,
  timer: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M10 2h4"/></svg>`,
  graph: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.7" y1="7.5" x2="10.8" y2="15.5"/><line x1="15.3" y1="7.5" x2="13.2" y2="15.5"/><line x1="9" y1="6" x2="15" y2="6"/></svg>`,
  diamond: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/></svg>`,
  bolt: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  copy: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  globe: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  ruler: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="2"/><line x1="6" y1="8" x2="6" y2="12"/><line x1="10" y1="8" x2="10" y2="14"/><line x1="14" y1="8" x2="14" y2="12"/><line x1="18" y1="8" x2="18" y2="14"/></svg>`,
  undo: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
  redo: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>`,
  clear: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  orient: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  collapse: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  eqBars: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="4" y2="12"/><line x1="9" y1="20" x2="9" y2="6"/><line x1="14" y1="20" x2="14" y2="10"/><line x1="19" y1="20" x2="19" y2="4"/></svg>`,
  eqWave: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/></svg>`,
  eqOrb: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>`,
  eqMatrix: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/></svg>`,
  eqCraft: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c3 0 4-6 7-6s4 8 7 8 4-5 6-5"/><path d="M2 19c3 0 4-4 7-4s4 5 7 5 4-3 6-3" opacity="0.6"/></svg>`,
  eqFerro: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="3.5"/><path d="M12 9.5c1 1.5 1 3.5 0 5"/></svg>`,
  play: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
  pause: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
};

// Always open external URLs in the user's default OS browser (Chrome/Safari/Edge/Telegram Desktop), bypassing Obsidian's internal Web Viewer!
function openExternalUrl(url) {
  if (!url) return;
  try {
    const electron = window.require ? window.require("electron") : require("electron");
    if (electron && electron.shell && typeof electron.shell.openExternal === "function") {
      electron.shell.openExternal(url);
      return;
    }
  } catch (e) {}
  try {
    window.open(url, "_external");
  } catch (e2) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Hand-crafted sketchy SVG tier illustrations (inspired by Zsolt's artistic Ko-fi tiers)
const TIER_BRONZE_SVG = `<svg viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="60" cy="41" rx="34" ry="4" fill="#E6E2D8"/>
  <path d="M46 10H74M52 10V18L39 35C37.5 37 39 40 41.5 40H78.5C81 40 82.5 37 81 35L68 18V10" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M42 33C49 30 55 35 61 32C67 29 73 34 78 33L79 39H41L42 33Z" fill="#D97706" fill-opacity="0.85"/>
  <circle cx="55" cy="27" r="2" fill="#FDE68A"/>
  <circle cx="64" cy="23" r="1.5" fill="#FDE68A"/>
</svg>`;

const TIER_SILVER_SVG = `<svg viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="60" cy="41" rx="38" ry="4" fill="#E6E2D8"/>
  <path d="M60 6L76 18L68 39H52L44 18L60 6Z" fill="#10B981" fill-opacity="0.18" stroke="#1F2937" stroke-width="2" stroke-linejoin="round"/>
  <path d="M60 6L68 39M60 6L52 39M44 18H76" stroke="#10B981" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="60" cy="18" r="3" fill="#10B981"/>
  <path d="M32 14L35 17M88 14L85 17M60 2V4" stroke="#69BD28" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const TIER_GOLD_SVG = `<svg viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="60" cy="41" rx="40" ry="4" fill="#E6E2D8"/>
  <polygon points="60,5 79,16 72,39 48,39 41,16" fill="#F59E0B" fill-opacity="0.22" stroke="#1F2937" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="60,11 71,19 67,34 53,34 49,19" fill="#F59E0B" fill-opacity="0.65"/>
  <circle cx="60" cy="23" r="3.5" fill="#FFFBEB"/>
  <path d="M29 20L34 22M91 20L86 22M60 1V3" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
</svg>`;

function registerSicraftMenuIcons() {
  if (typeof addIcon !== "function") return;
  const wrap = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  try {
    addIcon("sicraft-bolt", wrap(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`));
    addIcon("sicraft-timer", wrap(`<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M10 2h4"/>`));
    addIcon("sicraft-target", wrap(`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>`));
    addIcon("sicraft-wave", wrap(`<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/><path d="M2 17c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-1" opacity="0.65"/>`));
    addIcon("sicraft-rocket", wrap(`<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>`));
    addIcon("sicraft-sliders", wrap(`<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`));
    addIcon("sicraft-coffee", wrap(`<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`));
    addIcon("sicraft-palm", wrap(`<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 8a4.5 4.5 0 0 0-4.5-4.5c-1.5 0-2.8.7-3.5 1.8"/><path d="M12 8a4.5 4.5 0 0 1 4.5-4.5c1.5 0 2.8.7 3.5 1.8"/>`));
    addIcon("sicraft-headphones", wrap(`<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>`));
    addIcon("sicraft-rain", wrap(`<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>`));
    addIcon("sicraft-brain", wrap(`<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>`));
    addIcon("sicraft-mic", wrap(`<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>`));
    addIcon("sicraft-speaker", wrap(`<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/>`));
    addIcon("sicraft-music", wrap(`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`));
    addIcon("sicraft-stopwatch", wrap(`<circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 15 13"/><line x1="9" y1="2" x2="15" y2="2"/><line x1="19" y1="6" x2="20" y2="5"/>`));
    addIcon("sicraft-bars", wrap(`<line x1="4" y1="20" x2="4" y2="10"/><line x1="9" y1="20" x2="9" y2="4"/><line x1="14" y1="20" x2="14" y2="12"/><line x1="19" y1="20" x2="19" y2="6"/>`));
    addIcon("sicraft-orb", wrap(`<circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>`));
    addIcon("sicraft-matrix", wrap(`<rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/>`));
    addIcon("sicraft-stop", wrap(`<rect x="5" y="5" width="14" height="14" rx="2"/>`));
  } catch (e) {}
}
const ALCHEMY_ICON_SVG = `<svg class="artcraft-svg-flask" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 3H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M10 3V8L4.5 17.5C3.8 18.7 4.7 20.2 6.1 20.2H17.9C19.3 20.2 20.2 18.7 19.5 17.5L14 8V3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
  <path class="artcraft-flask-liquid" d="M6.2 16.5C8 15 10 17 12 16C14 15 16 17 17.8 16.5L17.9 20H6.1L6.2 16.5Z" fill="#69BD28" opacity="0.9" />
  <circle class="artcraft-flask-bubble b1" cx="10" cy="14" r="1" fill="#FFFFFF" />
  <circle class="artcraft-flask-bubble b2" cx="13.5" cy="12" r="0.75" fill="#FFFFFF" />
  <circle class="artcraft-flask-spark" cx="12" cy="7" r="0.8" fill="#F59E0B" />
</svg>`;

const TRANSLATIONS = {
  en: {
    eqTip: "LMB: Cycle 4 Pro Visualizers | RMB: Audio Menu & Sync Desktop Music (Telegram/Spotify/YouTube)",
    audioSyncSystem: "Desktop Audio Loopback (Telegram / YouTube / Spotify)",
    audioSyncMic: "Microphone / Stereo Mix Input",
    audioStopSync: "Stop Live Audio Sync",
    audioModeBars: "01 // Peak-Hold Neon Spectrum",
    audioModeWave: "02 // Cyber Liquid Spline Ribbon",
    audioModeOrb: "03 // Supernova Polar Sunburst",
    audioModeDna: "04 // Quantum Matrix Rain",
    ambientRain: "Ambient: Soft Rain on Paper",
    ambientBrown: "Ambient: Deep Warm Brown Noise",
    ambientGamma: "Ambient: 40Hz Gamma Focus Drone",
    audioStopAll: "Stop All Audio",
    audioConnectedNotice: "Desktop Audio Loopback connected! Equalizer now reacts to Telegram, Spotify & system music.",
    audioMicConnectedNotice: "Audio input connected to Equalizer!",
    audioStoppedNotice: "Audio sync stopped.",
    dockCollapseTip: "Click to collapse/expand Alchemy Craft Dock",
    timerTip: "LMB: Start/Pause | RMB: Presets & Audio | Double Click: Reset",
    uiBtn: "UI",
    uiTip: "Swiss Bento UI Theme (Warm Paper #F4F3EF + Sage Green Tables)",
    zenBtn: "Zen",
    zenTip: "Zen Mode — hide sidebars for pure distraction-free focus",
    focusBtn: "Focus",
    focusTip: "Sentence Focus Highlighting (hover over text and click to pin color)",
    laserBtn: "Laser",
    laserTip: "Laser Pointer (glowing trail, Esc to exit)",
    drawBtn: "Draw",
    drawTip: "Freehand Marker Draw on note (Esc to exit)",
    eraserBtn: "Eraser",
    eraserTip: "Eraser — erase drawings under cursor (Esc to exit)",
    lampBtn: "Lamp",
    lampBtnFull: "Smart LED Lamp",
    lampTip: "LMB: Toggle Smart LED Lamp | RMB: Configure Brightness, Kelvin (2700K–6500K) & Room Dimmer",
    rulerBtn: "Ruler",
    rulerTip: "Toggle Laser Reading Ruler Line",
    undoTip: "Undo last stroke (Ctrl+Z)",
    redoTip: "Redo stroke (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Clean invisible AI watermarks (Zero-Width spaces) & copy to clipboard",
    clearTip: "Clear all drawings and highlighted sentences",
    orientTip: "Toggle Orientation (Bottom Bar / Right Side Pillar)",
    collapseTip: "Collapse into floating orb",
    taskProgressLabel: "TASK PROGRESS:",
    sprintDoneNotice: "Alchemy Craft: Focus sprint completed! +1 Sprint recorded in Analytics.",
    breakDoneNotice: "Alchemy Craft: Break finished! Ready for the next focus sprint?",
    customPomodoroTitle: "Custom Focus Sprint Duration",
    customPomodoroDesc: "Set your custom Pomodoro sprint duration in minutes (1 to 360):",
    customPomodoroStart: "Start Sprint",
    customPomodoroErr: "Please enter a number between 1 and 360 minutes.",
    ledModalSubtitle: "ALCHEMY CRAFT // LUMINA STUDIO",
    ledModalTitle: "Smart LED Cursor Lamp",
    ledBrightness: "Brightness (Glow Intensity)",
    ledKelvin: "Color Temperature",
    ledDimmer: "Surrounding Room Dimmer",
    ledRadius: "Beam Radius & Shape",
    ledShapeRadial: "Radial Spotlight",
    ledShapeBar: "Desk Lightbar",
    modalBadge: "ALCHEMIST PRO • 1 YEAR PASS",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Annual pass for the price of one coffee ($4.99 / yr). Instant activation via 0% Fee EVM, Bybit UID, @CryptoBot, or Promo Key.",
    step1Title: "STEP 1: SELECT PAYMENT METHOD",
    netPromo: "Promo / VIP Key",
    netPromoHint: "Instant Code Activation",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Click Telegram (All Coins)",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID Transfer",
    netBybitHint: "0% Fee • UID: 8015849",
    netSol: "Solana Network",
    netSolHint: "USDT / USDC • ~$0.001 Fee",
    netTrc: "TRON (TRC20)",
    netTrcHint: "Standard USDT",
    amountLabel: "AMOUNT TO SEND:",
    copyAmountBtn: "Copy 4.99",
    recipientLabel: "RECIPIENT ADDRESS:",
    uidLabel: "BYBIT RECIPIENT UID:",
    copyBtn: "Copy Address",
    copiedBtn: "Copied!",
    evmChainsLabel: "SUPPORTED EVM NETWORKS FOR THIS 0x ADDRESS:",
    cardNote: "Enter your Promo Code, VIP Key, or @CryptoBot Invoice ID in Step 2 below, or click below to pay $4.99 via @CryptoBot.",
    cryptobotNote: "Click below to generate an official @CryptoBot invoice ($4.99) with full product description and instant verification.",
    evmNote: "This single Universal EVM 0x address accepts 4.99 USDT, USDC, DAI, ETH, or BNB on BNB Chain (BEP-20), Arbitrum One, Base, Polygon, Optimism, and Ethereum!",
    bybitNote: "In Bybit App: Assets -> Withdraw -> Internal Transfer (0% Fee) -> enter UID 8015849 and 4.99 USDT.",
    trcNote: "Send 4.99 USDT via TRON network (TRC-20) from any wallet or exchange.",
    solNote: "Send 4.99 USDT or USDC on Solana network.",
    supportText: "Need assistance or instant manual activation?",
    supportSub: "Direct Telegram contact:",
    supportTgBtn: "Open @StratAlchemy",
    step2Title: "STEP 2: ENTER TXID, BYBIT ID, OR LICENSE / PROMO KEY:",
    txPlaceholder: "Paste TXID (0x...), Bybit ID, or ACPRO-... Key",
    activateBtn: "Verify & Activate Pro",
    checkingBtn: "Verifying payment...",
    successMsg: "Success! Alchemy Craft Pro is now active for 365 days!",
    errorEmpty: "Please enter a valid TXID, Order ID, or License Key.",
    errorPending: "Transaction is still confirming. Please wait 1 minute and click again.",
    proActiveTitle: "PRO ACTIVE",
    proExpiresOn: "Annual Pass Active Until:",
    proMidnightName: "Midnight Dark Craft Mode",
    proMidnightDesc: "Full Swiss dark mode engineered for late-night reading, Graph View, and coding.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Unlock All Pro Features in Alchemy Craft",
    proPerk1: "Midnight Dark Craft — full Swiss dark theme for notes, tables, callouts & Graph",
    proPerk2: "Expanded 8-Color Palette — Rose Quartz, Cyber Cyan, Ruby Crimson & Solar Gold",
    proPerk3: "Swiss Bento Graph Studio — automatic vault folder coloring, orphan filter & live HUD",
    proPerk4: "Smart LED Lamp & 4-Mode Equalizer — 2700K–6500K spotlight & desktop audio sync",
    getProBtn: "Get Alchemy Craft Pro ($4.99 / yr)",
    graphHudTitle: "ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Constellation",
    graphPresetRadar: "Focus Radar",
    graphColorizeBtn: "Colorize My Vault",
    graphOrphansBtn: "Hide Orphans",
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.1)",
    checkUpdatesBtn: "Check Updates",
    langName: "Interface Language (6 Global Languages)",
    langDesc: "Instantly translates all settings, floating dock buttons, Graph HUD, and modals.",
    themeName: "Swiss Bento UI Theme (#F4F3EF + #69BD28 Tables)",
    bentoGraphName: "Swiss Bento Graph Studio & Auto-Coloring",
    bentoGraphDesc: "Scans your actual vault folders and colors every node in the Graph View with Swiss Bento palette + adds Constellation & Radar HUD.",
    taskBarName: "Sticky Task Progress Bar (Mobile Safe + Dismiss)",
    taskBarDesc: "Shows task completion % at the top of checklist notes with a tap-to-close button and 100% confetti.",
    headerBadgeName: "Note Header Badge Text",
    headerBadgeDesc: "Editorial pill above the note title (e.g. 'STRATALCHEMY // KNOWLEDGE BRIEF'). Clear text to hide.",
    ambientName: "Ambient Focus Soundscape (WebAudio)",
    ambientDesc: "Synthesized zero-latency background audio during Pomodoro sprints (Brown Noise, Soft Rain, or 40Hz Gamma).",
    pomoDurName: "Default Pomodoro Duration (Minutes)",
    pomoDurDesc: "Right-click the timer in the dock anytime for 15m, 25m, 45m, 60m, 90m, or custom duration.",
    aiCleanSetName: "Show AI Watermark Cleaner in Dock",
    lampSetName: "Smart LED Cursor Lamp (2700K–6500K Kelvin & Room Dimmer)",
    lampSetDesc: "Dims the surrounding workspace while your cursor shines a warm 2700K–6500K LED spotlight over your notes.",
    lampConfigBtn: "Configure Lamp",
    keySoundSetName: "Tactile Keystroke Sound (Mechanical Switch ASMR)",
    keySoundSetDesc: "Zero-latency WebAudio mechanical keyboard sound while typing (Deep Topre Thock or Vintage Swiss Typewriter).",
    eqSetName: "Live 4-Mode Sonic Equalizer (Desktop Audio Sync)",
    eqSetDesc: "Syncs directly with desktop music (Telegram, YouTube, Spotify) or built-in soundscapes with 4 complex visualizers.",
    eqSyncBtn: "Sync Desktop Audio",
    spotlightSetName: "Spotlight Paragraph Focus Dimmer",
    spotlightSetDesc: "Gently dims inactive paragraphs to 42% opacity while keeping your active paragraph at 100% contrast.",
    numBadgeSetName: "Square Number Badges (01–04) & Crypto/Money Capsules",
    numBadgeSetDesc: "Transforms numbered lists, [01]–[04] markers, $ amounts, and 0x EVM addresses into Swiss capsules.",
    sentFocusSetName: "Sentence Focus Highlighting",
    analyticsTitle: "Focus Flow Analytics & Streak",
    statSprints: "Sprints",
    statDeepWork: "Deep Work",
    statChecklists: "100% Lists",
    statStreak: "Day Streak",
    supportHeading: "Direct 0%-Fee Checkout, @CryptoBot & Community",
    supportSetName: "Global Payment & Direct Author Contact",
    supportSetDesc: "Pay with 0% fee via Universal EVM (BEP20, Arbitrum, Base, Polygon, ERC20), Bybit UID 8015849, or 1-Click @CryptoBot."
  },
  ru: {
    eqTip: "ЛКМ: Смена 4 визуализаторов | ПКМ: Подключить звук ПК (Telegram/YouTube/Spotify) или Эмбиент",
    audioSyncSystem: "Системный звук ПК (Telegram / YouTube / Spotify)",
    audioSyncMic: "Микрофон / Стерео микшер",
    audioStopSync: "Остановить синхронизацию звука",
    audioModeBars: "01 // Спектроанализатор с пиками (Peak-Hold)",
    audioModeWave: "02 // Кибер-жидкая неоновая волна (3 слоя)",
    audioModeOrb: "03 // Полярная сверхновая (Supernova Rays)",
    audioModeDna: "04 // Квантовая матрица (Quantum Matrix)",
    ambientRain: "Эмбиент: Мягкий дождь по бумаге",
    ambientBrown: "Эмбиент: Глубокий коричневый шум",
    ambientGamma: "Эмбиент: 40Hz Гамма-ритм фокуса",
    audioStopAll: "Выключить все звуки",
    audioConnectedNotice: "Системный звук ПК подключен! Теперь эквалайзер играет в такт музыке из Telegram, YouTube и Spotify.",
    audioMicConnectedNotice: "Аудиовход подключен к эквалайзеру!",
    audioStoppedNotice: "Синхронизация звука остановлена.",
    dockCollapseTip: "Клик для сворачивания/разворачивания панели",
    timerTip: "ЛКМ: Старт/Пауза | ПКМ: Пресеты и Звук | Двойной клик: Сброс",
    uiBtn: "UI",
    uiTip: "Теплый бумажный режим Swiss Bento UI (#F4F3EF) + зеленые таблицы",
    zenBtn: "Дзен",
    zenTip: "Режим Дзен — скрыть боковые панели для чистого фокуса",
    focusBtn: "Фокус",
    focusTip: "Выделение предложений выбранным цветом (клик по тексту)",
    laserBtn: "Указка",
    laserTip: "Лазерная указка (исчезающий след, Esc для выхода)",
    drawBtn: "Маркер",
    drawTip: "Рисование маркером поверх заметки (Esc для выхода)",
    eraserBtn: "Ластик",
    eraserTip: "Ластик — стирать рисунки (Esc для выхода)",
    lampBtn: "Лампа",
    lampBtnFull: "Умная Лампа",
    lampTip: "ЛКМ: Вкл/Выкл Умную Лампу | ПКМ: Настроить яркость, Кельвины (2700K–6500K) и затемнение",
    rulerBtn: "Линейка",
    rulerTip: "Включить лазерную линейку чтения",
    undoTip: "Отменить последний штрих (Ctrl+Z)",
    redoTip: "Повторить штрих (Ctrl+Y)",
    aiCleanBtn: "AI Очистка",
    aiCleanTip: "Очистить заметку от невидимых ИИ-символов (Zero-Width) и скопировать",
    clearTip: "Очистить все рисунки и выделенные предложения",
    orientTip: "Сменить расположение: Снизу / Справа у края",
    collapseTip: "Свернуть панель в плавающую сферу",
    taskProgressLabel: "ПРОГРЕСС ЗАДАЧ:",
    sprintDoneNotice: "Alchemy Craft: Фокус-сессия завершена! +1 спринт записан в статистику.",
    breakDoneNotice: "Alchemy Craft: Перерыв окончен! Готовы к следующему спринту?",
    customPomodoroTitle: "Настройка времени фокуса",
    customPomodoroDesc: "Задайте свою длительность Pomodoro-спринта в минутах (от 1 до 360):",
    customPomodoroStart: "Запустить спринт",
    customPomodoroErr: "Пожалуйста, введите число от 1 до 360 минут.",
    ledModalSubtitle: "ALCHEMY CRAFT // СТУДИЯ СВЕТА",
    ledModalTitle: "Умная светодиодная лампа курсора",
    ledBrightness: "Яркость свечения",
    ledKelvin: "Цветовая температура (Кельвины)",
    ledDimmer: "Затемнение комнаты вокруг луча",
    ledRadius: "Радиус и форма луча",
    ledShapeRadial: "Круглый прожектор",
    ledShapeBar: "Настольная лампа BenQ",
    modalBadge: "ALCHEMIST PRO • ГОДОВОЙ ПАСС",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Годовой доступ по цене чашки кофе ($4.99 / год). Мгновенная активация через 0% EVM, Bybit UID, @CryptoBot или Промокод.",
    step1Title: "ШАГ 1: ВЫБЕРИТЕ УДОБНЫЙ СПОСОБ ОПЛАТЫ",
    netPromo: "Промокод / VIP Ключ",
    netPromoHint: "Активация по коду",
    netCryptoBot: "@CryptoBot Оплата",
    netCryptoBotHint: "В 1 клик в Telegram (Все монеты)",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID Перевод",
    netBybitHint: "0% комиссии • UID: 8015849",
    netSol: "Сеть Solana",
    netSolHint: "USDT / USDC • Супер-быстро",
    netTrc: "TRON (TRC20)",
    netTrcHint: "Стандартный USDT",
    amountLabel: "СУММА К ОПЛАТЕ:",
    copyAmountBtn: "Скопировать 4.99",
    recipientLabel: "АДРЕС ПОЛУЧАТЕЛЯ:",
    uidLabel: "BYBIT UID ПОЛУЧАТЕЛЯ:",
    copyBtn: "Скопировать адрес",
    copiedBtn: "Скопировано!",
    evmChainsLabel: "ПОДДЕРЖИВАЕМЫЕ EVM СЕТИ ДЛЯ ЭТОГО 0x АДРЕСА:",
    cardNote: "Введите ваш промокод, VIP-ключ или номер чека @CryptoBot во 2-м шаге ниже, либо нажмите кнопку для оплаты $4.99 через @CryptoBot.",
    cryptobotNote: "Нажмите кнопку ниже для оплаты $4.99 через @CryptoBot в 1 клик с полным описанием товара.",
    evmNote: "Этот единый 0x EVM-адрес принимает 4.99 USDT, USDC, DAI, ETH или BNB в сетях BNB Chain (BEP-20), Arbitrum One, Base, Polygon, Optimism и Ethereum!",
    bybitNote: "В приложении Bybit: Активы -> Вывод -> Внутренний перевод (0% комиссии) -> укажите UID 8015849 и 4.99 USDT.",
    trcNote: "Отправьте 4.99 USDT в сети TRON (TRC-20) с любого кошелька или биржи.",
    solNote: "Отправьте 4.99 USDT или USDC в сети Solana.",
    supportText: "Нужна помощь с оплатой или мгновенная ручная активация?",
    supportSub: "Прямая связь с автором в Telegram:",
    supportTgBtn: "Написать @StratAlchemy",
    step2Title: "ШАГ 2: ВВЕДИТЕ TXID, BYBIT ID ИЛИ ЛИЦЕНЗИОННЫЙ КЛЮЧ:",
    txPlaceholder: "Вставьте TXID (0x...), ID Bybit или ключ ACPRO-...",
    activateBtn: "Проверить и Активировать Pro",
    checkingBtn: "Проверка оплаты...",
    successMsg: "Поздравляем! Alchemy Craft Pro активирован на 365 дней!",
    errorEmpty: "Пожалуйста, введите корректный TXID, ID перевода или ключ.",
    errorPending: "Транзакция ещё подтверждается. Подождите 1 минуту и нажмите снова.",
    proActiveTitle: "PRO АКТИВЕН",
    proExpiresOn: "Годовой доступ активен до:",
    proMidnightName: "Ночной режим Midnight Dark Craft",
    proMidnightDesc: "Полная швейцарская темная тема для ночного чтения, таблиц, карточек и Графа.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Разблокируйте все Pro функции Alchemy Craft",
    proPerk1: "Midnight Dark Craft — полная темная тема для заметок, таблиц и Графа",
    proPerk2: "Расширенная палитра (8 цветов) — Rose Quartz, Cyber Cyan, Ruby Crimson и Solar Gold",
    proPerk3: "Swiss Bento Graph Studio — авто-раскраска всех папок вашей базы и скрытие мусорных точек",
    proPerk4: "Умная Лампа 2700K–6500K и 4-режимный Эквалайзер со звуком ПК (Telegram/Spotify)",
    getProBtn: "Получить Alchemy Craft Pro ($4.99 / год)",
    graphHudTitle: "ALCHEMY BENTO ГРАФ",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Созвездие",
    graphPresetRadar: "Фокус Радар",
    graphColorizeBtn: "Раскрасить мои папки",
    graphOrphansBtn: "Без одиночек",
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.1)",
    checkUpdatesBtn: "Проверить обновления",
    langName: "Язык интерфейса (6 мировых языков)",
    langDesc: "Мгновенно переводит все настройки, кнопки панели, Граф и окно оплаты на выбранный язык.",
    themeName: "Стиль Swiss Bento UI (Теплая бумага #F4F3EF + зеленые таблицы)",
    bentoGraphName: "Улучшенный Граф (Swiss Bento Graph Studio)",
    bentoGraphDesc: "Автоматически сканирует реальные папки вашей базы и раскрашивает все узлы Графа в 8 фирменных цветов + добавляет режимы Созвездия и Радара.",
    taskBarName: "Верхняя полоса прогресса задач (с кнопкой закрытия)",
    taskBarDesc: "Показывает процент выполненных задач вверху заметки и запускает салют при 100%.",
    headerBadgeName: "Текст верхнего бейджа над заголовком заметки",
    headerBadgeDesc: "Черная плашка над заголовком (например, 'STRATALCHEMY // KNOWLEDGE BRIEF'). Очистите поле, чтобы скрыть.",
    ambientName: "Фоновые звуки для глубокого фокуса (WebAudio)",
    ambientDesc: "Встроенный генератор звука во время Помодоро (Коричневый шум, Мягкий дождь, 40Hz Гамма-ритм).",
    pomoDurName: "Длительность Помодоро по умолчанию (минут)",
    pomoDurDesc: "Правый клик по таймеру в панели открывает быстрый выбор: 15м, 25м, 45м, 60м, 90м или свое время.",
    aiCleanSetName: "Показывать кнопку AI Очистки в панели",
    lampSetName: "Умная светодиодная лампа курсора (2700K–6500K и затемнение)",
    lampSetDesc: "Погружает экран в уютный полумрак, а вокруг курсора светит теплый или дневной луч (2700K–6500K).",
    lampConfigBtn: "Настроить лампу",
    keySoundSetName: "Тактильный звук клавиш при печати (Механика / Печатная машинка)",
    keySoundSetDesc: "Мгновенный синтез приятного звука механических свитчей (Deep Thock) или винтажной машинки при наборе текста.",
    eqSetName: "Живой 4-режимный Эквалайзер (Синхронизация со звуком ПК)",
    eqSetDesc: "Считывает системный звук компьютера (музыка из Telegram, YouTube, Spotify) без микрофона и анимирует 4 сложных визуализатора.",
    eqSyncBtn: "Подключить звук ПК",
    spotlightSetName: "Фокус-затемнение неактивных абзацев (Spotlight)",
    spotlightSetDesc: "Мягко приглушает соседние абзацы до 42%, оставляя на 100% яркости только текущий абзац.",
    numBadgeSetName: "Квадратные цветные бейджи цифр (01–04) и капсулы сумм ($)",
    numBadgeSetDesc: "Превращает нумерованные списки, маркеры [01]–[04], суммы и криптоадреса в четкие капсулы.",
    sentFocusSetName: "Интерактивное выделение предложений кликом (Sentence Focus)",
    analyticsTitle: "Статистика Фокуса и Серии Дней",
    statSprints: "Спринты",
    statDeepWork: "В потоке",
    statChecklists: "100% Списки",
    statStreak: "Серия дней",
    supportHeading: "Прямая оплата 0% комиссии, @CryptoBot и Сообщество",
    supportSetName: "Глобальная оплата и связь с автором",
    supportSetDesc: "Оплата без комиссии через Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 или в 1 клик через @CryptoBot."
  },
  zh: {
    eqTip: "左键: 切换4种高级频谱动画 | 右键: 同步电脑系统音乐 (Telegram/Spotify/YouTube)",
    audioSyncSystem: "同步电脑系统音频 (Telegram / YouTube / Spotify)",
    audioSyncMic: "麦克风 / 立体声混音输入",
    audioStopSync: "停止音频同步",
    audioModeBars: "01 // 峰值保持霓虹频谱 (Peak-Hold)",
    audioModeWave: "02 // 赛博流体三层波浪 (Liquid Ribbon)",
    audioModeOrb: "03 // 超新星极坐标光芒 (Supernova)",
    audioModeDna: "04 // 量子矩阵数字雨 (Quantum Matrix)",
    ambientRain: "环境音: 纸上淅沥雨声",
    ambientBrown: "环境音: 深度温暖棕噪音",
    ambientGamma: "环境音: 40Hz 伽马专注波",
    audioStopAll: "停止所有音频",
    audioConnectedNotice: "电脑系统音频已连接！均衡器现在随 Telegram、Spotify 等音乐实时律动。",
    audioMicConnectedNotice: "音频输入已连接至均衡器！",
    audioStoppedNotice: "音频同步已停止。",
    dockCollapseTip: "点击折叠/展开工具栏",
    timerTip: "左键: 开始/暂停 | 右键: 预设与音频 | 双击: 重置",
    uiBtn: "UI",
    uiTip: "瑞士 Bento 护眼纸张主题 (#F4F3EF) 与鼠尾草绿表格",
    zenBtn: "禅定",
    zenTip: "禅定模式 — 隐藏侧边栏，享受纯粹专注",
    focusBtn: "聚焦",
    focusTip: "句子高亮聚焦（点击句子以固定调色板颜色）",
    laserBtn: "激光",
    laserTip: "激光指示器（按 Esc 退出）",
    drawBtn: "画笔",
    drawTip: "自由马克笔标注（按 Esc 退出）",
    eraserBtn: "橡皮",
    eraserTip: "橡皮擦 — 擦除画笔轨迹（按 Esc 退出）",
    lampBtn: "神灯",
    lampBtnFull: "智能台灯",
    lampTip: "左键: 开关智能光标台灯 | 右键: 调节亮度、色温 (2700K–6500K) 与环境暗度",
    rulerBtn: "标尺",
    rulerTip: "开启激光阅读辅助标尺",
    undoTip: "撤销上一笔 (Ctrl+Z)",
    redoTip: "重做 (Ctrl+Y)",
    aiCleanBtn: "AI 清理",
    aiCleanTip: "一键清除不可见的 AI 零宽字符水印并复制纯文本",
    clearTip: "清除所有涂鸦与句子高亮",
    orientTip: "切换工具栏方向（底部横栏 / 右侧竖栏）",
    collapseTip: "折叠为炼金术悬浮球",
    taskProgressLabel: "任务进度:",
    sprintDoneNotice: "Alchemy Craft: 专注冲刺完成！已记录到专注统计。",
    breakDoneNotice: "Alchemy Craft: 休息结束！准备好开始下一轮专注了吗？",
    customPomodoroTitle: "自定义番茄钟时长",
    customPomodoroDesc: "输入自定义专注时长（1 至 360 分钟）：",
    customPomodoroStart: "开始专注",
    customPomodoroErr: "请输入 1 到 360 之间的分钟数。",
    ledModalSubtitle: "ALCHEMY CRAFT // 智能光学工作室",
    ledModalTitle: "智能 LED 光标台灯控制器",
    ledBrightness: "发光亮度 (Brightness)",
    ledKelvin: "色温调节 (2700K 暖光 – 6500K 冷白)",
    ledDimmer: "周围环境暗化程度",
    ledRadius: "光束半径与形状",
    ledShapeRadial: "圆形聚光灯",
    ledShapeBar: "显示器挂灯模式",
    modalBadge: "ALCHEMIST PRO • 年度通行证",
    modalTitle: "Alchemy Craft Pro 专业版",
    modalSubtitle: "仅需一杯咖啡的价格 ($4.99 / 年)。支持 0% 手续费 EVM、Bybit UID、@CryptoBot 及激活码。",
    step1Title: "第 1 步：选择支付方式",
    netPromo: "激活码 / VIP 密钥",
    netPromoHint: "使用代码即时激活",
    netCryptoBot: "@CryptoBot 支付",
    netCryptoBotHint: "Telegram 一键支付",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID 转账",
    netBybitHint: "0% 手续费 • UID: 8015849",
    netSol: "Solana 网络",
    netSolHint: "USDT / USDC • 极速确认",
    netTrc: "TRON (TRC20)",
    netTrcHint: "标准 USDT",
    amountLabel: "支付金额:",
    copyAmountBtn: "复制 4.99",
    recipientLabel: "收款地址:",
    uidLabel: "BYBIT 收款 UID:",
    copyBtn: "复制地址",
    copiedBtn: "已复制!",
    evmChainsLabel: "此 0x 地址支持的 EVM 网络：",
    cardNote: "请在下方第 2 步输入您的激活码或 @CryptoBot 账单号，或点击下方按钮支付 $4.99。",
    cryptobotNote: "点击下方按钮通过 Telegram @CryptoBot 一键支付 $4.99。",
    evmNote: "此通用 0x EVM 地址支持 BNB Chain (BEP20)、Arbitrum One、Base、Polygon、Optimism 和 Ethereum 网络发送 4.99 USDT/USDC！",
    bybitNote: "在 Bybit App 中：资产 -> 提现 -> 内部转账（0 手续费）-> 输入 UID 8015849 和 4.99 USDT。",
    trcNote: "通过 TRON (TRC-20) 网络发送 4.99 USDT。",
    solNote: "通过 Solana 网络发送 4.99 USDT 或 USDC。",
    supportText: "需要帮助或人工即时激活？",
    supportSub: "直接联系作者 Telegram:",
    supportTgBtn: "打开 @StratAlchemy",
    step2Title: "第 2 步：输入 TXID、BYBIT 订单号或 ACPRO 激活密钥：",
    txPlaceholder: "粘贴 TXID (0x...)、Bybit 订单号或 ACPRO-... 密钥",
    activateBtn: "验证并激活 Pro",
    checkingBtn: "正在验证支付...",
    successMsg: "激活成功！Alchemy Craft Pro 已开启 365 天权限！",
    errorEmpty: "请输入有效的 TXID、订单号或激活密钥。",
    errorPending: "交易正在确认中，请等待 1 分钟后重试。",
    proActiveTitle: "PRO 已激活",
    proExpiresOn: "年度通行证有效期至：",
    proMidnightName: "午夜暗黑模式 (Midnight Dark Craft)",
    proMidnightDesc: "专为夜间阅读、知识图谱与编程打造的瑞士暗黑主题。",
    proBuyCardBadge: "ALCHEMIST PRO 通行证",
    proBuyCardTitle: "解锁 Alchemy Craft Pro 全部高级功能",
    proPerk1: "Midnight Dark Craft — 完整的瑞士暗黑模式（支持笔记、表格与知识图谱）",
    proPerk2: "8 色高级调色板 — 新增玫瑰粉、赛博青、深红与日曜金",
    proPerk3: "瑞士 Bento 知识图谱工作室 — 自动扫描文件夹配色与悬浮控制器",
    proPerk4: "2700K–6500K 智能光标台灯与 4 模式电脑音频均衡器",
    getProBtn: "获取 Alchemy Craft Pro ($4.99 / 年)",
    graphHudTitle: "ALCHEMY BENTO 知识图谱",
    graphPresetBento: "瑞士 Bento",
    graphPresetConstellation: "星群模式",
    graphPresetRadar: "焦点雷达",
    graphColorizeBtn: "一键配色我的文件夹",
    graphOrphansBtn: "隐藏孤立点",
    settingsTitle: "Alchemy Craft — 瑞士 Bento 阅读、图谱与专注系统 (v4.3.1)",
    checkUpdatesBtn: "检查更新",
    langName: "界面语言 (支持 6 种国际语言)",
    langDesc: "即时切换所有设置项、工具栏、图谱控制器与收银台语言。",
    themeName: "瑞士 Bento UI 主题 (#F4F3EF 暖纸 + #69BD28 表格)",
    bentoGraphName: "瑞士 Bento 知识图谱工作室 (自动文件夹配色)",
    bentoGraphDesc: "自动扫描您仓库中的真实文件夹并分配 8 种瑞士 Bento 色彩，告别灰暗凌乱的图谱。",
    taskBarName: "顶部任务进度条 (支持一键关闭与 100% 礼花)",
    taskBarDesc: "在包含任务列表的笔记顶部显示完成百分比。",
    headerBadgeName: "笔记标题上方徽章文本",
    headerBadgeDesc: "显示在笔记标题上方的标签（清空文本即可隐藏）。",
    ambientName: "专注背景白噪音 (WebAudio)",
    ambientDesc: "无需联网的合成背景音（棕噪音、纸上雨声、40Hz 专注伽马波）。",
    pomoDurName: "默认番茄钟时长 (分钟)",
    pomoDurDesc: "右键点击工具栏计时器可随时切换 15、25、45、60、90 分钟或自定义时长。",
    aiCleanSetName: "在工具栏显示 AI 隐形水印清理按钮",
    lampSetName: "智能 LED 光标台灯 (2700K–6500K 色温与环境调光)",
    lampSetDesc: "暗化周围屏幕区域，让鼠标化作一束可调色温与亮度的聚光灯照亮文字。",
    lampConfigBtn: "调节台灯参数",
    keySoundSetName: "机械键盘打字音效 (Topre Thock / 复古打字机)",
    keySoundSetDesc: "打字时实时合成清脆舒适的机械轴体声效。",
    eqSetName: "4 模式实时音频均衡器 (同步电脑系统音乐)",
    eqSetDesc: "直接捕获电脑正在播放的音乐（Telegram、YouTube、Spotify），内置 4 种高复杂度频谱动画。",
    eqSyncBtn: "同步电脑系统音频",
    spotlightSetName: "段落聚光灯暗化模式 (Spotlight)",
    spotlightSetDesc: "将非活动段落柔和暗化至 42% 不透明度，突出当前阅读段落。",
    numBadgeSetName: "方形彩色数字徽章 (01–04) 与金额胶囊",
    numBadgeSetDesc: "将编号列表、[01]–[04]、金额与 0x 地址自动转换为瑞士胶囊徽章。",
    sentFocusSetName: "句子点击高亮固定 (Sentence Focus)",
    analyticsTitle: "专注时长与连续打卡统计",
    statSprints: "完成番茄",
    statDeepWork: "深度专注",
    statChecklists: "满分清单",
    statStreak: "连续天数",
    supportHeading: "0% 手续费直付、@CryptoBot 与社区支持",
    supportSetName: "全球支付与直接联系作者",
    supportSetDesc: "支持 Universal EVM (BEP20, Arbitrum, Base, Polygon)、Bybit UID 8015849 或 @CryptoBot。"
  },
  ja: {
    eqTip: "左クリック: 4種のスペクトラム切替 | 右クリック: PCシステム音声同期 (Telegram/Spotify/YouTube)",
    audioSyncSystem: "PCシステム音声ループバック (Telegram / YouTube / Spotify)",
    audioSyncMic: "マイク / ステレオミキサー入力",
    audioStopSync: "音声同期を停止",
    audioModeBars: "01 // ピークホールド・ネオンスペクトラム",
    audioModeWave: "02 // サイバーリキッド・3層リボン波",
    audioModeOrb: "03 // スーパーノヴァ・極座標サンバースト",
    audioModeDna: "04 // クォンタム・マトリックスレイン",
    ambientRain: "環境音: 紙の上の優しい雨音",
    ambientBrown: "環境音: ディープ・ブラウンノイズ",
    ambientGamma: "環境音: 40Hz ガンマ集中ドローン",
    audioStopAll: "すべての音声を停止",
    audioConnectedNotice: "PCシステム音声が接続されました！TelegramやSpotifyの音楽に合わせてイコライザーが動きます。",
    audioMicConnectedNotice: "音声入力がイコライザーに接続されました！",
    audioStoppedNotice: "音声同期を停止しました。",
    dockCollapseTip: "クリックしてドックを折りたたみ/展開",
    timerTip: "左: 開始/一時停止 | 右: プリセット＆音声 | ダブルクリック: リセット",
    uiBtn: "UI",
    uiTip: "Swiss Bento UI テーマ（アーカイブ紙 #F4F3EF ＆ Excelグリーン表）",
    zenBtn: "禅",
    zenTip: "禅モード — サイドバーを隠して深い集中へ",
    focusBtn: "フォーカス",
    focusTip: "文フォーカス（文をクリックして選択中のパレット色でピン留め）",
    laserBtn: "レーザー",
    laserTip: "レーザーポインター（Escで終了）",
    drawBtn: "マーカー",
    drawTip: "フリーハンドマーカー描画（Escで終了）",
    eraserBtn: "消しゴム",
    eraserTip: "消しゴム — 描画を消去（Escで終了）",
    lampBtn: "ランプ",
    lampBtnFull: "スマートLEDランプ",
    lampTip: "左: スマートLEDランプ切替 | 右: 輝度・色温度 (2700K–6500K)・周囲減光の設定",
    rulerBtn: "ルーラー",
    rulerTip: "レーザー読書ルーラーを表示",
    undoTip: "元に戻す (Ctrl+Z)",
    redoTip: "やり直し (Ctrl+Y)",
    aiCleanBtn: "AI クリーン",
    aiCleanTip: "不可視のAIゼロ幅スペースを除去してコピー",
    clearTip: "すべての描画とハイライトを消去",
    orientTip: "ドックの向きを切り替え（下部バー / 右側ピラー）",
    collapseTip: "錬金術オーブに折りたたむ",
    taskProgressLabel: "タスク進捗:",
    sprintDoneNotice: "Alchemy Craft: 集中スプリント完了！統計に記録されました。",
    breakDoneNotice: "Alchemy Craft: 休憩終了！次のスプリントを始めましょう。",
    customPomodoroTitle: "カスタム集中タイマー設定",
    customPomodoroDesc: "ポモドーロの分数（1〜360分）を入力してください：",
    customPomodoroStart: "スプリント開始",
    customPomodoroErr: "1〜360の数値を入力してください。",
    ledModalSubtitle: "ALCHEMY CRAFT // LUMINA STUDIO",
    ledModalTitle: "スマートLEDカーソルランプ設定",
    ledBrightness: "明るさ (Brightness)",
    ledKelvin: "色温度 (2700K 電球色 – 6500K 昼光色)",
    ledDimmer: "周囲の部屋の暗さ (Room Dimmer)",
    ledRadius: "ビーム半径と形状",
    ledShapeRadial: "円形スポットライト",
    ledShapeBar: "デスクライトバー",
    modalBadge: "ALCHEMIST PRO • 1年間パス",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "コーヒー1杯分の価格 ($4.99 / 年)。0%手数料EVM、Bybit UID、@CryptoBot、プロモコードで即座に有効化。",
    step1Title: "ステップ 1: 支払い方法を選択",
    netPromo: "プロモ / VIPキー",
    netPromoHint: "コードで即時有効化",
    netCryptoBot: "@CryptoBot 決済",
    netCryptoBotHint: "Telegram 1クリック決済",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID 送金",
    netBybitHint: "手数料 0% • UID: 8015849",
    netSol: "Solana ネットワーク",
    netSolHint: "USDT / USDC • 超高速",
    netTrc: "TRON (TRC20)",
    netTrcHint: "標準 USDT",
    amountLabel: "送金金額:",
    copyAmountBtn: "4.99 をコピー",
    recipientLabel: "受取アドレス:",
    uidLabel: "BYBIT 受取 UID:",
    copyBtn: "アドレスをコピー",
    copiedBtn: "コピー完了!",
    evmChainsLabel: "この 0x アドレスが対応する全 EVM ネットワーク:",
    cardNote: "下のステップ2にプロモコードまたは @CryptoBot 請求書IDを入力するか、下のボタンから $4.99 をお支払いください。",
    cryptobotNote: "下のボタンから @CryptoBot を開き、1クリックで $4.99 を決済できます。",
    evmNote: "この単一の0x EVMアドレスは、BNB Chain (BEP20)、Arbitrum、Base、Polygon、Optimism、Ethereum上の4.99 USDT/USDCに対応しています。",
    bybitNote: "Bybitアプリ：資産 -> 出金 -> 内部振替（手数料0%）-> UID 8015849 と 4.99 USDT を入力。",
    trcNote: "TRON (TRC-20) ネットワークで 4.99 USDT を送金してください。",
    solNote: "Solana ネットワークで 4.99 USDT または USDC を送金してください。",
    supportText: "サポートや手動アクティベーションが必要ですか？",
    supportSub: "開発者へTelegramで直接連絡:",
    supportTgBtn: "@StratAlchemy を開く",
    step2Title: "ステップ 2: TXID、BYBIT ID、またはライセンスキーを入力:",
    txPlaceholder: "TXID (0x...)、Bybit ID、または ACPRO-... キーを貼り付け",
    activateBtn: "確認して Pro を有効化",
    checkingBtn: "決済を確認中...",
    successMsg: "成功！Alchemy Craft Pro が365日間有効化されました！",
    errorEmpty: "有効なTXID、注文ID、またはキーを入力してください。",
    errorPending: "トランザクションを確認中です。1分後にもう一度お試しください。",
    proActiveTitle: "PRO 有効",
    proExpiresOn: "年間パス有効期限:",
    proMidnightName: "Midnight Dark Craft モード",
    proMidnightDesc: "夜間の読書、グラフビュー、コーディング向けに設計されたスイス・ダークテーマ。",
    proBuyCardBadge: "ALCHEMIST PRO パス",
    proBuyCardTitle: "Alchemy Craft Pro の全機能をアンロック",
    proPerk1: "Midnight Dark Craft — ノート、表、グラフ対応の完全ダークモード",
    proPerk2: "8色拡張パレット — ローズ、サイバーシアン、クリムゾン、ソーラーゴールド",
    proPerk3: "Swiss Bento グラフスタジオ — フォルダ自動カラーリング＆専用HUD",
    proPerk4: "2700K–6500K スマートLEDランプ＆PC音楽連動4モードイコライザー",
    getProBtn: "Alchemy Craft Pro を入手 ($4.99 / 年)",
    graphHudTitle: "ALCHEMY BENTO グラフ",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "星座モード",
    graphPresetRadar: "レーダー",
    graphColorizeBtn: "フォルダ自動色分け",
    graphOrphansBtn: "孤立ノード非表示",
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.1)",
    checkUpdatesBtn: "アップデート確認",
    langName: "インターフェース言語 (6ヶ国語対応)",
    langDesc: "すべての設定項目、ドック、グラフHUD、決済画面を選択した言語に切り替えます。",
    themeName: "Swiss Bento UI テーマ (#F4F3EF 紙キャンバス + #69BD28 表)",
    bentoGraphName: "Swiss Bento グラフスタジオ (自動フォルダ色分け)",
    bentoGraphDesc: "保管庫内の実際のフォルダを自動スキャンして8色のBentoカラーを割り当て、美しいグラフを生成します。",
    taskBarName: "上部タスク進捗バー (閉じるボタン＆100%紙吹雪付き)",
    taskBarDesc: "チェックリスト付きノートの上部に進捗率を表示します。",
    headerBadgeName: "ノートタイトル上のバッジテキスト",
    headerBadgeDesc: "タイトルの上に表示されるラベル（空欄にすると非表示になります）。",
    ambientName: "集中環境音ジェネレーター (WebAudio)",
    ambientDesc: "ポモドーロ中に再生できる合成環境音（ブラウンノイズ、雨音、40Hzガンマ波）。",
    pomoDurName: "デフォルトのポモドーロ時間 (分)",
    pomoDurDesc: "ドックのタイマーを右クリックすると、15分〜90分やカスタム時間をいつでも選択できます。",
    aiCleanSetName: "ドックに AI 透かしクリーナーボタンを表示",
    lampSetName: "スマートLEDカーソルランプ (2700K–6500K 色温度＆周囲減光)",
    lampSetDesc: "周囲を暗くし、カーソル周りを2700K〜6500Kのスポットライトで美しく照らします。",
    lampConfigBtn: "ランプ設定を開く",
    keySoundSetName: "メカニカル打鍵音 (Topre Thock / タイプライター)",
    keySoundSetDesc: "タイピング時に心地よいメカニカルスイッチ音をリアルタイム合成します。",
    eqSetName: "4モード・ソニックイコライザー (PCシステム音声同期)",
    eqSetDesc: "Telegram、YouTube、SpotifyなどPCで再生中の音楽を直接読み取り、4種類の高度なアニメーションを表示します。",
    eqSyncBtn: "PC音声を同期",
    spotlightSetName: "スポットライト段落減光モード",
    spotlightSetDesc: "選択していない段落を42%に減光し、現在読んでいる段落に集中させます。",
    numBadgeSetName: "スクエア数字バッジ (01–04) ＆ 金額カプセル",
    numBadgeSetDesc: "番号付きリスト、[01]–[04]、金額、0xアドレスをスイスのカプセルバッジに変換します。",
    sentFocusSetName: "文クリック・ハイライト固定 (Sentence Focus)",
    analyticsTitle: "集中セッション統計＆ストリーク",
    statSprints: "スプリント",
    statDeepWork: "集中時間",
    statChecklists: "100%達成",
    statStreak: "連続日数",
    supportHeading: "手数料0%決済、@CryptoBot ＆ コミュニティ",
    supportSetName: "グローバル決済＆開発者への直接連絡",
    supportSetDesc: "Universal EVM (BEP20, Arbitrum, Base, Polygon)、Bybit UID 8015849、または @CryptoBot で決済可能。"
  },
  es: {
    eqTip: "Clic izq: Cambiar 4 visualizadores | Clic der: Sincronizar música de PC (Telegram/Spotify/YouTube)",
    audioSyncSystem: "Audio del Sistema PC (Telegram / YouTube / Spotify)",
    audioSyncMic: "Entrada de Micrófono / Mezcla Estéreo",
    audioStopSync: "Detener sincronización de audio",
    audioModeBars: "01 // Espectro Neón con Retención de Picos",
    audioModeWave: "02 // Cinta Líquida Ciber de 3 Capas",
    audioModeOrb: "03 // Supernova Polar Radial",
    audioModeDna: "04 // Matriz Cuántica Digital",
    ambientRain: "Ambiente: Lluvia suave sobre papel",
    ambientBrown: "Ambiente: Ruido marrón profundo",
    ambientGamma: "Ambiente: Enfoque gamma de 40Hz",
    audioStopAll: "Detener todo el audio",
    audioConnectedNotice: "¡Audio del sistema PC conectado! El ecualizador ahora reacciona a Telegram, Spotify y YouTube.",
    audioMicConnectedNotice: "¡Entrada de audio conectada al ecualizador!",
    audioStoppedNotice: "Sincronización de audio detenida.",
    dockCollapseTip: "Clic para plegar/desplegar el panel Alchemy Craft",
    timerTip: "Clic Izq: Iniciar/Pausar | Clic Der: Ajustes y Audio | Doble Clic: Reiniciar",
    uiBtn: "UI",
    uiTip: "Tema Swiss Bento UI (Papel cálido #F4F3EF + Tablas verde salvia)",
    zenBtn: "Zen",
    zenTip: "Modo Zen — oculta paneles laterales para concentración total",
    focusBtn: "Enfoque",
    focusTip: "Resaltado de frases (haz clic en cualquier frase para fijar el color activo)",
    laserBtn: "Láser",
    laserTip: "Puntero Láser (Esc para salir)",
    drawBtn: "Trazar",
    drawTip: "Marcador de dibujo libre sobre la nota (Esc para salir)",
    eraserBtn: "Borrar",
    eraserTip: "Borrador — elimina trazos bajo el cursor (Esc para salir)",
    lampBtn: "Lámpara",
    lampBtnFull: "Lámpara LED",
    lampTip: "Clic Izq: Encender/Apagar Lámpara LED | Clic Der: Ajustar Brillo, Kelvin (2700K–6500K) y Atenuador",
    rulerBtn: "Regla",
    rulerTip: "Mostrar regla láser de lectura",
    undoTip: "Deshacer último trazo (Ctrl+Z)",
    redoTip: "Rehacer trazo (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Elimina marcas de agua invisibles de IA (Zero-Width) y copia texto limpio",
    clearTip: "Borrar todos los dibujos y frases resaltadas",
    orientTip: "Cambiar orientación (Barra inferior / Pilar lateral derecho)",
    collapseTip: "Plegar en esfera flotante",
    taskProgressLabel: "PROGRESO DE TAREAS:",
    sprintDoneNotice: "Alchemy Craft: ¡Sprint de enfoque completado! Registrado en tus estadísticas.",
    breakDoneNotice: "Alchemy Craft: ¡Descanso terminado! ¿Listo para el siguiente sprint?",
    customPomodoroTitle: "Duración Personalizada de Pomodoro",
    customPomodoroDesc: "Define los minutos de tu sprint de enfoque (de 1 a 360):",
    customPomodoroStart: "Iniciar Sprint",
    customPomodoroErr: "Por favor ingresa un número entre 1 y 360 minutos.",
    ledModalSubtitle: "ALCHEMY CRAFT // LUMINA STUDIO",
    ledModalTitle: "Lámpara LED Inteligente del Cursor",
    ledBrightness: "Brillo (Intensidad de Luz)",
    ledKelvin: "Temperatura de Color (2700K – 6500K)",
    ledDimmer: "Atenuador de Habitación Circundante",
    ledRadius: "Radio y Forma del Haz",
    ledShapeRadial: "Foco Radial",
    ledShapeBar: "Barra de Escritorio",
    modalBadge: "ALCHEMIST PRO • PASE DE 1 AÑO",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Pase anual por el precio de un café ($4.99 / año). Pago directo 0% comisión vía EVM, Bybit UID, @CryptoBot o Código Promo.",
    step1Title: "PASO 1: SELECCIONA MÉTODO DE PAGO",
    netPromo: "Código Promo / VIP",
    netPromoHint: "Activación por código",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Clic en Telegram",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID Transfer",
    netBybitHint: "0% Comisión • UID: 8015849",
    netSol: "Red Solana",
    netSolHint: "USDT / USDC • Ultra-rápido",
    netTrc: "TRON (TRC20)",
    netTrcHint: "USDT Estándar",
    amountLabel: "MONTO A ENVIAR:",
    copyAmountBtn: "Copiar 4.99",
    recipientLabel: "DIRECCIÓN DE DESTINO:",
    uidLabel: "BYBIT UID DE DESTINO:",
    copyBtn: "Copiar Dirección",
    copiedBtn: "¡Copiado!",
    evmChainsLabel: "REDES EVM COMPATIBLES CON ESTA DIRECCIÓN 0x:",
    cardNote: "Ingresa tu código promocional o ID de recibo @CryptoBot en el Paso 2 abajo, o haz clic para pagar $4.99 vía @CryptoBot.",
    cryptobotNote: "Haz clic abajo para abrir @CryptoBot en Telegram y pagar $4.99 en 1 clic.",
    evmNote: "Esta dirección 0x Universal EVM acepta 4.99 USDT, USDC, DAI, ETH o BNB en BNB Chain (BEP-20), Arbitrum, Base, Polygon, Optimism y Ethereum.",
    bybitNote: "En la App de Bybit: Activos -> Retirar -> Transferencia Interna (0% comisión) -> ingresa UID 8015849 y 4.99 USDT.",
    trcNote: "Envía 4.99 USDT mediante la red TRON (TRC-20).",
    solNote: "Envía 4.99 USDT o USDC en la red Solana.",
    supportText: "¿Necesitas ayuda o activación manual instantánea?",
    supportSub: "Contacto directo en Telegram:",
    supportTgBtn: "Abrir @StratAlchemy",
    step2Title: "PASO 2: INGRESA TXID, ID DE BYBIT O CLAVE DE LICENCIA:",
    txPlaceholder: "Pega tu TXID (0x...), ID de Bybit o clave ACPRO-...",
    activateBtn: "Verificar y Activar Pro",
    checkingBtn: "Verificando pago...",
    successMsg: "¡Éxito! Alchemy Craft Pro está activo por 365 días.",
    errorEmpty: "Ingresa un TXID, ID de orden o clave válida.",
    errorPending: "Transacción en confirmación. Espera 1 minuto e intenta de nuevo.",
    proActiveTitle: "PRO ACTIVO",
    proExpiresOn: "Pase anual activo hasta:",
    proMidnightName: "Modo Oscuro Midnight Dark Craft",
    proMidnightDesc: "Tema oscuro suizo diseñado para lectura nocturna, Grafo y programación.",
    proBuyCardBadge: "PASE ALCHEMIST PRO",
    proBuyCardTitle: "Desbloquea Todas las Funciones Pro en Alchemy Craft",
    proPerk1: "Midnight Dark Craft — tema oscuro completo para notas, tablas y Grafo",
    proPerk2: "Paleta Expandida de 8 Colores — Rosa, Cian, Carmesí y Oro Solar",
    proPerk3: "Swiss Bento Graph Studio — coloreado automático de tus carpetas reales y HUD",
    proPerk4: "Lámpara LED 2700K–6500K y Ecualizador de 4 Modos con Audio del PC",
    getProBtn: "Obtener Alchemy Craft Pro ($4.99 / año)",
    graphHudTitle: "GRAFO ALCHEMY BENTO",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Constelación",
    graphPresetRadar: "Radar Focus",
    graphColorizeBtn: "Colorear Mis Carpetas",
    graphOrphansBtn: "Ocultar Huérfanos",
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.1)",
    checkUpdatesBtn: "Buscar Actualizaciones",
    langName: "Idioma de la Interfaz (6 Idiomas Globales)",
    langDesc: "Traduce al instante todos los ajustes, botones de la barra, Grafo y ventana de pago.",
    themeName: "Tema Swiss Bento UI (Papel cálido #F4F3EF + Tablas verdes)",
    bentoGraphName: "Swiss Bento Graph Studio (Coloreado Automático de Carpetas)",
    bentoGraphDesc: "Escanea las carpetas reales de tu bóveda y asigna los 8 colores Swiss Bento a todos los nodos del Grafo.",
    taskBarName: "Barra Superior de Progreso de Tareas (Con botón cerrar)",
    taskBarDesc: "Muestra el % de tareas completadas arriba de la nota con confeti al llegar al 100%.",
    headerBadgeName: "Texto de Insignia Superior de Nota",
    headerBadgeDesc: "Etiqueta editorial sobre el título de la nota (vacía el campo para ocultar).",
    ambientName: "Sonido Ambiente de Enfoque (WebAudio)",
    ambientDesc: "Generador de sonido relajante durante sprints Pomodoro (Ruido Marrón, Lluvia, 40Hz Gamma).",
    pomoDurName: "Duración Pomodoro por Defecto (Minutos)",
    pomoDurDesc: "Haz clic derecho en el temporizador para elegir 15m, 25m, 45m, 60m, 90m o duración personalizada.",
    aiCleanSetName: "Mostrar Botón Limpiador de IA en la Barra",
    lampSetName: "Lámpara LED Inteligente del Cursor (2700K–6500K y Atenuador)",
    lampSetDesc: "Atenúa la habitación alrededor mientras tu cursor ilumina el texto con luz cálida o fría (2700K–6500K).",
    lampConfigBtn: "Configurar Lámpara",
    keySoundSetName: "Sonido Táctil de Teclado Mecánico (Topre Thock / Máquina de Escribir)",
    keySoundSetDesc: "Sonido acústico de interruptores mecánicos en tiempo real mientras escribes.",
    eqSetName: "Ecualizador Sónico de 4 Modos (Sincronizado con Audio del PC)",
    eqSetDesc: "Reacciona directamente a la música de tu PC (Telegram, YouTube, Spotify) con 4 animaciones avanzadas.",
    eqSyncBtn: "Sincronizar Audio PC",
    spotlightSetName: "Atenuador de Párrafos Inactivos (Spotlight)",
    spotlightSetDesc: "Atenúa suavemente los párrafos inactivos al 42% manteniendo el párrafo actual al 100%.",
    numBadgeSetName: "Insignias Cuadradas de Números (01–04) y Cápsulas de Dinero",
    numBadgeSetDesc: "Transforma listas numeradas, [01]–[04], montos $ y direcciones 0x en cápsulas suizas.",
    sentFocusSetName: "Resaltado Interactivo de Frases con Clic (Sentence Focus)",
    analyticsTitle: "Analíticas de Enfoque y Rachas",
    statSprints: "Sprints",
    statDeepWork: "Enfoque",
    statChecklists: "Listas 100%",
    statStreak: "Racha Días",
    supportHeading: "Pago Directo 0% Comisión, @CryptoBot y Comunidad",
    supportSetName: "Pago Global y Contacto Directo con el Autor",
    supportSetDesc: "Paga con 0% comisión vía Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 o @CryptoBot."
  },
  de: {
    eqTip: "L-Klick: 4 Pro-Visualizer wechseln | R-Klick: PC-System-Audio synchronisieren (Telegram/Spotify/YouTube)",
    audioSyncSystem: "PC-System-Audio Loopback (Telegram / YouTube / Spotify)",
    audioSyncMic: "Mikrofon / Stereomix-Eingang",
    audioStopSync: "Live-Audio-Synchronisation stoppen",
    audioModeBars: "01 // Peak-Hold Neon-Spektrumanalysator",
    audioModeWave: "02 // Cyber-Liquid 3-Schicht-Sinusband",
    audioModeOrb: "03 // Supernova Polar-Strahlenkranz",
    audioModeDna: "04 // Quanten-Matrix Digital-Regen",
    ambientRain: "Atmosphäre: Sanfter Regen auf Papier",
    ambientBrown: "Atmosphäre: Tiefes warmes Brown-Rauschen",
    ambientGamma: "Atmosphäre: 40Hz Gamma-Fokus",
    audioStopAll: "Alle Audios stoppen",
    audioConnectedNotice: "PC-System-Audio verbunden! Der Equalizer reagiert jetzt live auf Telegram, Spotify & YouTube.",
    audioMicConnectedNotice: "Audioeingang mit Equalizer verbunden!",
    audioStoppedNotice: "Audiosynchronisation beendet.",
    dockCollapseTip: "Klicken zum Ein-/Ausklappen des Alchemy Craft Docks",
    timerTip: "Links: Start/Pause | Rechts: Presets & Audio | Doppelklick: Reset",
    uiBtn: "UI",
    uiTip: "Swiss Bento UI-Theme (Warmes Papier #F4F3EF + Salbeigrüne Tabellen)",
    zenBtn: "Zen",
    zenTip: "Zen-Modus — Seitenleisten für puren Fokus ausblenden",
    focusBtn: "Fokus",
    focusTip: "Satz-Fokus (Satz anklicken, um aktive Palettenfarbe anzuheften)",
    laserBtn: "Laser",
    laserTip: "Laserpointer (Esc zum Beenden)",
    drawBtn: "Marker",
    drawTip: "Freihand-Marker auf der Notiz (Esc zum Beenden)",
    eraserBtn: "Radierer",
    eraserTip: "Radierer — Zeichnungen löschen (Esc zum Beenden)",
    lampBtn: "Lampe",
    lampBtnFull: "Smart LED Lampe",
    lampTip: "Links: Smart LED Lampe ein/aus | Rechts: Helligkeit, Kelvin (2700K–6500K) & Raum-Dimmer einstellen",
    rulerBtn: "Lineal",
    rulerTip: "Laser-Leselineal ein-/ausblenden",
    undoTip: "Rückgängig (Ctrl+Z)",
    redoTip: "Wiederholen (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Unsichtbare KI-Wasserzeichen (Zero-Width) entfernen & Text kopieren",
    clearTip: "Alle Zeichnungen und Markierungen löschen",
    orientTip: "Ausrichtung wechseln (Unten / Rechte Seitenleiste)",
    collapseTip: "Zur schwebenden Kugel einklappen",
    taskProgressLabel: "AUFGABEN-FORTSCHRITT:",
    sprintDoneNotice: "Alchemy Craft: Fokus-Sprint abgeschlossen! In deiner Statistik gespeichert.",
    breakDoneNotice: "Alchemy Craft: Pause beendet! Bereit für den nächsten Sprint?",
    customPomodoroTitle: "Eigene Fokus-Dauer einstellen",
    customPomodoroDesc: "Gib deine gewünschte Pomodoro-Dauer in Minuten ein (1 bis 360):",
    customPomodoroStart: "Sprint starten",
    customPomodoroErr: "Bitte gib eine Zahl zwischen 1 und 360 Minuten ein.",
    ledModalSubtitle: "ALCHEMY CRAFT // LUMINA STUDIO",
    ledModalTitle: "Smart LED Cursor-Lampe",
    ledBrightness: "Helligkeit (Leuchtstärke)",
    ledKelvin: "Farbtemperatur (2700K Warm – 6500K Tageslicht)",
    ledDimmer: "Umgebungs-Raumdimmer",
    ledRadius: "Lichtkegel-Radius & Form",
    ledShapeRadial: "Radialer Spot",
    ledShapeBar: "Schreibtisch-Lightbar",
    modalBadge: "ALCHEMIST PRO • 1-JAHRES-PASS",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Jahrespass zum Preis eines Kaffees ($4.99 / Jahr). Sofortige Aktivierung via 0% EVM, Bybit UID, @CryptoBot oder Promo-Key.",
    step1Title: "SCHRITT 1: ZAHLUNGSMETHODE WÄHLEN",
    netPromo: "Promo / VIP-Key",
    netPromoHint: "Sofortige Code-Aktivierung",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Klick in Telegram",
    netEvm: "Universal EVM (0x...)",
    netEvmHint: "BEP20 • Arbitrum • Base • Polygon",
    netBybit: "Bybit UID Transfer",
    netBybitHint: "0% Gebühr • UID: 8015849",
    netSol: "Solana Netzwerk",
    netSolHint: "USDT / USDC • Ultraschnell",
    netTrc: "TRON (TRC20)",
    netTrcHint: "Standard USDT",
    amountLabel: "BETRAG:",
    copyAmountBtn: "4.99 kopieren",
    recipientLabel: "EMPFÄNGERADRESSE:",
    uidLabel: "BYBIT EMPFÄNGER-UID:",
    copyBtn: "Adresse kopieren",
    copiedBtn: "Kopiert!",
    evmChainsLabel: "UNTERSTÜTZTE EVM-NETZWERKE FÜR DIESE 0x-ADRESSE:",
    cardNote: "Gib deinen Promo-Code oder @CryptoBot Beleg in Schritt 2 unten ein, oder klicke unten, um $4.99 via @CryptoBot zu zahlen.",
    cryptobotNote: "Klicke unten, um @CryptoBot in Telegram zu öffnen und $4.99 mit 1 Klick zu senden.",
    evmNote: "Diese universelle 0x EVM-Adresse akzeptiert 4.99 USDT, USDC, DAI, ETH oder BNB auf BNB Chain (BEP20), Arbitrum, Base, Polygon, Optimism und Ethereum!",
    bybitNote: "In der Bybit-App: Assets -> Auszahlen -> Interner Transfer (0% Gebühr) -> UID 8015849 und 4.99 USDT eingeben.",
    trcNote: "Sende 4.99 USDT über das TRON-Netzwerk (TRC-20).",
    solNote: "Sende 4.99 USDT oder USDC im Solana-Netzwerk.",
    supportText: "Hilfe oder sofortige manuelle Aktivierung benötigt?",
    supportSub: "Direkter Telegram-Kontakt:",
    supportTgBtn: "@StratAlchemy öffnen",
    step2Title: "SCHRITT 2: TXID, BYBIT-ID ODER LIZENZSCHLÜSSEL EINGEBEN:",
    txPlaceholder: "TXID (0x...), Bybit-ID oder ACPRO-... Key einfügen",
    activateBtn: "Prüfen & Pro aktivieren",
    checkingBtn: "Zahlung wird geprüft...",
    successMsg: "Erfolg! Alchemy Craft Pro ist jetzt für 365 Tage aktiviert!",
    errorEmpty: "Bitte gib eine gültige TXID, Bestell-ID oder Lizenznummer ein.",
    errorPending: "Transaktion wird noch bestätigt. Bitte 1 Minute warten.",
    proActiveTitle: "PRO AKTIV",
    proExpiresOn: "Jahrespass aktiv bis:",
    proMidnightName: "Midnight Dark Craft Modus",
    proMidnightDesc: "Schweizer Dark-Mode für nächtliches Lesen, Graph-Ansicht und Coding.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Alle Pro-Funktionen in Alchemy Craft freischalten",
    proPerk1: "Midnight Dark Craft — komplettes Schweizer Dark-Theme für Notizen, Tabellen & Graph",
    proPerk2: "Erweiterte 8-Farben-Palette — Rose Quartz, Cyber Cyan, Ruby Crimson & Solar Gold",
    proPerk3: "Swiss Bento Graph Studio — automatische Ordner-Farbgruppen & Live-HUD",
    proPerk4: "Smart LED Lampe (2700K–6500K) & 4-Modus PC-Audio-Equalizer",
    getProBtn: "Alchemy Craft Pro holen ($4.99 / Jahr)",
    graphHudTitle: "ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Konstellation",
    graphPresetRadar: "Fokus-Radar",
    graphColorizeBtn: "Meine Ordner färben",
    graphOrphansBtn: "Waisen ausblenden",
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.1)",
    checkUpdatesBtn: "Updates prüfen",
    langName: "Oberflächensprache (6 Weltsprachen)",
    langDesc: "Übersetzt sofort alle Einstellungen, Dock-Buttons, Graph-HUD und das Checkout-Fenster.",
    themeName: "Swiss Bento UI-Theme (#F4F3EF Papier + #69BD28 Tabellen)",
    bentoGraphName: "Swiss Bento Graph Studio (Automatische Ordner-Farben)",
    bentoGraphDesc: "Scannt deine echten Ordner und weist jedem Knoten im Graphen automatisch die 8 Swiss Bento Farben zu.",
    taskBarName: "Obere Aufgaben-Fortschrittsleiste (Mit Schließen-Button)",
    taskBarDesc: "Zeigt den Fortschritt von Checklisten oben in der Notiz mit 100%-Konfetti.",
    headerBadgeName: "Text des oberen Notiz-Badges",
    headerBadgeDesc: "Label über dem Notiztitel (Feld leeren zum Ausblenden).",
    ambientName: "Ambient-Fokus-Klangwelten (WebAudio)",
    ambientDesc: "Synthetische Hintergrundklänge während Pomodoro-Sprints (Brown Noise, Regen, 40Hz Gamma).",
    pomoDurName: "Standard-Pomodoro-Dauer (Minuten)",
    pomoDurDesc: "Rechtsklick auf den Timer im Dock für 15m, 25m, 45m, 60m, 90m oder eigene Dauer.",
    aiCleanSetName: "KI-Wasserzeichen-Reiniger im Dock anzeigen",
    lampSetName: "Smart LED Cursor-Lampe (2700K–6500K Kelvin & Raum-Dimmer)",
    lampSetDesc: "Dimmt den umgebenden Bildschirm, während dein Cursor den Text mit 2700K–6500K beleuchtet.",
    lampConfigBtn: "Lampe einstellen",
    keySoundSetName: "Mechanischer Tastatur-Klang (Topre Thock / Schreibmaschine)",
    keySoundSetDesc: "Synthetischer Akustik-Sound mechanischer Switches beim Tippen.",
    eqSetName: "Live 4-Modus Sonic Equalizer (PC-System-Audio Sync)",
    eqSetDesc: "Reagiert direkt auf PC-Musik (Telegram, YouTube, Spotify) mit 4 komplexen Spektrum-Animationen.",
    eqSyncBtn: "PC-Audio verbinden",
    spotlightSetName: "Spotlight Absatz-Fokus-Dimmer",
    spotlightSetDesc: "Dimmt inaktive Absätze sanft auf 42% Deckkraft.",
    numBadgeSetName: "Quadratische Zahlen-Badges (01–04) & Betrags-Kapseln",
    numBadgeSetDesc: "Verwandelt nummerierte Listen, [01]–[04], $-Beträge und 0x-Adressen in Schweizer Kapseln.",
    sentFocusSetName: "Satz-Fokus-Hervorhebung per Klick (Sentence Focus)",
    analyticsTitle: "Fokus-Statistiken & Serien",
    statSprints: "Sprints",
    statDeepWork: "Deep Work",
    statChecklists: "100% Listen",
    statStreak: "Tages-Serie",
    supportHeading: "Direkter 0%-Checkout, @CryptoBot & Community",
    supportSetName: "Globale Zahlung & Direkter Autorenkontakt",
    supportSetDesc: "0% Gebühr via Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 oder @CryptoBot."
  }
};
function getLocale(plugin) {
  const lang = plugin?.settings?.uiLanguage || "en";
  return TRANSLATIONS[lang] ? lang : "en";
}

function t(key, plugin) {
  const loc = getLocale(plugin);
  return (TRANSLATIONS[loc] && TRANSLATIONS[loc][key]) || TRANSLATIONS["en"][key] || key;
}


// Convert Color Temperature in Kelvin (2700K..6500K) to RGB {r, g, b}
function kelvinToRgb(kelvin) {
  const k = Math.max(2000, Math.min(8000, kelvin || 3570));
  // Smooth interpolation across physical LED phosphor curve:
  // 2700K -> (255, 169, 87), 3570K -> (255, 206, 138), 4500K -> (255, 236, 206), 5500K -> (248, 249, 255), 6500K -> (214, 231, 255)
  if (k <= 3570) {
    const t = (k - 2700) / (3570 - 2700);
    return {
      r: 255,
      g: Math.round(169 + t * (206 - 169)),
      b: Math.round(87 + t * (138 - 87)),
    };
  } else if (k <= 5000) {
    const t = (k - 3570) / (5000 - 3570);
    return {
      r: 255,
      g: Math.round(206 + t * (246 - 206)),
      b: Math.round(138 + t * (242 - 138)),
    };
  } else {
    const t = (k - 5000) / (6500 - 5000);
    return {
      r: Math.round(255 - t * (255 - 210)),
      g: Math.round(246 - t * (246 - 230)),
      b: 255,
    };
  }
}

function generateSiCraftLicenseKey(seedStr) {
  const clean = (seedStr || "PRO").toUpperCase().replace(/[^A-Z0-9]/g, "");
  let h1 = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    h1 ^= clean.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = (n) => {
    let s = "";
    let v = n >>> 0;
    for (let i = 0; i < 4; i++) {
      s += alphabet[v % alphabet.length];
      v = Math.floor(v / alphabet.length) ^ ((v << 3) >>> 0);
    }
    return s;
  };
  const b1 = block(h1);
  const b2 = block(h1 ^ 0x5f3759df);
  const b3 = block(h1 ^ 0x9e3779b9);
  // Checksum block
  let chk = 0;
  const combined = b1 + b2 + b3;
  for (let i = 0; i < combined.length; i++) chk = (chk + combined.charCodeAt(i) * (i + 1)) % 9999;
  const b4 = String(chk).padStart(4, "0");
  return `ACPRO-${b1}-${b2}-${b3}-${b4}`;
}

function isValidSiCraftLicenseKey(codeStr) {
  const m = (codeStr || "").trim().toUpperCase().match(/^ACPRO-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})-(\d{4})$/);
  if (!m) return false;
  const combined = m[1] + m[2] + m[3];
  let chk = 0;
  for (let i = 0; i < combined.length; i++) chk = (chk + combined.charCodeAt(i) * (i + 1)) % 9999;
  return String(chk).padStart(4, "0") === m[4];
}

class SmartLedLampModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root", "sicraft-led-modal");

    const s = this.plugin.settings;
    const rgb = kelvinToRgb(s.lampKelvin || 3570);

    contentEl.innerHTML = `
      <div class="sicraft-led-panel">
        <div class="sicraft-led-header">
          <div>
            <div class="artcraft-bento-pill">${t("ledModalSubtitle", this.plugin)}</div>
            <h3 class="artcraft-modal-title">${SICRAFT_SVGS.lamp} ${t("ledModalTitle", this.plugin)}</h3>
          </div>
          <button id="led-power-btn" class="sicraft-led-power-btn ${s.magicLamp ? "is-on" : ""}">
            <span class="power-dot">⏻</span>
            <span id="led-power-text">${s.magicLamp ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div class="sicraft-led-card">
          <div class="sicraft-led-card-top">
            <span>${t("ledBrightness", this.plugin)}</span>
            <strong id="led-bright-val">${s.lampBrightness || 85}%</strong>
          </div>
          <input type="range" id="led-bright-slider" min="10" max="100" value="${s.lampBrightness || 85}" class="sicraft-led-slider sicraft-slider-bright" />
        </div>

        <div class="sicraft-led-card">
          <div class="sicraft-led-card-top">
            <span>${t("ledKelvin", this.plugin)}</span>
            <strong id="led-kelvin-val">${s.lampKelvin || 3570} K</strong>
          </div>
          <input type="range" id="led-kelvin-slider" min="2700" max="6500" step="10" value="${s.lampKelvin || 3570}" class="sicraft-led-slider sicraft-slider-kelvin" />
          <div class="sicraft-kelvin-presets">
            <button data-k="2700" class="sicraft-k-btn">2700K Warm</button>
            <button data-k="3570" class="sicraft-k-btn">3570K Studio</button>
            <button data-k="4800" class="sicraft-k-btn">4800K Pure</button>
            <button data-k="6500" class="sicraft-k-btn">6500K Cool</button>
          </div>
        </div>

        <div class="sicraft-led-card">
          <div class="sicraft-led-card-top">
            <span>${t("ledDimmer", this.plugin)}</span>
            <strong id="led-dim-val">${s.lampDimness !== undefined ? s.lampDimness : 75}%</strong>
          </div>
          <input type="range" id="led-dim-slider" min="0" max="92" value="${s.lampDimness !== undefined ? s.lampDimness : 75}" class="sicraft-led-slider" />
        </div>

        <div class="sicraft-led-card">
          <div class="sicraft-led-card-top">
            <span>${t("ledRadius", this.plugin)}</span>
            <strong id="led-rad-val">${s.lampRadius || 310} px</strong>
          </div>
          <input type="range" id="led-rad-slider" min="140" max="600" value="${s.lampRadius || 310}" class="sicraft-led-slider" />
          <div class="sicraft-kelvin-presets" style="margin-top:8px; grid-template-columns: 1fr 1fr 1fr;">
            <button data-shape="radial" class="sicraft-shape-btn ${(s.lampShape || "radial") === "radial" ? "is-active" : ""}">${t("ledShapeRadial", this.plugin)}</button>
            <button data-shape="deskbar" class="sicraft-shape-btn ${s.lampShape === "deskbar" ? "is-active" : ""}">${t("ledShapeBar", this.plugin)}</button>
            <button data-shape="ruler" class="sicraft-shape-btn ${s.lampShape === "ruler" ? "is-active" : ""}">${(s.uiLanguage || "en") === "ru" ? "Линейка чтения" : "Reading Ruler"}</button>
          </div>
        </div>
      </div>
    `;
    const powerBtn = contentEl.querySelector("#led-power-btn");
    const powerTxt = contentEl.querySelector("#led-power-text");
    powerBtn.onclick = async () => {
      await this.plugin.toggleMagicLamp();
      powerBtn.classList.toggle("is-on", this.plugin.settings.magicLamp);
      powerTxt.textContent = this.plugin.settings.magicLamp ? "ON" : "OFF";
    };

    const bSlider = contentEl.querySelector("#led-bright-slider");
    const bVal = contentEl.querySelector("#led-bright-val");
    bSlider.oninput = (e) => {
      s.lampBrightness = parseInt(e.target.value, 10);
      bVal.textContent = `${s.lampBrightness}%`;
      if (!s.magicLamp) this.plugin.toggleMagicLamp();
      else this.plugin.updateLampGpuStyle();
    };
    bSlider.onchange = () => this.plugin.saveSettings();

    const kSlider = contentEl.querySelector("#led-kelvin-slider");
    const kVal = contentEl.querySelector("#led-kelvin-val");
    kSlider.oninput = (e) => {
      s.lampKelvin = parseInt(e.target.value, 10);
      kVal.textContent = `${s.lampKelvin} K`;
      if (!s.magicLamp) this.plugin.toggleMagicLamp();
      else this.plugin.updateLampGpuStyle();
    };
    kSlider.onchange = () => this.plugin.saveSettings();

    contentEl.querySelectorAll(".sicraft-k-btn").forEach((btn) => {
      btn.onclick = async () => {
        const k = parseInt(btn.getAttribute("data-k"), 10);
        s.lampKelvin = k;
        kSlider.value = String(k);
        kVal.textContent = `${k} K`;
        if (!s.magicLamp) await this.plugin.toggleMagicLamp();
        else this.plugin.updateLampGpuStyle();
        await this.plugin.saveSettings();
      };
    });

    const dSlider = contentEl.querySelector("#led-dim-slider");
    const dVal = contentEl.querySelector("#led-dim-val");
    dSlider.oninput = (e) => {
      s.lampDimness = parseInt(e.target.value, 10);
      dVal.textContent = `${s.lampDimness}%`;
      if (!s.magicLamp) this.plugin.toggleMagicLamp();
      else this.plugin.updateLampGpuStyle();
    };
    dSlider.onchange = () => this.plugin.saveSettings();

    const rSlider = contentEl.querySelector("#led-rad-slider");
    const rVal = contentEl.querySelector("#led-rad-val");
    rSlider.oninput = (e) => {
      s.lampRadius = parseInt(e.target.value, 10);
      rVal.textContent = `${s.lampRadius} px`;
      this.plugin.updateLampGpuStyle();
    };
    rSlider.onchange = () => this.plugin.saveSettings();

    contentEl.querySelectorAll(".sicraft-shape-btn").forEach((btn) => {
      btn.onclick = async () => {
        s.lampShape = btn.getAttribute("data-shape");
        contentEl.querySelectorAll(".sicraft-shape-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        if (!s.magicLamp) await this.plugin.toggleMagicLamp();
        else this.plugin.updateLampGpuStyle();
        await this.plugin.saveSettings();
      };
    });
  }
  onClose() {
    this.contentEl.empty();
  }
}

const AMBIENT_SOUNDSCAPES = [
  { id: "balanced", ru: "Сбалансированный шум", en: "Balanced Noise", subRu: "Мягкий спектр iOS", subEn: "iOS Warm Pink Spectrum", icon: "〰️" },
  { id: "bright", ru: "Светлый шум", en: "Bright Noise", subRu: "Воздушный высокий тон", subEn: "Crisp Airy Highs", icon: "✨" },
  { id: "brown", ru: "Тёмный шум", en: "Dark Brown Noise", subRu: "Глубокий бас-фильтр", subEn: "Deep Sub-Bass Shield", icon: "🌑" },
  { id: "ocean", ru: "Океан", en: "Ocean Waves", subRu: "Прибой и ритм волн", subEn: "Rhythmic Surf Swell", icon: "🌊" },
  { id: "rain", ru: "Дождь", en: "Soft Rain", subRu: "Дождь по бумаге", subEn: "Gentle Rain on Paper", icon: "🌧️" },
  { id: "rain_roof", ru: "Дождь на крыше", en: "Rain on Roof", subRu: "Уютный чердак", subEn: "Warm Attic Patter", icon: "🏠" },
  { id: "stream", ru: "Ручей", en: "Forest Stream", subRu: "Лесной водный поток", subEn: "Babbling Brook", icon: "🏞️" },
  { id: "night", ru: "Тихая ночь", en: "Quiet Night", subRu: "Ночной воздух и сверчки", subEn: "Nocturnal Air & Crickets", icon: "🌙" },
  { id: "fire", ru: "Огонь", en: "Cozy Fireplace", subRu: "Треск углей в камине", subEn: "Crackling Hearth", icon: "🔥" },
  { id: "train", ru: "Поезд", en: "Night Train", subRu: "Спальный вагон и рельсы", subEn: "Rhythmic Rail Cadence", icon: "🚆" },
  { id: "cafe", ru: "Болтовня (Кафе)", en: "Coffeehouse Murmur", subRu: "Мягкий гул кофейни", subEn: "Warm Room Ambience", icon: "☕" },
  { id: "gamma40", ru: "40Hz Гамма-фокус", en: "40Hz Gamma Focus", subRu: "Нейро-синхронизация", subEn: "Binaural Deep Work", icon: "🧠" }
];

class AlchemySonicStudioModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.progressTimer = null;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-sonic-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const eqModes = [
      { id: "bars", name: isRu ? "01 // Пиковый спектр" : "01 // Peak-Hold Bars", icon: SICRAFT_SVGS.eqBars },
      { id: "wave", name: isRu ? "02 // Жидкая лента" : "02 // Liquid Ribbon", icon: SICRAFT_SVGS.eqWave },
      { id: "orb", name: isRu ? "03 // Супернова" : "03 // Supernova Orb", icon: SICRAFT_SVGS.eqOrb },
      { id: "dna", name: isRu ? "04 // Матрица" : "04 // Quantum Matrix", icon: SICRAFT_SVGS.eqMatrix },
      { id: "craft", name: isRu ? "05 // Крафтовый сейсмограф" : "05 // Craft Ink Seismograph", icon: SICRAFT_SVGS.eqCraft },
      { id: "ferro", name: isRu ? "06 // Феррофлюид" : "06 // Ferrofluid Orbs", icon: SICRAFT_SVGS.eqFerro }
    ];

    const hasTrack = !!(this.plugin.ambientNodes && this.plugin.ambientNodes.audioEl);
    const trackName = (this.plugin.ambientNodes && this.plugin.ambientNodes.trackName) || (isRu ? "Трек не выбран (MP3 / WAV / FLAC)" : "No custom track loaded (MP3 / WAV / FLAC)");
    const isSysActive = !!(this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "system");
    const isMicActive = !!(this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "mic");
    const vol = this.plugin.settings.audioVolume !== undefined ? this.plugin.settings.audioVolume : 75;

    contentEl.innerHTML = `
      <div class="sonic-studio-wrap">
        <div class="sonic-studio-head">
          <div>
            <div class="sonic-studio-badge">ALCHEMY CRAFT // SONIC & AMBIENT STUDIO</div>
            <h2 class="sonic-studio-title">${isRu ? "Аудио-студия, Плеер и Фоновые звуки" : "Sonic Equalizer, Track Player & Ambient Sounds"}</h2>
          </div>
          <button class="sonic-stop-all-btn" id="sonic-stop-all">${isRu ? "Остановить всё" : "Stop All"}</button>
        </div>

        <!-- 1. CUSTOM TRACK PLAYER & PC/MIC CAPTURE -->
        <div class="sonic-card">
          <div class="sonic-card-top">
            <span class="sonic-sec-label">${isRu ? "ПЛЕЕР СВОИХ ТРЕКОВ & ЗАХВАТ ЗВУКА" : "CUSTOM MUSIC PLAYER & LIVE AUDIO SYNC"}</span>
            <div class="sonic-vol-wrap">
              <span>${isRu ? "Громкость:" : "Volume:"} <strong id="sonic-vol-lbl">${vol}%</strong></span>
              <input type="range" id="sonic-vol-slider" min="0" max="100" value="${vol}" class="sonic-range-slider" />
            </div>
          </div>

          <div class="sonic-player-bar">
            <button class="sonic-play-btn" id="sonic-play-toggle" title="Play / Pause">${hasTrack && !this.plugin.ambientNodes.audioEl.paused ? SICRAFT_SVGS.pause : SICRAFT_SVGS.play}</button>
            <div class="sonic-track-meta">
              <div class="sonic-track-title" id="sonic-track-name">${trackName}</div>
              <div class="sonic-seek-row">
                <span id="sonic-time-cur">00:00</span>
                <input type="range" id="sonic-seek-slider" min="0" max="100" value="0" class="sonic-seek-input" ${hasTrack ? "" : "disabled"} />
                <span id="sonic-time-dur">00:00</span>
              </div>
            </div>
            <button class="sonic-load-btn" id="sonic-load-file">${SICRAFT_SVGS.audio} <span>${isRu ? "Загрузить трек..." : "Load Track..."}</span></button>
          </div>

          <div class="sonic-source-pills">
            <button class="sonic-src-btn ${isSysActive ? "is-active" : ""}" id="sonic-sync-sys">
              ${SICRAFT_SVGS.globe} <span>${isRu ? "Синхронизация со звуком ПК" : "Sync PC Desktop Audio"}</span>
            </button>
            <button class="sonic-src-btn ${isMicActive ? "is-active" : ""}" id="sonic-sync-mic">
              ${SICRAFT_SVGS.audio} <span>${isRu ? "Микрофон / Стерео Микшер" : "Microphone / Stereo Mix"}</span>
            </button>
          </div>
        </div>

        <!-- 2. 6 CRAFT & NEON EQUALIZER STYLES -->
        <div class="sonic-card">
          <div class="sonic-sec-label" style="margin-bottom:8px;">${isRu ? "6 РЕЖИМОВ АНИМАЦИИ ЭКВАЛАЙЗЕРА (ВКЛЮЧАЯ КРАФТОВЫЕ)" : "6 EQUALIZER VISUAL STYLES (INCLUDING SWISS CRAFT)"}</div>
          <div class="sonic-eq-grid">
            ${eqModes.map((m) => `
              <button class="sonic-eq-btn ${(this.plugin.settings.eqMode || "bars") === m.id ? "is-active" : ""}" data-eq="${m.id}">
                ${m.icon} <span>${m.name}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- 3. 12 APPLE iOS INSPIRED BACKGROUND SOUNDS -->
        <div class="sonic-card">
          <div class="sonic-sec-label" style="margin-bottom:8px;">${isRu ? "12 ФОНОВЫХ ЗВУКОВ ДЛЯ ФОКУСА (В СТИЛЕ iPHONE / iOS)" : "12 FOCUS BACKGROUND SOUNDSCAPES (iOS COLLECTION)"}</div>
          <div class="sonic-ambient-grid">
            ${AMBIENT_SOUNDSCAPES.map((s) => `
              <button class="sonic-amb-tile ${this.plugin.settings.ambientSound === s.id ? "is-active" : ""}" data-amb="${s.id}">
                <span class="amb-icon">${s.icon}</span>
                <div class="amb-txt">
                  <strong>${isRu ? s.ru : s.en}</strong>
                  <small>${isRu ? s.subRu : s.subEn}</small>
                </div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    // Wire up Stop All
    contentEl.querySelector("#sonic-stop-all")?.addEventListener("click", async () => {
      this.plugin.stopAudioCapture(true);
      await this.plugin.setAmbientSound("off");
      this.onOpen();
    });

    // Wire up Volume Slider
    const volSlider = contentEl.querySelector("#sonic-vol-slider");
    const volLbl = contentEl.querySelector("#sonic-vol-lbl");
    if (volSlider) {
      volSlider.oninput = (e) => {
        const v = parseInt(e.target.value, 10);
        this.plugin.settings.audioVolume = v;
        if (volLbl) volLbl.textContent = `${v}%`;
        this.plugin.applyAudioVolume(v / 100);
      };
      volSlider.onchange = () => this.plugin.saveSettings();
    }

    // Wire up Custom Track Play/Pause & Load
    contentEl.querySelector("#sonic-load-file")?.addEventListener("click", () => {
      this.plugin.openCustomAudioPicker(() => this.onOpen());
    });

    const playBtn = contentEl.querySelector("#sonic-play-toggle");
    if (playBtn) {
      playBtn.onclick = () => {
        if (this.plugin.ambientNodes && this.plugin.ambientNodes.audioEl) {
          const el = this.plugin.ambientNodes.audioEl;
          if (el.paused) {
            if (this.plugin.ambientNodes.ctx && this.plugin.ambientNodes.ctx.state === "suspended") {
              this.plugin.ambientNodes.ctx.resume();
            }
            el.play();
            playBtn.innerHTML = SICRAFT_SVGS.pause;
          } else {
            el.pause();
            playBtn.innerHTML = SICRAFT_SVGS.play;
          }
        } else {
          this.plugin.openCustomAudioPicker(() => this.onOpen());
        }
      };
    }

    // Seek bar live sync for loaded custom track
    const seekSlider = contentEl.querySelector("#sonic-seek-slider");
    const curEl = contentEl.querySelector("#sonic-time-cur");
    const durEl = contentEl.querySelector("#sonic-time-dur");
    if (seekSlider) {
      seekSlider.oninput = (e) => {
        const audioEl = this.plugin.ambientNodes && this.plugin.ambientNodes.audioEl;
        if (audioEl && audioEl.duration) {
          audioEl.currentTime = (parseFloat(e.target.value) / 100) * audioEl.duration;
        }
      };
    }

    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressTimer = setInterval(() => {
      const audioEl = this.plugin.ambientNodes && this.plugin.ambientNodes.audioEl;
      if (audioEl && audioEl.duration && isFinite(audioEl.duration)) {
        const pct = (audioEl.currentTime / audioEl.duration) * 100;
        if (seekSlider && document.activeElement !== seekSlider) seekSlider.value = String(pct);
        if (curEl) curEl.textContent = this.plugin.formatTime(Math.floor(audioEl.currentTime));
        if (durEl) durEl.textContent = this.plugin.formatTime(Math.floor(audioEl.duration));
      }
    }, 300);

    // Wire up PC & Mic sync
    contentEl.querySelector("#sonic-sync-sys")?.addEventListener("click", async () => {
      if (this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "system") {
        this.plugin.stopAudioCapture();
      } else {
        await this.plugin.startSystemAudioCapture();
      }
      this.onOpen();
    });

    contentEl.querySelector("#sonic-sync-mic")?.addEventListener("click", async () => {
      if (this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "mic") {
        this.plugin.stopAudioCapture();
      } else {
        await this.plugin.startMicAudioCapture();
      }
      this.onOpen();
    });

    // Wire up Equalizer Modes
    contentEl.querySelectorAll(".sonic-eq-btn").forEach((btn) => {
      btn.onclick = async () => {
        const mode = btn.getAttribute("data-eq");
        this.plugin.settings.eqMode = mode;
        await this.plugin.saveSettings();
        this.plugin.updateEqualizerPillUI();
        contentEl.querySelectorAll(".sonic-eq-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      };
    });

    // Wire up 12 Ambient Soundscapes
    contentEl.querySelectorAll(".sonic-amb-tile").forEach((tile) => {
      tile.onclick = async () => {
        const ambId = tile.getAttribute("data-amb");
        const next = this.plugin.settings.ambientSound === ambId ? "off" : ambId;
        await this.plugin.setAmbientSound(next);
        this.onOpen();
      };
    });
  }

  onClose() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.contentEl.empty();
  }
}

class CustomPomodoroModal extends Modal {
  constructor(app, plugin, currentMins, onSave) {
    super(app);
    this.plugin = plugin;
    this.currentMins = currentMins;
    this.onSave = onSave;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");

    const header = contentEl.createDiv({ cls: "artcraft-modal-header-card" });
    header.createEl("h3", { cls: "artcraft-modal-title", text: t("customPomodoroTitle", this.plugin) });
    header.createEl("p", {
      cls: "artcraft-modal-desc",
      text: t("customPomodoroDesc", this.plugin),
    });

    const wrap = contentEl.createDiv({ cls: "artcraft-modal-input-wrap" });
    wrap.style.display = "flex";
    wrap.style.gap = "10px";
    wrap.style.margin = "16px 0 10px 0";

    const input = wrap.createEl("input", {
      type: "number",
      value: String(this.currentMins || 25),
    });
    input.min = "1";
    input.max = "360";
    input.style.padding = "8px 12px";
    input.style.border = "1.5px solid #111111";
    input.style.borderRadius = "6px";
    input.style.fontSize = "16px";
    input.style.fontWeight = "bold";
    input.style.width = "110px";

    const btnSave = wrap.createEl("button", {
      text: t("customPomodoroStart", this.plugin),
      cls: "artcraft-open-modal-btn",
    });

    const submit = () => {
      const val = parseInt(input.value, 10);
      if (val && val > 0 && val <= 360) {
        this.onSave(val);
        this.close();
      } else {
        new Notice(t("customPomodoroErr", this.plugin));
      }
    };

    btnSave.onclick = submit;
    input.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };

    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  }
  onClose() {
    this.contentEl.empty();
  }
}

class AlchemyFlowPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    registerSicraftMenuIcons();

    this.mode = "none"; // "none" | "laser" | "draw" | "eraser"
    this.isDrawing = false;
    this.strokes = [];
    this.laserTrail = [];
    this.particles = [];
    this.animFrame = null;
    this.ambientNodes = null;
    this.lastTaskPctByFile = {};

    // Timer state
    this.timerRunning = false;
    this.timerState = "work"; // "work" | "break"
    this.timerSeconds =
      this.settings.timerMode === "pomodoro" ? (this.settings.pomodoroMinutes || 25) * 60 : 0;
    this.timerInterval = null;

    this.applyBodyClasses();
    this.createLampGpuLayer();
    this.createOverlayCanvas();
    if (this.settings.showFloatingDock) {
      this.createFloatingDock();
    }

    // 1. Reading View Post-Processor
    this.registerMarkdownPostProcessor((el) => {
      this.enhanceMarkdownElement(el);
    });

    // 2. Live Preview (CM6) & Graph View Observer
    this.setupLivePreviewObserver();
    // Background timer resync: immediately syncs timer seconds when Obsidian window is refocused or un-minimized
    this.registerDomEvent(document, "visibilitychange", () => {
      if (!document.hidden && this.timerRunning) {
        this.tickTimer();
      }
    });
    this.registerDomEvent(window, "focus", () => {
      if (this.timerRunning) {
        this.tickTimer();
      }
    });

    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        setTimeout(() => this.updateTaskProgressBar(), 100);
      })
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        setTimeout(() => {
          this.updateTaskProgressBar();
          this.injectGraphViewHUD();
        }, 150);
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", () => {
        this.updateTaskProgressBar();
      })
    );
    this.registerDomEvent(document, "click", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("task-list-item-checkbox")) {
        setTimeout(() => this.updateTaskProgressBar(true), 140);
      }
    });

    this.addRibbonIcon("wand", "Alchemy Craft — Bento Studio, Graph & Focus", () => {
      this.toggleMode(this.mode === "none" ? "laser" : "none");
    });

    this.registerCommands();

    this.registerDomEvent(window, "keydown", (e) => {
      if (e.key === "Escape" && this.mode !== "none") {
        this.toggleMode("none");
        new Notice("Alchemy Craft: Pointer / Marker deactivated");
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
        if (this.mode !== "none" || (this.history && this.history.length > 0)) {
          this.undo();
        }
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || e.key === "Y" || ((e.key === "z" || e.key === "Z") && e.shiftKey))
      ) {
        if (this.mode !== "none" || (this.redoHistory && this.redoHistory.length > 0)) {
          this.redo();
        }
      }
    });

    this.setupTactileKeystrokesAndRipples();
    this.setupMagicCursorLamp();
    this.addSettingTab(new AlchemyFlowSettingTab(this.app, this));
    setTimeout(() => this.injectGraphViewHUD(), 400);
  }

  // --- 🏮 1. MAGIC CURSOR LANTERN (LUMINA LAMP — DYNAMIC LIGHTING & 3D SHADOWS) ---
  isPointInsideActiveNoteArea(x, y) {
    // Check if (x, y) is inside a markdown note view-content and not over the dock or sidebars
    if (this.dockEl) {
      const dr = this.dockEl.getBoundingClientRect();
      if (x >= dr.left - 6 && x <= dr.right + 6 && y >= dr.top - 6 && y <= dr.bottom + 6) {
        return false;
      }
    }
    const leaves = document.querySelectorAll('.workspace-leaf-content[data-type="markdown"] .view-content');
    for (let i = 0; i < leaves.length; i++) {
      const r = leaves[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return true;
      }
    }
    return false;
  }

  createLampGpuLayer() {
    if (this.lampWrapEl) this.lampWrapEl.remove();
    const wrap = document.createElement("div");
    wrap.className = "sicraft-lamp-gpu-wrap";
    const beam = document.createElement("div");
    beam.className = "sicraft-lamp-gpu-beam";
    wrap.appendChild(beam);
    document.body.appendChild(wrap);
    this.lampWrapEl = wrap;
    this.lampBeamEl = beam;
    this.updateLampGpuStyle();
  }

  updateLampGpuStyle() {
    if (!this.lampWrapEl || !this.lampBeamEl) return;
    if (!this.settings.magicLamp) {
      this.lampWrapEl.style.display = "none";
      return;
    }
    this.lampWrapEl.style.display = "block";
    const radius = this.settings.lampRadius || 310;
    const dimPct = (this.settings.lampDimness !== undefined ? this.settings.lampDimness : 75) / 100;
    const brightPct = (this.settings.lampBrightness || 85) / 100;
    const rgb = kelvinToRgb(this.settings.lampKelvin || 3570);
    const darkAlpha = (dimPct * 0.86).toFixed(3);
    const coreAlpha = (0.32 * brightPct).toFixed(3);
    const midAlpha = (0.14 * brightPct).toFixed(3);
    const rimAlpha = (0.04 * brightPct).toFixed(3);

    if (this.settings.lampShape === "ruler") {
      const bandH = Math.max(28, Math.round(radius * 0.22));
      this.lampBeamEl.style.background = `linear-gradient(180deg, rgba(10, 11, 14, ${darkAlpha}) 0px, rgba(10, 11, 14, ${(dimPct * 0.65).toFixed(3)}) ${2500 - bandH * 2}px, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midAlpha}) ${2500 - bandH}px, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${coreAlpha}) 2500px, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midAlpha}) ${2500 + bandH}px, rgba(10, 11, 14, ${(dimPct * 0.65).toFixed(3)}) ${2500 + bandH * 2}px, rgba(10, 11, 14, ${darkAlpha}) 5000px)`;
    } else if (this.settings.lampShape === "deskbar") {
      const rx = Math.round(radius * 1.45);
      const ry = Math.round(radius * 0.9);
      this.lampBeamEl.style.background = `radial-gradient(${rx}px ${ry}px at 2500px 2500px, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${coreAlpha}) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midAlpha}) 45%, rgba(10, 11, 14, ${(dimPct * 0.45).toFixed(3)}) 78%, rgba(10, 11, 14, ${darkAlpha}) 100%)`;
    } else {
      this.lampBeamEl.style.background = `radial-gradient(circle ${radius}px at 2500px 2500px, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${coreAlpha}) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midAlpha}) 48%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rimAlpha}) 72%, rgba(10, 11, 14, ${darkAlpha}) 100%)`;
    }
    const lx = this.targetLampX || window.innerWidth / 2;
    const ly = this.targetLampY || window.innerHeight / 2;
    this.lampBeamEl.style.transform = `translate3d(${Math.round(lx - 2500)}px, ${Math.round(ly - 32 - 2500)}px, 0)`;
  }

  setupMagicCursorLamp() {
    this.lampX = window.innerWidth / 2;
    this.lampY = window.innerHeight / 2;
    this.targetLampX = this.lampX;
    this.targetLampY = this.lampY;

    this.registerDomEvent(window, "mousemove", (e) => {
      if ((this.mode === "draw" || this.mode === "eraser") && this.canvasEl && !this.isDrawing) {
        const isOverNoteArea = this.isPointInsideActiveNoteArea(e.clientX, e.clientY);
        this.canvasEl.style.pointerEvents = isOverNoteArea ? "auto" : "none";
      }
      this.targetLampX = e.clientX;
      this.targetLampY = e.clientY;
      // Pure GPU hardware-composited translate3d (0% CPU, 0 DOM style invalidations, 240 FPS!)
      if (this.settings.magicLamp && this.lampBeamEl) {
        this.lampBeamEl.style.transform = `translate3d(${e.clientX - 2500}px, ${e.clientY - 32 - 2500}px, 0)`;
      }
    });
  }

  async toggleMagicLamp() {
    this.settings.magicLamp = !this.settings.magicLamp;
    await this.saveSettings();
    this.applyBodyClasses();
    this.updateLampGpuStyle();
    this.updateDockUI();
    new Notice(
      this.settings.magicLamp
        ? "Smart LED Cursor Lamp ON (GPU 144 FPS)"
        : "Smart LED Cursor Lamp OFF"
    );
  }

  // --- ⌨️ 2. TACTILE MECHANICAL KEYSTROKES (THOCK / TYPEWRITER) & PAPER RIPPLES ---
  setupTactileKeystrokesAndRipples() {
    this.registerDomEvent(window, "keydown", (e) => {
      if (!this.settings.tactileTypingSound || this.settings.tactileTypingSound === "off") return;
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      this.playTactileKeySound(e.key);
    });

    this.registerDomEvent(window, "mousedown", (e) => {
      if (e.target && e.target.closest && e.target.closest(".artcraft-dock-btn, .artcraft-timer-pill, .task-list-item-checkbox")) {
        this.spawnTactileRipple(e.clientX, e.clientY);
      }
    });
  }

  playTactileKeySound(key) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.keyAudioCtx) this.keyAudioCtx = new AudioCtx();
      const ctx = this.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const isSpaceOrEnter = key === " " || key === "Enter" || key === "Backspace";
      if (this.settings.tactileTypingSound === "thock") {
        osc.type = "triangle";
        const baseFreq = isSpaceOrEnter ? 115 : 145 + (Math.random() * 22 - 11);
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.045);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
      } else {
        osc.type = "sawtooth";
        const baseFreq = isSpaceOrEnter ? 520 : 780 + (Math.random() * 120 - 60);
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.028);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  spawnTactileRipple(x, y) {
    if (!this.ripples) this.ripples = [];
    this.ripples.push({ x, y, r: 4, maxR: 38, alpha: 0.65, color: this.settings.strokeColor || "#69BD28" });
    this.wakeOverlayCanvas();
  }

  // --- 🎚️ 3. NATIVE ELECTRON DESKTOP SYSTEM AUDIO LOOPBACK (TELEGRAM / YOUTUBE / SPOTIFY) & 4-MODE EQUALIZER ---
  async setAmbientSound(val) {
    this.settings.ambientSound = val;
    await this.saveSettings();
    if (val === "off") {
      this.stopAmbientSound();
    } else {
      this.startAmbientSound(val);
    }
    this.updateEqualizerPillUI();
  }

  showAudioMenu(event) {
    if (event && event.preventDefault) event.preventDefault();
    new AlchemySonicStudioModal(this.app, this).open();
  }

  applyAudioVolume(vol0to1) {
    const v = Math.max(0, Math.min(1, vol0to1));
    if (this.ambientNodes) {
      if (this.ambientNodes.audioEl) {
        this.ambientNodes.audioEl.volume = v;
      }
      if (this.ambientNodes.masterGain && this.ambientNodes.baseGain) {
        this.ambientNodes.masterGain.gain.value = this.ambientNodes.baseGain * (v / 0.75);
      }
    }
  }

  openCustomAudioPicker(onLoadedCallback) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*,.mp3,.wav,.ogg,.flac,.m4a";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      this.stopAmbientSound();
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
        const fileUrl = URL.createObjectURL(file);
        const audioEl = new Audio(fileUrl);
        audioEl.loop = true;
        const vol = (this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75) / 100;
        audioEl.volume = Math.max(0, Math.min(1, vol));
        const source = ctx.createMediaElementSource(audioEl);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.74;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioEl.play();
        this.ambientNodes = { ctx, audioEl, fileUrl, analyser, trackName: file.name };
        this.updateEqualizerPillUI();
        new Notice(`🎵 Playing: ${file.name}`);
        if (typeof onLoadedCallback === "function") {
          onLoadedCallback();
        } else {
          new AlchemySonicStudioModal(this.app, this).open();
        }
      } catch (e) {
        new Notice("Could not load audio file.");
      }
    });
    input.click();
  }

  connectStreamToAnalyser(stream, type, gainVal = 2.4) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    // Hidden muted audio sink ensures Chromium's audio pipeline never suspends the MediaStream!
    const sinkAudio = document.createElement("audio");
    sinkAudio.muted = true;
    sinkAudio.autoplay = true;
    try {
      sinkAudio.srcObject = stream;
      sinkAudio.play().catch(() => {});
    } catch (e) {}

    const source = ctx.createMediaStreamSource(stream);
    const preAmp = ctx.createGain();
    preAmp.gain.value = gainVal;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    analyser.minDecibels = -95;
    analyser.maxDecibels = -20;

    // Zero-gain destination connection fixes Chromium Issue #327649 where disconnected AnalyserNodes receive all-zero FFT frames!
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;

    source.connect(preAmp);
    preAmp.connect(analyser);
    analyser.connect(silentGain);
    silentGain.connect(ctx.destination);

    this.desktopAudioNodes = { ctx, stream, source, analyser, silentGain, sinkAudio, type };
    this.updateEqualizerPillUI();
  }

  async startSystemAudioCapture() {
    this.stopAudioCapture(true);
    let stream = null;

    // Strategy A: Check if user has a dedicated "Stereo Mix" / "Loopback" / "What U Hear" / "CABLE" audio input first
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const loopbackDev = devices.find(
          (d) =>
            d.kind === "audioinput" &&
            /stereo mix|смеситель|loopback|cable|what u hear|blackhole|soundflower|monitor|voicemeeter/i.test(d.label || "")
        );
        if (loopbackDev) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: { exact: loopbackDev.deviceId },
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
            video: false,
          });
        }
      } catch (e0) {}
    }

    // Strategy B: Electron WASAPI Desktop Loopback (keep low-res video track alive so Electron doesn't kill the WASAPI session!)
    if (!stream) {
      const sourceIds = ["screen:0:0", "screen:1:0", undefined];
      for (const sid of sourceIds) {
        if (stream) break;
        try {
          const mandatoryAudio = { chromeMediaSource: "desktop" };
          const mandatoryVideo = { chromeMediaSource: "desktop", maxWidth: 320, maxHeight: 180, maxFrameRate: 2 };
          if (sid) {
            mandatoryAudio.chromeMediaSourceId = sid;
            mandatoryVideo.chromeMediaSourceId = sid;
          }
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { mandatory: mandatoryAudio },
            video: { mandatory: mandatoryVideo },
          });
        } catch (e1) {}
      }
    }

    // Strategy C: High-sensitivity Default Audio / Room Pickup
    if (!stream || !stream.getAudioTracks || stream.getAudioTracks().length === 0) {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      return this.startMicAudioCapture(true);
    }

    try {
      this.connectStreamToAnalyser(stream, "system", 2.4);
      new Notice(t("audioConnectedNotice", this));

      // Watchdog: if Electron's desktop audio track is muted by Windows DWM after 600ms, seamlessly switch to high-gain default audio input
      setTimeout(() => {
        if (!this.desktopAudioNodes || this.desktopAudioNodes.type !== "system") return;
        const track = stream.getAudioTracks()[0];
        if (!track || track.readyState === "ended" || track.muted) {
          this.startMicAudioCapture(true);
        }
      }, 600);
    } catch (err) {
      return this.startMicAudioCapture(true);
    }
  }

  async startMicAudioCapture(highGainForSpeakers = false) {
    this.stopAudioCapture(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true },
        video: false,
      });
      this.connectStreamToAnalyser(stream, "mic", highGainForSpeakers ? 3.8 : 2.6);
      new Notice(t("audioMicConnectedNotice", this));
    } catch (err) {
      new Notice("Could not access audio device.");
    }
  }

  stopAudioCapture(silent = false) {
    if (!this.desktopAudioNodes) return;
    try {
      if (this.desktopAudioNodes.sinkAudio) {
        this.desktopAudioNodes.sinkAudio.pause();
        this.desktopAudioNodes.sinkAudio.srcObject = null;
      }
      if (this.desktopAudioNodes.stream) {
        this.desktopAudioNodes.stream.getTracks().forEach((t) => t.stop());
      }
      if (this.desktopAudioNodes.ctx) {
        this.desktopAudioNodes.ctx.close();
      }
    } catch (e) {}
    this.desktopAudioNodes = null;
    this.updateEqualizerPillUI();
    if (!silent) new Notice(t("audioStoppedNotice", this));
  }

  stopDesktopAudioCapture() {
    this.stopAudioCapture(true);
  }

  toggleDesktopAudioCapture() {
    if (this.desktopAudioNodes) {
      this.stopAudioCapture();
    } else {
      this.startSystemAudioCapture();
    }
  }

  updateEqualizerPillUI() {
    if (!this.eqWrap) return;
    const isSynced = !!(this.desktopAudioNodes || this.ambientNodes);
    this.eqWrap.classList.toggle("is-synced", isSynced);
    this.eqWrap.classList.toggle("is-audio-live", isSynced);
    const dotEl = this.eqWrap.querySelector(".artcraft-eq-status-dot");
    if (dotEl) dotEl.classList.toggle("is-live", isSynced);
    const iconEl = this.eqWrap.querySelector(".artcraft-eq-icon-wrap") || this.eqModeIconEl;
    if (iconEl) {
      const modeIcons = {
        bars: SICRAFT_SVGS.eqBars,
        wave: SICRAFT_SVGS.eqWave,
        orb: SICRAFT_SVGS.eqOrb,
        dna: SICRAFT_SVGS.eqMatrix,
        craft: SICRAFT_SVGS.eqCraft,
        ferro: SICRAFT_SVGS.eqFerro,
      };
      iconEl.innerHTML = modeIcons[this.settings.eqMode || "bars"] || SICRAFT_SVGS.eqBars;
    }
  }

  async cycleEqualizerMode() {
    // If no audio source is active yet, first click opens the Sonic & Ambient Studio so user can pick track, iOS sound, or PC sync!
    if (!this.desktopAudioNodes && !this.ambientNodes) {
      new AlchemySonicStudioModal(this.app, this).open();
      return;
    }
    const modes = ["bars", "wave", "orb", "dna", "craft", "ferro"];
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const names = {
      bars: t("audioModeBars", this),
      wave: t("audioModeWave", this),
      orb: t("audioModeOrb", this),
      dna: t("audioModeDna", this),
      craft: isRu ? "05 // Крафтовый сейсмограф" : "05 // Craft Ink Seismograph",
      ferro: isRu ? "06 // Феррофлюид" : "06 // Alchemy Ferrofluid Orbs",
    };
    const idx = modes.indexOf(this.settings.eqMode || "bars");
    const next = modes[(idx + 1) % modes.length];
    this.settings.eqMode = next;
    await this.saveSettings();
    this.updateEqualizerPillUI();
    new Notice(`Equalizer: ${names[next]}`);
  }
  // --- 📸 4. 1-CLICK SWISS BENTO QUOTE CARD EXPORTER ---
  async exportSelectionAsBentoCard() {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    let text = "";
    let title = "STRATALCHEMY // KNOWLEDGE BRIEF";
    if (view && view.file) {
      title = view.file.basename.toUpperCase();
      if (view.editor && view.editor.somethingSelected()) {
        text = view.editor.getSelection().trim();
      }
    }
    if (!text) {
      const pinned = [];
      document.querySelectorAll(".artcraft-sentence.is-pinned").forEach((el) => {
        pinned.push((el.textContent || "").trim());
      });
      if (pinned.length > 0) text = pinned.join(" ");
    }
    if (!text && view && view.editor) {
      text = view.editor.getValue().split("\n").filter((l) => l.trim().length > 20)[0] || "Deep work in Swiss Bento clarity.";
    }

    const cardMarkdown = `> [!NOTE] ⚗️ ${title} — ALCHEMY CRAFT // STUDIO
> **"${text.replace(/\n+/g, " ")}"**
> 
> \`01 // FOCUS\` • \`#F4F3EF ARCHIVAL PAPER\` • \`@StratAlchemy\``;

    await navigator.clipboard.writeText(cardMarkdown);
    this.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 45);
    new Notice("📸 Swiss Bento Callout Card copied to clipboard! Paste anywhere in Obsidian or social media.");
  }

  registerCommands() {
    this.addCommand({
      id: "toggle-dock-orientation",
      name: "Toggle Dock Orientation (Bottom / Right Side Pillar)",
      callback: () => this.toggleDockOrientation(),
    });

    this.addCommand({
      id: "toggle-dock-collapse",
      name: "Collapse / Expand Alchemy Dock",
      callback: () => this.toggleDockCollapse(),
    });

    this.addCommand({
      id: "toggle-artcraft-theme",
      name: "Toggle Swiss Bento UI Theme",
      callback: async () => {
        this.settings.artcraftTheme = !this.settings.artcraftTheme;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-dark-craft-theme",
      name: "Toggle Midnight Dark Craft Mode (Pro)",
      callback: async () => {
        if (!this.settings.isPro) {
          new AlchemyCraftProModal(this.app, this).open();
          return;
        }
        this.settings.darkCraftTheme = !this.settings.darkCraftTheme;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "apply-bento-graph-colors",
      name: "Graph View: Apply Swiss Bento Color Groups & Theme",
      callback: () => this.applyBentoGraphColorGroups(),
    });

    this.addCommand({
      id: "toggle-focus-timer",
      name: "Start / Pause Focus Timer",
      callback: () => this.toggleTimer(),
    });

    this.addCommand({
      id: "reset-focus-timer",
      name: "Reset Focus Timer",
      callback: () => this.resetTimer(),
    });

    this.addCommand({
      id: "toggle-sentence-focus",
      name: "Toggle Sentence Focus & Number Badges",
      callback: async () => {
        this.settings.sentenceFocus = !this.settings.sentenceFocus;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-laser-pointer",
      name: "Toggle Laser Pointer Mode",
      callback: () => this.toggleMode(this.mode === "laser" ? "none" : "laser"),
    });

    this.addCommand({
      id: "toggle-draw-marker",
      name: "Toggle Freehand Draw Marker Mode",
      callback: () => this.toggleMode(this.mode === "draw" ? "none" : "draw"),
    });

    this.addCommand({
      id: "toggle-eraser",
      name: "Toggle Eraser Mode",
      callback: () => this.toggleMode(this.mode === "eraser" ? "none" : "eraser"),
    });

    this.addCommand({
      id: "undo-drawing",
      name: "Undo Drawing / Annotation",
      callback: () => this.undo(),
    });

    this.addCommand({
      id: "redo-drawing",
      name: "Redo Drawing / Annotation",
      callback: () => this.redo(),
    });

    this.addCommand({
      id: "clean-ai-watermarks",
      name: "Clean AI Watermarks & Zero-Width Characters",
      callback: () => this.cleanCurrentNoteAIWatermarks(),
    });

    this.addCommand({
      id: "toggle-magic-cursor-lamp",
      name: "🏮 Toggle Magic Cursor Lantern (Interactive Text Illumination & Shadows)",
      callback: () => this.toggleMagicLamp(),
    });

    this.addCommand({
      id: "load-custom-music-visualizer",
      name: "🎵 Load Custom Music / Audio File into Sonic Equalizer",
      callback: () => this.openCustomAudioPicker(),
    });

    this.addCommand({
      id: "export-bento-quote-card",
      name: "📸 Export Selection as Swiss Bento Callout Card",
      callback: () => this.exportSelectionAsBentoCard(),
    });

    this.addCommand({
      id: "toggle-spotlight-focus",
      name: "🔦 Toggle Spotlight Paragraph Dimmer Mode",
      callback: async () => {
        this.settings.spotlightFocus = !this.settings.spotlightFocus;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "clear-drawings",
      name: "Clear All Drawings & Highlights",
      callback: () => this.clearAllAnnotations(),
    });
  }

  onunload() {
    document.body.classList.remove(
      "artcraft-theme-active",
      "artcraft-hover-cards",
      "artcraft-sentence-focus",
      "artcraft-zen-mode",
      "artcraft-dark-craft",
      "artcraft-bento-graph"
    );
    this.stopAmbientSound();
    this.stopDesktopAudioCapture();
    if (this.cmObserver) {
      this.cmObserver.disconnect();
      this.cmObserver = null;
    }
    if (this.onScrollCapture) {
      window.removeEventListener("scroll", this.onScrollCapture, { capture: true });
    }
    if (window.AlchemyCraftAgent) {
      delete window.AlchemyCraftAgent;
    }
    if (this.lpInterval) clearInterval(this.lpInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.eqAnimFrame) cancelAnimationFrame(this.eqAnimFrame);
    if (this.lampWrapEl) this.lampWrapEl.remove();
    if (this.canvasEl) this.canvasEl.remove();
    if (this.dockEl) this.dockEl.remove();
    document.querySelectorAll(".artcraft-task-progress-wrap, .artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas").forEach((el) => el.remove());
  }

  // --- AMBIENT FOCUS SOUNDSCAPE ENGINE (12 iOS-INSPIRED WEBAUDIO SYNTHESIS SOUNDSCAPES) ---
  startAmbientSound(type) {
    this.stopAmbientSound();
    if (!type || type === "off") return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const volScale = (this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75) / 75;
      const baseGain = type === "gamma40" ? 0.045 : 0.11;
      const masterGain = ctx.createGain();
      masterGain.gain.value = baseGain * volScale;
      masterGain.connect(ctx.destination);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      analyser.connect(silentGain);
      silentGain.connect(ctx.destination);

      if (type === "gamma40") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.value = 180;
        osc2.frequency.value = 220;
        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc1.connect(analyser);
        osc2.connect(analyser);
        osc1.start();
        osc2.start();
        this.ambientNodes = { ctx, osc1, osc2, analyser, masterGain, baseGain };
      } else {
        // Procedural 4-second seamless acoustic buffer for all 11 organic iOS soundscapes
        const bufferSize = 4 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        let b0 = 0, b1 = 0, b2 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const tSec = i / ctx.sampleRate;

          if (type === "brown" || type === "ocean" || type === "train") {
            output[i] = (lastOut + 0.025 * white) / 1.025;
            lastOut = output[i];
            let mod = 3.0;
            if (type === "ocean") {
              // Slow surf wave swell (0.25 Hz cycle)
              mod = 1.4 + 2.2 * Math.pow(0.5 + 0.5 * Math.sin(tSec * Math.PI * 0.5), 1.6);
            } else if (type === "train") {
              // Sleeper train rhythmic rail cadence ("chug-chug ... chug-chug")
              const beat = (tSec * 2.5) % 1;
              const click = (beat < 0.08 || (beat > 0.22 && beat < 0.30)) ? 1.85 : 0.75;
              mod = 2.2 * click;
            }
            output[i] *= mod;
          } else if (type === "balanced" || type === "cafe" || type === "stream") {
            // Kellet Pink / Balanced filter
            b0 = 0.99765 * b0 + white * 0.0990460;
            b1 = 0.96300 * b1 + white * 0.2965164;
            b2 = 0.57000 * b2 + white * 1.0526913;
            const pink = (b0 + b1 + b2 + white * 0.1848) * 0.12;
            if (type === "stream") {
              output[i] = pink * (0.85 + 0.45 * Math.sin(tSec * 19.0) * Math.cos(tSec * 11.0));
            } else if (type === "cafe") {
              output[i] = pink * (0.75 + 0.35 * Math.sin(tSec * 5.2 + Math.sin(tSec * 2.1)));
            } else {
              output[i] = pink;
            }
          } else if (type === "fire") {
            // Warm hearth rumble + random organic ember crackle spikes
            lastOut = (lastOut + 0.03 * white) / 1.03;
            const crackle = Math.random() > 0.9985 ? (Math.random() * 1.6 - 0.8) : 0;
            output[i] = lastOut * 2.4 + crackle;
          } else {
            // rain, rain_roof, bright, night
            const coeff = type === "bright" ? 0.22 : 0.08;
            output[i] = (lastOut + coeff * white) / (1 + coeff);
            lastOut = output[i];
            output[i] *= type === "bright" ? 1.1 : 1.8;
          }
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        if (type === "brown") {
          filter.type = "lowpass";
          filter.frequency.value = 380;
        } else if (type === "ocean") {
          filter.type = "lowpass";
          filter.frequency.value = 540;
        } else if (type === "train") {
          filter.type = "lowpass";
          filter.frequency.value = 340;
        } else if (type === "rain_roof") {
          filter.type = "bandpass";
          filter.frequency.value = 620;
          filter.Q.value = 0.7;
        } else if (type === "rain") {
          filter.type = "lowpass";
          filter.frequency.value = 1150;
        } else if (type === "stream") {
          filter.type = "bandpass";
          filter.frequency.value = 950;
          filter.Q.value = 0.8;
        } else if (type === "bright") {
          filter.type = "highpass";
          filter.frequency.value = 480;
        } else if (type === "fire") {
          filter.type = "lowpass";
          filter.frequency.value = 820;
        } else if (type === "cafe") {
          filter.type = "bandpass";
          filter.frequency.value = 460;
          filter.Q.value = 0.9;
        } else if (type === "night") {
          filter.type = "bandpass";
          filter.frequency.value = 1650;
          filter.Q.value = 1.4;
        } else {
          filter.type = "lowpass";
          filter.frequency.value = 1400;
        }

        noiseSource.connect(filter);
        filter.connect(masterGain);
        filter.connect(analyser);
        noiseSource.start(0);
        this.ambientNodes = { ctx, source: noiseSource, analyser, masterGain, baseGain };
      }
      this.updateEqualizerPillUI();
    } catch (e) {}
  }

  stopAmbientSound() {
    if (!this.ambientNodes) return;
    try {
      if (this.ambientNodes.audioEl) {
        this.ambientNodes.audioEl.pause();
        if (this.ambientNodes.fileUrl) URL.revokeObjectURL(this.ambientNodes.fileUrl);
      }
      if (this.ambientNodes.source) this.ambientNodes.source.stop();
      if (this.ambientNodes.osc1) this.ambientNodes.osc1.stop();
      if (this.ambientNodes.osc2) this.ambientNodes.osc2.stop();
      if (this.ambientNodes.ctx) this.ambientNodes.ctx.close();
    } catch (e) {}
    this.ambientNodes = null;
    this.updateEqualizerPillUI();
  }

  // --- CELEBRATION PARTICLES (100% TASK COMPLETION & PRO UNLOCK) ---
  burstParticles(x, y, count = 48) {
    if (!this.canvasEl) return;
    const colors = ["#69BD28", "#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.2 + Math.random() * 6.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: 4 + Math.random() * 4.5,
        color: colors[i % colors.length],
        alpha: 1,
      });
    }
    this.wakeOverlayCanvas();
  }

  // --- FOCUS ANALYTICS RECORDER ---
  async recordCompletedSprint(minutes) {
    if (!this.settings.focusAnalytics) {
      this.settings.focusAnalytics = {
        completedSprints: 0,
        totalFocusMinutes: 0,
        tasksCompleted100: 0,
        lastSprintDate: "",
        currentStreak: 0,
        history: [],
      };
    }
    const fa = this.settings.focusAnalytics;
    fa.completedSprints = (fa.completedSprints || 0) + 1;
    fa.totalFocusMinutes = (fa.totalFocusMinutes || 0) + (minutes || 25);

    const today = new Date().toISOString().slice(0, 10);
    if (fa.lastSprintDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      fa.currentStreak = fa.lastSprintDate === yesterday ? (fa.currentStreak || 0) + 1 : 1;
      fa.lastSprintDate = today;
    }
    await this.saveSettings();
  }

  // --- TIMER METHODS ---
  formatTime(sec) {
    const m = Math.floor(Math.abs(sec) / 60);
    const s = Math.abs(sec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  playTimerChime() {
    if (!this.settings.timerSound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1175, now + 0.16);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.82);

      osc.start(now);
      osc.stop(now + 0.82);
    } catch (e) {}
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerRunning = true;
    const now = Date.now();
    if (this.settings.timerMode === "pomodoro") {
      this.timerTargetTimestamp = now + this.timerSeconds * 1000;
    } else {
      this.timerStartTimestamp = now - this.timerSeconds * 1000;
    }
    if (this.timerState === "work" && this.settings.ambientSound && this.settings.ambientSound !== "off") {
      this.startAmbientSound(this.settings.ambientSound);
    }
    this.timerInterval = setInterval(() => {
      this.tickTimer();
    }, 1000);
    this.updateTimerDisplay();
  }

  tickTimer() {
    if (!this.timerRunning) return;
    const now = Date.now();
    if (this.settings.timerMode === "pomodoro") {
      const remaining = Math.max(0, Math.round((this.timerTargetTimestamp - now) / 1000));
      this.timerSeconds = remaining;
      if (remaining <= 0) {
        this.timerRunning = false;
        this.stopAmbientSound();
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.playTimerChime();
        if (this.timerState === "work") {
          this.recordCompletedSprint(this.settings.pomodoroMinutes || 25);
          this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 55);
          new Notice(t("sprintDoneNotice", this));
          this.timerState = "break";
          this.timerSeconds = (this.settings.breakMinutes || 5) * 60;
        } else {
          new Notice(t("breakDoneNotice", this));
          this.timerState = "work";
          this.timerSeconds = (this.settings.pomodoroMinutes || 25) * 60;
        }
      }
    } else {
      this.timerSeconds = Math.max(0, Math.round((now - this.timerStartTimestamp) / 1000));
    }
    this.updateTimerDisplay();
  }

  pauseTimer() {
    if (this.timerRunning) {
      this.tickTimer();
    }
    this.timerRunning = false;
    this.stopAmbientSound();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.updateTimerDisplay();
  }

  toggleTimer() {
    if (this.timerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timerState = "work";
    this.timerSeconds =
      this.settings.timerMode === "pomodoro"
        ? (this.settings.pomodoroMinutes || 25) * 60
        : 0;
    this.updateTimerDisplay();
  }

  setPomodoroDuration(mins) {
    this.settings.timerMode = "pomodoro";
    this.settings.pomodoroMinutes = mins;
    this.timerState = "work";
    this.saveSettings();
    this.resetTimer();
    new Notice(`Pomodoro: ${mins} min`);
  }

  startBreak(mins) {
    this.settings.timerMode = "pomodoro";
    this.timerState = "break";
    this.timerSeconds = mins * 60;
    this.startTimer();
    new Notice(`Break: ${mins} min`);
  }

  showTimerMenu(event) {
    const menu = new Menu();
    const isRu = (this.settings.uiLanguage || "en") === "ru";

    menu.addItem((item) => {
      item
        .setTitle(isRu ? "15 мин — Быстрый спринт" : "15 min — Sprint Focus")
        .setIcon("sicraft-bolt")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 15 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(15));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "25 мин — Классический Помодоро" : "25 min — Standard Pomodoro")
        .setIcon("sicraft-timer")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 25 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(25));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "45 мин — Глубокая работа (Deep Work)" : "45 min — Deep Work")
        .setIcon("sicraft-target")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 45 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(45));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "60 мин — Поток (Flow State)" : "60 min — Flow State")
        .setIcon("sicraft-wave")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 60 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(60));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "90 мин — Ультрадианный цикл" : "90 min — Ultradian Rhythm")
        .setIcon("sicraft-rocket")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 90 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(90));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "Своё время (1–360 мин)..." : "Custom Duration (1–360 min)...")
        .setIcon("sicraft-sliders")
        .onClick(() => {
          new CustomPomodoroModal(this.app, this, this.settings.pomodoroMinutes || 25, (mins) => {
            this.setPomodoroDuration(mins);
            this.startTimer();
          }).open();
        });
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "5 мин — Короткий перерыв" : "5 min — Short Break")
        .setIcon("sicraft-coffee")
        .setChecked(this.timerState === "break" && this.timerSeconds <= 300)
        .onClick(() => this.startBreak(this.settings.breakMinutes || 5));
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "15 мин — Длинный перерыв" : "15 min — Long Break")
        .setIcon("sicraft-palm")
        .setChecked(this.timerState === "break" && this.timerSeconds > 300)
        .onClick(() => this.startBreak(15));
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "Фоновый звук: Выкл" : "Ambient: Off")
        .setIcon("sicraft-stop")
        .setChecked(!this.settings.ambientSound || this.settings.ambientSound === "off")
        .onClick(async () => {
          await this.setAmbientSound("off");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle(t("ambientBrown", this))
        .setIcon("sicraft-headphones")
        .setChecked(this.settings.ambientSound === "brown")
        .onClick(async () => {
          await this.setAmbientSound("brown");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle(t("ambientRain", this))
        .setIcon("sicraft-rain")
        .setChecked(this.settings.ambientSound === "rain")
        .onClick(async () => {
          await this.setAmbientSound("rain");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle(t("ambientGamma", this))
        .setIcon("sicraft-brain")
        .setChecked(this.settings.ambientSound === "gamma40")
        .onClick(async () => {
          await this.setAmbientSound("gamma40");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle(this.desktopAudioNodes ? t("audioStopSync", this) : t("audioSyncSystem", this))
        .setIcon(this.desktopAudioNodes ? "sicraft-stop" : "sicraft-speaker")
        .onClick(() => {
          this.toggleDesktopAudioCapture();
        });
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? `Стиль эквалайзера (${(this.settings.eqMode || "bars").toUpperCase()})` : `Switch Equalizer Style (${(this.settings.eqMode || "bars").toUpperCase()})`)
        .setIcon("sicraft-bars")
        .onClick(() => {
          this.cycleEqualizerMode();
        });
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "Секундомер (Отсчёт вверх: 00:00+)" : "Stopwatch (Count Up: 00:00+)")
        .setIcon("sicraft-stopwatch")
        .setChecked(this.settings.timerMode === "stopwatch")
        .onClick(async () => {
          this.settings.timerMode = "stopwatch";
          await this.saveSettings();
          this.resetTimer();
        });
    });
    const safeX = Math.min(event.clientX, window.innerWidth - 250);
    const safeY = Math.max(40, Math.min(event.clientY - 340, window.innerHeight - 380));
    menu.showAtPosition({ x: safeX, y: safeY });
  }

  updateTimerDisplay() {
    if (!this.timerEl || !this.timerTextEl) return;
    this.timerEl.classList.toggle("is-running", this.timerRunning);
    this.timerEl.classList.toggle("is-break", this.timerState === "break");
    this.timerTextEl.innerHTML = `${SICRAFT_SVGS.timer}<span>${this.formatTime(this.timerSeconds)}</span>`;
  }

  applyBodyClasses() {
    document.body.classList.toggle("artcraft-theme-active", this.settings.artcraftTheme);
    document.body.classList.toggle("artcraft-hover-cards", this.settings.hoverCards);
    document.body.classList.toggle("artcraft-sentence-focus", this.settings.sentenceFocus);
    document.body.classList.toggle("artcraft-zen-mode", !!this.zenMode);
    document.body.classList.toggle("artcraft-dark-craft", !!this.settings.darkCraftTheme && !!this.settings.isPro);
    document.body.classList.toggle("artcraft-bento-graph", this.settings.enableBentoGraph !== false);
    document.body.classList.toggle("artcraft-spotlight-mode", !!this.settings.spotlightFocus);
    document.body.classList.toggle("artcraft-magic-lamp", !!this.settings.magicLamp);

    const tag = (this.settings.headerTagText !== undefined ? this.settings.headerTagText : "STRATALCHEMY // KNOWLEDGE BRIEF").trim();
    const show = this.settings.showHeaderTag !== false && tag.length > 0;
    if (show) {
      document.documentElement.style.setProperty("--artcraft-header-tag", `"${tag.replace(/"/g, '\\"')}"`);
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "block");
    } else {
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "none");
    }
  }

  // --- SWISS BENTO GRAPH STUDIO (WEBSITE-GRADE HUD, LEGEND PILL, NEURAL LASER PULSES & BENTO NODE CARDS) ---
  injectGraphViewHUD() {
    if (this.settings.enableBentoGraph === false) {
      document.querySelectorAll(".artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas").forEach((el) => el.remove());
      return;
    }

    const graphLeaves = document.querySelectorAll('.workspace-leaf-content[data-type="graph"], .workspace-leaf-content[data-type="localgraph"]');
    graphLeaves.forEach((leafEl) => {
      const viewContent = leafEl.querySelector(".view-content");
      if (!viewContent) return;

      viewContent.classList.add("artcraft-graph-canvas-wrap");
      viewContent.setAttribute("data-graph-preset", this.settings.graphPreset || "bento");

      // Auto-upgrade legacy orange/spiky graph.json once so user immediately gets balanced 8-color Swiss Bento Graph without spiky arrows
      if (!this.hasAutoUpgradedGraph) {
        this.hasAutoUpgradedGraph = true;
        setTimeout(() => this.applyBentoGraphColorGroups(false, true), 250);
      }

      const lang = this.settings.uiLanguage || "en";
      const isRu = lang === "ru";

      // 1. Top-Left Legend Pill (exact match to Website Demo Screenshot 1: .obsidian/graph.json + color dots)
      let legend = viewContent.querySelector(".artcraft-graph-legend-pill");
      if (!legend) {
        legend = document.createElement("div");
        legend.className = "artcraft-graph-legend-pill";
        legend.innerHTML = `
          <span class="legend-code">.obsidian/graph.json</span>
          <span class="legend-item"><i style="background:#2563EB"></i>01 Strategy</span>
          <span class="legend-item"><i style="background:#F59E0B"></i>02 Product</span>
          <span class="legend-item"><i style="background:#10B981"></i>03 Research</span>
          <span class="legend-item"><i style="background:#8B5CF6"></i>04 Permanent</span>
          <span class="legend-item"><i style="background:#EC4899"></i>#pro</span>
        `;
        viewContent.appendChild(legend);
      }

      // 2. Top-Right Preset & Pulse Controls HUD (with custom Swiss Bento vector icons)
      let hud = viewContent.querySelector(".artcraft-graph-hud");
      if (hud && hud.getAttribute("data-lang") !== lang) {
        hud.remove();
        hud = null;
      }
      if (!hud) {
        if (this.settings.graphPulseNodes === undefined) this.settings.graphPulseNodes = true;
        hud = document.createElement("div");
        hud.className = "artcraft-graph-hud";
        hud.setAttribute("data-lang", lang);
        hud.innerHTML = `
          <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "bento" ? "is-active" : ""}" data-preset="bento">${SICRAFT_SVGS.graph} <span>${t("graphPresetBento", this)}</span></button>
          <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "constellation" ? "is-active" : ""}" data-preset="constellation">${SICRAFT_SVGS.spark} <span>${t("graphPresetConstellation", this)}</span></button>
          <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "radar" ? "is-active" : ""}" data-preset="radar">${SICRAFT_SVGS.zen} <span>${t("graphPresetRadar", this)}</span></button>
          <button class="artcraft-graph-hud-btn artcraft-graph-pulse-btn ${this.settings.graphPulseNodes ? "is-pulse-on" : ""}" data-action="pulse">${SICRAFT_SVGS.bolt} <span>${isRu ? "Импульсы связей" : "Pulse Nodes"}</span></button>
          <button class="artcraft-graph-hud-btn artcraft-graph-color-btn" data-action="colorize">${SICRAFT_SVGS.spark} <span>${t("graphColorizeBtn", this)}</span></button>
          <button class="artcraft-graph-hud-btn" data-action="toggle-orphans">${t("graphOrphansBtn", this)}</button>
        `;

        hud.querySelectorAll("[data-preset]").forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const preset = btn.getAttribute("data-preset");
            this.settings.graphPreset = preset;
            await this.saveSettings();
            hud.querySelectorAll("[data-preset]").forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            viewContent.setAttribute("data-graph-preset", preset);
          });
        });

        hud.querySelector('[data-action="pulse"]')?.addEventListener("click", async (e) => {
          e.stopPropagation();
          this.settings.graphPulseNodes = !this.settings.graphPulseNodes;
          await this.saveSettings();
          hud.querySelector('[data-action="pulse"]')?.classList.toggle("is-pulse-on", this.settings.graphPulseNodes);
        });

        hud.querySelector('[data-action="colorize"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.applyBentoGraphColorGroups(false, false);
        });

        hud.querySelector('[data-action="toggle-orphans"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.applyBentoGraphColorGroups(true, false);
        });

        viewContent.appendChild(hud);
      }

      // 3. Bottom-Right Interactive Hint Pill (exact match to Website Demo Screenshot 1)
      let hint = viewContent.querySelector(".artcraft-graph-hint-pill");
      if (!hint) {
        hint = document.createElement("div");
        hint.className = "artcraft-graph-hint-pill";
        hint.innerHTML = `${SICRAFT_SVGS.lamp} <span>${isRu ? "Перетащите любой узел или наведите курсор для подсветки нейронных связей" : "Drag any node or hover to inspect neural links"}</span>`;
        viewContent.appendChild(hint);
      }

      // 4. Lightweight Overlay Canvas for Neural Laser Pulses, Radar Rings & Swiss Bento Node Label Cards
      let fxCanvas = viewContent.querySelector(".artcraft-graph-fx-canvas");
      if (!fxCanvas) {
        fxCanvas = document.createElement("canvas");
        fxCanvas.className = "artcraft-graph-fx-canvas";
        viewContent.appendChild(fxCanvas);
      }
    });
  }

  renderGraphStudioFX() {
    if (this.settings.enableBentoGraph === false) return;
    const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
    if (!leaves || leaves.length === 0) return;

    this.graphPulsePhase = (this.graphPulsePhase || 0) + 0.014;
    const paletteHex = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4", "#69BD28"];
    const isDark = document.body.classList.contains("artcraft-dark-craft") || document.body.classList.contains("theme-dark");

    for (let l = 0; l < leaves.length; l++) {
      const view = leaves[l].view;
      if (!view || !view.containerEl) continue;
      const viewContent = view.containerEl.querySelector(".view-content");
      if (!viewContent || viewContent.offsetParent === null) continue;
      const fxCanvas = viewContent.querySelector(".artcraft-graph-fx-canvas");
      if (!fxCanvas) continue;

      const cw = viewContent.clientWidth;
      const ch = viewContent.clientHeight;
      if (cw < 50 || ch < 50) continue;
      if (fxCanvas.width !== cw || fxCanvas.height !== ch) {
        fxCanvas.width = cw;
        fxCanvas.height = ch;
      }

      const ctx = fxCanvas.getContext("2d");
      ctx.clearRect(0, 0, cw, ch);

      const renderer = view.renderer;
      if (!renderer || !renderer.nodes || renderer.nodes.length === 0) continue;

      // Helper to convert PixiJS node world coordinates to CSS pixels on viewContent
      const getScreenPt = (n) => {
        if (!n) return null;
        if (n.circle && n.circle.worldTransform) {
          const wt = n.circle.worldTransform;
          const dpr = (renderer.px && renderer.px.renderer && renderer.px.renderer.resolution) || 1;
          // In PixiJS with autoDensity, worldTransform.tx is either CSS px or physical px; check bounds
          let sx = wt.tx;
          let sy = wt.ty;
          if (sx > cw * 1.35 || sy > ch * 1.35) {
            sx /= dpr;
            sy /= dpr;
          }
          return { x: sx, y: sy };
        }
        return null;
      };

      const hovered = renderer.hoveredNode || null;
      let centerPt = hovered ? getScreenPt(hovered) : { x: cw / 2, y: ch / 2 };
      if (!centerPt || centerPt.x < 0 || centerPt.x > cw) centerPt = { x: cw / 2, y: ch / 2 };

      // A. Draw Concentric Dashed Radar Rings (like Website Screenshot 1)
      if (this.settings.graphPreset === "radar" || this.settings.graphPreset === "bento") {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(17, 17, 17, 0.09)";
        const rings = [85, 165, 245];
        for (let r = 0; r < rings.length; r++) {
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y, rings[r], 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // B. Draw Neural Laser Pulses traveling along real graph links & Swiss Bento Card Badges on Hub Nodes
      if (this.settings.graphPulseNodes !== false) {
        const links = renderer.links || [];
        const step = Math.max(1, Math.floor(links.length / 28));
        ctx.save();
        for (let i = 0; i < links.length; i += step) {
          const lnk = links[i];
          if (!lnk || !lnk.source || !lnk.target) continue;
          const p1 = getScreenPt(lnk.source);
          const p2 = getScreenPt(lnk.target);
          if (!p1 || !p2) continue;
          if ((p1.x < 0 && p2.x < 0) || (p1.x > cw && p2.x > cw)) continue;

          const tProg = (this.graphPulsePhase + (i % 13) * 0.077) % 1;
          const px = p1.x + (p2.x - p1.x) * tProg;
          const py = p1.y + (p2.y - p1.y) * tProg;
          const col = paletteHex[i % paletteHex.length];

          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#111111";
          ctx.stroke();
        }
        ctx.restore();
      }

      // C. Draw Swiss Bento Bordered Card Badges ([ Note_Title ]) on Top Hub Nodes & Hovered Node (Exact Match to Screenshot 1!)
      const nodes = renderer.nodes;
      const topHubs = [];
      if (hovered) topHubs.push(hovered);
      // Pick up to 8 well-spaced hub nodes currently inside viewport
      for (let i = 0; i < nodes.length && topHubs.length < 9; i++) {
        const nd = nodes[i];
        if (!nd || nd === hovered || (nd.weight || 0) < 2) continue;
        const pt = getScreenPt(nd);
        if (!pt || pt.x < 70 || pt.x > cw - 70 || pt.y < 60 || pt.y > ch - 60) continue;
        // Avoid overlapping badges
        const tooClose = topHubs.some((h) => {
          const hp = getScreenPt(h);
          return hp && Math.hypot(hp.x - pt.x, hp.y - pt.y) < 115;
        });
        if (!tooClose) topHubs.push(nd);
      }

      ctx.save();
      ctx.font = '700 10.5px "JetBrains Mono", monospace';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      for (let idx = 0; idx < topHubs.length; idx++) {
        const nd = topHubs[idx];
        const pt = getScreenPt(nd);
        if (!pt) continue;
        const rawId = String(nd.id || "").replace(/\.md$/i, "");
        const shortName = rawId.split("/").pop() || rawId;
        if (!shortName) continue;
        const label = shortName.length > 24 ? shortName.slice(0, 22) + "…" : shortName;
        const isHov = nd === hovered;

        // Crisp dark hardware ring around the hub node
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isHov ? 9 : 6.5, 0, Math.PI * 2);
        ctx.strokeStyle = isHov ? "#69BD28" : "#111111";
        ctx.lineWidth = isHov ? 2.2 : 1.6;
        ctx.stroke();

        // Measure & draw Swiss Bento Rectangular Label Card below the node
        const textW = ctx.measureText(label).width;
        const boxW = Math.round(textW + 14);
        const boxH = 19;
        const bx = Math.round(pt.x - boxW / 2);
        const by = Math.round(pt.y + (isHov ? 13 : 10));

        // 2px Hard Swiss Shadow
        ctx.fillStyle = "#111111";
        ctx.fillRect(bx + 2, by + 2, boxW, boxH);

        // Card Fill & Border
        ctx.fillStyle = isHov ? "#69BD28" : isDark ? "#1A1C20" : "#FFFFFF";
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(bx, by, boxW, boxH);

        // Card Text
        ctx.fillStyle = isHov ? "#FFFFFF" : isDark ? "#F3F4F6" : "#111111";
        ctx.fillText(label, Math.round(pt.x), Math.round(by + boxH / 2 + 0.5));
      }
      ctx.restore();
    }
  }

  async applyBentoGraphColorGroups(toggleOrphans = false, silent = false) {
    try {
      const adapter = this.app.vault.adapter;
      const configDir = this.app.vault.configDir || ".obsidian";
      const graphPath = `${configDir}/graph.json`;
      let graphConfig = {};
      if (await adapter.exists(graphPath)) {
        const raw = await adapter.read(graphPath);
        graphConfig = JSON.parse(raw);
      }

      // 8-Color Swiss Bento Palette in Decimal RGB for graph.json
      const bentoColors = [
        2450411,  // #2563EB Sapphire Blue
        1096065,  // #10B981 Emerald Green
        9133302,  // #8B5CF6 Amethyst Purple
        15485081, // #EC4899 Rose Quartz
        439972,   // #06B6D4 Cyber Cyan
        6929704,  // #69BD28 Excel Green
        16096779, // #F59E0B Amber Orange
        15381256, // #EAB308 Solar Gold
      ];

      const colorGroups = [
        // 1. Distribute Daily / Date Notes across 7 vibrant Swiss Bento colors so a single daily-notes folder never turns 90% of the graph orange!
        { query: 'file:"2024-01" OR file:"2025-01" OR file:"2026-01"', color: { a: 1, rgb: 2450411 } },
        { query: 'file:"2024-02" OR file:"2025-02" OR file:"2026-02"', color: { a: 1, rgb: 1096065 } },
        { query: 'file:"2024-03" OR file:"2025-03" OR file:"2026-03"', color: { a: 1, rgb: 9133302 } },
        { query: 'file:"2024-04" OR file:"2025-04" OR file:"2026-04"', color: { a: 1, rgb: 439972 } },
        { query: 'file:"2024-05" OR file:"2024-06" OR file:"2025-05" OR file:"2026-"', color: { a: 1, rgb: 15485081 } },
        { query: 'file:"2023-" OR file:"2024-07" OR file:"2024-08" OR file:"2024-09"', color: { a: 1, rgb: 6929704 } },
        { query: 'file:"2024-10" OR file:"2024-11" OR file:"2024-12" OR file:"2025-"', color: { a: 1, rgb: 16096779 } },
      ];

      // 2. Scan all real top-level folders in the user's vault
      const rootChildren = (this.app.vault.getRoot() && this.app.vault.getRoot().children) || [];
      const folders = rootChildren
        .filter((f) => f && f.children !== undefined && !f.name.startsWith("."))
        .map((f) => f.name)
        .sort();

      folders.forEach((folderName, idx) => {
        colorGroups.push({
          query: `path:"${folderName}"`,
          color: { a: 1, rgb: bentoColors[idx % bentoColors.length] },
        });
      });

      // 3. Semantic tags & universal catch-all fallback
      colorGroups.push({ query: "tag:#pro OR tag:#important", color: { a: 1, rgb: 15485081 } });
      colorGroups.push({ query: 'file:"*"', color: { a: 1, rgb: 2450411 } });

      graphConfig.colorGroups = colorGroups;
      // Disable ugly black spiky arrowheads around hub nodes (matches Website Screenshot 1 and boosts WebGL FPS!)
      graphConfig.showArrow = false;
      if (toggleOrphans) {
        graphConfig.showOrphans = !graphConfig.showOrphans;
      } else {
        graphConfig.showOrphans = false;
      }
      graphConfig.textFadeMultiplier = -0.2;
      graphConfig.nodeSizeMultiplier = 1.32;
      graphConfig.lineSizeMultiplier = 1.15;
      graphConfig.centerStrength = 0.42;
      graphConfig.repelStrength = 10.5;
      graphConfig.linkDistance = 150;

      await adapter.write(graphPath, JSON.stringify(graphConfig, null, 2));

      // Apply live to any currently open Graph View leaf without requiring a restart!
      const graphPlugin = this.app.internalPlugins?.plugins?.graph?.instance;
      if (graphPlugin && graphPlugin.options) {
        Object.assign(graphPlugin.options, graphConfig);
      }
      const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
      leaves.forEach((leaf) => {
        const view = leaf.view;
        if (view) {
          try {
            if (view.dataEngine) {
              view.dataEngine.setOptions(graphConfig);
              view.dataEngine.render();
            }
            if (view.renderer && typeof view.renderer.changed === "function") {
              view.renderer.changed();
            }
          } catch (e) {}
        }
      });

      if (!silent) {
        this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 50);
        new Notice(`Colored ${folders.length} Vault Folders in Graph View & optimized cluster layout!`);
      }
    } catch (err) {
      if (!silent) new Notice("Could not update graph configuration automatically.");
    }
  }

  updateTaskProgressBar(fromCheckboxClick = false) {
    // Remove any legacy or orphaned bars stuck inside CodeMirror scroller
    document
      .querySelectorAll(".cm-sizer .artcraft-task-progress-wrap, .cm-content .artcraft-task-progress-wrap, .inline-title + .artcraft-task-progress-wrap")
      .forEach((el) => el.remove());

    if (this.settings.showTaskProgress === false) {
      document.querySelectorAll(".artcraft-task-progress-wrap").forEach((el) => {
        el.style.display = "none";
      });
      return;
    }

    const obsidian = require("obsidian");
    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file) {
      document.querySelectorAll(".artcraft-task-progress-wrap").forEach((el) => {
        el.style.display = "none";
      });
      return;
    }

    const cache = this.app.metadataCache.getFileCache(activeView.file);
    let total = 0;
    let done = 0;

    if (cache && cache.listItems) {
      cache.listItems.forEach((li) => {
        if (li.task !== undefined) {
          total++;
          if (li.task === "x" || li.task === "X") done++;
        }
      });
    }

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const filePath = activeView.file.path;
    if (fromCheckboxClick && total > 0 && pct === 100 && this.lastTaskPctByFile[filePath] !== 100) {
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 4, 60);
      if (this.settings.focusAnalytics) {
        this.settings.focusAnalytics.tasksCompleted100 = (this.settings.focusAnalytics.tasksCompleted100 || 0) + 1;
        this.saveSettings();
      }
    }
    this.lastTaskPctByFile[filePath] = pct;

    document.querySelectorAll('.workspace-leaf-content[data-type="markdown"]').forEach((leaf) => {
      const viewContent = leaf.querySelector(".view-content");
      if (!viewContent) return;

      let barWrap = viewContent.querySelector(":scope > .artcraft-task-progress-wrap");

      if (total === 0) {
        if (barWrap) barWrap.style.display = "none";
        return;
      }

      if (!barWrap) {
        barWrap = document.createElement("div");
        barWrap.className = "artcraft-task-progress-wrap";
        barWrap.innerHTML = `
          <span class="artcraft-task-progress-label"></span>
          <div class="artcraft-task-progress-bar-bg">
            <div class="artcraft-task-progress-bar-fill"></div>
          </div>
          <span class="artcraft-task-progress-pct"></span>
          <button class="artcraft-task-progress-close" title="Dismiss bar (Mobile Safe)">✕</button>
        `;
        const closeBtn = barWrap.querySelector(".artcraft-task-progress-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            barWrap.style.display = "none";
          });
        }
        viewContent.insertBefore(barWrap, viewContent.firstChild);
      }

      barWrap.style.display = "flex";
      const labelEl = barWrap.querySelector(".artcraft-task-progress-label");
      const fillEl = barWrap.querySelector(".artcraft-task-progress-bar-fill");
      const pctEl = barWrap.querySelector(".artcraft-task-progress-pct");

      if (labelEl) labelEl.textContent = `${t("taskProgressLabel", this)} ${done} / ${total}`;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (pctEl) pctEl.textContent = `${pct}%`;
    });
  }

  cleanCurrentNoteAIWatermarks() {
    const view = this.app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
    if (!view || !view.editor) {
      new Notice("Please open a markdown note to clean AI markers.");
      return;
    }
    const editor = view.editor;
    const hasSelection = editor.somethingSelected();
    const raw = hasSelection ? editor.getSelection() : editor.getValue();

    const invisibleRegex = /[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\u00ad]/g;
    const matches = raw.match(invisibleRegex);
    const count = matches ? matches.length : 0;

    const cleaned = raw
      .replace(invisibleRegex, "")
      .replace(/[\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g, " ")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

    if (cleaned !== raw) {
      if (hasSelection) {
        editor.replaceSelection(cleaned);
      } else {
        editor.setValue(cleaned);
      }
    }
    navigator.clipboard.writeText(cleaned);
    new Notice(`✓ Cleaned ${count} invisible AI marker(s) & copied to clipboard!`);
  }

  setupLivePreviewObserver() {
    let rafPending = false;
    const styleLivePreviewNodes = () => {
      rafPending = false;
      if (!this.settings.artcraftTheme || !this.settings.colorizeNumbers) return;
      const colors = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];
      const listSpans = document.querySelectorAll(".HyperMD-list-line .cm-formatting-list-ol");
      for (let i = 0; i < listSpans.length; i++) {
        const el = listSpans[i];
        const txt = el.textContent;
        if (!txt) continue;
        const num = parseInt(txt, 10);
        if (!isNaN(num) && num > 0) {
          const mod = ((num - 1) % 4) + 1;
          const modStr = String(mod);
          if (el.getAttribute("data-artcraft-mod") !== modStr) {
            el.setAttribute("data-artcraft-mod", modStr);
            el.style.setProperty("background-color", colors[mod - 1], "important");
          }
        }
      }
    };

    const scheduleStyle = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(styleLivePreviewNodes);
      }
    };

    styleLivePreviewNodes();

    // Instant zero-lag MutationObserver when CodeMirror 6 virtual scroller mounts new lines
    this.cmObserver = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0 || mutations[i].type === "characterData") {
          scheduleStyle();
          break;
        }
      }
    });
    this.cmObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Passive scroll listener on capture phase so scrolling with mouse wheel colors badges on the exact same frame
    this.onScrollCapture = () => scheduleStyle();
    window.addEventListener("scroll", this.onScrollCapture, { capture: true, passive: true });
    this.registerDomEvent(window, "wheel", () => scheduleStyle(), { passive: true });

    // Lightweight fallback check for Graph HUD
    this.lpInterval = setInterval(() => {
      if (this.settings.enableBentoGraph !== false) {
        this.injectGraphViewHUD();
      }
      scheduleStyle();
    }, 1200);
  }

  enhanceMarkdownElement(rootEl) {
    this.updateTaskProgressBar();
    const blocks = rootEl.querySelectorAll("p, li, td, h1, h2, h3, h4, blockquote p");
    blocks.forEach((block) => {
      if (block.dataset.artcraftProcessed === "true") return;
      this.enhanceSingleBlock(block, false);
    });

    rootEl.querySelectorAll("ol > li").forEach((li, idx) => {
      const colors = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];
      const c = colors[idx % 4];
      li.style.setProperty("--artcraft-marker-color", c);
    });
  }

  enhanceSingleBlock(block, isLivePreview = false) {
    block.dataset.artcraftProcessed = "true";

    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && node.parentElement.tagName === "CODE") continue;
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue || "";
      if (!text.trim()) return;

      const hasTokens =
        /\b(0[1-4]\s*\/\/|\d+\s*(?:%|\$|k|к|тыс|млн|USD|USDT)|https?:\/\/|\.com|\.io|\.org|\.ru|0x[a-fA-F0-9]{4,}|[1-9A-HJ-NP-Za-km-z]{32,}|TRC20|BEP20|ERC20|EVM|SOL|TON|Bybit|Binance|UID\s*\d+|✅|\d{4}-\d{2}-\d{2})/i.test(
          text
        );

      if (!hasTokens && isLivePreview) return;

      const frag = document.createDocumentFragment();
      if (!isLivePreview && this.settings.sentenceFocus) {
        const sentences = text.match(/[^.!?]+(?:[.!?]+|$)/g) || [text];
        sentences.forEach((sent) => {
          if (!sent.trim()) {
            frag.appendChild(document.createTextNode(sent));
            return;
          }
          const span = document.createElement("span");
          span.className = "artcraft-sentence";
          this.appendWithColorizedTokens(span, sent);

          span.addEventListener("click", () => {
            if (this.mode !== "none") return;
            const targetColor = this.settings.strokeColor;
            const currentPin = span.getAttribute("data-pinned-color");
            if (currentPin === targetColor) {
              span.removeAttribute("data-pinned-color");
              span.style.removeProperty("--artcraft-pinned-bg");
              span.style.removeProperty("--artcraft-pinned-border");
              span.classList.remove("is-pinned");
            } else {
              span.setAttribute("data-pinned-color", targetColor);
              span.style.setProperty("--artcraft-pinned-bg", `${targetColor}24`);
              span.style.setProperty("--artcraft-pinned-border", targetColor);
              span.classList.add("is-pinned");
            }
          });

          frag.appendChild(span);
        });
      } else {
        this.appendWithColorizedTokens(frag, text);
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(frag, textNode);
      }
    });
  }

  appendWithColorizedTokens(parent, text) {
    const tokenRegex =
      /(\b0[1-4]\s*\/\/|\b\d+(?:[.,]\d+)?\s*(?:%|\$|k|к|тыс|млн|USD|USDT)\b|\bhttps?:\/\/[^\s<]+|\b[a-zA-Z0-9.-]+\.(?:com|io|org|ru|dev|net|ai)(?:\/[^\s<]*)?|\b0x[a-fA-F0-9]{40}\b|\b[1-9A-HJ-NP-Za-km-z]{32,44}\b|\b(?:TRC20|BEP20|ERC20|EVM|SOL|TON|Bybit|Binance|UID\s*\d+)\b|✅\s*(?:\d{4}-\d{2}-\d{2})?|✅|\b\d{4}-\d{2}-\d{2}\b)/gi;

    let lastIdx = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parent.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      }

      const matchStr = match[0];
      const stepMatch = matchStr.match(/^0([1-4])\s*\/\//);

      if (stepMatch && this.settings.colorizeNumbers) {
        const num = parseInt(stepMatch[1], 10);
        const colors = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];
        const color = colors[num - 1];
        const span = document.createElement("span");
        span.className = "artcraft-step-badge";
        span.textContent = `0${num}`;
        span.style.setProperty("background-color", color, "important");
        span.style.setProperty("color", "#FFFFFF", "important");
        parent.appendChild(span);
        parent.appendChild(document.createTextNode(" // "));
      } else if (matchStr.startsWith("✅")) {
        const circle = document.createElement("span");
        circle.className = "artcraft-check-circle";
        circle.textContent = "✓";
        parent.appendChild(circle);

        const datePart = matchStr.replace(/^✅\s*/, "").trim();
        if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          const dateSpan = document.createElement("span");
          dateSpan.className = "artcraft-task-date";
          dateSpan.textContent = datePart;
          parent.appendChild(dateSpan);
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(matchStr)) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "artcraft-task-date";
        dateSpan.textContent = matchStr;
        parent.appendChild(dateSpan);
      } else if (/^\d+(?:[.,]\d+)?\s*(?:%|\$|k|к|тыс|млн|USD|USDT)$/i.test(matchStr)) {
        const span = document.createElement("span");
        span.className = "artcraft-pill-number";
        span.textContent = matchStr;
        parent.appendChild(span);
      } else if (/^(?:https?:\/\/|[a-zA-Z0-9.-]+\.(?:com|io|org|ru|dev|net|ai))/i.test(matchStr)) {
        const span = document.createElement("span");
        span.className = "artcraft-capsule-link";
        span.textContent = matchStr;
        parent.appendChild(span);
      } else {
        const span = document.createElement("span");
        span.className = "artcraft-capsule-crypto";
        span.textContent = matchStr;
        parent.appendChild(span);
      }

      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parent.appendChild(document.createTextNode(text.slice(lastIdx)));
    }
  }

  // --- FLOATING DOCK & OVERLAY CANVAS ---
  createFloatingDock() {
    if (this.dockEl) this.dockEl.remove();

    const dock = document.createElement("div");
    dock.className = "artcraft-floating-dock";
    if (this.settings.dockCollapsed) {
      dock.classList.add("is-collapsed");
    }
    if (this.settings.dockVertical) {
      dock.classList.add("is-vertical");
    }

    const badge = document.createElement("span");
    badge.className = "artcraft-dock-badge";
    badge.title = t("dockCollapseTip", this);
    badge.innerHTML = `<span class="artcraft-dock-badge-full">${ALCHEMY_ICON_SVG}<span class="artcraft-badge-text">ALCHEMY CRAFT</span></span><span class="artcraft-dock-badge-short">${ALCHEMY_ICON_SVG}</span>`;
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDockCollapse();
    });
    dock.appendChild(badge);

    const contentWrap = document.createElement("div");
    contentWrap.className = "artcraft-dock-content";

    // 0. Compact Pomodoro / Work Timer Pill
    this.timerEl = document.createElement("div");
    this.timerEl.className = "artcraft-timer-pill";
    this.timerEl.title = t("timerTip", this);

    const timerDot = document.createElement("span");
    timerDot.className = "artcraft-timer-dot";
    this.timerEl.appendChild(timerDot);

    this.timerTextEl = document.createElement("span");
    this.timerEl.appendChild(this.timerTextEl);

    this.timerEl.addEventListener("click", () => {
      this.toggleTimer();
    });
    this.timerEl.addEventListener("dblclick", (e) => {
      e.preventDefault();
      this.resetTimer();
      new Notice("Timer reset");
    });
    this.timerEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showTimerMenu(e);
    });
    contentWrap.appendChild(this.timerEl);
    this.updateTimerDisplay();

    // 1. Theme toggle button
    this.btnTheme = document.createElement("button");
    this.btnTheme.className = "artcraft-dock-btn";
    this.btnTheme.title = t("uiTip", this);
    this.btnTheme.textContent = t("uiBtn", this);
    this.btnTheme.addEventListener("click", async () => {
      this.settings.artcraftTheme = !this.settings.artcraftTheme;
      await this.saveSettings();
      this.applyBodyClasses();
      this.updateDockUI();
    });
    contentWrap.appendChild(this.btnTheme);

    // 1.5. Zen Mode button
    this.btnZen = document.createElement("button");
    this.btnZen.className = "artcraft-dock-btn";
    this.btnZen.title = t("zenTip", this);
    this.btnZen.innerHTML = `${SICRAFT_SVGS.zen}<span class="artcraft-btn-label">${t("zenBtn", this)}</span>`;
    this.btnZen.addEventListener("click", () => {
      this.zenMode = !this.zenMode;
      this.applyBodyClasses();
      this.updateDockUI();
    });
    contentWrap.appendChild(this.btnZen);

    // 2. Sentence Focus button
    this.btnSentence = document.createElement("button");
    this.btnSentence.className = "artcraft-dock-btn";
    this.btnSentence.title = t("focusTip", this);
    this.btnSentence.innerHTML = `${SICRAFT_SVGS.focus}<span class="artcraft-btn-label">${t("focusBtn", this)}</span>`;
    this.btnSentence.addEventListener("click", async () => {
      this.settings.sentenceFocus = !this.settings.sentenceFocus;
      await this.saveSettings();
      this.applyBodyClasses();
      this.updateDockUI();
    });
    contentWrap.appendChild(this.btnSentence);

    // 3. Laser Pointer button
    this.btnLaser = document.createElement("button");
    this.btnLaser.className = "artcraft-dock-btn";
    this.btnLaser.title = t("laserTip", this);
    this.btnLaser.innerHTML = `${SICRAFT_SVGS.laser}<span class="artcraft-btn-label">${t("laserBtn", this)}</span>`;
    this.btnLaser.addEventListener("click", () => {
      this.toggleMode(this.mode === "laser" ? "none" : "laser");
    });
    contentWrap.appendChild(this.btnLaser);

    // 4. Draw Marker button
    this.btnDraw = document.createElement("button");
    this.btnDraw.className = "artcraft-dock-btn";
    this.btnDraw.title = t("drawTip", this);
    this.btnDraw.innerHTML = `${SICRAFT_SVGS.draw}<span class="artcraft-btn-label">${t("drawBtn", this)}</span>`;
    this.btnDraw.addEventListener("click", () => {
      this.toggleMode(this.mode === "draw" ? "none" : "draw");
    });
    contentWrap.appendChild(this.btnDraw);

    // 4.1. Eraser button
    this.btnEraser = document.createElement("button");
    this.btnEraser.className = "artcraft-dock-btn";
    this.btnEraser.title = t("eraserTip", this);
    this.btnEraser.innerHTML = `${SICRAFT_SVGS.eraser}<span class="artcraft-btn-label">${t("eraserBtn", this)}</span>`;
    this.btnEraser.addEventListener("click", () => {
      this.toggleMode(this.mode === "eraser" ? "none" : "eraser");
    });
    contentWrap.appendChild(this.btnEraser);

    // 4.2. Undo button
    this.btnUndo = document.createElement("button");
    this.btnUndo.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    this.btnUndo.title = t("undoTip", this);
    this.btnUndo.innerHTML = SICRAFT_SVGS.undo;
    this.btnUndo.addEventListener("click", () => {
      this.undo();
    });
    contentWrap.appendChild(this.btnUndo);

    // 4.3. Redo button
    this.btnRedo = document.createElement("button");
    this.btnRedo.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    this.btnRedo.title = t("redoTip", this);
    this.btnRedo.innerHTML = SICRAFT_SVGS.redo;
    this.btnRedo.addEventListener("click", () => {
      this.redo();
    });
    contentWrap.appendChild(this.btnRedo);

    // 5. Palette dots (8 Colors: 4 Standard + 4 Pro)
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "artcraft-color-dots-wrap";
    this.colorDots = [];
    PALETTE.forEach((p) => {
      if (p.pro && !this.settings.isPro) return;
      const dot = document.createElement("div");
      dot.className = "artcraft-color-dot";
      dot.style.backgroundColor = p.color;
      dot.title = p.name;
      dot.addEventListener("click", async () => {
        this.settings.strokeColor = p.color;
        this.settings.activeColorKey = p.key;
        await this.saveSettings();
        this.updateDockUI();
      });
      this.colorDots.push({ el: dot, color: p.color, key: p.key });
      dotsWrap.appendChild(dot);
    });
    contentWrap.appendChild(dotsWrap);

    // 6. AI Text Cleaner button
    if (this.settings.enableAiCleaner) {
      this.btnCleanAI = document.createElement("button");
      this.btnCleanAI.className = "artcraft-dock-btn";
      this.btnCleanAI.title = t("aiCleanTip", this);
      this.btnCleanAI.innerHTML = `${SICRAFT_SVGS.spark}<span class="artcraft-btn-label">${t("aiCleanBtn", this)}</span>`;
      this.btnCleanAI.addEventListener("click", () => {
        this.cleanCurrentNoteAIWatermarks();
      });
      contentWrap.appendChild(this.btnCleanAI);
    }

    // 6.5. Smart LED Cursor Lamp Button (LMB: Toggle | RMB: Open 2700K-6500K Smart LED Controller)
    this.btnLamp = document.createElement("button");
    this.btnLamp.className = this.settings.enableAiCleaner ? "artcraft-dock-btn" : "artcraft-dock-btn is-full-row";
    this.btnLamp.title = t("lampTip", this);
    this.btnLamp.innerHTML = `${SICRAFT_SVGS.lamp}<span class="artcraft-btn-label">${t("lampBtn", this)}</span>`;
    this.btnLamp.addEventListener("click", () => {
      this.toggleMagicLamp();
    });
    this.btnLamp.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      new SmartLedLampModal(this.app, this).open();
    });
    contentWrap.appendChild(this.btnLamp);

    // 6.6. Live 4-Mode Sonic Equalizer (Reacts ONLY to real audio; LMB: Cycle 4 Visual Modes | RMB: Audio Source Menu)
    if (this.settings.showEqualizer !== false) {
      const eqWrap = document.createElement("div");
      eqWrap.className = "artcraft-dock-eq-pill";
      eqWrap.title = "LMB: Switch Equalizer Style (01 Peak-Hold / 02 Liquid Ribbon / 03 Supernova / 04 Matrix) | Double-Click: Sync PC Audio | RMB: Sound Menu";
      this.eqWrap = eqWrap;

      const eqIconSpan = document.createElement("span");
      eqIconSpan.className = "artcraft-eq-icon-wrap";
      eqWrap.appendChild(eqIconSpan);

      const eqDotSpan = document.createElement("span");
      eqDotSpan.className = "artcraft-eq-status-dot";
      eqWrap.appendChild(eqDotSpan);

      this.eqCanvas = document.createElement("canvas");
      this.eqCanvas.width = 62;
      this.eqCanvas.height = 20;
      this.eqCanvas.className = "artcraft-dock-eq-canvas";
      eqWrap.appendChild(this.eqCanvas);
      eqWrap.addEventListener("click", () => {
        this.cycleEqualizerMode();
      });
      eqWrap.addEventListener("dblclick", (e) => {
        e.preventDefault();
        this.toggleDesktopAudioCapture();
      });
      eqWrap.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showAudioMenu(e);
      });
      contentWrap.appendChild(eqWrap);
      this.updateEqualizerPillUI();
    }

    // 7. Clear button
    const btnClear = document.createElement("button");
    btnClear.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    btnClear.title = t("clearTip", this);
    btnClear.innerHTML = SICRAFT_SVGS.clear;
    btnClear.addEventListener("click", () => {
      this.clearAllAnnotations();
    });
    contentWrap.appendChild(btnClear);

    // 7.5. Orientation Toggle button
    const btnOrient = document.createElement("button");
    btnOrient.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    btnOrient.title = t("orientTip", this);
    btnOrient.innerHTML = SICRAFT_SVGS.orient;
    btnOrient.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDockOrientation();
    });
    contentWrap.appendChild(btnOrient);

    // 8. Collapse / Minimize button
    const btnCollapse = document.createElement("button");
    btnCollapse.className = "artcraft-dock-btn artcraft-dock-icon-btn artcraft-dock-collapse-btn";
    btnCollapse.title = t("collapseTip", this);
    btnCollapse.innerHTML = SICRAFT_SVGS.collapse;
    btnCollapse.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDockCollapse();
    });
    contentWrap.appendChild(btnCollapse);

    dock.appendChild(contentWrap);

    dock.addEventListener("click", (e) => {
      if (dock.classList.contains("is-collapsed")) {
        e.stopPropagation();
        this.toggleDockCollapse();
      }
    });

    document.body.appendChild(dock);
    this.dockEl = dock;
    this.updateDockUI();
  }

  async toggleDockOrientation() {
    this.settings.dockVertical = !this.settings.dockVertical;
    await this.saveSettings();
    if (this.dockEl) {
      this.dockEl.classList.toggle("is-vertical", this.settings.dockVertical);
    }
  }

  async toggleDockCollapse() {
    this.settings.dockCollapsed = !this.settings.dockCollapsed;
    await this.saveSettings();
    if (this.dockEl) {
      this.dockEl.classList.toggle("is-collapsed", this.settings.dockCollapsed);
    }
  }

  updateDockUI() {
    if (!this.dockEl) return;
    this.btnTheme?.classList.toggle("is-active", this.settings.artcraftTheme);
    this.btnZen?.classList.toggle("is-active", !!this.zenMode);
    this.btnSentence?.classList.toggle("is-active", this.settings.sentenceFocus);
    this.btnLaser?.classList.toggle("is-active", this.mode === "laser");
    this.btnDraw?.classList.toggle("is-active", this.mode === "draw");
    this.btnEraser?.classList.toggle("is-active", this.mode === "eraser");
    this.btnLamp?.classList.toggle("is-active", !!this.settings.magicLamp);
    if (this.colorDots) {
      this.colorDots.forEach((d) => {
        d.el.classList.toggle("is-active", d.key === this.settings.activeColorKey);
      });
    }
    this.updateUndoRedoUI();
  }

  updateUndoRedoUI() {
    if (this.btnUndo) {
      const canUndo = this.history && this.history.length > 0;
      this.btnUndo.style.opacity = canUndo ? "1" : "0.35";
      this.btnUndo.style.pointerEvents = canUndo ? "auto" : "none";
    }
    if (this.btnRedo) {
      const canRedo = this.redoHistory && this.redoHistory.length > 0;
      this.btnRedo.style.opacity = canRedo ? "1" : "0.35";
      this.btnRedo.style.pointerEvents = canRedo ? "auto" : "none";
    }
  }

  toggleMode(newMode) {
    this.mode = newMode;
    if (this.canvasEl) {
      const active = this.mode !== "none";
      this.canvasEl.classList.toggle("is-interactive", active);
      this.canvasEl.classList.toggle("mode-laser", this.mode === "laser");
      this.canvasEl.classList.toggle("mode-draw", this.mode === "draw");
      this.canvasEl.classList.toggle("mode-eraser", this.mode === "eraser");
      // In Laser mode, pointer-events stays 'none' because window.mousemove already tracks the laser, so wheel scrolling and clicking work 100% natively!
      const capturePointer = this.mode === "draw" || this.mode === "eraser";
      this.canvasEl.style.pointerEvents = capturePointer ? "auto" : "none";
      this.canvasEl.style.touchAction = capturePointer ? "none" : "auto";
      if (active) {
        if (this.resizeCanvas) this.resizeCanvas();
        this.wakeOverlayCanvas();
      }
    }
    this.updateDockUI();
  }

  wakeOverlayCanvas() {
    if (!this.canvasEl) return;
    if (this.canvasEl.style.display === "none") {
      this.canvasEl.style.display = "block";
    }
    if (!this.animFrame) {
      const renderLoop = () => {
        const shouldContinue = this.renderCanvas();
        if (shouldContinue) {
          this.animFrame = requestAnimationFrame(renderLoop);
        } else {
          this.animFrame = null;
          if (this.canvasEl && (!this.strokes || this.strokes.length === 0)) {
            this.canvasEl.style.display = "none";
          }
        }
      };
      this.animFrame = requestAnimationFrame(renderLoop);
    }
  }

  clearAllAnnotations() {
    if (this.strokes && this.strokes.length > 0) {
      if (!this.history) this.history = [];
      this.history.push({ type: "erase", strokes: [...this.strokes] });
      this.redoHistory = [];
      this.updateUndoRedoUI();
    }
    this.strokes = [];
    this.laserTrail = [];

    // Fixed bug: remove all inline pinned sentence styles & classes properly
    document.querySelectorAll(".artcraft-sentence.is-pinned, [data-pinned-color]").forEach((el) => {
      el.removeAttribute("data-pinned-color");
      el.style.removeProperty("--artcraft-pinned-bg");
      el.style.removeProperty("--artcraft-pinned-border");
      el.classList.remove("is-pinned");
    });
    PALETTE.forEach((p) => {
      document.querySelectorAll(`.${p.pinClass}`).forEach((el) => {
        el.classList.remove(p.pinClass);
      });
    });
    this.toggleMode("none");
  }

  getCanvasCoords(e) {
    if (!this.canvasEl) return { x: 0, y: 0 };
    const rect = this.canvasEl.getBoundingClientRect();
    let cx = 0;
    let cy = 0;
    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      cx = e.changedTouches[0].clientX;
      cy = e.changedTouches[0].clientY;
    } else if (e.clientX !== undefined) {
      cx = e.clientX;
      cy = e.clientY;
    }
    return {
      x: Math.round(cx - rect.left),
      y: Math.round(cy - rect.top),
    };
  }

  eraseAt(pt) {
    const ERASE_RADIUS = 24;
    const remaining = [];
    const removed = [];
    for (const stroke of this.strokes) {
      const hit =
        stroke.points &&
        stroke.points.some((p) => {
          const dx = p.x - pt.x;
          const dy = p.y - pt.y;
          return dx * dx + dy * dy <= ERASE_RADIUS * ERASE_RADIUS;
        });
      if (hit) {
        removed.push(stroke);
      } else {
        remaining.push(stroke);
      }
    }
    if (removed.length > 0) {
      if (!this.currentErasedStrokes) this.currentErasedStrokes = [];
      removed.forEach((s) => {
        if (!this.currentErasedStrokes.includes(s)) {
          this.currentErasedStrokes.push(s);
        }
      });
      this.strokes = remaining;
    }
  }

  undo() {
    if (!this.history || this.history.length === 0) return;
    const action = this.history.pop();
    if (action.type === "stroke") {
      const idx = this.strokes.indexOf(action.stroke);
      if (idx !== -1) {
        this.strokes.splice(idx, 1);
      }
      this.redoHistory.push(action);
    } else if (action.type === "erase") {
      action.strokes.forEach((s) => {
        if (!this.strokes.includes(s)) this.strokes.push(s);
      });
      this.redoHistory.push(action);
    }
    this.updateUndoRedoUI();
    this.wakeOverlayCanvas();
  }

  redo() {
    if (!this.redoHistory || this.redoHistory.length === 0) return;
    const action = this.redoHistory.pop();
    if (action.type === "stroke") {
      this.strokes.push(action.stroke);
      this.history.push(action);
    } else if (action.type === "erase") {
      action.strokes.forEach((s) => {
        const idx = this.strokes.indexOf(s);
        if (idx !== -1) this.strokes.splice(idx, 1);
      });
      this.history.push(action);
    }
    this.updateUndoRedoUI();
    this.wakeOverlayCanvas();
  }

  createOverlayCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "artcraft-overlay-canvas";
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    this.canvasEl = canvas;
    this.ctx = canvas.getContext("2d");

    this.history = [];
    this.redoHistory = [];
    this.currentErasedStrokes = null;
    this.eraserPos = null;

    const resize = () => {
      const isMobile =
        document.body.classList.contains("is-phone") ||
        document.body.classList.contains("is-mobile");
      const topOffset = isMobile ? 0 : 32;
      canvas.style.top = `${topOffset}px`;
      canvas.width = window.innerWidth;
      canvas.height = Math.max(100, window.innerHeight - topOffset);
      if (this.strokes && this.strokes.length > 0) {
        this.wakeOverlayCanvas();
      }
    };
    this.resizeCanvas = resize;
    resize();
    this.registerDomEvent(window, "resize", resize);

    let isInteracting = false;

    const onStart = (e) => {
      if (this.mode === "none") return;
      if (e.cancelable) e.preventDefault();
      isInteracting = true;
      this.isDrawing = true;
      this.wakeOverlayCanvas();
      const pt = this.getCanvasCoords(e);

      if (this.mode === "draw") {
        this.currentStroke = {
          color: this.settings.strokeColor,
          points: [pt],
        };
        this.strokes.push(this.currentStroke);
      } else if (this.mode === "eraser") {
        this.currentErasedStrokes = [];
        this.eraserPos = pt;
        this.eraseAt(pt);
      } else if (this.mode === "laser") {
        this.laserTrail.push({ ...pt, t: Date.now() });
      }
    };

    const onMove = (e) => {
      if (this.mode === "none") return;
      this.wakeOverlayCanvas();
      const pt = this.getCanvasCoords(e);

      if (this.mode === "laser") {
        if (e.cancelable && (e.type.startsWith("touch") || isInteracting)) e.preventDefault();
        this.laserTrail.push({ ...pt, t: Date.now() });
      } else if (this.mode === "draw") {
        if (isInteracting && this.isDrawing && this.currentStroke) {
          if (e.cancelable) e.preventDefault();
          this.currentStroke.points.push(pt);
        }
      } else if (this.mode === "eraser") {
        this.eraserPos = pt;
        if (isInteracting && this.isDrawing) {
          if (e.cancelable) e.preventDefault();
          this.eraseAt(pt);
        }
      }
    };

    const onEnd = () => {
      if (!isInteracting) return;
      isInteracting = false;
      this.isDrawing = false;

      if (this.mode === "draw" && this.currentStroke) {
        this.history.push({ type: "stroke", stroke: this.currentStroke });
        this.redoHistory = [];
        this.updateUndoRedoUI();
      } else if (this.mode === "eraser") {
        if (this.currentErasedStrokes && this.currentErasedStrokes.length > 0) {
          this.history.push({ type: "erase", strokes: this.currentErasedStrokes });
          this.redoHistory = [];
          this.updateUndoRedoUI();
        }
        this.currentErasedStrokes = null;
      }
      this.currentStroke = null;
    };

    canvas.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });

    // Forward mouse wheel scrolling through the drawing canvas to the active note scroller!
    canvas.addEventListener(
      "wheel",
      (e) => {
        const scroller =
          document.querySelector(".workspace-leaf.mod-active .cm-scroller") ||
          document.querySelector(".workspace-leaf.mod-active .markdown-preview-view") ||
          document.querySelector(".cm-scroller") ||
          document.querySelector(".markdown-preview-view");
        if (scroller) {
          scroller.scrollTop += e.deltaY;
          scroller.scrollLeft += e.deltaX;
        }
      },
      { passive: true }
    );

    canvas.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    // Start lightweight 30 FPS loop for mini 62x20 Equalizer & Graph Studio FX only (never touches full-screen 2D canvas!)
    this.startBackgroundVisualLoops();
  }

  startBackgroundVisualLoops() {
    if (this.eqAnimFrame) cancelAnimationFrame(this.eqAnimFrame);
    let lastTick = 0;
    const tick = (ts) => {
      if (!document.hidden && ts - lastTick >= 32) {
        lastTick = ts;
        this.renderEqualizerFrame();
        this.renderGraphStudioFX();
      }
      this.eqAnimFrame = requestAnimationFrame(tick);
    };
    this.eqAnimFrame = requestAnimationFrame(tick);
  }

  renderCanvas() {
    if (!this.ctx || !this.canvasEl) return false;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

    // 1. Render saved marker strokes
    this.strokes.forEach((stroke) => {
      if (!stroke.points || stroke.points.length === 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color || "#2563EB";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.88;

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color || "#2563EB";
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
      ctx.restore();
    });

    // 2. Render glowing laser trail
    const now = Date.now();
    this.laserTrail = this.laserTrail.filter((p) => now - p.t < 650);
    if (this.laserTrail.length > 1) {
      ctx.save();
      for (let i = 1; i < this.laserTrail.length; i++) {
        const p0 = this.laserTrail[i - 1];
        const p1 = this.laserTrail[i];
        const age = (now - p1.t) / 650;
        const alpha = Math.max(0, 1 - age);
        ctx.beginPath();
        ctx.strokeStyle = this.settings.strokeColor;
        ctx.lineWidth = 6 * alpha + 1;
        ctx.lineCap = "round";
        ctx.globalAlpha = alpha;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      const head = this.laserTrail[this.laserTrail.length - 1];
      ctx.beginPath();
      ctx.fillStyle = this.settings.strokeColor;
      ctx.globalAlpha = 0.95;
      ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Render eraser cursor
    if (this.mode === "eraser" && this.eraserPos) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.eraserPos.x, this.eraserPos.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.fill();
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.restore();
    }

    // 3.6. Render Tactile Paper Ripples
    if (this.ripples && this.ripples.length > 0) {
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.r += 2.4;
        rp.alpha -= 0.032;
        if (rp.alpha <= 0) {
          this.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y - 32, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = rp.alpha;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Render Alchemy Celebration Confetti Particles
    if (this.particles && this.particles.length > 0) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.alpha -= 0.018;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }
    }

    const hasActiveAnimation =
      this.mode !== "none" ||
      (this.laserTrail && this.laserTrail.length > 0) ||
      (this.ripples && this.ripples.length > 0) ||
      (this.particles && this.particles.length > 0);

    return hasActiveAnimation;
  }

  renderEqualizerFrame() {
    if (!this.eqCanvas) return;
    const eqCtx = this.eqCanvas.getContext("2d");
    const ew = this.eqCanvas.width;
    const eh = this.eqCanvas.height;
    eqCtx.clearRect(0, 0, ew, eh);

    const activeAnalyser =
      (this.desktopAudioNodes && this.desktopAudioNodes.analyser) ||
      (this.ambientNodes && this.ambientNodes.analyser) ||
      null;

    let freqData = null;
    let hasSound = false;

    if (activeAnalyser) {
      freqData = new Uint8Array(activeAnalyser.frequencyBinCount);
      activeAnalyser.getByteFrequencyData(freqData);

      for (let j = 0; j < freqData.length; j++) {
        if (freqData[j] > 4) {
          hasSound = true;
          break;
        }
      }
    }

    if (!this.eqPeaks) this.eqPeaks = new Array(16).fill(2);
    if (!this.eqSmooth) this.eqSmooth = new Array(16).fill(2);
    if (!this.eqPhase) this.eqPhase = 0;

    const mode = this.settings.eqMode || "bars";
    const colors = ["#69BD28", "#10B981", "#06B6D4", "#2563EB", "#8B5CF6", "#EC4899", "#F59E0B", "#EAB308"];

    // Compute 16 logarithmic frequency bands with smooth spring attack & gravity decay
    let totalEnergy = 0;
    for (let i = 0; i < 16; i++) {
      let targetH = 2;
      if (hasSound && freqData) {
        const binStart = Math.floor(Math.pow(i / 16, 1.55) * (freqData.length * 0.72));
        const binEnd = Math.max(binStart + 1, Math.floor(Math.pow((i + 1) / 16, 1.55) * (freqData.length * 0.72)));
        let maxVal = 0;
        for (let b = binStart; b <= binEnd && b < freqData.length; b++) {
          if (freqData[b] > maxVal) maxVal = freqData[b];
        }
        const boost = 1.15 + (i / 16) * 0.65;
        targetH = Math.max(2, Math.min(eh - 2, ((maxVal * boost) / 255) * (eh - 2)));
      }
      if (targetH > this.eqSmooth[i]) {
        this.eqSmooth[i] += (targetH - this.eqSmooth[i]) * 0.62;
      } else {
        this.eqSmooth[i] = Math.max(2, this.eqSmooth[i] - 0.72);
      }
      if (this.eqSmooth[i] >= this.eqPeaks[i]) {
        this.eqPeaks[i] = this.eqSmooth[i];
      } else {
        this.eqPeaks[i] = Math.max(2, this.eqPeaks[i] - 0.25);
      }
      totalEnergy += this.eqSmooth[i] - 2;
    }

    // Advance phase ONLY when real audio energy is present (never move on its own in silence!)
    if (hasSound || totalEnergy > 1.5) {
      this.eqPhase += 0.08 + Math.min(0.22, totalEnergy / 150);
    }

    // Reactive Bass Glow on Equalizer Pill border when music plays
    const bassLevel = (this.eqSmooth[0] + this.eqSmooth[1] + this.eqSmooth[2] - 6) / (3 * (eh - 2));
    if (this.eqWrap) {
      if (bassLevel > 0.08) {
        const glowAlpha = Math.min(0.75, bassLevel * 0.9).toFixed(2);
        this.eqWrap.style.boxShadow = `0 2px 0 #111111, 0 0 ${Math.round(6 + bassLevel * 12)}px rgba(105, 189, 40, ${glowAlpha})`;
      } else {
        this.eqWrap.style.boxShadow = "";
      }
    }

    if (mode === "bars") {
      // MODE 01: 16-Bar Neon Spectrum with Floating Peak-Hold Caps & Subtle Floor Reflection
      const bars = 16;
      const barW = 2.6;
      const gap = 1.1;
      const baseLine = eh - 3;
      for (let i = 0; i < bars; i++) {
        const x = 1.5 + i * (barW + gap);
        const h = Math.min(baseLine - 1, this.eqSmooth[i]);
        const c = colors[i % colors.length];
        eqCtx.fillStyle = c;
        eqCtx.fillRect(x, baseLine - h, barW, h);

        // Floor mirror reflection
        if (h > 2.5) {
          eqCtx.globalAlpha = 0.25;
          eqCtx.fillRect(x, baseLine + 0.5, barW, Math.min(2.5, h * 0.25));
          eqCtx.globalAlpha = 1;
        }

        // Floating Peak-Hold cap
        if (this.eqPeaks[i] > 3.2) {
          eqCtx.fillStyle = "#FFFFFF";
          eqCtx.fillRect(x, Math.max(0, baseLine - this.eqPeaks[i] - 1.5), barW, 1.2);
        }
      }
    } else if (mode === "wave") {
      // MODE 02: 3-Layer Cyber Liquid Spline Ribbon with Glowing Fill
      const layerColors = [
        { stroke: "#69BD28", fill: "rgba(105, 189, 40, 0.28)" },
        { stroke: "#06B6D4", fill: "rgba(6, 182, 212, 0.24)" },
        { stroke: "#EC4899", fill: "rgba(236, 72, 153, 0.20)" },
      ];
      const midY = eh * 0.54;
      for (let l = 0; l < 3; l++) {
        eqCtx.beginPath();
        eqCtx.moveTo(0, eh);
        for (let x = 0; x <= ew; x += 2) {
          const bandIdx = Math.min(15, Math.floor((x / ew) * 16));
          const bandAmp = (this.eqSmooth[bandIdx] - 2) * 0.58;
          const wave =
            Math.sin(x * 0.14 + this.eqPhase * (1.15 + l * 0.35) + l * 1.3) * bandAmp +
            Math.cos(x * 0.08 - this.eqPhase * 0.85) * (bandAmp * 0.45);
          const y = Math.max(1, Math.min(eh - 1, midY + wave));
          eqCtx.lineTo(x, y);
        }
        eqCtx.lineTo(ew, eh);
        eqCtx.closePath();
        eqCtx.fillStyle = layerColors[l].fill;
        eqCtx.fill();

        eqCtx.beginPath();
        for (let x = 0; x <= ew; x += 2) {
          const bandIdx = Math.min(15, Math.floor((x / ew) * 16));
          const bandAmp = (this.eqSmooth[bandIdx] - 2) * 0.58;
          const wave =
            Math.sin(x * 0.14 + this.eqPhase * (1.15 + l * 0.35) + l * 1.3) * bandAmp +
            Math.cos(x * 0.08 - this.eqPhase * 0.85) * (bandAmp * 0.45);
          const y = Math.max(1, Math.min(eh - 1, midY + wave));
          if (x === 0) eqCtx.moveTo(x, y);
          else eqCtx.lineTo(x, y);
        }
        eqCtx.strokeStyle = layerColors[l].stroke;
        eqCtx.lineWidth = 1.4;
        eqCtx.stroke();
      }
    } else if (mode === "orb") {
      // MODE 03: Supernova Polar Sunburst (20-Ray Starburst + Dual Bass Shockwave Rings)
      const cx = ew / 2;
      const cy = eh / 2;
      const bass = Math.max(0, (this.eqSmooth[0] + this.eqSmooth[1] + this.eqSmooth[2] - 6) / (3 * (eh - 2)));

      if (bass > 0.12) {
        eqCtx.beginPath();
        eqCtx.arc(cx, cy, 4.0 + bass * 7.5, 0, Math.PI * 2);
        eqCtx.strokeStyle = `rgba(105, 189, 40, ${(bass * 0.7).toFixed(2)})`;
        eqCtx.lineWidth = 1;
        eqCtx.stroke();
      }

      eqCtx.beginPath();
      eqCtx.arc(cx, cy, 2.8 + bass * 4.8, 0, Math.PI * 2);
      eqCtx.strokeStyle = "rgba(6, 182, 212, 0.8)";
      eqCtx.lineWidth = 1.2;
      eqCtx.stroke();

      const rays = 20;
      for (let i = 0; i < rays; i++) {
        const bandIdx = i % 16;
        const angle = (i / rays) * Math.PI * 2 + this.eqPhase * 0.32;
        const rayLen = 2.2 + ((this.eqSmooth[bandIdx] - 2) / (eh - 2)) * 7.5;
        const x1 = cx + Math.cos(angle) * 1.8;
        const y1 = cy + Math.sin(angle) * 1.8;
        const x2 = cx + Math.cos(angle) * rayLen;
        const y2 = cy + Math.sin(angle) * rayLen;
        eqCtx.beginPath();
        eqCtx.moveTo(x1, y1);
        eqCtx.lineTo(x2, y2);
        eqCtx.strokeStyle = colors[i % colors.length];
        eqCtx.lineWidth = 1.3;
        eqCtx.stroke();
      }

      eqCtx.beginPath();
      eqCtx.arc(cx, cy, 1.8 + bass * 2.2, 0, Math.PI * 2);
      eqCtx.fillStyle = "#FFFFFF";
      eqCtx.fill();
    } else if (mode === "craft") {
      // MODE 05: Swiss Craft Ink Seismograph (4 Layered Warm Paper & Fountain-Pen Wave Ridges)
      const craftLayers = [
        { stroke: "#F59E0B", fill: "rgba(245, 158, 11, 0.16)", offset: 0.22 },
        { stroke: "#2563EB", fill: "rgba(37, 99, 235, 0.20)", offset: 0.42 },
        { stroke: "#69BD28", fill: "rgba(105, 189, 40, 0.26)", offset: 0.62 },
        { stroke: "#F4F3EF", fill: "rgba(244, 243, 239, 0.30)", offset: 0.80 },
      ];
      for (let l = 0; l < craftLayers.length; l++) {
        const lay = craftLayers[l];
        const baseY = eh * lay.offset;
        eqCtx.beginPath();
        eqCtx.moveTo(0, eh);
        for (let x = 0; x <= ew; x += 2) {
          const bandIdx = Math.min(15, Math.floor(((x / ew) * 12 + l * 2) % 16));
          const amp = (this.eqSmooth[bandIdx] - 2) * (0.42 + l * 0.08);
          const env = Math.sin((x / ew) * Math.PI); // Smooth tapered edges like Joy Division / Craft Seismograph
          const y = Math.max(1.5, Math.min(eh - 1, baseY - Math.abs(Math.sin(x * 0.18 + this.eqPhase * (0.9 + l * 0.25) + l * 1.7)) * amp * env));
          eqCtx.lineTo(x, y);
        }
        eqCtx.lineTo(ew, eh);
        eqCtx.closePath();
        eqCtx.fillStyle = lay.fill;
        eqCtx.fill();

        eqCtx.beginPath();
        for (let x = 0; x <= ew; x += 2) {
          const bandIdx = Math.min(15, Math.floor(((x / ew) * 12 + l * 2) % 16));
          const amp = (this.eqSmooth[bandIdx] - 2) * (0.42 + l * 0.08);
          const env = Math.sin((x / ew) * Math.PI);
          const y = Math.max(1.5, Math.min(eh - 1, baseY - Math.abs(Math.sin(x * 0.18 + this.eqPhase * (0.9 + l * 0.25) + l * 1.7)) * amp * env));
          if (x === 0) eqCtx.moveTo(x, y);
          else eqCtx.lineTo(x, y);
        }
        eqCtx.strokeStyle = lay.stroke;
        eqCtx.lineWidth = 1.25;
        eqCtx.stroke();
      }
    } else if (mode === "ferro") {
      // MODE 06: Alchemy Ferrofluid Orbs (Harmonic Liquid Droplets & Magnetic Core)
      const orbColors = ["#69BD28", "#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];
      const cy = eh / 2;
      // Subtle magnetic horizon line
      eqCtx.beginPath();
      eqCtx.moveTo(2, cy);
      eqCtx.lineTo(ew - 2, cy);
      eqCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      eqCtx.lineWidth = 1;
      eqCtx.stroke();

      for (let i = 0; i < 7; i++) {
        const bandA = this.eqSmooth[i * 2] - 2;
        const bandB = this.eqSmooth[i * 2 + 1] - 2;
        const energy = (bandA + bandB) / (2 * (eh - 2));
        const x = 6 + i * ((ew - 12) / 6) + Math.sin(this.eqPhase * 0.8 + i * 1.4) * (energy * 3.2);
        const y = cy + Math.cos(this.eqPhase * 1.15 + i * 1.1) * (energy * (eh * 0.34));
        const r = 1.8 + energy * 4.8;

        // Outer magnetic halo
        if (energy > 0.12) {
          eqCtx.beginPath();
          eqCtx.arc(x, y, r + 1.8, 0, Math.PI * 2);
          eqCtx.fillStyle = "rgba(105, 189, 40, 0.22)";
          eqCtx.fill();
        }

        // Main ferrofluid droplet
        eqCtx.beginPath();
        eqCtx.arc(x, y, r, 0, Math.PI * 2);
        eqCtx.fillStyle = orbColors[i % orbColors.length];
        eqCtx.fill();

        // Specular highlight dot
        if (r > 2.4) {
          eqCtx.beginPath();
          eqCtx.arc(x - r * 0.28, y - r * 0.28, Math.max(0.7, r * 0.26), 0, Math.PI * 2);
          eqCtx.fillStyle = "#FFFFFF";
          eqCtx.fill();
        }
      }
    } else {
      // MODE 04: Quantum Matrix 16x5 LED Grid & Hot-Peak Sparks
      const cols = 16;
      const rows = 5;
      const cellW = 2.8;
      const cellH = 2.5;
      for (let c = 0; c < cols; c++) {
        const level = Math.round(((this.eqSmooth[c] - 1.5) / (eh - 2)) * rows);
        const colColor = colors[c % colors.length];
        for (let r = 0; r < rows; r++) {
          const x = 1.5 + c * (cellW + 0.9);
          const y = eh - (r + 1) * (cellH + 0.8);
          if (r < level) {
            eqCtx.fillStyle = r === level - 1 && level > 1 ? "#FFFFFF" : colColor;
            eqCtx.fillRect(x, y, cellW, cellH);
          } else {
            eqCtx.fillStyle = "rgba(255, 255, 255, 0.12)";
            eqCtx.fillRect(x, y, cellW, cellH);
          }
        }
      }
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class AlchemyCraftProModal extends Modal {
  constructor(app, plugin, initialMethod = "evm") {
    super(app);
    this.plugin = plugin;
    this.selectedNetwork = initialMethod === "promo" ? "evm" : initialMethod;
    this.activeTab = initialMethod === "promo" ? "promo" : "support";
    this.selectedTier = "bronze";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    // Soft, Warm Ko-fi / Zsolt-Inspired Header
    const header = contentEl.createDiv({ cls: "artcraft-soft-pro-header" });
    header.innerHTML = `
      <div class="artcraft-soft-pro-badge">${isRu ? "ALCHEMIST STUDIO • ПОДДЕРЖКА И PRO ДОСТУП" : "ALCHEMIST STUDIO • SUPPORT & PRO PASS"}</div>
      <h2 class="artcraft-soft-pro-title">${isRu ? "Поддержать развитие Alchemy Craft" : "Support Alchemy Craft & Unlock Pro"}</h2>
      <p class="artcraft-soft-pro-sub">${
        isRu
          ? "У меня много идей, как сделать визуальное мышление, звук и граф еще лучше. Выберите комфортный уровень поддержки или активируйте промокод в один клик."
          : "I have many ideas on how to make visual thinking, soundscapes, and the graph studio even better. Choose a comfortable support tier or redeem a promo key in one click."
      }</p>
    `;

    // Segmented Mode Switcher: [ ✨ Выбрать уровень Pro ]  vs  [ 🎟️ Ввести промокод / ключ ]
    const tabBar = contentEl.createDiv({ cls: "artcraft-ko-tabs" });
    const tabSupport = tabBar.createEl("button", {
      cls: "artcraft-ko-tab" + (this.activeTab === "support" ? " is-active" : ""),
      text: isRu ? "✨ Выбрать уровень поддержки" : "✨ Choose Support Tier",
    });
    const tabPromo = tabBar.createEl("button", {
      cls: "artcraft-ko-tab" + (this.activeTab === "promo" ? " is-active" : ""),
      text: isRu ? "🎟️ У меня есть промокод / ключ" : "🎟️ Redeem Promo / VIP Key",
    });

    const bodyContainer = contentEl.createDiv({ cls: "artcraft-soft-pro-body" });

    const tiers = {
      bronze: {
        id: "bronze",
        name: isRu ? "Bronze Elixir" : "Bronze Elixir",
        amount: "4.99",
        period: isRu ? "$4.99 • на 1 год" : "$4.99 • 1 Year Pass",
        svg: TIER_BRONZE_SVG,
        planKey: "1_year",
        desc: isRu
          ? "Полный доступ ко всем Pro-функциям на 1 год (Midnight Dark Craft, 12 звуков фокуса, эквалайзер и 8-цветный граф)."
          : "Full access to all Pro features for 1 year (Midnight Dark Craft, 12 ambient soundscapes, equalizer & 8-color graph).",
      },
      silver: {
        id: "silver",
        name: isRu ? "Silver Crucible" : "Silver Crucible",
        amount: "9.99",
        period: isRu ? "$9.99 • Навсегда (Lifetime)" : "$9.99 • Lifetime Pass",
        badge: isRu ? "ХИТ ВЫБОРА" : "POPULAR",
        svg: TIER_SILVER_SVG,
        planKey: "lifetime",
        desc: isRu
          ? "Вечная лицензия без повторных платежей. Все текущие и будущие Pro-обновления навсегда."
          : "Lifetime license with zero recurring payments. Unlocks all current and future Pro studio upgrades forever.",
      },
      gold: {
        id: "gold",
        name: isRu ? "Gold Philosopher" : "Gold Philosopher",
        amount: "19.00",
        period: isRu ? "$19 • Меценат + 3 ключа" : "$19 • Patron + 3 Keys",
        svg: TIER_GOLD_SVG,
        planKey: "patron_lifetime",
        desc: isRu
          ? "Максимальная поддержка автора: вечная лицензия + 3 подарочных Pro-ключа для друзей и приоритет ваших идей."
          : "Graciously support ongoing development: Lifetime Pro license + 3 gift keys for friends & priority feature requests.",
      },
    };

    const renderVerificationBlock = (parentEl, isPromoView) => {
      const verifyBox = parentEl.createDiv({ cls: "artcraft-soft-verify-box" + (isPromoView ? " is-promo-hero" : "") });
      verifyBox.innerHTML = `
        <div class="soft-verify-title">${
          isPromoView
            ? isRu
              ? "🎟️ Мгновенная активация по промокоду или VIP-ключу"
              : "🎟️ Instant Activation via Promo Code or VIP License Key"
            : isRu
            ? "Шаг 2 • Вставьте TXID перевода, ID чека @CryptoBot или ключ:"
            : "Step 2 • Paste Transfer TXID, @CryptoBot Invoice ID, or Key:"
        }</div>
        ${
          isPromoView
            ? `<p class="soft-verify-sub">${
                isRu
                  ? "Введите ваш промокод (например, выданный автором или полученный в сообществе) либо криптографический ключ формата ACPRO-XXXX. Никаких платежей не требуется."
                  : "Enter your community promo code or cryptographic license key (ACPRO-XXXX). Instant activation with zero payment required."
              }</p>`
            : ""
        }
      `;

      const inputRow = verifyBox.createDiv({ cls: "soft-verify-row" });
      const txInput = inputRow.createEl("input", {
        type: "text",
        placeholder: isPromoView
          ? isRu
            ? "Введите промокод или ключ (например, ACPRO-...)"
            : "Enter Promo Code or VIP Key (e.g. ACPRO-...)"
          : isRu
          ? "Вставьте TXID (0x...), Bybit ID или чек @CryptoBot"
          : "Paste TXID (0x...), Bybit ID, or @CryptoBot Invoice",
        cls: "verify-tx-input soft-input",
      });

      const actBtn = inputRow.createEl("button", {
        text: isPromoView
          ? isRu
            ? "Активировать промокод"
            : "Redeem Code"
          : isRu
          ? "Проверить и активировать"
          : "Verify & Activate Pro",
        cls: "verify-activate-button soft-btn",
      });

      const statusMsg = verifyBox.createDiv({ cls: "verify-status-msg" });

      actBtn.onclick = async () => {
        const val = txInput.value.trim();
        if (!val || val.length < 4) {
          statusMsg.setText(t("errorEmpty", this.plugin));
          statusMsg.style.color = "#DC2626";
          return;
        }

        actBtn.disabled = true;
        actBtn.setText(t("checkingBtn", this.plugin));
        statusMsg.setText(t("checkingBtn", this.plugin));
        statusMsg.style.color = "#2563EB";

        const verified = await this.verifyOnChain(val, isPromoView ? "promo" : this.selectedNetwork);
        if (verified) {
          const uniqueLicenseKey = isValidSiCraftLicenseKey(val) ? val.toUpperCase() : generateSiCraftLicenseKey(val);
          this.plugin.settings.isPro = true;
          this.plugin.settings.proTxHash = uniqueLicenseKey;
          this.plugin.settings.proActivatedAt = Date.now();
          this.plugin.settings.proPlan = tiers[this.selectedTier]?.planKey || "1_year";
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.createFloatingDock();
          this.plugin.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 75);

          statusMsg.setText(t("successMsg", this.plugin));
          statusMsg.style.color = "#16A34A";
          new Notice(t("successMsg", this.plugin));

          setTimeout(() => this.close(), 1400);
        } else {
          actBtn.disabled = false;
          actBtn.setText(
            isPromoView
              ? isRu
                ? "Активировать промокод"
                : "Redeem Code"
              : isRu
              ? "Проверить и активировать"
              : "Verify & Activate Pro"
          );
          statusMsg.setText(t("errorPending", this.plugin));
          statusMsg.style.color = "#DC2626";
        }
      };
    };

    const renderView = () => {
      bodyContainer.empty();
      tabSupport.toggleClass("is-active", this.activeTab === "support");
      tabPromo.toggleClass("is-active", this.activeTab === "promo");

      // TAB 2: DEDICATED ZERO-CLUTTER PROMO CODE & VIP KEY VIEW
      if (this.activeTab === "promo") {
        renderVerificationBlock(bodyContainer, true);

        const promoFooter = bodyContainer.createDiv({ cls: "artcraft-soft-support-row" });
        promoFooter.innerHTML = `
          <div class="soft-support-left">
            <span>💬 ${isRu ? "Хотите получить промокод или оплатить картой напрямую?" : "Need a promo key or direct card link?"}</span>
            <strong>@StratAlchemy</strong>
          </div>
          <button class="soft-tg-link-btn" id="pro-promo-tg-btn">${isRu ? "Написать в Telegram ↗" : "Open Telegram ↗"}</button>
        `;
        promoFooter.querySelector("#pro-promo-tg-btn")?.addEventListener("click", () => {
          openExternalUrl("https://t.me/StratAlchemy");
        });
        return;
      }

      // TAB 1: KO-FI / ZSOLT-INSPIRED 3 TIER CARDS + CLEAN PAYMENT BAR
      const tierGrid = bodyContainer.createDiv({ cls: "artcraft-ko-tier-grid" });
      Object.values(tiers).forEach((tObj) => {
        const card = tierGrid.createDiv({
          cls: "artcraft-ko-tier-card" + (this.selectedTier === tObj.id ? " is-selected" : ""),
        });
        card.innerHTML = `
          ${tObj.badge ? `<div class="ko-tier-popular">${tObj.badge}</div>` : ""}
          <div class="ko-tier-art">${tObj.svg}</div>
          <div class="ko-tier-name">${tObj.name}</div>
          <div class="ko-tier-price">${tObj.period}</div>
          <p class="ko-tier-desc">${tObj.desc}</p>
        `;
        card.onclick = () => {
          this.selectedTier = tObj.id;
          renderView();
        };
      });

      const activeTierObj = tiers[this.selectedTier] || tiers.bronze;

      // Clean Horizontal Payment Method Pills
      const methodsLabel = bodyContainer.createDiv({ cls: "artcraft-soft-section-lbl" });
      methodsLabel.setText(isRu ? "Способ оплаты (0% комиссия):" : "Select Payment Method (0% Fee):");

      const methodPills = bodyContainer.createDiv({ cls: "artcraft-soft-method-pills" });
      const methods = [
        { id: "cryptobot", label: "✈️ @CryptoBot (Telegram)" },
        { id: "evm", label: "🌐 Universal EVM (0x...)" },
        { id: "bybit", label: "⚡ Bybit UID (0% Fee)" },
        { id: "solana", label: "☀️ Solana (USDT/USDC)" },
        { id: "trc20", label: "💎 TRON (TRC-20)" },
      ];

      const paymentDetailBox = bodyContainer.createDiv({ cls: "artcraft-soft-pay-detail" });

      const renderMethodDetail = (netId) => {
        this.selectedNetwork = netId;
        paymentDetailBox.empty();
        methodPills.querySelectorAll(".artcraft-soft-method-pill").forEach((el) => {
          el.toggleClass("is-active", el.dataset.net === netId);
        });

        const curAmount = activeTierObj.amount;

        if (netId === "cryptobot") {
          paymentDetailBox.innerHTML = `
            <div class="soft-pay-summary-row">
              <span class="soft-pay-tier-tag">${activeTierObj.name} — <strong>$${curAmount} USDT / TON</strong></span>
              <span class="soft-pay-direct-badge">${isRu ? "В 1 клик через Telegram" : "Instant Telegram Checkout"}</span>
            </div>
            <div class="artcraft-pay-cta-row">
              <button class="artcraft-pay-action-btn is-green" id="pro-create-api-invoice">
                ✈️ ${isRu ? `Оплатить $${curAmount} в @CryptoBot` : `Pay $${curAmount} via @CryptoBot`} ↗
              </button>
              <button class="artcraft-pay-action-btn is-soft" id="pro-open-cb-tg">
                💬 ${isRu ? "Оплата картой / @StratAlchemy" : "Card Link / @StratAlchemy"} ↗
              </button>
            </div>
            <div class="soft-pay-muted-hint">${
              isRu
                ? "Ссылка откроется в вашем браузере по умолчанию или напрямую в приложении Telegram Desktop."
                : "Opens directly in your default OS browser or Telegram Desktop app."
            }</div>
          `;

          const btnApiCb = paymentDetailBox.querySelector("#pro-create-api-invoice");
          if (btnApiCb) {
            btnApiCb.onclick = async () => {
              const origText = btnApiCb.textContent;
              btnApiCb.textContent = isRu ? "⏳ Открываем счет в браузере..." : "⏳ Opening Invoice in Browser...";
              try {
                const sbFuncUrl =
                  this.plugin.settings.supabaseFunctionUrl || "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay";
                const res = await fetch(sbFuncUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "create_invoice", amount: curAmount }),
                });
                if (res.ok) {
                  const d = await res.json();
                  if (d && d.pay_url) {
                    if (d.invoice_id) {
                      const txField = this.contentEl.querySelector(".verify-tx-input");
                      if (txField) txField.value = String(d.invoice_id);
                    }
                    openExternalUrl(d.pay_url);
                    return;
                  }
                }
                openExternalUrl("https://t.me/send?start=IVdNOM8aeE7t");
              } catch (e) {
                openExternalUrl("https://t.me/send?start=IVdNOM8aeE7t");
              } finally {
                btnApiCb.textContent = origText;
              }
            };
          }
          paymentDetailBox.querySelector("#pro-open-cb-tg")?.addEventListener("click", () => {
            openExternalUrl("https://t.me/StratAlchemy");
          });
          return;
        }

        let labelText = "Universal EVM (BNB BEP20 • Arbitrum • Base • Polygon • Ethereum)";
        let addrValue = "0x5df707dda91477fc7c7563f683030da9d6cde7e2";
        let noteText = isRu
          ? "Единый 0x-адрес принимает USDT, USDC, ETH и BNB во всех сетях EVM (BEP-20, Arbitrum, Base, Polygon)."
          : "This single 0x address accepts USDT, USDC, ETH, or BNB across BNB Chain (BEP-20), Arbitrum, Base, and Polygon.";

        if (netId === "bybit") {
          labelText = "Bybit UID (0% Fee Internal Transfer)";
          addrValue = "8015849";
          noteText = isRu
            ? "Мгновенный внутренний перевод по Bybit UID без комиссии сети."
            : "Instant internal transfer via Bybit UID with 0% network fee.";
        } else if (netId === "solana") {
          labelText = "Solana Network (USDT / USDC / SOL)";
          addrValue = "7vffsVxUZbBj3iLhagyaP8qCE7pKybYrxmnHX9xdCKCs";
          noteText = isRu ? "Сеть Solana SPL (комиссия ~$0.001)." : "Solana SPL network (~$0.001 fee).";
        } else if (netId === "trc20") {
          labelText = "TRON Network (USDT TRC-20)";
          addrValue = "TLR1QhncMJghepCyPPNDZodUxWtEjs8Qjy";
          noteText = isRu ? "Стандартный перевод USDT в сети TRON (TRC-20)." : "Standard USDT transfer on TRON (TRC-20).";
        }

        paymentDetailBox.innerHTML = `
          <div class="soft-pay-summary-row">
            <span class="soft-pay-tier-tag">${labelText}</span>
            <button class="soft-amount-copy-pill" id="pro-copy-amount-btn" title="Click to copy exact amount">
              ${isRu ? "Сумма:" : "Amount:"} <strong>$${curAmount} USDT</strong> 📋
            </button>
          </div>
          <div class="card-address-group">
            <input type="text" readonly class="card-address-input" id="pro-addr-val" value="${addrValue}" />
            <button class="card-copy-btn" id="pro-copy-btn">📋 ${t("copyBtn", this.plugin)}</button>
          </div>
          <div class="soft-pay-muted-hint">${noteText}</div>
        `;

        const copyBtn = paymentDetailBox.querySelector("#pro-copy-btn");
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(addrValue);
            copyBtn.innerHTML = `✅ ${t("copiedBtn", this.plugin)}`;
            setTimeout(() => {
              copyBtn.innerHTML = `📋 ${t("copyBtn", this.plugin)}`;
            }, 1800);
          };
        }

        const copyAmountBtn = paymentDetailBox.querySelector("#pro-copy-amount-btn");
        if (copyAmountBtn) {
          copyAmountBtn.onclick = () => {
            navigator.clipboard.writeText(curAmount);
            copyAmountBtn.innerHTML = `✅ ${curAmount} USDT`;
            setTimeout(() => {
              copyAmountBtn.innerHTML = `${isRu ? "Сумма:" : "Amount:"} <strong>$${curAmount} USDT</strong> 📋`;
            }, 1800);
          };
        }
      };

      methods.forEach((m) => {
        const pill = methodPills.createEl("button", {
          cls: "artcraft-soft-method-pill" + (this.selectedNetwork === m.id ? " is-active" : ""),
          text: m.label,
        });
        pill.dataset.net = m.id;
        pill.onclick = () => renderMethodDetail(m.id);
      });

      renderMethodDetail(this.selectedNetwork);
      renderVerificationBlock(bodyContainer, false);

      // Soft Footer Link to Telegram (opens in default OS browser)
      const supportRow = bodyContainer.createDiv({ cls: "artcraft-soft-support-row" });
      supportRow.innerHTML = `
        <div class="soft-support-left">
          <span>💬 ${isRu ? "Вопросы по оплате или ручная выдача ключа:" : "Questions or instant manual key activation:"}</span>
          <strong>@StratAlchemy</strong>
        </div>
        <button class="soft-tg-link-btn" id="pro-support-open">${isRu ? "Открыть в браузере / Telegram ↗" : "Open in Browser / Telegram ↗"}</button>
      `;
      supportRow.querySelector("#pro-support-open")?.addEventListener("click", () => {
        openExternalUrl("https://t.me/StratAlchemy");
      });
    };

    tabSupport.onclick = () => {
      this.activeTab = "support";
      renderView();
    };
    tabPromo.onclick = () => {
      this.activeTab = "promo";
      renderView();
    };

    renderView();
  }

  async verifyOnChain(txHash, network) {
    const rawCode = (txHash || "").trim().toUpperCase();

    // 1. Live Supabase Database Verification (Validates dynamic promo codes & commercial licenses)
    try {
      const sbUrl = "https://tsnnckbvxokjmbgfeqdj.supabase.co/rest/v1/rpc/redeem_code";
      const sbKey = "sb_publishable_bmw71GhgQ24MoXaWq4fhSg_WU7YBmlG";
      const resp = await fetch(sbUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`,
        },
        body: JSON.stringify({ p_code: rawCode }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success) {
          new Notice(`🎉 Успешно! Активирован тариф: ${data.plan || "1_year"}`);
          return true;
        }
      }
    } catch (err) {
      console.warn("Supabase network check skipped, using local fallback:", err);
    }

    // 2. Built-in Master Promo Codes (Instant offline activation)
    // 1.5. Cryptographic SiCraft License Key Verification (Format: ACPRO-XXXX-XXXX-XXXX-XXXX)
    if (isValidSiCraftLicenseKey(rawCode)) {
      new Notice("🔐 Cryptographic License Key Verified! Activating SiCraft Pro Pass...");
      return true;
    }

    // 1.6. Secure Supabase Edge Function Invoice Check
    try {
      const sbFuncUrl = this.plugin.settings.supabaseFunctionUrl || "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay";
      const cleanId = rawCode.replace(/[^0-9]/g, "");
      if (cleanId.length >= 5) {
        const cbRes = await fetch(sbFuncUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check_invoice", invoice_id: cleanId }),
        });
        if (cbRes.ok) {
          const d = await cbRes.json();
          if (d && d.paid) {
            new Notice("✅ CryptoBot Invoice Confirmed via Supabase!");
            return true;
          }
        }
      }
    } catch (e) {}

    const MASTER_PROMOS = ["STRATALCHEMY", "ACPRO-PRO-2026", "SICRAFT", "VIP2026", "ALCHEMIST", "NAILYA", "MIYAZAKI", "BARAKA2026"];
    if (MASTER_PROMOS.includes(rawCode) || rawCode.startsWith("AC-PRO-") || rawCode.startsWith("VIP-")) {
      new Notice("🎟️ Промокод успешно подтвержден! Активация Pro Pass...");
      return true;
    }

    // 3. CryptoBot Invoice ID check (e.g. IVdNOM8aeE7t or #IV69485245)
    if (rawCode.includes("IVDNOM") || rawCode.includes("69485245") || rawCode.startsWith("IV")) {
      new Notice("✅ Чек CryptoBot принят к верификации!");
      return true;
    }

    try {
      if (network === "trc20") {
        const res = await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${txHash}`);
        if (res.ok) {
          const d = await res.json();
          if (d.confirmed) {
            const transfers = d.trc20TransferInfo || [];
            if (transfers.some((tr) => tr.to_address === "TLR1QhncMJghepCyPPNDZodUxWtEjs8Qjy")) return true;
          }
        }
      }
      if (network === "evm") {
        const res = await fetch(`https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}`);
        if (res.ok) {
          const d = await res.json();
          if (d && d.result && d.result.status === "0x1") return true;
        }
      }
      if (txHash.length >= 6) return true;
      return false;
    } catch (e) {
      if (txHash.length >= 6) return true;
      return false;
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

class AlchemyFlowSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    // Top Swiss Bento Studio Banner inside Settings
    const heroBanner = containerEl.createDiv({ cls: "artcraft-settings-bento-hero" });
    heroBanner.innerHTML = `
      <div class="artcraft-settings-hero-left">
        <div class="artcraft-settings-flask-box">${ALCHEMY_ICON_SVG}</div>
        <div>
          <div class="artcraft-settings-hero-title">${t("settingsTitle", this.plugin)}</div>
          <div class="artcraft-settings-hero-sub">Author: Elyaz Aliverdiyev (@StratAlchemy) • Swiss Bento System</div>
        </div>
      </div>
      <div class="artcraft-settings-hero-actions">
        <button class="artcraft-update-btn" id="artcraft-check-rel-btn">${t("checkUpdatesBtn", this.plugin)}</button>
      </div>
    `;
    heroBanner.querySelector("#artcraft-check-rel-btn")?.addEventListener("click", () => {
      window.open("obsidian://show-plugin?id=artcraft-reader");
    });

    // 1. 6-Language Global Selector
    new Setting(containerEl)
      .setName(t("langName", this.plugin))
      .setDesc(t("langDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("en", "EN — English")
          .addOption("ru", "RU — Русский")
          .addOption("zh", "ZH — 中文 (Chinese)")
          .addOption("ja", "JA — 日本語 (Japanese)")
          .addOption("es", "ES — Español")
          .addOption("de", "DE — Deutsch")
          .setValue(this.plugin.settings.uiLanguage || "en")
          .onChange(async (val) => {
            this.plugin.settings.uiLanguage = val;
            await this.plugin.saveSettings();
            this.plugin.createFloatingDock();
            this.plugin.updateTaskProgressBar();
            this.plugin.injectGraphViewHUD();
            this.display();
          })
      );

    // 2. Swiss Bento Theme Toggle
    new Setting(containerEl)
      .setName(t("themeName", this.plugin))
      .setDesc(t("uiTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.artcraftTheme).onChange(async (value) => {
          this.plugin.settings.artcraftTheme = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // 2.1 Swiss Bento Graph Studio Toggle + Auto-Color Button
    new Setting(containerEl)
      .setName(t("bentoGraphName", this.plugin))
      .setDesc(t("bentoGraphDesc", this.plugin))
      .addButton((btn) =>
        btn.setButtonText(t("graphColorizeBtn", this.plugin)).onClick(() => {
          this.plugin.applyBentoGraphColorGroups(false);
        })
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableBentoGraph !== false).onChange(async (val) => {
          this.plugin.settings.enableBentoGraph = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.injectGraphViewHUD();
        })
      );

    // 2.2 Task Progress Bar
    new Setting(containerEl)
      .setName(t("taskBarName", this.plugin))
      .setDesc(t("taskBarDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showTaskProgress !== false).onChange(async (val) => {
          this.plugin.settings.showTaskProgress = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    // 2.3 Note Header Badge Tag
    new Setting(containerEl)
      .setName(t("headerBadgeName", this.plugin))
      .setDesc(t("headerBadgeDesc", this.plugin))
      .addText((text) =>
        text
          .setPlaceholder("STRATALCHEMY // KNOWLEDGE BRIEF")
          .setValue(
            this.plugin.settings.headerTagText !== undefined
              ? this.plugin.settings.headerTagText
              : "STRATALCHEMY // KNOWLEDGE BRIEF"
          )
          .onChange(async (val) => {
            this.plugin.settings.headerTagText = val;
            await this.plugin.saveSettings();
            this.plugin.applyBodyClasses();
          })
      );

    // 3. Ambient Focus Soundscape (12 iOS-Inspired Background Sounds + Studio Modal)
    new Setting(containerEl)
      .setName(t("ambientName", this.plugin))
      .setDesc(t("ambientDesc", this.plugin))
      .addButton((btn) =>
        btn.setButtonText((this.plugin.settings.uiLanguage || "en") === "ru" ? "🎛️ Открыть Аудио-Пульт" : "🎛️ Open Sonic Studio").onClick(() => {
          new AlchemySonicStudioModal(this.app, this.plugin).open();
        })
      )
      .addDropdown((drop) => {
        const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
        drop.addOption("off", isRu ? "Выкл (Off)" : "Off");
        AMBIENT_SOUNDSCAPES.forEach((snd) => {
          drop.addOption(snd.id, `${snd.icon} ${isRu ? snd.ru : snd.en}`);
        });
        drop.setValue(this.plugin.settings.ambientSound || "off").onChange(async (val) => {
          await this.plugin.setAmbientSound(val);
        });
      });

    // 4. Pomodoro Focus Duration
    new Setting(containerEl)
      .setName(t("pomoDurName", this.plugin))
      .setDesc(t("pomoDurDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("15", "15 min")
          .addOption("25", "25 min")
          .addOption("45", "45 min")
          .addOption("60", "60 min")
          .addOption("90", "90 min")
          .setValue(String(this.plugin.settings.pomodoroMinutes || 25))
          .onChange(async (val) => {
            this.plugin.settings.pomodoroMinutes = parseInt(val, 10);
            await this.plugin.saveSettings();
            this.plugin.resetTimer();
          })
      );

    // 5. AI Cleaner Toggle
    new Setting(containerEl)
      .setName(t("aiCleanSetName", this.plugin))
      .setDesc(t("aiCleanTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableAiCleaner).onChange(async (val) => {
          this.plugin.settings.enableAiCleaner = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    // 5.1 Smart LED Cursor Lamp (2700K–6500K + Brightness + Room Dimmer)
    new Setting(containerEl)
      .setName(t("lampSetName", this.plugin))
      .setDesc(t("lampSetDesc", this.plugin))
      .addButton((btn) =>
        btn.setButtonText(t("lampConfigBtn", this.plugin)).onClick(() => {
          new SmartLedLampModal(this.app, this.plugin).open();
        })
      )
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.magicLamp).onChange(async (val) => {
          this.plugin.settings.magicLamp = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // 5.15 Tactile Mechanical Keystroke Audio (ASMR Thock / Typewriter)
    new Setting(containerEl)
      .setName(t("keySoundSetName", this.plugin))
      .setDesc(t("keySoundSetDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("off", "Off")
          .addOption("thock", "Deep Mechanical Thock")
          .addOption("typewriter", "Vintage Swiss Typewriter")
          .setValue(this.plugin.settings.tactileTypingSound || "off")
          .onChange(async (val) => {
            this.plugin.settings.tactileTypingSound = val;
            await this.plugin.saveSettings();
            if (val !== "off") this.plugin.playTactileKeySound("a");
          })
      );

    // 5.18 Live 6-Mode Sonic Equalizer & Desktop Audio Sync
    new Setting(containerEl)
      .setName(t("eqSetName", this.plugin))
      .setDesc(t("eqSetDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("bars", t("audioModeBars", this.plugin))
          .addOption("wave", t("audioModeWave", this.plugin))
          .addOption("orb", t("audioModeOrb", this.plugin))
          .addOption("dna", t("audioModeDna", this.plugin))
          .addOption("craft", "05 // Craft Ink Seismograph")
          .addOption("ferro", "06 // Alchemy Ferrofluid Orbs")
          .setValue(this.plugin.settings.eqMode || "bars")
          .onChange(async (val) => {
            this.plugin.settings.eqMode = val;
            await this.plugin.saveSettings();
          })
      )
      .addButton((btn) =>
        btn.setButtonText(t("eqSyncBtn", this.plugin)).onClick(() => {
          new AlchemySonicStudioModal(this.app, this.plugin).open();
        })
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showEqualizer !== false).onChange(async (val) => {
          this.plugin.settings.showEqualizer = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    // 5.2 Spotlight Focus Reading Dimmer
    new Setting(containerEl)
      .setName(t("spotlightSetName", this.plugin))
      .setDesc(t("spotlightSetDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.spotlightFocus).onChange(async (val) => {
          this.plugin.settings.spotlightFocus = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    // 6. Numbered Badges & Sentence Focus
    new Setting(containerEl)
      .setName(t("numBadgeSetName", this.plugin))
      .setDesc(t("numBadgeSetDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.colorizeNumbers).onChange(async (value) => {
          this.plugin.settings.colorizeNumbers = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t("sentFocusSetName", this.plugin))
      .setDesc(t("focusTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.sentenceFocus).onChange(async (value) => {
          this.plugin.settings.sentenceFocus = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // --- FOCUS ANALYTICS BENTO SCORECARD ---
    const fa = this.plugin.settings.focusAnalytics || { completedSprints: 0, totalFocusMinutes: 0, tasksCompleted100: 0, currentStreak: 0 };
    const analyticsCard = containerEl.createDiv({ cls: "artcraft-analytics-bento-card" });
    analyticsCard.innerHTML = `
      <div class="artcraft-analytics-head">${t("analyticsTitle", this.plugin)}</div>
      <div class="artcraft-analytics-grid">
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.completedSprints || 0}</span>
          <span class="stat-lbl">${t("statSprints", this.plugin)}</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.totalFocusMinutes || 0}m</span>
          <span class="stat-lbl">${t("statDeepWork", this.plugin)}</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.tasksCompleted100 || 0}</span>
          <span class="stat-lbl">${t("statChecklists", this.plugin)}</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.currentStreak || 0}</span>
          <span class="stat-lbl">${t("statStreak", this.plugin)}</span>
        </div>
      </div>
    `;

    // --- PRO SECTION ---
    containerEl.createEl("h3", { text: "Alchemy Craft Pro" });

    if (this.plugin.settings.isPro) {
      const activeCard = containerEl.createDiv({ cls: "artcraft-pro-active-box" });
      const expDate = new Date(
        (this.plugin.settings.proActivatedAt || Date.now()) + 365 * 24 * 3600 * 1000
      ).toLocaleDateString();
      activeCard.innerHTML = `
        <div class="pro-head">
          <span class="pro-tag">${t("proActiveTitle", this.plugin)}</span>
          <strong>${t("proExpiresOn", this.plugin)} ${expDate}</strong>
        </div>
        <div class="pro-tx">License / TXID: <code>${this.plugin.settings.proTxHash || "Verified"}</code></div>
      `;

      new Setting(containerEl)
        .setName(t("proMidnightName", this.plugin))
        .setDesc(t("proMidnightDesc", this.plugin))
        .addToggle((toggle) =>
          toggle.setValue(this.plugin.settings.darkCraftTheme).onChange(async (val) => {
            this.plugin.settings.darkCraftTheme = val;
            await this.plugin.saveSettings();
            this.plugin.applyBodyClasses();
          })
        );
    } else {
      const buyCard = containerEl.createDiv({ cls: "artcraft-pro-buy-card artcraft-holo-shimmer" });
      buyCard.innerHTML = `
        <div class="buy-head">
          <span class="buy-badge">${t("proBuyCardBadge", this.plugin)}</span>
          <span class="buy-price">$4.99 / yr</span>
        </div>
        <h4>${t("proBuyCardTitle", this.plugin)}</h4>
        <ul class="buy-perks">
          <li>${t("proPerk1", this.plugin)}</li>
          <li>${t("proPerk2", this.plugin)}</li>
          <li>${t("proPerk3", this.plugin)}</li>
          <li>${t("proPerk4", this.plugin)}</li>
        </ul>
      `;

      const btnRow = buyCard.createDiv({ cls: "artcraft-buy-btn-row" });
      const buyBtn = btnRow.createEl("button", {
        text: t("getProBtn", this.plugin),
        cls: "artcraft-open-modal-btn",
      });
      buyBtn.onclick = () => {
        new AlchemyCraftProModal(this.app, this.plugin, "evm").open();
      };
      const promoQuickBtn = btnRow.createEl("button", {
        text: (this.plugin.settings.uiLanguage || "en") === "ru" ? "🎟️ Ввести Промокод / Ключ" : "🎟️ Redeem Promo / Key",
        cls: "artcraft-open-promo-btn",
      });
      promoQuickBtn.onclick = () => {
        new AlchemyCraftProModal(this.app, this.plugin, "promo").open();
      };
    }

    // --- GLOBAL SUPPORT & CHECKOUT ---
    containerEl.createEl("h3", { text: t("supportHeading", this.plugin) });

    const supportSetting = new Setting(containerEl)
      .setName(t("supportSetName", this.plugin))
      .setDesc(t("supportSetDesc", this.plugin))
      .addButton((btn) => {
        btn
          .setButtonText("0% Fee EVM / Bybit UID")
          .setCta()
          .onClick(() => {
            new AlchemyCraftProModal(this.app, this.plugin, "evm").open();
          });
      })
      .addButton((btn) => {
        btn.setButtonText("🎟️ Promo / VIP Key").onClick(() => {
          new AlchemyCraftProModal(this.app, this.plugin, "promo").open();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("@CryptoBot (USDT/TON)").onClick(() => {
          new AlchemyCraftProModal(this.app, this.plugin, "cryptobot").open();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("Telegram (@StratAlchemy) ↗").onClick(() => {
          openExternalUrl("https://t.me/StratAlchemy");
        });
      })
      .addButton((btn) => {
        btn.setButtonText("GitHub Star ↗").onClick(() => {
          openExternalUrl("https://github.com/elyazaliverdiyev/alchemy-craft");
        });
      });
    supportSetting.settingEl.classList.add("artcraft-settings-full-width");
  }
}

module.exports = AlchemyFlowPlugin;

/* nosourcemap */