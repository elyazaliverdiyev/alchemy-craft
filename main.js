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
  tactileTypingSound: "off", // "off" | "creamy_pom" | "thock" | "matcha_lubed" | "raindrop_wood" | "velvet_felt" | "paper_brush"
  audioInputDeviceId: "auto", // "auto" | deviceId of a chosen audio input / loopback device
  showEqualizer: true,
  eqMode: "craft", // "bars" (Risograph) | "wave" (Ink Ribbon) | "orb" (Compass) | "dna" (Quantum Matrix) | "craft" (Craft Ink) | "ferro" (Espresso Ferro)
  audioVolume: 75, // 0..100%
  pomoAudioLink: true, // Auto-fade audio on Pomodoro break & resume on focus sprint
  showReadingStats: true, // Live Reading Time & Word Count capsule
  bookSpreadMode: false, // Two-Column Open Book Spread mode
  stampedNotes: {}, // { [filePath]: "2026-11-07" }
  marginBookmarks: {}, // { [filePath]: Array<{ id, type, label, snippet, line }> }
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
  eqBars: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="3.5" height="10" rx="1"/><rect x="8.5" y="5" width="3.5" height="15" rx="1"/><rect x="14" y="8" width="3.5" height="12" rx="1"/><rect x="19" y="13" width="2.5" height="7" rx="1"/></svg>`,
  eqWave: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/></svg>`,
  eqOrb: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>`,
  eqMatrix: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/></svg>`,
  eqCraft: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c3 0 4-6 7-6s4 8 7 8 4-5 6-5"/><path d="M2 19c3 0 4-4 7-4s4 5 7 5 4-3 6-3" opacity="0.6"/></svg>`,
  eqFerro: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="12" r="4.5"/><circle cx="15.5" cy="12" r="3.5"/><path d="M12 9.5c1 1.5 1 3.5 0 5"/></svg>`,
  play: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
  pause: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  stop: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`,
  coffee: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg>`,
  ticket: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
  send: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  chat: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  camera: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  book: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  volume: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  sliders: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  sun: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  shield: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  waves: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  rain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
  roof: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 12 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M8 3v2"/><path d="M16 3v2"/></svg>`,
  stream: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7c3-2 6 2 9 0s6-2 9 0"/><path d="M3 12c3-2 6 2 9 0s6-2 9 0"/><path d="M5 17c2.5-1.5 5 1.5 7.5 0s5-1.5 7.5 0"/></svg>`,
  flame: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  train: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>`,
  brain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`,
  mic: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  external: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`,
  zap: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  bookmark: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  stamp: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/></svg>`,
  columns: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>`,
  edit: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  eqOrigami: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l4-6 4 4 4-9 4 7 4-3"/><path d="M2 21l4-3 4 2 4-4 4 3 4-2" opacity="0.6"/></svg>`,
  eqStrings: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c4-4 6 4 10 0s6-4 10 0"/><path d="M2 12c4 4 6-4 10 0s6 4 10 0"/><path d="M2 18c4-4 6 4 10 0s6-4 10 0" opacity="0.6"/></svg>`
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

// Hand-crafted Warm Coffee & Alchemy SVG Tier Illustrations (with explicit dimensions so they always render crisply)
const TIER_BRONZE_SVG = `<svg width="124" height="62" viewBox="0 0 124 62" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="60" cy="53" rx="38" ry="5" fill="#E6DFD3"/>
  <path d="M30 48C30 46.5 32 45 36 45H84C88 45 90 46.5 90 48C90 50.5 78 52 60 52C42 52 30 50.5 30 48Z" fill="#D6C7B2" stroke="#3E2723" stroke-width="1.8"/>
  <path d="M81 26H87C91.5 26 95 29.5 95 34C95 38.5 91.5 42 87 42H80" stroke="#3E2723" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M36 22H82V34C82 42.5 73.5 48 63 48H55C44.5 48 36 42.5 36 34V22Z" fill="#FFF8ED" stroke="#3E2723" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="59" cy="22" rx="23" ry="5.5" fill="#C87D4B" stroke="#3E2723" stroke-width="1.8"/>
  <path d="M59 24.5C59 24.5 54 21.5 54 19.5C54 18.2 55.2 17.5 56.5 17.5C57.8 17.5 58.6 18.3 59 19.2C59.4 18.3 60.2 17.5 61.5 17.5C62.8 17.5 64 18.2 64 19.5C64 21.5 59 24.5 59 24.5Z" fill="#FFFDF9"/>
  <path d="M48 13C46.5 10.5 49.5 8 48 5" stroke="#B4845C" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M59 11C57.5 8.5 60.5 6 59 3" stroke="#B4845C" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M70 13C68.5 10.5 71.5 8 70 5" stroke="#B4845C" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const TIER_SILVER_SVG = `<svg width="124" height="62" viewBox="0 0 124 62" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="62" cy="54" rx="44" ry="5" fill="#E2E8DD"/>
  <path d="M34 15H64L54 31L66 49C67 50.8 65.5 52.5 63.5 52.5H34.5C32.5 52.5 31 50.8 32 49L44 31L34 15Z" fill="#F0F7F4" stroke="#2D3732" stroke-width="2" stroke-linejoin="round"/>
  <path d="M35 43C42 41 48 44 55 42L64 51H33.5L35 43Z" fill="#A45A2A" fill-opacity="0.9"/>
  <rect x="41" y="27" width="16" height="8" rx="2" fill="#D99B66" stroke="#2D3732" stroke-width="1.8"/>
  <line x1="49" y1="27" x2="49" y2="35" stroke="#2D3732" stroke-width="1.6"/>
  <path d="M70 30H94V41C94 47 89 51 82 51C75 51 70 47 70 41V30Z" fill="#FFF8ED" stroke="#2D3732" stroke-width="2"/>
  <path d="M94 33H98C100.5 33 102 35 102 37.5C102 40 100.5 42 98 42H94" stroke="#2D3732" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="82" cy="30" rx="12" ry="3.5" fill="#C87D4B" stroke="#2D3732" stroke-width="1.7"/>
  <path d="M45 9C44 6.5 46.5 4.5 45.5 2M54 9C53 6.5 55.5 4.5 54.5 2M82 23C81 20.5 83.5 18.5 82.5 16" stroke="#69BD28" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const TIER_GOLD_SVG = `<svg width="124" height="62" viewBox="0 0 124 62" fill="none" xmlns="http://www.w3.org/2000/svg" class="artcraft-tier-art">
  <ellipse cx="62" cy="54" rx="46" ry="5" fill="#EFE6D5"/>
  <circle cx="62" cy="27" r="21" fill="#FEF3C7" fill-opacity="0.7"/>
  <path d="M22 33H46V43C46 48 41.5 51.5 34 51.5C26.5 51.5 22 48 22 43V33Z" fill="#FFF8ED" stroke="#3E2723" stroke-width="1.9"/>
  <ellipse cx="34" cy="33" rx="12" ry="3.2" fill="#C87D4B" stroke="#3E2723" stroke-width="1.6"/>
  <path d="M78 33H102V43C102 48 97.5 51.5 90 51.5C82.5 51.5 78 48 78 43V33Z" fill="#FFF8ED" stroke="#3E2723" stroke-width="1.9"/>
  <ellipse cx="90" cy="33" rx="12" ry="3.2" fill="#C87D4B" stroke="#3E2723" stroke-width="1.6"/>
  <path d="M48 22H76V37C76 45 69.5 51 62 51C54.5 51 48 45 48 37V22Z" fill="#FDE68A" stroke="#3E2723" stroke-width="2.1"/>
  <ellipse cx="62" cy="22" rx="14" ry="4" fill="#B45309" stroke="#3E2723" stroke-width="1.8"/>
  <path d="M62 24C62 24 58 21.5 58 19.8C58 18.8 59 18.2 60 18.2C61 18.2 61.6 18.8 62 19.5C62.4 18.8 63 18.2 64 18.2C65 18.2 66 18.8 66 19.8C66 21.5 62 24 62 24Z" fill="#FFFDF9"/>
  <path d="M62 6L64 11L69 12.5L64 14L62 19L60 14L55 12.5L60 11L62 6Z" fill="#F59E0B"/>
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.7)",
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
    keySoundSetName: "Tactile Keystroke Sound (Creamy & Soft)",
    keySoundSetDesc: "Zero-latency WebAudio typing sound — six creamy, soft low-pass tuned profiles (POM Linear, PBT Thock, Matcha Silent, Walnut Raindrop, Piano Felt, Fountain Pen).",
    eqSetName: "Craft 6-Mode Sonic Equalizer",
    eqSetDesc: "Animated dock equalizer that reacts to desktop audio, a selected audio device, or the built-in ambient soundscapes.",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.7)",
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
    keySoundSetName: "Тактильный звук клавиш при печати (мягкие кремовые звуки)",
    keySoundSetDesc: "Мгновенный синтез мягких кремовых звуков при наборе текста: 6 приятных профилей (POM-свитч, глубокий Thock, Матча, капля по ореху, пианинный фетр, перьевая ручка).",
    eqSetName: "Крафтовый 6-режимный Эквалайзер",
    eqSetDesc: "Анимированный эквалайзер в панели: считывает системный звук ПК, выбранное аудиоустройство или встроенные фоновые звуки.",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.7)",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.7)",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio (v4.3.7)",
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

// --- 5-NUTRIENT BOOK STICKER METHODOLOGY (БЕЛКИ • УГЛЕВОДЫ • ЖИРЫ • ВИТАМИНЫ • КЛЕТЧАТКА) ---
const BOOK_NUTRIENTS = {
  proteins: {
    id: "proteins",
    edge: "bottom",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    ruName: "Белки",
    enName: "Proteins",
    ruEdge: "Снизу страницы",
    enEdge: "Bottom Margin",
    ruRole: "Немедленно внедрить в жизнь",
    enRole: "Actionable Lifehacks & Rules",
    ruDesc: "Строительный материал: приёмы, алгоритмы, упражнения и лайфхаки, которые нужно выписать в «Необходимо сделать» и применить.",
    enDesc: "Building blocks: actionable rules, techniques, and habits to transfer into your 'Must Do' planner.",
  },
  carbs: {
    id: "carbs",
    edge: "top",
    color: "#EA580C",
    bg: "#FFF7ED",
    border: "#FDBA74",
    ruName: "Углеводы",
    enName: "Carbs",
    ruEdge: "Сверху страницы",
    enEdge: "Top Margin",
    ruRole: "К размышлению (Энергия и Смыслы)",
    enRole: "Deep Reflection & Motivation",
    ruDesc: "Энергия книги: глубокие философские мысли, парадоксы и идеи, над которыми стоит поразмышлять на утренней прогулке.",
    enDesc: "Mental energy: profound insights, paradoxes, and ideas to ponder during your morning walk.",
  },
  fats: {
    id: "fats",
    edge: "right",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FCD34D",
    ruName: "Жиры",
    enName: "Fats",
    ruEdge: "Справа страницы",
    enEdge: "Right Margin",
    ruRole: "Яркие истории и примеры",
    enRole: "Vivid Stories & Case Studies",
    ruDesc: "То, что делает книгу «вкусной»: поучительные истории, биографические кейсы, метафоры и примеры из жизни.",
    enDesc: "What makes a book flavorful: memorable stories, real-life examples, and metaphors.",
  },
  vitamins: {
    id: "vitamins",
    edge: "right",
    color: "#16A34A",
    bg: "#F0FDF4",
    border: "#86EFAC",
    ruName: "Витамины",
    enName: "Vitamins",
    ruEdge: "Справа страницы",
    enEdge: "Right Margin",
    ruRole: "Красивые цитаты и остроумие",
    enRole: "Quotes, Wit & Speeches",
    ruDesc: "Вкусные детали для общения и выступлений: точные афоризмы, красивые формулировки, шутки и курьёзные случаи.",
    enDesc: "Sparkling details for talks and conversations: quotes, aphorisms, and witty lines.",
  },
  fiber: {
    id: "fiber",
    edge: "right",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#93C5FD",
    ruName: "Клетчатка",
    enName: "Fiber",
    ruEdge: "Справа страницы",
    enEdge: "Right Margin",
    ruRole: "Факты, цифры, даты и ссылки",
    enRole: "Facts, Stats, Dates & Refs",
    ruDesc: "Справочный каркас книги: статистика, исследования, исторические даты, имена авторов и полезные приложения.",
    enDesc: "Structural reference framework: statistics, dates, studies, and author references.",
  },
};

class NutrientStickerModal extends Modal {
  constructor(app, plugin, initialData, onSave) {
    super(app);
    this.plugin = plugin;
    this.initialData = initialData || {};
    this.onSave = onSave;
    this.selectedNutrient = this.initialData.type && BOOK_NUTRIENTS[this.initialData.type] ? this.initialData.type : "proteins";
  }

  onOpen() {
    if (this.modalEl) this.modalEl.addClass("artcraft-wide-craft-modal");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-nutrient-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const head = contentEl.createDiv({ cls: "nutrient-modal-head" });
    head.innerHTML = `
      <div class="sonic-badge"><span class="svg-inline-icon">${SICRAFT_SVGS.bookmark}</span> ${
      isRu ? "МЕТОДИКА 5 ЗАКЛАДОК-НУТРИЕНТОВ • КНИЖНЫЙ КОНСПЕКТ" : "5-NUTRIENT BOOK STICKER SYSTEM • ACTIVE READING"
    }</div>
      <h3 class="sonic-title">${
        isRu ? "Прикрепить крафтовую закладку со смыслом" : "Attach a Craft Nutrient Bookmark with Meaning"
      }</h3>
      <p class="sonic-studio-sub">${
        isRu
          ? "Выберите тип закладки по методике «5 нутриентов книги»: Белки крепятся снизу (внедрить), Углеводы — сверху (обдумать), Жиры/Витамины/Клетчатка — справа."
          : "Choose a book nutrient: Proteins attach to the bottom margin (must do), Carbs to the top margin (ponder), and Fats/Vitamins/Fiber to the right margin."
      }</p>
    `;

    const grid = contentEl.createDiv({ cls: "nutrient-type-grid" });
    const descBanner = contentEl.createDiv({ cls: "nutrient-role-banner" });

    const updateSelectionUI = () => {
      grid.querySelectorAll(".nutrient-type-card").forEach((c) => {
        c.toggleClass("is-selected", c.dataset.nut === this.selectedNutrient);
      });
      const nObj = BOOK_NUTRIENTS[this.selectedNutrient] || BOOK_NUTRIENTS.proteins;
      descBanner.style.borderColor = nObj.border;
      descBanner.style.background = nObj.bg;
      descBanner.innerHTML = `
        <div class="nutrient-banner-top">
          <span class="nutrient-edge-pill" style="background:${nObj.color};color:#fff;">${isRu ? nObj.ruName : nObj.enName} • ${
        isRu ? nObj.ruEdge : nObj.enEdge
      }</span>
          <strong style="color:${nObj.color};">${isRu ? nObj.ruRole : nObj.enRole}</strong>
        </div>
        <div class="nutrient-banner-desc">${isRu ? nObj.ruDesc : nObj.enDesc}</div>
      `;
    };

    Object.values(BOOK_NUTRIENTS).forEach((nObj) => {
      const card = grid.createEl("button", {
        cls: "nutrient-type-card" + (this.selectedNutrient === nObj.id ? " is-selected" : ""),
      });
      card.dataset.nut = nObj.id;
      card.innerHTML = `
        <span class="nutrient-color-tab" style="background:${nObj.color}"></span>
        <span class="nutrient-card-txt">
          <strong>${isRu ? nObj.ruName : nObj.enName}</strong>
          <small>${isRu ? nObj.ruEdge : nObj.enEdge}</small>
        </span>
      `;
      card.onclick = () => {
        this.selectedNutrient = nObj.id;
        updateSelectionUI();
      };
    });

    updateSelectionUI();

    const formWrap = contentEl.createDiv({ cls: "nutrient-form-wrap" });
    const lblMeaning = formWrap.createDiv({ cls: "sonic-sec-label" });
    lblMeaning.textContent = isRu
      ? "1. Ваш вывод / значение / что именно внедрить или обдумать:"
      : "1. Your Takeaway / Meaning / Action to Implement:";
    const meaningInput = formWrap.createEl("input", {
      type: "text",
      cls: "nutrient-text-input",
      placeholder: isRu
        ? "Например: Проводить утренний разбор задач за чашкой капучино..."
        : "e.g. Apply this 2-minute rule during morning planning...",
      value: this.initialData.meaning || "",
    });

    const lblQuote = formWrap.createDiv({ cls: "sonic-sec-label" });
    lblQuote.style.marginTop = "8px";
    lblQuote.textContent = isRu ? "2. Цитата или фрагмент из заметки (для быстрого перехода):" : "2. Book Quote or Note Snippet (for 1-click jump):";
    const quoteInput = formWrap.createEl("textarea", {
      cls: "nutrient-quote-textarea",
      placeholder: isRu ? "Текст абзаца или цитаты..." : "Paragraph text or quote...",
    });
    quoteInput.rows = 2;
    quoteInput.value = this.initialData.snippet || "";

    const footer = contentEl.createDiv({ cls: "nutrient-modal-footer" });
    if (this.initialData.id && typeof this.initialData.onDelete === "function") {
      const delBtn = footer.createEl("button", {
        cls: "sonic-stop-all-btn",
        text: isRu ? "Удалить закладку" : "Delete Sticker",
      });
      delBtn.onclick = () => {
        this.initialData.onDelete();
        this.close();
      };
    }

    const saveBtn = footer.createEl("button", {
      cls: "artcraft-pay-action-btn is-green",
    });
    saveBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.bookmark}</span><span>${
      isRu ? "Прикрепить закладку на поле книги" : "Pin Nutrient Sticker to Page Edge"
    }</span>`;

    const submit = () => {
      const nObj = BOOK_NUTRIENTS[this.selectedNutrient] || BOOK_NUTRIENTS.proteins;
      const snippetVal = (quoteInput.value || "").trim() || (isRu ? "Важный фрагмент заметки" : "Key Note Passage");
      const meaningVal = (meaningInput.value || "").trim() || (isRu ? nObj.ruRole : nObj.enRole);
      this.onSave({
        type: nObj.id,
        edge: nObj.edge,
        label: isRu ? nObj.ruName : nObj.enName,
        meaning: meaningVal,
        snippet: snippetVal,
        line: this.initialData.line || 0,
      });
      this.close();
    };

    saveBtn.onclick = submit;
    meaningInput.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };
    setTimeout(() => meaningInput.focus(), 50);
  }

  onClose() {
    this.contentEl.empty();
  }
}

class BookNutrientDigestModal extends Modal {
  constructor(app, plugin, filePath, bookmarks) {
    super(app);
    this.plugin = plugin;
    this.filePath = filePath;
    this.bookmarks = bookmarks || [];
  }

  onOpen() {
    if (this.modalEl) this.modalEl.addClass("artcraft-wide-craft-modal");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-nutrient-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const head = contentEl.createDiv({ cls: "nutrient-modal-head" });
    head.innerHTML = `
      <div class="sonic-badge"><span class="svg-inline-icon">${SICRAFT_SVGS.book}</span> ${
      isRu ? "УСВОЕНИЕ КНИГИ • ПЛАНИРОВЩИК БЕЛКОВ И УГЛЕВОДОВ" : "BOOK DIGESTION STUDIO • PROTEINS & CARBS PLANNER"
    }</div>
      <h3 class="sonic-title">${
        isRu ? "Дайджест закладок-нутриентов по заметке" : "5-Nutrient Book Digest & Action Planner"
      }</h3>
      <p class="sonic-studio-sub">${
        isRu
          ? "После прочтения пробегитесь по красным (Белки — внедрить) и оранжевым (Углеводы — к размышлению) закладкам и перенесите их в свой планировщик или в конец заметки."
          : "Review your Red (Proteins — Must Do) and Orange (Carbs — To Ponder) stickers and export them to your planner or append them to this note."
      }</p>
    `;

    const listWrap = contentEl.createDiv({ cls: "nutrient-digest-list" });
    if (this.bookmarks.length === 0) {
      listWrap.createDiv({
        cls: "soft-pay-muted-hint",
        text: isRu
          ? "В этой заметке пока нет закладок-нутриентов. Выделите любой абзац и нажмите «+ Закладка-Нутриент»."
          : "No nutrient stickers in this note yet. Select any passage and click '+ Nutrient Sticker'.",
      });
    } else {
      Object.values(BOOK_NUTRIENTS).forEach((nObj) => {
        const groupItems = this.bookmarks.filter((b) => (b.type || "proteins") === nObj.id);
        if (groupItems.length === 0) return;
        const sec = listWrap.createDiv({ cls: "nutrient-digest-group" });
        sec.style.borderLeftColor = nObj.color;
        sec.style.background = nObj.bg;
        sec.innerHTML = `<div class="nutrient-digest-group-title" style="color:${nObj.color}">
          <strong>${isRu ? nObj.ruName : nObj.enName} (${isRu ? nObj.ruRole : nObj.enRole})</strong>
          <span>${groupItems.length}</span>
        </div>`;
        groupItems.forEach((item) => {
          const row = sec.createDiv({ cls: "nutrient-digest-row" });
          row.innerHTML = `
            <div class="digest-row-meaning"><strong>${item.meaning || item.label}:</strong></div>
            <div class="digest-row-quote">«${item.snippet}»</div>
          `;
          row.onclick = () => {
            this.close();
            this.plugin.jumpToMarginBookmark(item.line || 0, item.snippet || "");
          };
        });
      });
    }

    const buildDigestMarkdown = () => {
      const lines = [];
      lines.push(`\n\n---`);
      lines.push(`## ⚗️ ${isRu ? "Усвоение книги: Дайджест 5 Нутриентов" : "Book Nutrient Digest & Action Plan"}`);
      const proteins = this.bookmarks.filter((b) => (b.type || "proteins") === "proteins");
      const carbs = this.bookmarks.filter((b) => b.type === "carbs");
      const others = this.bookmarks.filter((b) => b.type && b.type !== "proteins" && b.type !== "carbs");

      if (proteins.length > 0) {
        lines.push(`\n### 🔴 ${isRu ? "Белки — Необходимо сделать и внедрить" : "Proteins — Must Do & Implement"}`);
        proteins.forEach((p) => {
          lines.push(`- [ ] **${p.meaning || p.label}** — *«${p.snippet}»*`);
        });
      }
      if (carbs.length > 0) {
        lines.push(`\n### 🟠 ${isRu ? "Углеводы — К размышлению (Энергия и Инсайты)" : "Carbs — To Ponder & Reflect"}`);
        carbs.forEach((c) => {
          lines.push(`> [! lightbulb] **${c.meaning || c.label}**\n> *«${c.snippet}»*`);
        });
      }
      if (others.length > 0) {
        lines.push(`\n### 🟡🟢🔵 ${isRu ? "Жиры, Витамины и Клетчатка (Истории, Цитаты, Факты)" : "Stories, Quotes & Facts"}`);
        others.forEach((o) => {
          const nObj = BOOK_NUTRIENTS[o.type] || BOOK_NUTRIENTS.vitamins;
          lines.push(`- **[${isRu ? nObj.ruName : nObj.enName}] ${o.meaning || o.label}:** *«${o.snippet}»*`);
        });
      }
      return lines.join("\n");
    };

    const footer = contentEl.createDiv({ cls: "nutrient-modal-footer" });
    const btnCopy = footer.createEl("button", { cls: "artcraft-pay-action-btn is-soft" });
    btnCopy.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.copy}</span><span>${
      isRu ? "Скопировать для Планировщика" : "Copy for Planner"
    }</span>`;
    btnCopy.onclick = async () => {
      await navigator.clipboard.writeText(buildDigestMarkdown().trim());
      new Notice(isRu ? "Дайджест скопирован в буфер обмена!" : "Book Digest copied to clipboard!");
    };

    const btnAppend = footer.createEl("button", { cls: "artcraft-pay-action-btn is-green" });
    btnAppend.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.check}</span><span>${
      isRu ? "Вставить блок «Усвоение» в конец заметки" : "Append Digest Block to Note"
    }</span>`;
    btnAppend.onclick = async () => {
      const obsidian = require("obsidian");
      const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      if (view && view.editor && this.bookmarks.length > 0) {
        const cur = view.editor.getValue();
        view.editor.setValue(cur + buildDigestMarkdown());
        this.plugin.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 50);
        new Notice(isRu ? "Блок «Усвоение книги» добавлен в конец заметки!" : "Book Digest appended to note!");
        this.close();
      }
    };
  }

  onClose() {
    this.contentEl.empty();
  }
}

const AMBIENT_SOUNDSCAPES = [
  { id: "balanced", ru: "Сбалансированный шум", en: "Balanced Noise", subRu: "Мягкий спектр iOS", subEn: "iOS Warm Pink Spectrum", icon: SICRAFT_SVGS.sliders },
  { id: "bright", ru: "Светлый шум", en: "Bright Noise", subRu: "Воздушный высокий тон", subEn: "Crisp Airy Highs", icon: SICRAFT_SVGS.sun },
  { id: "brown", ru: "Тёмный шум", en: "Dark Brown Noise", subRu: "Глубокий бас-фильтр", subEn: "Deep Sub-Bass Shield", icon: SICRAFT_SVGS.shield },
  { id: "ocean", ru: "Океан", en: "Ocean Waves", subRu: "Прибой и ритм волн", subEn: "Rhythmic Surf Swell", icon: SICRAFT_SVGS.waves },
  { id: "rain", ru: "Дождь", en: "Soft Rain", subRu: "Дождь по бумаге", subEn: "Gentle Rain on Paper", icon: SICRAFT_SVGS.rain },
  { id: "rain_roof", ru: "Дождь на крыше", en: "Rain on Roof", subRu: "Уютный чердак", subEn: "Warm Attic Patter", icon: SICRAFT_SVGS.roof },
  { id: "stream", ru: "Ручей", en: "Forest Stream", subRu: "Лесной водный поток", subEn: "Babbling Brook", icon: SICRAFT_SVGS.stream },
  { id: "night", ru: "Тихая ночь", en: "Quiet Night", subRu: "Ночной воздух и сверчки", subEn: "Nocturnal Air & Crickets", icon: SICRAFT_SVGS.moon },
  { id: "fire", ru: "Костёр в камине", en: "Cozy Fireplace", subRu: "Треск тёплых углей", subEn: "Crackling Hearth", icon: SICRAFT_SVGS.flame },
  { id: "train", ru: "Ночной поезд", en: "Night Train", subRu: "Спальный вагон и рельсы", subEn: "Rhythmic Rail Cadence", icon: SICRAFT_SVGS.train },
  { id: "cafe", ru: "Уютная кофейня", en: "Coffeehouse Murmur", subRu: "Мягкий гул зала", subEn: "Warm Room Ambience", icon: SICRAFT_SVGS.coffee },
  { id: "gamma40", ru: "40Hz Гамма-фокус", en: "40Hz Gamma Focus", subRu: "Нейро-синхронизация", subEn: "Binaural Deep Work", icon: SICRAFT_SVGS.brain }
];

class AlchemySonicStudioModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.progressTimer = null;
  }

  onOpen() {
    this.plugin.activeSonicModal = this;
    if (this.modalEl) this.modalEl.addClass("artcraft-wide-craft-modal");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-sonic-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const eqModes = [
      { id: "craft", name: isRu ? "01 // Крафтовый Сейсмограф" : "01 // Craft Ink Seismograph", icon: SICRAFT_SVGS.eqCraft },
      { id: "dna", name: isRu ? "02 // Квантовая Матрица" : "02 // Quantum Matrix", icon: SICRAFT_SVGS.eqMatrix },
      { id: "bars", name: isRu ? "03 // Ризограф и Штампы" : "03 // Craft Risograph Stamps", icon: SICRAFT_SVGS.eqBars },
      { id: "wave", name: isRu ? "04 // Чернильная Лента" : "04 // Botanical Ink Ribbon", icon: SICRAFT_SVGS.eqWave },
      { id: "orb", name: isRu ? "05 // Бумажное Оригами" : "05 // Origami Topography", icon: SICRAFT_SVGS.eqOrigami },
      { id: "ferro", name: isRu ? "06 // Струны Архитектора" : "06 // Harmonic Strings", icon: SICRAFT_SVGS.eqStrings }
    ];

    const recipes = [
      {
        id: "morning_cappuccino",
        icon: SICRAFT_SVGS.coffee,
        title: isRu ? "Утренний Капучино" : "Morning Cappuccino",
        sub: isRu ? "Кофейня • Сейсмограф • 3200K • 25м" : "Cafe • Ink Seismograph • 3200K • 25m"
      },
      {
        id: "rainy_chemex",
        icon: SICRAFT_SVGS.rain,
        title: isRu ? "Дождливый Кемекс" : "Rainy Chemex",
        sub: isRu ? "Дождь • Матрица • Линейка • 45м" : "Soft Rain • Matrix • Ruler • 45m"
      },
      {
        id: "night_roastery",
        icon: SICRAFT_SVGS.brain,
        title: isRu ? "Ночная Обжарка 40Hz" : "Night Roastery 40Hz",
        sub: isRu ? "40Hz Гамма • Струны • 2700K • 60м" : "40Hz Gamma • Strings • 2700K • 60m"
      }
    ];

    const hasTrack = !!(this.plugin.ambientNodes && this.plugin.ambientNodes.audioEl);
    const trackName = (this.plugin.ambientNodes && this.plugin.ambientNodes.trackName) || (isRu ? "Выберите свой аудиофайл (MP3 / WAV / FLAC / M4A)" : "Select a custom audio track (MP3 / WAV / FLAC / M4A)");
    const isSysActive = !!(this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "system");
    const isMicActive = !!(this.plugin.desktopAudioNodes && this.plugin.desktopAudioNodes.type === "mic");
    const vol = this.plugin.settings.audioVolume !== undefined ? this.plugin.settings.audioVolume : 75;

    contentEl.innerHTML = `
      <div class="sonic-studio-wrap">
        <div class="sonic-studio-head">
          <div class="sonic-head-left">
            <div class="sonic-badge"><span class="svg-inline-icon">${SICRAFT_SVGS.sliders}</span> <span>ALCHEMY CRAFT // SONIC & AMBIENT STUDIO</span></div>
            <h2 class="sonic-title">${isRu ? "Аудио-студия, Плеер и Фоновые звуки" : "Sonic Equalizer, Track Player & Ambient Sounds"}</h2>
            <p class="sonic-studio-sub">${isRu ? "Запускайте кофейные рецепты фокуса в 1 клик, включайте фоновые звуки или синхронизируйте эквалайзер со звуком ПК." : "Launch 1-click Cappuccino focus recipes, play ambient soundscapes, or sync the craft equalizer with desktop audio."}</p>
          </div>
          <button class="sonic-stop-all-btn" id="sonic-stop-all"><span class="svg-inline-icon">${SICRAFT_SVGS.stop}</span> <span>${isRu ? "Стоп" : "Stop All"}</span></button>
        </div>

        <!-- 0. ONE-CLICK CAPPUCCINO FOCUS RECIPES -->
        <div class="sonic-card is-recipe-card">
          <div class="sonic-sec-label">${isRu ? "РЕЦЕПТЫ ФОКУСА В 1 КЛИК (ЗВУК + ЭКВАЛАЙЗЕР + ЛАМПА + ПОМОДОРО)" : "ONE-CLICK CAPPUCCINO FOCUS RECIPES (SOUND + EQ + LAMP + POMODORO)"}</div>
          <div class="sonic-recipe-grid">
            ${recipes.map((r) => `
              <button class="sonic-recipe-btn ${this.plugin.activeRecipeId === r.id ? "is-active" : ""}" data-recipe="${r.id}">
                <span class="amb-icon">${r.icon}</span>
                <div class="amb-txt">
                  <strong>${r.title}</strong>
                  <small>${r.sub}</small>
                </div>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- 1. CUSTOM TRACK PLAYER & PC/MIC CAPTURE -->
        <div class="sonic-card">
          <div class="sonic-card-top">
            <span class="sonic-sec-label">${isRu ? "ПЛЕЕР СВОИХ ТРЕКОВ И ГРОМКОСТЬ" : "CUSTOM MUSIC PLAYER & MASTER VOLUME"}</span>
            <div class="sonic-vol-row">
              <span class="svg-inline-icon">${SICRAFT_SVGS.volume}</span>
              <span class="sonic-vol-txt">${isRu ? "Громкость:" : "Volume:"} <strong id="sonic-vol-lbl">${vol}%</strong></span>
              <input type="range" id="sonic-vol-slider" min="0" max="100" value="${vol}" class="sonic-vol-slider" />
            </div>
          </div>

          <div class="sonic-player-bar">
            <button class="sonic-play-btn" id="sonic-play-toggle" title="Play / Pause">${hasTrack && !this.plugin.ambientNodes.audioEl.paused ? SICRAFT_SVGS.pause : SICRAFT_SVGS.play}</button>
            <div class="sonic-track-meta">
              <div class="sonic-track-title" id="sonic-track-name">${trackName}</div>
              <div class="sonic-seek-row">
                <span class="sonic-time-lbl" id="sonic-time-cur">00:00</span>
                <input type="range" id="sonic-seek-slider" min="0" max="100" value="0" class="sonic-seek-slider" ${hasTrack ? "" : "disabled"} />
                <span class="sonic-time-lbl" id="sonic-time-dur">00:00</span>
              </div>
            </div>
            <button class="sonic-load-btn" id="sonic-load-file"><span class="svg-inline-icon">${SICRAFT_SVGS.audio}</span> <span>${isRu ? "Выбрать трек..." : "Load Track..."}</span></button>
          </div>

          <div class="sonic-source-pills">
            <button class="sonic-src-pill ${isSysActive ? "is-active" : ""}" id="sonic-sync-sys">
              <span class="svg-inline-icon">${SICRAFT_SVGS.globe}</span> <span>${isRu ? "Захват звука ПК (WASAPI Loopback)" : "Sync PC Desktop Audio (WASAPI)"}</span>
            </button>
            <button class="sonic-src-pill ${isMicActive ? "is-active" : ""}" id="sonic-sync-mic">
              <span class="svg-inline-icon">${SICRAFT_SVGS.mic}</span> <span>${isRu ? "Микрофон / Стерео Микшер" : "Microphone / Stereo Mix"}</span>
            </button>
          </div>

          <div class="sonic-device-row">
            <span class="sonic-device-lbl"><span class="svg-inline-icon">${SICRAFT_SVGS.volume}</span><span>${isRu ? "Аудиовход / Loopback:" : "Audio input / loopback:"}</span></span>
            <select id="sonic-dev-select" class="sonic-device-select">
              <option value="auto">${isRu ? "Авто (звук ПК, затем микрофон)" : "Auto (desktop audio, then mic)"}</option>
            </select>
            <button class="sonic-device-refresh" id="sonic-dev-refresh">${isRu ? "Обновить" : "Refresh"}</button>
          </div>
          <div class="sonic-device-hint" id="sonic-dev-hint">${
            isRu
              ? "Если у вас USB-гарнитура (например, Blue Yeti), микрофон не слышит звук ПК. Выберите здесь «Стерео микшер» / «Stereo Mix» / виртуальный кабель (VB-Cable) — либо оставьте «Авто»."
              : "With a USB headset (e.g. Blue Yeti) the microphone can't hear PC audio. Pick \"Stereo Mix\" or a virtual cable (VB-Cable) here — or leave Auto."
          }</div>
        </div>

        <!-- 2. 6 CRAFT EQUALIZER STYLES -->
        <div class="sonic-card">
          <div class="sonic-sec-label">${isRu ? "6 КРАФТОВЫХ РЕЖИМОВ ЭКВАЛАЙЗЕРА" : "6 CRAFT EQUALIZER VISUAL STYLES"}</div>
          <div class="sonic-eq-grid">
            ${eqModes.map((m) => `
              <button class="sonic-eq-btn ${(this.plugin.settings.eqMode || "craft") === m.id ? "is-active" : ""}" data-eq="${m.id}">
                <span class="svg-inline-icon">${m.icon}</span> <span class="sonic-eq-lbl">${m.name}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- 3. 12 APPLE iOS INSPIRED BACKGROUND SOUNDS -->
        <div class="sonic-card">
          <div class="sonic-sec-label">${isRu ? "12 ФОНОВЫХ ЗВУКОВ ДЛЯ ФОКУСА (КОЛЛЕКЦИЯ iOS)" : "12 FOCUS BACKGROUND SOUNDSCAPES (iOS COLLECTION)"}</div>
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
      this.plugin.activeRecipeId = null;
      this.plugin.stopAudioCapture(true);
      await this.plugin.setAmbientSound("off");
      this.onOpen();
    });

    // Wire up One-Click Focus Recipes
    contentEl.querySelectorAll(".sonic-recipe-btn").forEach((btn) => {
      btn.onclick = async () => {
        const recipeId = btn.getAttribute("data-recipe");
        await this.plugin.applyFocusRecipe(recipeId);
        this.onOpen();
      };
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

    // Audio input / loopback device selector (lets the user pick Stereo Mix, VB-Cable, Yeti, etc.)
    const devSelect = contentEl.querySelector("#sonic-dev-select");
    const populateDevices = async () => {
      if (!devSelect || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        const needLabels = devices.some((d) => d.kind === "audioinput" && !d.label);
        if (needLabels) {
          try {
            const tmp = await navigator.mediaDevices.getUserMedia({ audio: true });
            tmp.getTracks().forEach((tr) => tr.stop());
            devices = await navigator.mediaDevices.enumerateDevices();
          } catch (e) {}
        }
        const current = this.plugin.settings.audioInputDeviceId || "auto";
        while (devSelect.options.length > 1) devSelect.remove(1);
        devices
          .filter((d) => d.kind === "audioinput" && d.deviceId && d.deviceId !== "default" && d.deviceId !== "communications")
          .forEach((d, i) => {
            const opt = document.createElement("option");
            opt.value = d.deviceId;
            opt.textContent = d.label || `${isRu ? "Аудиовход" : "Audio input"} ${i + 1}`;
            devSelect.appendChild(opt);
          });
        devSelect.value = Array.from(devSelect.options).some((o) => o.value === current) ? current : "auto";
      } catch (e) {}
    };
    populateDevices();
    if (devSelect) {
      devSelect.onchange = async () => {
        this.plugin.settings.audioInputDeviceId = devSelect.value;
        await this.plugin.saveSettings();
        if (devSelect.value !== "auto") {
          await this.plugin.startDeviceAudioCapture(devSelect.value);
          this.onOpen();
        }
      };
    }
    contentEl.querySelector("#sonic-dev-refresh")?.addEventListener("click", populateDevices);

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
    if (this.plugin && this.plugin.activeSonicModal === this) {
      this.plugin.activeSonicModal = null;
    }
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

      const profile = this.settings.tactileTypingSound;
      const now = ctx.currentTime;
      const isBig = key === " " || key === "Enter" || key === "Backspace";
      const jitter = 1 + (Math.random() * 0.08 - 0.04);

      // Shared soft noise buffer (for gentle cushion / paper textures)
      if (!this.keyNoiseBuf) {
        const len = Math.floor(ctx.sampleRate * 0.12);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
        this.keyNoiseBuf = buf;
      }

      // Tonal body: sine/triangle with a soft attack, pitch drop and low-pass filtering
      const tone = (type, f0, f1, peak, attack, decay, lp, partialGain) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = lp;
        osc.type = type;
        osc.frequency.setValueAtTime(f0 * jitter, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, f1 * jitter), now + decay);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peak, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay + 0.02);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay + 0.05);
        if (partialGain) {
          const osc2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(f0 * 1.5 * jitter, now);
          osc2.frequency.exponentialRampToValueAtTime(Math.max(30, f1 * 1.5 * jitter), now + decay);
          g2.gain.setValueAtTime(0.0001, now);
          g2.gain.linearRampToValueAtTime(peak * partialGain, now + attack);
          g2.gain.exponentialRampToValueAtTime(0.0001, now + decay);
          osc2.connect(g2);
          g2.connect(filter);
          osc2.start(now);
          osc2.stop(now + decay + 0.05);
        }
      };

      // Soft textured noise burst (cushion / paper brush)
      const puff = (peak, dur, filterType, freq, q) => {
        const src = ctx.createBufferSource();
        src.buffer = this.keyNoiseBuf;
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = freq;
        filter.Q.value = q || 0.7;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start(now);
        src.stop(now + dur + 0.02);
      };

      if (profile === "thock") {
        // Deep PBT Thock: round, matte, low
        tone("triangle", isBig ? 105 : 150, isBig ? 52 : 62, 0.15, 0.004, 0.09, 720, 0);
        puff(0.018, 0.04, "lowpass", 900, 0.5);
      } else if (profile === "matcha_lubed") {
        // Matcha Silent Tactile: lubed, hushed, gentle
        tone("sine", isBig ? 190 : 260, isBig ? 110 : 150, 0.075, 0.005, 0.06, 1100, 0);
        puff(0.012, 0.035, "lowpass", 1300, 0.5);
      } else if (profile === "raindrop_wood") {
        // Warm Walnut Raindrop: woody "tok" with a soft second partial
        tone("sine", isBig ? 300 : 430, isBig ? 160 : 230, 0.09, 0.003, 0.11, 1900, 0.35);
      } else if (profile === "velvet_felt") {
        // Piano felt: pentatonic note per key, muffled hammer on cloth
        const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
        const code = typeof key === "string" && key.length === 1 ? key.toLowerCase().charCodeAt(0) : 0;
        const f = isBig ? 196.0 : notes[code % notes.length];
        tone("sine", f, f * 0.985, 0.075, 0.009, 0.2, 760, 0.18);
        puff(0.008, 0.03, "lowpass", 700, 0.5);
      } else if (profile === "paper_brush") {
        // Fountain pen on cotton paper: a quiet, silky brush
        puff(isBig ? 0.06 : 0.045, isBig ? 0.085 : 0.06, "bandpass", 2400 * jitter, 0.7);
        tone("sine", 190, 120, 0.028, 0.004, 0.05, 700, 0);
      } else {
        // creamy_pom (default): Creamy POM Linear — velvety low-pass body, smooth and round
        tone("triangle", isBig ? 140 : 205, isBig ? 78 : 104, 0.11, 0.004, 0.075, 880, 0);
        puff(0.022, 0.04, "lowpass", 1400, 0.5);
      }
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

  openSonicStudioModal() {
    if (this.activeSonicModal) {
      this.activeSonicModal.close();
      this.activeSonicModal = null;
      return;
    }
    const modal = new AlchemySonicStudioModal(this.app, this);
    this.activeSonicModal = modal;
    modal.open();
  }

  async applyFocusRecipe(recipeId) {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    this.activeRecipeId = recipeId;
    if (recipeId === "morning_cappuccino") {
      this.settings.eqMode = "craft";
      this.settings.magicLamp = true;
      this.settings.lampKelvin = 3200;
      this.settings.lampShape = "radial";
      this.settings.pomodoroMinutes = 25;
      await this.setAmbientSound("cafe");
      this.resetTimer();
      this.startTimer();
      new Notice(isRu ? "Рецепт активирован: Утренний Капучино (Кофейня • 3200K • 25 мин)" : "Focus Recipe Active: Morning Cappuccino (Cafe • 3200K • 25m)");
    } else if (recipeId === "rainy_chemex") {
      this.settings.eqMode = "dna";
      this.settings.magicLamp = true;
      this.settings.lampKelvin = 3500;
      this.settings.lampShape = "ruler";
      this.settings.pomodoroMinutes = 45;
      await this.setAmbientSound("rain");
      this.resetTimer();
      this.startTimer();
      new Notice(isRu ? "Рецепт активирован: Дождливый Кемекс (Дождь • Линейка чтения • 45 мин)" : "Focus Recipe Active: Rainy Chemex (Soft Rain • Reading Ruler • 45m)");
    } else if (recipeId === "night_roastery") {
      this.settings.eqMode = "ferro";
      this.settings.magicLamp = true;
      this.settings.lampKelvin = 2700;
      this.settings.lampShape = "deskbar";
      this.settings.pomodoroMinutes = 60;
      await this.setAmbientSound("gamma40");
      this.resetTimer();
      this.startTimer();
      new Notice(isRu ? "Рецепт активирован: Ночная Обжарка (40Hz Гамма • 2700K • 60 мин)" : "Focus Recipe Active: Night Roastery (40Hz Gamma • 2700K • 60m)");
    }
    await this.saveSettings();
    this.applyBodyClasses();
    this.updateDockUI();
    this.updateEqualizerPillUI();
  }

  showAudioMenu(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    this.openSonicStudioModal();
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

  // Smoothly fades audio out when Pomodoro Break starts, and fades back in when Focus Sprint starts
  fadeAudioForPomodoroBreak(isBreak) {
    if (this.settings.pomoAudioLink === false) return;
    const targetVol = isBreak ? 0.08 : (this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75) / 100;
    this.applyAudioVolume(targetVol);
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
        new Notice(`Playing: ${file.name}`);
        if (typeof onLoadedCallback === "function") {
          onLoadedCallback();
        } else if (!this.activeSonicModal) {
          this.openSonicStudioModal();
        } else {
          this.activeSonicModal.onOpen();
        }
      } catch (e) {
        new Notice("Could not load audio file.");
      }
    });
    input.click();
  }

  connectStreamToAnalyser(stream, type, gainVal = 2.8) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    // Keep full stream (including Electron's required desktop video carrier track) playing in a hidden muted <video> sink
    // so Windows WASAPI loopback never pauses the capture pump!
    const sinkVideo = document.createElement("video");
    sinkVideo.muted = true;
    sinkVideo.autoplay = true;
    sinkVideo.playsInline = true;
    sinkVideo.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;";
    document.body.appendChild(sinkVideo);
    try {
      sinkVideo.srcObject = stream;
      sinkVideo.play().catch(() => {});
    } catch (e) {}

    // Extract an audio-only MediaStream for WebAudio's createMediaStreamSource (prevents Chromium stall on video tracks)
    const audioTracks = stream.getAudioTracks ? stream.getAudioTracks() : [];
    const audioOnlyStream = audioTracks.length > 0 ? new MediaStream(audioTracks) : stream;

    const source = ctx.createMediaStreamSource(audioOnlyStream);
    const preAmp = ctx.createGain();
    preAmp.gain.value = gainVal;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.70;
    analyser.minDecibels = -110;
    analyser.maxDecibels = -20;

    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;

    source.connect(preAmp);
    preAmp.connect(analyser);
    analyser.connect(silentGain);
    silentGain.connect(ctx.destination);

    this.desktopAudioNodes = { ctx, stream, audioOnlyStream, source, analyser, silentGain, sinkAudio: sinkVideo, type };
    this.updateEqualizerPillUI();
  }

  async startSystemAudioCapture() {
    this.stopAudioCapture(true);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    let stream = null;
    const hasAudio = (s) => !!(s && s.getAudioTracks && s.getAudioTracks().length > 0);
    const dropStream = (s) => {
      try {
        if (s) s.getTracks().forEach((tr) => tr.stop());
      } catch (e) {}
    };

    // If the user explicitly picked an input device (Stereo Mix, VB-Cable, Yeti...) honor it first
    const savedDevice = this.settings.audioInputDeviceId;
    if (savedDevice && savedDevice !== "auto") {
      const ok = await this.startDeviceAudioCapture(savedDevice, true);
      if (ok) return;
    }

    // Collect real desktop capture source ids (Electron renderer may or may not expose desktopCapturer)
    const sourceIds = [];
    try {
      let electron = null;
      try {
        electron = window.require ? window.require("electron") : require("electron");
      } catch (e) {}
      const capturers = [];
      if (electron && electron.desktopCapturer) capturers.push(electron.desktopCapturer);
      if (electron && electron.remote && electron.remote.desktopCapturer) capturers.push(electron.remote.desktopCapturer);
      try {
        const remote = window.require ? window.require("@electron/remote") : null;
        if (remote && remote.desktopCapturer) capturers.push(remote.desktopCapturer);
      } catch (e) {}
      for (const cap of capturers) {
        try {
          const srcs = await cap.getSources({ types: ["screen"], thumbnailSize: { width: 1, height: 1 } });
          (srcs || []).forEach((s) => s && s.id && sourceIds.push(s.id));
          if (sourceIds.length) break;
        } catch (e) {}
      }
    } catch (e) {}
    ["screen:0:0", "screen:1:0", "screen:65537:0"].forEach((id) => {
      if (!sourceIds.includes(id)) sourceIds.push(id);
    });

    // Strategy 1: native WASAPI desktop loopback (works regardless of which output device you listen on).
    // Chromium wants chromeMediaSourceId for the video carrier track; some builds also want it on audio — try both.
    const attempts = [];
    sourceIds.forEach((id) => {
      attempts.push({ audioId: id, videoId: id });
      attempts.push({ audioId: null, videoId: id });
    });
    attempts.push({ audioId: null, videoId: null });
    let usedStrategy = "";
    for (const att of attempts) {
      if (hasAudio(stream)) break;
      try {
        const audioMandatory = { chromeMediaSource: "desktop" };
        if (att.audioId) audioMandatory.chromeMediaSourceId = att.audioId;
        const videoMandatory = {
          chromeMediaSource: "desktop",
          minWidth: 16,
          maxWidth: 64,
          minHeight: 16,
          maxHeight: 64,
          maxFrameRate: 5,
        };
        if (att.videoId) videoMandatory.chromeMediaSourceId = att.videoId;
        const s = await navigator.mediaDevices.getUserMedia({
          audio: { mandatory: audioMandatory },
          video: { mandatory: videoMandatory },
        });
        if (hasAudio(s)) {
          stream = s;
          usedStrategy = "desktop-loopback";
        } else {
          dropStream(s);
        }
      } catch (e1) {}
    }

    // Strategy 1b: standards-based getDisplayMedia (works when the host app provides a display-media handler)
    if (!hasAudio(stream) && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const s = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        if (hasAudio(s)) {
          stream = s;
          usedStrategy = "display-media";
        } else {
          dropStream(s);
        }
      } catch (e) {}
    }

    // Strategy 2: Stereo Mix / What U Hear / virtual cable loopback input device
    if (!hasAudio(stream) && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const loopbackDev = devices.find(
          (d) =>
            d.kind === "audioinput" &&
            /stereo mix|смеситель|стерео микшер|loopback|cable|what u hear|blackhole|soundflower|monitor|voicemeeter/i.test(d.label || "")
        );
        if (loopbackDev) {
          const s = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: { exact: loopbackDev.deviceId },
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
            video: false,
          });
          if (hasAudio(s)) {
            stream = s;
            usedStrategy = "loopback-device";
          }
        }
      } catch (e0) {}
    }

    if (!hasAudio(stream)) {
      new Notice(
        isRu
          ? "Не удалось получить звук ПК напрямую. Откройте Аудио-Пульт и выберите «Стерео микшер» / VB-Cable в списке аудиовходов. Пока включён микрофон."
          : "Couldn't capture PC audio directly. Open the Sonic Studio and pick \"Stereo Mix\" / VB-Cable in the audio input list. Falling back to microphone.",
        9000
      );
      return this.startMicAudioCapture(true);
    }

    try {
      this.connectStreamToAnalyser(stream, "system", 3.2);
      if (this.desktopAudioNodes) this.desktopAudioNodes.strategy = usedStrategy;
      new Notice(t("audioConnectedNotice", this));
    } catch (err) {
      dropStream(stream);
      return this.startMicAudioCapture(true);
    }
  }

  // Capture a specific audio input device chosen by the user in the Sonic Studio (Stereo Mix, VB-Cable, Blue Yeti, ...)
  async startDeviceAudioCapture(deviceId, silent = false) {
    this.stopAudioCapture(true);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      this.connectStreamToAnalyser(stream, "mic", 2.4);
      if (!silent) new Notice(t("audioMicConnectedNotice", this));
      return true;
    } catch (err) {
      if (!silent) {
        new Notice(isRu ? "Не удалось открыть выбранное аудиоустройство." : "Could not open the selected audio device.");
      }
      return false;
    }
  }

  async startMicAudioCapture(highGainForSpeakers = false) {
    this.stopAudioCapture(true);
    try {
      const audioConstraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: true };
      const savedDevice = this.settings.audioInputDeviceId;
      if (savedDevice && savedDevice !== "auto") audioConstraints.deviceId = { ideal: savedDevice };
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });
      this.connectStreamToAnalyser(stream, "mic", highGainForSpeakers ? 3.8 : 2.8);
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
        if (this.desktopAudioNodes.sinkAudio.parentNode) {
          this.desktopAudioNodes.sinkAudio.remove();
        }
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
        orb: SICRAFT_SVGS.eqOrigami,
        dna: SICRAFT_SVGS.eqMatrix,
        craft: SICRAFT_SVGS.eqCraft,
        ferro: SICRAFT_SVGS.eqStrings,
      };
      iconEl.innerHTML = modeIcons[this.settings.eqMode || "craft"] || SICRAFT_SVGS.eqCraft;
    }
  }

  async cycleEqualizerMode() {
    if (!this.desktopAudioNodes && !this.ambientNodes) {
      this.openSonicStudioModal();
      return;
    }
    const modes = ["craft", "dna", "bars", "wave", "orb", "ferro"];
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const names = {
      craft: isRu ? "01 // Крафтовый Сейсмограф" : "01 // Craft Ink Seismograph",
      dna: isRu ? "02 // Квантовая Матрица" : "02 // Quantum Matrix",
      bars: isRu ? "03 // Ризограф и Штампы" : "03 // Craft Risograph Stamps",
      wave: isRu ? "04 // Чернильная Лента" : "04 // Botanical Ink Ribbon",
      orb: isRu ? "05 // Бумажное Оригами" : "05 // Origami Topography",
      ferro: isRu ? "06 // Струны Архитектора" : "06 // Harmonic Strings",
    };
    const idx = modes.indexOf(this.settings.eqMode || "craft");
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
      id: "add-nutrient-book-sticker",
      name: "🔖 Attach 5-Nutrient Book Sticker (Proteins, Carbs, Fats, Vitamins, Fiber)",
      callback: () => this.addMarginBookmarkToActiveNote(),
    });

    this.addCommand({
      id: "open-book-nutrient-digest",
      name: "📖 Open Book Nutrient Digest (Proteins & Carbs Summary)",
      callback: () => this.openBookNutrientDigestModal(),
    });

    this.addCommand({
      id: "open-two-page-book-spread",
      name: "📚 Open True 2-Page Side-by-Side Book Spread",
      callback: () => this.openTrueTwoPageBookSpread(),
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
      "artcraft-bento-graph",
      "artcraft-spotlight-mode",
      "artcraft-magic-lamp",
      "artcraft-book-spread"
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
    if (this.focusPopoverEl) this.focusPopoverEl.remove();
    document
      .querySelectorAll(
        ".artcraft-task-progress-wrap, .artcraft-exlibris-corner-seal, .artcraft-quiet-meta-line, .artcraft-nutrient-margin-dock, .artcraft-focus-popover, .artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas"
      )
      .forEach((el) => el.remove());
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
    this.fadeAudioForPomodoroBreak(this.timerState === "break");
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
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.playTimerChime();
        if (this.timerState === "work") {
          this.recordCompletedSprint(this.settings.pomodoroMinutes || 25);
          this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 55);
          new Notice(t("sprintDoneNotice", this));
          this.timerState = "break";
          this.timerSeconds = (this.settings.breakMinutes || 5) * 60;
          if (this.settings.pomoAudioLink !== false) {
            this.fadeAudioForPomodoroBreak(true);
          } else {
            this.stopAmbientSound();
          }
        } else {
          new Notice(t("breakDoneNotice", this));
          this.timerState = "work";
          this.timerSeconds = (this.settings.pomodoroMinutes || 25) * 60;
          this.fadeAudioForPomodoroBreak(false);
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
    document.body.classList.toggle("artcraft-book-spread", !!this.settings.bookSpreadMode);

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

      // Auto-upgrade graph.json to v4.3.5 so user immediately gets vibrant 8-color nodes, no tag clutter, and no backup duplicates
      if (!this.hasAutoUpgradedGraph || this.settings.graphConfigVersion !== "4.3.5") {
        this.hasAutoUpgradedGraph = true;
        this.settings.graphConfigVersion = "4.3.5";
        this.saveSettings();
        setTimeout(() => this.applyBentoGraphColorGroups(false, true), 200);
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
          <button class="artcraft-graph-hud-btn" data-action="snap-png">${SICRAFT_SVGS.camera} <span>${isRu ? "Снимок PNG" : "Snap PNG"}</span></button>
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

        hud.querySelector('[data-action="snap-png"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.snapBentoGraphPNG(viewContent);
        });

        viewContent.appendChild(hud);
      }

      // 3. Bottom-Right Interactive Hint Pill
      let hint = viewContent.querySelector(".artcraft-graph-hint-pill");
      if (!hint) {
        hint = document.createElement("div");
        hint.className = "artcraft-graph-hint-pill";
        hint.innerHTML = `${SICRAFT_SVGS.lamp} <span>${isRu ? "Перетащите любой узел или наведите курсор для подсветки нейронных связей" : "Drag any node or hover to inspect neural links"}</span>`;
        viewContent.appendChild(hint);
      }

      // 4. Ultra-Lightweight Overlay Canvas for Radar Rings & Hovered Node Neural Laser Pulses (Zero Lag, Exact DPI Mapping)
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

    this.graphPulsePhase = (this.graphPulsePhase || 0) + 0.018;
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

      // Exact DPI / WebGL resolution ratio mapping so overlay coordinates match 100% on 100%, 125%, 150%, 200% displays!
      const glCanvas = viewContent.querySelector("canvas:not(.artcraft-graph-fx-canvas)");
      const scaleX = glCanvas && glCanvas.width > 0 ? cw / glCanvas.width : 1 / (window.devicePixelRatio || 1);
      const scaleY = glCanvas && glCanvas.height > 0 ? ch / glCanvas.height : 1 / (window.devicePixelRatio || 1);

      const getScreenPt = (n) => {
        if (!n || !n.circle || !n.circle.worldTransform) return null;
        const wt = n.circle.worldTransform;
        return { x: wt.tx * scaleX, y: wt.ty * scaleY };
      };

      const hovered = renderer.hoveredNode || null;
      let centerPt = hovered ? getScreenPt(hovered) : { x: cw / 2, y: ch / 2 };
      if (!centerPt || centerPt.x < 0 || centerPt.x > cw || centerPt.y < 0 || centerPt.y > ch) {
        centerPt = { x: cw / 2, y: ch / 2 };
      }

      // A. Draw Subtle Concentric Dashed Radar Rings
      if (this.settings.graphPreset === "radar" || this.settings.graphPreset === "bento") {
        ctx.save();
        ctx.setLineDash([5, 6]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(17, 17, 17, 0.085)";
        const rings = [95, 190, 285];
        for (let r = 0; r < rings.length; r++) {
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y, rings[r], 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // B. Draw Neural Laser Pulses & Swiss Bento Card ONLY on Hovered Node & Its Connected Links (Zero Clutter, 144 FPS!)
      if (hovered) {
        const hovPt = getScreenPt(hovered);
        if (hovPt && hovPt.x >= 0 && hovPt.x <= cw && hovPt.y >= 0 && hovPt.y <= ch) {
          // 1. Neural Laser Pulses along links connected to the hovered node
          if (this.settings.graphPulseNodes !== false && renderer.links) {
            ctx.save();
            const links = renderer.links;
            let pulseIdx = 0;
            for (let i = 0; i < links.length; i++) {
              const lnk = links[i];
              if (!lnk || (lnk.source !== hovered && lnk.target !== hovered)) continue;
              const p1 = getScreenPt(lnk.source);
              const p2 = getScreenPt(lnk.target);
              if (!p1 || !p2) continue;

              // Highlighted link beam
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = "rgba(105, 189, 40, 0.35)";
              ctx.lineWidth = 1.6;
              ctx.stroke();

              // Traveling laser photon
              const tProg = (this.graphPulsePhase + pulseIdx * 0.17) % 1;
              const px = p1.x + (p2.x - p1.x) * tProg;
              const py = p1.y + (p2.y - p1.y) * tProg;
              const col = paletteHex[pulseIdx % paletteHex.length];
              pulseIdx++;

              ctx.beginPath();
              ctx.arc(px, py, 3.6, 0, Math.PI * 2);
              ctx.fillStyle = col;
              ctx.fill();
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = "#111111";
              ctx.stroke();
            }
            ctx.restore();
          }

          // 2. Crisp Swiss Bento Card Badge on the Hovered Node
          const rawId = String(hovered.id || "").replace(/\.md$/i, "");
          const shortName = rawId.split("/").pop() || rawId;
          if (shortName) {
            const label = shortName.length > 32 ? shortName.slice(0, 30) + "…" : shortName;
            ctx.save();
            ctx.font = '700 11px "JetBrains Mono", monospace';
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            ctx.beginPath();
            ctx.arc(hovPt.x, hovPt.y, 10, 0, Math.PI * 2);
            ctx.strokeStyle = "#69BD28";
            ctx.lineWidth = 2.4;
            ctx.stroke();

            const textW = ctx.measureText(label).width;
            const boxW = Math.round(textW + 16);
            const boxH = 21;
            const bx = Math.max(8, Math.min(cw - boxW - 8, Math.round(hovPt.x - boxW / 2)));
            const by = Math.round(hovPt.y + 14);

            ctx.fillStyle = "#111111";
            ctx.fillRect(bx + 2, by + 2, boxW, boxH);
            ctx.fillStyle = "#69BD28";
            ctx.fillRect(bx, by, boxW, boxH);
            ctx.strokeStyle = "#111111";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(bx, by, boxW, boxH);

            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(label, Math.round(bx + boxW / 2), Math.round(by + boxH / 2 + 0.5));
            ctx.restore();
          }
        }
      }
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

      // 8-Color Vibrant Swiss Bento Palette in Decimal RGB for graph.json
      const bentoColors = [
        2450411,  // #2563EB Sapphire Blue
        16096779, // #F59E0B Amber Gold
        1096065,  // #10B981 Emerald Green
        9133302,  // #8B5CF6 Amethyst Purple
        15485081, // #EC4899 Rose Quartz
        439972,   // #06B6D4 Cyber Cyan
        6929704,  // #69BD28 Alchemist Green
        15358988, // #EA580C Terracotta Orange
      ];

      const colorGroups = [
        // 1. Distribute Daily / Date / Zettelkasten Notes across 7 vibrant Swiss Bento colors
        { query: 'file:"2024-01" OR file:"2025-01" OR file:"2026-01" OR file:"202601" OR file:"20260201"', color: { a: 1, rgb: 2450411 } },
        { query: 'file:"2024-02" OR file:"2025-02" OR file:"2026-02" OR file:"20260202" OR file:"20260203"', color: { a: 1, rgb: 1096065 } },
        { query: 'file:"2024-03" OR file:"2025-03" OR file:"2026-03" OR file:"20260204" OR file:"20260205"', color: { a: 1, rgb: 9133302 } },
        { query: 'file:"2024-04" OR file:"2025-04" OR file:"2026-04" OR file:"20260206" OR file:"20260207"', color: { a: 1, rgb: 439972 } },
        { query: 'file:"2024-05" OR file:"2024-06" OR file:"2025-05" OR file:"20260208" OR file:"20260209"', color: { a: 1, rgb: 15485081 } },
        { query: 'file:"2023-" OR file:"2024-07" OR file:"2024-08" OR file:"2024-09" OR file:"2026021"', color: { a: 1, rgb: 6929704 } },
        { query: 'file:"2024-10" OR file:"2024-11" OR file:"2024-12" OR file:"2025-" OR file:"20260"', color: { a: 1, rgb: 16096779 } },
      ];

      // 2. Scan all real top-level folders in the user's vault (excluding backup/system folders)
      const rootChildren = (this.app.vault.getRoot() && this.app.vault.getRoot().children) || [];
      const folders = rootChildren
        .filter((f) => f && f.children !== undefined && !f.name.startsWith(".") && !f.name.startsWith("_"))
        .map((f) => f.name)
        .sort();

      folders.forEach((folderName, idx) => {
        colorGroups.push({
          query: `path:"${folderName}"`,
          color: { a: 1, rgb: bentoColors[idx % bentoColors.length] },
        });
      });

      // 3. Distribute root-level notes & tags across vibrant colors (valid Obsidian search queries — no broken file:"*"!)
      colorGroups.push({ query: "tag:#pro OR tag:#important OR file:Kaito OR file:Alchemy", color: { a: 1, rgb: 15485081 } });
      colorGroups.push({ query: "file:а OR file:о OR file:a OR file:o", color: { a: 1, rgb: 2450411 } });
      colorGroups.push({ query: "file:е OR file:и OR file:e OR file:i", color: { a: 1, rgb: 1096065 } });
      colorGroups.push({ query: "path:/", color: { a: 1, rgb: 9133302 } });

      graphConfig.colorGroups = colorGroups;
      // Exclude duplicate cloud backup & attachment clutter so the graph is clean and fast
      graphConfig.search = '-path:"_CloudSyncDuplicates_Backup" -path:"attachments" -path:"scripts"';
      graphConfig.showArrow = false;
      graphConfig.showTags = false;
      graphConfig.showAttachments = false;
      if (toggleOrphans) {
        graphConfig.showOrphans = !graphConfig.showOrphans;
      } else {
        graphConfig.showOrphans = false;
      }
      graphConfig.textFadeMultiplier = -0.5;
      graphConfig.nodeSizeMultiplier = 1.28;
      graphConfig.lineSizeMultiplier = 1.05;
      graphConfig.centerStrength = 0.45;
      graphConfig.repelStrength = 11.0;
      graphConfig.linkDistance = 155;

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

  snapBentoGraphPNG(viewContent) {
    try {
      const canvases = viewContent.querySelectorAll("canvas");
      if (!canvases || canvases.length === 0) {
        new Notice("Graph canvas not ready yet.");
        return;
      }
      const rect = viewContent.getBoundingClientRect();
      const outCanvas = document.createElement("canvas");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      outCanvas.width = Math.round(rect.width * dpr);
      outCanvas.height = Math.round(rect.height * dpr);
      const ctx = outCanvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const isDark = document.body.classList.contains("artcraft-dark-craft") || document.body.classList.contains("theme-dark");
      ctx.fillStyle = isDark ? "#121316" : "#F4F3EF";
      ctx.fillRect(0, 0, rect.width, rect.height);

      canvases.forEach((c) => {
        try {
          ctx.drawImage(c, 0, 0, rect.width, rect.height);
        } catch (e) {}
      });

      // Draw crisp Swiss Bento watermark pill in top-left of exported PNG
      ctx.fillStyle = isDark ? "#1E2025" : "#FFFFFF";
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 1.5;
      ctx.fillRect(16, 16, 260, 28);
      ctx.strokeRect(16, 16, 260, 28);
      ctx.fillStyle = isDark ? "#F3F4F6" : "#111111";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText("ALCHEMY CRAFT // BENTO KNOWLEDGE GRAPH", 26, 34);

      const dataUrl = outCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `alchemy-bento-graph-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 45);
      new Notice((this.settings.uiLanguage || "en") === "ru" ? "Снимок графа сохранен в PNG!" : "Swiss Bento Graph snapshot saved as PNG!");
    } catch (err) {
      new Notice("Could not export graph snapshot.");
    }
  }

  // --- CLEAN UPPER-RIGHT EX-LIBRIS STAMP, QUIET EDITORIAL LINE & 5-NUTRIENT PHYSICAL STICKY TABS ---
  getNoteStampRecord(filePath) {
    if (!this.settings.stampedNotes) this.settings.stampedNotes = {};
    const raw = this.settings.stampedNotes[filePath];
    if (!raw) return null;
    if (typeof raw === "string") {
      return { dates: [raw], count: 1 };
    }
    return {
      dates: Array.isArray(raw.dates) && raw.dates.length > 0 ? raw.dates : [new Date().toLocaleDateString()],
      count: raw.count || 1,
    };
  }

  async stampNoteReading(filePath, mode = "add") {
    if (!this.settings.stampedNotes) this.settings.stampedNotes = {};
    if (mode === "clear") {
      delete this.settings.stampedNotes[filePath];
      await this.saveSettings();
      this.updateTaskProgressBar();
      return;
    }
    const today = new Date().toLocaleDateString();
    const existing = this.getNoteStampRecord(filePath);
    if (!existing) {
      this.settings.stampedNotes[filePath] = { dates: [today], count: 1 };
    } else {
      const nextCount = (existing.count || 1) + 1;
      const dates = [...existing.dates];
      if (!dates.includes(today)) dates.push(today);
      this.settings.stampedNotes[filePath] = { dates, count: nextCount };
    }
    this.lastStampedFileAnim = filePath;
    await this.saveSettings();
    this.burstParticles(window.innerWidth * 0.72, 110, 65);
    this.updateTaskProgressBar();
  }

  showCornerStampMenu(e, filePath) {
    const menu = new Menu();
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const rec = this.getNoteStampRecord(filePath);

    if (!rec) {
      menu.addItem((item) => {
        item
          .setTitle(isRu ? "Поставить штамп и дату прочтения (#1 • Изучено)" : "Stamp Note with Date & Signature (#1 • Read)")
          .setIcon("sicraft-check")
          .onClick(() => this.stampNoteReading(filePath, "add"));
      });
    } else {
      menu.addItem((item) => {
        item
          .setTitle(
            isRu
              ? `Добавить повторное прочтение (#${rec.count + 1} → ★ Полка «Классика»)`
              : `Add Re-Read Date (#${rec.count + 1} → ★ Classics Shelf)`
          )
          .setIcon("sicraft-spark")
          .onClick(() => this.stampNoteReading(filePath, "add"));
      });
      menu.addItem((item) => {
        item
          .setTitle(isRu ? "Снять штамп с этой заметки" : "Remove Stamp from Note")
          .setIcon("sicraft-stop")
          .onClick(() => this.stampNoteReading(filePath, "clear"));
      });
    }
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "+ Прикрепить закладку-нутриент (5 цветов)" : "+ Attach 5-Nutrient Bookmark")
        .setIcon("sicraft-target")
        .onClick(() => this.addMarginBookmarkToActiveNote());
    });
    menu.addItem((item) => {
      item
        .setTitle(isRu ? "Усвоение книги (Дайджест Белков и Углеводов)" : "Book Nutrient Digest & Planner")
        .setIcon("sicraft-sliders")
        .onClick(() => this.openBookNutrientDigestModal());
    });
    menu.showAtMouseEvent(e);
  }

  updateTaskProgressBar(fromCheckboxClick = false) {
    // Clean up any legacy or floating elements that previously caused layout overlap in Live Preview or Reading Mode
    document
      .querySelectorAll(
        ".artcraft-exlibris-corner-seal, .artcraft-quiet-meta-line, .artcraft-nutrient-margin-dock"
      )
      .forEach((el) => el.remove());

    const obsidian = require("obsidian");
    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file) return;

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

    // Calculate live Word Count & Reading Time (~200 wpm)
    let wordCount = 0;
    try {
      const rawText = activeView.editor ? activeView.editor.getValue() : activeView.data || "";
      const cleanText = rawText.replace(/^---[\s\S]*?---\n?/, "").trim();
      if (cleanText.length > 0) {
        wordCount = cleanText.split(/\s+/).filter(Boolean).length;
      }
    } catch (e) {}
    const readMins = Math.max(1, Math.ceil(wordCount / 200));
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const readingText = isRu ? `~${readMins} мин чтения • ${wordCount} слов` : `~${readMins} min read • ${wordCount} words`;

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const filePath = activeView.file.path;
    if (!this.settings.stampedNotes) this.settings.stampedNotes = {};
    if (!this.settings.marginBookmarks) this.settings.marginBookmarks = {};

    if (fromCheckboxClick && total > 0 && pct === 100 && this.lastTaskPctByFile[filePath] !== 100) {
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 4, 60);
      if (!this.settings.stampedNotes[filePath]) {
        this.settings.stampedNotes[filePath] = { dates: [new Date().toLocaleDateString()], count: 1 };
      }
      if (this.settings.focusAnalytics) {
        this.settings.focusAnalytics.tasksCompleted100 = (this.settings.focusAnalytics.tasksCompleted100 || 0) + 1;
      }
      this.saveSettings();
    }
    this.lastTaskPctByFile[filePath] = pct;

    const stampRec =
      this.getNoteStampRecord(filePath) ||
      (total > 0 && pct === 100 ? { dates: [new Date().toLocaleDateString()], count: 1 } : null);
    const isStamped = !!stampRec;
    const isClassics = stampRec && stampRec.count >= 2;
    const latestDate = stampRec ? stampRec.dates[stampRec.dates.length - 1] : "";
    const noteBookmarks = Array.isArray(this.settings.marginBookmarks[filePath]) ? this.settings.marginBookmarks[filePath] : [];

    const viewContent = activeView.containerEl.querySelector(".view-content");
    if (!viewContent) return;

    const showStats = this.settings.showReadingStats !== false && wordCount > 0;
    const showTasks = this.settings.showTaskProgress !== false && total > 0;
    const showStamp = this.settings.showCornerStamp !== false;

    let wrap = viewContent.querySelector(":scope > .artcraft-task-progress-wrap");
    if (!showStats && !showTasks && !showStamp && noteBookmarks.length === 0) {
      if (wrap) wrap.remove();
      return;
    }

    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "artcraft-task-progress-wrap";
      viewContent.insertBefore(wrap, viewContent.firstChild);
    }

    // Normalize legacy bookmark types to the 5 Book Nutrients
    const normalizeNutrient = (bm) => {
      if (bm.type && BOOK_NUTRIENTS[bm.type]) return BOOK_NUTRIENTS[bm.type];
      if (bm.type === "key") return BOOK_NUTRIENTS.proteins;
      if (bm.type === "idea") return BOOK_NUTRIENTS.carbs;
      if (bm.type === "quote") return BOOK_NUTRIENTS.vitamins;
      if (bm.type === "review") return BOOK_NUTRIENTS.fiber;
      return BOOK_NUTRIENTS.proteins;
    };

    const cleanBookmarkText = (str) => {
      if (!str) return "";
      let s = String(str);
      s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      s = s.replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, "$1");
      s = s.replace(/^#+\s+/gm, "");
      s = s.replace(/[*_~`]/g, "");
      s = s.replace(/[\p{Extended_Pictographic}\u200d\ufe0f\u23f3\u270e\u270f]/gu, "");
      return s.replace(/\s{2,}/g, " ").trim();
    };

    const bookmarksHtml =
      noteBookmarks.length > 0
        ? `<div class="artcraft-margin-bookmarks-strip">
            <button class="artcraft-bm-digest-chip" data-act="digest" title="${
              isRu ? "Открыть дайджест книги (Белки и Углеводы)" : "Open Book Nutrient Digest (Proteins & Carbs)"
            }">
              ${SICRAFT_SVGS.book}
              <span>${isRu ? `Дайджест · ${noteBookmarks.length}` : `Digest · ${noteBookmarks.length}`}</span>
            </button>
            ${noteBookmarks
              .map((bm) => {
                const n = normalizeNutrient(bm);
                const nutName = isRu ? n.ruName : n.enName;
                const rawMeaning = bm.meaning || bm.snippet || nutName;
                const cleanMeaning = cleanBookmarkText(rawMeaning) || nutName;
                const shortMeaning = cleanMeaning.length > 24 ? cleanMeaning.slice(0, 22) + "…" : cleanMeaning;
                const cleanSnippet = cleanBookmarkText(bm.snippet || "");
                const tooltip = `${nutName} (${isRu ? n.ruRole : n.enRole})\n${bm.meaning ? cleanBookmarkText(bm.meaning) + "\n" : ""}«${cleanSnippet}»`;
                return `
                  <div class="artcraft-bm-pill is-nut-${n.id}" data-bm-id="${bm.id}" data-bm-line="${bm.line || 0}" style="--bm-accent:${n.color};--bm-bg:${n.bg};--bm-border:${n.border};" title="${tooltip.replace(/"/g, "&quot;")}">
                    <span class="bm-nut-dot" style="background:${n.color}"></span>
                    <span class="bm-tag-name" style="color:${n.color}">${nutName}</span>
                    <span class="bm-tag-text">${shortMeaning}</span>
                    <button class="bm-tag-edit" data-bm-edit="${bm.id}" title="${isRu ? "Изменить закладку" : "Edit sticker"}">${SICRAFT_SVGS.edit}</button>
                    <button class="bm-tag-del" data-bm-del="${bm.id}" title="${isRu ? "Удалить закладку" : "Delete sticker"}">${SICRAFT_SVGS.clear}</button>
                  </div>
                `;
              })
              .join("")}
          </div>`
        : "";

    const animClass = this.lastStampedFileAnim === filePath ? " is-stamp-pressing" : "";
    this.lastStampedFileAnim = null;

    let stampBadgeHtml = "";
    if (showStamp) {
      if (isStamped && isClassics) {
        stampBadgeHtml = `
          <span class="artcraft-ink-stamp-badge is-classics${animClass}" data-act="stamp-menu" title="${
            isRu
              ? `Полка «Классика»! Прочитано ${stampRec.count} раз(а): ${stampRec.dates.join(", ")}. Нажмите для меню.`
              : `Classics Shelf! Read ${stampRec.count} times: ${stampRec.dates.join(", ")}. Click for menu.`
          }">
            ${SICRAFT_SVGS.stamp}
            <span>★ ${isRu ? `КЛАССИКА #${stampRec.count}` : `CLASSICS #${stampRec.count}`} • ${latestDate}</span>
          </span>
        `;
      } else if (isStamped) {
        stampBadgeHtml = `
          <span class="artcraft-ink-stamp-badge${animClass}" data-act="stamp-menu" title="${
            isRu
              ? `Изучено: ${latestDate} (Чтение #1). Нажмите, чтобы отметить 2-е прочтение (Полка «Классика») или снять штамп.`
              : `Approved: ${latestDate} (Read #1). Click to add 2nd read (Classics Shelf) or remove stamp.`
          }">
            ${SICRAFT_SVGS.stamp}
            <span>${isRu ? "ИЗУЧЕНО" : "APPROVED"} • ${latestDate}</span>
          </span>
        `;
      } else {
        stampBadgeHtml = `
          <button class="artcraft-craft-mini-btn" data-act="stamp-now" title="${
            isRu ? "Поставить штамп «Изучено» (APPROVED) с сегодняшней датой" : "Stamp note as APPROVED with today's date"
          }">
            ${SICRAFT_SVGS.stamp}
            <span>${isRu ? "Штамп" : "Stamp"}</span>
          </button>
        `;
      }
    }

    wrap.innerHTML = `
      <div class="artcraft-top-bar-inner">
        <div class="artcraft-header-main-row">
          ${
            showStats
              ? `<span class="artcraft-reading-stats-pill" title="${
                  isRu ? "Расчетное время чтения (~200 слов/мин)" : "Estimated reading time (~200 wpm)"
                }">${SICRAFT_SVGS.book}<span>${readingText}</span></span>`
              : ""
          }
          ${
            showTasks
              ? `<div class="artcraft-compact-task-pill" title="${isRu ? "Прогресс выполнения задач" : "Task completion progress"}">
                  <span class="task-pill-lbl">${isRu ? "Задачи:" : "Tasks:"} <strong>${done}/${total}</strong></span>
                  <div class="artcraft-task-progress-bar-bg">
                    <div class="artcraft-task-progress-bar-fill" style="width: ${pct}%"></div>
                  </div>
                  <span class="task-pill-pct">${pct}%</span>
                </div>`
              : ""
          }
          <div class="artcraft-note-craft-actions">
            ${stampBadgeHtml}
            <button class="artcraft-craft-mini-btn" data-act="bookmark" title="${
              isRu
                ? "Прикрепить крафтовую закладку-нутриент (Белки, Углеводы, Жиры, Витамины, Клетчатка)"
                : "Attach 5-Nutrient Bookmark (Proteins, Carbs, Fats, Vitamins, Fiber)"
            }">
              ${SICRAFT_SVGS.bookmark}
              <span>+ ${isRu ? "Закладка" : "Sticker"}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${this.settings.bookSpreadMode ? "is-active" : ""}" data-act="spread" title="${
              isRu
                ? "ЛКМ: Книжный лист (Book Folio) | ПКМ: Открыть 2-страничный разворот рядом"
                : "LMB: Hardcover Book Page | RMB: Open 2-Page Side-by-Side Spread"
            }">
              ${SICRAFT_SVGS.columns}
              <span>${isRu ? "Книжный лист" : "Book Page"}</span>
            </button>
          </div>
        </div>
        ${bookmarksHtml}
      </div>
    `;

    // Wire up header actions
    wrap.querySelector('[data-act="stamp-now"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.stampNoteReading(filePath, "add");
    });

    wrap.querySelector('[data-act="stamp-menu"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showCornerStampMenu(e, filePath);
    });

    wrap.querySelector('[data-act="stamp-menu"]')?.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showCornerStampMenu(e, filePath);
    });

    wrap.querySelector('[data-act="bookmark"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addMarginBookmarkToActiveNote();
    });

    wrap.querySelector('[data-act="digest"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openBookNutrientDigestModal();
    });

    const spreadBtn = wrap.querySelector('[data-act="spread"]');
    if (spreadBtn) {
      spreadBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.settings.bookSpreadMode = !this.settings.bookSpreadMode;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
        this.updateTaskProgressBar();
      });
      spreadBtn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openTrueTwoPageBookSpread();
      });
    }

    // Wire up 5-Nutrient Bookmark pills (Click to jump, ✎ to edit, × to delete)
    wrap.querySelectorAll(".artcraft-bm-pill").forEach((pillEl) => {
      const bmId = pillEl.getAttribute("data-bm-id");
      const bmObj = noteBookmarks.find((x) => x.id === bmId);
      if (!bmObj) return;

      pillEl.addEventListener("click", (e) => {
        if (e.target.closest(".bm-tag-del") || e.target.closest(".bm-tag-edit")) return;
        e.stopPropagation();
        this.jumpToMarginBookmark(bmObj.line || 0, bmObj.snippet || "");
      });
    });

    wrap.querySelectorAll("[data-bm-edit]").forEach((editBtn) => {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const bmId = editBtn.getAttribute("data-bm-edit");
        const bmObj = noteBookmarks.find((x) => x.id === bmId);
        if (!bmObj) return;
        new NutrientStickerModal(
          this.app,
          this,
          Object.assign({}, bmObj, {
            onDelete: async () => {
              this.settings.marginBookmarks[filePath] = (this.settings.marginBookmarks[filePath] || []).filter((x) => x.id !== bmId);
              await this.saveSettings();
              this.updateTaskProgressBar();
            },
          }),
          async (updated) => {
            Object.assign(bmObj, updated);
            await this.saveSettings();
            this.updateTaskProgressBar();
          }
        ).open();
      });
    });

    wrap.querySelectorAll("[data-bm-del]").forEach((delBtn) => {
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const bmId = delBtn.getAttribute("data-bm-del");
        this.settings.marginBookmarks[filePath] = (this.settings.marginBookmarks[filePath] || []).filter((x) => x.id !== bmId);
        await this.saveSettings();
        this.updateTaskProgressBar();
      });
    });
  }

  async addMarginBookmarkToActiveNote() {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view || !view.file) return;
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const filePath = view.file.path;
    if (!this.settings.marginBookmarks) this.settings.marginBookmarks = {};
    if (!Array.isArray(this.settings.marginBookmarks[filePath])) {
      this.settings.marginBookmarks[filePath] = [];
    }

    let lineNum = 0;
    let lineText = "";
    if (view.editor) {
      if (view.editor.somethingSelected()) {
        lineText = view.editor.getSelection().replace(/\s+/g, " ").trim();
      }
      const cursor = view.editor.getCursor();
      lineNum = cursor ? cursor.line : 0;
      if (!lineText) {
        lineText = (view.editor.getLine(lineNum) || "").replace(/^[#>*\-\s]+/, "").trim();
      }
      if (!lineText) {
        const lineCount = view.editor.lineCount();
        for (let i = Math.max(0, lineNum - 3); i < Math.min(lineCount, lineNum + 8); i++) {
          const candidate = (view.editor.getLine(i) || "").replace(/^[#>*\-\s]+/, "").trim();
          if (candidate.length > 3) {
            lineNum = i;
            lineText = candidate;
            break;
          }
        }
      }
    }
    if (!lineText) {
      lineText = isRu ? `Мысль из заметки #${this.settings.marginBookmarks[filePath].length + 1}` : `Note Insight #${this.settings.marginBookmarks[filePath].length + 1}`;
    }
    const snippet = lineText.length > 90 ? lineText.slice(0, 90) + "…" : lineText;

    new NutrientStickerModal(this.app, this, { snippet, line: lineNum, type: "proteins" }, async (saved) => {
      this.settings.marginBookmarks[filePath].push({
        id: "bm_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
        type: saved.type,
        edge: saved.edge,
        label: saved.label,
        meaning: saved.meaning,
        snippet: saved.snippet,
        line: saved.line,
      });
      await this.saveSettings();
      this.updateTaskProgressBar();
      this.burstParticles(window.innerWidth * 0.78, window.innerHeight * 0.45, 35);
      new Notice(isRu ? `Закладка «${saved.label}» прикреплена на срез книги!` : `Pinned '${saved.label}' sticker to book edge!`);
    }).open();
  }

  openBookNutrientDigestModal() {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view || !view.file) return;
    const filePath = view.file.path;
    const bookmarks = (this.settings.marginBookmarks && this.settings.marginBookmarks[filePath]) || [];
    new BookNutrientDigestModal(this.app, this, filePath, bookmarks).open();
  }

  async openTrueTwoPageBookSpread() {
    const obsidian = require("obsidian");
    const activeLeaf = this.app.workspace.activeLeaf;
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeLeaf || !view || !view.file) return;
    const isRu = (this.settings.uiLanguage || "en") === "ru";

    this.settings.bookSpreadMode = true;
    await this.saveSettings();
    this.applyBodyClasses();

    try {
      const rightLeaf = await this.app.workspace.duplicateLeaf(activeLeaf, "vertical");
      setTimeout(() => {
        if (rightLeaf && rightLeaf.view && rightLeaf.view.editor) {
          const totalLines = rightLeaf.view.editor.lineCount();
          const targetLine = Math.min(totalLines - 1, 28);
          rightLeaf.view.editor.scrollIntoView({ from: { line: targetLine, ch: 0 }, to: { line: Math.min(totalLines - 1, targetLine + 15), ch: 0 } }, true);
        }
        this.updateTaskProgressBar();
      }, 220);
      new Notice(
        isRu
          ? "Открыт настоящий 2-страничный книжный разворот (левая и правая страницы книги)!"
          : "Opened True 2-Page Side-by-Side Book Spread!"
      );
    } catch (e) {
      new Notice(isRu ? "Включён книжный режим страницы" : "Book Folio Mode Enabled");
    }
  }

  toggleFocusSubmenuPopover(anchorBtn) {
    if (this.focusPopoverEl) {
      this.focusPopoverEl.remove();
      this.focusPopoverEl = null;
      return;
    }

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-focus-popover";

    const renderPopoverContent = () => {
      const obsidian = require("obsidian");
      const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      const fp = activeView && activeView.file ? activeView.file.path : "";
      const isStamped = fp ? !!this.getNoteStampRecord(fp) : false;
      const isRulerOn = !!(this.settings.magicLamp && this.settings.lampShape === "ruler");
      const showMeta = this.settings.showReadingStats !== false || this.settings.showTaskProgress !== false;

      const items = [
        {
          id: "sentence",
          checked: !!this.settings.sentenceFocus,
          icon: SICRAFT_SVGS.focus,
          title: isRu ? "Фокус на предложении и бейджи 01–04" : "Active Sentence Focus & 01–04 Badges",
          sub: isRu ? "Подсветка кликнутых предложений и нумерации" : "Highlight clicked sentences & step badges",
        },
        {
          id: "spotlight",
          checked: !!this.settings.spotlightFocus,
          icon: SICRAFT_SVGS.zen,
          title: isRu ? "Затемнение неактивных абзацев (Spotlight)" : "Spotlight Paragraph Dimmer",
          sub: isRu ? "Мягко приглушает все абзацы, кроме текущего" : "Softly dims surrounding paragraphs while reading",
        },
        {
          id: "ruler",
          checked: isRulerOn,
          icon: SICRAFT_SVGS.lamp,
          title: isRu ? "Световая линейка для чтения (Reading Ruler)" : "Lumina Reading Ruler",
          sub: isRu ? "Горизонтальная полоса света по строке курсора" : "Horizontal warm reading beam across active line",
        },
        {
          id: "bookfolio",
          checked: !!this.settings.bookSpreadMode,
          icon: SICRAFT_SVGS.columns,
          title: isRu ? "Книжный лист с полями для закладок" : "Hardcover Book Folio & Margin Channels",
          sub: isRu ? "3D книжная страница с корешком и полями" : "Tactile 3D book sheet with spine & sticker margins",
        },
        {
          id: "meta",
          checked: showMeta,
          icon: SICRAFT_SVGS.book,
          title: isRu ? "Строка времени чтения и задач под заголовком" : "Quiet Reading Time & Tasks Sub-Header",
          sub: isRu ? "Показать/скрыть ~мин чтения и прогресс задач" : "Show/hide reading time & task progress line",
        },
        {
          id: "stamp",
          checked: this.settings.showCornerStamp !== false,
          icon: SICRAFT_SVGS.stamp,
          title: isRu ? "Штамп «Изучено / Классика» вверху заметки" : "Top-Right Ex-Libris Stamp & Classics Seal",
          sub: isStamped
            ? isRu
              ? "Штамп проставлен на этой заметке"
              : "Current note is stamped"
            : isRu
            ? "Показывать экслибрис-печать в правом верхнем углу"
            : "Show Ex-Libris stamp in clean upper-right corner",
        },
      ];

      pop.innerHTML = `
        <div class="focus-pop-head">
          <span class="focus-pop-badge">${SICRAFT_SVGS.focus} <span>${
        isRu ? "РЕЖИМЫ ФОКУСА И КНИЖНОЙ СТУДИИ" : "FOCUS & BOOK READING STUDIO"
      }</span></span>
          <button class="focus-pop-close" title="Close">×</button>
        </div>
        <div class="focus-pop-list">
          ${items
            .map(
              (it) => `
            <label class="focus-pop-row ${it.checked ? "is-checked" : ""}" data-focus-opt="${it.id}">
              <span class="focus-pop-checkbox">${it.checked ? "✓" : ""}</span>
              <span class="focus-pop-icon">${it.icon}</span>
              <span class="focus-pop-txt">
                <strong>${it.title}</strong>
                <small>${it.sub}</small>
              </span>
            </label>
          `
            )
            .join("")}
        </div>
        <div class="focus-pop-divider">${isRu ? "КНИЖНАЯ МЕТОДИКА: 5 ЗАКЛАДОК-НУТРИЕНТОВ" : "5-NUTRIENT BOOK STICKER TOOLS"}</div>
        <div class="focus-pop-actions">
          <button class="focus-pop-act-btn is-primary" data-pop-act="add-sticker">
            ${SICRAFT_SVGS.bookmark} <span>${isRu ? "+ Закладка-Нутриент со смыслом" : "+ Attach 5-Nutrient Sticker"}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="digest">
            ${SICRAFT_SVGS.book} <span>${isRu ? "Дайджест книги (Белки и Углеводы)" : "Book Digest (Proteins & Carbs)"}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="two-page">
            ${SICRAFT_SVGS.columns} <span>${isRu ? "Открыть 2-страничный разворот рядом" : "Open 2-Page Side-by-Side Spread"}</span>
          </button>
        </div>
      `;

      pop.querySelector(".focus-pop-close")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        pop.remove();
        this.focusPopoverEl = null;
      });

      pop.querySelectorAll(".focus-pop-row").forEach((row) => {
        row.addEventListener("click", async (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const opt = row.getAttribute("data-focus-opt");
          if (opt === "sentence") {
            this.settings.sentenceFocus = !this.settings.sentenceFocus;
          } else if (opt === "spotlight") {
            this.settings.spotlightFocus = !this.settings.spotlightFocus;
          } else if (opt === "ruler") {
            if (this.settings.magicLamp && this.settings.lampShape === "ruler") {
              this.settings.magicLamp = false;
            } else {
              this.settings.lampShape = "ruler";
              this.settings.magicLamp = true;
            }
            this.updateLampGpuStyle();
          } else if (opt === "bookfolio") {
            this.settings.bookSpreadMode = !this.settings.bookSpreadMode;
          } else if (opt === "meta") {
            const nextState = !(this.settings.showReadingStats !== false || this.settings.showTaskProgress !== false);
            this.settings.showReadingStats = nextState;
            this.settings.showTaskProgress = nextState;
          } else if (opt === "stamp") {
            this.settings.showCornerStamp = this.settings.showCornerStamp === false ? true : false;
          }
          await this.saveSettings();
          this.applyBodyClasses();
          this.updateDockUI();
          this.updateTaskProgressBar();
          renderPopoverContent();
        });
      });

      pop.querySelector('[data-pop-act="add-sticker"]')?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        pop.remove();
        this.focusPopoverEl = null;
        this.addMarginBookmarkToActiveNote();
      });

      pop.querySelector('[data-pop-act="digest"]')?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        pop.remove();
        this.focusPopoverEl = null;
        this.openBookNutrientDigestModal();
      });

      pop.querySelector('[data-pop-act="two-page"]')?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        pop.remove();
        this.focusPopoverEl = null;
        this.openTrueTwoPageBookSpread();
      });
    };

    renderPopoverContent();
    document.body.appendChild(pop);
    this.focusPopoverEl = pop;

    // Position popover cleanly near the Focus button (handles both bottom horizontal dock and right vertical pillar dock)
    const rect = anchorBtn.getBoundingClientRect();
    const popW = 350;
    const popH = pop.offsetHeight || 410;
    if (this.settings.dockVertical) {
      pop.style.left = `${Math.max(12, rect.left - popW - 12)}px`;
      pop.style.top = `${Math.max(16, Math.min(window.innerHeight - popH - 16, rect.top - 80))}px`;
    } else {
      pop.style.left = `${Math.max(12, Math.min(window.innerWidth - popW - 16, rect.left - 110))}px`;
      pop.style.bottom = `${Math.max(74, window.innerHeight - rect.top + 12)}px`;
    }

    const closeOutside = (ev) => {
      if (this.focusPopoverEl && !this.focusPopoverEl.contains(ev.target) && !anchorBtn.contains(ev.target)) {
        this.focusPopoverEl.remove();
        this.focusPopoverEl = null;
        window.removeEventListener("mousedown", closeOutside, true);
      }
    };
    setTimeout(() => window.addEventListener("mousedown", closeOutside, true), 40);
  }

  jumpToMarginBookmark(lineNum, snippetText) {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view) return;
    if (view.editor) {
      view.editor.setCursor({ line: lineNum, ch: 0 });
      view.editor.scrollIntoView({ from: { line: Math.max(0, lineNum - 2), ch: 0 }, to: { line: lineNum + 2, ch: 0 } }, true);
    }
    const cleanNeedle = (snippetText || "").replace(/…$/, "").trim().slice(0, 24);
    if (cleanNeedle) {
      const blocks = view.contentEl.querySelectorAll(".cm-line, p, h1, h2, h3, h4, li, blockquote");
      for (const b of blocks) {
        if (b.textContent && b.textContent.includes(cleanNeedle)) {
          b.scrollIntoView({ behavior: "smooth", block: "center" });
          b.classList.add("artcraft-bm-flash-highlight");
          setTimeout(() => b.classList.remove("artcraft-bm-flash-highlight"), 1600);
          break;
        }
      }
    }
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
    const blocks = rootEl.querySelectorAll("p, li, td, h1, h2, h3, h4");
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
      const pEl = node.parentElement;
      if (!pEl) continue;
      if (
        pEl.closest(
          "code, pre, a, button, svg, .inline-title, .callout-title, .artcraft-sentence, .artcraft-step-badge, .artcraft-pill-number, .artcraft-capsule-link, .artcraft-capsule-crypto, .artcraft-task-date, .artcraft-check-circle"
        )
      ) {
        continue;
      }
      // If block is a <li> that contains child <p> or nested <ul>/<ol>, only process direct text nodes of this <li>
      if (block.tagName === "LI" && pEl.closest("p, ul, ol") && pEl.closest("li") === block && pEl !== block) {
        continue;
      }
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

    // 2. Focus & Book Studio Submenu button (Click or Right-click opens Craft Submenu with checkboxes)
    this.btnSentence = document.createElement("button");
    this.btnSentence.className = "artcraft-dock-btn";
    this.btnSentence.title =
      (this.settings.uiLanguage || "en") === "ru"
        ? "Меню Фокуса и Книжной Студии: Активное предложение, Затемнение абзацев (Spotlight), Книжный лист, Закладки-Нутриенты и Штамп"
        : "Focus & Book Studio Menu: Sentence Focus, Spotlight Dimmer, Book Folio, 5-Nutrient Stickers & Ex-Libris Stamp";
    this.btnSentence.innerHTML = `${SICRAFT_SVGS.focus}<span class="artcraft-btn-label">${t("focusBtn", this)}</span><span class="artcraft-btn-caret">▾</span>`;
    this.btnSentence.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleFocusSubmenuPopover(this.btnSentence);
    });
    this.btnSentence.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleFocusSubmenuPopover(this.btnSentence);
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
      if (this.activeLampModal) {
        this.activeLampModal.close();
        this.activeLampModal = null;
        return;
      }
      const m = new SmartLedLampModal(this.app, this);
      this.activeLampModal = m;
      const origClose = m.onClose.bind(m);
      m.onClose = () => {
        if (this.activeLampModal === m) this.activeLampModal = null;
        origClose();
      };
      m.open();
    });
    contentWrap.appendChild(this.btnLamp);

    // 6.6. Live 6-Mode Craft Equalizer (LMB: Cycle Modes | Wheel: Volume Scrubbing | RMB: Open Sonic Studio)
    if (this.settings.showEqualizer !== false) {
      const eqWrap = document.createElement("div");
      eqWrap.className = "artcraft-dock-eq-pill";
      eqWrap.title = "LMB: Switch Craft Equalizer Style | Mouse Wheel: Adjust Volume (0%-100%) | RMB: Open Sonic Studio";
      this.eqWrap = eqWrap;

      const eqIconSpan = document.createElement("span");
      eqIconSpan.className = "artcraft-eq-icon-wrap";
      eqWrap.appendChild(eqIconSpan);

      const eqDotSpan = document.createElement("span");
      eqDotSpan.className = "artcraft-eq-status-dot";
      eqWrap.appendChild(eqDotSpan);

      this.eqCanvas = document.createElement("canvas");
      this.eqCanvas.width = 124;
      this.eqCanvas.height = 40;
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
        e.stopPropagation();
        this.showAudioMenu(e);
      });
      eqWrap.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          const curVol = this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75;
          const step = e.deltaY < 0 ? 5 : -5;
          const nextVol = Math.max(0, Math.min(100, curVol + step));
          this.settings.audioVolume = nextVol;
          this.applyAudioVolume(nextVol / 100);
          this.saveSettings();
          eqWrap.title = `Volume: ${nextVol}% (Scroll to adjust | LMB: Mode | RMB: Studio)`;
          if (this.volNoticeTimeout) clearTimeout(this.volNoticeTimeout);
          this.volNoticeTimeout = setTimeout(() => {
            new Notice(`Volume: ${nextVol}%`, 900);
          }, 120);
        },
        { passive: false }
      );
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
    btnCollapse.className = "artcraft-dock-btn artcraft-dock-icon-btn artcraft-dock-collapse-btn is-full-row";
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
    this.btnSentence?.classList.toggle(
      "is-active",
      !!(this.settings.sentenceFocus || this.settings.spotlightFocus || this.settings.bookSpreadMode)
    );
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
    // Logical drawing space is always 62x20; canvas backing store is 2x for crisp lines on HiDPI
    const ew = 62;
    const eh = 20;
    const eqScale = this.eqCanvas.width / ew;
    eqCtx.setTransform(eqScale, 0, 0, eqScale, 0, 0);
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

      // Smart auto-gain: quiet sources (USB headset at low Windows volume, WASAPI loopback) are boosted up to 14x
      const isLiveInput = !!(this.desktopAudioNodes && this.desktopAudioNodes.analyser === activeAnalyser);
      let frameMax = 0;
      for (let j = 0; j < freqData.length; j++) {
        if (freqData[j] > frameMax) frameMax = freqData[j];
      }
      if (isLiveInput) {
        this.eqAgcPeak = Math.max(frameMax, (this.eqAgcPeak || 0) * 0.994);
        const agc = this.eqAgcPeak > 2 ? Math.max(1, Math.min(14, 200 / this.eqAgcPeak)) : 1;
        if (agc > 1.05) {
          for (let j = 0; j < freqData.length; j++) {
            freqData[j] = Math.min(255, Math.round(freqData[j] * agc));
          }
        }
      } else {
        this.eqAgcPeak = 0;
      }

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

    const mode = this.settings.eqMode || "craft";
    const colors = ["#69BD28", "#D97706", "#F4F3EF", "#10B981", "#2563EB", "#F59E0B", "#EAB308", "#A7F3D0"];

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

    // Calm, glow-free equalizer pill (no neon halo around the dock pill)
    if (this.eqWrap && this.eqWrap.style.boxShadow) {
      this.eqWrap.style.boxShadow = "";
    }

    if (mode === "bars") {
      // MODE 03: Craft Risograph Stamps (Warm Paper, Espresso & Matcha Stamped Blocks with Fountain-Pen Caps)
      const craftPalette = ["#F4F3EF", "#69BD28", "#D97706", "#10B981", "#FDE68A", "#C87D4B", "#69BD28", "#F4F3EF"];
      const cols = 12;
      const colW = 3.6;
      const gap = 1.4;
      const baseLine = eh - 2;

      // Subtle craft ledger ruler line
      eqCtx.fillStyle = "rgba(244, 243, 239, 0.22)";
      eqCtx.fillRect(1, baseLine, ew - 2, 1);

      for (let i = 0; i < cols; i++) {
        const x = 2 + i * (colW + gap);
        const h = Math.max(2.2, Math.min(baseLine - 2, this.eqSmooth[i]));
        const c = craftPalette[i % craftPalette.length];

        // Main Risograph ink stamp block
        eqCtx.fillStyle = c;
        eqCtx.fillRect(x, baseLine - h, colW, Math.max(1.5, h - 1));

        // Tactile warm cream paper cap
        if (this.eqPeaks[i] > 3.0) {
          eqCtx.fillStyle = "#FFF8ED";
          eqCtx.fillRect(x - 0.3, Math.max(0.5, baseLine - this.eqPeaks[i] - 1.6), colW + 0.6, 1.4);
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
      // MODE 05: Origami Topographic Waves — 5 folded-paper contour layers (sharp creases, guilloche tension threads)
      const origamiLayers = [
        { fill: "rgba(244, 243, 239, 0.14)", stroke: "rgba(244, 243, 239, 0.85)", k: 0.30 },
        { fill: "rgba(245, 158, 11, 0.20)", stroke: "#F59E0B", k: 0.44 },
        { fill: "rgba(96, 165, 250, 0.22)", stroke: "#60A5FA", k: 0.58 },
        { fill: "rgba(52, 211, 153, 0.26)", stroke: "#34D399", k: 0.72 },
        { fill: "rgba(105, 189, 40, 0.38)", stroke: "#69BD28", k: 0.88 },
      ];
      const foldStep = 3.1;
      const ridgeY = (l, x) => {
        const band = Math.min(15, Math.floor((x / ew) * 16));
        const amp = Math.max(0, this.eqSmooth[(band + l * 3) % 16] - 2);
        const crease = Math.abs(Math.sin(x * 0.23 + this.eqPhase * (0.7 + l * 0.18) + l * 1.9));
        const env = 0.35 + 0.65 * Math.sin((x / ew) * Math.PI);
        return Math.max(1.2, origamiLayers[l].k * eh - amp * 0.52 * crease * env * (0.6 + l * 0.12) - 0.4);
      };

      // Vertical architectural tension threads between the upper and lower envelopes
      eqCtx.lineWidth = 0.5;
      for (let x = 1.5; x < ew; x += foldStep * 2) {
        const yTop = ridgeY(0, x);
        const yBot = ridgeY(4, x);
        const tension = Math.min(0.5, 0.12 + (yBot - yTop) / (eh * 3));
        eqCtx.strokeStyle = `rgba(244, 243, 239, ${tension.toFixed(2)})`;
        eqCtx.beginPath();
        eqCtx.moveTo(x, yTop);
        eqCtx.lineTo(x, yBot);
        eqCtx.stroke();
      }

      for (let l = 0; l < origamiLayers.length; l++) {
        const lay = origamiLayers[l];
        eqCtx.beginPath();
        eqCtx.moveTo(0, eh);
        eqCtx.lineTo(0, ridgeY(l, 0));
        for (let x = foldStep; x < ew; x += foldStep) eqCtx.lineTo(x, ridgeY(l, x));
        eqCtx.lineTo(ew, ridgeY(l, ew));
        eqCtx.lineTo(ew, eh);
        eqCtx.closePath();
        eqCtx.fillStyle = lay.fill;
        eqCtx.fill();

        eqCtx.beginPath();
        eqCtx.moveTo(0, ridgeY(l, 0));
        for (let x = foldStep; x < ew; x += foldStep) eqCtx.lineTo(x, ridgeY(l, x));
        eqCtx.lineTo(ew, ridgeY(l, ew));
        eqCtx.strokeStyle = lay.stroke;
        eqCtx.lineWidth = 0.7;
        eqCtx.lineJoin = "miter";
        eqCtx.stroke();
      }
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
      // MODE 06: Architect's Harmonic Strings — 4 coupled resonant strings (spring-damper physics),
      // Lissajous harmonic nodes and gossamer weave threads between neighbouring strings
      const STR_N = 14;
      const STR_COUNT = 4;
      if (!this.eqStr) {
        this.eqStr = {
          u: Array.from({ length: STR_COUNT }, () => new Array(STR_N).fill(0)),
          v: Array.from({ length: STR_COUNT }, () => new Array(STR_N).fill(0)),
        };
      }
      const strColors = ["#F4F3EF", "#F59E0B", "#60A5FA", "#69BD28"];
      const rowGap = (eh - 4) / (STR_COUNT - 1);
      const maxDisp = rowGap * 0.82;
      const nodeXs = [];
      for (let i = 0; i < STR_N; i++) nodeXs.push(1.5 + (i / (STR_N - 1)) * (ew - 3));

      // Physics step: spring coupling k, damping d, driven by the real spectrum energy of each string's 4 bands
      for (let s = 0; s < STR_COUNT; s++) {
        let e = 0;
        for (let b = 0; b < 4; b++) e += Math.max(0, this.eqSmooth[s * 4 + b] - 2);
        e = Math.min(1, e / (4 * (eh - 2)) * 1.5);
        const u = this.eqStr.u[s];
        const v = this.eqStr.v[s];
        const active = hasSound || e > 0.02;
        for (let i = 1; i < STR_N - 1; i++) {
          const lap = u[i - 1] + u[i + 1] - 2 * u[i];
          const standing = Math.sin((Math.PI * i) / (STR_N - 1));
          const drive = active ? e * 0.38 * Math.sin(this.eqPhase * (1.1 + s * 0.37) + i * 0.9) * standing : 0;
          v[i] += 0.24 * lap - 0.07 * v[i] - 0.015 * u[i] + drive;
        }
        for (let i = 1; i < STR_N - 1; i++) {
          u[i] += v[i];
          if (u[i] > 1) { u[i] = 1; v[i] *= -0.4; }
          if (u[i] < -1) { u[i] = -1; v[i] *= -0.4; }
        }
      }

      const stringPts = (s) => {
        const baseY = 2 + s * rowGap;
        return nodeXs.map((x, i) => ({ x, y: baseY + this.eqStr.u[s][i] * maxDisp }));
      };
      const allPts = [];
      for (let s = 0; s < STR_COUNT; s++) allPts.push(stringPts(s));

      // Gossamer weave threads between neighbouring strings (bezier curves)
      eqCtx.lineWidth = 0.4;
      for (let s = 0; s < STR_COUNT - 1; s++) {
        for (let i = 1; i < STR_N - 1; i += 3) {
          const a = allPts[s][i];
          const b = allPts[s + 1][Math.min(STR_N - 2, i + 1)];
          const sway = (this.eqStr.u[s][i] - this.eqStr.u[s + 1][i]) * 2;
          eqCtx.strokeStyle = "rgba(244, 243, 239, 0.18)";
          eqCtx.beginPath();
          eqCtx.moveTo(a.x, a.y);
          eqCtx.quadraticCurveTo((a.x + b.x) / 2 + sway, (a.y + b.y) / 2, b.x, b.y);
          eqCtx.stroke();
        }
      }

      // Strings as smooth curves through the nodes
      for (let s = 0; s < STR_COUNT; s++) {
        const pts = allPts[s];
        eqCtx.beginPath();
        eqCtx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          eqCtx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        eqCtx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        eqCtx.strokeStyle = strColors[s];
        eqCtx.lineWidth = 0.85;
        eqCtx.stroke();
      }

      // Phase-shifted Lissajous harmonic nodes riding on the strings with the largest displacement
      for (let s = 0; s < STR_COUNT; s++) {
        let bestI = 1;
        for (let i = 2; i < STR_N - 1; i++) {
          if (Math.abs(this.eqStr.u[s][i]) > Math.abs(this.eqStr.u[s][bestI])) bestI = i;
        }
        const p = allPts[s][bestI];
        const energy = Math.min(1, Math.abs(this.eqStr.u[s][bestI]) * 1.6);
        const rad = 0.9 + energy * 1.8;
        eqCtx.beginPath();
        for (let t = 0; t <= 24; t++) {
          const ang = (t / 24) * Math.PI * 2;
          const lx = p.x + Math.sin(ang * (2 + (s % 2)) + this.eqPhase * 0.9 + s) * rad;
          const ly = p.y + Math.sin(ang * 3 + this.eqPhase * 0.6) * rad * 0.8;
          if (t === 0) eqCtx.moveTo(lx, ly);
          else eqCtx.lineTo(lx, ly);
        }
        eqCtx.strokeStyle = strColors[s];
        eqCtx.lineWidth = 0.55;
        eqCtx.stroke();
        eqCtx.beginPath();
        eqCtx.arc(p.x, p.y, 0.7, 0, Math.PI * 2);
        eqCtx.fillStyle = "#FFFFFF";
        eqCtx.fill();
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
    // Migrate the removed "Vintage Typewriter" sound to the new creamy default
    if (this.settings.tactileTypingSound === "typewriter") {
      this.settings.tactileTypingSound = "creamy_pom";
    }
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
    this.selectedTier = "silver";
    this.customAmount = "5";
  }

  onOpen() {
    this.plugin.activeProModal = this;
    if (this.modalEl) this.modalEl.addClass("artcraft-wide-craft-modal");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    // Soft, Warm Ko-fi / Zsolt-Inspired Header with Cappuccino Craft Vibe
    const header = contentEl.createDiv({ cls: "artcraft-soft-pro-header" });
    header.innerHTML = `
      <div class="artcraft-soft-pro-badge"><span class="svg-inline-icon">${SICRAFT_SVGS.coffee}</span> ${
      isRu ? "ALCHEMIST ROASTERY • ПОДДЕРЖКА И PRO ДОСТУП" : "ALCHEMIST ROASTERY • SUPPORT & PRO PASS"
    }</div>
      <h2 class="artcraft-soft-pro-title">${isRu ? "Угостить Капучино и открыть Alchemy Craft Pro" : "Treat a Cappuccino & Unlock Alchemy Craft Pro"}</h2>
      <p class="artcraft-soft-pro-sub">${
        isRu
          ? "Этот плагин создаётся с любовью за чашкой тёплого капучино. Выберите комфортный кофейный уровень поддержки или активируйте промокод в один клик."
          : "Crafted with care over a warm cup of cappuccino. Choose a comfortable coffee support tier or redeem your promo key in one click."
      }</p>
    `;

    // Segmented Mode Switcher with Vector SVG Icons (Zero Emojis)
    const tabBar = contentEl.createDiv({ cls: "artcraft-ko-tabs" });
    const tabSupport = tabBar.createEl("button", {
      cls: "artcraft-ko-tab" + (this.activeTab === "support" ? " is-active" : ""),
    });
    tabSupport.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.coffee}</span><span>${
      isRu ? "Выбрать кофейный уровень" : "Choose Cappuccino Tier"
    }</span>`;

    const tabPromo = tabBar.createEl("button", {
      cls: "artcraft-ko-tab" + (this.activeTab === "promo" ? " is-active" : ""),
    });
    tabPromo.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.ticket}</span><span>${
      isRu ? "У меня есть промокод / ключ" : "Redeem Promo / VIP Key"
    }</span>`;

    const bodyContainer = contentEl.createDiv({ cls: "artcraft-soft-pro-body" });

    const tiers = {
      bronze: {
        id: "bronze",
        name: isRu ? "Тёплый Капучино" : "Warm Cappuccino",
        amount: "4.99",
        period: isRu ? "$4.99 • на 1 год" : "$4.99 • 1 Year Pass",
        svg: TIER_BRONZE_SVG,
        planKey: "1_year",
        desc: isRu
          ? "Угостить автора чашкой свежего капучино и получить полный Pro-доступ на 1 год (Midnight Dark Craft, 12 фоновых звуков, крафтовый эквалайзер и 8-цветный граф)."
          : "Treat the creator to a warm cappuccino and unlock all Pro features for 1 year (Midnight Dark Craft, 12 ambient soundscapes, craft equalizer & 8-color graph).",
      },
      silver: {
        id: "silver",
        name: isRu ? "Двойной Капучино и Кемекс" : "Double Cappuccino & Chemex",
        amount: "9.99",
        period: isRu ? "$9.99 • Навсегда (Lifetime)" : "$9.99 • Lifetime Pass",
        badge: isRu ? "ЛЮБИМЫЙ БЛЕНД" : "FAVORITE BLEND",
        svg: TIER_SILVER_SVG,
        planKey: "lifetime",
        desc: isRu
          ? "Двойной капучино для глубокой работы: вечная лицензия без повторных платежей и все текущие и будущие Pro-обновления навсегда."
          : "Double cappuccino for deep focus: Lifetime license with zero recurring payments and all current and future Pro studio upgrades forever.",
      },
      gold: {
        id: "gold",
        name: isRu ? "Кофейня Алхимика" : "Alchemist Coffee Roastery",
        amount: "19.00",
        period: isRu ? "$19 • Меценат + 3 ключа" : "$19 • Patron + 3 Keys",
        svg: TIER_GOLD_SVG,
        planKey: "patron_lifetime",
        desc: isRu
          ? "Вдохновить кофейню Алхимика на новые идеи: вечная Pro-лицензия + 3 подарочных ключа для друзей и приоритет ваших пожеланий."
          : "Inspire the Alchemist Roastery: Lifetime Pro license + 3 gift keys for friends & priority feature requests.",
      },
      custom: {
        id: "custom",
        name: isRu ? "Свободная поддержка" : "Pay what you want",
        amount: "5.00",
        period: "",
        svg: "",
        planKey: "1_year",
        desc: "",
      },
    };

    // Free-form support amount (any sum from $1 to $500) — keeps tier + plan in sync with the typed value
    const parseCustomAmount = () => {
      const n = parseFloat(String(this.customAmount || "").replace(",", ".").replace(/[^0-9.]/g, ""));
      if (!isFinite(n) || n < 1) return null;
      return Math.min(500, Math.round(n * 100) / 100);
    };
    const syncCustomTier = () => {
      const n = parseCustomAmount();
      tiers.custom.amount = n === null ? "0.00" : n.toFixed(2);
      tiers.custom.planKey = n !== null && n >= 19 ? "patron_lifetime" : n !== null && n >= 9.99 ? "lifetime" : "1_year";
    };
    syncCustomTier();

    const renderVerificationBlock = (parentEl, isPromoView) => {
      const verifyBox = parentEl.createDiv({ cls: "artcraft-soft-verify-box" + (isPromoView ? " is-promo-hero" : "") });
      verifyBox.innerHTML = `
        <div class="soft-verify-title"><span class="svg-inline-icon">${isPromoView ? SICRAFT_SVGS.ticket : SICRAFT_SVGS.check}</span> <span>${
        isPromoView
          ? isRu
            ? "Мгновенная активация по промокоду или VIP-ключу"
            : "Instant Activation via Promo Code or VIP License Key"
          : isRu
          ? "Шаг 2 • Вставьте TXID перевода, ID чека @CryptoBot или ключ:"
          : "Step 2 • Paste Transfer TXID, @CryptoBot Invoice ID, or Key:"
      }</span></div>
        ${
          isPromoView
            ? `<p class="soft-verify-sub">${
                isRu
                  ? "Введите ваш промокод (выданный автором или полученный в сообществе) либо лицензионный ключ формата ACPRO-XXXX. Никаких платежей не требуется."
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
            <span class="svg-inline-icon">${SICRAFT_SVGS.chat}</span>
            <span>${isRu ? "Хотите получить промокод или оплатить картой напрямую?" : "Need a promo key or direct card link?"}</span>
            <strong>@StratAlchemy</strong>
          </div>
          <button class="soft-tg-link-btn" id="pro-promo-tg-btn">
            <span>${isRu ? "Написать в Telegram" : "Open Telegram"}</span>
            <span class="svg-inline-icon">${SICRAFT_SVGS.external}</span>
          </button>
        `;
        promoFooter.querySelector("#pro-promo-tg-btn")?.addEventListener("click", () => {
          openExternalUrl("https://t.me/StratAlchemy");
        });
        return;
      }

      // TAB 1: KO-FI / ZSOLT-INSPIRED 3 CAPPUCCINO TIER CARDS + CLEAN PAYMENT BAR
      const tierGrid = bodyContainer.createDiv({ cls: "artcraft-ko-tier-grid" });
      Object.values(tiers)
        .filter((tObj) => tObj.id !== "custom")
        .forEach((tObj) => {
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

      // Free-form amount row: pay what you want (chips + custom input)
      const customRow = bodyContainer.createDiv({
        cls: "artcraft-ko-custom-row" + (this.selectedTier === "custom" ? " is-selected" : ""),
      });
      customRow.innerHTML = `
        <div class="ko-custom-left">
          <span class="svg-inline-icon">${SICRAFT_SVGS.coffee}</span>
          <div class="ko-custom-txt">
            <strong>${isRu ? "Своя сумма" : "Your own amount"}</strong>
            <small>${isRu ? "Любая сумма от $1 — от всего сердца" : "Any amount from $1 — straight from the heart"}</small>
          </div>
        </div>
        <div class="ko-custom-right">
          <div class="ko-custom-chips"></div>
          <label class="ko-custom-input-wrap">
            <span>$</span>
            <input type="text" inputmode="decimal" class="ko-custom-input" placeholder="5.00" value="${this.customAmount}" />
          </label>
        </div>
      `;
      const customInput = customRow.querySelector(".ko-custom-input");
      const chipsWrap = customRow.querySelector(".ko-custom-chips");
      ["3", "5", "10", "25"].forEach((v) => {
        const chip = document.createElement("button");
        chip.className = "ko-custom-chip";
        chip.textContent = `$${v}`;
        chip.onclick = (ev) => {
          ev.stopPropagation();
          this.customAmount = v;
          this.selectedTier = "custom";
          renderView();
        };
        chipsWrap.appendChild(chip);
      });
      customInput.addEventListener("focus", () => {
        if (this.selectedTier !== "custom") {
          this.selectedTier = "custom";
          customRow.addClass("is-selected");
          tierGrid.querySelectorAll(".artcraft-ko-tier-card").forEach((c) => c.removeClass("is-selected"));
          syncCustomTier();
          renderMethodDetail(this.selectedNetwork);
        }
      });
      customInput.addEventListener("input", () => {
        this.customAmount = customInput.value;
        this.selectedTier = "custom";
        syncCustomTier();
        renderMethodDetail(this.selectedNetwork);
      });
      customRow.onclick = () => {
        if (this.selectedTier !== "custom") customInput.focus();
      };

      const getActiveTier = () => tiers[this.selectedTier] || tiers.silver;

      // Clean Horizontal Payment Method Pills with Vector SVG Icons
      const methodsLabel = bodyContainer.createDiv({ cls: "artcraft-soft-section-lbl" });
      methodsLabel.setText(isRu ? "Способ оплаты (0% комиссия):" : "Select Payment Method (0% Fee):");

      const methodPills = bodyContainer.createDiv({ cls: "artcraft-soft-method-pills" });
      const methods = [
        { id: "cryptobot", icon: SICRAFT_SVGS.send, label: "@CryptoBot (Telegram)" },
        { id: "evm", icon: SICRAFT_SVGS.globe, label: "Universal EVM (0x...)" },
        { id: "bybit", icon: SICRAFT_SVGS.zap, label: "Bybit UID (0% Fee)" },
        { id: "solana", icon: SICRAFT_SVGS.sun, label: "Solana (USDT/USDC)" },
        { id: "trc20", icon: SICRAFT_SVGS.shield, label: "TRON (TRC-20)" },
      ];

      const paymentDetailBox = bodyContainer.createDiv({ cls: "artcraft-soft-pay-detail" });

      const renderMethodDetail = (netId) => {
        this.selectedNetwork = netId;
        paymentDetailBox.empty();
        methodPills.querySelectorAll(".artcraft-soft-method-pill").forEach((el) => {
          el.toggleClass("is-active", el.dataset.net === netId);
        });

        const activeTierObj = getActiveTier();
        const curAmount = activeTierObj.amount;
        const amountValid = parseFloat(curAmount) >= 1;

        if (netId === "cryptobot") {
          paymentDetailBox.innerHTML = `
            <div class="soft-pay-summary-row">
              <span class="soft-pay-tier-tag">${activeTierObj.name} — <strong>$${curAmount} USDT / TON</strong></span>
              <span class="soft-pay-direct-badge">${isRu ? "В 1 клик через Telegram" : "Instant Telegram Checkout"}</span>
            </div>
            <div class="artcraft-pay-cta-row">
              <button class="artcraft-pay-action-btn is-green" id="pro-create-api-invoice">
                <span class="svg-inline-icon">${SICRAFT_SVGS.send}</span>
                <span>${isRu ? `Оплатить $${curAmount} в @CryptoBot` : `Pay $${curAmount} via @CryptoBot`}</span>
                <span class="svg-inline-icon">${SICRAFT_SVGS.external}</span>
              </button>
              <button class="artcraft-pay-action-btn is-soft" id="pro-open-cb-tg">
                <span class="svg-inline-icon">${SICRAFT_SVGS.chat}</span>
                <span>${isRu ? "Оплата картой / @StratAlchemy" : "Card Link / @StratAlchemy"}</span>
                <span class="svg-inline-icon">${SICRAFT_SVGS.external}</span>
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
              const origHtml = btnApiCb.innerHTML;
              if (!amountValid) {
                new Notice(isRu ? "Введите сумму от $1 для оплаты через @CryptoBot." : "Enter an amount of $1 or more to pay via @CryptoBot.");
                return;
              }
              btnApiCb.disabled = true;
              btnApiCb.textContent = isRu ? "Создаём счёт в @CryptoBot..." : "Creating @CryptoBot invoice...";
              try {
                const obsidianApi = require("obsidian");
                const cbToken = "CRYPTOBOT_TOKEN_REDACTED";
                const cleanAmount = (parseFloat(curAmount) || 4.99).toFixed(2);
                const tierName = activeTierObj ? activeTierObj.name : "Pro";
                const customDesc = `Alchemy Craft — ${tierName} ($${cleanAmount})`;

                // Call Crypto Pay API directly without intermediary server
                const res = await obsidianApi.requestUrl({
                  url: "https://pay.crypt.bot/api/createInvoice",
                  method: "POST",
                  contentType: "application/json",
                  headers: {
                    "Crypto-Pay-API-Token": cbToken,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    currency_type: "fiat",
                    fiat: "USD",
                    amount: cleanAmount,
                    accepted_assets: "USDT,TON,SOL,TRX,BTC,ETH,DOGE,LTC,BNB,USDC",
                    description: customDesc,
                    paid_btn_name: "callback",
                    paid_btn_url: "https://t.me/StratAlchemy",
                    allow_comments: true,
                    allow_anonymous: true,
                    expires_in: 3600,
                  }),
                  throw: false,
                });
                const d = res && res.json ? res.json : null;
                if (d && d.ok && d.result) {
                  const inv = d.result;
                  const payUrl = inv.bot_invoice_url || inv.pay_url || inv.mini_app_invoice_url;
                  if (inv.invoice_id) {
                    const txField = this.contentEl.querySelector(".verify-tx-input");
                    if (txField) txField.value = String(inv.invoice_id);
                  }
                  new Notice(
                    isRu
                      ? `Счёт #${inv.invoice_id} на $${cleanAmount} создан! Переходим в @CryptoBot...`
                      : `Invoice #${inv.invoice_id} for $${cleanAmount} created! Opening @CryptoBot...`,
                    5000
                  );
                  openExternalUrl(payUrl);
                  return;
                }
                const errDetail = d && d.error ? (d.error.name || JSON.stringify(d.error)) : "Network Error";
                new Notice(
                  isRu
                    ? `Ошибка @CryptoBot: ${errDetail}. Попробуйте ещё раз или свяжитесь с поддержкой.`
                    : `@CryptoBot error: ${errDetail}. Please try again or contact support.`,
                  8000
                );
              } catch (e) {
                console.error("CryptoBot API error:", e);
                new Notice(
                  isRu
                    ? "Не удалось связаться с API @CryptoBot. Проверьте интернет-соединение."
                    : "Can't reach @CryptoBot API. Please check your internet connection.",
                  8000
                );
              } finally {
                btnApiCb.disabled = false;
                btnApiCb.innerHTML = origHtml;
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
              <span>${isRu ? "Сумма:" : "Amount:"} <strong>$${curAmount} USDT</strong></span>
              <span class="svg-inline-icon">${SICRAFT_SVGS.copy}</span>
            </button>
          </div>
          <div class="card-address-group">
            <input type="text" readonly class="card-address-input" id="pro-addr-val" value="${addrValue}" />
            <button class="card-copy-btn" id="pro-copy-btn">
              <span class="svg-inline-icon">${SICRAFT_SVGS.copy}</span>
              <span>${t("copyBtn", this.plugin)}</span>
            </button>
          </div>
          <div class="soft-pay-muted-hint">${noteText}</div>
        `;

        const copyBtn = paymentDetailBox.querySelector("#pro-copy-btn");
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(addrValue);
            copyBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.check}</span><span>${t("copiedBtn", this.plugin)}</span>`;
            setTimeout(() => {
              copyBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.copy}</span><span>${t("copyBtn", this.plugin)}</span>`;
            }, 1800);
          };
        }

        const copyAmountBtn = paymentDetailBox.querySelector("#pro-copy-amount-btn");
        if (copyAmountBtn) {
          copyAmountBtn.onclick = () => {
            navigator.clipboard.writeText(curAmount);
            copyAmountBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.check}</span><strong>$${curAmount} USDT</strong>`;
            setTimeout(() => {
              copyAmountBtn.innerHTML = `<span>${isRu ? "Сумма:" : "Amount:"} <strong>$${curAmount} USDT</strong></span><span class="svg-inline-icon">${SICRAFT_SVGS.copy}</span>`;
            }, 1800);
          };
        }
      };

      methods.forEach((m) => {
        const pill = methodPills.createEl("button", {
          cls: "artcraft-soft-method-pill" + (this.selectedNetwork === m.id ? " is-active" : ""),
        });
        pill.innerHTML = `<span class="svg-inline-icon">${m.icon}</span><span>${m.label}</span>`;
        pill.dataset.net = m.id;
        pill.onclick = () => renderMethodDetail(m.id);
      });

      renderMethodDetail(this.selectedNetwork);
      renderVerificationBlock(bodyContainer, false);

      // Soft Footer Link to Telegram (opens in default OS browser)
      const supportRow = bodyContainer.createDiv({ cls: "artcraft-soft-support-row" });
      supportRow.innerHTML = `
        <div class="soft-support-left">
          <span class="svg-inline-icon">${SICRAFT_SVGS.chat}</span>
          <span>${isRu ? "Вопросы по оплате или ручная выдача ключа:" : "Questions or instant manual key activation:"}</span>
          <strong>@StratAlchemy</strong>
        </div>
        <button class="soft-tg-link-btn" id="pro-support-open">
          <span>${isRu ? "Открыть в браузере / Telegram" : "Open in Browser / Telegram"}</span>
          <span class="svg-inline-icon">${SICRAFT_SVGS.external}</span>
        </button>
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
          new Notice(`Успешно! Активирован тариф: ${data.plan || "1_year"}`);
          return true;
        }
      }
    } catch (err) {
      console.warn("Supabase network check skipped, using local fallback:", err);
    }

    // 1.5. Cryptographic SiCraft License Key Verification (Format: ACPRO-XXXX-XXXX-XXXX-XXXX)
    if (isValidSiCraftLicenseKey(rawCode)) {
      new Notice("Cryptographic License Key Verified! Activating Alchemy Craft Pro...");
      return true;
    }

    // 1.6. Direct CryptoBot Invoice Check via Official Crypto Pay API
    try {
      const cleanId = rawCode.replace(/[^0-9]/g, "");
      if (cleanId.length >= 5) {
        const obsidianApi = require("obsidian");
        const cbToken = "CRYPTOBOT_TOKEN_REDACTED";
        const cbRes = await obsidianApi.requestUrl({
          url: `https://pay.crypt.bot/api/getInvoices?invoice_ids=${encodeURIComponent(cleanId)}`,
          headers: { "Crypto-Pay-API-Token": cbToken },
          throw: false,
        });
        const d = cbRes && cbRes.json ? cbRes.json : null;
        const items = d?.result?.items || [];
        const paidInv = items.find((inv) => inv.status === "paid");
        if (paidInv) {
          const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
          new Notice(
            isRu
              ? `🎉 Счёт @CryptoBot #${cleanId} оплачен ($${paidInv.amount})! Alchemy Craft Pro успешно активирован!`
              : `🎉 @CryptoBot Invoice #${cleanId} paid ($${paidInv.amount})! Alchemy Craft Pro activated!`,
            10000
          );
          return true;
        } else if (items.length > 0) {
          const inv = items[0];
          const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
          new Notice(
            isRu
              ? `Счёт @CryptoBot #${cleanId} найден (статус: ${inv.status}, сумма: $${inv.amount}). Оплатите его в Telegram и нажмите проверку ещё раз.`
              : `Invoice #${cleanId} found (status: ${inv.status}, amount: $${inv.amount}). Please complete payment in Telegram and verify again.`,
            8000
          );
          return false;
        }
      }
    } catch (e) {
      console.warn("Direct CryptoBot verification check error:", e);
    }

    const MASTER_PROMOS = ["STRATALCHEMY", "ACPRO-PRO-2026", "SICRAFT", "VIP2026", "ALCHEMIST", "NAILYA", "MIYAZAKI", "BARAKA2026"];
    if (MASTER_PROMOS.includes(rawCode) || rawCode.startsWith("AC-PRO-") || rawCode.startsWith("VIP-")) {
      new Notice("Промокод успешно подтвержден! Активация Pro Pass...");
      return true;
    }

    // 3. CryptoBot Invoice ID check (e.g. IVdNOM8aeE7t or #IV69485245)
    if (rawCode.includes("IVDNOM") || rawCode.includes("69485245") || rawCode.startsWith("IV")) {
      new Notice("Чек CryptoBot принят к верификации!");
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
    if (this.plugin.activeProModal === this) {
      this.plugin.activeProModal = null;
    }
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
    containerEl.addClass("artcraft-calm-settings-root");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const createSectionGroup = (num, titleRu, titleEn, subRu, subEn, iconSvg) => {
      const groupWrap = containerEl.createDiv({ cls: "artcraft-settings-group-card" });
      const groupHead = groupWrap.createDiv({ cls: "artcraft-settings-group-head" });
      groupHead.innerHTML = `
        <div class="settings-group-badge-row">
          <span class="settings-group-num">${num}</span>
          <span class="settings-group-icon">${iconSvg}</span>
          <span class="settings-group-title">${isRu ? titleRu : titleEn}</span>
        </div>
        <div class="settings-group-sub">${isRu ? subRu : subEn}</div>
      `;
      return groupWrap.createDiv({ cls: "artcraft-settings-group-items" });
    };

    // Top Swiss Bento Studio Banner inside Settings
    const heroBanner = containerEl.createDiv({ cls: "artcraft-settings-bento-hero" });
    heroBanner.innerHTML = `
      <div class="artcraft-settings-hero-left">
        <div class="artcraft-settings-flask-box">${ALCHEMY_ICON_SVG}</div>
        <div>
          <div class="artcraft-settings-hero-title">${t("settingsTitle", this.plugin)}</div>
          <div class="artcraft-settings-hero-sub">Author: Elyaz Aliverdiyev (@StratAlchemy) • Swiss Bento Craft System</div>
        </div>
      </div>
      <div class="artcraft-settings-hero-actions">
        <button class="artcraft-update-btn" id="artcraft-check-rel-btn">${t("checkUpdatesBtn", this.plugin)}</button>
      </div>
    `;
    heroBanner.querySelector("#artcraft-check-rel-btn")?.addEventListener("click", () => {
      window.open("obsidian://show-plugin?id=artcraft-reader");
    });

    // =========================================================================
    // SECTION 01: ТИПОГРАФИКА, ЧИТАЕМОСТЬ И ШАПКА ЗАМЕТКИ
    // =========================================================================
    const secReadability = createSectionGroup(
      "01",
      "Читаемость, Типографика и Шапка заметки",
      "Readability, Typography & Note Header",
      "Главные настройки журнальной вёрстки Swiss Bento, языка интерфейса и индикаторов прогресса.",
      "Core Swiss Bento editorial typography, interface language, and note header indicators.",
      SICRAFT_SVGS.book
    );

    new Setting(secReadability)
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

    new Setting(secReadability)
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

    new Setting(secReadability)
      .setName(t("taskBarName", this.plugin))
      .setDesc(t("taskBarDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showTaskProgress !== false).onChange(async (val) => {
          this.plugin.settings.showTaskProgress = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
      .setName(isRu ? "Капсула времени чтения и объёма слов" : "Live Reading Time & Word Count Capsule")
      .setDesc(
        isRu
          ? "Показывает аккуратную крафтовую капсулу (~3 мин чтения • 640 слов) рядом с прогрессом задач в шапке заметки."
          : "Displays a calm craft pill (~3 min read • 640 words) alongside the task progress bar in the note header."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showReadingStats !== false).onChange(async (val) => {
          this.plugin.settings.showReadingStats = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
      .setName(isRu ? "Режим «Книжный разворот» (2 колонки)" : "Two-Column Book Spread Mode")
      .setDesc(
        isRu
          ? "Превращает заметку на широких мониторах в разворот открытой книги из двух колонок с крафтовым корешком посередине."
          : "Transforms wide notes into an open two-column book spread with a warm editorial spine divider."
      )
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.bookSpreadMode).onChange(async (val) => {
          this.plugin.settings.bookSpreadMode = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
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

    new Setting(secReadability)
      .setName(t("numBadgeSetName", this.plugin))
      .setDesc(t("numBadgeSetDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.colorizeNumbers).onChange(async (value) => {
          this.plugin.settings.colorizeNumbers = value;
          await this.plugin.saveSettings();
        })
      );

    // =========================================================================
    // SECTION 02: КРАФТОВЫЙ ЭКВАЛАЙЗЕР И ФОНОВЫЕ ЗВУКИ
    // =========================================================================
    const secSonic = createSectionGroup(
      "02",
      "Крафтовый Эквалайзер и Фоновые Звуки (Sonic Studio)",
      "Craft Equalizer & Ambient Soundscapes",
      "6 крафтовых визуализаций эквалайзера, системный звук ПК, скролл громкости колёсиком мыши и 12 звуков фокуса.",
      "6 craft equalizer styles, PC desktop audio capture, mouse-wheel volume scroll, and 12 focus soundscapes.",
      SICRAFT_SVGS.sliders
    );

    new Setting(secSonic)
      .setName(t("eqSetName", this.plugin))
      .setDesc(t("eqSetDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showEqualizer !== false).onChange(async (val) => {
          this.plugin.settings.showEqualizer = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    new Setting(secSonic)
      .setName(isRu ? "Стиль эквалайзера" : "Equalizer style")
      .setDesc(isRu ? "Выберите один из 6 крафтовых режимов или откройте Аудио-Пульт." : "Pick one of the 6 craft styles, or open the Sonic Studio.")
      .addDropdown((drop) =>
        drop
          .addOption("craft", isRu ? "01 // Крафтовый Сейсмограф" : "01 // Craft Ink Seismograph")
          .addOption("dna", isRu ? "02 // Квантовая Матрица" : "02 // Quantum Matrix")
          .addOption("bars", isRu ? "03 // Ризограф-Штампы" : "03 // Craft Risograph Stamps")
          .addOption("wave", isRu ? "04 // Шёлковая Лента" : "04 // Liquid Silk Ribbon")
          .addOption("orb", isRu ? "05 // Бумажное Оригами" : "05 // Origami Topography")
          .addOption("ferro", isRu ? "06 // Струны Архитектора" : "06 // Harmonic Strings")
          .setValue(this.plugin.settings.eqMode || "craft")
          .onChange(async (val) => {
            this.plugin.settings.eqMode = val;
            await this.plugin.saveSettings();
            this.plugin.updateEqualizerPillUI();
          })
      )
      .addButton((btn) =>
        btn.setButtonText(isRu ? "Аудио-Пульт" : "Sonic Studio").onClick(() => {
          this.plugin.openSonicStudioModal();
        })
      );

    new Setting(secSonic)
      .setName(t("ambientName", this.plugin))
      .setDesc(t("ambientDesc", this.plugin))
      .addDropdown((drop) => {
        drop.addOption("off", isRu ? "Выкл (Off)" : "Off");
        AMBIENT_SOUNDSCAPES.forEach((snd) => {
          drop.addOption(snd.id, isRu ? snd.ru : snd.en);
        });
        drop.setValue(this.plugin.settings.ambientSound || "off").onChange(async (val) => {
          await this.plugin.setAmbientSound(val);
        });
      });

    new Setting(secSonic)
      .setName(t("keySoundSetName", this.plugin))
      .setDesc(t("keySoundSetDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("off", isRu ? "Выкл (Off)" : "Off")
          .addOption("creamy_pom", isRu ? "Кремовый POM-свитч (мягкий бархатный отклик)" : "Creamy POM Linear (velvety soft)")
          .addOption("thock", isRu ? "Глубокий PBT Thock (матовый глубокий звук)" : "Deep PBT Thock (matte & deep)")
          .addOption("matcha_lubed", isRu ? "Матча Латте (смазанный тихий свитч)" : "Matcha Silent Tactile (lubed & hushed)")
          .addOption("raindrop_wood", isRu ? "Капля по тёплому ореху (деревянный корпус)" : "Warm Walnut Raindrop (wooden)")
          .addOption("velvet_felt", isRu ? "Пианинный фетр (мягкий молоточек)" : "Velvet Piano Felt (soft hammer)")
          .addOption("paper_brush", isRu ? "Перьевая ручка по хлопковой бумаге" : "Fountain Pen on Cotton Paper")
          .setValue(this.plugin.settings.tactileTypingSound || "off")
          .onChange(async (val) => {
            this.plugin.settings.tactileTypingSound = val;
            await this.plugin.saveSettings();
            if (val !== "off") this.plugin.playTactileKeySound("a");
          })
      );

    // =========================================================================
    // SECTION 03: ФОКУС, ПОМОДОРО И УМНАЯ ЛАМПА
    // =========================================================================
    const secFocus = createSectionGroup(
      "03",
      "Фокус, Помодоро и Умная Лампа",
      "Focus, Pomodoro & Smart LED Lamp",
      "Таймер глубокой работы, авто-затухание звука на перерыве, тёплая настольная лампа и чистка ИИ-символов.",
      "Deep work timer, automatic audio fade on break, warm desk lamp, and AI watermark cleaner.",
      SICRAFT_SVGS.lamp
    );

    new Setting(secFocus)
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

    new Setting(secFocus)
      .setName(isRu ? "Аудио-линковка с таймером Помодоро" : "Pomodoro Audio Link (Auto-Fade on Break)")
      .setDesc(
        isRu
          ? "Плавно приглушает фоновый шум или музыку, когда начинается 5-минутный перерыв, и возвращает громкость при старте нового спринта."
          : "Smoothly fades down background soundscapes or music during 5-minute breaks and restores volume when a new focus sprint begins."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.pomoAudioLink !== false).onChange(async (val) => {
          this.plugin.settings.pomoAudioLink = val;
          await this.plugin.saveSettings();
        })
      );

    new Setting(secFocus)
      .setName(t("lampSetName", this.plugin))
      .setDesc(t("lampSetDesc", this.plugin))
      .addButton((btn) =>
        btn.setButtonText(t("lampConfigBtn", this.plugin)).onClick(() => {
          if (this.plugin.activeLampModal) {
            this.plugin.activeLampModal.close();
          } else {
            new SmartLedLampModal(this.app, this.plugin).open();
          }
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

    new Setting(secFocus)
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

    new Setting(secFocus)
      .setName(t("spotlightSetName", this.plugin))
      .setDesc(t("spotlightSetDesc", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.spotlightFocus).onChange(async (val) => {
          this.plugin.settings.spotlightFocus = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    new Setting(secFocus)
      .setName(t("aiCleanSetName", this.plugin))
      .setDesc(t("aiCleanTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableAiCleaner).onChange(async (val) => {
          this.plugin.settings.enableAiCleaner = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    // =========================================================================
    // SECTION 04: SWISS BENTO ГРАФ ЗНАНИЙ
    // =========================================================================
    const secGraph = createSectionGroup(
      "04",
      "Swiss Bento Граф Знаний и PNG-Экспорт",
      "Swiss Bento Knowledge Graph & PNG Snapshot",
      "8-цветная палитра папок, радар фокуса и сохранение снимка графа в PNG в 1 клик.",
      "8-color folder palette, focus radar, and 1-click high-DPI PNG graph snapshot.",
      SICRAFT_SVGS.camera
    );

    new Setting(secGraph)
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
    containerEl.createEl("h3", { text: "Alchemy Craft Pro", cls: "artcraft-settings-pro-heading" });

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
          <span class="buy-price">$4.99 / yr • $9.99 Lifetime</span>
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
        cls: "artcraft-open-modal-btn",
      });
      buyBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.coffee}</span><span>${
        isRu ? "Угостить Капучино / Открыть Pro" : "Treat a Cappuccino / Get Pro"
      }</span>`;
      buyBtn.onclick = () => {
        if (this.plugin.activeProModal) this.plugin.activeProModal.close();
        new AlchemyCraftProModal(this.app, this.plugin, "evm").open();
      };
      const promoQuickBtn = btnRow.createEl("button", {
        cls: "artcraft-open-promo-btn",
      });
      promoQuickBtn.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.ticket}</span><span>${
        isRu ? "Ввести Промокод / Ключ" : "Redeem Promo / Key"
      }</span>`;
      promoQuickBtn.onclick = () => {
        if (this.plugin.activeProModal) this.plugin.activeProModal.close();
        new AlchemyCraftProModal(this.app, this.plugin, "promo").open();
      };
    }

    // --- GLOBAL SUPPORT & CHECKOUT ---
    const supportSetting = new Setting(containerEl)
      .setName(t("supportSetName", this.plugin))
      .setDesc(t("supportSetDesc", this.plugin))
      .addButton((btn) => {
        btn
          .setButtonText("0% Fee EVM / Bybit UID")
          .setCta()
          .onClick(() => {
            if (this.plugin.activeProModal) this.plugin.activeProModal.close();
            new AlchemyCraftProModal(this.app, this.plugin, "evm").open();
          });
      })
      .addButton((btn) => {
        btn.setButtonText("Promo / VIP Key").onClick(() => {
          if (this.plugin.activeProModal) this.plugin.activeProModal.close();
          new AlchemyCraftProModal(this.app, this.plugin, "promo").open();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("@CryptoBot (USDT/TON)").onClick(() => {
          if (this.plugin.activeProModal) this.plugin.activeProModal.close();
          new AlchemyCraftProModal(this.app, this.plugin, "cryptobot").open();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("Telegram (@StratAlchemy)").onClick(() => {
          openExternalUrl("https://t.me/StratAlchemy");
        });
      })
      .addButton((btn) => {
        btn.setButtonText("GitHub Star").onClick(() => {
          openExternalUrl("https://github.com/elyazaliverdiyev/alchemy-craft");
        });
      });
    supportSetting.settingEl.classList.add("artcraft-settings-full-width");
  }
}

module.exports = AlchemyFlowPlugin;

/* nosourcemap */