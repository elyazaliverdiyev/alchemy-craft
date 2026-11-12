// Capture mouse buttons 3 & 4 at the window root to completely block history navigation in Obsidian
if (!window._artcraftMouseNavBlocker) {
  window._artcraftMouseNavBlocker = (e) => {
    if (e.button === 3 || e.button === 4) {
      const t = e.target;
      if (t && t.closest && t.closest(".artcraft-dock-eq-pill, .artcraft-floating-dock, .artcraft-island-capsule, .artcraft-pomodoro-popover")) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      }
    }
  };
  window.addEventListener("pointerdown", window._artcraftMouseNavBlocker, { capture: true });
  window.addEventListener("mousedown", window._artcraftMouseNavBlocker, { capture: true });
  window.addEventListener("mouseup", window._artcraftMouseNavBlocker, { capture: true });
  window.addEventListener("auxclick", window._artcraftMouseNavBlocker, { capture: true });
}

const { Plugin, PluginSettingTab, Setting, Notice, Modal, Menu, addIcon } = require("obsidian");

const DEFAULT_SETTINGS = {
  uiLanguage: "en", // "en" | "ru" | "zh" | "ja" | "es" | "de" (auto-detected on first load from Obsidian language)
  artcraftTheme: true,
  headerTagText: "STRATALCHEMY // KNOWLEDGE BRIEF",
  showHeaderTag: false, // the brand tag above every note title is opt-in
  hoverCards: true,
  sentenceFocus: true,
  colorizeNumbers: true,
  showFloatingDock: true,
  dockCollapsed: false,
  dockVertical: false,
  showTaskProgress: true,
  strokeColor: "#2563EB",
  activeColorKey: "blue",
  laserSize: 6,
  laserColor: "#EF4444",
  laserTrailMs: 420,
  drawSize: 4,
  drawColor: "#2563EB",
  drawOpacity: 90,
  drawStyle: "pen",
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
  audioInputDeviceId: "auto", // "auto" | deviceId of a chosen microphone / input device
  systemAudioAutoConnect: false, // reconnect PC audio (Windows output loopback) on launch; set when the user connects it
  lampBeatSync: false, // the cursor lamp breathes on bass beats of the connected audio
  keySentenceMarker: true,
  keyMarkerColor: "lime", // "lime" | "amber" | "rose" | "sky" | "lavender" // reading view: underline the sentences that carry the note's subject
  pageCards: false, // false: plain typographic page and a quiet dock; true: heading cards, coloured bars, bold dock
  showEqualizer: true,
  eqMode: "craft", // "bars" (Risograph) | "wave" (Ink Ribbon) | "orb" (Compass) | "dna" (Quantum Matrix) | "craft" (Craft Ink) | "ferro" (Espresso Ferro)
  audioVolume: 75, // 0..100%
  pomoAudioLink: true, // Auto-fade audio on Pomodoro break & resume on focus sprint
  showReadingStats: true, // Live Reading Time & Word Count capsule
  bookSpreadMode: false, // Multi-Sheet 3D Hardcover Book Folio mode
  breathingSpine: false, // Coherent 6-BPM (5.5s Inhale / 5.5s Exhale) Breathing Book Spine Pacer
  marginSandglass: false, // Removed in 4.6.2 (distracting peripheral thread) — kept only for settings compatibility
  tourOffered: false, // One-time welcome notice offering the Interactive Tour note
  readingPacer: false, // Acoustic Speed-Reading Pacer (300 WPM gliding line guide)
  readingPacerWpm: 300,
  waxSealNotes: {}, // { [filePath]: { sealedAt, unlockDate, note } }
  spineMaterial: "cognac", // "cognac" | "emerald" | "crimson" | "linen"
  chronoInkAging: true, // Subtle archival ink maturation based on note age
  chapterChord: true, // Warm Cello & Harp harmonic chord on checklist completion
  stampedNotes: {}, // { [filePath]: "2026-11-07" }
  marginBookmarks: {}, // { [filePath]: Array<{ id, type, label, snippet, line }> }
  readingRuler: false,
  supabaseFunctionUrl: "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay",
  spotlightFocus: false,
  enableBentoGraph: true,
  graphPreset: "bento", // "bento" | "mindpalace" | "constellation" | "radar"
  graphColorMode: "folders", // "folders" | "heatmap" | "recency" | "nutrients"
  graphFilterMode: "all", // "all" | "hubs" | "stamped" | "no_orphans"
  familiarAnimationMode: "auto", // "auto" | "paw" | "smile" | "ears" | "astrolabe" | "phoenix"
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
  },
  nightLightCompensation: false,
  surfaceMode: "white", // "white" (SWISS EDITORIAL Pure White #FFFFFF) | "book" (Warm Book #FAF8F3) | "grain" (Archival Grain Paper)
  pageWidthMode: "book", // "book" (760px Classic Book) | "wide" (1080px Studio Wide) | "full" (94% Full Canvas)
  bionicAnchors: false, // Saccadic Bionic Word-Root Fixation Anchors for fast wall-of-text scanning
  wasmAcceleration: true, // Embedded WebAssembly (WASM) 144 FPS Spring & Graph Physics Core
  dualCognitionBrief: true, // v5.2.0 Human x AI Dual-Cognition Executive Brief & llms.txt Compiler
  wasmSemanticRadar: true, // v5.2.0 WASM 64-Bit SimHash Offline Semantic Connection Radar
  ideCodeStudio: true, // v5.3.0 IDE Poly-Chromatic Code Blocks with 5 Palettes & Line Numbers
  codeThemePalette: "vscode-dark", // "vscode-dark" | "tokyo-night" | "monokai-pro" | "catppuccin" | "alabaster-light"
  windChainFooter: true, // related notes on threads under the note
  bespokeSidebarIcons: true, // v5.3.0 Custom Duotone Squircle Folder & Note Icons + Counts
  customFolderIcons: {}, // Custom user-assigned icon keys per folder/file path
  noteBlockchain: [], // Immutable chain of linked notes [{ path, title, prevHash, hash, ts }]
  paperGrain: 42, // 0..100% micro-grain intensity // Calibrated Cool Alabaster & Crisp Slate Ink for Windows 11 Night Light users
  editorialCleanMode: true, // Swiss Craft tactile block isolation without harsh neo-brutalist black borders
  lifeRpg: {
    antiVision: "",
    visionMvp: "",
    oneYearMission: "",
    oneMonthBoss: "",
    dailyLevers: [],
    constraints: "",
    xp: 0,
    level: 1
  },
  questBlockchain: [
    {
      index: 0,
      timestamp: "2026-11-09T09:00:00.000Z",
      quest: "GENESIS BLOCK // ALCHEMY CRAFT LIFE RPG LEDGER",
      notePath: "Vault Root",
      xp: 100,
      prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: "0000a48f9c2e71b8d34e19a8c50f62d4e89b12c34f56a78b90c12d34e56f789a",
      nonce: 480
    }
  ],
  bioFlow: {
    energy: 82,
    challenge: 76,
    skill: 78,
    entropyPhase: "low", // "low" (Morning Deep Work) | "mid" (Afternoon Linear) | "high" (Evening Recovery)
    moodTag: "deep_focus",
    history: []
  },
  onChainConfig: {
    network: "base-sepolia", // "base-sepolia" ($0 Free Testnet) | "base-mainnet" | "opbnb" | "polygon-amoy" | "arbitrum"
    contractAddress: "0x" + "e55230492ec0e029481fd72f5DAbf5d3B4127e03",
    walletAddress: "",
    lastAnchoredHash: "",
    lastAnchorTx: "",
    lastAnchoredTx: "",
    lastAnchoredAt: "",
    verifiedPatron: false,
    isVerifiedOnChain: false
  },
  autopilotAlarms: {
    enabled: false,
    times: ["11:00", "13:30", "15:15", "17:00", "19:30"],
    lastTriggeredKey: "",
    reflections: []
  },
  creatorOs: {
    brandVoice: "Прямой, структурный, без воды — синтез архитектуры глубокой работы, математики высокой ценности и швейцарской визуальной чистоты.",
    coreAudience: "Создатели ИИ-продуктов, вайбкодеры, исследователи и авторы в Obsidian, которые устали от стены серого текста.",
    flagshipOffer: "Alchemy Craft Pro — превращение Obsidian в живую книгу, систему квестов с SHA-256 блокчейном и студию контента.",
    contentPillar: "Когнитивная архитектура, фокус и визуальное мышление"
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
  eqStrings: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c4-4 6 4 10 0s6-4 10 0"/><path d="M2 12c4 4 6-4 10 0s6 4 10 0"/><path d="M2 18c4-4 6 4 10 0s6-4 10 0" opacity="0.6"/></svg>`,
  shelf: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 7h6"/><path d="M9 11h4"/></svg>`,
  sandglass: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
  lung: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="M12 10c-3-2-7-1-8 3-1 4 0 8 4 8 2.5 0 4-2 4-5"/><path d="M12 10c3-2 7-1 8 3 1 4 0 8-4 8-2.5 0-4-2-4-5"/></svg>`,
  chain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  pulse: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  palette: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`
};

// Always open external URLs in the user's default OS browser (Chrome/Safari/Edge/Telegram Desktop), bypassing Obsidian's internal Web Viewer!

const EXTRA_SICRAFT_SVGS = {
  chain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  pulse: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  palette: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  envelope: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  eye: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  unlock: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  grain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="18" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="18" cy="18" r="1"/></svg>`,
  sparkle: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>`,
  compass: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  target: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`
};
Object.assign(SICRAFT_SVGS, EXTRA_SICRAFT_SVGS);
function sicraftIcon(key) {
  return SICRAFT_SVGS[key] || EXTRA_SICRAFT_SVGS[key] || SICRAFT_SVGS.spark || "";
}

function openExternalUrl(url) {
  if (!url) return;
  try {
    const electron = window.require ? window.require("electron") : (typeof require !== "undefined" ? require("electron") : null);
    if (electron && electron.shell && typeof electron.shell.openExternal === "function") {
      electron.shell.openExternal(url);
      return;
    }
  } catch (err) {
    console.warn("openExternalUrl electron error:", err);
  }
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.warn("openExternalUrl fallback error:", e);
  }
}

// Verified Pro Badge (8-Point Certified Rosette with White Checkmark)
const PRO_VERIFIED_BADGE_SVG = `<svg class="artcraft-pro-verified-badge" viewBox="0 0 22 22" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: -2.5px; display: inline-block; flex-shrink: 0; margin-left: 3px;">
  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.887-1.687-.47-.47-1.054-.775-1.688-.905-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.275.213-1.816.568-.54.355-.972.852-1.246 1.44-.608-.223-1.267-.27-1.902-.14-.635.13-1.22.436-1.69.887-.47.47-.775 1.054-.905 1.688-.13.633-.083 1.29.14 1.897-.587.274-1.086.705-1.44 1.246-.355.54-.551 1.17-.569 1.816.018.646.214 1.275.569 1.816.354.54.853.972 1.44 1.246-.224.608-.27 1.264-.14 1.897.13.634.435 1.218.887 1.688.47.47 1.054.775 1.688.905.633.13 1.29.083 1.897-.14.274.587.705 1.086 1.246 1.44.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z" fill="#1D9BF0"/>
  <path d="M9.684 15.5l-3.39-3.39 1.414-1.414 1.976 1.975 6.22-6.22 1.414 1.414-7.634 7.635z" fill="#FFFFFF"/>
</svg>`;

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
    addIcon("sicraft-check", wrap(`<polyline points="20 6 9 17 4 12"/>`));
    addIcon("sicraft-spark", wrap(`<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>`));
  } catch (e) {}
}
const ALCHEMY_ICON_SVG = `<svg class="artcraft-svg-flask" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path class="artcraft-flask-liquid-back" d="M6.4 16.0C8.4 17.4 10.6 14.8 12.6 16.0C14.6 17.2 16.4 15.2 17.7 16.0L17.9 20H6.1L6.4 16.0Z" fill="#22C55E" opacity="0.52" />
  <path class="artcraft-flask-liquid" d="M6.1 16.4C8.2 14.9 10.2 17.3 12.2 16.1C14.2 14.9 16.1 17.1 17.9 16.3L17.9 20H6.1L6.1 16.4Z" fill="#69BD28" opacity="0.94" />
  <path class="artcraft-flask-meniscus" d="M6.3 16.3C8.3 15.0 10.2 17.2 12.2 16.0C14.2 14.8 16.1 17.0 17.7 16.2" stroke="#BBF7D0" stroke-width="0.95" stroke-linecap="round" opacity="0.88" />
  <circle class="artcraft-flask-bubble b1" cx="9.4" cy="17.8" r="1.05" fill="#FFFFFF" opacity="0.92" />
  <circle class="artcraft-flask-bubble b2" cx="13.6" cy="17.2" r="0.8" fill="#DCFCE7" opacity="0.9" />
  <circle class="artcraft-flask-bubble b3" cx="11.6" cy="18.5" r="0.65" fill="#FFFFFF" opacity="0.85" />
  <circle class="artcraft-flask-bubble b4" cx="15.1" cy="18.2" r="0.55" fill="#FEF08A" opacity="0.85" />
  <circle class="artcraft-flask-spark s1" cx="11.8" cy="7.2" r="0.9" fill="#F59E0B" />
  <circle class="artcraft-flask-spark s2" cx="13.2" cy="5.2" r="0.6" fill="#34D399" />
  <path d="M9 3H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M10 3V8L4.5 17.5C3.8 18.7 4.7 20.2 6.1 20.2H17.9C19.3 20.2 20.2 18.7 19.5 17.5L14 8V3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
  <path class="artcraft-flask-glass-glint" d="M7.2 14.5L5.7 17.2C5.4 17.8 5.7 18.5 6.4 18.6" stroke="#FFFFFF" stroke-width="1.0" stroke-linecap="round" opacity="0.68" />
</svg>`;

const TRANSLATIONS = {
  en: {
    eqTip: "LMB: Cycle 4 Pro Visualizers | RMB: Audio Menu & Sync Desktop Music (Telegram/Spotify/YouTube)",
    audioSyncSystem: "Desktop Audio Loopback (Telegram / YouTube / Spotify)",
    audioSyncMic: "Microphone / Stereo Mix Input",
    audioStopSync: "Stop Live Audio Sync",
    audioModeBars: "01 // Spectrum (Peak-Hold)",
    audioModeWave: "02 // Silk Wave",
    audioModeOrb: "03 // Compass Orb",
    audioModeDna: "04 // Matrix Rain",
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
    uiTip: "Swiss Craft UI Theme (Warm Paper #F4F3EF + Sage Green Tables)",
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
    lampTip: "Click: lamp on or off. Right-click: settings",
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
    modalSubtitle: "Annual pass for the price of one coffee ($4.99 / yr). Instant activation via EVM transfer, Bybit UID, @CryptoBot, or Promo Key.",
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
    bybitNote: "In Bybit App: Assets -> Withdraw -> Internal Transfer -> enter UID 8015849 and 4.99 USDT.",
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
    proPerk3: "Swiss Craft Graph Studio — automatic vault folder coloring, orphan filter & live HUD",
    proPerk4: "Smart LED Lamp & 4-Mode Equalizer — 2700K–6500K spotlight & desktop audio sync",
    getProBtn: "Get Alchemy Craft Pro ($4.99 / yr)",
    graphHudTitle: "ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Craft",
    graphPresetConstellation: "Constellation",
    graphPresetRadar: "Focus Radar",
    graphColorizeBtn: "Colorize My Vault",
    graphOrphansBtn: "Hide Orphans",
    settingsTitle: "Alchemy Craft — Tactile Swiss Craft Studio",
    checkUpdatesBtn: "Check Updates",
    langName: "Interface Language (6 Global Languages)",
    langDesc: "Instantly translates all settings, floating dock buttons, Graph HUD, and modals.",
    themeName: "Swiss Craft UI Theme (#F4F3EF + #69BD28 Tables)",
    bentoGraphName: "Swiss Craft Graph Studio & Auto-Coloring",
    bentoGraphDesc: "Scans your actual vault folders and colors every node in the Graph View with Swiss Craft palette + adds Constellation & Radar HUD.",
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
    supportHeading: "Direct Checkout, @CryptoBot & Community",
    supportSetName: "Global Payment & Direct Author Contact",
    supportSetDesc: "Manage license verification, author contact, and support for Alchemy Craft Pro."
  },
  ru: {
    eqTip: "ЛКМ: Смена 4 визуализаторов | ПКМ: Подключить звук ПК (Telegram/YouTube/Spotify) или Эмбиент",
    audioSyncSystem: "Системный звук ПК (Telegram / YouTube / Spotify)",
    audioSyncMic: "Микрофон / Стерео микшер",
    audioStopSync: "Остановить синхронизацию звука",
    audioModeBars: "01 // Спектр (Peak-Hold)",
    audioModeWave: "02 // Шёлковая Волна",
    audioModeOrb: "03 // Сфера Компас",
    audioModeDna: "04 // Матрица Знаний",
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
    uiTip: "Теплый бумажный режим Swiss Craft UI (#F4F3EF) + зеленые таблицы",
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
    lampTip: "Клик: включить или выключить лампу. Правый клик: настройки",
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
    modalSubtitle: "Годовой доступ по цене чашки кофе ($4.99 / год). Мгновенная активация через EVM, Bybit UID, @CryptoBot или Промокод.",
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
    bybitNote: "В приложении Bybit: Активы -> Вывод -> Внутренний перевод -> укажите UID 8015849 и 4.99 USDT.",
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
    proPerk3: "Swiss Craft Graph Studio — авто-раскраска всех папок вашей базы и скрытие мусорных точек",
    proPerk4: "Умная Лампа 2700K–6500K и 4-режимный Эквалайзер со звуком ПК (Telegram/Spotify)",
    getProBtn: "Получить Alchemy Craft Pro ($4.99 / год)",
    graphHudTitle: "ALCHEMY BENTO ГРАФ",
    graphPresetBento: "Swiss Craft",
    graphPresetConstellation: "Созвездие",
    graphPresetRadar: "Фокус Радар",
    graphColorizeBtn: "Раскрасить мои папки",
    graphOrphansBtn: "Без одиночек",
    settingsTitle: "Alchemy Craft — Tactile Swiss Craft Studio",
    checkUpdatesBtn: "Проверить обновления",
    langName: "Язык интерфейса (6 мировых языков)",
    langDesc: "Мгновенно переводит все настройки, кнопки панели, Граф и окно оплаты на выбранный язык.",
    themeName: "Стиль Swiss Craft UI (Теплая бумага #F4F3EF + зеленые таблицы)",
    bentoGraphName: "Улучшенный Граф (Swiss Craft Graph Studio)",
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
    supportHeading: "Прямая оплата, @CryptoBot и Сообщество",
    supportSetName: "Глобальная оплата и связь с автором",
    supportSetDesc: "Оплата через Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 или в 1 клик через @CryptoBot."
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
    lampTip: "左键：开关台灯 | 右键：设置",
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
    modalSubtitle: "仅需一杯咖啡的价格 ($4.99 / 年)。支持 EVM、Bybit UID、@CryptoBot 及激活码。",
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
    settingsTitle: "Alchemy Craft — 瑞士 Bento 阅读、图谱与专注系统",
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
    supportHeading: "直付、@CryptoBot 与社区支持",
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
    uiTip: "Swiss Craft UI テーマ（アーカイブ紙 #F4F3EF ＆ Excelグリーン表）",
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
    lampTip: "左クリック：ランプ切替 | 右クリック：設定",
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
    modalSubtitle: "コーヒー1杯分の価格 ($4.99 / 年)。EVM、Bybit UID、@CryptoBot、プロモコードで即座に有効化。",
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
    proPerk3: "Swiss Craft グラフスタジオ — フォルダ自動カラーリング＆専用HUD",
    proPerk4: "2700K–6500K スマートLEDランプ＆PC音楽連動4モードイコライザー",
    getProBtn: "Alchemy Craft Pro を入手 ($4.99 / 年)",
    graphHudTitle: "ALCHEMY BENTO グラフ",
    graphPresetBento: "Swiss Craft",
    graphPresetConstellation: "星座モード",
    graphPresetRadar: "レーダー",
    graphColorizeBtn: "フォルダ自動色分け",
    graphOrphansBtn: "孤立ノード非表示",
    settingsTitle: "Alchemy Craft — Tactile Swiss Craft Studio",
    checkUpdatesBtn: "アップデート確認",
    langName: "インターフェース言語 (6ヶ国語対応)",
    langDesc: "すべての設定項目、ドック、グラフHUD、決済画面を選択した言語に切り替えます。",
    themeName: "Swiss Craft UI テーマ (#F4F3EF 紙キャンバス + #69BD28 表)",
    bentoGraphName: "Swiss Craft グラフスタジオ (自動フォルダ色分け)",
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
    supportHeading: "直接決済、@CryptoBot ＆ コミュニティ",
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
    uiTip: "Tema Swiss Craft UI (Papel cálido #F4F3EF + Tablas verde salvia)",
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
    lampTip: "Clic: encender o apagar la lámpara. Clic derecho: ajustes",
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
    modalSubtitle: "Pase anual por el precio de un café ($4.99 / año). Pago directo vía EVM, Bybit UID, @CryptoBot o Código Promo.",
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
    proPerk3: "Swiss Craft Graph Studio — coloreado automático de tus carpetas reales y HUD",
    proPerk4: "Lámpara LED 2700K–6500K y Ecualizador de 4 Modos con Audio del PC",
    getProBtn: "Obtener Alchemy Craft Pro ($4.99 / año)",
    graphHudTitle: "GRAFO ALCHEMY BENTO",
    graphPresetBento: "Swiss Craft",
    graphPresetConstellation: "Constelación",
    graphPresetRadar: "Radar Focus",
    graphColorizeBtn: "Colorear Mis Carpetas",
    graphOrphansBtn: "Ocultar Huérfanos",
    settingsTitle: "Alchemy Craft — Tactile Swiss Craft Studio",
    checkUpdatesBtn: "Buscar Actualizaciones",
    langName: "Idioma de la Interfaz (6 Idiomas Globales)",
    langDesc: "Traduce al instante todos los ajustes, botones de la barra, Grafo y ventana de pago.",
    themeName: "Tema Swiss Craft UI (Papel cálido #F4F3EF + Tablas verdes)",
    bentoGraphName: "Swiss Craft Graph Studio (Coloreado Automático de Carpetas)",
    bentoGraphDesc: "Escanea las carpetas reales de tu bóveda y asigna los 8 colores Swiss Craft a todos los nodos del Grafo.",
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
    supportHeading: "Pago Directo, @CryptoBot y Comunidad",
    supportSetName: "Pago Global y Contacto Directo con el Autor",
    supportSetDesc: "Paga vía Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 o @CryptoBot."
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
    uiTip: "Swiss Craft UI-Theme (Warmes Papier #F4F3EF + Salbeigrüne Tabellen)",
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
    lampTip: "Klick: Lampe ein/aus. Rechtsklick: Einstellungen",
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
    modalSubtitle: "Jahrespass zum Preis eines Kaffees ($4.99 / Jahr). Sofortige Aktivierung via EVM, Bybit UID, @CryptoBot oder Promo-Key.",
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
    proPerk3: "Swiss Craft Graph Studio — automatische Ordner-Farbgruppen & Live-HUD",
    proPerk4: "Smart LED Lampe (2700K–6500K) & 4-Modus PC-Audio-Equalizer",
    getProBtn: "Alchemy Craft Pro holen ($4.99 / Jahr)",
    graphHudTitle: "ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Craft",
    graphPresetConstellation: "Konstellation",
    graphPresetRadar: "Fokus-Radar",
    graphColorizeBtn: "Meine Ordner färben",
    graphOrphansBtn: "Waisen ausblenden",
    settingsTitle: "Alchemy Craft — Tactile Swiss Craft Studio",
    checkUpdatesBtn: "Updates prüfen",
    langName: "Oberflächensprache (6 Weltsprachen)",
    langDesc: "Übersetzt sofort alle Einstellungen, Dock-Buttons, Graph-HUD und das Checkout-Fenster.",
    themeName: "Swiss Craft UI-Theme (#F4F3EF Papier + #69BD28 Tabellen)",
    bentoGraphName: "Swiss Craft Graph Studio (Automatische Ordner-Farben)",
    bentoGraphDesc: "Scannt deine echten Ordner und weist jedem Knoten im Graphen automatisch die 8 Swiss Craft Farben zu.",
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
    supportHeading: "Direkter Checkout, @CryptoBot & Community",
    supportSetName: "Globale Zahlung & Direkter Autorenkontakt",
    supportSetDesc: "Zahlung via Universal EVM (BEP20, Arbitrum, Base, Polygon), Bybit UID 8015849 oder @CryptoBot."
  }
};
const SUPPORTED_LANGS = ["en", "ru", "zh", "ja", "es", "de"];

const LOCALE_TAGS = {
  en: "en-US",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  de: "de-DE",
};

function getLocale(plugin) {
  const chosen = plugin?.settings?.uiLanguage;
  if (chosen && chosen !== "auto" && SUPPORTED_LANGS.includes(chosen)) {
    return chosen;
  }
  try {
    const obsLang = (
      window.localStorage?.getItem("language") ||
      window.moment?.locale?.() ||
      document.documentElement?.lang ||
      navigator.language ||
      "en"
    ).toLowerCase();

    if (obsLang.startsWith("ru")) return "ru";
    if (obsLang.startsWith("zh")) return "zh";
    if (obsLang.startsWith("ja")) return "ja";
    if (obsLang.startsWith("es")) return "es";
    if (obsLang.startsWith("de")) return "de";
  } catch (e) {}
  return "en";
}

function t(key, plugin) {
  const loc = getLocale(plugin);
  return (TRANSLATIONS[loc] && TRANSLATIONS[loc][key]) || TRANSLATIONS["en"][key] || key;
}


const I18N_CAPSULE = {
  badge: {
    en: "TIME CAPSULE · WAX SEAL",
    ru: "КАПСУЛА ВРЕМЕНИ · СУРГУЧНАЯ ПЕЧАТЬ",
    zh: "时间胶囊 · 火漆封印",
    ja: "タイムカプセル · 封蝋印",
    es: "CÁPSULA DEL TIEMPO · SELLO DE LACRE",
    de: "ZEITKAPSEL · SIEGELLACK",
  },
  title: {
    en: "Seal this note until a date",
    ru: "Запечатать заметку до даты",
    zh: "将此笔记封存至指定日期",
    ja: "このノートを指定日まで封印",
    es: "Sellar esta nota hasta una fecha",
    de: "Diese Notiz bis zu einem Datum versiegeln",
  },
  step1Title: {
    en: "The seal hides the text",
    ru: "Печать скрывает текст",
    zh: "封印隐藏正文",
    ja: "印が本文を隠します",
    es: "El sello oculta el texto",
    de: "Das Siegel verbirgt den Text",
  },
  step1Desc: {
    en: "The file isn't changed or encrypted — it's a visual capsule for active recall.",
    ru: "Файл не меняется и не шифруется — это визуальная капсула для активного припоминания.",
    zh: "文件未被修改或加密——这是一种用于主动回忆的视觉记忆胶囊。",
    ja: "ファイルは暗号化も変更もされません。能動的な想起のための視覚的カプセルです。",
    es: "El archivo no se modifica ni se encripta: es una cápsula visual para el recuerdo activo.",
    de: "Die Datei wird weder verändert noch verschlüsselt — eine visuelle Kapsel für aktives Erinnern.",
  },
  step2Title: {
    en: "Recall from your question",
    ru: "Вспоминайте по вопросу",
    zh: "根据问题主动回忆",
    ja: "問いから要点を想起",
    es: "Recuerda a partir de tu pregunta",
    de: "Aus der eigenen Frage erinnern",
  },
  step2Desc: {
    en: "While the countdown runs, try to recall the essence. Early open: hold the seal for 1.5 seconds.",
    ru: "Пока идёт отсчёт, пытайтесь вспомнить суть. Досрочно — удерживать печать 1,5 секунды.",
    zh: "倒计时期间，尝试复述核心观点。提前开封：长按印章1.5秒。",
    ja: "カウントダウン中、要点を思い出してください。早期開封：印を1.5秒長押し。",
    es: "Durante la cuenta regresiva, intenta recordar lo esencial. Apertura anticipada: mantén presionado el sello 1,5 s.",
    de: "Während der Countdown läuft, erinnere den Kern. Vorzeitiges Öffnen: Siegel 1,5 Sekunden gedrückt halten.",
  },
  step3Title: {
    en: "Open it on time",
    ru: "Вскройте в срок",
    zh: "准时开封验证",
    ja: "期日に開封して照合",
    es: "Ábrela a tiempo",
    de: "Pünktlich öffnen",
  },
  step3Desc: {
    en: "On the day you'll get a notice and the seal turns gold. Compare your answer with the text.",
    ru: "В день вскрытия придёт уведомление, печать засияет золотом. Сравните ответ с текстом.",
    zh: "开封日系统将弹出通知，火漆印转为金色。比对你的记忆与原笔记。",
    ja: "開封日に通知が届き、印が黄金色に輝きます。想起した記憶と本文を照合してください。",
    es: "El día de apertura recibirás un aviso y el sello brillará en oro. Compara tu respuesta.",
    de: "Am Öffnungstag erhältst du eine Benachrichtigung und das Siegel wird golden. Vergleiche deine Erinnerung.",
  },
  unlockAfter: {
    en: "UNLOCK AFTER",
    ru: "СРОК ВСКРЫТИЯ",
    zh: "解锁期限",
    ja: "封印期間",
    es: "PLAZO DE DESBLOQUEO",
    de: "VERSIEGELUNGSDAUER",
  },
  orDate: {
    en: "or date",
    ru: "или дата",
    zh: "或指定日期",
    ja: "または日付",
    es: "o fecha",
    de: "oder Datum",
  },
  questionLabel: {
    en: "QUESTION TO SELF OR LETTER TO THE FUTURE (OPTIONAL)",
    ru: "ВОПРОС СЕБЕ ИЛИ ПИСЬМО В БУДУЩЕЕ (НЕОБЯЗАТЕЛЬНО)",
    zh: "给自己的提问或写给未来的信（可选）",
    ja: "自分への問い、または未来への手紙（任意）",
    es: "PREGUNTA A UNO MISMO O CARTA AL FUTURO (OPCIONAL)",
    de: "FRAGE AN SICH SELBST ODER BRIEF AN DIE ZUKUNFT (OPTIONAL)",
  },
  questionPlaceholder: {
    en: "e.g. What are the 3 key ideas of this chapter and what will I do with them?",
    ru: "Например: какие 3 главные идеи этой главы и что я с ними сделаю?",
    zh: "例如：本章的3个核心要点是什么？我将如何付诸实践？",
    ja: "例：この章の3つの要点と、それをどう実践するか？",
    es: "P. ej.: ¿Cuáles son las 3 ideas clave de este capítulo y cómo las aplicaré?",
    de: "Z. B.: Was sind die 3 Kernideen dieses Kapitels und wie setze ich sie um?",
  },
  cancel: {
    en: "Cancel",
    ru: "Отмена",
    zh: "取消",
    ja: "キャンセル",
    es: "Cancelar",
    de: "Abbrechen",
  },
  sealBtn: {
    en: "Seal note",
    ru: "Запечатать",
    zh: "封存笔记",
    ja: "ノートを封印",
    es: "Sellar nota",
    de: "Notiz versiegeln",
  },
  summaryPrefix: {
    en: "The seal can be opened on: ",
    ru: "Печать можно будет вскрыть: ",
    zh: "解封开放时间：",
    ja: "開封可能日時: ",
    es: "El sello se podrá abrir el: ",
    de: "Das Siegel kann geöffnet werden am: ",
  },
  datePlaceholder: {
    en: "YYYY-MM-DD",
    ru: "ГГГГ-ММ-ДД",
    zh: "年-月-日",
    ja: "年/月/日",
    es: "AAAA-MM-DD",
    de: "JJJJ-MM-TT",
  },
  presets: [
    { d: 1, en: "1 day", ru: "1 день", zh: "1天", ja: "1日", es: "1 día", de: "1 Tag" },
    { d: 3, en: "3 days", ru: "3 дня", zh: "3天", ja: "3日", es: "3 días", de: "3 Tage" },
    { d: 7, en: "1 week", ru: "1 неделя", zh: "1周", ja: "1週間", es: "1 semana", de: "1 Woche" },
    { d: 14, en: "2 weeks", ru: "2 недели", zh: "2周", ja: "2週間", es: "2 semanas", de: "2 Wochen" },
    { d: 30, en: "1 month", ru: "1 месяц", zh: "1个月", ja: "1か月", es: "1 mes", de: "1 Monat" },
  ],
};

function i18n(dict, plugin) {
  if (!dict) return "";
  const loc = getLocale(plugin);
  return dict[loc] || dict["en"] || dict["ru"] || Object.values(dict)[0] || "";
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

// --- Shared helpers ---
// Escapes text for use inside an HTML template (element content or a quoted attribute).
function escHtml(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// A number from settings for use in a template: never a string someone typed into data.json.
function safeNum(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Today's date in the user's own time zone as YYYY-MM-DD (toISOString would give the UTC day).
function localDayKey(date) {
  const d = date || new Date();
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

// Plain text start of a note: no frontmatter, code, embeds or markup.
function kinExcerpt(raw, limit) {
  const text = String(raw || "")
    .replace(/\r\n/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[\[[^\]]*\]\]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>+\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?/gm, "")
    .replace(/[*_~`=]{1,3}/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const space = cut.lastIndexOf(" ");
  return (space > limit * 0.6 ? cut.slice(0, space) : cut) + "…";
}

// The opening part of a note as Markdown for the reading card: frontmatter and embeds removed, cut at a
// paragraph end where possible. Fences are never left open.
function kinReaderMarkdown(raw, limit) {
  let text = String(raw || "")
    .replace(/\r\n/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/!\[\[[^\]]*\]\]/g, "")
    .trim();
  if (text.length <= limit) return { text, truncated: false };
  let cut = text.slice(0, limit);
  const para = cut.lastIndexOf("\n\n");
  if (para > limit * 0.45) cut = cut.slice(0, para);
  const fences = (cut.match(/^```/gm) || []).length;
  if (fences % 2 === 1) cut += "\n```";
  return { text: cut, truncated: true };
}

// Positions of a damped spring released at 0 towards 1, sampled evenly. Used as animation keyframes so
// motion accelerates, overshoots and settles the way a physical object does.
function kinSpringFrames(stiffness, damping, samples) {
  const out = [];
  const total = 0.64;
  const steps = 240;
  const dt = total / steps;
  let x = 0;
  let v = 0;
  const every = Math.max(1, Math.floor(steps / (samples - 1)));
  for (let i = 0; i <= steps; i++) {
    if (i % every === 0 && out.length < samples - 1) out.push(x);
    v += (-stiffness * (x - 1) - damping * v) * dt;
    x += v * dt;
  }
  out.push(1);
  return out;
}

// --- Key sentence marker: text helpers (pure functions, no DOM) ---
const KEY_STOPWORDS = new Set(
  (
    "это как так что чтобы или его она они оно мы вы ты он для при над под про без из за на по до от об во со не ни да но же ли бы был была были быть есть нет уже ещё еще " +
    "очень только также тоже там тут здесь где когда если то тем чем кто эти этот эта этих этим того этой такой такая такие свой своя свои свою наш ваш их её ее ему ей им " +
    "нас вас них нее него себя себе мне меня мной тебя тебе который которая которые которых которой между через после перед более менее всё все всех всего весь вся можно нужно надо будет будут " +
    "the and for are but not you all any can had her was one our out has have this that with from they will would there their what which when your were been than then them these those into " +
    "also about just only over such some more most other its his she him who how why where while does did each very much many may might must should could being both between after before because"
  ).split(/\s+/)
);

const KEY_CUE_RE =
  /(?:^|[^a-zа-яё])(?:главн|важн|ключев|итог|вывод|поэтому|значит|следовательно|суть|нужно|правило|причин|результат|задач|therefore|important|key\s|in short|the point|means|must|result|rule|because|so that)/i;

function keyPlainText(line) {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/!\[\[[^\]]*\]\]/g, " ")
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*>+\s?/, "")
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?/, "")
    .replace(/[*_~=]{1,3}/g, "")
    .replace(/<[^>]+>/g, " ");
}

function keyWords(text) {
  const found = text.toLowerCase().match(/[a-zа-яё][a-zа-яё'-]{2,}/g) || [];
  return found.filter((w) => !KEY_STOPWORDS.has(w));
}

// Crude stem: enough to fold Russian case endings and English plurals into one bucket.
function keyStem(word) {
  return word.length > 5 ? word.slice(0, 5) : word;
}

function keyScoreSentence(text, weights) {
  const wordCount = (text.match(/[A-Za-zА-Яа-яЁё0-9][A-Za-zА-Яа-яЁё0-9'-]*/g) || []).length;
  if (wordCount < 6 || wordCount > 42) return 0;
  const seen = new Set();
  let sum = 0;
  keyWords(text).forEach((w) => {
    const st = keyStem(w);
    if (seen.has(st)) return;
    seen.add(st);
    sum += weights.get(st) || 0;
  });
  let score = sum / Math.sqrt(wordCount);
  if (/\d/.test(text)) score *= 1.12;
  if (KEY_CUE_RE.test(text)) score *= 1.18;
  return score;
}

// Sentence ranges in a text. A dot inside a number ("1.5"), after an initial or a common abbreviation
// ("т. е.", "e.g."), or before a lowercase word is not treated as the end of a sentence.
function keySplitSentences(text) {
  const out = [];
  let start = 0;
  const push = (end) => {
    let s = start;
    while (s < end && /\s/.test(text[s])) s++;
    if (end > s) out.push({ start: s, end });
    start = end;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "." && ch !== "!" && ch !== "?" && ch !== "…") continue;
    let j = i;
    while (j + 1 < text.length && ".!?…".includes(text[j + 1])) j++;
    while (j + 1 < text.length && "»\"”’)".includes(text[j + 1])) j++;
    const rest = text.slice(j + 1);
    if (!rest.trim()) {
      push(text.length);
      return out;
    }
    const after = rest.match(/^\s+(\S)/);
    let boundary = !!after && /[A-ZА-ЯЁ0-9«"“(\[—–-]/.test(after[1]);
    if (boundary && ch === "." && j === i) {
      const last = (text.slice(start, i).match(/(\S+)$/) || ["", ""])[1].replace(/^[«"“(]+/, "");
      if (/^(?:[A-Za-zА-Яа-яЁё]|т|г|гг|ул|им|др|пр|см|стр|рис|тыс|млн|vs|etc|e\.g|i\.e|mr|mrs|dr|no|fig)$/i.test(last)) boundary = false;
    }
    if (boundary) push(j + 1);
    i = j;
  }
  if (start < text.length && text.slice(start).trim()) push(text.length);
  return out;
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
            <h3 class="artcraft-modal-title">${sicraftIcon('lamp')} ${t("ledModalTitle", this.plugin)}</h3>
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
          <input type="range" id="led-rad-slider" min="140" max="600" value="${safeNum(s.lampRadius, 310)}" class="sicraft-led-slider" />
          <div class="sicraft-kelvin-presets" style="margin-top:8px; grid-template-columns: 1fr 1fr 1fr;">
            <button data-shape="radial" class="sicraft-shape-btn ${(s.lampShape || "radial") === "radial" ? "is-active" : ""}">${t("ledShapeRadial", this.plugin)}</button>
            <button data-shape="deskbar" class="sicraft-shape-btn ${s.lampShape === "deskbar" ? "is-active" : ""}">${t("ledShapeBar", this.plugin)}</button>
            <button data-shape="ruler" class="sicraft-shape-btn ${s.lampShape === "ruler" ? "is-active" : ""}">${(s.uiLanguage || "en") === "ru" ? "Линейка чтения" : "Reading Ruler"}</button>
          </div>
        </div>
      </div>
    `;
    // Beat pulse: the lamp breathes with the bass of whatever is connected to the equalizer.
    const beatRow = contentEl.createDiv({ cls: "sicraft-led-beat-row" });
    const beatLabel = beatRow.createEl("label", { cls: "sicraft-led-beat-label" });
    const beatBox = beatLabel.createEl("input", { type: "checkbox" });
    beatBox.checked = !!s.lampBeatSync;
    beatLabel.createSpan({
      text: i18n({ en: "Pulse on music beats", ru: "Пульс в такт музыке", zh: "随音乐节拍脉动", ja: "音楽のビートに合わせて明滅", es: "Pulso al ritmo de la música", de: "Im Takt der Musik pulsieren" }, this.plugin),
    });
    beatRow.createDiv({
      cls: "sicraft-led-beat-hint",
      text: i18n(
        {
          en: "Needs the lamp on and audio connected to the equalizer.",
          ru: "Нужны включённая лампа и звук, подключённый к эквалайзеру.",
          zh: "需要开启灯光并将音频连接到均衡器。",
          ja: "ランプをオンにし、イコライザーに音声を接続してください。",
          es: "Requiere la lámpara encendida y audio conectado al ecualizador.",
          de: "Lampe muss an und Audio mit dem Equalizer verbunden sein.",
        },
        this.plugin
      ),
    });
    beatBox.addEventListener("change", async () => {
      s.lampBeatSync = beatBox.checked;
      await this.plugin.saveSettings();
    });

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

const NUTRIENT_I18N = {
  proteins: {
    en: { name: "Proteins", edge: "Bottom Margin", role: "Actionable Lifehacks & Rules", desc: "Building blocks: actionable rules, techniques, and habits to transfer into your 'Must Do' planner." },
    ru: { name: "Белки", edge: "Снизу страницы", role: "Немедленно внедрить в жизнь", desc: "Строительный материал: приёмы, алгоритмы, упражнения и лайфхаки, которые нужно выписать в «Необходимо сделать» и применить." },
    zh: { name: "蛋白质", edge: "页面底部", role: "立即践行实施", desc: "知识构建基石：可落地的实用法则、技巧与行动清单，直接录入待办并执行。" },
    ja: { name: "タンパク質", edge: "ページ下部", role: "即実践・行動に移す", desc: "知識の構築ブロック：すぐに行動へ移すべき実践的ルールやアルゴリズム、習慣。" },
    es: { name: "Proteínas", edge: "Margen inferior", role: "Implementar de inmediato", desc: "Bloques de construcción: reglas prácticas, técnicas y hábitos para pasar a tu plan de acción." },
    de: { name: "Proteine", edge: "Unterer Rand", role: "Sofort in die Tat umsetzen", desc: "Bausteine: konkrete Regeln, Techniken und Gewohnheiten zur sofortigen Umsetzung." },
  },
  carbs: {
    en: { name: "Carbs", edge: "Top Margin", role: "Deep Reflection & Insights", desc: "Mental energy: profound insights, paradoxes, and ideas to ponder during your morning walk." },
    ru: { name: "Углеводы", edge: "Сверху страницы", role: "К размышлению (Энергия и Смыслы)", desc: "Энергия книги: глубокие философские мысли, парадоксы и идеи, над которыми стоит поразмышлять на утренней прогулке." },
    zh: { name: "碳水化合物", edge: "页面顶部", role: "深度思考与感悟", desc: "思想的能量之源：深刻的哲思、悖论与洞见，适于晨间散步时细细体悟。" },
    ja: { name: "炭水化物", edge: "ページ上部", role: "思考・エネルギーと本質", desc: "思考のエネルギー：朝の散歩などでじっくり反芻すべき深い哲学的洞察や問い。" },
    es: { name: "Carbohidratos", edge: "Margen superior", role: "Para reflexionar (Energía)", desc: "Energía mental: reflexiones profundas, paradojas e ideas para meditar." },
    de: { name: "Kohlenhydrate", edge: "Oberer Rand", role: "Zum Nachdenken (Sinn)", desc: "Gedankliche Energie: tiefgründige philosophische Einsichten und Paradoxa." },
  },
  fats: {
    en: { name: "Fats", edge: "Right Margin", role: "Vivid Stories & Case Studies", desc: "What makes a book flavorful: memorable stories, real-life examples, and metaphors." },
    ru: { name: "Жиры", edge: "Справа страницы", role: "Яркие истории и примеры", desc: "То, что делает книгу «вкусной»: поучительные истории, биографические кейсы, метафоры и примеры из жизни." },
    zh: { name: "脂肪", edge: "页面右侧", role: "精彩案例与生动故事", desc: "赋予书籍丰富风味的养分：发人深省的人物案例、生动传神的情节与譬喻。" },
    ja: { name: "脂質", edge: "ページ右部", role: "鮮明なストーリーと事例", desc: "本に味わいを与える要素：印象深い逸話、伝記的ケーススタディ、比喩。" },
    es: { name: "Grasas", edge: "Margen derecho", role: "Historias vivas y casos", desc: "Lo que hace amena la lectura: historias memorables, casos reales y metáforas." },
    de: { name: "Fette", edge: "Rechter Rand", role: "Anschauliche Geschichten", desc: "Was das Buch lebendig macht: lehrreiche Geschichten, Biografien und Metaphern." },
  },
  vitamins: {
    en: { name: "Vitamins", edge: "Right Margin", role: "Memorable Quotes & Wit", desc: "Flavorful details for speaking: sharp aphorisms, elegant phrasing, and witty remarks." },
    ru: { name: "Витамины", edge: "Справа страницы", role: "Красивые цитаты и остроумие", desc: "Вкусные детали для общения и выступлений: точные афоризмы, красивые формулировки, шутки и крылатые фразы." },
    zh: { name: "维生素", edge: "页面右侧", role: "名言金句与犀利洞察", desc: "点缀日常交流与演讲的亮点：精辟的格言、优美的措辞与幽默睿智的金句。" },
    ja: { name: "ビタミン", edge: "ページ右部", role: "美しい引用・ウィット", desc: "会話やスピーチを彩るエッセンス：的確な警句、美しい表現、機知に富んだ言葉。" },
    es: { name: "Vitaminas", edge: "Margen derecho", role: "Citas memorables e ingenio", desc: "Detalles elocuentes para la comunicación: aforismos precisos y frases ingeniosas." },
    de: { name: "Vitamine", edge: "Rechter Rand", role: "Schöne Zitate & Geist", desc: "Feine Nuancen für Gespräche und Vorträge: treffende Aphorismen und Geistreichtum." },
  },
  fiber: {
    en: { name: "Fiber", edge: "Right Margin", role: "Facts, Metrics, Dates & Data", desc: "The reference backbone: statistics, research data, historical dates, author names, and links." },
    ru: { name: "Клетчатка", edge: "Справа страницы", role: "Факты, цифры, даты и ссылки", desc: "Справочный каркас книги: статистика, исследования, исторические даты, имена авторов и полезные ссылки." },
    zh: { name: "膳食纤维", edge: "页面右侧", role: "客观事实、数据与引证", desc: "全书的硬核支撑骨架：严谨的统计数据、科学研究、历史年代、学者人名与参考出处。" },
    ja: { name: "食物繊維", edge: "ページ右部", role: "事実・数値・日付・典拠", desc: "読書の骨格となる基礎情報：統計、研究データ、歴史的年代、著者名、参照リンク。" },
    es: { name: "Fibra", edge: "Margen derecho", role: "Datos, métricas y fuentes", desc: "La estructura de referencia: estadísticas, investigaciones, fechas y enlaces." },
    de: { name: "Ballaststoffe", edge: "Rechter Rand", role: "Fakten, Zahlen & Quellen", desc: "Das sachliche Gerüst: Statistiken, Forschungsdaten, historische Jahreszahlen und Quellen." },
  },
};

function getNutrientI18n(nObj, plugin) {
  const loc = getLocale(plugin);
  const data = NUTRIENT_I18N[nObj.id] || NUTRIENT_I18N.proteins;
  const locData = data[loc] || data.en || data.ru;
  return {
    name: locData.name,
    edge: locData.edge,
    role: locData.role,
    desc: locData.desc,
  };
}

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
    const loc = getLocale(this.plugin);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    if (this.modalEl) this.modalEl.setAttribute("lang", locTag);

    const head = contentEl.createDiv({ cls: "nutrient-modal-head" });
    head.innerHTML = `
      <div class="sonic-badge"><span class="svg-inline-icon">${sicraftIcon('bookmark')}</span> ${
        i18n({
          en: "5-NUTRIENT BOOK STICKER SYSTEM • ACTIVE READING",
          ru: "МЕТОДИКА 5 ЗАКЛАДОК-НУТРИЕНТОВ • КНИЖНЫЙ КОНСПЕКТ",
          zh: "5大养分书签方法论 • 深度阅读笔记",
          ja: "5大栄養素付箋メソッド • 読書ノート",
          es: "MÉTODO DE 5 NUTRIENTES • RESUMEN DE LECTURA",
          de: "5-NÄHRSTOFF-LESEZEICHEN • AKTIVES LESEN",
        }, this.plugin)
      }</div>
      <h3 class="sonic-title">${
        i18n({
          en: "Attach a Craft Nutrient Bookmark with Meaning",
          ru: "Прикрепить крафтовую закладку со смыслом",
          zh: "为页面边栏附着带有深度意义的养分书签",
          ja: "意味のあるクラフト栄養素付箋を貼る",
          es: "Adjuntar pegatina de nutrientes con significado",
          de: "Craft-Nährstofflesezeichen mit Bedeutung anbringen",
        }, this.plugin)
      }</h3>
      <p class="sonic-studio-sub">${
        i18n({
          en: "Choose a book nutrient: Proteins attach to the bottom margin (must do), Carbs to the top margin (ponder), and Fats/Vitamins/Fiber to the right margin.",
          ru: "Выберите тип закладки по методике «5 нутриентов книги»: Белки крепятся снизу (внедрить), Углеводы — сверху (обдумать), Жиры/Витамины/Клетчатка — справа.",
          zh: "选择养分类型：蛋白质固定于页底（落地践行），碳水化合物固定于页顶（深度体悟），脂肪/维生素/膳食纤维固定于右侧。",
          ja: "栄養素タイプを選択: タンパク質はページ下部(実践)、炭水化物はページ上部(思考)、脂質/ビタミン/食物繊維は右余白に配置。",
          es: "Elige un nutriente: Proteínas al margen inferior (acción), Carbohidratos arriba (reflexión), y Grasas/Vitaminas/Fibra al margen derecho.",
          de: "Wähle einen Nährstoff: Proteine am unteren Rand (Aktion), Kohlenhydrate oben (Reflexion), Fette/Vitamine/Ballaststoffe rechts.",
        }, this.plugin)
      }</p>
    `;

    const grid = contentEl.createDiv({ cls: "nutrient-type-grid" });
    const descBanner = contentEl.createDiv({ cls: "nutrient-role-banner" });

    const updateSelectionUI = () => {
      grid.querySelectorAll(".nutrient-type-card").forEach((c) => {
        c.toggleClass("is-selected", c.dataset.nut === this.selectedNutrient);
      });
      const nObj = BOOK_NUTRIENTS[this.selectedNutrient] || BOOK_NUTRIENTS.proteins;
      const i18nN = getNutrientI18n(nObj, this.plugin);
      descBanner.style.borderColor = nObj.border;
      descBanner.style.background = nObj.bg;
      descBanner.innerHTML = `
        <div class="nutrient-banner-top">
          <span class="nutrient-edge-pill" style="background:${nObj.color};color:#fff;">${i18nN.name} • ${i18nN.edge}</span>
          <strong style="color:${nObj.color};">${i18nN.role}</strong>
        </div>
        <div class="nutrient-banner-desc">${i18nN.desc}</div>
      `;
    };

    Object.values(BOOK_NUTRIENTS).forEach((nObj) => {
      const card = grid.createEl("button", {
        cls: "nutrient-type-card" + (this.selectedNutrient === nObj.id ? " is-selected" : ""),
      });
      card.dataset.nut = nObj.id;
      const i18nN = getNutrientI18n(nObj, this.plugin);
      card.innerHTML = `
        <span class="nutrient-color-tab" style="background:${nObj.color}"></span>
        <span class="nutrient-card-txt">
          <strong>${i18nN.name}</strong>
          <small>${i18nN.edge}</small>
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
    lblMeaning.textContent = i18n({
      en: "1. Your Takeaway / Action to Implement / Key Insight:",
      ru: "1. Ваш вывод / значение / что именно внедрить или обдумать:",
      zh: "1. 你的结论 / 行动步骤 / 值得深思的洞见：",
      ja: "1. 気づき / アクションプラン / 反芻すべき問い:",
      es: "1. Tu conclusión / paso de acción / reflexión:",
      de: "1. Deine Erkenntnis / Umsetzungsschritt / Gedanke:",
    }, this.plugin);
    const meaningInput = formWrap.createEl("input", {
      type: "text",
      cls: "nutrient-text-input",
      placeholder: i18n({
        en: "e.g. Apply this 2-minute rule during morning planning...",
        ru: "Например: Проводить утренний разбор задач за чашкой капучино...",
        zh: "例如：晨间规划时应用这套2分钟法则...",
        ja: "例：朝のタスク整理でこの2分ルールを適用する...",
        es: "P. ej.: Aplicar esta regla de 2 minutos en la planificación matutina...",
        de: "Z. B.: Diese 2-Minuten-Regel bei der Morgenplanung anwenden...",
      }, this.plugin),
      value: this.initialData.meaning || "",
    });

    const lblQuote = formWrap.createDiv({ cls: "sonic-sec-label" });
    lblQuote.style.marginTop = "8px";
    lblQuote.textContent = i18n({
      en: "2. Book Quote or Note Snippet (for 1-click jump):",
      ru: "2. Цитата или фрагмент из заметки (для быстрого перехода):",
      zh: "2. 原文片段或引文（用于一键跳转锚点）：",
      ja: "2. 該当箇所の引用文（1クリックジャンプ用）:",
      es: "2. Fragmento de la nota o cita (para salto directo):",
      de: "2. Textstelle oder Zitat (für 1-Klick-Sprung):",
    }, this.plugin);
    const quoteInput = formWrap.createEl("textarea", {
      cls: "nutrient-quote-textarea",
      placeholder: i18n({
        en: "Paragraph text or quote...",
        ru: "Текст абзаца или цитаты...",
        zh: "段落文本或名言引用...",
        ja: "段落の文章または引用...",
        es: "Texto del párrafo o cita...",
        de: "Absatztext oder Zitat...",
      }, this.plugin),
    });
    quoteInput.rows = 2;
    quoteInput.value = this.initialData.snippet || "";

    const footer = contentEl.createDiv({ cls: "nutrient-modal-footer" });
    if (this.initialData.id && typeof this.initialData.onDelete === "function") {
      const delBtn = footer.createEl("button", {
        cls: "sonic-stop-all-btn",
        text: i18n({
          en: "Delete Sticker", ru: "Удалить закладку", zh: "删除书签", ja: "付箋を削除", es: "Eliminar pegatina", de: "Lesezeichen löschen"
        }, this.plugin),
      });
      delBtn.onclick = () => {
        this.initialData.onDelete();
        this.close();
      };
    }

    const saveBtn = footer.createEl("button", {
      cls: "artcraft-pay-action-btn is-green",
    });
    saveBtn.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('bookmark')}</span><span>${
      i18n({
        en: "Pin Nutrient Sticker to Page Edge",
        ru: "Прикрепить закладку на поле книги",
        zh: "将养分书签固定至书籍页边",
        ja: "ページの余白に付箋を貼る",
        es: "Fijar pegatina al margen del libro",
        de: "Nährstoff-Lesezeichen an Rand heften",
      }, this.plugin)
    }</span>`;

    const submit = () => {
      const nObj = BOOK_NUTRIENTS[this.selectedNutrient] || BOOK_NUTRIENTS.proteins;
      const i18nN = getNutrientI18n(nObj, this.plugin);
      const snippetVal = (quoteInput.value || "").trim() || i18n({
        en: "Key Note Passage", ru: "Важный фрагмент заметки", zh: "核心笔记文段", ja: "ノートの要点", es: "Pasaje clave", de: "Wichtige Textstelle"
      }, this.plugin);
      const meaningVal = (meaningInput.value || "").trim() || i18nN.role;
      this.onSave({
        type: nObj.id,
        edge: nObj.edge,
        label: i18nN.name,
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
    const loc = getLocale(this.plugin);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    if (this.modalEl) this.modalEl.setAttribute("lang", locTag);

    const head = contentEl.createDiv({ cls: "nutrient-modal-head" });
    head.innerHTML = `
      <div class="sonic-badge"><span class="svg-inline-icon">${sicraftIcon('book')}</span> ${
      i18n({
        en: "BOOK DIGESTION STUDIO • PROTEINS & CARBS PLANNER",
        ru: "УСВОЕНИЕ КНИГИ • ПЛАНИРОВЩИК БЕЛКОВ И УГЛЕВОДОВ",
        zh: "书籍消化工坊 • 蛋白质与碳水化合物规划",
        ja: "読書消化スタジオ • 実践と洞察のプランナー",
        es: "ESTUDIO DE ASIMILACIÓN • PLANIFICADOR DE NUTRIENTES",
        de: "BUCH-VERDAUUNGSSTUDIO • PROTEIN- & KOHLENHYDRAT-PLANER",
      }, this.plugin)
    }</div>
      <h3 class="sonic-title">${
        i18n({
          en: "5-Nutrient Book Digest & Action Planner",
          ru: "Дайджест закладок-нутриентов по заметке",
          zh: "5大养分书签摘要与行动计划",
          ja: "5大栄養素の付箋ダイジェスト＆行動計画",
          es: "Resumen de 5 nutrientes y plan de acción",
          de: "5-Nährstoff-Zusammenfassung & Aktionsplan",
        }, this.plugin)
      }</h3>
      <p class="sonic-studio-sub">${
        i18n({
          en: "Review your Red (Proteins — Must Do) and Orange (Carbs — To Ponder) stickers and export them to your planner or append them to this note.",
          ru: "После прочтения пробегитесь по красным (Белки — внедрить) и оранжевым (Углеводы — к размышлению) закладкам и перенесите их в свой планировщик или в конец заметки.",
          zh: "阅读后回顾红色（蛋白质：立即践行）与橙色（碳水：深度反思）书签，将其导出至待办清单或追加至笔记末尾。",
          ja: "読了後、赤（タンパク質：実践）と橙（炭水化物：思考）の付箋を見直し、プランナーへ書き出すかノート末尾に追加してください。",
          es: "Revisa tus pegatinas rojas (Proteínas — Acción) y naranjas (Carbohidratos — Reflexión) y expórtalas a tu agenda o añádelas a la nota.",
          de: "Überprüfe deine roten (Proteine — Aktion) und orangen (Kohlenhydrate — Reflexion) Lesezeichen und exportiere sie in deinen Planer.",
        }, this.plugin)
      }</p>
    `;

    const listWrap = contentEl.createDiv({ cls: "nutrient-digest-list" });
    if (this.bookmarks.length === 0) {
      listWrap.createDiv({
        cls: "soft-pay-muted-hint",
        text: i18n({
          en: "No nutrient stickers in this note yet. Select any passage and click '+ Nutrient Sticker'.",
          ru: "В этой заметке пока нет закладок-нутриентов. Выделите любой абзац и нажмите «+ Закладка-Нутриент».",
          zh: "此笔记暂无养分书签。选中任意文段并点击「+ 养分书签」。",
          ja: "このノートにはまだ付箋がありません。任意の段落を選択して「+ 栄養素付箋」をクリックしてください。",
          es: "Aún no hay pegatinas de nutrientes en esta nota. Selecciona un pasaje y haz clic en '+ Pegatina de nutrientes'.",
          de: "Noch keine Nährstoff-Lesezeichen in dieser Notiz. Markiere eine Textstelle und klicke auf '+ Nährstoff-Lesezeichen'.",
        }, this.plugin),
      });
    } else {
      Object.values(BOOK_NUTRIENTS).forEach((nObj) => {
        const groupItems = this.bookmarks.filter((b) => (b.type || "proteins") === nObj.id);
        if (groupItems.length === 0) return;
        const i18nN = getNutrientI18n(nObj, this.plugin);
        const sec = listWrap.createDiv({ cls: "nutrient-digest-group" });
        sec.style.borderLeftColor = nObj.color;
        sec.style.background = nObj.bg;
        sec.innerHTML = `<div class="nutrient-digest-group-title" style="color:${nObj.color}">
          <strong>${i18nN.name} (${i18nN.role})</strong>
          <span>${groupItems.length}</span>
        </div>`;
        groupItems.forEach((item) => {
          const row = sec.createDiv({ cls: "nutrient-digest-row" });
          row.innerHTML = `
            <div class="digest-row-meaning"><strong>${escHtml(item.meaning || item.label)}:</strong></div>
            <div class="digest-row-quote">«${escHtml(item.snippet)}»</div>
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
      lines.push(`## ${i18n({
        en: "Book Nutrient Digest & Action Plan",
        ru: "Усвоение книги: Дайджест 5 Нутриентов",
        zh: "书籍养分摘要与行动规划",
        ja: "読書消化：5大栄養素ダイジェスト",
        es: "Resumen de nutrientes del libro y plan de acción",
        de: "Buch-Nährstoff-Auszug & Aktionsplan",
      }, this.plugin)}`);
      const proteins = this.bookmarks.filter((b) => (b.type || "proteins") === "proteins");
      const carbs = this.bookmarks.filter((b) => b.type === "carbs");
      const others = this.bookmarks.filter((b) => b.type && b.type !== "proteins" && b.type !== "carbs");

      if (proteins.length > 0) {
        lines.push(`\n### 🔴 ${i18n({
          en: "Proteins — Must Do & Implement",
          ru: "Белки — Необходимо сделать и внедрить",
          zh: "蛋白质 — 必须落地践行",
          ja: "タンパク質 — 即実践・行動に移す",
          es: "Proteínas — Tareas inmediatas y acción",
          de: "Proteine — Sofort umsetzen & handeln",
        }, this.plugin)}`);
        proteins.forEach((p) => {
          lines.push(`- [ ] **${p.meaning || p.label}** — *«${p.snippet}»*`);
        });
      }
      if (carbs.length > 0) {
        lines.push(`\n### 🟠 ${i18n({
          en: "Carbs — To Ponder & Reflect",
          ru: "Углеводы — К размышлению (Энергия и Инсайты)",
          zh: "碳水化合物 — 晨间反思与深刻洞见",
          ja: "炭水化物 — 深い思考と哲学的洞察",
          es: "Carbohidratos — Para reflexionar e interiorizar",
          de: "Kohlenhydrate — Zum Nachdenken & Verinnerlichen",
        }, this.plugin)}`);
        carbs.forEach((c) => {
          lines.push(`> [!tip] **${c.meaning || c.label}**\n> *«${c.snippet}»*`);
        });
      }
      if (others.length > 0) {
        lines.push(`\n### 🟡🟢🔵 ${i18n({
          en: "Stories, Quotes & Facts (Fats, Vitamins, Fiber)",
          ru: "Жиры, Витамины и Клетчатка (Истории, Цитаты, Факты)",
          zh: "故事、金句与数据（脂肪、维生素、膳食纤维）",
          ja: "逸話・引用・データ（脂質・ビタミン・食物繊維）",
          es: "Historias, citas y datos (Grasas, Vitaminas, Fibra)",
          de: "Geschichten, Zitate & Fakten (Fette, Vitamine, Ballaststoffe)",
        }, this.plugin)}`);
        others.forEach((o) => {
          const nObj = BOOK_NUTRIENTS[o.type] || BOOK_NUTRIENTS.vitamins;
          const i18nN = getNutrientI18n(nObj, this.plugin);
          lines.push(`- **[${i18nN.name}] ${o.meaning || o.label}:** *«${o.snippet}»*`);
        });
      }
      return lines.join("\n");
    };

    const footer = contentEl.createDiv({ cls: "nutrient-modal-footer" });
    const btnCopy = footer.createEl("button", { cls: "artcraft-pay-action-btn is-soft" });
    btnCopy.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('copy')}</span><span>${
      i18n({
        en: "Copy for Planner",
        ru: "Скопировать для Планировщика",
        zh: "复制至待办规划",
        ja: "プランナー用にコピー",
        es: "Copiar para la agenda",
        de: "Für Planer kopieren",
      }, this.plugin)
    }</span>`;
    btnCopy.onclick = async () => {
      await navigator.clipboard.writeText(buildDigestMarkdown().trim());
      new Notice(i18n({
        en: "Book Digest copied to clipboard!",
        ru: "Дайджест скопирован в буфер обмена!",
        zh: "书籍摘要已复制至剪贴板！",
        ja: "ダイジェストをクリップボードにコピーしました！",
        es: "¡Resumen copiado al portapapeles!",
        de: "Auszug in die Zwischenablage kopiert!",
      }, this.plugin));
    };

    const btnAppend = footer.createEl("button", { cls: "artcraft-pay-action-btn is-green" });
    btnAppend.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('check')}</span><span>${
      i18n({
        en: "Append Digest Block to Note",
        ru: "Вставить блок «Усвоение» в конец заметки",
        zh: "在笔记末尾追加「消化」区块",
        ja: "ノート末尾に「消化」ブロックを追加",
        es: "Insertar bloque de asimilación al final de la nota",
        de: "Auszug-Block an Notizende anfügen",
      }, this.plugin)
    }</span>`;
    btnAppend.onclick = async () => {
      const obsidian = require("obsidian");
      const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      if (view && view.file && this.bookmarks.length > 0) {
        await this.plugin.editNote(view.file, (cur) => cur + buildDigestMarkdown());
        this.plugin.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 50);
        new Notice(i18n({
          en: "Book Digest appended to note!",
          ru: "Блок «Усвоение книги» добавлен в конец заметки!",
          zh: "书籍消化区块已添加至笔记末尾！",
          ja: "ノート末尾に消化ブロックを追加しました！",
          es: "¡Bloque de asimilación añadido al final de la nota!",
          de: "Auszug-Block an Notizende angefügt!",
        }, this.plugin));
        this.close();
      }
    };
  }

  onClose() {
    this.contentEl.empty();
  }
}

class ClassicsBookshelfModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.activeFilter = "all"; // "all" | "classics" | "proteins" | "carbs" | "fats" | "vitamins" | "fiber"
  }

  onOpen() {
    if (this.modalEl) this.modalEl.addClass("artcraft-wide-craft-modal");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-bookshelf-modal-root");
    const loc = getLocale(this.plugin);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    if (this.modalEl) this.modalEl.setAttribute("lang", locTag);

    const rootFolderLabel = i18n({
      en: "Vault Root",
      ru: "Корень базы",
      zh: "知识库根目录",
      ja: "保管庫ルート",
      es: "Raíz de la bóveda",
      de: "Tresor-Stammverzeichnis",
    }, this.plugin);

    const stamped = this.plugin.settings.stampedNotes || {};
    const bms = this.plugin.settings.marginBookmarks || {};
    const allPaths = Array.from(new Set([...Object.keys(stamped), ...Object.keys(bms)]));

    const books = [];
    allPaths.forEach((fp) => {
      const rec = this.plugin.getNoteStampRecord(fp);
      const list = Array.isArray(bms[fp]) ? bms[fp] : [];
      if (!rec && list.length === 0) return;
      const baseTitle = fp.replace(/\.md$/i, "").split("/").pop() || fp;
      const folder = fp.includes("/") ? fp.split("/")[0] : rootFolderLabel;
      books.push({
        path: fp,
        title: baseTitle,
        folder,
        stamp: rec,
        isClassics: !!(rec && rec.count >= 2),
        bookmarks: list,
      });
    });

    books.sort((a, b) => {
      if (a.isClassics !== b.isClassics) return a.isClassics ? -1 : 1;
      return b.bookmarks.length - a.bookmarks.length;
    });

    const head = contentEl.createDiv({ cls: "nutrient-modal-head" });
    head.innerHTML = `
      <div class="sonic-badge"><span class="svg-inline-icon">${sicraftIcon('shelf')}</span> ${
      i18n({
        en: "CLASSICS BOOKSHELF & 5-NUTRIENT LIBRARY",
        ru: "ПОЛКА КЛАССИКИ И БИБЛИОТЕКА НУТРИЕНТОВ",
        zh: "经典书架与5大养分文献库",
        ja: "古典の本棚＆5大栄養素ライブラリ",
        es: "ESTANTERÍA DE CLÁSICOS Y BIBLIOTECA DE NUTRIENTES",
        de: "KLASSIKER-REGAL & 5-NÄHRSTOFF-BIBLIOTHEK",
      }, this.plugin)
    }</div>
      <h3 class="sonic-title">${
        i18n({
          en: "Tactile Bookshelf of Stamped Notes & Book Nutrients",
          ru: "Деревянная Полка Изученных Книг и Конспектов",
          zh: "已研读笔记与养分摘录的实木书架",
          ja: "学習済みノートと栄養素付箋の木製本棚",
          es: "Estantería táctil de notas estudiadas y nutrientes",
          de: "Taktiles Holzregal für studierte Notizen & Nährstoffe",
        }, this.plugin)
      }</h3>
      <p class="sonic-studio-sub">${
        i18n({
          en: "Every note stamped as APPROVED / ★ CLASSICS or tagged with 5-Nutrient stickers appears on this craft shelf. Filter insights across your entire vault.",
          ru: "Здесь автоматически собираются все заметки со штампом «ИЗУЧЕНО / ★ КЛАССИКА» и закладками-нутриентами. Фильтруйте главные выводы по всей базе и открывайте любую книгу в 1 клик.",
          zh: "所有加盖「已研读 / ★ 经典」印章或贴有5大养分书签的笔记均会陈列在此书架上。跨全库检索核心要点，一键即达任意书籍。",
          ja: "「学習済 / ★ 古典」印章が押されたノートや栄養素付箋付きのノートがこの本棚に集約されます。保管庫全体から要点を絞り込み、1クリックで開けます。",
          es: "Todas las notas con sello de APROBADO / ★ CLÁSICOS o pegatinas de nutrientes aparecen en esta estantería artesanal. Filtra ideas en toda tu bóveda.",
          de: "Jede Notiz mit dem Stempel BESTÄTIGT / ★ KLASSIKER oder Nährstoff-Lesezeichen erscheint in diesem Regal. Filtere Erkenntnisse im gesamten Tresor.",
        }, this.plugin)
      }</p>
    `;

    const filterBar = contentEl.createDiv({ cls: "artcraft-shelf-filter-bar" });
    const filters = [
      { id: "all", label: `${i18n({ en: "All Books", ru: "Все книги", zh: "全部书籍", ja: "すべての本", es: "Todos los libros", de: "Alle Bücher" }, this.plugin)} (${books.length})`, color: "#44403C" },
      { id: "classics", label: i18n({ en: "★ Classics (#2+)", ru: "★ Золотая Классика", zh: "★ 典藏经典 (#2+)", ja: "★ 名著・古典 (#2+)", es: "★ Clásicos (#2+)", de: "★ Klassiker (#2+)" }, this.plugin), color: "#D97706" },
      { id: "proteins", label: i18n({ en: "🔴 Proteins (Must Do)", ru: "🔴 Белки (Внедрить)", zh: "🔴 蛋白质 (落地践行)", ja: "🔴 タンパク質 (実践)", es: "🔴 Proteínas (Acción)", de: "🔴 Proteine (Aktion)" }, this.plugin), color: "#DC2626" },
      { id: "carbs", label: i18n({ en: "🟠 Carbs (Ponder)", ru: "🟠 Углеводы (Смыслы)", zh: "🟠 碳水化合物 (感悟)", ja: "🟠 炭水化物 (思考)", es: "🟠 Carbohidratos (Reflexión)", de: "🟠 Kohlenhydrate (Sinn)" }, this.plugin), color: "#EA580C" },
      { id: "vitamins", label: i18n({ en: "🟢 Vitamins (Quotes)", ru: "🟢 Витамины (Цитаты)", zh: "🟢 维生素 (金句)", ja: "🟢 ビタミン (引用)", es: "🟢 Vitaminas (Citas)", de: "🟢 Vitamine (Zitate)" }, this.plugin), color: "#16A34A" },
      { id: "fiber", label: i18n({ en: "🔵 Fiber (Facts)", ru: "🔵 Клетчатка (Факты)", zh: "🔵 膳食纤维 (数据)", ja: "🔵 食物繊維 (事実)", es: "🔵 Fibra (Datos)", de: "🔵 Ballaststoffe (Fakten)" }, this.plugin), color: "#2563EB" },
    ];

    const shelfBody = contentEl.createDiv({ cls: "artcraft-wooden-shelf-body" });

    const renderShelf = () => {
      shelfBody.empty();
      filterBar.querySelectorAll(".artcraft-shelf-filter-pill").forEach((b) => {
        b.toggleClass("is-active", b.dataset.fid === this.activeFilter);
      });

      const filtered = books.filter((bk) => {
        if (this.activeFilter === "all") return true;
        if (this.activeFilter === "classics") return bk.isClassics;
        return bk.bookmarks.some((m) => (m.type || "proteins") === this.activeFilter);
      });

      if (filtered.length === 0) {
        shelfBody.createDiv({
          cls: "soft-pay-muted-hint",
          text: i18n({
            en: "No books match this filter yet. Click 'Stamp' or '+ Sticker' in any note to place it on your shelf!",
            ru: "На этой полке пока нет книг под выбранный фильтр. Поставьте штамп «Штамп» или добавьте «+ Закладка» в любой заметке!",
            zh: "当前筛选下暂无书籍。在任意笔记中点击「印章」或「+ 书签」即可将其陈列上架！",
            ja: "選択された条件の本はまだありません。ノート内で「印章」を押すか「+ 付箋」を追加してください！",
            es: "No hay libros con este filtro. ¡Haz clic en 'Sello' o '+ Pegatina' en cualquier nota!",
            de: "Noch keine Bücher unter diesem Filter. Klicke in einer Notiz auf 'Stempeln' oder '+ Lesezeichen'!",
          }, this.plugin),
        });
        return;
      }

      const grid = shelfBody.createDiv({ cls: "artcraft-bookshelf-grid" });
      const spineColors = ["#8C5828", "#15803D", "#1E40AF", "#9A3412", "#6D28D9", "#0F766E"];

      filtered.forEach((bk, idx) => {
        const card = grid.createDiv({ cls: "artcraft-book-folio-card" + (bk.isClassics ? " is-gold-classic" : "") });
        const spineCol = bk.isClassics ? "#B45309" : spineColors[idx % spineColors.length];
        const stampTxt = bk.isClassics
          ? `★ CLASSICS #${bk.stamp.count}`
          : bk.stamp
          ? `✓ ${i18n({ en: "READ", ru: "ИЗУЧЕНО", zh: "已读", ja: "読了", es: "LEÍDO", de: "GELESEN" }, this.plugin)}`
          : "";

        card.innerHTML = `
          <div class="book-folio-spine" style="background:${spineCol}"></div>
          <div class="book-folio-inner">
            <div class="book-folio-folder">${escHtml(bk.folder)}</div>
            <h4 class="book-folio-title" title="${escHtml(bk.title)}">${escHtml(bk.title)}</h4>
            <div class="book-folio-meta">
              ${stampTxt ? `<span class="book-folio-stamp-pill">${stampTxt}</span>` : ""}
              <span class="book-folio-nutrients-count">${bk.bookmarks.length} ${i18n({ en: "stickers", ru: "закладок", zh: "个书签", ja: "付箋", es: "pegatinas", de: "Lesezeichen" }, this.plugin)}</span>
            </div>
            ${
              bk.bookmarks.length > 0
                ? `<div class="book-folio-nut-dots">${bk.bookmarks
                    .slice(0, 6)
                    .map((m) => {
                      const nObj = BOOK_NUTRIENTS[m.type] || BOOK_NUTRIENTS.proteins;
                      return `<span class="nut-dot" style="background:${nObj.color}" title="${escHtml(m.meaning || m.label)}"></span>`;
                    })
                    .join("")}</div>`
                : ""
            }
          </div>
        `;

        card.onclick = () => {
          this.close();
          this.app.workspace.openLinkText(bk.path, "", false);
        };
      });
    };

    filters.forEach((f) => {
      const btn = filterBar.createEl("button", { cls: "artcraft-shelf-filter-pill" });
      btn.dataset.fid = f.id;
      btn.innerHTML = `<span>${f.label}</span>`;
      btn.onclick = () => {
        this.activeFilter = f.id;
        renderShelf();
      };
    });

    renderShelf();

    const footer = contentEl.createDiv({ cls: "nutrient-modal-footer" });
    const btnExportAll = footer.createEl("button", { cls: "artcraft-pay-action-btn is-green" });
    btnExportAll.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('copy')}</span><span>${
      i18n({
        en: "Copy Master Vault Book Digest",
        ru: "Скопировать Сводный Дайджест Всех Книг",
        zh: "复制全库宏观书籍摘要",
        ja: "保管庫全体の統合ダイジェストをコピー",
        es: "Copiar resumen maestro de la bóveda",
        de: "Gesamte Tresor-Zusammenfassung kopieren",
      }, this.plugin)
    }</span>`;
    btnExportAll.onclick = async () => {
      const lines = [`# ${i18n({ en: "Master Classics & Book Nutrient Digest", ru: "Полка Классики и Сводный Дайджест Книг", zh: "经典书架与全库书籍摘要", ja: "名著の本棚と統合ダイジェスト", es: "Estantería de clásicos y resumen maestro", de: "Klassiker-Regal und Gesamt-Auszug" }, this.plugin)}\n`];
      books.forEach((bk) => {
        lines.push(`## ${bk.title} (${bk.isClassics ? `★ CLASSICS #${bk.stamp.count}` : "Read"})`);
        bk.bookmarks.forEach((m) => {
          const nObj = BOOK_NUTRIENTS[m.type] || BOOK_NUTRIENTS.proteins;
          const i18nN = getNutrientI18n(nObj, this.plugin);
          lines.push(`- **[${i18nN.name}] ${m.meaning || m.label}:** *«${m.snippet}»*`);
        });
        lines.push("");
      });
      await navigator.clipboard.writeText(lines.join("\n"));
      new Notice(i18n({
        en: "Master Book Digest copied to clipboard!",
        ru: "Сводный дайджест всех книг скопирован в буфер обмена!",
        zh: "全库书籍摘要已复制至剪贴板！",
        ja: "全冊の統合ダイジェストをコピーしました！",
        es: "¡Resumen maestro copiado al portapapeles!",
        de: "Gesamte Buch-Zusammenfassung in die Zwischenablage kopiert!",
      }, this.plugin));
    };
  }

  onClose() {
    this.contentEl.empty();
  }
}

const AMBIENT_SOUNDSCAPES = [
  { id: "balanced", ru: "Мягкий розовый шум", en: "Soft pink noise", subRu: "Ровный фон, стерео", subEn: "Even background, stereo", icon: SICRAFT_SVGS.sliders },
  { id: "brown", ru: "Коричневый шум", en: "Brown noise", subRu: "Глубокий низкий фон", subEn: "Deep low-frequency bed", icon: SICRAFT_SVGS.shield },
  { id: "gamma40", ru: "40 Гц с розовым шумом", en: "40 Hz with pink noise", subRu: "Биение 40 Гц и тёплый шум", subEn: "40 Hz beat and warm noise", icon: SICRAFT_SVGS.brain },
  { id: "bright", ru: "10 Гц, альфа", en: "10 Hz alpha", subRu: "Спокойный фон для чтения", subEn: "Calm background for reading", icon: SICRAFT_SVGS.sun },
  { id: "night", ru: "6 Гц, тета", en: "6 Hz theta", subRu: "Тон 174 Гц с биением 6 Гц", subEn: "174 Hz tone with a 6 Hz beat", icon: SICRAFT_SVGS.moon },
  { id: "rain_roof", ru: "Поющие чаши", en: "Singing bowls", subRu: "Обертоны около 432 Гц", subEn: "Overtones around 432 Hz", icon: SICRAFT_SVGS.roof },
  { id: "ocean", ru: "Прибой", en: "Ocean surf", subRu: "Волна раз в 8 секунд", subEn: "One wave every 8 seconds", icon: SICRAFT_SVGS.waves },
  { id: "rain", ru: "Дождь", en: "Rain", subRu: "Ровный шум дождя", subEn: "Steady rain noise", icon: SICRAFT_SVGS.rain },
  { id: "stream", ru: "Ручей", en: "Brook", subRu: "Шум воды с медленными переливами", subEn: "Water noise with a slow swell", icon: SICRAFT_SVGS.stream },
  { id: "fire", ru: "Камин", en: "Fireplace", subRu: "Тёплый шум и треск", subEn: "Warm noise and crackle", icon: SICRAFT_SVGS.flame },
  { id: "train", ru: "Ночной поезд", en: "Night train", subRu: "Мерный стук колёс", subEn: "Steady rail rhythm", icon: SICRAFT_SVGS.train },
  { id: "cafe", ru: "Кофейня", en: "Coffee house", subRu: "Мягкий гул зала", subEn: "Soft room murmur", icon: SICRAFT_SVGS.coffee },
  { id: "crystal_432", ru: "432 Гц, чистые тоны", en: "432 Hz pure tones", subRu: "Тоны 216, 220 и 432 Гц", subEn: "216, 220 and 432 Hz tones", icon: SICRAFT_SVGS.spark },
  { id: "solfeggio_528", ru: "528 Гц", en: "528 Hz drone", subRu: "Тон 528 Гц и мягкий шум", subEn: "528 Hz tone with soft noise", icon: SICRAFT_SVGS.sun },
  { id: "nordic_wind", ru: "Ветер", en: "Wind", subRu: "Ровный шум, как ветер в кронах", subEn: "Steady noise, like wind in the trees", icon: SICRAFT_SVGS.waves },
  { id: "vinyl_library", ru: "Тёплый шум", en: "Warm noise", subRu: "Ровный тёплый фон", subEn: "Steady warm background", icon: SICRAFT_SVGS.book }
];

class AlchemySonicStudioModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.progressTimer = null;
  }

  onOpen() {
    // onOpen doubles as "re-render" and is called after awaits; a modal closed in the meantime stays closed
    if (this.isClosed) return;
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
              <div class="sonic-track-title" id="sonic-track-name">${escHtml(trackName)}</div>
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
              <span class="svg-inline-icon">${sicraftIcon('globe')}</span> <span>${isRu ? "Захват звука ПК (WASAPI Loopback)" : "Sync PC Desktop Audio (WASAPI)"}</span>
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
          <div class="sonic-sec-label">${isRu ? "ФОНОВЫЕ ЗВУКИ" : "BACKGROUND SOUNDSCAPES"}</div>
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
    this.isClosed = true;
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressTimer = null;
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
    const { contentEl, modalEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");

    modalEl.classList.add("artcraft-anchored-timer-popover");
    const timerPill = document.querySelector(".artcraft-timer-pill");
    if (timerPill) {
      const rect = timerPill.getBoundingClientRect();
      modalEl.style.position = "fixed";
      modalEl.style.bottom = `${Math.max(72, window.innerHeight - rect.top + 10)}px`;
      modalEl.style.left = `${Math.max(16, Math.min(window.innerWidth - 330, rect.left - 40))}px`;
      modalEl.style.top = "auto";
      modalEl.style.transform = "none";
      modalEl.style.margin = "0";
    }

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

    this._unloaded = false;
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

    this.initWasmCore();
    this.initMagicSpotlightTracker();
    this.initBookFolio3DPhysics();
    this.applyBodyClasses();
    this.createLampGpuLayer();
    this.createOverlayCanvas();
    if (this.settings.showFloatingDock) {
      this.createFloatingDock();
    }

    // 1. Reading View Post-Processor
    this.registerMarkdownPostProcessor(async (el, ctx) => {
      this.enhanceMarkdownElement(el);
      if (this.settings.keySentenceMarker !== false && ctx && ctx.sourcePath) {
        const model = await this.getKeySentenceModel(ctx.sourcePath);
        if (model && !this._unloaded) this.markKeySentences(el, model);
      }
    });

    // 2. Live Preview (CM6) & Graph View Observer
    this.setupLivePreviewObserver();
    // Background timer resync: immediately syncs timer seconds when Obsidian window is refocused or un-minimized
    this.registerDomEvent(document, "visibilitychange", () => {
      if (!document.hidden && this.timerRunning) {
        this.tickTimer();
      }
      if (!document.hidden) {
        this.wakeVisualLoop();
        this.kinStartLoop();
        if (this.settings.dockCollapsed) this.wakeFlaskHydroLoop();
      } else {
        this.stopFlaskHydroLoop();
        this.stopIslandLiveSpectrogram();
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
          if (this._unloaded) return;
          this.markNarrowPanes();
          this.updateTaskProgressBar();
          this.injectGraphViewHUD();
          this.wakeVisualLoop();
        }, 150);
      })
    );
    // Only the note on screen matters here, and a burst of cache updates (typing, sync, indexing) is
    // folded into one refresh.
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        const active = this.app.workspace.getActiveFile();
        if (!active || !file || file.path !== active.path) return;
        if (this.progressRefreshTimer) clearTimeout(this.progressRefreshTimer);
        this.progressRefreshTimer = setTimeout(() => {
          this.progressRefreshTimer = null;
          if (!this._unloaded) this.updateTaskProgressBar();
        }, 350);
      })
    );
    this.registerEvent(
      this.app.workspace.on("resize", () => {
        if (this.narrowPaneFrame) return;
        this.narrowPaneFrame = requestAnimationFrame(() => {
          this.narrowPaneFrame = null;
          if (!this._unloaded) this.markNarrowPanes();
        });
      })
    );
    // Stamps, seals and stickers are stored by note path: follow a note when it is renamed or moved,
    // drop its records when it is deleted.
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => this.rekeyNoteRecords(oldPath, file.path)));
    this.registerEvent(this.app.vault.on("delete", (file) => this.rekeyNoteRecords(file.path, null)));
    this.registerDomEvent(document, "click", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("task-list-item-checkbox")) {
        const isChecked = e.target.checked || e.target.getAttribute("data-task") === "x";
        const liEl = e.target.closest("li, .HyperMD-task-line");
        const rawTaskText = liEl ? (liEl.innerText || liEl.textContent || "").replace(/^\s*[-*+]?\s*\[.?\]\s*/, "").trim() : "";
        setTimeout(() => {
          this.updateTaskProgressBar(true);
          if (isChecked && rawTaskText) {
            this.mineQuestBlock(rawTaskText.slice(0, 120), 25, false);
          }
        }, 140);
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
        if (this.mode !== "none") {
          this.undo();
        }
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || e.key === "Y" || ((e.key === "z" || e.key === "Z") && e.shiftKey))
      ) {
        if (this.mode !== "none") {
          this.redo();
        }
      }
    });

    this.setupTactileKeystrokesAndRipples();
    this.setupMagicCursorLamp();
    this.addSettingTab(new AlchemyFlowSettingTab(this.app, this));
    setTimeout(() => {
      if (this._unloaded) return;
      this.injectGraphViewHUD();
      this.renderNoteWaxSealOverlay();
      this.updateReadingPacerState();
      this.fitDockToWindow();
    }, 400);

    // Time Capsules: announce sealed notes whose unlock date has arrived
    this.app.workspace.onLayoutReady(() => {
      try {
        if (typeof this.decorateSidebarFileExplorer === 'function') {
          this.decorateSidebarFileExplorer();
          setTimeout(() => !this._unloaded && this.decorateSidebarFileExplorer(), 300);
          setTimeout(() => !this._unloaded && this.decorateSidebarFileExplorer(), 1200);
        }
        if (typeof this.setupSidebarObserver === 'function') {
          this.setupSidebarObserver();
        }
      } catch (err) {
        console.error("[Alchemy Craft] startup sidebar error:", err);
      }
      setTimeout(() => !this._unloaded && this.announceReadyTimeCapsules(), 1500);
      setTimeout(() => !this._unloaded && this.offerInteractiveTourOnce(), 2200);
      this.startAutopilotAlarmScheduler();
      // Decorate the note that is already open (enabling the plugin fires no file-open event).
      setTimeout(() => {
        if (this._unloaded) return;
        this.markNarrowPanes();
        this.updateTaskProgressBar();
      }, 300);
      // Plugin CSS and fonts are in by now, so the measured dock width is final.
      setTimeout(() => this.fitDockToWindow(), 800);
      // PC audio stays connected between sessions until the user disconnects it.
      if (this.settings.systemAudioAutoConnect && this.settings.showEqualizer !== false) {
        this.startSystemAudioCapture(true);
      }
    });
  }

  // --- 1. MAGIC CURSOR LANTERN (LUMINA LAMP — DYNAMIC LIGHTING & 3D SHADOWS) ---
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
      // The beam is one composited layer moved with translate3d: no layout, no repaint.
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
        ? "Smart LED Cursor Lamp ON"
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

      const profile = this.settings.tactileTypingSound || "creamy_pom";
      const now = ctx.currentTime;
      const isSpace = key === " ";
      const isMod = key === "Enter" || key === "Backspace" || key === "Tab";

      // Small human velocity & pitch micro-variation so consecutive keystrokes sound organic and alive
      const code = typeof key === "string" && key.length === 1 ? key.toLowerCase().charCodeAt(0) : 105;
      const keyOffset = ((code % 11) - 5) * 0.011;
      const jitter = 1 + keyOffset + (Math.random() * 0.036 - 0.018);
      const pitchMul = isSpace ? 0.74 : isMod ? 0.84 : 1.0;

      // Build a high-resolution pink/velvet noise buffer for gasket foam & lubed stem cushion
      if (!this.keyVelvetBuf) {
        const len = Math.floor(ctx.sampleRate * 0.08);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const ch = buf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + w * 0.099;
          b1 = 0.963 * b1 + w * 0.296;
          b2 = 0.570 * b2 + w * 1.052;
          ch[i] = (b0 + b1 + b2 + w * 0.18) * 0.18;
        }
        this.keyVelvetBuf = buf;
      }

      // Switch acoustic recipes (all short 18-32ms gasket-damped impulses, zero long electronic sine beeps!)
      const RECIPES = {
        // 1. Reaper Creamy Linear (POM stem + IXPE foam + PC plate — signature "marbly/creamy" pop-thock)
        creamy_pom: {
          fBody: 255, fChamber: 760, bodyDur: 0.024, lpCutoff: 1180,
          stemFreq: 1380, stemQ: 1.5, stemGain: 0.085, bodyGain: 0.145, reboundFreq: 165, reboundGain: 0.032
        },
        // 2. Ice Vein Deep Thock (Thick PBT keycaps + poron case foam — deep, round, matte bottom-out)
        thock: {
          fBody: 185, fChamber: 520, bodyDur: 0.028, lpCutoff: 820,
          stemFreq: 980, stemQ: 1.3, stemGain: 0.065, bodyGain: 0.165, reboundFreq: 132, reboundGain: 0.038
        },
        // 3. Milky Yellow Lubed (Factory hand-lubed linear — buttery smooth, warm low-mid cushion)
        matcha_lubed: {
          fBody: 225, fChamber: 640, bodyDur: 0.023, lpCutoff: 960,
          stemFreq: 1180, stemQ: 1.2, stemGain: 0.060, bodyGain: 0.125, reboundFreq: 150, reboundGain: 0.026
        },
        // 4. Matcha Latte Tactile (Soft rounded tactile bump + warm wooden desk resonance)
        raindrop_wood: {
          fBody: 290, fChamber: 880, bodyDur: 0.021, lpCutoff: 1350,
          stemFreq: 1580, stemQ: 1.8, stemGain: 0.090, bodyGain: 0.130, reboundFreq: 195, reboundGain: 0.030
        },
        // 5. Honey Peach Silent (Silicone dampened rails — ultra-soft library pillow whisper)
        velvet_felt: {
          fBody: 165, fChamber: 430, bodyDur: 0.022, lpCutoff: 640,
          stemFreq: 760, stemQ: 0.9, stemGain: 0.042, bodyGain: 0.085, reboundFreq: 120, reboundGain: 0.018
        },
        // 6. Rosewood Cocoa Linear (Warm walnut & rosewood acoustic housing — rich organic woody tok)
        paper_brush: {
          fBody: 210, fChamber: 590, bodyDur: 0.026, lpCutoff: 920,
          stemFreq: 1120, stemQ: 1.6, stemGain: 0.072, bodyGain: 0.140, reboundFreq: 145, reboundGain: 0.030
        }
      };

      const r = RECIPES[profile] || RECIPES.creamy_pom;
      const masterLp = ctx.createBiquadFilter();
      masterLp.type = "lowpass";
      masterLp.frequency.setValueAtTime(r.lpCutoff * jitter, now);
      masterLp.Q.value = 0.75;
      masterLp.connect(ctx.destination);

      // LAYER 1: Lubed POM Stem Cushion Transient (0ms .. 5ms)
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = this.keyVelvetBuf;
      const stemBp = ctx.createBiquadFilter();
      stemBp.type = "bandpass";
      stemBp.frequency.setValueAtTime(r.stemFreq * pitchMul * jitter, now);
      stemBp.Q.value = r.stemQ;
      const stemGain = ctx.createGain();
      stemGain.gain.setValueAtTime(0.0001, now);
      stemGain.gain.linearRampToValueAtTime(r.stemGain * (isSpace ? 1.15 : 1.0), now + 0.0012);
      stemGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.011);
      noiseSrc.connect(stemBp);
      stemBp.connect(stemGain);
      stemGain.connect(masterLp);
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.014);

      // LAYER 2: IXPE Foam & Gasket Plate Cavity Body (0.8ms .. 24ms) + PBT Keycap Chamber Formant
      const bodyOsc = ctx.createOscillator();
      const chamberOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      const chamberGain = ctx.createGain();

      const f0 = r.fBody * pitchMul * jitter;
      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(f0 * 1.32, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(Math.max(48, f0 * 0.56), now + r.bodyDur);

      const fc = r.fChamber * pitchMul * jitter;
      chamberOsc.type = "sine";
      chamberOsc.frequency.setValueAtTime(fc * 1.15, now);
      chamberOsc.frequency.exponentialRampToValueAtTime(Math.max(95, fc * 0.62), now + r.bodyDur * 0.72);

      const peakBody = r.bodyGain * (isSpace ? 1.22 : isMod ? 1.1 : 1.0);
      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.linearRampToValueAtTime(peakBody, now + 0.0016);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + r.bodyDur);

      chamberGain.gain.setValueAtTime(0.0001, now);
      chamberGain.gain.linearRampToValueAtTime(peakBody * 0.34, now + 0.0012);
      chamberGain.gain.exponentialRampToValueAtTime(0.0001, now + r.bodyDur * 0.72);

      bodyOsc.connect(bodyGain);
      chamberOsc.connect(chamberGain);
      bodyGain.connect(masterLp);
      chamberGain.connect(masterLp);

      bodyOsc.start(now);
      bodyOsc.stop(now + r.bodyDur + 0.005);
      chamberOsc.start(now);
      chamberOsc.stop(now + r.bodyDur);

      // LAYER 3: Subtle Gasket Silicone Upstroke Cushion (~19ms .. 34ms)
      const upDelay = 0.017 + Math.random() * 0.004;
      const upOsc = ctx.createOscillator();
      const upGain = ctx.createGain();
      upOsc.type = "sine";
      upOsc.frequency.setValueAtTime(r.reboundFreq * pitchMul * jitter * 1.2, now + upDelay);
      upOsc.frequency.exponentialRampToValueAtTime(Math.max(45, r.reboundFreq * 0.7), now + upDelay + 0.014);
      upGain.gain.setValueAtTime(0.0001, now + upDelay);
      upGain.gain.linearRampToValueAtTime(r.reboundGain, now + upDelay + 0.0015);
      upGain.gain.exponentialRampToValueAtTime(0.0001, now + upDelay + 0.015);
      upOsc.connect(upGain);
      upGain.connect(masterLp);
      upOsc.start(now + upDelay);
      upOsc.stop(now + upDelay + 0.018);
    } catch (e) {}
  }

  spawnTactileRipple(x, y) {
    if (!this.ripples) this.ripples = [];
    this.ripples.push({ x, y, r: 4, maxR: 38, alpha: 0.65, color: this.settings.strokeColor || "#69BD28" });
    this.wakeOverlayCanvas();
  }

  // --- 3. NATIVE ELECTRON DESKTOP SYSTEM AUDIO LOOPBACK (TELEGRAM / YOUTUBE / SPOTIFY) & 4-MODE EQUALIZER ---
  async cycleAmbientSound(direction = 1) {
    const list = AMBIENT_SOUNDSCAPES.map((s) => s.id);
    const cur = this.settings.ambientSound || "off";
    let curIdx = list.indexOf(cur);
    let nextIdx;
    if (curIdx === -1) {
      nextIdx = direction > 0 ? 0 : list.length - 1;
    } else {
      nextIdx = (curIdx + direction + list.length) % list.length;
    }
    const nextId = list[nextIdx];
    await this.setAmbientSound(nextId);
    const soundObj = AMBIENT_SOUNDSCAPES[nextIdx];
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const soundName = soundObj ? (isRu ? soundObj.ru : soundObj.en) : nextId;
    this.showIslandTrackCapsule(soundName, null, undefined, { mode: "switch", dir: direction });
  }

  showIslandTrackCapsule(trackName, iconSvg, volPct, morphOpts = null) {
    if (!this.eqWrap) return;
    let island = this.eqWrap.querySelector(".artcraft-island-capsule");
    if (!island) {
      island = document.createElement("div");
      island.className = "artcraft-island-capsule";
      this.eqWrap.appendChild(island);
    }

    const oldBridge = this.eqWrap.querySelector(".island-gooey-bridge");
    if (oldBridge) oldBridge.remove();

    const vol = volPct !== undefined ? volPct : (this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75);
    island.innerHTML = `
      <span class="island-live-dot"></span>
      <div class="island-track-title">${escHtml(trackName)}</div>
      <div class="island-vol-badge" style="--vol-fill:${vol}%">${vol}%</div>
    `;

    island.classList.remove("is-hiding");
    island.classList.add("is-visible");

    island.onclick = (e) => {
      e.stopPropagation();
      this.toggleSonicPopover(this.eqWrap);
    };

    if (this._islandHideTimer) clearTimeout(this._islandHideTimer);
    this._islandHideTimer = setTimeout(() => {
      if (island && !island.matches(":hover") && (!this.eqWrap || !this.eqWrap.matches(":hover"))) {
        island.classList.remove("is-visible");
      }
    }, 2400);
  }

  startIslandLiveSpectrogram() {}

  stopIslandLiveSpectrogram() {
    if (this._islandSpecRaf) {
      cancelAnimationFrame(this._islandSpecRaf);
      this._islandSpecRaf = null;
    }
  }

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
    this.closeAllDockPopovers();
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
    this.settings.timerMode = "pomodoro"; // a recipe is a timed sprint, never a count-up stopwatch
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
    this.updateLampGpuStyle(); // the recipe changed lamp colour and shape
    this.updateDockUI();
    this.updateEqualizerPillUI();
  }

  closeAllDockPopovers(except = null) {
    if (except !== "pomo") {
      if (this.pomoPopoverCloseHandler) {
        document.removeEventListener("pointerdown", this.pomoPopoverCloseHandler);
        this.pomoPopoverCloseHandler = null;
      }
      if (this.pomoPopoverEl) {
        this.pomoPopoverEl.remove();
        this.pomoPopoverEl = null;
      }
    }
    if (except !== "focus") {
      if (this.focusPopoverCloseHandler) {
        document.removeEventListener("pointerdown", this.focusPopoverCloseHandler);
        this.focusPopoverCloseHandler = null;
      }
      if (this.focusPopoverEl) {
        this.focusPopoverEl.remove();
        this.focusPopoverEl = null;
      }
    }
    if (except !== "sonic") {
      if (this.sonicPopoverCloseHandler) {
        document.removeEventListener("pointerdown", this.sonicPopoverCloseHandler);
        this.sonicPopoverCloseHandler = null;
      }
      if (this.sonicPopoverEl) {
        this.sonicPopoverEl.remove();
        this.sonicPopoverEl = null;
      }
    }
    if (except !== "laser") {
      if (this.laserPopoverCloseHandler) {
        document.removeEventListener("pointerdown", this.laserPopoverCloseHandler);
        this.laserPopoverCloseHandler = null;
      }
      if (this.laserPopoverEl) {
        this.laserPopoverEl.remove();
        this.laserPopoverEl = null;
      }
    }
    if (except !== "draw") {
      if (this.drawPopoverCloseHandler) {
        document.removeEventListener("pointerdown", this.drawPopoverCloseHandler);
        this.drawPopoverCloseHandler = null;
      }
      if (this.drawPopoverEl) {
        this.drawPopoverEl.remove();
        this.drawPopoverEl = null;
      }
    }
    if (this.activePopoverTetherEl) {
      this.activePopoverTetherEl.remove();
      this.activePopoverTetherEl = null;
    }
  }

  toggleLaserPopover(anchorBtn) {
    if (this.laserPopoverEl) {
      this.closeAllDockPopovers();
      return;
    }
    this.closeAllDockPopovers("laser");

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-pomodoro-popover artcraft-laser-popover";
    pop.addEventListener("pointerdown", (e) => e.stopPropagation());
    pop.addEventListener("click", (e) => e.stopPropagation());
    this.laserPopoverEl = pop;

    const laserColors = [
      { id: "#EF4444", label: isRu ? "Рубин" : "Crimson" },
      { id: "#69BD28", label: isRu ? "Алхимия" : "Emerald" },
      { id: "#2563EB", label: isRu ? "Сапфир" : "Sapphire" },
      { id: "#F59E0B", label: isRu ? "Янтарь" : "Amber" },
      { id: "#A855F7", label: isRu ? "Аметист" : "Amethyst" },
      { id: "#06B6D4", label: isRu ? "Циан" : "Cyan" },
    ];
    const laserSizes = [
      { val: 4, label: isRu ? "Тонкий · 4px" : "Fine · 4px" },
      { val: 6, label: isRu ? "Средний · 6px" : "Medium · 6px" },
      { val: 10, label: isRu ? "Крупный · 10px" : "Bold · 10px" },
      { val: 14, label: isRu ? "Прожектор · 14px" : "Beam · 14px" },
    ];
    const trailModes = [
      { val: 220, label: isRu ? "Короткий" : "Short" },
      { val: 450, label: isRu ? "Средний" : "Medium" },
      { val: 850, label: isRu ? "Комета" : "Comet" },
    ];

    const renderLaser = () => {
      const curSize = this.settings.laserSize || 6;
      const curColor = this.settings.laserColor || this.settings.strokeColor || "#EF4444";
      const curTrail = this.settings.laserTrailMs || 450;
      const isLaserOn = this.mode === "laser";

      pop.innerHTML = `
        <div class="pomo-pop-head">
          <div class="pomo-pop-time-wrap">
            <span class="pomo-pop-big-digits" style="font-size:14.5px;letter-spacing:0;">${isRu ? "Лазерная указка" : "Laser Pointer Studio"}</span>
            <span class="pomo-pop-status-badge ${isLaserOn ? "" : "is-break"}">${isLaserOn ? (isRu ? "Активен" : "Active") : (isRu ? "Готов" : "Ready")}</span>
          </div>
          <div class="pomo-pop-actions">
            <button class="pomo-pop-btn" id="laser-toggle-mode-btn">
              ${isLaserOn ? (isRu ? "Выключить" : "Turn Off") : (isRu ? "Включить" : "Turn On")}
            </button>
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Цвет луча" : "Laser Beam Color"}</div>
        <div class="artcraft-popover-swatch-row">
          ${laserColors.map((c) => `
            <button class="artcraft-pop-swatch ${curColor.toLowerCase() === c.id.toLowerCase() ? "is-active" : ""}" data-laser-color="${c.id}" title="${c.label}" style="background:${c.id};"></button>
          `).join("")}
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Размер точки и луча" : "Beam Size & Thickness"}</div>
        <div class="pomo-pop-chips-grid" style="grid-template-columns: repeat(2, 1fr);">
          ${laserSizes.map((s) => `
            <div class="pomo-pop-chip ${curSize === s.val ? "is-active" : ""}" data-laser-size="${s.val}">
              ${s.label}
            </div>
          `).join("")}
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Длина шлейфа" : "Comet Trail Length"}</div>
        <div class="pomo-pop-chips-grid">
          ${trailModes.map((t) => `
            <div class="pomo-pop-chip ${curTrail === t.val ? "is-active" : ""}" data-laser-trail="${t.val}">
              ${t.label}
            </div>
          `).join("")}
        </div>
      `;

      pop.querySelector("#laser-toggle-mode-btn")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.toggleMode(this.mode === "laser" ? "none" : "laser");
        renderLaser();
      });

      pop.querySelectorAll("[data-laser-color]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const col = el.getAttribute("data-laser-color") || "#EF4444";
          this.settings.laserColor = col;
          this.settings.strokeColor = col;
          await this.saveSettings();
          if (this.mode !== "laser") this.toggleMode("laser");
          this.updateDockUI();
          renderLaser();
        });
      });

      pop.querySelectorAll("[data-laser-size]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.laserSize = parseInt(el.getAttribute("data-laser-size"), 10) || 6;
          await this.saveSettings();
          if (this.mode !== "laser") this.toggleMode("laser");
          renderLaser();
        });
      });

      pop.querySelectorAll("[data-laser-trail]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.laserTrailMs = parseInt(el.getAttribute("data-laser-trail"), 10) || 450;
          await this.saveSettings();
          if (this.mode !== "laser") this.toggleMode("laser");
          renderLaser();
        });
      });
    };

    renderLaser();
    document.body.appendChild(pop);
    this.positionDockPopover(pop, anchorBtn || this.btnLaser, 310);

    const closeHandler = (e) => {
      if (!e.target || !e.target.isConnected) return;
      if (this.laserPopoverEl && !this.laserPopoverEl.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
        this.closeAllDockPopovers();
      }
    };
    this.laserPopoverCloseHandler = closeHandler;
    setTimeout(() => {
      if (this.laserPopoverCloseHandler === closeHandler) {
        document.addEventListener("pointerdown", closeHandler);
      }
    }, 40);
  }

  toggleDrawPopover(anchorBtn) {
    if (this.drawPopoverEl) {
      this.closeAllDockPopovers();
      return;
    }
    this.closeAllDockPopovers("draw");

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-pomodoro-popover artcraft-draw-popover";
    pop.addEventListener("pointerdown", (e) => e.stopPropagation());
    pop.addEventListener("click", (e) => e.stopPropagation());
    this.drawPopoverEl = pop;

    const drawColors = [
      { id: "#2563EB", label: isRu ? "Сапфир" : "Sapphire" },
      { id: "#69BD28", label: isRu ? "Изумруд" : "Emerald" },
      { id: "#F59E0B", label: isRu ? "Янтарь" : "Amber" },
      { id: "#EF4444", label: isRu ? "Рубин" : "Crimson" },
      { id: "#8B5CF6", label: isRu ? "Аметист" : "Amethyst" },
      { id: "#EC4899", label: isRu ? "Роза" : "Rose" },
      { id: "#06B6D4", label: isRu ? "Циан" : "Cyan" },
      { id: "#1E293B", label: isRu ? "Тушь" : "Ink" },
    ];
    const drawSizes = [
      { val: 2, label: "2px · Fine" },
      { val: 4, label: "4px · Pen" },
      { val: 8, label: "8px · Bold" },
      { val: 16, label: "16px · Marker" },
    ];
    const drawStyles = [
      { id: "pen", label: isRu ? "✒️ Перо (Чёткое)" : "✒️ Smooth Pen", op: 92 },
      { id: "highlighter", label: isRu ? "🖍️ Текстовыделитель" : "🖍️ Highlighter", op: 38 },
    ];

    const renderDraw = () => {
      const curSize = this.settings.drawSize || 4;
      const curColor = this.settings.drawColor || this.settings.strokeColor || "#2563EB";
      const curStyle = this.settings.drawStyle || "pen";
      const isDrawOn = this.mode === "draw";

      pop.innerHTML = `
        <div class="pomo-pop-head">
          <div class="pomo-pop-time-wrap">
            <span class="pomo-pop-big-digits" style="font-size:14.5px;letter-spacing:0;">${isRu ? "Кисть и Маркер" : "Draw & Marker Studio"}</span>
            <span class="pomo-pop-status-badge ${isDrawOn ? "" : "is-break"}">${isDrawOn ? (isRu ? "Рисование" : "Drawing") : (isRu ? "Готов" : "Ready")}</span>
          </div>
          <div class="pomo-pop-actions">
            <button class="pomo-pop-btn" id="draw-toggle-mode-btn">
              ${isDrawOn ? (isRu ? "Выкл" : "Stop") : (isRu ? "Рисовать" : "Draw")}
            </button>
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Режим инструмента" : "Brush Mode"}</div>
        <div class="pomo-pop-chips-grid" style="grid-template-columns: repeat(2, 1fr);">
          ${drawStyles.map((st) => `
            <div class="pomo-pop-chip ${curStyle === st.id ? "is-active" : ""}" data-draw-style="${st.id}" data-draw-op="${st.op}">
              ${st.label}
            </div>
          `).join("")}
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Цвет чернил" : "Ink Color"}</div>
        <div class="artcraft-popover-swatch-row">
          ${drawColors.map((c) => `
            <button class="artcraft-pop-swatch ${curColor.toLowerCase() === c.id.toLowerCase() ? "is-active" : ""}" data-draw-color="${c.id}" title="${c.label}" style="background:${c.id};"></button>
          `).join("")}
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Толщина линии" : "Stroke Thickness"}</div>
        <div class="pomo-pop-chips-grid" style="grid-template-columns: repeat(2, 1fr);">
          ${drawSizes.map((s) => `
            <div class="pomo-pop-chip ${curSize === s.val ? "is-active" : ""}" data-draw-size="${s.val}">
              ${s.label}
            </div>
          `).join("")}
        </div>

        <div class="pomo-pop-actions" style="margin-top:8px;justify-content:space-between;width:100%;">
          <button class="pomo-pop-btn is-secondary" id="draw-pop-undo" style="flex:1;justify-content:center;">↩ ${isRu ? "Отменить" : "Undo"}</button>
          <button class="pomo-pop-btn is-secondary" id="draw-pop-clear" style="flex:1;justify-content:center;">✕ ${isRu ? "Очистить всё" : "Clear All"}</button>
        </div>
      `;

      pop.querySelector("#draw-toggle-mode-btn")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.toggleMode(this.mode === "draw" ? "none" : "draw");
        renderDraw();
      });

      pop.querySelectorAll("[data-draw-style]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const st = el.getAttribute("data-draw-style") || "pen";
          this.settings.drawStyle = st;
          this.settings.drawOpacity = parseInt(el.getAttribute("data-draw-op"), 10) || (st === "highlighter" ? 38 : 92);
          if (st === "highlighter" && (this.settings.drawSize || 4) < 12) {
            this.settings.drawSize = 16;
          } else if (st === "pen" && (this.settings.drawSize || 4) >= 16) {
            this.settings.drawSize = 4;
          }
          await this.saveSettings();
          if (this.mode !== "draw") this.toggleMode("draw");
          renderDraw();
        });
      });

      pop.querySelectorAll("[data-draw-color]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const col = el.getAttribute("data-draw-color") || "#2563EB";
          this.settings.drawColor = col;
          this.settings.strokeColor = col;
          await this.saveSettings();
          if (this.mode !== "draw") this.toggleMode("draw");
          this.updateDockUI();
          renderDraw();
        });
      });

      pop.querySelectorAll("[data-draw-size]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.drawSize = parseInt(el.getAttribute("data-draw-size"), 10) || 4;
          await this.saveSettings();
          if (this.mode !== "draw") this.toggleMode("draw");
          renderDraw();
        });
      });

      pop.querySelector("#draw-pop-undo")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.undo();
      });

      pop.querySelector("#draw-pop-clear")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.clearAllAnnotations();
      });
    };

    renderDraw();
    document.body.appendChild(pop);
    this.positionDockPopover(pop, anchorBtn || this.btnDraw, 320);

    const closeHandler = (e) => {
      if (!e.target || !e.target.isConnected) return;
      if (this.drawPopoverEl && !this.drawPopoverEl.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
        this.closeAllDockPopovers();
      }
    };
    this.drawPopoverCloseHandler = closeHandler;
    setTimeout(() => {
      if (this.drawPopoverCloseHandler === closeHandler) {
        document.addEventListener("pointerdown", closeHandler);
      }
    }, 40);
  }

  positionDockPopover(popEl, anchorBtn, popW = 340) {
    if (!popEl || !anchorBtn) return;
    const btnRect = anchorBtn.getBoundingClientRect();
    const dockRect = this.dockEl ? this.dockEl.getBoundingClientRect() : btnRect;
    const isVertical = !!(this.dockEl && this.dockEl.classList.contains("is-vertical"));

    popEl.style.left = "";
    popEl.style.right = "";
    popEl.style.top = "";
    popEl.style.bottom = "";

    if (isVertical) {
      const rightGap = Math.max(16, window.innerWidth - dockRect.left + 12);
      popEl.style.right = `${rightGap}px`;
      const popH = popEl.offsetHeight || 340;
      const idealTop = btnRect.top + btnRect.height / 2 - popH / 2;
      const clampedTop = Math.max(16, Math.min(window.innerHeight - popH - 16, idealTop));
      popEl.style.top = `${Math.round(clampedTop)}px`;
    } else {
      let left = btnRect.left + btnRect.width / 2 - popW / 2;
      if (left < 16) left = 16;
      if (left + popW > window.innerWidth - 16) left = window.innerWidth - popW - 16;
      popEl.style.left = `${Math.round(left)}px`;
      const bottomGap = Math.max(76, window.innerHeight - dockRect.top + 12);
      popEl.style.bottom = `${Math.round(bottomGap)}px`;
    }
  }

  toggleSonicPopover(anchorBtn) {
    if (this.sonicPopoverEl) {
      this.closeAllDockPopovers();
      return;
    }
    this.closeAllDockPopovers("sonic");

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-pomodoro-popover artcraft-sonic-popover";
    pop.addEventListener("pointerdown", (e) => e.stopPropagation());
    pop.addEventListener("click", (e) => e.stopPropagation());
    this.sonicPopoverEl = pop;

    const eqModes = [
      { id: "craft", ru: "01 · Сейсмограф", en: "01 · Seismograph" },
      { id: "dna", ru: "02 · Матрица", en: "02 · Matrix" },
      { id: "bars", ru: "03 · Ризограф", en: "03 · Risograph" },
      { id: "wave", ru: "04 · Лента", en: "04 · Silk Wave" },
      { id: "orb", ru: "05 · Оригами", en: "05 · Origami" },
      { id: "ferro", ru: "06 · Струны", en: "06 · Strings" },
    ];

    const quickSounds = [
      { id: "off", ru: "Выкл", en: "Off" },
      { id: "rain", ru: "Дождь", en: "Rain" },
      { id: "brown", ru: "Шум", en: "Brown" },
      { id: "ocean", ru: "Прибой", en: "Ocean" },
      { id: "fire", ru: "Камин", en: "Hearth" },
      { id: "cafe", ru: "Кофейня", en: "Cafe" },
      { id: "stream", ru: "Ручей", en: "Stream" },
      { id: "gamma40", ru: "40 Гц", en: "40 Hz" },
      { id: "nordic_wind", ru: "Ветер", en: "Wind" },
    ];

    const renderSonic = () => {
      const curMode = this.settings.eqMode || "craft";
      const curSnd = this.settings.ambientSound || "off";
      const curVol = this.settings.audioVolume !== undefined ? this.settings.audioVolume : 75;
      const isPcSync = !!this.desktopAudioNodes;

      pop.innerHTML = `
        <div class="pomo-pop-head">
          <div class="pomo-pop-time-wrap">
            <span class="pomo-pop-big-digits" style="font-size:15px;letter-spacing:0;">${isRu ? "Аудио и Эквалайзер" : "Sonic & Equalizer"}</span>
            <span class="pomo-pop-status-badge ${isPcSync || curSnd !== "off" ? "" : "is-break"}">${
              isPcSync ? (isRu ? "Звук ПК" : "PC Sync") : curSnd !== "off" ? `${curVol}%` : (isRu ? "Тишина" : "Idle")
            }</span>
          </div>
          <div class="pomo-pop-actions">
            <button class="pomo-pop-btn" id="sonic-pc-sync-btn">
              ${isPcSync ? (isRu ? "Откл. ПК" : "Stop PC") : (isRu ? "Звук ПК" : "PC Audio")}
            </button>
            <button class="pomo-pop-btn is-secondary" id="sonic-open-full-btn" title="${isRu ? "Открыть полную студию" : "Open full Sonic Studio"}">
              ⋯
            </button>
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Стиль эквалайзера" : "Equalizer Visualizer"}</div>
        <div class="pomo-pop-chips-grid">
          ${eqModes.map((m) => `
            <div class="pomo-pop-chip ${curMode === m.id ? "is-active" : ""}" data-eq-mode="${m.id}">
              ${isRu ? m.ru : m.en}
            </div>
          `).join("")}
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Фоновый звук" : "Ambient Soundscape"} · ${curVol}%</div>
        <div class="pomo-pop-chips-grid">
          ${quickSounds.map((s) => `
            <div class="pomo-pop-chip ${curSnd === s.id ? "is-active" : ""}" data-snd-id="${s.id}">
              ${isRu ? s.ru : s.en}
            </div>
          `).join("")}
        </div>
      `;

      pop.querySelector("#sonic-pc-sync-btn")?.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await this.toggleDesktopAudioCapture();
        renderSonic();
      });

      pop.querySelector("#sonic-open-full-btn")?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.openSonicStudioModal();
      });

      pop.querySelectorAll("[data-eq-mode]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.eqMode = el.getAttribute("data-eq-mode") || "craft";
          await this.saveSettings();
          this.updateEqualizerPillUI();
          renderSonic();
        });
      });

      pop.querySelectorAll("[data-snd-id]").forEach((el) => {
        el.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const sid = el.getAttribute("data-snd-id") || "off";
          await this.setAmbientSound(sid);
          renderSonic();
        });
      });
    };

    renderSonic();
    document.body.appendChild(pop);
    this.positionDockPopover(pop, anchorBtn || this.eqWrap, 330);

    const closeHandler = (e) => {
      if (!e.target || !e.target.isConnected) return;
      if (this.sonicPopoverEl && !this.sonicPopoverEl.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
        this.closeAllDockPopovers();
      }
    };
    this.sonicPopoverCloseHandler = closeHandler;
    setTimeout(() => {
      if (this.sonicPopoverCloseHandler === closeHandler) {
        document.addEventListener("pointerdown", closeHandler);
      }
    }, 40);
  }

  showAudioMenu(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    this.toggleSonicPopover(this.eqWrap || (event && event.currentTarget));
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

  // --- AUDIO SOURCE FOR THE EQUALIZER ---
  // type "system" = what the PC is playing (Windows output loopback), "mic" = an input device.
  connectStreamToAnalyser(stream, type) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const audioTracks = stream.getAudioTracks ? stream.getAudioTracks() : [];
    const audioOnlyStream = audioTracks.length > 0 ? new MediaStream(audioTracks) : stream;
    let source;
    try {
      source = ctx.createMediaStreamSource(audioOnlyStream);
    } catch (e) {
      ctx.close();
      throw e;
    }
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.55;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -12;
    // The analyser is deliberately not routed to ctx.destination: captured sound must never be played back twice.
    source.connect(analyser);

    const nodes = { ctx, stream, audioOnlyStream, source, analyser, type };
    // If Windows drops the capture (output device unplugged or switched), release everything cleanly.
    audioTracks.forEach((track) => {
      track.addEventListener("ended", () => {
        if (this.desktopAudioNodes === nodes) this.stopAudioCapture(true);
      });
    });
    this.desktopAudioNodes = nodes;
    this.updateEqualizerPillUI();
  }

  // Multi-strategy PC System Audio Loopback for Obsidian Desktop (Electron 25-33+ on Windows WASAPI, macOS & Linux):
  // 1. Queries electron.desktopCapturer for screen sourceId when available, then requests chromeMediaSource: "desktop".
  //    CRITICAL: Keeps carrier video track muted (vt.enabled = false) instead of calling vt.stop(), because stopping
  //    the carrier video track immediately terminates WASAPI loopback audio in Chromium/Electron!
  // 2. Falls back to getDisplayMedia({ audio: true, systemAudio: "include" }) if desktop constraints are restricted.
  // 3. Falls back to Loopback / Stereo Mix / VB-Cable / BlackHole input device or active DOM <audio>/<video> elements.
  async openSystemLoopbackStream() {
    if (!navigator.mediaDevices) return null;
    let stream = null;

    // Strategy A: Electron desktopCapturer sourceId + chromeMediaSource: "desktop"
    let desktopSourceId = null;
    try {
      const electronMod = typeof window.require === "function" ? window.require("electron") : null;
      const capturer =
        (electronMod && electronMod.desktopCapturer) ||
        (electronMod && electronMod.remote && electronMod.remote.desktopCapturer) ||
        null;
      if (capturer && typeof capturer.getSources === "function") {
        const sources = await capturer.getSources({ types: ["screen"] });
        if (Array.isArray(sources) && sources.length > 0 && sources[0].id) {
          desktopSourceId = sources[0].id;
        }
      }
    } catch (e) {}

    if (navigator.mediaDevices.getUserMedia) {
      const constraintVariants = [];
      if (desktopSourceId) {
        constraintVariants.push({
          audio: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: desktopSourceId,
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: desktopSourceId,
              minWidth: 16,
              maxWidth: 32,
              minHeight: 16,
              maxHeight: 32,
              maxFrameRate: 1,
            },
          },
        });
      }
      constraintVariants.push({
        audio: { mandatory: { chromeMediaSource: "desktop" } },
        video: { mandatory: { chromeMediaSource: "desktop", maxWidth: 32, maxHeight: 32, maxFrameRate: 1 } },
      });

      for (let i = 0; i < constraintVariants.length; i++) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraintVariants[i]);
          if (stream && stream.getAudioTracks().length > 0) break;
          if (stream) stream.getTracks().forEach((tr) => tr.stop());
          stream = null;
        } catch (e) {
          stream = null;
        }
      }
    }

    // Strategy B: Chromium getDisplayMedia with systemAudio: "include"
    if (!stream && typeof navigator.mediaDevices.getDisplayMedia === "function") {
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: { width: 32, height: 32, frameRate: 1 },
          systemAudio: "include",
        });
        if (!stream || stream.getAudioTracks().length === 0) {
          if (stream) stream.getTracks().forEach((tr) => tr.stop());
          stream = null;
        }
      } catch (e) {
        stream = null;
      }
    }

    if (!stream) return null;

    // Disable (do NOT stop!) carrier video tracks so Chromium keeps WASAPI audio loopback alive
    stream.getVideoTracks().forEach((vt) => {
      try {
        vt.enabled = false;
      } catch (e) {}
    });

    if (stream.getAudioTracks().length === 0) {
      stream.getTracks().forEach((tr) => tr.stop());
      return null;
    }
    return stream;
  }

  // Fallback where desktop loopback is unavailable: a "Stereo Mix", VB-Cable, BlackHole, or user-selected device
  async openLoopbackInputDeviceStream() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return null;
      const savedDevId = this.settings.audioInputDeviceId;
      if (savedDevId && savedDevId !== "auto") {
        try {
          return await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: savedDevId }, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
            video: false,
          });
        } catch (e) {}
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const dev = devices.find(
        (d) =>
          d.kind === "audioinput" &&
          /stereo mix|стерео микшер|смеситель|what u hear|loopback|blackhole|soundflower|voicemeeter|vb-audio|cable output|monitor|wasapi|системн/i.test(
            d.label || ""
          )
      );
      if (!dev) return null;
      return await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: dev.deviceId }, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false,
      });
    } catch (e) {
      return null;
    }
  }

  // Hooks any playing HTML5 <audio> or <video> elements inside Obsidian so embedded media always drives the equalizer
  connectPageMediaElementsToAnalyser() {
    try {
      const mediaEls = Array.from(document.querySelectorAll("audio, video"));
      if (mediaEls.length === 0) return false;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      if (!this._pageMediaCtx || this._pageMediaCtx.state === "closed") {
        this._pageMediaCtx = new AudioCtx();
        this._pageMediaAnalyser = this._pageMediaCtx.createAnalyser();
        this._pageMediaAnalyser.fftSize = 2048;
        this._pageMediaAnalyser.smoothingTimeConstant = 0.62;
        this._pageMediaAnalyser.minDecibels = -95;
        this._pageMediaAnalyser.maxDecibels = -12;
        this._pageMediaAnalyser.connect(this._pageMediaCtx.destination);
      }
      if (this._pageMediaCtx.state === "suspended") this._pageMediaCtx.resume();
      let hooked = 0;
      mediaEls.forEach((el) => {
        if (this.ambientNodes && this.ambientNodes.audioEl === el) return;
        if (!el._artcraftMediaSource) {
          try {
            const srcNode = this._pageMediaCtx.createMediaElementSource(el);
            srcNode.connect(this._pageMediaAnalyser);
            el._artcraftMediaSource = srcNode;
            hooked++;
          } catch (e) {}
        } else {
          hooked++;
        }
      });
      return hooked > 0;
    } catch (e) {
      return false;
    }
  }

  async startSystemAudioCapture(silent = false) {
    this.stopAudioCapture(true);
    const seq = (this.captureSeq = (this.captureSeq || 0) + 1);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    let stream = (await this.openSystemLoopbackStream()) || (await this.openLoopbackInputDeviceStream());
    if (stream && (seq !== this.captureSeq || this._unloaded)) {
      stream.getTracks().forEach((tr) => tr.stop());
      return false;
    }
    if (!stream) {
      // Try hooking in-app media elements or microphone fallback when explicit user action requested capture
      const hookedPageMedia = this.connectPageMediaElementsToAnalyser();
      if (hookedPageMedia) {
        this.desktopAudioNodes = {
          ctx: this._pageMediaCtx,
          analyser: this._pageMediaAnalyser,
          type: "system",
        };
        this.updateEqualizerPillUI();
        if (!silent) new Notice(isRu ? "Эквалайзер подключён к медиа-потоку Obsidian!" : "Equalizer connected to Obsidian media stream!");
        return true;
      }
      if (!silent) {
        // Automatic fallback to microphone/input capture so the equalizer immediately responds to room/speaker sound
        const micOk = await this.startMicAudioCapture();
        if (micOk) return true;
        new Notice(
          isRu
            ? "Системный звук на этом устройстве недоступен. Выберите вход в Sonic Studio."
            : "System audio is not available on this device. Select an input in Sonic Studio."
        );
      }
      return false;
    }
    try {
      this.connectStreamToAnalyser(stream, "system");
    } catch (err) {
      stream.getTracks().forEach((tr) => tr.stop());
      if (!silent) new Notice(isRu ? "Не удалось подключить системный звук." : "Could not connect system audio.");
      return false;
    }
    if (!this.settings.systemAudioAutoConnect) {
      this.settings.systemAudioAutoConnect = true;
      this.saveSettings();
    }
    if (!silent) {
      new Notice(t("audioConnectedNotice", this));
      this.showIslandTrackCapsule(isRu ? "Звук ПК (Loopback)" : "PC Audio Loopback");
    }
    return true;
  }

  async startDeviceAudioCapture(deviceId, silent = false) {
    this.stopAudioCapture(true);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    try {
      const seq = (this.captureSeq = (this.captureSeq || 0) + 1);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      if (seq !== this.captureSeq || this._unloaded) {
        stream.getTracks().forEach((tr) => tr.stop());
        return false;
      }
      this.connectStreamToAnalyser(stream, "mic");
      if (!silent) new Notice(t("audioMicConnectedNotice", this));
      return true;
    } catch (err) {
      if (!silent) {
        new Notice(isRu ? "Не удалось открыть выбранное аудиоустройство." : "Could not open the selected audio device.");
      }
      return false;
    }
  }

  async startMicAudioCapture() {
    this.stopAudioCapture(true);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    try {
      const audioConstraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: true };
      const savedDevice = this.settings.audioInputDeviceId;
      if (savedDevice && savedDevice !== "auto") audioConstraints.deviceId = { ideal: savedDevice };
      const seq = (this.captureSeq = (this.captureSeq || 0) + 1);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });
      if (seq !== this.captureSeq || this._unloaded) {
        stream.getTracks().forEach((tr) => tr.stop());
        return false;
      }
      this.connectStreamToAnalyser(stream, "mic");
      new Notice(t("audioMicConnectedNotice", this));
      return true;
    } catch (err) {
      new Notice(isRu ? "Нет доступа к микрофону." : "Could not access the microphone.");
      return false;
    }
  }

  stopAudioCapture(silent = false) {
    const nodes = this.desktopAudioNodes;
    if (!nodes) return;
    this.desktopAudioNodes = null;
    try {
      if (nodes.stream) nodes.stream.getTracks().forEach((tr) => tr.stop());
    } catch (e) {}
    try {
      if (nodes.source) nodes.source.disconnect();
    } catch (e) {}
    try {
      if (nodes.ctx && nodes.ctx.state !== "closed") nodes.ctx.close();
    } catch (e) {}
    this.updateEqualizerPillUI();
    if (!silent) {
      // An explicit stop by the user also cancels the reconnect on next launch.
      if (nodes.type === "system" && this.settings.systemAudioAutoConnect) {
        this.settings.systemAudioAutoConnect = false;
        this.saveSettings();
      }
      new Notice(t("audioStoppedNotice", this));
    }
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

    async toggleAudioPlayStop() {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const curSound = this.settings.ambientSound || "off";
    if (curSound !== "off") {
      this._lastAmbientSound = curSound;
      await this.setAmbientSound("off");
      new Notice(isRu ? "Звук: Пауза ⏸" : "Audio: Paused ⏸", 1200);
    } else {
      const soundToPlay = this._lastAmbientSound || "rain";
      await this.setAmbientSound(soundToPlay);
      const soundLabel = soundToPlay === "rain" ? (isRu ? "Дождь" : "Rain") : soundToPlay === "brown" ? (isRu ? "Шум" : "Brown Noise") : (isRu ? "Гамма 40Hz" : "Gamma 40Hz");
      new Notice(isRu ? `Звук: Воспроизведение ▶ (${soundLabel})` : `Audio: Playing ▶ (${soundLabel})`, 1400);
    }
    this.updateEqualizerPillUI();
  }

  updateEqualizerPillUI() {
    // Source, mode or dock changed: redraw at least once and let the loop decide whether to keep running.
    this.eqRestFrames = 0;
    this.eqRestKey = null;
    this.wakeVisualLoop();
    if (!this.eqWrap) return;
    const isSynced = !!(this.desktopAudioNodes || this.ambientNodes);
    this.eqWrap.classList.toggle("is-synced", isSynced);
    this.eqWrap.classList.toggle("is-audio-live", isSynced);
    const isRuUi = (this.settings.uiLanguage || "en") === "ru";
    const srcType = this.desktopAudioNodes ? this.desktopAudioNodes.type : this.ambientNodes ? "ambient" : "off";
    const srcLabels = {
      system: isRuUi ? "Эквалайзер: звук ПК" : "Equalizer: PC audio",
      mic: isRuUi ? "Эквалайзер: микрофон" : "Equalizer: microphone",
      ambient: isRuUi ? "Эквалайзер: звуки плагина" : "Equalizer: plugin soundscape",
      off: isRuUi ? "Эквалайзер: нажмите, чтобы подключить звук ПК" : "Equalizer: click to connect PC audio",
    };
    // aria-label removed to prevent duplicate tooltip underneath the dock overlapping status bar
    this.eqWrap.removeAttribute("aria-label");
    this.eqWrap.dataset.audioSource = srcType;
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
      // Nothing connected yet: the first click hooks up what the PC is playing. The studio stays on right-click.
      const ok = await this.startSystemAudioCapture();
      if (!ok) this.openSonicStudioModal();
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
  // --- 4. 1-CLICK SWISS BENTO QUOTE CARD EXPORTER ---
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
      text = view.editor.getValue().split("\n").filter((l) => l.trim().length > 20)[0] || "Deep work in Swiss Craft clarity.";
    }

    const cardMarkdown = `> [!NOTE] ${title} — ALCHEMY CRAFT // STUDIO
> **"${text.replace(/\n+/g, " ")}"**
> 
> \`01 // FOCUS\` • \`#F4F3EF ARCHIVAL PAPER\` • \`@StratAlchemy\``;

    await navigator.clipboard.writeText(cardMarkdown);
    this.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 45);
    new Notice("Swiss Craft Callout Card copied to clipboard! Paste anywhere in Obsidian or social media.");
  }

  registerCommands() {
    this.addCommand({
      id: "open-note-kanban-studio",
      name: "Open Note Kanban Studio (Note Kanban Board)",
      callback: () => this.openNoteKanbanModal(),
    });

    this.addCommand({
      id: "open-alchemist-roastery",
      name: "Open Alchemist Roastery & Pro Studio",
      callback: () => new AlchemyCraftProModal(this.app, this).open(),
    });

    this.addCommand({
      id: "toggle-page-cards",
      name: "Toggle decorated page (heading cards)",
      callback: async () => {
        this.settings.pageCards = this.settings.pageCards !== true;
        await this.saveSettings();
        this.applyBodyClasses();
        this.fitDockToWindow();
      },
    });
    this.addCommand({
      id: "toggle-related-notes",
      name: "Toggle related notes under the note",
      callback: async () => {
        this.settings.windChainFooter = this.settings.windChainFooter === false;
        await this.saveSettings();
        this.updateTaskProgressBar();
      },
    });
    this.addCommand({
      id: "toggle-key-sentence-marker",
      name: "Toggle key sentence marker (reading view)",
      callback: () => this.toggleKeySentenceMarker(),
    });
    this.addCommand({
      id: "toggle-pc-audio-equalizer",
      name: "Connect / disconnect PC audio for the equalizer",
      callback: () => this.toggleDesktopAudioCapture(),
    });
    this.addCommand({
      id: "toggle-lamp-beat-sync",
      name: "Toggle cursor lamp pulse on music beats",
      callback: async () => {
        this.settings.lampBeatSync = !this.settings.lampBeatSync;
        await this.saveSettings();
        const isRu = (this.settings.uiLanguage || "en") === "ru";
        new Notice(
          isRu
            ? `Лампа в такт музыке: ${this.settings.lampBeatSync ? "включена (нужны лампа и подключённый звук)" : "выключена"}`
            : `Lamp beat pulse: ${this.settings.lampBeatSync ? "on (needs the lamp and connected audio)" : "off"}`
        );
      },
    });
    this.addCommand({
      id: "open-creator-os-studio",
      name: "Open Creator Studio (brand brief, post builder, task board)",
      callback: () => this.openCreatorOsModal(),
    });
    this.addCommand({
      id: "trigger-autopilot-interrupt",
      name: "Open focus check-in",
      callback: () => this.openAutopilotInterruptModal(),
    });
    this.addCommand({
      id: "start-60s-pro-test-drive",
      name: "Try Pro features for 60 seconds",
      callback: () => this.startProTestDrive60s(),
    });
    this.addCommand({
      id: "open-life-rpg-quest-blockchain",
      name: "Open quest log",
      callback: () => this.openQuestChainModal(),
    });
    this.addCommand({
      id: "open-bio-flow-readiness",
      name: "Open energy and focus tracker",
      callback: () => this.openBioFlowModal(),
    });
    this.addCommand({
      id: "open-creative-margin-sketchpad",
      name: "Open sketchpad and insert a drawing into the note",
      callback: () => this.openCreativeSketchModal(),
    });
    this.addCommand({
      id: "toggle-night-light-compensation",
      name: "Toggle Night Light compensation (cooler page colours)",
      callback: async () => {
        this.settings.nightLightCompensation = !this.settings.nightLightCompensation;
        await this.saveSettings();
        this.applyBodyClasses();
        new Notice(
          this.settings.nightLightCompensation
            ? "Компенсация «Ночного света» Windows 11 ВКЛЮЧЕНА (Чистый алебастровый лист без желтизны)"
            : "Компенсация «Ночного света» ВЫКЛЮЧЕНА (Тёплый архивный пергамент)"
        );
      },
    });
    this.addCommand({
      id: "toggle-dock-orientation",
      name: "Toggle dock position (bottom / right side)",
      callback: () => this.toggleDockOrientation(),
    });

    this.addCommand({
      id: "toggle-dock-collapse",
      name: "Collapse or expand the dock",
      callback: () => this.toggleDockCollapse(),
    });

    this.addCommand({
      id: "toggle-artcraft-theme",
      name: "Toggle page theme",
      callback: async () => {
        this.settings.artcraftTheme = !this.settings.artcraftTheme;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-dark-craft-theme",
      name: "Toggle dark page theme (Pro, not available yet)",
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
      name: "Graph view: colour notes by top-level folder",
      callback: () => this.applyBentoGraphColorGroups(),
    });

    this.addCommand({
      id: "toggle-focus-timer",
      name: "Start or pause the focus timer",
      callback: () => this.toggleTimer(),
    });

    this.addCommand({
      id: "reset-focus-timer",
      name: "Reset the focus timer",
      callback: () => this.resetTimer(),
    });

    this.addCommand({
      id: "toggle-sentence-focus",
      name: "Toggle sentence focus and number badges",
      callback: async () => {
        this.settings.sentenceFocus = !this.settings.sentenceFocus;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-laser-pointer",
      name: "Toggle laser pointer",
      callback: () => this.toggleMode(this.mode === "laser" ? "none" : "laser"),
    });

    this.addCommand({
      id: "toggle-draw-marker",
      name: "Toggle drawing marker",
      callback: () => this.toggleMode(this.mode === "draw" ? "none" : "draw"),
    });

    this.addCommand({
      id: "toggle-eraser",
      name: "Toggle eraser",
      callback: () => this.toggleMode(this.mode === "eraser" ? "none" : "eraser"),
    });

    this.addCommand({
      id: "undo-drawing",
      name: "Undo last drawing stroke",
      callback: () => this.undo(),
    });

    this.addCommand({
      id: "redo-drawing",
      name: "Redo drawing stroke",
      callback: () => this.redo(),
    });

    this.addCommand({
      id: "clean-ai-watermarks",
      name: "Remove invisible characters from the note or selection",
      callback: () => this.cleanCurrentNoteAIWatermarks(),
    });

    this.addCommand({
      id: "toggle-magic-cursor-lamp",
      name: "Toggle cursor lamp",
      callback: () => this.toggleMagicLamp(),
    });

    this.addCommand({
      id: "load-custom-music-visualizer",
      name: "Play an audio file through the equalizer",
      callback: () => this.openCustomAudioPicker(),
    });

    this.addCommand({
      id: "export-bento-quote-card",
      name: "Copy selection as a quote callout",
      callback: () => this.exportSelectionAsBentoCard(),
    });

    this.addCommand({
      id: "toggle-spotlight-focus",
      name: "Toggle paragraph spotlight",
      callback: async () => {
        this.settings.spotlightFocus = !this.settings.spotlightFocus;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "add-nutrient-book-sticker",
      name: "Add a margin sticker to the current line",
      callback: () => this.addMarginBookmarkToActiveNote(),
    });

    this.addCommand({
      id: "open-book-nutrient-digest",
      name: "Open the digest of stickers in this note",
      callback: () => this.openBookNutrientDigestModal(),
    });

    this.addCommand({
      id: "open-two-page-book-spread",
      name: "Open the note as a two-page spread",
      callback: () => this.openTrueTwoPageBookSpread(),
    });

    this.addCommand({
      id: "open-interactive-tour",
      name: "Open the tour note",
      callback: () => this.openInteractiveTourNote(),
    });

    this.addCommand({
      id: "toggle-time-capsule-seal",
      name: "Time capsule: seal or open the current note",
      callback: () => this.toggleNoteWaxSeal(),
    });

    this.addCommand({
      id: "open-dual-cognition-studio",
      name: "Open note summary, AI capsule and similar notes",
      callback: () => this.openDualCognitionModal(),
    });

    this.addCommand({
      id: "compile-vault-llms-txt",
      name: "Write llms.txt index of recent notes to the vault root",
      callback: () => this.compileVaultLlmsTxtFile(),
    });

    this.addCommand({
      id: "insert-executive-brief-callout",
      name: "Insert a summary callout at the top of the note",
      callback: () => this.insertExecutiveBriefIntoActiveNote(),
    });

    this.addCommand({
      id: "clear-drawings",
      name: "Clear all drawings",
      callback: () => this.clearAllAnnotations(),
    });
  }

  onunload() {
    this._unloaded = true;
    if (this.progressRefreshTimer) {
      clearTimeout(this.progressRefreshTimer);
      this.progressRefreshTimer = null;
    }
    // A running Pro test-drive must not outlive the plugin: its timer would rebuild the dock after unload.
    if (this.proTestDriveTimer) {
      clearInterval(this.proTestDriveTimer);
      this.proTestDriveTimer = null;
    }
    if (this.proTestDriveActive && this.proTestDrivePrev) {
      this.settings.isPro = this.proTestDrivePrev.isPro;
      this.settings.darkCraftTheme = this.proTestDrivePrev.darkCraftTheme;
      this.proTestDriveActive = false;
    }
    document.querySelectorAll(".artcraft-testdrive-banner").forEach((el) => el.remove());
    if (this.eqIdleTimer) {
      clearTimeout(this.eqIdleTimer);
      this.eqIdleTimer = null;
    }
    if (this.inViewObserver) {
      this.inViewObserver.disconnect();
      this.inViewObserver = null;
    }
    if (this.keyMarkObserver) {
      this.keyMarkObserver.disconnect();
      this.keyMarkObserver = null;
    }
    this.kinDestroyAll();
    this.stopFlaskHydroLoop();
    this.stopIslandLiveSpectrogram();
    this.destroyBookFolio3DPhysics();
    if (this.zenAtmosphereEl) { this.zenAtmosphereEl.remove(); this.zenAtmosphereEl = null; }
    if (this.activePopoverTetherEl) { this.activePopoverTetherEl.remove(); this.activePopoverTetherEl = null; }
    this.releasePaperTexture();
    this.paperTileKey = null;
    // Windows of the plugin that are still open would keep running code of the unloaded plugin.
    document.querySelectorAll(".modal-container").forEach((mc) => {
      const modal = mc.querySelector(".modal");
      if (!modal || !/artcraft-|sicraft-/.test(modal.className + " " + (modal.querySelector(".modal-content") || modal).className)) return;
      const closeBtn = mc.querySelector(".modal-close-button");
      if (closeBtn) closeBtn.click();
      else mc.remove();
    });
    if (this._spotlightHandler) {
      document.removeEventListener("pointermove", this._spotlightHandler);
      this._spotlightHandler = null;
    }
    // Leave the app exactly as it was: every body class, data attribute and CSS variable the plugin set goes away.
    Array.from(document.body.classList)
      .filter((c) => c.startsWith("artcraft-") || c.startsWith("sicraft-"))
      .forEach((c) => document.body.classList.remove(c));
    ["data-surface-mode", "data-page-width", "data-spine-material"].forEach((a) => document.body.removeAttribute(a));
    ["--artcraft-line-width", "--artcraft-grain-opacity", "--artcraft-header-tag", "--artcraft-header-tag-display"].forEach((v) =>
      document.documentElement.style.removeProperty(v)
    );
    this.stopAmbientSound();
    this.stopDesktopAudioCapture();
    // the shared context for key clicks, chimes and seals
    if (this.keyAudioCtx) {
      try {
        this.keyAudioCtx.close();
      } catch (e) {}
      this.keyAudioCtx = null;
    }
    if (this.activeSonicModal) {
      try {
        this.activeSonicModal.close();
      } catch (e) {}
    }
    if (this.pacerAnimFrame) cancelAnimationFrame(this.pacerAnimFrame);
    if (this.pacerBarEl) this.pacerBarEl.remove();
    document.querySelectorAll(".artcraft-wax-seal-veil").forEach((el) => el.remove());
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
    if (this.focusPopoverCloseHandler) {
      document.removeEventListener("pointerdown", this.focusPopoverCloseHandler);
      this.focusPopoverCloseHandler = null;
    }
    document
      .querySelectorAll(
        ".artcraft-task-progress-wrap, .artcraft-exlibris-corner-seal, .artcraft-quiet-meta-line, .artcraft-nutrient-margin-dock, .artcraft-focus-popover, .artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas, .artcraft-wind-chain-footer, .artcraft-paper-grain-layer, .artcraft-sidebar-icon-slot"
      )
      .forEach((el) => el.remove());
    document.querySelectorAll(".artcraft-graph-canvas-wrap").forEach((el) => el.classList.remove("artcraft-graph-canvas-wrap"));
    document.querySelectorAll(".artcraft-narrow-pane").forEach((el) => el.classList.remove("artcraft-narrow-pane"));
    // Key sentence marks are plain wrappers around text: put the text back as it was.
    document.querySelectorAll(".artcraft-key-mark").forEach((el) => el.replaceWith(...el.childNodes));
    document.querySelectorAll("[data-artcraft-key-done]").forEach((el) => el.removeAttribute("data-artcraft-key-done"));
    // Rendered notes still carry the wrappers this plugin added (sentences, number badges, step badges).
    // Render them again once Obsidian has unregistered the post-processors, which happens right after onunload.
    const workspace = this.app.workspace;
    setTimeout(() => {
      workspace.getLeavesOfType("markdown").forEach((leaf) => {
        const view = leaf.view;
        if (view && view.previewMode && typeof view.previewMode.rerender === "function") view.previewMode.rerender(true);
      });
    }, 0);
  }

  async rekeyNoteRecords(oldPath, newPath) {
    let changed = false;
    const prefix = oldPath + "/";
    ["waxSealNotes", "stampedNotes", "marginBookmarks"].forEach((key) => {
      const map = this.settings[key];
      if (!map || typeof map !== "object" || Array.isArray(map)) return;
      Object.keys(map).forEach((k) => {
        let target;
        if (k === oldPath) target = newPath;
        else if (k.startsWith(prefix)) target = newPath === null ? null : newPath + "/" + k.slice(prefix.length); // a folder was moved
        else return;
        const value = map[k];
        delete map[k];
        if (target !== null) map[target] = value;
        changed = true;
      });
    });
    if (changed) {
      await this.saveSettings();
      if (!this._unloaded) this.updateTaskProgressBar();
    }
    if (!this._unloaded && typeof this.decorateSidebarFileExplorer === "function") {
      setTimeout(() => !this._unloaded && this.decorateSidebarFileExplorer(), 60);
    }
  }

  // Panes narrower than a phone screen in landscape get their own page layout (see .artcraft-narrow-pane
  // in styles.css): side margins shrink and headings stop breaking in the middle of words.
  markNarrowPanes() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      const el = leaf.view && leaf.view.containerEl;
      if (!el) return;
      const width = el.clientWidth;
      if (width > 0) el.classList.toggle("artcraft-narrow-pane", width < 520);
    });
  }

  // Marks an element with .is-in-view while it is on screen. CSS uses the class to run decorative
  // animations only where someone can see them; off-screen they stay paused and cost nothing.
  observeInView(el) {
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (!this.inViewObserver) {
      this.inViewObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
      });
    }
    this.inViewObserver.observe(el);
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
      const baseGain = 0.115;
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.001;
      // Smooth 1.2s fade-in so soundscapes never click or startle
      masterGain.gain.exponentialRampToValueAtTime(Math.max(0.005, baseGain * volScale), ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      analyser.connect(silentGain);
      silentGain.connect(ctx.destination);

      const extraOscs = [];
      const extraTimers = [];

      // Create an 8-second true stereo (2-channel decorrelated) acoustic buffer
      const durationSec = 8;
      const bufferSize = durationSec * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

      // drops and pops are timed in seconds, so they sound the same at 44.1 and 48 kHz
      const seamGuard = Math.round(ctx.sampleRate * 0.05); // nothing starts in the last 50 ms, so the loop point stays silent
      const dropChance = 85 / ctx.sampleRate;
      const dropFallFast = Math.exp(-1 / (ctx.sampleRate * 0.0025));
      const dropFallSpread = Math.exp(-1 / (ctx.sampleRate * 0.009)) - dropFallFast;
      const popChance = 3 / ctx.sampleRate;
      const popFall = Math.exp(-1 / (ctx.sampleRate * 0.0012));

      for (let ch = 0; ch < 2; ch++) {
        const output = noiseBuffer.getChannelData(ch);
        let lastOut = 0.0;
        let dropEnv = 0;
        let dropFall = dropFallFast;
        let popEnv = 0;
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        const chPhase = ch * 0.85;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const tSec = i / ctx.sampleRate;
          // Seamless loop crossfade envelope at loop boundaries
          const loopAngle = (tSec / durationSec) * Math.PI * 2;

          // Paul Kellet's studio-grade 7-pole Pink Noise filter (-3dB/octave)
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.042;
          b6 = white * 0.115926;

          // Deep Brownian integration (-6dB/octave)
          lastOut = (lastOut + 0.022 * white) / 1.022;
          const brown = lastOut * 2.8;

          if (type === "brown") {
            // Deep Brown Shield: warm sub-bass cocoon with subtle slow breathing
            const breath = 0.88 + 0.18 * Math.sin(loopAngle + chPhase);
            output[i] = (brown * 0.82 + pink * 0.25) * breath;
          } else if (type === "ocean") {
            // 0.125Hz Coherent Breathing Ocean Surf (8-second wave cycle: inhale swell + exhale foam)
            const wave = Math.pow(0.5 + 0.5 * Math.sin(loopAngle - Math.PI / 2 + chPhase * 0.35), 1.75);
            const foam = Math.pow(0.5 + 0.5 * Math.sin(loopAngle * 2 + chPhase), 2.2) * 0.35;
            output[i] = brown * (0.45 + 1.35 * wave) + pink * (0.2 + 0.85 * foam);
          } else if (type === "train") {
            // Night Sleeper Train in Rain: warm cabin rumble + soft rhythmic rail joints ("tu-duk... tu-duk")
            const cycle = (tSec * 1.25) % 1;
            const joint1 = Math.exp(-Math.pow((cycle - 0.08) * 38, 2));
            const joint2 = Math.exp(-Math.pow((cycle - 0.21) * 38, 2));
            const railAccent = 0.72 + 0.85 * (joint1 + joint2 * 0.82);
            output[i] = brown * 0.78 * railAccent + pink * 0.32;
          } else if (type === "fire") {
            // Cozy Hearth & Embers: warm hearth draft + soft organic wood crackles (filtered, never harsh clicks)
            const draft = 0.82 + 0.24 * Math.sin(loopAngle * 2 + chPhase);
            const ember = Math.random() > 0.9991 ? (Math.random() * 0.65 - 0.32) : 0;
            output[i] = brown * 0.75 * draft + pink * 0.28 + ember;
          } else if (type === "stream") {
            // Mountain Brook & Pines: liquid multi-sine ripple modulation
            const ripple =
              0.78 +
              0.28 * Math.sin(loopAngle * 7 + chPhase) * Math.cos(loopAngle * 11 - chPhase) +
              0.16 * Math.sin(loopAngle * 19 + ch);
            output[i] = pink * 0.95 * ripple + brown * 0.22;
          } else if (type === "cafe") {
            // Warm Roastery Ambience: gentle room murmur envelope
            const murmur = 0.82 + 0.22 * Math.sin(loopAngle * 3 + chPhase) * Math.sin(loopAngle * 5);
            output[i] = (pink * 0.75 + brown * 0.42) * murmur;
          } else if (type === "rain") {
            // Rain: an even hiss of fine drops with separate heavier drops on top.
            // A drop is a burst of noise that dies away in a few milliseconds.
            if (i < bufferSize - seamGuard && Math.random() < dropChance) {
              dropEnv = 0.3 + Math.random() * 0.7;
              dropFall = dropFallFast + Math.random() * dropFallSpread;
            }
            dropEnv *= dropFall;
            output[i] = pink * 1.5 + white * 0.07 + white * dropEnv * 0.5;
          } else if (type === "nordic_wind") {
            // Wind: the level rises and falls in gusts. The pitch of a gust is moved by the filter below.
            const gust = 0.62 + 0.26 * Math.sin(loopAngle + chPhase) + 0.12 * Math.sin(loopAngle * 3 + 1.7 + chPhase * 0.5);
            output[i] = (pink * 3.0 + brown * 1.4) * gust;
          } else if (type === "vinyl_library") {
            // Record player: a warm bed, surface hiss, sparse pops and one soft tick per turn of the record.
            if (i < bufferSize - seamGuard && Math.random() < popChance) {
              popEnv = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.75);
            }
            popEnv *= popFall;
            const turn = (tSec / 1.6) % 1;
            const tick = Math.exp(-Math.pow((turn - 0.5) * 240, 2));
            output[i] = brown * 0.42 + pink * 0.24 + white * 0.012 + popEnv * 1.1 + white * tick * 0.5;
          } else if (type === "balanced") {
            // Soft pink noise: pink noise alone, with no low rumble under it and no swell.
            output[i] = pink * 1.05;
          } else {
            // bed under the tone-based sounds (40 Hz, alpha, theta, bowls, 432 and 528 Hz)
            const gentle = 0.9 + 0.14 * Math.sin(loopAngle + chPhase);
            output[i] = (pink * 0.82 + brown * 0.32) * gentle;
          }
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      if (type === "brown") {
        filter.frequency.value = 340;
      } else if (type === "ocean") {
        filter.frequency.value = 580;
        // Slow LFO sweeping the filter cutoff as waves crest and recede
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.125;
        lfoGain.gain.value = 260;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        extraOscs.push(lfo);
      } else if (type === "train") {
        filter.frequency.value = 420;
      } else if (type === "fire") {
        filter.frequency.value = 720;
      } else if (type === "cafe") {
        filter.type = "bandpass";
        filter.frequency.value = 490;
        filter.Q.value = 0.65;
      } else if (type === "stream") {
        filter.frequency.value = 1150;
      } else if (type === "rain") {
        // rain is a bright sound: a wide band around 2.4 kHz instead of the dull low-pass of the other beds
        filter.type = "bandpass";
        filter.frequency.value = 2400;
        filter.Q.value = 0.4;
      } else if (type === "nordic_wind") {
        // the howl: a band whose centre drifts with two slow oscillators that never line up the same way twice
        filter.type = "bandpass";
        filter.frequency.value = 520;
        filter.Q.value = 1.3;
        [[0.11, 210], [0.043, 130]].forEach(([rate, depth]) => {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = rate;
          lfoGain.gain.value = depth;
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
          extraOscs.push(lfo);
        });
      } else if (type === "vinyl_library") {
        filter.frequency.value = 3400;
      } else if (type === "balanced") {
        filter.frequency.value = 5200;
      } else {
        // Velvet Pink Rain & neuro-acoustic beds
        filter.frequency.value = 840;
      }

      // Layer neuro-acoustic binaural & harmonic pads on top of the velvet acoustic bed
      const noiseBedGain = ctx.createGain();
      const isNeuro = type === "gamma40" || type === "bright" || type === "night" || type === "rain_roof" || type === "crystal_432" || type === "solfeggio_528";
      noiseBedGain.gain.value = isNeuro ? 0.48 : 1.0;

      noiseSource.connect(filter);
      filter.connect(noiseBedGain);
      noiseBedGain.connect(masterGain);
      noiseBedGain.connect(analyser);
      noiseSource.start(0);

      const addStereoBinauralPair = (fLeft, fRight, fHarmonic, padGainVal) => {
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const oscH = ctx.createOscillator();
        const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const gL = ctx.createGain();
        const gR = ctx.createGain();
        const gH = ctx.createGain();

        oscL.type = "sine";
        oscR.type = "sine";
        oscH.type = "sine";
        oscL.frequency.value = fLeft;
        oscR.frequency.value = fRight;
        oscH.frequency.value = fHarmonic;

        gL.gain.value = padGainVal;
        gR.gain.value = padGainVal;
        gH.gain.value = padGainVal * 0.35;

        if (panL && panR) {
          panL.pan.value = -0.65;
          panR.pan.value = 0.65;
          oscL.connect(panL);
          panL.connect(gL);
          oscR.connect(panR);
          panR.connect(gR);
        } else {
          oscL.connect(gL);
          oscR.connect(gR);
        }
        oscH.connect(gH);

        gL.connect(masterGain);
        gR.connect(masterGain);
        gH.connect(masterGain);
        gL.connect(analyser);
        gR.connect(analyser);

        oscL.start();
        oscR.start();
        oscH.start();
        extraOscs.push(oscL, oscR, oscH);
      };

      if (type === "gamma40") {
        // 40Hz Gamma Focus (200Hz L + 240Hz R + 300Hz warm fifth) inside Velvet Pink Rain
        addStereoBinauralPair(200, 240, 300, 0.24);
      } else if (type === "bright") {
        // 10Hz Alpha Calm Flow (210Hz L + 220Hz R + 315Hz warm fifth)
        addStereoBinauralPair(210, 220, 315, 0.26);
      } else if (type === "night") {
        // 6Hz Theta Deep Meditation (174Hz L + 180Hz R + 261Hz warm drone)
        addStereoBinauralPair(174, 180, 261, 0.28);
      } else if (type === "crystal_432") {
        addStereoBinauralPair(216, 220, 432, 0.23);
      } else if (type === "solfeggio_528") {
        addStereoBinauralPair(264, 268, 528, 0.22);
      } else if (type === "rain_roof") {
        // Tibetan Singing Bowls & Warm Air (216Hz + 432Hz + periodic gentle harmonic bowl chimes)
        addStereoBinauralPair(216, 218.5, 432, 0.22);
        const strikeBowl = () => {
          if (!this.ambientNodes || this.ambientNodes.ctx !== ctx) return;
          try {
            const nowT = ctx.currentTime;
            const freqs = [288, 432, 576, 864];
            const baseF = freqs[Math.floor(Math.random() * freqs.length)];
            [1, 2.756].forEach((ratio, idx) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.type = "sine";
              o.frequency.setValueAtTime(baseF * ratio, nowT);
              g.gain.setValueAtTime(0.0001, nowT);
              g.gain.linearRampToValueAtTime(idx === 0 ? 0.16 : 0.045, nowT + 0.08);
              g.gain.exponentialRampToValueAtTime(0.0001, nowT + 5.5);
              o.connect(g);
              g.connect(masterGain);
              g.connect(analyser);
              o.start(nowT);
              o.stop(nowT + 5.6);
            });
          } catch (e) {}
        };
        strikeBowl();
        const bowlInterval = setInterval(strikeBowl, 7500);
        extraTimers.push(bowlInterval);
      }

      this.ambientNodes = { ctx, source: noiseSource, extraOscs, extraTimers, analyser, masterGain, baseGain };
      this.updateEqualizerPillUI();
    } catch (e) {}
  }

  stopAmbientSound() {
    if (!this.ambientNodes) return;
    try {
      if (this.ambientNodes.extraTimers) {
        this.ambientNodes.extraTimers.forEach((tm) => clearInterval(tm));
      }
      if (this.ambientNodes.extraOscs) {
        this.ambientNodes.extraOscs.forEach((o) => {
          try { o.stop(); } catch (e) {}
        });
      }
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

    const today = localDayKey();
    if (fa.lastSprintDate !== today) {
      const yesterday = localDayKey(new Date(Date.now() - 86400000));
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
    // Start the linked soundscape only when nothing is playing. A soundscape or a track the user
    // started by hand is left alone, and only the timer's own sound is stopped on pause.
    if (this.timerState === "work" && this.settings.ambientSound && this.settings.ambientSound !== "off" && !this.ambientNodes) {
      this.startAmbientSound(this.settings.ambientSound);
      this.timerStartedAmbient = true;
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
    if (this.timerStartedAmbient) {
      this.timerStartedAmbient = false;
      this.stopAmbientSound();
    }
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
        .setTitle(isRu ? `${this.settings.breakMinutes || 5} мин — короткий перерыв` : `${this.settings.breakMinutes || 5} min — short break`)
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
        .setTitle(isRu ? `Стиль эквалайзера (${(this.settings.eqMode || "craft").toUpperCase()})` : `Switch Equalizer Style (${(this.settings.eqMode || "craft").toUpperCase()})`)
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
    const timerRect = this.timerEl ? this.timerEl.getBoundingClientRect() : null;
    const safeX = timerRect ? Math.max(16, Math.min(timerRect.left, window.innerWidth - 260)) : Math.min(event.clientX, window.innerWidth - 250);
    const safeY = timerRect ? Math.max(20, timerRect.top - 8) : Math.max(40, event.clientY - 10);
    menu.showAtPosition({ x: safeX, y: safeY });
  }

  updateTimerDisplay() {
    if (!this.timerEl || !this.timerTextEl) return;
    this.timerEl.classList.toggle("is-running", this.timerRunning);
    this.timerEl.classList.toggle("is-break", this.timerState === "break");
    this.timerTextEl.innerHTML = `${sicraftIcon('timer')}<span>${this.formatTime(this.timerSeconds)}</span>`;
  }

  isDarkPage() {
    return !!(
      this.settings.artcraftTheme &&
      this.settings.isPro &&
      this.settings.darkCraftTheme &&
      document.body.classList.contains("theme-dark")
    );
  }

  noticeDarkPageState() {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    if (!this.settings.darkCraftTheme) {
      new Notice(isRu ? "Тёмная страница: выключена" : "Dark page: off");
    } else if (!document.body.classList.contains("theme-dark")) {
      new Notice(
        isRu
          ? "Тёмная страница включится вместе с тёмной схемой Obsidian: Настройки → Оформление → Базовая цветовая схема."
          : "The dark page turns on together with Obsidian's dark colour scheme: Settings → Appearance → Base color scheme.",
        9000
      );
    } else {
      new Notice(isRu ? "Тёмная страница: включена" : "Dark page: on");
    }
  }

  applyBodyClasses() {
    document.body.classList.toggle("artcraft-theme-active", this.settings.artcraftTheme);
    document.body.classList.toggle("artcraft-hover-cards", this.settings.hoverCards);
    document.body.classList.toggle("artcraft-sentence-focus", this.settings.sentenceFocus);
    document.body.classList.toggle("artcraft-zen-mode", !!this.zenMode);
    document.body.classList.toggle("artcraft-dark-craft", this.isDarkPage());
    document.body.classList.toggle("artcraft-bento-graph", this.settings.enableBentoGraph !== false);
    document.body.classList.toggle("artcraft-spotlight-mode", !!this.settings.spotlightFocus);
    document.body.classList.toggle("artcraft-magic-lamp", !!this.settings.magicLamp);
    document.body.classList.toggle("artcraft-book-spread", !!this.settings.bookSpreadMode);
    document.body.classList.toggle("artcraft-breathing-spine", !!this.settings.breathingSpine);
    document.body.classList.remove("artcraft-margin-sandglass");
    document.body.classList.toggle("artcraft-chrono-ink", this.settings.chronoInkAging !== false);
    document.body.classList.toggle("artcraft-nightlight-comp", !!this.settings.nightLightCompensation);
    document.body.classList.toggle("artcraft-editorial-clean", this.settings.editorialCleanMode !== false);
    const surf = this.settings.surfaceMode || "white";
    document.body.setAttribute("data-surface-mode", surf);
    document.body.classList.toggle("artcraft-surface-white", surf === "white");
    document.body.classList.toggle("artcraft-surface-book", surf === "book");
    document.body.classList.toggle("artcraft-surface-grain", surf === "grain");
    const widthMode = this.settings.pageWidthMode || "book";
    document.body.setAttribute("data-page-width", widthMode);
    document.body.classList.toggle("artcraft-width-book", widthMode === "book");
    document.body.classList.toggle("artcraft-width-wide", widthMode === "wide");
    document.body.classList.toggle("artcraft-width-full", widthMode === "full");
    const lineWidthCss = widthMode === "wide" ? "1080px" : widthMode === "full" ? "94%" : "760px";
    document.documentElement.style.setProperty("--artcraft-line-width", lineWidthCss);
    document.body.classList.toggle("artcraft-bionic-active", !!this.settings.bionicAnchors);
    document.body.classList.toggle("artcraft-key-marker", this.settings.keySentenceMarker !== false);
    const markerCol = this.settings.keyMarkerColor || "lime";
    ["lime", "amber", "rose", "sky", "lavender"].forEach((c) => {
      document.body.classList.toggle("artcraft-marker-" + c, markerCol === c);
    });
    document.body.classList.toggle("artcraft-plain-page", this.settings.pageCards !== true);
    this.applyPaperTexture();
    const grainPct = Math.max(0, Math.min(100, Number(this.settings.paperGrain !== undefined ? this.settings.paperGrain : 28)));
    document.documentElement.style.setProperty("--artcraft-grain-opacity", (grainPct / 100 * 0.14).toFixed(3));
    document.body.setAttribute("data-spine-material", this.settings.spineMaterial || "cognac");

    // settings may come from a hand-edited or synced data.json: never assume a string
    const rawTag = this.settings.headerTagText;
    const tag = String(rawTag === undefined || rawTag === null ? "" : rawTag).replace(/[\r\n]+/g, " ").trim();
    const show = this.settings.showHeaderTag !== false && tag.length > 0;
    if (show) {
      document.documentElement.style.setProperty("--artcraft-header-tag", `"${tag.replace(/[\\"]/g, "\\$&")}"`);
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "block");
    } else {
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "none");
    }
  }

  async editNote(file, change) {
    if (!file) return false;
    const obsidian = require("obsidian");
    let view = null;
    const active = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (active && active.file === file) view = active;
    if (!view) {
      this.app.workspace.iterateAllLeaves((leaf) => {
        if (!view && leaf.view instanceof obsidian.MarkdownView && leaf.view.file === file) view = leaf.view;
      });
    }
    if (view && view.editor && typeof view.getMode === "function" && view.getMode() === "source") {
      const cur = view.editor.getValue();
      const next = change(cur);
      if (next === null || next === undefined || next === cur) return false;
      const max = Math.min(cur.length, next.length);
      let head = 0;
      while (head < max && cur.charCodeAt(head) === next.charCodeAt(head)) head++;
      let tail = 0;
      while (tail < max - head && cur.charCodeAt(cur.length - 1 - tail) === next.charCodeAt(next.length - 1 - tail)) tail++;
      view.editor.replaceRange(
        next.slice(head, next.length - tail),
        view.editor.offsetToPos(head),
        view.editor.offsetToPos(cur.length - tail)
      );
      return true;
    }
    // reading view: flush whatever the editor still holds, then change the file itself
    if (view && typeof view.save === "function") {
      try {
        await view.save();
      } catch (e) {}
    }
    let changed = false;
    await this.app.vault.process(file, (cur) => {
      const next = change(cur);
      if (next === null || next === undefined || next === cur) return cur;
      changed = true;
      return next;
    });
    return changed;
  }

  // =========================================================================
  // OBSIDIAN EXTENDED GRAPH STUDIO ENGINE (v5.7.0)
  // Direct PixiJS/WebGL renderer.nodes manipulation, BFS Color Propagation,
  // Hub & Recency Heatmaps, Nutrient Highlighting, Focus Isolation & Live HUD
  // =========================================================================
  injectGraphViewHUD() {
    if (this.settings.enableBentoGraph === false) {
      document.querySelectorAll(".artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas").forEach((el) => el.remove());
      return;
    }

    document.querySelectorAll(".artcraft-graph-legend-pill, .artcraft-graph-hint-pill").forEach((el) => el.remove());

    const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
    leaves.forEach((leaf) => {
      const view = leaf.view;
      if (!view || !view.containerEl) return;
      const viewContent = view.containerEl.querySelector(".view-content");
      if (!viewContent) return;

      viewContent.classList.add("artcraft-graph-canvas-wrap");
      const curPreset = this.settings.graphPreset || "bento";
      const curColorMode = this.settings.graphColorMode || "folders";
      const curFilter = this.settings.graphFilterMode || "all";
      viewContent.setAttribute("data-graph-preset", curPreset);

      const lang = this.settings.uiLanguage || "en";
      const isRu = lang === "ru";

      if (!viewContent.dataset.artcraftMouseWired) {
        viewContent.dataset.artcraftMouseWired = "true";
        viewContent.addEventListener("mousemove", (ev) => {
          const r = viewContent.getBoundingClientRect();
          this.graphMouseX = ((ev.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
          this.graphMouseY = ((ev.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
          this.graphCursorPt = { x: ev.clientX - r.left, y: ev.clientY - r.top };
        }, { passive: true });
      }

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
          <button class="artcraft-graph-hud-btn artcraft-graph-hud-toggle-btn" data-action="toggle-hud" title="${isRu ? "Свернуть / Развернуть студию графа" : "Minimize / Expand Graph Studio"}">${SICRAFT_SVGS.graph}</button>
          <div class="artcraft-graph-hud-items">
            <button class="artcraft-graph-hud-btn ${curPreset === "bento" ? "is-active" : ""}" data-preset="bento" title="${isRu ? "Сетка Swiss Craft" : "Swiss Craft Grid"}"><span>Bento</span></button>
            <button class="artcraft-graph-hud-btn ${curPreset === "mindpalace" ? "is-active" : ""}" data-preset="mindpalace" title="${isRu ? "3D Чертоги разума с изометрическими ореолами" : "3D Mind-Palace with depth halos"}"><span>3D Palace</span></button>
            <button class="artcraft-graph-hud-btn ${curPreset === "constellation" ? "is-active" : ""}" data-preset="constellation" title="${isRu ? "Алхимическое созвездие: линии между главными хабами" : "Alchemical Constellation: hub bridges"}"><span>${isRu ? "Созвездие" : "Star Map"}</span></button>
            <button class="artcraft-graph-hud-btn ${curPreset === "radar" ? "is-active" : ""}" data-preset="radar" title="${isRu ? "Фокус-Радар с лучом сканирования" : "Focus Radar sweep"}"><span>${isRu ? "Радар" : "Radar"}</span></button>
            <span class="artcraft-graph-hud-sep"></span>
            <select class="artcraft-graph-hud-select" data-role="color-mode" title="${isRu ? "Режим раскраски узлов (Extended Graph)" : "Node Color Mode"}">
              <option value="folders" ${curColorMode === "folders" ? "selected" : ""}>${isRu ? "🎨 Папки + Поток цвета" : "🎨 Folders + BFS Spread"}</option>
              <option value="heatmap" ${curColorMode === "heatmap" ? "selected" : ""}>${isRu ? "🔥 Тепловая карта хабов" : "🔥 Hub Heatmap"}</option>
              <option value="recency" ${curColorMode === "recency" ? "selected" : ""}>${isRu ? "⚡ Свежесть заметок" : "⚡ Recency Heatmap"}</option>
              <option value="nutrients" ${curColorMode === "nutrients" ? "selected" : ""}>${isRu ? "📚 Книги и Нутриенты" : "📚 Books & Nutrients"}</option>
            </select>
            <select class="artcraft-graph-hud-select" data-role="filter-mode" title="${isRu ? "Фокус-фильтр узлов графа" : "Graph Focus Filter"}">
              <option value="all" ${curFilter === "all" ? "selected" : ""}>${isRu ? "👁 Все узлы" : "👁 All Nodes"}</option>
              <option value="hubs" ${curFilter === "hubs" ? "selected" : ""}>${isRu ? "★ Только Хабы (Топ 25%)" : "★ Hubs Only (Top 25%)"}</option>
              <option value="stamped" ${curFilter === "stamped" ? "selected" : ""}>${isRu ? "🔖 Со штампами и закладками" : "🔖 Stamped & Annotated"}</option>
              <option value="no_orphans" ${curFilter === "no_orphans" ? "selected" : ""}>${isRu ? "🔗 Скрыть одиночки" : "🔗 Hide Orphans"}</option>
            </select>
            <span class="artcraft-graph-hud-sep"></span>
            <button class="artcraft-graph-hud-btn artcraft-graph-pulse-btn ${this.settings.graphPulseNodes ? "is-pulse-on" : ""}" data-action="pulse" title="${isRu ? "Поток импульсов по связям" : "Photon pulses along links"}">${sicraftIcon('bolt')} <span>${isRu ? "Поток" : "Flow"}</span></button>
            <button class="artcraft-graph-hud-btn artcraft-graph-resonance-btn" data-action="resonance" title="${isRu ? "Гармонический резонанс ключевых узлов" : "Harmonic hub resonance"}">${sicraftIcon('spark')} <span>${isRu ? "Резонанс" : "Resonance"}</span></button>
            <button class="artcraft-graph-hud-btn artcraft-graph-walk-btn" data-action="walk" title="${isRu ? "Авто-тур по созвездию заметок" : "Constellation auto-tour"}"><span>${isRu ? "Тур" : "Tour"}</span></button>
            <button class="artcraft-graph-hud-btn" data-action="snap-png" title="${isRu ? "Сохранить снимок графа в PNG" : "Export Graph as PNG"}">${sicraftIcon('camera')}</button>
          </div>
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
            this._graphColorsDirty = true;
            this.applyGraphPhysicsPreset(view, preset);
            this.applyLiveGraphNodeStyling(view, true);
          });
        });

        const colorSel = hud.querySelector('[data-role="color-mode"]');
        if (colorSel) {
          colorSel.addEventListener("change", async (e) => {
            e.stopPropagation();
            this.settings.graphColorMode = colorSel.value;
            await this.saveSettings();
            this._graphColorsDirty = true;
            this.applyLiveGraphNodeStyling(view, true);
            if (colorSel.value === "folders") {
              this.applyBentoGraphColorGroups(false, true);
            }
          });
        }

        const filterSel = hud.querySelector('[data-role="filter-mode"]');
        if (filterSel) {
          filterSel.addEventListener("change", async (e) => {
            e.stopPropagation();
            this.settings.graphFilterMode = filterSel.value;
            await this.saveSettings();
            this._graphColorsDirty = true;
            this.applyLiveGraphNodeStyling(view, true);
          });
        }

        hud.querySelector('[data-action="pulse"]')?.addEventListener("click", async (e) => {
          e.stopPropagation();
          this.settings.graphPulseNodes = !this.settings.graphPulseNodes;
          await this.saveSettings();
          hud.querySelector('[data-action="pulse"]')?.classList.toggle("is-pulse-on", this.settings.graphPulseNodes);
        });

        hud.querySelector('[data-action="resonance"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.triggerMemoryResonance(viewContent, view.renderer);
        });

        hud.querySelector('[data-action="walk"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleConstellationWalk(viewContent, view.renderer);
        });

        hud.querySelector('[data-action="snap-png"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.snapBentoGraphPNG(viewContent);
        });

        hud.querySelector('[data-action="toggle-hud"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          hud.classList.toggle("is-minimized");
        });

        viewContent.appendChild(hud);
      }

      let fxCanvas = viewContent.querySelector(".artcraft-graph-fx-canvas");
      if (!fxCanvas) {
        fxCanvas = document.createElement("canvas");
        fxCanvas.className = "artcraft-graph-fx-canvas";
        viewContent.appendChild(fxCanvas);
      }

      // Apply live node coloring & physics immediately when graph opens
      this._graphColorsDirty = true;
      this.applyGraphPhysicsPreset(view, curPreset);
      this.applyLiveGraphNodeStyling(view, true);
      this.wakeVisualLoop();
    });
  }

  // Tunes Obsidian's native D3 force engine (view.dataEngine) per preset
  applyGraphPhysicsPreset(view, preset) {
    if (!view || !view.dataEngine || typeof view.dataEngine.setOptions !== "function") return;
    try {
      const presetForces = {
        bento: { centerStrength: 0.48, repelStrength: 11.5, linkStrength: 0.85, linkDistance: 65 },
        mindpalace: { centerStrength: 0.35, repelStrength: 15.0, linkStrength: 0.72, linkDistance: 95 },
        constellation: { centerStrength: 0.28, repelStrength: 16.5, linkStrength: 0.95, linkDistance: 80 },
        radar: { centerStrength: 0.62, repelStrength: 10.5, linkStrength: 0.90, linkDistance: 55 },
      };
      const f = presetForces[preset] || presetForces.bento;
      const hideOrphans = this.settings.graphFilterMode === "no_orphans";
      view.dataEngine.setOptions({
        centerStrength: f.centerStrength,
        repelStrength: f.repelStrength,
        linkStrength: f.linkStrength,
        linkDistance: f.linkDistance,
        showOrphans: !hideOrphans,
      });
      if (view.renderer && typeof view.renderer.changed === "function") {
        view.renderer.changed();
      }
    } catch (e) {}
  }

  // Directly colors and filters view.renderer.nodes in memory (Extended Graph / Graph Heatmap / BFS Propagation architecture)
  applyLiveGraphNodeStyling(view, force = false) {
    if (!view || !view.renderer || !Array.isArray(view.renderer.nodes) || view.renderer.nodes.length === 0) return;
    const renderer = view.renderer;
    const nodes = renderer.nodes;
    const now = Date.now();
    if (!force && !this._graphColorsDirty && now - (renderer._artcraftLastColorTs || 0) < 1800 && renderer._artcraftNodeCount === nodes.length) {
      return;
    }
    this._graphColorsDirty = false;
    renderer._artcraftLastColorTs = now;
    renderer._artcraftNodeCount = nodes.length;

    const colorMode = this.settings.graphColorMode || "folders";
    const filterMode = this.settings.graphFilterMode || "all";
    const paletteRgb = [
      0x69BD28, // Alchemical Emerald
      0xD97706, // Warm Amber Gold
      0x0EA5E9, // Astral Sky
      0x10B981, // Jade Mint
      0xF43F5E, // Rose Elixir
      0x8B5CF6, // Royal Amethyst
      0xEAB308, // Sun Gold
      0x14B8A6, // Teal Patina
    ];

    // 1. Compute degree (link count) for every node & build adjacency list for BFS color propagation
    const degreeMap = {};
    const adj = {};
    nodes.forEach((n) => {
      if (!n || !n.id) return;
      const fwd = n.forward ? Object.keys(n.forward).length : 0;
      const rev = n.reverse ? Object.keys(n.reverse).length : 0;
      degreeMap[n.id] = fwd + rev;
      adj[n.id] = [];
    });
    if (Array.isArray(renderer.links)) {
      renderer.links.forEach((l) => {
        const sid = l && l.source && (l.source.id || l.source);
        const tid = l && l.target && (l.target.id || l.target);
        if (sid && tid) {
          if (degreeMap[sid] === undefined) degreeMap[sid] = 0;
          if (degreeMap[tid] === undefined) degreeMap[tid] = 0;
          if (!adj[sid]) adj[sid] = [];
          if (!adj[tid]) adj[tid] = [];
          adj[sid].push(tid);
          adj[tid].push(sid);
        }
      });
    }

    const degreesSorted = Object.values(degreeMap).slice().sort((a, b) => b - a);
    const maxDeg = Math.max(1, degreesSorted[0] || 1);
    const hubThreshold = degreesSorted[Math.min(degreesSorted.length - 1, Math.max(0, Math.floor(degreesSorted.length * 0.25)))] || 1;

    // Store top 8 hubs for Constellation bridges & sacred geometry rings
    this._graphTopHubs = nodes
      .slice()
      .sort((a, b) => (degreeMap[b.id] || 0) - (degreeMap[a.id] || 0))
      .slice(0, 8);

    // 2. Folder mapping + BFS Color Propagation for ungrouped root notes
    const folderMap = {};
    let folderCounter = 0;
    const nodeFolderRgb = {};
    nodes.forEach((n) => {
      if (!n || !n.id) return;
      const idStr = String(n.id);
      if (idStr.includes("/")) {
        const topFolder = idStr.split("/")[0];
        if (folderMap[topFolder] === undefined) {
          folderMap[topFolder] = paletteRgb[folderCounter % paletteRgb.length];
          folderCounter++;
        }
        nodeFolderRgb[idStr] = folderMap[topFolder];
      }
    });

    // Propagate folder colors up to 2 hops to ungrouped root notes (Graph Color Propagation logic)
    if (colorMode === "folders") {
      nodes.forEach((n) => {
        if (!n || !n.id || nodeFolderRgb[n.id] !== undefined) return;
        const neighbors = adj[n.id] || [];
        let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
        neighbors.forEach((nbId) => {
          const c = nodeFolderRgb[nbId];
          if (c !== undefined) {
            rSum += (c >> 16) & 255;
            gSum += (c >> 8) & 255;
            bSum += c & 255;
            weightSum += 1;
          } else {
            (adj[nbId] || []).forEach((nb2Id) => {
              const c2 = nodeFolderRgb[nb2Id];
              if (c2 !== undefined) {
                rSum += ((c2 >> 16) & 255) * 0.45;
                gSum += ((c2 >> 8) & 255) * 0.45;
                bSum += (c2 & 255) * 0.45;
                weightSum += 0.45;
              }
            });
          }
        });
        if (weightSum > 0) {
          const r = Math.round(rSum / weightSum);
          const g = Math.round(gSum / weightSum);
          const b = Math.round(bSum / weightSum);
          nodeFolderRgb[n.id] = (r << 16) | (g << 8) | b;
        } else {
          nodeFolderRgb[n.id] = 0x69BD28;
        }
      });
    }

    // Helper to interpolate two RGB integers
    const lerpRgb = (c1, c2, t) => {
      const clamped = Math.max(0, Math.min(1, t));
      const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
      const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
      const r = Math.round(r1 + (r2 - r1) * clamped);
      const g = Math.round(g1 + (g2 - g1) * clamped);
      const b = Math.round(b1 + (b2 - b1) * clamped);
      return (r << 16) | (g << 8) | b;
    };

    const stamped = this.settings.stampedNotes || {};
    const bms = this.settings.marginBookmarks || {};

    // 3. Apply color, weight & filter alpha per node directly into PixiJS/WebGL renderer
    nodes.forEach((n, idx) => {
      if (!n || !n.id) return;
      const deg = degreeMap[n.id] || 0;
      const degNorm = Math.min(1, deg / maxDeg);
      let rgb = 0x69BD28;

      if (colorMode === "folders") {
        rgb = nodeFolderRgb[n.id] || paletteRgb[idx % paletteRgb.length];
      } else if (colorMode === "heatmap") {
        // 3-stop Alchemical Hub Heatmap: Emerald (0x10B981) -> Amber Gold (0xF59E0B) -> Philosopher Crimson (0xF43F5E)
        rgb = degNorm < 0.5
          ? lerpRgb(0x10B981, 0xF59E0B, degNorm * 2)
          : lerpRgb(0xF59E0B, 0xF43F5E, (degNorm - 0.5) * 2);
      } else if (colorMode === "recency") {
        const af = this.app.vault.getAbstractFileByPath(n.id);
        const mtime = af && af.stat ? af.stat.mtime : 0;
        const ageDays = mtime ? Math.max(0, (now - mtime) / 86400000) : 30;
        const fresh = Math.max(0, Math.min(1, 1 - ageDays / 21));
        rgb = fresh < 0.5
          ? lerpRgb(0x3B82F6, 0x10B981, fresh * 2)
          : lerpRgb(0x10B981, 0xF59E0B, (fresh - 0.5) * 2);
      } else if (colorMode === "nutrients") {
        const rec = this.getNoteStampRecord(n.id);
        const list = Array.isArray(bms[n.id]) ? bms[n.id] : [];
        if (rec && rec.count >= 2) rgb = 0xF59E0B; // Gold Classics
        else if (rec) rgb = 0x10B981; // Stamped Read
        else if (list.length > 0) {
          const firstType = list[0].type || "proteins";
          const typeRgb = { proteins: 0xDC2626, carbs: 0xEA580C, fats: 0xEAB308, vitamins: 0x16A34A, fiber: 0x2563EB };
          rgb = typeRgb[firstType] || 0xD97706;
        } else {
          rgb = 0x64748B;
        }
      }

      // Compute Focus Filter visibility alpha
      let alpha = 1.0;
      if (filterMode === "hubs") {
        alpha = deg >= hubThreshold && deg > 0 ? 1.0 : 0.14;
      } else if (filterMode === "stamped") {
        const hasStampOrBm = !!(this.getNoteStampRecord(n.id) || (Array.isArray(bms[n.id]) && bms[n.id].length > 0));
        alpha = hasStampOrBm ? 1.0 : 0.12;
      } else if (filterMode === "no_orphans") {
        alpha = deg > 0 ? 1.0 : 0.05;
      }

      n._artcraftRgb = rgb;
      n._artcraftHex = "#" + rgb.toString(16).padStart(6, "0");
      n._artcraftAlpha = alpha;
      n._artcraftDegree = deg;

      // Write directly into Obsidian's GraphNode properties
      n.color = { rgb, a: alpha };
      if (!n._artcraftOrigGetFillColor && typeof n.getFillColor === "function") {
        n._artcraftOrigGetFillColor = n.getFillColor.bind(n);
      }
      n.getFillColor = () => ({ rgb: n._artcraftRgb ?? rgb, a: n._artcraftAlpha ?? alpha });

      if (n.circle) {
        try {
          n.circle.tint = rgb;
          n.circle.alpha = alpha;
        } catch (e) {}
      }
      if (n.text) {
        try {
          n.text.alpha = alpha < 0.25 ? 0.08 : 0.92;
        } catch (e) {}
      }
    });

    if (Array.isArray(renderer.links)) {
      renderer.links.forEach((lnk) => {
        if (!lnk || !lnk.line) return;
        const sAlpha = lnk.source && lnk.source._artcraftAlpha !== undefined ? lnk.source._artcraftAlpha : 1;
        const tAlpha = lnk.target && lnk.target._artcraftAlpha !== undefined ? lnk.target._artcraftAlpha : 1;
        try {
          lnk.line.alpha = Math.min(sAlpha, tAlpha) < 0.25 ? 0.05 : 0.55;
        } catch (e) {}
      });
    }

    if (typeof renderer.changed === "function") {
      try {
        renderer.changed();
      } catch (e) {}
    }
  }

  // Accurate Screen Coordinate Projector for Obsidian 1.0–1.16+ Graph Renderer
  projectGraphNodeToScreen(n, renderer, cw, ch, glCanvas) {
    if (!n || typeof n.x !== "number" || typeof n.y !== "number" || isNaN(n.x) || isNaN(n.y)) return null;
    const dpr = renderer.dpr || (glCanvas && glCanvas.width > 0 && cw > 0 ? glCanvas.width / cw : window.devicePixelRatio || 1);

    // 1. Live PixiJS Hanger Container position & scale (most accurate across pan/zoom)
    if (renderer.hanger && renderer.hanger.scale && typeof renderer.hanger.x === "number") {
      const sx = renderer.hanger.scale.x || 1;
      const sy = renderer.hanger.scale.y || sx;
      const hx = renderer.hanger.x;
      const hy = renderer.hanger.y;
      if (hx !== 0 || hy !== 0) {
        return {
          x: (n.x * sx + hx) / dpr,
          y: (n.y * sy + hy) / dpr,
        };
      }
    }

    // 2. PixiJS circle sprite worldTransform
    if (n.circle && n.circle.worldTransform && (n.circle.worldTransform.tx !== 0 || n.circle.worldTransform.ty !== 0)) {
      return {
        x: n.circle.worldTransform.tx / dpr,
        y: n.circle.worldTransform.ty / dpr,
      };
    }

    // 3. Fallback to renderer.scale & renderer.panX/panY
    const scale = typeof renderer.scale === "number" && renderer.scale > 0 ? renderer.scale : 1;
    const panX = typeof renderer.panX === "number" ? renderer.panX : 0;
    const panY = typeof renderer.panY === "number" ? renderer.panY : 0;
    const cx = (glCanvas && glCanvas.width ? glCanvas.width : cw * dpr) * 0.5;
    const cy = (glCanvas && glCanvas.height ? glCanvas.height : ch * dpr) * 0.5;
    if (Math.abs(panX - cx) < Math.abs(panX) && cx > 100) {
      return { x: (n.x * scale + panX) / dpr, y: (n.y * scale + panY) / dpr };
    }
    return { x: cw * 0.5 + (n.x * scale + panX) / dpr, y: ch * 0.5 + (n.y * scale + panY) / dpr };
  }

  renderGraphStudioFX() {
    if (this.settings.enableBentoGraph === false) return;
    const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
    if (!leaves || leaves.length === 0) return;

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

      const renderer = view.renderer;
      if (!renderer || !renderer.nodes || renderer.nodes.length === 0) continue;

      // Ensure live node colors & filters are kept synced with Obsidian's PixiJS renderer
      this.applyLiveGraphNodeStyling(view, false);

      const hovered = renderer.hoveredNode || null;
      const isPulse = this.settings.graphPulseNodes !== false;
      const preset = this.settings.graphPreset || "bento";

      const ctx = fxCanvas.getContext("2d");
      ctx.clearRect(0, 0, cw, ch);
      this.graphPulsePhase = (this.graphPulsePhase || 0) + 0.024;

      const isDark = document.body.classList.contains("artcraft-dark-craft") || document.body.classList.contains("theme-dark");
      const paletteHex = ["#69BD28", "#D97706", "#0EA5E9", "#10B981", "#F43F5E", "#8B5CF6", "#EAB308"];
      const glCanvas = viewContent.querySelector("canvas:not(.artcraft-graph-fx-canvas)");
      const getScreenPt = (n) => this.projectGraphNodeToScreen(n, renderer, cw, ch, glCanvas);

      // A. Architectural Grid for Bento & 3D Mind-Palace
      if (preset === "mindpalace" || preset === "bento") {
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.028)" : "rgba(120, 113, 108, 0.055)";
        ctx.lineWidth = 1;
        const gridSize = 64;
        for (let x = 0; x < cw; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, ch);
          ctx.stroke();
        }
        for (let y = 0; y < ch; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(cw, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // B. Constellation Mode: Golden Alchemical Sacred Geometry Bridges & Hub Runes
      if (preset === "constellation" && Array.isArray(this._graphTopHubs) && this._graphTopHubs.length > 1) {
        ctx.save();
        const hubs = this._graphTopHubs;
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.28)" : "rgba(217, 119, 6, 0.24)";
        for (let i = 0; i < hubs.length - 1; i++) {
          const p1 = getScreenPt(hubs[i]);
          const p2 = getScreenPt(hubs[i + 1]);
          if (!p1 || !p2) continue;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        hubs.forEach((hNode, idx) => {
          const pt = getScreenPt(hNode);
          if (!pt || pt.x < 0 || pt.x > cw || pt.y < 0 || pt.y > ch) return;
          const r = 12 + (idx === 0 ? 4 : 0) + Math.sin(this.graphPulsePhase * 2 + idx) * 2;
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(this.graphPulsePhase * 0.4 * (idx % 2 === 0 ? 1 : -1));
          ctx.strokeStyle = hNode._artcraftHex || "#F59E0B";
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
          // Diamond star points on top 3 hubs
          if (idx < 3) {
            ctx.beginPath();
            for (let k = 0; k < 4; k++) {
              const a = (k * Math.PI) / 2;
              ctx.moveTo(Math.cos(a) * (r - 3), Math.sin(a) * (r - 3));
              ctx.lineTo(Math.cos(a) * (r + 4), Math.sin(a) * (r + 4));
            }
            ctx.stroke();
          }
          ctx.restore();
        });
        ctx.restore();
      }

      // C. Ambient Neural Photon Flow along Graph Links
      if (isPulse && renderer.links && renderer.links.length > 0) {
        ctx.save();
        const links = renderer.links;
        const step = Math.max(1, Math.floor(links.length / 40));
        let idx = 0;
        for (let i = 0; i < links.length && idx < 40; i += step, idx++) {
          const lnk = links[i];
          if (!lnk || !lnk.source || !lnk.target) continue;
          if ((lnk.source._artcraftAlpha || 1) < 0.25 || (lnk.target._artcraftAlpha || 1) < 0.25) continue;
          const p1 = getScreenPt(lnk.source);
          const p2 = getScreenPt(lnk.target);
          if (!p1 || !p2) continue;
          if ((p1.x < 0 && p2.x < 0) || (p1.x > cw && p2.x > cw) || (p1.y < 0 && p2.y < 0) || (p1.y > ch && p2.y > ch)) continue;

          const tProg = (this.graphPulsePhase * (0.65 + (idx % 5) * 0.14) + idx * 0.23) % 1;
          const px = p1.x + (p2.x - p1.x) * tProg;
          const py = p1.y + (p2.y - p1.y) * tProg;
          const col = lnk.source._artcraftHex || paletteHex[idx % paletteHex.length];

          const tailT = Math.max(0, tProg - 0.14);
          const tx = p1.x + (p2.x - p1.x) * tailT;
          const ty = p1.y + (p2.y - p1.y) * tailT;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.52;
          ctx.lineWidth = 1.7;
          ctx.stroke();

          ctx.beginPath();
          ctx.globalAlpha = 0.92;
          ctx.arc(px, py, 2.7, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        }
        ctx.restore();
      }

      // D. 3D Mind-Palace Spatial Elevation Halos & Parallax Shadows
      if (preset === "mindpalace") {
        ctx.save();
        const mx = this.graphMouseX || 0;
        const my = this.graphMouseY || 0;
        const nodes = renderer.nodes;
        const step = Math.max(1, Math.floor(nodes.length / 48));
        let count = 0;
        for (let i = 0; i < nodes.length && count < 48; i += step, count++) {
          const n = nodes[i];
          if ((n._artcraftAlpha || 1) < 0.25) continue;
          const pt = getScreenPt(n);
          if (!pt || pt.x < 10 || pt.x > cw - 10 || pt.y < 10 || pt.y > ch - 10) continue;

          ctx.beginPath();
          ctx.ellipse(pt.x + 5 + mx * 8, pt.y + 9 + my * 8, 7.5, 4.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(92, 60, 28, 0.12)";
          ctx.fill();

          if ((n._artcraftDegree || 0) >= 2 || count % 3 === 0) {
            const col = n._artcraftHex || paletteHex[count % paletteHex.length];
            const r = 9.5 + Math.sin(this.graphPulsePhase * 2 + count) * 2.2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = col;
            ctx.globalAlpha = 0.48;
            ctx.lineWidth = 1.35;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // E. Focus Radar Concentric Rings & Rotating Sweep Beam
      if (preset === "radar") {
        const hovPt = hovered ? getScreenPt(hovered) : null;
        const centerPt = hovPt || this.graphCursorPt || { x: cw / 2, y: ch / 2 };
        ctx.save();
        const rings = [75, 150, 235, 330];
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.15;
        ctx.strokeStyle = isDark ? "rgba(105, 189, 40, 0.24)" : "rgba(105, 189, 40, 0.28)";
        for (let r = 0; r < rings.length; r++) {
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y, rings[r], 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        const sweepAng = (this.graphPulsePhase * 1.15) % (Math.PI * 2);
        const grad = ctx.createLinearGradient(
          centerPt.x,
          centerPt.y,
          centerPt.x + Math.cos(sweepAng) * 235,
          centerPt.y + Math.sin(sweepAng) * 235
        );
        grad.addColorStop(0, "rgba(105, 189, 40, 0.48)");
        grad.addColorStop(1, "rgba(105, 189, 40, 0)");
        ctx.beginPath();
        ctx.moveTo(centerPt.x, centerPt.y);
        ctx.lineTo(centerPt.x + Math.cos(sweepAng) * 235, centerPt.y + Math.sin(sweepAng) * 235);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
      }

      // F. Memory Resonance Shockwave & Gem Callout Pills
      if (this.memoryResonanceActive && this.resonanceGems && this.resonanceGems.length > 0) {
        ctx.save();
        const elapsed = (Date.now() - (this.memoryResonanceStart || Date.now())) / 1000;
        const waveR = elapsed * 360;
        const waveAlpha = Math.max(0, 1 - elapsed / 6.5);

        ctx.beginPath();
        ctx.arc(cw / 2, ch / 2, waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${waveAlpha * 0.48})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        for (let i = 0; i < this.resonanceGems.length; i++) {
          const gem = this.resonanceGems[i];
          const gpt = getScreenPt(gem);
          if (!gpt) continue;

          const haloR = 13 + Math.sin(this.graphPulsePhase * 3.5 + i) * 3;
          ctx.beginPath();
          ctx.arc(gpt.x, gpt.y, haloR, 0, Math.PI * 2);
          ctx.strokeStyle = "#D97706";
          ctx.lineWidth = 2;
          ctx.stroke();

          const rawId = String(gem.id || "").replace(/\.md$/i, "");
          const gemName = rawId.split("/").pop() || rawId;
          ctx.font = '600 10.5px "Inter", sans-serif';
          const cardText = `★ ${gemName.slice(0, 24)} (${gem._artcraftDegree || 0})`;
          const tw = ctx.measureText(cardText).width + 16;
          const cx = Math.max(8, Math.min(cw - tw - 8, gpt.x - tw / 2));
          const cy = Math.max(10, gpt.y - 30);

          ctx.fillStyle = isDark ? "#292524" : "#FFFBEB";
          ctx.strokeStyle = "#D97706";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cx, cy, tw, 21, 6);
          else ctx.rect(cx, cy, tw, 21);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isDark ? "#FDE68A" : "#92400E";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillText(cardText, cx + tw / 2, cy + 10.5);
        }
        ctx.restore();
      }

      // G. Constellation Walk Tour
      if (this.constellationWalkActive && this.constellationPath && this.constellationPath.length > 0) {
        ctx.save();
        const nowMs = Date.now();
        if (nowMs - (this.constellationLastStepTime || 0) > 3200) {
          this.constellationLastStepTime = nowMs;
          this.constellationStep = (this.constellationStep + 1) % this.constellationPath.length;
        }

        const stepIdx = this.constellationStep || 0;
        const curGem = this.constellationPath[stepIdx];
        const nextGem = this.constellationPath[(stepIdx + 1) % this.constellationPath.length];
        const p1 = getScreenPt(curGem);
        const p2 = getScreenPt(nextGem);

        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "#D97706";
          ctx.lineWidth = 2.4;
          ctx.stroke();

          const prog = ((nowMs - this.constellationLastStepTime) % 3200) / 3200;
          const px = p1.x + (p2.x - p1.x) * prog;
          const py = p1.y + (p2.y - p1.y) * prog;

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#F59E0B";
          ctx.fill();
        }

        if (p1) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 15 + Math.sin(this.graphPulsePhase * 4) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const curTitle = String(curGem.id || "").replace(/\.md$/i, "").split("/").pop();
        const tourMsg = `Маршрут ${stepIdx + 1}/${this.constellationPath.length}: ${curTitle.slice(0, 28)}`;
        ctx.font = '600 11px "Inter", sans-serif';
        const msgW = ctx.measureText(tourMsg).width + 24;
        const bx = Math.max(16, (cw - msgW) / 2);
        const by = 18;

        ctx.fillStyle = isDark ? "rgba(28, 25, 23, 0.94)" : "rgba(254, 252, 232, 0.96)";
        ctx.strokeStyle = "#D97706";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, msgW, 25, 999);
        else ctx.rect(bx, by, msgW, 25);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? "#FDE68A" : "#92400E";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(tourMsg, bx + msgW / 2, by + 12.5);
        ctx.restore();
      }

      // H. Hovered Node Highlight, Connected Edge Photons & Rich Inspector Badge
      if (hovered) {
        const hovPt = getScreenPt(hovered);
        if (hovPt && hovPt.x >= 0 && hovPt.x <= cw && hovPt.y >= 0 && hovPt.y <= ch) {
          if (this._lastHoveredId !== hovered.id) {
            this._lastHoveredId = hovered.id;
            this._cachedLinks = [];
            const allLinks = renderer.links || [];
            for (let i = 0; i < allLinks.length && this._cachedLinks.length < 28; i++) {
              const lnk = allLinks[i];
              if (lnk && (lnk.source === hovered || lnk.target === hovered)) {
                this._cachedLinks.push(lnk);
              }
            }
          }

          if (this._cachedLinks && this._cachedLinks.length > 0) {
            ctx.save();
            for (let i = 0; i < this._cachedLinks.length; i++) {
              const lnk = this._cachedLinks[i];
              const p1 = getScreenPt(lnk.source);
              const p2 = getScreenPt(lnk.target);
              if (!p1 || !p2) continue;

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = hovered._artcraftHex || "#69BD28";
              ctx.globalAlpha = 0.65;
              ctx.lineWidth = 2.0;
              ctx.stroke();

              const tProg = (this.graphPulsePhase + i * 0.16) % 1;
              const px = p1.x + (p2.x - p1.x) * tProg;
              const py = p1.y + (p2.y - p1.y) * tProg;
              ctx.beginPath();
              ctx.globalAlpha = 0.95;
              ctx.arc(px, py, 3.2, 0, Math.PI * 2);
              ctx.fillStyle = hovered._artcraftHex || paletteHex[i % paletteHex.length];
              ctx.fill();
            }
            ctx.restore();
          }

          ctx.save();
          const pulseR = 12 + Math.sin(this.graphPulsePhase * 3) * 2.5;
          ctx.beginPath();
          ctx.arc(hovPt.x, hovPt.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = hovered._artcraftHex || "#69BD28";
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Floating Node Metric Badge above hovered node
          const rawId = String(hovered.id || "").replace(/\.md$/i, "");
          const folder = rawId.includes("/") ? rawId.split("/")[0] : "Root";
          const deg = hovered._artcraftDegree || 0;
          const stampRec = this.getNoteStampRecord(hovered.id);
          const badgeTxt = `${folder} • ${deg} связей${stampRec ? " • ★" : ""}`;
          ctx.font = '600 10px "JetBrains Mono", monospace';
          const bw = ctx.measureText(badgeTxt).width + 14;
          const bx = Math.max(8, Math.min(cw - bw - 8, hovPt.x - bw / 2));
          const by = Math.max(8, hovPt.y - 34);
          ctx.fillStyle = isDark ? "rgba(20, 24, 32, 0.92)" : "rgba(247, 246, 242, 0.95)";
          ctx.strokeStyle = hovered._artcraftHex || "#69BD28";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx, by, bw, 19, 6);
          else ctx.rect(bx, by, bw, 19);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = isDark ? "#F8FAFC" : "#1C1917";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(badgeTxt, bx + bw / 2, by + 9.5);
          ctx.restore();
        }
      }
    }
  }

  triggerMemoryResonance(viewContent, renderer) {
    if (!renderer || !renderer.nodes || renderer.nodes.length === 0) {
      new Notice("Откройте граф, чтобы запустить Резонанс памяти!");
      return;
    }
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    this.playHarmonicResonanceChime();
    this.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 35);

    this.memoryResonanceActive = true;
    this.memoryResonanceStart = Date.now();

    const allNodes = renderer.nodes.filter((n) => n && n.id && !n.id.includes("node_modules") && !n.id.includes("_CloudSync"));
    if (allNodes.length === 0) return;

    const links = renderer.links || [];
    const linkMap = {};
    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      if (l.source && l.source.id) linkMap[l.source.id] = (linkMap[l.source.id] || 0) + 1;
      if (l.target && l.target.id) linkMap[l.target.id] = (linkMap[l.target.id] || 0) + 1;
    }

    let scored = allNodes
      .map((n) => ({ node: n, score: linkMap[n.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    const candidates = scored.slice(0, Math.min(20, scored.length)).sort(() => Math.random() - 0.5).slice(0, 4);
    this.resonanceGems = candidates.map((c) => c.node);

    new Notice(
      isRu
        ? `Резонанс памяти: подсвечено ${this.resonanceGems.length} ключевых узлов знаний`
        : `Memory Resonance: highlighted ${this.resonanceGems.length} knowledge hubs`
    );

    setTimeout(() => {
      this.memoryResonanceActive = false;
      this.resonanceGems = [];
    }, 6500);
  }

  playHarmonicResonanceChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      [432, 648].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        gain.connect(ctx.destination);

        const initGain = idx === 0 ? 0.14 : 0.07;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(initGain, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.start(now);
        osc.stop(now + 1.65);
      });
    } catch (e) {}
  }

  toggleConstellationWalk(viewContent, renderer) {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    if (this.constellationWalkActive) {
      this.constellationWalkActive = false;
      this.constellationPath = [];
      new Notice(isRu ? "Тур по графу завершён." : "Graph Tour ended.");
      return;
    }

    if (!renderer || !renderer.nodes || renderer.nodes.length === 0) {
      new Notice("Откройте граф для запуска тура!");
      return;
    }

    const allNodes = renderer.nodes.filter((n) => n && n.id && !n.id.includes("node_modules"));
    if (allNodes.length < 2) return;

    const links = renderer.links || [];
    const adj = {};
    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      if (l.source && l.target) {
        if (!adj[l.source.id]) adj[l.source.id] = [];
        if (!adj[l.target.id]) adj[l.target.id] = [];
        adj[l.source.id].push(l.target);
        adj[l.target.id].push(l.source);
      }
    }

    let cur = renderer.hoveredNode || allNodes[Math.floor(Math.random() * allNodes.length)];
    const path = [cur];
    for (let step = 0; step < 5; step++) {
      const neighbors = adj[cur.id] || [];
      const unvisited = neighbors.filter((nb) => !path.includes(nb));
      if (unvisited.length > 0) {
        cur = unvisited[Math.floor(Math.random() * unvisited.length)];
        path.push(cur);
      } else {
        const nextRand = allNodes[Math.floor(Math.random() * allNodes.length)];
        if (!path.includes(nextRand)) path.push(nextRand);
      }
    }

    this.constellationWalkActive = true;
    this.constellationPath = path;
    this.constellationStep = 0;
    this.constellationLastStepTime = Date.now();

    new Notice(
      isRu
        ? `Созвездие-Тур: маршрут из ${path.length} связанных заметок`
        : `Constellation Tour: path across ${path.length} linked notes`
    );
  }

  // Colours top-level folders in the graph. It changes only what it owns: the colour groups it added
  // earlier are replaced, every other group and every other graph setting of the user is left alone.
  // The "orphans" switch flips showOrphans and nothing else.
  async applyBentoGraphColorGroups(toggleOrphans = false, silent = false) {
    try {
      const adapter = this.app.vault.adapter;
      const configDir = this.app.vault.configDir || ".obsidian";
      const graphPath = `${configDir}/graph.json`;
      let graphConfig = {};
      if (await adapter.exists(graphPath)) {
        try {
          graphConfig = JSON.parse(await adapter.read(graphPath)) || {};
        } catch (e) {
          graphConfig = {};
        }
      }
      const isRu = (this.settings.uiLanguage || "en") === "ru";

      if (toggleOrphans) {
        graphConfig.showOrphans = graphConfig.showOrphans === false;
      } else {
        const palette = [2450411, 16096779, 1096065, 9133302, 15485081, 439972, 6929704, 15358988];
        const rootChildren = (this.app.vault.getRoot() && this.app.vault.getRoot().children) || [];
        const folders = rootChildren
          .filter((f) => f && f.children !== undefined && !f.name.startsWith(".") && !f.name.startsWith("_"))
          .map((f) => f.name)
          .sort();
        const owned = new Set(Array.isArray(this.settings.graphOwnedQueries) ? this.settings.graphOwnedQueries : []);
        const kept = (Array.isArray(graphConfig.colorGroups) ? graphConfig.colorGroups : []).filter((g) => g && !owned.has(g.query));
        const mine = folders.map((name, idx) => ({
          query: 'path:"' + name.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '/"',
          color: { a: 1, rgb: palette[idx % palette.length] },
        }));
        graphConfig.colorGroups = kept.concat(mine);
        this.settings.graphOwnedQueries = mine.map((g) => g.query);
        await this.saveSettings();
        this.graphFoldersColored = folders.length;
      }

      await adapter.write(graphPath, JSON.stringify(graphConfig, null, 2));

      const graphPlugin = this.app.internalPlugins?.plugins?.graph?.instance;
      if (graphPlugin && graphPlugin.options) {
        graphPlugin.options.colorGroups = graphConfig.colorGroups;
        graphPlugin.options.showOrphans = graphConfig.showOrphans;
      }
      const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
      leaves.forEach((leaf) => {
        const view = leaf.view;
        if (!view) return;
        try {
          if (view.dataEngine) {
            if (typeof view.dataEngine.setOptions === "function") {
              view.dataEngine.setOptions({ colorGroups: graphConfig.colorGroups, showOrphans: graphConfig.showOrphans });
            }
            if (typeof view.dataEngine.updateColorGroups === "function") view.dataEngine.updateColorGroups();
            if (typeof view.dataEngine.render === "function") view.dataEngine.render();
          }
          this._graphColorsDirty = true;
          this.applyLiveGraphNodeStyling(view, true);
          if (view.renderer && typeof view.renderer.changed === "function") view.renderer.changed();
        } catch (e) {}
      });

      if (!silent) {
        new Notice(
          toggleOrphans
            ? isRu
              ? `Заметки без связей: ${graphConfig.showOrphans ? "показаны" : "скрыты"}`
              : `Unlinked notes: ${graphConfig.showOrphans ? "shown" : "hidden"}`
            : isRu
            ? `Папки раскрашены в графе: ${this.graphFoldersColored}. Ваши собственные группы цветов сохранены.`
            : `Folders coloured in the graph: ${this.graphFoldersColored}. Your own colour groups were kept.`
        );
      }
    } catch (err) {
      if (!silent) new Notice("Could not update the graph configuration.");
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

      // Draw crisp Swiss Craft watermark pill in top-left of exported PNG
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
      new Notice((this.settings.uiLanguage || "en") === "ru" ? "Снимок графа сохранен в PNG!" : "Swiss Craft Graph snapshot saved as PNG!");
    } catch (err) {
      new Notice("Could not export graph snapshot.");
    }
  }

  // --- CLEAN UPPER-RIGHT EX-LIBRIS STAMP, QUIET EDITORIAL LINE & 5-NUTRIENT PHYSICAL STICKY TABS ---
  getNoteStampRecord(filePath) {
    if (!this.settings.stampedNotes) this.settings.stampedNotes = {};
    const raw = this.settings.stampedNotes[filePath];
    if (!raw || raw.cleared) return null;
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
      this.settings.stampedNotes[filePath] = { cleared: true };
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
        .setTitle(isRu ? "+ Прикрепить цветную закладку" : "+ Attach 5-Nutrient Bookmark")
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
    setTimeout(() => this.renderNoteWaxSealOverlay(), 60);
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

    this.applyChronoInkToActiveNote();
    if (fromCheckboxClick && total > 0 && pct === 100 && this.lastTaskPctByFile[filePath] !== 100) {
      this.playChapterCompletionChord();
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

    const rawStamp = this.settings.stampedNotes && this.settings.stampedNotes[filePath];
    const stampRec =
      this.getNoteStampRecord(filePath) ||
      (total > 0 && pct === 100 && !(rawStamp && rawStamp.cleared) ? { dates: [new Date().toLocaleDateString()], count: 1 } : null);
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
      s = s.replace(/\[([^\]]+)\]\([^\)]*\)/g, "$1");
      s = s.replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, "$1");
      s = s.replace(/\[([^\]]+)\]/g, "$1");
      s = s.replace(/https?:\/\/[^\s\)]+/gi, "");
      s = s.replace(/^#+\s+/gm, "");
      s = s.replace(/[*_~`]/g, "");
      s = s.replace(/[\p{Extended_Pictographic}\u200d\ufe0f\u23f3\u270e\u270f]/gu, "");
      return s.replace(/\s{2,}/g, " ").trim();
    };

    const bookmarksHtml =
      noteBookmarks.length > 0
        ? `<div class="artcraft-margin-bookmarks-strip">
            <button class="artcraft-bm-digest-chip" data-act="digest" title="${
              isRu ? "Открыть книжный дайджест" : "Open Book Nutrient Digest (Proteins & Carbs)"
            }">
              ${sicraftIcon('book')}
              <span>${isRu ? `Дайджест · ${noteBookmarks.length}` : `Digest · ${noteBookmarks.length}`}</span>
            </button>
            ${noteBookmarks
              .map((bm) => {
                const n = normalizeNutrient(bm);
                const nutName = isRu ? n.ruName : n.enName;
                const rawMeaning = bm.meaning || bm.snippet || nutName;
                const cleanMeaning = cleanBookmarkText(rawMeaning) || nutName;
                const shortMeaning = cleanMeaning.length > 60 ? cleanMeaning.slice(0, 58) + "…" : cleanMeaning;
                const cleanSnippet = cleanBookmarkText(bm.snippet || "");
                const tooltip = `${nutName} (${isRu ? n.ruRole : n.enRole})\n${bm.meaning ? cleanBookmarkText(bm.meaning) + "\n" : ""}«${cleanSnippet}»`;
                return `
                  <div class="artcraft-bm-pill is-nut-${n.id}" data-bm-id="${escHtml(bm.id)}" data-bm-line="${safeNum(bm.line, 0)}" style="--bm-accent:${n.color};--bm-bg:${n.bg};--bm-border:${n.border};" title="${tooltip.replace(/"/g, "&quot;")}">
                    <span class="bm-nut-dot" style="background:${n.color}"></span>
                    <span class="bm-tag-name" style="color:${n.color}">${nutName}</span>
                    <span class="bm-tag-text">${escHtml(shortMeaning)}</span>
                    <button class="bm-tag-edit" data-bm-edit="${escHtml(bm.id)}" title="${isRu ? "Изменить закладку" : "Edit sticker"}">${SICRAFT_SVGS.edit}</button>
                    <button class="bm-tag-del" data-bm-del="${escHtml(bm.id)}" title="${isRu ? "Удалить закладку" : "Delete sticker"}">${sicraftIcon('clear')}</button>
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
              ? `Полка «Классика»! Прочитано ${stampRec.count} раз(а): ${escHtml(stampRec.dates.join(", "))}. Нажмите для меню.`
              : `Classics Shelf! Read ${stampRec.count} times: ${escHtml(stampRec.dates.join(", "))}. Click for menu.`
          }">
            ${sicraftIcon('stamp')}
            <span>★ ${isRu ? `КЛАССИКА #${stampRec.count}` : `CLASSICS #${stampRec.count}`} • ${escHtml(latestDate)}</span>
          </span>
        `;
      } else if (isStamped) {
        stampBadgeHtml = `
          <span class="artcraft-ink-stamp-badge${animClass}" data-act="stamp-menu" title="${
            isRu
              ? `Изучено: ${escHtml(latestDate)} (Чтение #1). Нажмите, чтобы отметить 2-е прочтение (Полка «Классика») или снять штамп.`
              : `Approved: ${escHtml(latestDate)} (Read #1). Click to add 2nd read (Classics Shelf) or remove stamp.`
          }">
            ${sicraftIcon('stamp')}
            <span>${isRu ? "ИЗУЧЕНО" : "APPROVED"} • ${escHtml(latestDate)}</span>
          </span>
        `;
      } else {
        stampBadgeHtml = `
          <button class="artcraft-craft-mini-btn" data-act="stamp-now" title="${
            isRu ? "Поставить штамп «Изучено» (APPROVED) с сегодняшней датой" : "Stamp note as APPROVED with today's date"
          }">
            ${sicraftIcon('stamp')}
            <span>${isRu ? "Штамп" : "Stamp"}</span>
          </button>
        `;
      }
    }

    wrap.innerHTML = `
      <div class="artcraft-top-bar-inner">
        <div class="artcraft-header-main-row">
          <div class="artcraft-header-meta-group">
            ${
              showStats
                ? `<span class="artcraft-reading-stats-pill" title="${
                    isRu ? "Расчетное время чтения (~200 слов/мин)" : "Estimated reading time (~200 wpm)"
                  }">${sicraftIcon('book')}<span>${readingText}</span></span>`
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
          </div>
          <div class="artcraft-note-craft-actions">
            ${stampBadgeHtml}
            <button class="artcraft-craft-mini-btn" data-act="bookmark" title="${
              isRu
                ? "Добавить закладку к текущей строке"
                : "Add a sticker to the current line"
            }">
              ${sicraftIcon('bookmark')}
              <span>+ ${isRu ? "Закладка" : "Sticker"}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${this.settings.bookSpreadMode ? "is-active" : ""}" data-act="spread" title="${
              isRu
                ? "Клик: вид книжной страницы. Правый клик: разворот из двух страниц"
                : "Click: book page view. Right-click: two-page spread"
            }">
              ${sicraftIcon('columns')}
              <span>${isRu ? "Книжный лист" : "Book Page"}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${(this.settings.pageWidthMode && this.settings.pageWidthMode !== 'book') ? "is-active" : ""}" data-act="width-cycle" title="${
              i18n({
                en: "Page width: 760 px → 1080 px → full",
                ru: "Ширина страницы: 760 px → 1080 px → вся ширина",
                zh: "页面宽度：760px → 1080px → 全宽",
                ja: "ページ幅：760px → 1080px → 全幅",
                es: "Ancho de página: 760 px → 1080 px → completo",
                de: "Seitenbreite: 760 px → 1080 px → volle Breite"
              }, this)
            }">
              ${sicraftIcon('ruler')}
              <span>${this.settings.pageWidthMode === "wide" ? "1080px" : this.settings.pageWidthMode === "full" ? "Full" : "760px"}</span>
            </button>
            <button class="artcraft-craft-mini-btn" data-act="bookshelf" title="${
              i18n({
                en: "Open Classics Bookshelf — stamped notes & 5-Nutrient bookmarks",
                ru: "Открыть «Полку Классики» — изученные книги и закладки-нутриенты",
                zh: "打开经典书架——已研读笔记与5大养分书签",
                ja: "古典の本棚を開く — 学習済みノートと栄養素付箋",
                es: "Abrir Estantería de Clásicos — notas selladas y nutrientes",
                de: "Klassiker-Regal öffnen — gestempelte Notizen & Nährstoffe"
              }, this)
            }">
              ${sicraftIcon('shelf')}
              <span>${i18n({ en: "Shelf", ru: "Полка", zh: "书架", ja: "本棚", es: "Estante", de: "Regal" }, this)}</span>
            </button>
            <button class="artcraft-craft-mini-btn is-quest-chain-btn" data-act="quest-chain" title="${
              i18n({
                en: "Life RPG & Quest & Task Journal (365-Day Progress)",
                ru: "Журнал целей и задач (365-дневный трекер)",
                zh: "Life RPG 与 SHA-256 任务区块链 (365天热力图与智能合约)",
                ja: "Life RPG & SHA-256 クエストチェーン (365日ヒートマップ＆スマートコントラクト)",
                es: "Life RPG y Cadena SHA-256 (Mapa de 365 días y Contrato Inteligente)",
                de: "Life RPG & SHA-256 Quest-Chain (365-Tage-Heatmap & Smart Contract)"
              }, this)
            }">
              ${sicraftIcon('chain')}
              <span>${i18n({ en: "Quests", ru: "Квесты", zh: "任务链", ja: "クエスト", es: "Misiones", de: "Quests" }, this)} · L${safeNum(this.settings.lifeRpg && this.settings.lifeRpg.level, 1)}</span>
            </button>
            <button class="artcraft-craft-mini-btn is-bio-flow-btn" data-act="bio-flow" title="${
              i18n({
                en: "Focus Readiness & Cognitive Clarity",
                ru: "Готовность к фокусу (Энергия и баланс)",
                zh: "生物节律与心流指数 (认知能量与挑战平衡)",
                ja: "バイオリズム＆フロー準備度 (認知エネルギーと難易度バランス)",
                es: "Bio-Ritmo e Índice de Flujo (Energía cognitiva y equilibrio)",
                de: "Bio-Rhythmus & Flow-Index (Kognitive Energie & Balance)"
              }, this)
            }">
              ${sicraftIcon('pulse')}
              <span>${i18n({ en: "Flow", ru: "Поток", zh: "心流", ja: "フロー", es: "Flujo", de: "Flow" }, this)} · ${safeNum(this.settings.bioFlow && this.settings.bioFlow.energy, 82)}%</span>
            </button>
            <button class="artcraft-craft-mini-btn is-neural-brief-btn" data-act="neural-brief" title="${
              i18n({
                en: "Note summary, capsule for AI tools and similar notes",
                ru: "Сводка заметки, капсула для ИИ и похожие заметки",
                zh: "笔记摘要、AI 胶囊与相似笔记",
                ja: "ノート要約・AI 用カプセル・類似ノート",
                es: "Resumen de la nota, cápsula para IA y notas similares",
                de: "Notiz-Zusammenfassung, KI-Kapsel und ähnliche Notizen"
              }, this)
            }">
              ${sicraftIcon('sparkle')}
              <span>${i18n({ en: "AI·Brief", ru: "AI·Бриф", zh: "AI·摘要", ja: "AI·要約", es: "IA·Brief", de: "KI·Brief" }, this)}</span>
            </button>
            <button class="artcraft-craft-mini-btn is-kanban-quick-btn" data-act="kanban-board" title="${
              i18n({
                en: "Open the task board of this note",
                ru: "Открыть доску задач этой заметки",
                zh: "打开此笔记的任务看板",
                ja: "このノートのタスクボードを開く",
                es: "Abrir el tablero de tareas de esta nota",
                de: "Aufgaben-Board dieser Notiz öffnen"
              }, this)
            }">
              ${sicraftIcon('columns')}
              <span>${i18n({ en: "Kanban", ru: "Канбан", zh: "看板", ja: "カンバン", es: "Kanban", de: "Kanban" }, this)}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${(this.settings.paperGrain || 0) > 0 ? "is-active" : ""}" data-act="grain-cycle" title="${
              i18n({
                en: "Paper grain: off → 35% → 65% → 100%",
                ru: "Зерно бумаги: выкл → 35% → 65% → 100%",
                zh: "纸张颗粒质感：点击切换 0% → 35% → 65% → 100%",
                ja: "紙の粒子テクスチャ：0% → 35% → 65% → 100% 切り替え",
                es: "Textura de grano de papel: alternar 0% → 35% → 65% → 100%",
                de: "Papierkorn-Textur: umschalten 0% → 35% → 65% → 100%"
              }, this)
            }">
              ${sicraftIcon('sparkle')}
              <span>${i18n({ en: "Grain", ru: "Зерно", zh: "纸纹", ja: "紙粒", es: "Grano", de: "Korn" }, this)} ${safeNum(this.settings.paperGrain, 0)}%</span>
            </button>
            <button class="artcraft-craft-mini-btn is-creator-os-btn" data-act="creator-os" title="${
              i18n({
                en: "Creator Studio: @brand AI Context, APAG Post Builder, Kanban & Sketchpad",
                ru: "Студия Автора: @brand для ИИ, посты APAG, Канбан задач и Скетчбук",
                zh: "创作者工坊：@brand AI上下文、APAG写作、看板与手绘板",
                ja: "クリエイタースタジオ：@brand AI、APAG作成、カンバン＆スケッチ",
                es: "Estudio Creador: @brand IA, APAG, Kanban y Bocetos",
                de: "Creator Studio: @brand KI, APAG, Kanban & Skizzenbuch"
              }, this)
            }">
              ${sicraftIcon('bolt')}
              <span>${i18n({ en: "Studio", ru: "Студия", zh: "工坊", ja: "スタジオ", es: "Estudio", de: "Studio" }, this)}</span>
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

    wrap.querySelector('[data-act="bookshelf"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openClassicsBookshelfModal();
    });

    wrap.querySelector('[data-act="quest-chain"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openQuestChainModal();
    });

    wrap.querySelector('[data-act="bio-flow"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openBioFlowModal();
    });

    wrap.querySelector('[data-act="sketchpad"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openCreativeSketchModal();
    });

    wrap.querySelector('[data-act="neural-brief"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openDualCognitionModal();
    });

    wrap.querySelector('[data-act="kanban-board"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openCreatorOsModal("kanban");
    });

    wrap.querySelector('[data-act="grain-cycle"]')?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const curG = Number(this.settings.paperGrain || 0);
      const nextG = curG === 0 ? 35 : curG <= 35 ? 65 : curG <= 65 ? 100 : 0;
      this.settings.paperGrain = nextG;
      if (nextG > 0 && this.settings.surfaceMode === "white") {
        this.settings.surfaceMode = "grain";
      }
      await this.saveSettings();
      this.applyBodyClasses();
      this.ensureTactilePaperGrainOverlay(activeView);
      this.updateTaskProgressBar();
      new obsidian.Notice(
        isRu
          ? `Архивная зернистость и шуршавость листа: ${nextG}%`
          : `Archival Paper Grain texture: ${nextG}%`
      );
    });

    wrap.querySelector('[data-act="creator-os"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openCreatorOsModal();
    });

    // v5.3.0: Mount tactile paper grain overlay, IDE code studio, sidebar bespoke icons & wind-tethered note chain footer
    this.ensureTactilePaperGrainOverlay(activeView);
    this.decorateSidebarFileExplorer();
    this.enhanceCodeBlocksInView(activeView.containerEl);
    this.renderWindTetheredNoteChainFooter(activeView);

    wrap.querySelector('[data-act="width-cycle"]')?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const curW = this.settings.pageWidthMode || "book";
      this.settings.pageWidthMode = curW === "book" ? "wide" : curW === "wide" ? "full" : "book";
      await this.saveSettings();
      this.applyBodyClasses();
      this.playTactileMicroFeedback("tap");
      this.updateTaskProgressBar();
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

    // Wire up 5-Nutrient Bookmark pills (Click to jump, to edit, × to delete)
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

  openClassicsBookshelfModal() {
    new ClassicsBookshelfModal(this.app, this).open();
  }

  // --- TIME CAPSULE (WAX SEAL): SEAL A NOTE UNTIL A DATE, RECALL IT, THEN CRACK THE SEAL ---
  // How it works:
  //  1) "Seal" opens a modal: pick an unlock date + optional recall question / letter to your future self.
  //  2) Until that date the note is covered by a wax-sealed veil (the file itself is NOT modified or encrypted).
  //     Try to recall the content from the question. Opening early = press & hold the seal for 2 seconds.
  //  3) When the date arrives Obsidian shows a notice, the seal turns gold and one click cracks it open.
  getTimeCapsuleInfo(seal) {
    if (!seal) return null;
    let unlockAt = Number(seal.unlockAt) || 0;
    if (!unlockAt && seal.unlockDate) {
      const parsed = Date.parse(seal.unlockDate);
      unlockAt = Number.isFinite(parsed) ? parsed : 0;
    }
    let sealedAtMs = Number(seal.sealedAtMs) || 0;
    if (!sealedAtMs && seal.sealedAt) {
      const parsed = Date.parse(seal.sealedAt);
      sealedAtMs = Number.isFinite(parsed) ? parsed : 0;
    }
    if (!sealedAtMs) sealedAtMs = unlockAt ? unlockAt - 7 * 86400000 : Date.now();
    const now = Date.now();
    const ready = !unlockAt || now >= unlockAt;
    const span = Math.max(1, unlockAt - sealedAtMs);
    const pct = ready ? 100 : Math.max(0, Math.min(100, ((now - sealedAtMs) / span) * 100));
    return { unlockAt, sealedAtMs, ready, pct, remainingMs: Math.max(0, unlockAt - now), message: seal.message || "" };
  }

  formatCapsuleRemaining(ms, locOrIsRu) {
    const totalMin = Math.max(0, Math.ceil(ms / 60000));
    const d = Math.floor(totalMin / 1440);
    const h = Math.floor((totalMin % 1440) / 60);
    const m = totalMin % 60;
    const pad = (n) => String(n).padStart(2, "0");
    const loc = typeof locOrIsRu === "string" ? locOrIsRu : (locOrIsRu ? "ru" : "en");
    if (loc === "ru") return `${pad(d)}д ${pad(h)}ч ${pad(m)}м`;
    if (loc === "zh") return `${pad(d)}天 ${pad(h)}时 ${pad(m)}分`;
    if (loc === "ja") return `${pad(d)}日 ${pad(h)}時間 ${pad(m)}分`;
    if (loc === "de") return `${pad(d)}T ${pad(h)}Std ${pad(m)}Min`;
    return `${pad(d)}d ${pad(h)}h ${pad(m)}m`;
  }

  async toggleNoteWaxSeal() {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    const loc = getLocale(this);
    if (!view || !view.file) {
      new Notice(i18n({
        en: "Open the note you want to seal first.",
        ru: "Откройте заметку, которую хотите запечатать.",
        zh: "请先打开要封存的笔记。",
        ja: "まず封印したいノートを開いてください。",
        es: "Abre primero la nota que deseas sellar.",
        de: "Öffne zuerst die Notiz, die du versiegeln möchtest.",
      }, this));
      return;
    }
    const fp = view.file.path;
    if (!this.settings.waxSealNotes) this.settings.waxSealNotes = {};
    const seal = this.settings.waxSealNotes[fp];

    if (seal) {
      const info = this.getTimeCapsuleInfo(seal);
      if (info.ready) {
        await this.breakTimeCapsule(fp, false);
      } else {
        this.renderNoteWaxSealOverlay();
        new Notice(
          i18n({
            en: `Capsule unlocks in ${this.formatCapsuleRemaining(info.remainingMs, loc)}. To open early, press & hold the seal for 1.5 seconds.`,
            ru: `Капсула откроется через ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Чтобы вскрыть досрочно — удерживайте печать 1,5 секунды.`,
            zh: `胶囊将在 ${this.formatCapsuleRemaining(info.remainingMs, loc)} 后解锁。提前开封：长按印章1.5秒。`,
            ja: `カプセルはあと ${this.formatCapsuleRemaining(info.remainingMs, loc)} で開封できます。早期開封：印を1.5秒長押し。`,
            es: `La cápsula se desbloquea en ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Para abrir antes, mantén el sello 1,5 s.`,
            de: `Die Kapsel öffnet in ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Zum vorzeitigen Öffnen das Siegel 1,5 Sek. halten.`,
          }, this)
        );
      }
      return;
    }

    new TimeCapsuleSealModal(this.app, this, view.file).open();
  }

  playEnvelopeSealAcousticSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.keyAudioCtx) this.keyAudioCtx = new AudioCtx();
      const ctx = this.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      const bufSize = Math.floor(ctx.sampleRate * 0.28);
      const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1100, now);
      bp.Q.setValueAtTime(1.8, now);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.08, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(ctx.destination);
      noise.start(now);

      const thud = ctx.createOscillator();
      const tg = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(118, now + 0.22);
      thud.frequency.exponentialRampToValueAtTime(42, now + 0.48);
      tg.gain.setValueAtTime(0.0001, now);
      tg.gain.setValueAtTime(0.22, now + 0.22);
      tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.50);
      thud.connect(tg);
      tg.connect(ctx.destination);
      thud.start(now + 0.22);
      thud.stop(now + 0.52);

      [
        { f: 146.83, d: 0.28, dur: 1.9, t: "triangle", g: 0.10 },
        { f: 220.00, d: 0.34, dur: 1.8, t: "sine", g: 0.08 },
        { f: 369.99, d: 0.42, dur: 1.7, t: "sine", g: 0.07 },
        { f: 440.00, d: 0.50, dur: 2.0, t: "sine", g: 0.06 }
      ].forEach((n) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = n.t;
        osc.frequency.setValueAtTime(n.f, now + n.d);
        g.gain.setValueAtTime(0.0001, now + n.d);
        g.gain.linearRampToValueAtTime(n.g, now + n.d + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + n.d + n.dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + n.d);
        osc.stop(now + n.d + n.dur + 0.05);
      });
    } catch (e) {}
  }

  playEnvelopeOpenAcousticSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.keyAudioCtx) this.keyAudioCtx = new AudioCtx();
      const ctx = this.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      [0.0, 0.09].forEach((offset, idx) => {
        const snap = ctx.createOscillator();
        const sg = ctx.createGain();
        snap.type = "triangle";
        snap.frequency.setValueAtTime(idx === 0 ? 520 : 680, now + offset);
        snap.frequency.exponentialRampToValueAtTime(140, now + offset + 0.055);
        sg.gain.setValueAtTime(0.14, now + offset);
        sg.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.06);
        snap.connect(sg);
        sg.connect(ctx.destination);
        snap.start(now + offset);
        snap.stop(now + offset + 0.065);
      });

      [
        { f: 130.81, d: 0.12, dur: 2.2, t: "triangle", g: 0.11 },
        { f: 196.00, d: 0.18, dur: 2.0, t: "sine", g: 0.09 },
        { f: 329.63, d: 0.25, dur: 1.9, t: "sine", g: 0.08 },
        { f: 392.00, d: 0.32, dur: 1.9, t: "sine", g: 0.08 },
        { f: 493.88, d: 0.40, dur: 2.0, t: "sine", g: 0.07 },
        { f: 587.33, d: 0.48, dur: 2.3, t: "sine", g: 0.07 }
      ].forEach((n) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = n.t;
        osc.frequency.setValueAtTime(n.f, now + n.d);
        g.gain.setValueAtTime(0.0001, now + n.d);
        g.gain.linearRampToValueAtTime(n.g, now + n.d + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + n.d + n.dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + n.d);
        osc.stop(now + n.d + n.dur + 0.05);
      });
    } catch (e) {}
  }

  async sealTimeCapsule(file, unlockAt, message) {
    if (!file) return;
    if (!this.settings.waxSealNotes) this.settings.waxSealNotes = {};
    if (this.tempPeekNotes) delete this.tempPeekNotes[file.path];
    const now = Date.now();
    this.settings.waxSealNotes[file.path] = {
      sealedAtMs: now,
      sealedAt: new Date(now).toISOString(),
      unlockAt,
      unlockDate: new Date(unlockAt).toISOString(),
      message: (message || "").trim().slice(0, 600),
      announced: false,
    };
    await this.saveSettings();
    this.playEnvelopeSealAcousticSound();
    this.renderNoteWaxSealOverlay(true);
    const loc = getLocale(this);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    const dateLabel = new Date(unlockAt).toLocaleDateString(locTag, { day: "numeric", month: "long", year: "numeric" });
    new Notice(i18n({
      en: `Letter sealed in wax until ${dateLabel}.`,
      ru: `Письмо уложено в конверт и запечатано сургучом до ${dateLabel}.`,
      zh: `信件已火漆封存至 ${dateLabel}。`,
      ja: `手紙を封蝋で ${dateLabel} まで封印しました。`,
      es: `Carta sellada en lacre hasta el ${dateLabel}.`,
      de: `Brief mit Siegellack bis ${dateLabel} verschlossen.`,
    }, this));
  }

  async breakTimeCapsule(fp, early) {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const seal = this.settings.waxSealNotes && this.settings.waxSealNotes[fp];
    if (!seal) return;
    const message = seal.message || "";

    this.playEnvelopeOpenAcousticSound();
    this.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 75);

    const veil = document.querySelector(".artcraft-wax-seal-veil");
    if (veil) {
      veil.classList.add("is-cracking");
      await new Promise((r) => setTimeout(r, 920));
    }

    delete this.settings.waxSealNotes[fp];
    if (this.tempPeekNotes) delete this.tempPeekNotes[fp];
    await this.saveSettings();
    this.renderNoteWaxSealOverlay();

    const head = early
      ? i18n({
          en: "Wax seal broken early — envelope unfolded.",
          ru: "Сургучная печать вскрыта — конверт распахнут.",
          zh: "火漆印已提前开启——信封已展开。",
          ja: "封蝋を早期開封し、封筒を開きました。",
          es: "Sello de lacre abierto — sobre desplegado.",
          de: "Wachssiegel vorzeitig gebrochen — Umschlag geöffnet."
        }, this)
      : i18n({
          en: "Time Capsule letter unfolded!",
          ru: "Письмо из Капсулы времени открыто!",
          zh: "时间胶囊信件已展开！",
          ja: "タイムカプセルの手紙を開封しました！",
          es: "¡Carta de la cápsula del tiempo abierta!",
          de: "Zeitkapsel-Brief geöffnet!"
        }, this);
    const tail = message
      ? isRu ? `\nВаше послание себе: «${message}»` : `\nYour message to yourself: “${message}”`
      : "";
    new Notice(head + tail, message ? 10000 : 4500);
  }

  renderNoteWaxSealOverlay(justSealed = false) {
    // A veil that already shows this note in this state stays. Rebuilding it on every refresh restarted
    // its animations and let an interrupted "hold to open" finish on a removed element.
    const sealView = this.app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
    const sealPath = sealView && sealView.file ? sealView.file.path : "";
    const sealRec = sealPath && this.settings.waxSealNotes ? this.settings.waxSealNotes[sealPath] : null;
    const sealInfo = sealRec ? this.getTimeCapsuleInfo(sealRec) : null;
    const sealSig = sealInfo
      ? sealPath + "|" + JSON.stringify(sealRec) + "|" + (sealInfo.ready ? "ready" : "locked") + "|" + (this.tempPeekNotes && this.tempPeekNotes[sealPath] ? "peek" : "")
      : "";
    const liveVeil = sealView ? sealView.containerEl.querySelector(".artcraft-wax-seal-veil") : null;
    if (!justSealed && sealSig && liveVeil && liveVeil.dataset.sealSig === sealSig) return;
    document.querySelectorAll(".artcraft-wax-seal-veil").forEach((el) => el.remove());
    if (this.waxSealTicker) {
      window.clearInterval(this.waxSealTicker);
      this.waxSealTicker = null;
    }
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view || !view.file) return;

    const fp = view.file.path;
    const seal = this.settings.waxSealNotes && this.settings.waxSealNotes[fp];
    if (!seal) return;
    if (this.tempPeekNotes && this.tempPeekNotes[fp]) return;

    const viewContent = view.containerEl.querySelector(".view-content");
    if (!viewContent) return;
    const loc = getLocale(this);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    const info = this.getTimeCapsuleInfo(seal);
    const fmtDate = (ms) => new Date(ms).toLocaleDateString(locTag, { day: "numeric", month: "short", year: "numeric" });
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    const singleWaxSealSvg = `
      <svg class="wax-seal-svg-single" viewBox="0 0 128 128" width="108" height="108" aria-hidden="true">
        <defs>
          <radialGradient id="acWax3D" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stop-color="#EF4444"/>
            <stop offset="48%" stop-color="#B91C1C"/>
            <stop offset="85%" stop-color="#7F1D1D"/>
            <stop offset="100%" stop-color="#450A0A"/>
          </radialGradient>
          <radialGradient id="acWaxInner" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stop-color="#991B1B"/>
            <stop offset="100%" stop-color="#5F1212"/>
          </radialGradient>
        </defs>
        <path d="M64 6 C78 7 86 4 95 13 C106 18 114 23 118 36 C124 47 121 58 123 68 C120 81 124 90 115 100 C108 110 100 116 87 119 C75 123 66 121 54 123 C41 120 31 122 21 112 C12 103 8 94 6 81 C4 69 7 59 5 47 C9 35 14 24 24 16 C35 9 49 5 64 6 Z" fill="url(#acWax3D)"/>
        <circle cx="64" cy="64" r="41" fill="url(#acWaxInner)" stroke="#FDE68A" stroke-width="1.6" stroke-opacity="0.55"/>
        <circle cx="64" cy="64" r="35" fill="none" stroke="#FCD34D" stroke-width="1.3" stroke-dasharray="3 2.5" opacity="0.88"/>
        <path d="M54 43H74M58 43V56L46 77C44.5 79.6 46.4 82.8 49.4 82.8H78.6C81.6 82.8 83.5 79.6 82 77L70 56V43" fill="none" stroke="#FDE68A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="64" cy="70" r="3.8" fill="#FDE68A"/>
        <ellipse cx="46" cy="32" rx="15" ry="6" fill="rgba(255,255,255,0.18)" transform="rotate(-26 46 32)"/>
        <path class="wax-crack-lines" d="M64 10 L61 44 L48 62 L66 76 L62 118 M24 54 L59 63 L98 48" fill="none" stroke="#FEF08A" stroke-width="2.5" stroke-linecap="round" opacity="0"/>
      </svg>`;

    const veil = document.createElement("div");
    veil.className = `artcraft-wax-seal-veil ${info.ready ? "is-ready" : "is-locked"} ${justSealed ? "is-just-sealed" : ""}`;
    veil.setAttribute("lang", locTag);
    const zeroRemain = { en: "00d 00h 00m", ru: "00д 00ч 00м", zh: "00天 00时 00分", ja: "00日 00時間 00分", es: "00d 00h 00m", de: "00T 00Std 00Min" };

    veil.innerHTML = `
      <div class="wax-envelope-stage">
        <div class="wax-envelope-card">
          <div class="wax-envelope-top-flap" aria-hidden="true"></div>
          <div class="wax-envelope-side-flaps" aria-hidden="true"></div>
          <div class="wax-envelope-postmark">
            <span class="wax-post-badge">${i18n({
              en: "ARCHIVAL POST · TIME CAPSULE",
              ru: "АРХИВНАЯ ПОЧТА · КАПСУЛА ВРЕМЕНИ",
              zh: "典藏邮政 · 时间胶囊",
              ja: "アーカイブ郵便 · タイムカプセル",
              es: "CORREO DE ARCHIVO · CÁPSULA DEL TIEMPO",
              de: "ARCHIVPOST · ZEITKAPSEL"
            }, this)}</span>
            <span class="wax-post-status ${info.ready ? "is-ready" : ""}">${
              info.ready
                ? i18n({ en: "READY TO OPEN", ru: "ГОТОВО К ВСКРЫТИЮ", zh: "可开启", ja: "開封可能", es: "LISTO", de: "BEREIT" }, this)
                : i18n({ en: "WAX SEALED", ru: "ЗАПЕЧАТАНО СУРГУЧОМ", zh: "火漆封存", ja: "封蝋封印中", es: "SELLADO", de: "VERSIEGELT" }, this)
            }</span>
          </div>

          <div class="wax-inner-letter-sheet">
            <div class="wax-letter-kicker">${esc(view.file.basename)}</div>
            <h3 class="wax-seal-title">${
              info.ready
                ? i18n({
                    en: "Your letter has arrived — break the wax seal",
                    ru: "Время пришло — сломайте сургучную печать на конверте",
                    zh: "信件已送达——请开启火漆印章",
                    ja: "手紙が届きました — 封蝋を割って開封してください",
                    es: "Tu carta ha llegado — rompe el sello de lacre",
                    de: "Dein Brief ist angekommen — brich das Wachssiegel"
                  }, this)
                : i18n({
                    en: "Sealed Archival Letter to Your Future Self",
                    ru: "Запечатанное письмо в конверте под сургучной печатью",
                    zh: "致未来自己的火漆封存信函",
                    ja: "未来の自分へ宛てた封蝋の手紙",
                    es: "Carta sellada en lacre para tu yo futuro",
                    de: "Versiegelter Brief an dein zukünftiges Ich"
                  }, this)
            }</h3>

            <div class="wax-seal-centerpiece">
              <button class="wax-seal-emblem" style="--hold:0" title="${
                info.ready
                  ? i18n({ en: "Click to break the wax seal", ru: "Нажмите, чтобы сломать печать и открыть конверт", zh: "点击破印开启信封", ja: "クリックして封蝋を割る", es: "Haz clic para abrir el sobre", de: "Klicken zum Öffnen des Umschlags" }, this)
                  : i18n({ en: "Hold for 1.5 s to open early", ru: "Удерживайте 1.5 сек (или нажмите «Вскрыть печать» ниже)", zh: "长按1.5秒提前开封", ja: "1.5秒長押しで早期開封", es: "Mantén 1.5s para abrir", de: "1.5s gedrückt halten zum Öffnen" }, this)
              }">
                <span class="wax-seal-hold-ring" aria-hidden="true"></span>
                ${singleWaxSealSvg}
              </button>
            </div>

            <div class="wax-seal-countdown">${
              info.ready ? (zeroRemain[loc] || "00d 00h 00m") : this.formatCapsuleRemaining(info.remainingMs, loc)
            }</div>
            <div class="wax-seal-wick" aria-hidden="true"><span style="width:${info.pct.toFixed(1)}%"></span></div>
            <div class="wax-seal-dates">
              <span>${i18n({ en: "Sealed", ru: "Отправлено", zh: "封存日", ja: "封印日", es: "Sellado", de: "Versiegelt" }, this)}: <strong>${fmtDate(info.sealedAtMs)}</strong></span>
              <span>${i18n({ en: "Delivery", ru: "Доставка", zh: "开启日", ja: "開封日", es: "Entrega", de: "Öffnung" }, this)}: <strong>${info.unlockAt ? fmtDate(info.unlockAt) : "—"}</strong></span>
            </div>

            ${
              info.message
                ? `<blockquote class="wax-seal-letter"><small>${i18n({
                    en: "QUESTION ON THE ENVELOPE",
                    ru: "ВОПРОС НА КОНВЕРТЕ · ПОСЛАНИЕ СЕБЕ",
                    zh: "信封上的追问",
                    ja: "封筒に記された問い",
                    es: "PREGUNTA EN EL SOBRE",
                    de: "FRAGE AUF DEM UMSCHLAG"
                  }, this)}</small>${esc(info.message)}</blockquote>`
                : ""
            }

            <div class="wax-envelope-actions">
              <button class="wax-env-btn is-peek" data-wax-act="peek">
                ${sicraftIcon('eye')}
                <span>${i18n({
                  en: "Peek at Note (Keep Timer)",
                  ru: "Приоткрыть заметку (сохранить печать)",
                  zh: "暂时查看笔记 (保留封印)",
                  ja: "ノートを一時表示 (封印を維持)",
                  es: "Ver nota temporalmente",
                  de: "Notiz kurz ansehen (Siegel behalten)"
                }, this)}</span>
              </button>
              <button class="wax-env-btn is-break" data-wax-act="break-now">
                ${sicraftIcon('unlock')}
                <span>${i18n({
                  en: "Break Wax Seal & Open Letter",
                  ru: "Вскрыть сургучную печать сейчас",
                  zh: "立即破印拆信",
                  ja: "今すぐ封蝋を割って開封",
                  es: "Romper sello y abrir sobre",
                  de: "Wachssiegel jetzt brechen & öffnen"
                }, this)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    veil.querySelector('[data-wax-act="peek"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!this.tempPeekNotes) this.tempPeekNotes = {};
      this.tempPeekNotes[fp] = true;
      this.playTactileMicroFeedback("tap");
      veil.classList.add("is-cracking");
      setTimeout(() => veil.remove(), 450);
    });

    veil.querySelector('[data-wax-act="break-now"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.breakTimeCapsule(fp, !info.ready);
    });

    const emblem = veil.querySelector(".wax-seal-emblem");
    if (info.ready) {
      emblem?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.breakTimeCapsule(fp, false);
      });
    } else if (emblem) {
      let raf = null;
      let start = 0;
      const HOLD_MS = 1500;
      const reset = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        emblem.style.setProperty("--hold", "0");
        emblem.classList.remove("is-holding");
      };
      const step = (ts) => {
        if (!start) start = ts;
        if (!emblem.isConnected) {
          raf = null; // the veil was removed while the seal was held: nothing to open
          return;
        }
        const p = Math.min(1, (ts - start) / HOLD_MS);
        emblem.style.setProperty("--hold", p.toFixed(3));
        if (p >= 1) {
          reset();
          this.breakTimeCapsule(fp, true);
          return;
        }
        raf = requestAnimationFrame(step);
      };
      emblem.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        start = 0;
        emblem.classList.add("is-holding");
        this.playTactileMicroFeedback("tap");
        raf = requestAnimationFrame(step);
      });
      emblem.addEventListener("pointerup", reset);
      emblem.addEventListener("pointerleave", reset);
      emblem.addEventListener("pointercancel", reset);
    }

    veil.dataset.sealSig = sealSig;
    viewContent.appendChild(veil);

    if (!info.ready) {
      this.waxSealTicker = window.setInterval(() => {
        const live = this.getTimeCapsuleInfo(seal);
        if (!live) return;
        if (live.ready) {
          this.renderNoteWaxSealOverlay();
          return;
        }
        const cd = veil.querySelector(".wax-seal-countdown");
        if (cd) cd.textContent = this.formatCapsuleRemaining(live.remainingMs, loc);
        const wick = veil.querySelector(".wax-seal-wick span");
        if (wick) wick.style.width = `${live.pct.toFixed(1)}%`;
      }, 30000);
      this.registerInterval(this.waxSealTicker);
    }
  }

  async announceReadyTimeCapsules() {
    const seals = this.settings.waxSealNotes || {};
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    let changed = false;
    for (const fp of Object.keys(seals)) {
      const seal = seals[fp];
      const info = this.getTimeCapsuleInfo(seal);
      if (!info || !info.ready || seal.announced) continue;
      const file = this.app.vault.getAbstractFileByPath(fp);
      if (!file) continue;
      const frag = document.createDocumentFragment();
      const txt = document.createElement("div");
      txt.textContent = isRu ? `Капсула времени созрела: «${file.basename}»` : `Time Capsule ready: “${file.basename}”`;
      const btn = document.createElement("button");
      btn.className = "mod-cta artcraft-notice-btn";
      btn.textContent = isRu ? "Открыть заметку" : "Open note";
      btn.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(file));
      frag.appendChild(txt);
      frag.appendChild(btn);
      new Notice(frag, 15000);
      seal.announced = true;
      changed = true;
    }
    if (changed) await this.saveSettings();
  }

  // --- INTERACTIVE TOUR NOTE (REAL VAULT FILE WITH LIVE EXAMPLES OF EVERY FEATURE) ---
  async offerInteractiveTourOnce() {
    if (this.settings.tourOffered) return;
    this.settings.tourOffered = true;
    await this.saveSettings();
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const frag = document.createDocumentFragment();
    const txt = document.createElement("div");
    txt.textContent = isRu
      ? "Alchemy Craft установлен. Откройте интерактивный тур — заметку с живыми примерами всех фишек."
      : "Alchemy Craft is installed. Open the Interactive Tour — a note with live examples of every feature.";
    const btn = document.createElement("button");
    btn.className = "mod-cta artcraft-notice-btn";
    btn.textContent = isRu ? "Открыть тур" : "Open tour";
    btn.addEventListener("click", () => this.openInteractiveTourNote());
    frag.appendChild(txt);
    frag.appendChild(btn);
    new Notice(frag, 20000);
  }

  async openInteractiveTourNote() {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const path = isRu ? "Alchemy Craft — Интерактивный тур.md" : "Alchemy Craft — Interactive Tour.md";
    let file = this.app.vault.getAbstractFileByPath(path);
    try {
      if (!file) {
        file = await this.app.vault.create(path, getAlchemyTourMarkdown(isRu, this.manifest.version));
      }
      await this.app.workspace.getLeaf(true).openFile(file);
    } catch (e) {
      console.error("Alchemy Craft: tour note error", e);
      new Notice(isRu ? "Не удалось создать заметку тура: " + e.message : "Could not create the tour note: " + e.message);
    }
  }

  // Speed-Reading Pacer removed per user feedback to keep Obsidian clean
  async toggleReadingPacer() {
    this.settings.readingPacer = false;
    this.updateReadingPacerState();
  }

  updateReadingPacerState() {
    if (this.pacerAnimFrame) {
      cancelAnimationFrame(this.pacerAnimFrame);
      this.pacerAnimFrame = null;
    }
    if (this.pacerBarEl) {
      this.pacerBarEl.remove();
      this.pacerBarEl = null;
    }
  }

  // --- NEW IDEA 3: EX-LIBRIS BOOK CARD PNG EXPORTER (ГЕНЕРАТОР КАРТОЧКИ ЭКСЛИБРИСА В PNG) ---
  // --- NEW IDEA 1: CHAPTER COMPLETION HARP & CELLO CHORD (АКУСТИЧЕСКИЙ АККОРД ЗАВЕРШЕНИЯ ГЛАВЫ) ---
  playChapterCompletionChord() {
    if (this.settings.chapterChord === false) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.keyAudioCtx) this.keyAudioCtx = new AudioCtx();
      const ctx = this.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = 0.16;
      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = "lowpass";
      bodyFilter.frequency.value = 1450;
      master.connect(bodyFilter);
      bodyFilter.connect(ctx.destination);

      // Warm Cello Bass Drone (C3 = 130.81 Hz) + Plucked Concert Harp Major-9th Arpeggio (C4, E4, G4, B4, D5)
      const notes = [
        { f: 130.81, delay: 0.0, dur: 2.2, type: "triangle", gain: 0.38 },
        { f: 261.63, delay: 0.06, dur: 1.6, type: "sine", gain: 0.28 },
        { f: 329.63, delay: 0.14, dur: 1.6, type: "sine", gain: 0.25 },
        { f: 392.00, delay: 0.22, dur: 1.7, type: "sine", gain: 0.24 },
        { f: 493.88, delay: 0.30, dur: 1.8, type: "sine", gain: 0.20 },
        { f: 587.33, delay: 0.38, dur: 2.1, type: "sine", gain: 0.22 }
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = n.type;
        osc.frequency.setValueAtTime(n.f, now + n.delay);
        g.gain.setValueAtTime(0.0001, now + n.delay);
        g.gain.linearRampToValueAtTime(n.gain, now + n.delay + 0.025);
        g.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.dur);
        osc.connect(g);
        g.connect(master);
        osc.start(now + n.delay);
        osc.stop(now + n.delay + n.dur + 0.05);
      });
    } catch (e) {}
  }

  // --- NEW IDEA 2: CHRONO-INK AGING & BOOKBINDER SPINE SELECTOR ---
  applyChronoInkToActiveNote() {
    if (this.settings.chronoInkAging === false) {
      document.body.removeAttribute("data-chrono-age");
      return;
    }
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view || !view.file || !view.file.stat) return;
    const ageDays = Math.max(0, (Date.now() - (view.file.stat.mtime || Date.now())) / 86400000);
    if (ageDays > 14) {
      document.body.setAttribute("data-chrono-age", "archival");
    } else if (ageDays < 1) {
      document.body.setAttribute("data-chrono-age", "fresh");
    } else {
      document.body.setAttribute("data-chrono-age", "seasoned");
    }
  }

  exportExLibrisBookCardPNG() {
    try {
      const obsidian = require("obsidian");
      const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      const isRu = (this.settings.uiLanguage || "en") === "ru";
      const file = view && view.file ? view.file : null;
      const fp = file ? file.path : "";
      const title = file ? file.basename : "Alchemy Craft — Knowledge Folio";
      const folder = fp.includes("/") ? fp.split("/")[0] : "VAULT FOLIO";
      const stampRec = fp ? this.getNoteStampRecord(fp) : null;
      const bookmarks = (fp && this.settings.marginBookmarks && this.settings.marginBookmarks[fp]) || [];

      const cv = document.createElement("canvas");
      cv.width = 1200;
      cv.height = 675;
      const ctx = cv.getContext("2d");

      // 1. Warm Desk Linen Backdrop
      ctx.fillStyle = "#E6E1D5";
      ctx.fillRect(0, 0, 1200, 675);

      // 2. 4 Stacked Book Sheets Shadow on Right & Bottom
      const bx = 70, by = 52, bw = 1040, bh = 555;
      const sheets = [
        { dx: 18, dy: 15, fill: "#DFD9CA", stroke: "#B8B0A0" },
        { dx: 12, dy: 10, fill: "#E8E3D7", stroke: "#C5BEB0" },
        { dx: 6, dy: 5, fill: "#F2EFE6", stroke: "#D4CFC2" },
        { dx: 0, dy: 0, fill: "#FAF8F3", stroke: "#D8D2C5" }
      ];
      sheets.forEach((sh) => {
        ctx.fillStyle = sh.fill;
        ctx.strokeStyle = sh.stroke;
        ctx.lineWidth = 2;
        ctx.fillRect(bx + sh.dx, by + sh.dy, bw, bh);
        ctx.strokeRect(bx + sh.dx, by + sh.dy, bw, bh);
      });

      // 3. Leather Book Spine on Left
      ctx.fillStyle = "#8C5828";
      ctx.fillRect(bx, by, 14, bh);

      // 4. Header Pill & Stamp
      ctx.fillStyle = "#18181B";
      ctx.fillRect(bx + 46, by + 38, 340, 32);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = '800 13px "JetBrains Mono", monospace';
      ctx.fillText(`EX-LIBRIS // ${folder.toUpperCase().slice(0, 22)}`, bx + 62, by + 59);

      // Stamp Box in Top-Right (reflects actual stamp state of the note)
      const stampTxt = stampRec && stampRec.count >= 2
        ? `★ CLASSICS #${stampRec.count} • ${stampRec.dates[stampRec.dates.length - 1]}`
        : stampRec
        ? `✓ APPROVED • ${stampRec.dates[stampRec.dates.length - 1]}`
        : `FOLIO • ${new Date().toLocaleDateString()}`;
      ctx.fillStyle = stampRec && stampRec.count >= 2 ? "#FEF3C7" : "#DCFCE7";
      ctx.strokeStyle = stampRec && stampRec.count >= 2 ? "#D97706" : "#16A34A";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.fillRect(bx + bw - 310, by + 36, 270, 36);
      ctx.strokeRect(bx + bw - 310, by + 36, 270, 36);
      ctx.setLineDash([]);
      ctx.fillStyle = stampRec && stampRec.count >= 2 ? "#92400E" : "#15803D";
      ctx.font = '800 13px "JetBrains Mono", monospace';
      ctx.fillText(stampTxt, bx + bw - 294, by + 59);

      // 5. Book Title
      ctx.fillStyle = "#18181B";
      ctx.font = '900 34px "Inter", sans-serif';
      ctx.fillText(title.slice(0, 44), bx + 46, by + 124);

      // Divider
      ctx.strokeStyle = "#E5E0D5";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx + 46, by + 148);
      ctx.lineTo(bx + bw - 40, by + 148);
      ctx.stroke();

      // 6. Render up to 4 Nutrient Stickers (or real extracted thesis lines from the note if no stickers yet)
      let displayBms = bookmarks.slice(0, 4);
      if (displayBms.length === 0) {
        const rawNote = view && view.editor ? view.editor.getValue() : (view && view.data ? view.data : "");
        const parsed = this.analyzeNoteDualCognition(rawNote, title, fp);
        displayBms = (parsed.thesisList || []).slice(0, 3).map((line, i) => ({
          type: i === 0 ? "proteins" : i === 1 ? "carbs" : "vitamins",
          label: i === 0 ? (isRu ? "Тезис 01" : "Thesis 01") : i === 1 ? (isRu ? "Тезис 02" : "Thesis 02") : (isRu ? "Тезис 03" : "Thesis 03"),
          meaning: line,
          snippet: title
        }));
      }

      let curY = by + 178;
      displayBms.forEach((bm) => {
        const nObj = BOOK_NUTRIENTS[bm.type] || BOOK_NUTRIENTS.proteins;
        ctx.fillStyle = nObj.bg;
        ctx.strokeStyle = nObj.border;
        ctx.lineWidth = 1.5;
        ctx.fillRect(bx + 46, curY, bw - 88, 72);
        ctx.strokeRect(bx + 46, curY, bw - 88, 72);

        ctx.fillStyle = nObj.color;
        ctx.fillRect(bx + 46, curY, 7, 72);

        ctx.font = '800 13px "JetBrains Mono", monospace';
        ctx.fillStyle = nObj.color;
        ctx.fillText((isRu ? nObj.ruName : nObj.enName).toUpperCase(), bx + 68, curY + 26);

        ctx.font = '700 17px "Inter", sans-serif';
        ctx.fillStyle = "#1F2937";
        const mText = String(bm.meaning || bm.snippet || "").replace(/\[([^\]]+)\]\([^\)]*\)/g, "$1").slice(0, 68);
        ctx.fillText(mText, bx + 68, curY + 52);

        curY += 86;
      });

      // 7. Footer Signature
      ctx.fillStyle = "#78716C";
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`ALCHEMY CRAFT v${this.manifest.version} // 5-NUTRIENT BOOK FOLIO SYSTEM • @StratAlchemy`, bx + 46, by + bh - 24);

      const url = cv.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ex-libris-${title.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").slice(0, 28)}.png`;
      a.click();
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 50);
      new Notice(isRu ? "Карточка Экслибриса сохранена в PNG!" : "Ex-Libris Book Card exported as PNG!");
    } catch (e) {
      new Notice("Could not export Ex-Libris PNG.");
    }
  }

  async openTrueTwoPageBookSpread() {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view || !view.file) {
      new Notice("Please open a note first to launch 2-Page Side-by-Side spread.");
      return;
    }
    const isRu = (this.settings.uiLanguage || "en") === "ru";

    this.settings.bookSpreadMode = true;
    await this.saveSettings();
    this.applyBodyClasses();

    try {
      let rightLeaf;
      if (typeof this.app.workspace.duplicateLeaf === "function" && this.app.workspace.activeLeaf) {
        rightLeaf = await this.app.workspace.duplicateLeaf(this.app.workspace.activeLeaf, "vertical");
      } else {
        rightLeaf = this.app.workspace.getLeaf("split", "vertical");
        await rightLeaf.openFile(view.file);
      }
      setTimeout(() => {
        if (rightLeaf && rightLeaf.view && rightLeaf.view.editor) {
          const totalLines = rightLeaf.view.editor.lineCount();
          const targetLine = Math.min(totalLines - 1, 28);
          rightLeaf.view.editor.scrollIntoView({ from: { line: targetLine, ch: 0 }, to: { line: Math.min(totalLines - 1, targetLine + 15), ch: 0 } }, true);
        }
        this.updateTaskProgressBar();
      }, 180);
      new Notice(
        isRu
          ? "Открыт настоящий 2-страничный книжный разворот (левая и правая страницы книги)!"
          : "Opened True 2-Page Side-by-Side Book Spread!"
      );
    } catch (e) {
      console.warn("2-Page spread split fallback:", e);
      new Notice(isRu ? "Включён книжный режим страницы" : "Book Folio Mode Enabled");
    }
  }

  togglePomodoroPopover(anchorBtn) {
    if (this.pomoPopoverEl) {
      this.closeAllDockPopovers();
      return;
    }
    this.closeAllDockPopovers("pomo");

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-pomodoro-popover";
    pop.addEventListener("pointerdown", (e) => e.stopPropagation());
    pop.addEventListener("click", (e) => e.stopPropagation());
    this.pomoPopoverEl = pop;

    const renderPomoContent = () => {
      const isRunning = this.timerRunning;
      const isBreak = this.timerState === "break";
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      const curPreset = this.settings.pomodoroMinutes || 25;

      pop.innerHTML = `
        <div class="pomo-pop-head">
          <div class="pomo-pop-time-wrap">
            <span class="pomo-pop-big-digits">${timeStr}</span>
            <span class="pomo-pop-status-badge ${isBreak ? "is-break" : ""}">${isBreak ? (isRu ? "Перерыв" : "Break") : (isRu ? "Фокус" : "Focus")}</span>
          </div>
          <div class="pomo-pop-actions">
            <button class="pomo-pop-btn" id="pomo-toggle-btn">
              ${isRunning ? (isRu ? "Пауза" : "Pause") : (isRu ? "Старт" : "Start")}
            </button>
            <button class="pomo-pop-btn is-secondary" id="pomo-reset-btn" title="${isRu ? "Сбросить таймер" : "Reset timer"}">
              ↺
            </button>
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Длительность спринта" : "Sprint Duration"}</div>
        <div class="pomo-pop-chips-grid">
          ${[15, 25, 45, 60, 90].map(m => `
            <div class="pomo-pop-chip ${!isBreak && curPreset === m ? "is-active" : ""}" data-pomo-min="${m}">
              ${m} ${isRu ? "мин" : "min"}
            </div>
          `).join("")}
          <div class="pomo-pop-chip ${this.settings.timerMode === "stopwatch" ? "is-active" : ""}" data-pomo-act="stopwatch">
            ${isRu ? "Секундомер" : "Stopwatch"}
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Перерыв" : "Rest & Break"}</div>
        <div class="pomo-pop-chips-grid">
          <div class="pomo-pop-chip ${isBreak && this.timerSeconds <= 300 ? "is-active" : ""}" data-break-min="5">
            5 ${isRu ? "мин" : "min"}
          </div>
          <div class="pomo-pop-chip ${isBreak && this.timerSeconds > 300 ? "is-active" : ""}" data-break-min="15">
            15 ${isRu ? "мин" : "min"}
          </div>
          <div class="pomo-pop-chip" data-pomo-act="custom">
            ${isRu ? "Своё..." : "Custom..."}
          </div>
        </div>

        <div class="pomo-pop-section-title">${isRu ? "Фоновый звук" : "Ambient Audio"}</div>
        <div class="pomo-pop-chips-grid">
          ${[
            { id: "off", ru: "Выкл", en: "Off" },
            { id: "rain", ru: "Дождь", en: "Rain" },
            { id: "brown", ru: "Шум", en: "Brown" },
            { id: "gamma40", ru: "40 Гц", en: "40 Hz" },
            { id: "ocean", ru: "Прибой", en: "Ocean" },
            { id: "fire", ru: "Камин", en: "Fire" }
          ].map(s => `
            <div class="pomo-pop-chip ${(this.settings.ambientSound || "off") === s.id ? "is-active" : ""}" data-snd-id="${s.id}">
              ${isRu ? s.ru : s.en}
            </div>
          `).join("")}
        </div>
      `;

      pop.querySelector("#pomo-toggle-btn")?.addEventListener("click", () => {
        this.toggleTimer();
        renderPomoContent();
      });

      pop.querySelector("#pomo-reset-btn")?.addEventListener("click", () => {
        this.resetTimer();
        renderPomoContent();
      });

      pop.querySelectorAll("[data-pomo-min]").forEach(el => {
        el.addEventListener("click", async () => {
          const m = parseInt(el.getAttribute("data-pomo-min"), 10);
          this.setPomodoroDuration(m);
          this.startTimer();
          renderPomoContent();
        });
      });

      pop.querySelectorAll("[data-break-min]").forEach(el => {
        el.addEventListener("click", async () => {
          const m = parseInt(el.getAttribute("data-break-min"), 10);
          this.startBreak(m);
          renderPomoContent();
        });
      });

      pop.querySelectorAll("[data-snd-id]").forEach(el => {
        el.addEventListener("click", async () => {
          const sid = el.getAttribute("data-snd-id");
          await this.setAmbientSound(sid);
          renderPomoContent();
        });
      });

      pop.querySelector('[data-pomo-act="stopwatch"]')?.addEventListener("click", async () => {
        this.settings.timerMode = "stopwatch";
        await this.saveSettings();
        this.resetTimer();
        renderPomoContent();
      });

      pop.querySelector('[data-pomo-act="custom"]')?.addEventListener("click", () => {
        new CustomPomodoroModal(this.app, this, this.settings.pomodoroMinutes || 25, (mins) => {
          this.setPomodoroDuration(mins);
          this.startTimer();
          renderPomoContent();
        }).open();
      });
    };

    renderPomoContent();
    document.body.appendChild(pop);
    this.positionDockPopover(pop, anchorBtn, 320);

    const closeHandler = (e) => {
      if (!e.target || !e.target.isConnected) return;
      if (e.target.closest && e.target.closest(".modal-container, .modal, .menu, .notice-container")) return;
      if (this.pomoPopoverEl && !this.pomoPopoverEl.contains(e.target) && (!anchorBtn || !anchorBtn.contains(e.target))) {
        this.closeAllDockPopovers();
      }
    };
    this.pomoPopoverCloseHandler = closeHandler;
    setTimeout(() => {
      if (this.pomoPopoverCloseHandler === closeHandler) {
        document.addEventListener("pointerdown", closeHandler);
      }
    }, 40);
  }

  toggleFocusSubmenuPopover(anchorBtn) {
    if (this.focusPopoverEl) {
      this.closeAllDockPopovers();
      return;
    }
    this.closeAllDockPopovers("focus");

    if (!this._activeFocusTab) this._activeFocusTab = "canvas";

    const loc = getLocale(this);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const pop = document.createElement("div");
    pop.className = "artcraft-focus-popover";
    pop.setAttribute("lang", LOCALE_TAGS[loc] || "en-US");
    pop.addEventListener("pointerdown", (e) => e.stopPropagation());
    pop.addEventListener("click", (e) => e.stopPropagation());

    const renderPopoverContent = () => {
      const obsidian = require("obsidian");
      const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      const fp = activeView && activeView.file ? activeView.file.path : "";
      const isStamped = fp ? !!this.getNoteStampRecord(fp) : false;
      const isRulerOn = !!(this.settings.magicLamp && this.settings.lampShape === "ruler");
      const showMeta = this.settings.showReadingStats !== false;
      const curSurface = this.settings.surfaceMode || "white";
      const curWidth = this.settings.pageWidthMode || "book";
      const curSpine = this.settings.spineMaterial || "cognac";
      const curTab = this._activeFocusTab || "canvas";

      // 1. Canvas options
      const canvasItems = [
        {
          id: "cards",
          checked: this.settings.pageCards === true,
          icon: SICRAFT_SVGS.bolt,
          title: isRu ? "Декоративные карточки заголовков" : "Decorated Heading Cards",
          sub: isRu ? "Элегантное модульное оформление H1–H4 с мягкими акцентами" : "Refined Swiss Craft heading cards with subtle accents"
        },
        {
          id: "bookfolio",
          checked: !!this.settings.bookSpreadMode,
          icon: SICRAFT_SVGS.columns,
          title: isRu ? "Книжный разворот и страницы" : "Book Folio & Page Spread",
          sub: isRu ? "Тактильный кожаный корешок и эффект сложенных страниц" : "Tactile leather spine and stacked sheets effect"
        },
        {
          id: "kin",
          checked: this.settings.windChainFooter !== false,
          icon: SICRAFT_SVGS.bolt,
          title: isRu ? "Связанные заметки на нитях" : "Related Notes on Threads",
          sub: isRu ? "Парящие карточки под заметкой с физикой ветра" : "Wind-tethered floating note cards under active note"
        },
        {
          id: "editorial",
          checked: this.settings.editorialCleanMode !== false,
          icon: SICRAFT_SVGS.book,
          title: isRu ? "Воздушные отступы блоков" : "Editorial Air & Spacing",
          sub: isRu ? "Просторная швейцарская типографика без сплошного текста" : "Generous typography spacing without walls of text"
        }
      ];

      // 2. Focus options
      const focusItems = [
        {
          id: "sentence",
          checked: !!this.settings.sentenceFocus,
          icon: SICRAFT_SVGS.focus,
          title: isRu ? "Фокус на предложении" : "Sentence Focus & Steps",
          sub: isRu ? "Мягкая подсветка активного предложения при чтении" : "Highlight active clicked sentence while reading"
        },
        {
          id: "ruler",
          checked: isRulerOn,
          icon: SICRAFT_SVGS.lamp,
          title: isRu ? "Линейка для чтения" : "Reading Ruler Beam",
          sub: isRu ? "Горизонтальный луч мягкого света вдоль строки курсора" : "Horizontal warm reading beam across active line"
        },
        {
          id: "spotlight",
          checked: !!this.settings.spotlightFocus,
          icon: SICRAFT_SVGS.zen,
          title: isRu ? "Затемнение соседних абзацев" : "Spotlight Paragraph Dimmer",
          sub: isRu ? "Мягкое приглушение всего текста, кроме текущего" : "Dims surrounding paragraphs to reduce visual noise"
        },
        {
          id: "breathspine",
          checked: !!this.settings.breathingSpine,
          icon: SICRAFT_SVGS.lung,
          title: isRu ? "Дыхание корешка (6 BPM)" : "Breathing Book Spine",
          sub: isRu ? "Световой ритм 5.5 сек вдох / 5.5 сек выдох для спокойствия" : "Coherent 5.5s inhale / 5.5s exhale glow along spine"
        },
        {
          id: "meta",
          checked: showMeta,
          icon: SICRAFT_SVGS.book,
          title: isRu ? "Время чтения и задачи" : "Reading Time & Tasks",
          sub: isRu ? "Строка прогресса задач и хронометраж под заголовком" : "Show reading time estimate and task progress bar"
        },
        {
          id: "keymark",
          checked: this.settings.keySentenceMarker !== false,
          icon: SICRAFT_SVGS.bolt,
          title: isRu ? "Маркер ключевой мысли" : "Key Sentence Marker",
          sub: isRu ? "Подчёркивает предложения, несущие главный смысл" : "Underlines sentences that carry the core thesis"
        },
        {
          id: "bionic",
          checked: !!this.settings.bionicAnchors,
          icon: SICRAFT_SVGS.bolt,
          title: isRu ? "Фокус начала слов" : "Bionic Word-Root Anchors",
          sub: isRu ? "Опорные точки начала слов для беглого чтения" : "Highlights word beginnings for rapid eye gliding"
        },
        {
          id: "stamp",
          checked: this.settings.showCornerStamp !== false,
          icon: SICRAFT_SVGS.stamp,
          title: isRu ? "Печать Экслибрис" : "Ex-Libris Corner Stamp",
          sub: isStamped ? (isRu ? "Штамп проставлен на этой заметке" : "Note is stamped") : (isRu ? "Штамп в правом верхнем углу заметки" : "Stamp in upper right corner")
        }
      ];

      // 3. Tools actions
      const toolActions = [
        { act: "add-sticker", icon: "bookmark", title: isRu ? "Прикрепить закладку" : "Attach Bookmark" },
        { act: "digest", icon: "book", title: isRu ? "Дайджест книги" : "Book Digest" },
        { act: "bookshelf", icon: "shelf", title: isRu ? "Книжная полка" : "Classics Bookshelf" },
        { act: "exlibris-png", icon: "camera", title: isRu ? "Экспорт Экслибриса (PNG)" : "Export Ex-Libris PNG" },
        { act: "wax-seal", icon: "stamp", title: isRu ? "Капсула времени (Сургуч)" : "Time Capsule Seal" },
        { act: "two-page", icon: "columns", title: isRu ? "Разворот на 2 страницы" : "2-Page Side-by-Side" },
        { act: "quest-chain", icon: "chain", title: isRu ? "Журнал задач и целей" : "Task & Quest Journal" },
        { act: "bio-flow", icon: "pulse", title: isRu ? "Готовность к фокусу" : "Focus Readiness" },
        { act: "sketchpad", icon: "palette", title: isRu ? "Рисование на полях" : "Margin Sketchpad" },
        { act: "creator-os", icon: "bolt", title: isRu ? "Creator Studio & Канбан" : "Creator Studio & Kanban" },
        { act: "autopilot-bell", icon: "timer", title: isRu ? "Напоминание о фокусе" : "Mindful Check-In" },
        { act: "pro-test-drive", icon: "diamond", title: isRu ? "Тест-Драйв Pro (60 сек)" : "Pro Test-Drive (60s)" }
      ];

      let tabBodyHtml = "";

      if (curTab === "canvas") {
        tabBodyHtml = `
          <div class="focus-pop-divider">${isRu ? "ФОН СТРАНИЦЫ" : "PAGE SURFACE"}</div>
          <div class="artcraft-surface-picker-row">
            <button class="surface-mat-chip ${curSurface === "white" ? "is-active" : ""}" data-surface="white">
              <span class="surface-swatch" style="background:#FFFFFF;border:1px solid #CBD5E1"></span><span>${isRu ? "Чистый Белый" : "Pure White"}</span>
            </button>
            <button class="surface-mat-chip ${curSurface === "book" ? "is-active" : ""}" data-surface="book">
              <span class="surface-swatch" style="background:#FAF8F3;border:1px solid #DFD9CA"></span><span>${isRu ? "Книжный" : "Warm Book"}</span>
            </button>
            <button class="surface-mat-chip ${curSurface === "grain" ? "is-active" : ""}" data-surface="grain">
              <span class="surface-swatch" style="background:#F5F2EB;border:1px solid #D5CEBE"></span><span>${isRu ? "Зернистый" : "Archival Grain"}</span>
            </button>
          </div>

          <div class="focus-pop-divider">${isRu ? "ШИРИНА ХОЛСТА" : "CANVAS WIDTH"}</div>
          <div class="artcraft-width-picker-row">
            <button class="width-mat-chip ${curWidth === "book" ? "is-active" : ""}" data-width-mode="book">
              <span>760px ${isRu ? "Книга" : "Book"}</span>
            </button>
            <button class="width-mat-chip ${curWidth === "wide" ? "is-active" : ""}" data-width-mode="wide">
              <span>1080px ${isRu ? "Широкий" : "Wide"}</span>
            </button>
            <button class="width-mat-chip ${curWidth === "full" ? "is-active" : ""}" data-width-mode="full">
              <span>${isRu ? "Полный холст" : "Full Canvas"}</span>
            </button>
          </div>

          <div class="focus-pop-divider">${isRu ? "МАТЕРИАЛ КОРЕШКА" : "SPINE MATERIAL"}</div>
          <div class="artcraft-spine-picker-row">
            <button class="spine-mat-chip ${curSpine === "cognac" ? "is-active" : ""}" data-spine="cognac">
              <span class="spine-swatch" style="background:#8C5828"></span><span>${isRu ? "Коньяк" : "Cognac"}</span>
            </button>
            <button class="spine-mat-chip ${curSpine === "emerald" ? "is-active" : ""}" data-spine="emerald">
              <span class="spine-swatch" style="background:#14532D"></span><span>${isRu ? "Сафьян" : "Emerald"}</span>
            </button>
            <button class="spine-mat-chip ${curSpine === "crimson" ? "is-active" : ""}" data-spine="crimson">
              <span class="spine-swatch" style="background:#7F1D1D"></span><span>${isRu ? "Бархат" : "Crimson"}</span>
            </button>
            <button class="spine-mat-chip ${curSpine === "linen" ? "is-active" : ""}" data-spine="linen">
              <span class="spine-swatch" style="background:#334155"></span><span>${isRu ? "Лён" : "Linen"}</span>
            </button>
          </div>

          <div class="focus-pop-divider">${isRu ? "ОФОРМЛЕНИЕ СТРАНИЦЫ" : "PAGE LAYERS"}</div>
          <div class="focus-pop-list">
            ${canvasItems.map(it => `
              <label class="focus-pop-row ${it.checked ? "is-checked" : ""}" data-focus-opt="${it.id}">
                <span class="focus-pop-checkbox">${it.checked ? "✓" : ""}</span>
                <span class="focus-pop-icon">${it.icon}</span>
                <span class="focus-pop-txt">
                  <strong>${it.title}</strong>
                  <small>${it.sub}</small>
                </span>
              </label>
              ${it.id === "keymark" && it.checked ? `
                <div class="artcraft-marker-colors-row">
                  ${[
                    { id: "lime", color: "#84CC16", label: isRu ? "Лайм" : "Lime" },
                    { id: "amber", color: "#F59E0B", label: isRu ? "Янтарь" : "Amber" },
                    { id: "rose", color: "#F43F5E", label: isRu ? "Коралл" : "Rose" },
                    { id: "sky", color: "#0EA5E9", label: isRu ? "Небо" : "Sky" },
                    { id: "lavender", color: "#A855F7", label: isRu ? "Лаванда" : "Lavender" }
                  ].map(c => `
                    <span class="artcraft-marker-color-dot ${(this.settings.keyMarkerColor || "lime") === c.id ? "is-active" : ""}" data-marker-color="${c.id}" style="background-color: ${c.color}" title="${c.label}"></span>
                  `).join("")}
                </div>
              ` : ""}
            `).join("")}
          </div>
        `;
      } else if (curTab === "focus") {
        tabBodyHtml = `
          <div class="focus-pop-list">
            ${focusItems.map(it => `
              <label class="focus-pop-row ${it.checked ? "is-checked" : ""}" data-focus-opt="${it.id}">
                <span class="focus-pop-checkbox">${it.checked ? "✓" : ""}</span>
                <span class="focus-pop-icon">${it.icon}</span>
                <span class="focus-pop-txt">
                  <strong>${it.title}</strong>
                  <small>${it.sub}</small>
                </span>
              </label>
            `).join("")}
          </div>
        `;
      } else {
        // tools tab
        tabBodyHtml = `
          <div class="focus-pop-tools-grid">
            ${toolActions.map(it => `
              <button class="focus-pop-act-btn" data-pop-act="${it.act}">
                ${sicraftIcon(it.icon)} <span>${it.title}</span>
              </button>
            `).join("")}
          </div>
        `;
      }

      pop.innerHTML = `
        <div class="focus-pop-head">
          <span class="focus-pop-badge">${sicraftIcon('focus')} <span>${isRu ? "СТУДИЯ ЧТЕНИЯ И ФОКУСА" : "READING & FOCUS STUDIO"}</span></span>
          <button class="focus-pop-close" title="Close">×</button>
        </div>

        <div class="focus-pop-tabs">
          <button class="focus-tab-btn ${curTab === "canvas" ? "is-active" : ""}" data-tab="canvas">
            <span>📖</span> <span>${isRu ? "Холст" : "Canvas"}</span>
          </button>
          <button class="focus-tab-btn ${curTab === "focus" ? "is-active" : ""}" data-tab="focus">
            <span>🎯</span> <span>${isRu ? "Фокус" : "Focus"}</span>
          </button>
          <button class="focus-tab-btn ${curTab === "tools" ? "is-active" : ""}" data-tab="tools">
            <span>🛠️</span> <span>${isRu ? "Инструменты" : "Tools"}</span>
          </button>
        </div>

        <div class="focus-pop-body">
          ${tabBodyHtml}
        </div>
      `;

      // Handlers for tabs
      pop.querySelectorAll(".focus-tab-btn").forEach(btn => {
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          this._activeFocusTab = btn.getAttribute("data-tab") || "canvas";
          this.playTactileMicroFeedback("tap");
          renderPopoverContent();
        });
      });

      // Handlers for chips
      pop.querySelectorAll(".surface-mat-chip").forEach((chip) => {
        chip.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.surfaceMode = chip.getAttribute("data-surface") || "white";
          await this.saveSettings();
          this.applyBodyClasses();
          this.playTactileMicroFeedback("tap");
          renderPopoverContent();
        });
      });

      pop.querySelectorAll(".width-mat-chip").forEach((chip) => {
        chip.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.pageWidthMode = chip.getAttribute("data-width-mode") || "book";
          await this.saveSettings();
          this.applyBodyClasses();
          this.updateTaskProgressBar();
          this.playTactileMicroFeedback("tap");
          renderPopoverContent();
        });
      });

      pop.querySelectorAll(".artcraft-marker-color-dot").forEach((dot) => {
        dot.addEventListener("click", async (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          this.settings.keyMarkerColor = dot.getAttribute("data-marker-color") || "lime";
          await this.saveSettings();
          this.applyBodyClasses();
          this.playTactileMicroFeedback("tap");
          renderPopoverContent();
        });
      });

      pop.querySelectorAll(".spine-mat-chip").forEach((chip) => {
        chip.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          this.settings.spineMaterial = chip.getAttribute("data-spine") || "cognac";
          this.settings.bookSpreadMode = true;
          await this.saveSettings();
          this.applyBodyClasses();
          renderPopoverContent();
        });
      });

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
          if (opt === "editorial") {
            this.settings.editorialCleanMode = this.settings.editorialCleanMode === false;
          } else if (opt === "sentence") {
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
          } else if (opt === "breathspine") {
            this.settings.breathingSpine = !this.settings.breathingSpine;
          } else if (opt === "meta") {
            const curState = this.settings.showReadingStats !== false;
            this.settings.showReadingStats = !curState;
            this.settings.showTaskProgress = !curState;
            this.updateTaskProgressBar();
          } else if (opt === "cards") {
            this.settings.pageCards = this.settings.pageCards !== true;
          } else if (opt === "kin") {
            this.settings.windChainFooter = this.settings.windChainFooter === false;
            setTimeout(() => this.updateTaskProgressBar(), 0);
          } else if (opt === "keymark") {
            this.settings.keySentenceMarker = this.settings.keySentenceMarker === false;
            this.rerenderReadingViews();
          } else if (opt === "bionic") {
            this.settings.bionicAnchors = !this.settings.bionicAnchors;
            this.refreshBionicAnchorsInDOM();
          } else if (opt === "stamp") {
            this.settings.showCornerStamp = this.settings.showCornerStamp === false;
            this.updateTaskProgressBar();
          }
          await this.saveSettings();
          this.applyBodyClasses();
          renderPopoverContent();
        });
      });

      pop.querySelectorAll("[data-pop-act]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const act = btn.getAttribute("data-pop-act");
          this.playTactileMicroFeedback("tap");
          if (act === "add-sticker") {
            this.addMarginBookmarkToActiveNote();
          } else if (act === "digest") {
            this.openBookNutrientDigestModal();
          } else if (act === "bookshelf") {
            this.openClassicsBookshelfModal();
          } else if (act === "exlibris-png") {
            this.exportExLibrisBookCardPNG();
          } else if (act === "wax-seal") {
            if (activeView && activeView.file) {
              new TimeCapsuleSealModal(this.app, this, activeView.file).open();
            }
          } else if (act === "tour") {
            this.openInteractiveTourNote();
          } else if (act === "quest-chain") {
            this.openQuestChainModal();
          } else if (act === "bio-flow") {
            this.openBioFlowModal();
          } else if (act === "sketchpad") {
            this.openCreativeSketchModal();
          } else if (act === "creator-os") {
            this.openCreatorOsModal();
          } else if (act === "autopilot-bell") {
            this.openAutopilotInterruptModal();
          } else if (act === "pro-test-drive") {
            this.startProTestDrive60s();
          } else if (act === "two-page") {
            this.openTrueTwoPageBookSpread();
          }
          // Keep the Tools popover open so the user can select or toggle multiple tools without reopening Focus -> Tools
          renderPopoverContent();
        });
      });
    };

    renderPopoverContent();
    document.body.appendChild(pop);
    this.focusPopoverEl = pop;
    this.positionDockPopover(pop, anchorBtn, 380);

    const closeHandler = (ev) => {
      if (!ev.target || !ev.target.isConnected) return;
      if (ev.target.closest && ev.target.closest(".modal-container, .modal, .menu, .notice-container")) return;
      if (!pop.contains(ev.target) && ev.target !== anchorBtn && (!anchorBtn || !anchorBtn.contains(ev.target))) {
        this.closeAllDockPopovers();
      }
    };
    this.focusPopoverCloseHandler = closeHandler;
    setTimeout(() => {
      if (this.focusPopoverCloseHandler === closeHandler) document.addEventListener("pointerdown", closeHandler);
    }, 40);
  }

  jumpToMarginBookmark(lineNum, snippetText, bookmark) {
    const obsidian = require("obsidian");
    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view) return -1;
    const text = view.editor ? view.editor.getValue() : view.data || "";
    const lines = text.split("\n");
    const saved = Math.max(0, Math.min(lines.length - 1, Number(lineNum) || 0));
    const needle = String(snippetText || "").replace(/…$/, "").replace(/\s+/g, " ").trim();
    let target = saved;
    if (needle) {
      const flat = lines.map((l) => l.replace(/\s+/g, " "));
      for (const size of [48, 24, 12]) {
        if (needle.length < Math.min(size, 6)) continue;
        const probe = needle.slice(0, size);
        let best = -1;
        for (let i = 0; i < flat.length; i++) {
          if (flat[i].includes(probe) && (best === -1 || Math.abs(i - saved) < Math.abs(best - saved))) best = i;
        }
        if (best !== -1) {
          target = best;
          break;
        }
      }
    }
    if (bookmark && typeof bookmark === "object" && bookmark.line !== target) {
      bookmark.line = target;
      this.saveSettings();
    }

    const reading = typeof view.getMode === "function" && view.getMode() === "preview";
    if (reading) {
      if (view.previewMode && typeof view.previewMode.applyScroll === "function") view.previewMode.applyScroll(target);
    } else if (view.editor) {
      view.editor.setCursor({ line: target, ch: 0 });
      view.editor.scrollIntoView({ from: { line: Math.max(0, target - 2), ch: 0 }, to: { line: target + 2, ch: 0 } }, true);
    }

    // Flash the block once it is on screen. Only the visible half of the view is searched: the other
    // half (the hidden editor in reading view and the other way round) holds the same text.
    const probe = needle.slice(0, 24);
    if (probe) {
      setTimeout(() => {
        const root = view.contentEl.querySelector(reading ? ".markdown-reading-view" : ".markdown-source-view");
        if (!root) return;
        const blocks = root.querySelectorAll(".cm-line, p, h1, h2, h3, h4, li, blockquote");
        for (const b of blocks) {
          if (b.textContent && b.textContent.replace(/\s+/g, " ").includes(probe)) {
            if (reading) b.scrollIntoView({ behavior: "smooth", block: "center" });
            b.classList.add("artcraft-bm-flash-highlight");
            setTimeout(() => b.classList.remove("artcraft-bm-flash-highlight"), 1600);
            break;
          }
        }
      }, 260);
    }
    return target;
  }

  // Removes invisible characters that pasted text sometimes carries: zero-width spaces, word joiners,
  // soft hyphens and byte-order marks. It does not touch what is part of real writing: direction marks,
  // the joiners inside emoji and inside Persian, Arabic or Indic words stay, and so do typographic
  // quotes and non-breaking spaces. Only the affected characters are replaced, so the cursor, the
  // scroll position and the undo history stay intact. Nothing is copied to the clipboard.
  cleanCurrentNoteAIWatermarks() {
    const view = this.app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    if (!view || !view.editor) {
      new Notice(isRu ? "Откройте заметку в режиме редактирования." : "Open a note in editing mode first.");
      return;
    }
    const editor = view.editor;
    const hasSelection = editor.somethingSelected();
    const raw = hasSelection ? editor.getSelection() : editor.getValue();
    const base = hasSelection ? editor.posToOffset(editor.getCursor("from")) : 0;

    // ZWJ (200D) and ZWNJ (200C) are kept when they sit between two letters or emoji, where they change the text.
    const meaningful = /[\p{L}\p{M}\p{Extended_Pictographic}\uFE0F]/u;
    const changes = [];
    const re = /[\u200b-\u200d\u2060-\u2064\ufeff\u00ad]/g;
    let m;
    while ((m = re.exec(raw)) !== null) {
      const code = m[0].charCodeAt(0);
      if (code === 0x200c || code === 0x200d) {
        const before = Array.from(raw.slice(Math.max(0, m.index - 2), m.index)).pop() || "";
        const after = Array.from(raw.slice(m.index + 1, m.index + 3))[0] || "";
        if (meaningful.test(before) && meaningful.test(after)) continue;
      }
      changes.push({ from: editor.offsetToPos(base + m.index), to: editor.offsetToPos(base + m.index + 1), text: "" });
    }
    if (changes.length === 0) {
      new Notice(isRu ? "Невидимых символов не найдено." : "No invisible characters found.");
      return;
    }
    editor.transaction({ changes });
    new Notice(isRu ? `Удалено невидимых символов: ${changes.length}` : `Invisible characters removed: ${changes.length}`);
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
            el.style.backgroundColor = colors[mod - 1];
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
    if (this.settings.bionicAnchors) {
      this.applyBionicToElement(rootEl);
    }
    if (this.settings.ideCodeStudio !== false) {
      this.enhanceCodeBlocksInView(rootEl);
    }
  }

  // =========================================================================
  // v5.2.0: HUMAN × AI DUAL-COGNITION ENGINE, llms.txt COMPILER & WASM SIMHASH RADAR
  // =========================================================================
  openDualCognitionModal(initialTab = "human") {
    new DualCognitionNeuralStudioModal(this.app, this, initialTab).open();
  }

  analyzeNoteDualCognition(rawMarkdown = "", noteTitle = "Untitled", filePath = "") {
    const raw = String(rawMarkdown || "");
    const body = raw.replace(/^---[\s\S]*?---\n?/, "").trim();
    const lines = body.split(/\r?\n/);

    const headings = [];
    const tasks = [];
    const steps = [];
    const callouts = [];
    const paragraphs = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        headings.push({
          level: hMatch[1].length,
          text: hMatch[2].replace(/[*_`~\[\]]/g, "").trim(),
          line: idx + 1,
        });
        return;
      }

      const taskMatch = trimmed.match(/^[-*+]\s+\[([ xX/\->])\]\s+(.+)$/);
      if (taskMatch) {
        tasks.push({
          done: taskMatch[1].toLowerCase() === "x",
          text: taskMatch[2].replace(/[*_`~]/g, "").trim(),
          line: idx + 1,
        });
        return;
      }

      const stepMatch = trimmed.match(/^(?:(\d{1,2})\s*\/\/\s*|(\d{1,2})\.\s+)(.+)$/);
      if (stepMatch) {
        steps.push({
          num: stepMatch[1] || stepMatch[2],
          text: stepMatch[3].replace(/[*_`~]/g, "").trim(),
          line: idx + 1,
        });
        return;
      }

      const calloutMatch = trimmed.match(/^>\s*\[!([a-zA-Z0-9_-]+)\][+-]?\s*(.*)$/);
      if (calloutMatch) {
        callouts.push({
          type: calloutMatch[1].toLowerCase(),
          title: (calloutMatch[2] || calloutMatch[1]).replace(/[*_`~]/g, "").trim(),
          line: idx + 1,
        });
        return;
      }

      if (!trimmed.startsWith(">") && !trimmed.startsWith("```") && !trimmed.startsWith("|") && trimmed.length > 25) {
        paragraphs.push(trimmed);
      }
    });

    // Extract quantitative metrics, currencies, percentages, multipliers, dates & KPIs
    const metricRegex = /(?:\$\d+(?:[.,]\d+)?\s*[kKmMbB]?|\b\d+(?:[.,]\d+)?\s*(?:%|x|X|×|мс|ms|fps|FPS|px|дн|дней|days|hrs|ч|мин|min|k|K|M|B)\b|\b202[4-9][-/.]\d{2}[-/.]\d{2}\b)/g;
    const metricsSet = new Set();
    const metricsList = [];
    const cleanBodyForMetrics = body.replace(/```[\s\S]*?```/g, "");
    let mMatch;
    while ((mMatch = metricRegex.exec(cleanBodyForMetrics)) !== null) {
      const val = mMatch[0].trim();
      if (metricsSet.has(val) || metricsList.length >= 16) continue;
      metricsSet.add(val);
      const startCtx = Math.max(0, mMatch.index - 36);
      const endCtx = Math.min(cleanBodyForMetrics.length, mMatch.index + val.length + 44);
      const ctx = cleanBodyForMetrics
        .slice(startCtx, endCtx)
        .replace(/\s+/g, " ")
        .replace(/[#*_`>\[\]]/g, "")
        .trim();
      metricsList.push({ value: val, context: ctx });
    }

    // Extract core thesis sentences (highest density of formatting, numbers, or top position)
    const allSentences = [];
    paragraphs.forEach((p, pIdx) => {
      const sents = p.split(/(?<=[.!?…])\s+/);
      sents.forEach((s) => {
        const cleanS = s.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2").replace(/[*_`~]/g, "").trim();
        if (cleanS.length < 32 || cleanS.length > 260) return;
        let score = pIdx === 0 ? 4 : pIdx < 3 ? 2 : 1;
        if (/\*\*[^*]+\*\*/.test(s)) score += 3;
        if (/\d+/.test(cleanS)) score += 2;
        if (/(?:главн|ключев|итог|цель|принцип|core|key|thesis|goal|must|important|result|system)/i.test(cleanS)) score += 3;
        allSentences.push({ text: cleanS, score });
      });
    });
    allSentences.sort((a, b) => b.score - a.score);
    const thesisList = allSentences.slice(0, 5).map((item) => item.text);
    if (thesisList.length === 0 && headings.length > 0) {
      headings.slice(0, 3).forEach((h) => thesisList.push(h.text));
    }

    // Extract [[wikilinks]] and #tags
    const wikilinks = [];
    const wlRegex = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
    let wl;
    while ((wl = wlRegex.exec(body)) !== null) {
      const target = wl[1].trim();
      if (target && !wikilinks.includes(target)) wikilinks.push(target);
    }

    const tags = [];
    const tagRegex = /(?:^|\s)#([a-zA-Zа-яА-ЯёЁ0-9_/-]+)/g;
    let tg;
    while ((tg = tagRegex.exec(body)) !== null) {
      const t = tg[1].trim();
      if (t && !tags.includes(t)) tags.push(t);
    }

    const words = body ? body.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const rawTokens = Math.max(1, Math.ceil(raw.length / 3.8));

    // Calculate Human Structural Readability Index (0..100)
    // How much structure the note has, 0 to 100. It counts what is there (headings, steps or tasks,
    // callouts or figures, links); it does not measure how readable the prose is.
    let structureScore = 0;
    if (headings.length >= 2) structureScore += 30;
    if (headings.length >= 5) structureScore += 15;
    if (steps.length > 0 || tasks.length > 0) structureScore += 20;
    if (callouts.length > 0 || metricsList.length > 0) structureScore += 15;
    if (wikilinks.length > 0) structureScore += 20;

    const hashHex = this.wasmFastHashHex(body || noteTitle);

    return {
      title: noteTitle,
      filePath,
      wordCount,
      readMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      rawTokens,
      structureScore,
      hashHex,
      headings,
      tasks,
      steps,
      callouts,
      metricsList,
      thesisList,
      wikilinks,
      tags,
    };
  }

  buildAiSemanticCapsule(analysis, format = "mcp") {
    const a = analysis;
    const nowIso = localDayKey();

    if (format === "llms") {
      const lines = [
        `# ${a.title}`,
        `> Alchemy Craft Dual-Cognition Capsule | Hash (FNV-1a, 32-bit): 0x${a.hashHex} | Structure: ${a.structureScore}% | Words: ${a.wordCount}`,
        ``,
        `## Core Thesis & Executive Summary`,
        ...(a.thesisList.length > 0 ? a.thesisList.map((t, i) => `${i + 1}. ${t}`) : [`1. Primary knowledge node: ${a.title}`]),
        ``,
        `## Key Metrics & Quantitative Anchors`,
        ...(a.metricsList.length > 0
          ? a.metricsList.slice(0, 10).map((m) => `- **${m.value}**: ${m.context}`)
          : [`- No explicit numeric KPIs detected in note body.`]),
        ``,
        `## Structural Architecture (Chapters & Sections)`,
        ...(a.headings.length > 0
          ? a.headings.slice(0, 14).map((h) => `${"  ".repeat(Math.max(0, h.level - 1))}- [L${h.line}] ${h.text}`)
          : [`- Flat atomic note structure`]),
        ``,
        `## Actionable Levers & Tasks (${a.tasks.filter((t) => t.done).length}/${a.tasks.length} completed)`,
        ...(a.steps.slice(0, 8).map((s) => `- [Step ${s.num.padStart(2, "0")}] ${s.text}`)),
        ...(a.tasks.slice(0, 10).map((t) => `- [${t.done ? "x" : " "}] ${t.text}`)),
        ``,
        `## Semantic Graph Links`,
        `- Outgoing Links: ${a.wikilinks.length > 0 ? a.wikilinks.map((w) => `[[${w}]]`).join(", ") : "None"}`,
        `- Tags: ${a.tags.length > 0 ? a.tags.map((t) => `#${t}`).join(" ") : "None"}`,
      ];
      return lines.join("\n");
    }

    if (format === "jsonld") {
      const payload = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        name: a.title,
        identifier: a.filePath || a.title,
        dateModified: nowIso,
        version: "5.2.0",
        integrityHash: `0x${a.hashHex}`,
        structureScore: a.structureScore,
        wordCount: a.wordCount,
        abstract: a.thesisList.join(" "),
        keywords: a.tags,
        mentions: a.wikilinks,
        quantitativeMetrics: a.metricsList.slice(0, 12),
        articleSection: a.headings.map((h) => ({ level: h.level, title: h.text, line: h.line })),
        potentialAction: [
          ...a.steps.slice(0, 8).map((s) => ({ "@type": "HowToStep", position: s.num, text: s.text })),
          ...a.tasks.slice(0, 10).map((t) => ({ "@type": "Action", actionStatus: t.done ? "CompletedActionStatus" : "PotentialActionStatus", name: t.text })),
        ],
      };
      return JSON.stringify(payload, null, 2);
    }

    // Default: "mcp" — Model Context Protocol / Claude XML Knowledge Capsule
    // Note text goes into XML: "&", "<", ">" and quotes must be escaped or the capsule stops being well-formed.
    const xml = (value) =>
      String(value === null || value === undefined ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const xmlLines = [
      `<knowledge_capsule title="${xml(a.title)}" path="${xml(a.filePath || "")}" hash="0x${a.hashHex}" structure="${a.structureScore}%" words="${a.wordCount}">`,
      `  <executive_thesis>`,
      ...(a.thesisList.length > 0
        ? a.thesisList.map((t, i) => `    <point index="${i + 1}">${xml(t)}</point>`)
        : [`    <point index="1">${xml(a.title)}</point>`]),
      `  </executive_thesis>`,
      `  <quantitative_anchors count="${a.metricsList.length}">`,
      ...a.metricsList.slice(0, 10).map((m) => `    <metric value="${xml(m.value)}">${xml(m.context)}</metric>`),
      `  </quantitative_anchors>`,
      `  <section_outline count="${a.headings.length}">`,
      ...a.headings.slice(0, 14).map((h) => `    <section level="H${h.level}" line="${h.line}">${xml(h.text)}</section>`),
      `  </section_outline>`,
      `  <action_vectors tasks_done="${a.tasks.filter((t) => t.done).length}" tasks_total="${a.tasks.length}">`,
      ...a.steps.slice(0, 8).map((s) => `    <step num="${xml(s.num)}">${xml(s.text)}</step>`),
      ...a.tasks.slice(0, 10).map((t) => `    <task status="${t.done ? "done" : "todo"}">${xml(t.text)}</task>`),
      `  </action_vectors>`,
      `  <knowledge_graph_edges>`,
      `    <wikilinks>${xml(a.wikilinks.join(", "))}</wikilinks>`,
      `    <tags>${xml(a.tags.map((t) => "#" + t).join(" "))}</tags>`,
      `  </knowledge_graph_edges>`,
      `</knowledge_capsule>`,
    ];
    return xmlLines.join("\n");
  }

  computeWasmSimHash64(text = "") {
    const clean = String(text || "")
      .toLowerCase()
      .replace(/^---[\s\S]*?---\n?/, "")
      .replace(/[^a-zа-яё0-9\s]/gi, " ");
    const tokens = clean.split(/\s+/).filter((w) => w.length >= 4);
    const bitWeights = new Int32Array(64);
    const useWasm = this.wasmReady && this.wasmExports && this.settings.wasmAcceleration !== false;

    const hashToken = (str, seed) => {
      let h = seed >>> 0;
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i) & 0xff;
        if (useWasm) {
          h = this.wasmExports.fnv1a_step(h, c) >>> 0;
        } else {
          h = Math.imul(h ^ c, 16777619) >>> 0;
        }
      }
      return h >>> 0;
    };

    const limit = Math.min(tokens.length, 450);
    for (let i = 0; i < limit; i++) {
      const tok = tokens[i];
      const h1 = hashToken(tok, 2166136261);
      const h2 = hashToken(tok + (tokens[i + 1] || ""), 2654435761);
      for (let b = 0; b < 32; b++) {
        bitWeights[b] += (h1 & (1 << b)) !== 0 ? 1 : -1;
        bitWeights[b + 32] += (h2 & (1 << b)) !== 0 ? 1 : -1;
      }
    }

    let hi = 0;
    let lo = 0;
    for (let b = 0; b < 32; b++) {
      if (bitWeights[b] > 0) lo |= 1 << b;
      if (bitWeights[b + 32] > 0) hi |= 1 << b;
    }
    return [hi >>> 0, lo >>> 0, new Set(tokens.slice(0, 120))];
  }

  // Finds notes that use the same vocabulary as the active one. The score is the cosine similarity of
  // the two notes' term vectors (see kinVector): stop-words removed, word endings folded, every script
  // treated alike. Up to 400 most recently changed notes are compared; the count returned is the real one.
  async scanVaultWasmSemanticRadar(activeFile, activeRawText) {
    const t0 = performance.now();
    const existingLinks = new Set();
    const wlRegex = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
    let m;
    while ((m = wlRegex.exec(activeRawText || "")) !== null) {
      existingLinks.add(m[1].trim().toLowerCase());
    }

    // term vector of the text on screen (it may hold unsaved edits)
    const tf = new Map();
    const stemWord = new Map();
    keyWords(
      String(activeRawText || "")
        .replace(/\r\n/g, "\n")
        .replace(/^---\n[\s\S]*?\n---\n/, "")
        .replace(/```[\s\S]*?```/g, " ") + (activeFile ? " " + activeFile.basename : "")
    ).forEach((w) => {
      const st = keyStem(w);
      tf.set(st, (tf.get(st) || 0) + 1);
      if (!stemWord.has(st)) stemWord.set(st, w); // shown to the reader as a whole word, not a stem
    });
    let norm = 0;
    tf.forEach((count, st) => {
      const weight = 1 + Math.log(count);
      tf.set(st, weight);
      norm += weight * weight;
    });
    const me = { tf, norm: Math.sqrt(norm) || 1, size: tf.size };

    let files = this.app.vault.getMarkdownFiles().filter((f) => !activeFile || f.path !== activeFile.path);
    if (files.length > 400) files = files.slice().sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 400);

    const results = [];
    let scannedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const other = await this.kinVector(file);
      if (!other) continue;
      scannedCount++;
      if (me.size < 4 || other.size < 4) continue;
      const small = me.size <= other.size ? me : other;
      const large = small === me ? other : me;
      let dot = 0;
      const shared = [];
      small.tf.forEach((w, st) => {
        const w2 = large.tf.get(st);
        if (w2) {
          dot += w * w2;
          shared.push([st, w * w2]);
        }
      });
      const similarity = Math.round((dot / (me.norm * other.norm)) * 100);
      if (similarity < 8) continue;
      shared.sort((a, b) => b[1] - a[1]);
      results.push({
        file,
        title: file.basename,
        path: file.path,
        similarity,
        sharedKeywords: shared.slice(0, 5).map((s) => stemWord.get(s[0]) || s[0]),
        isAlreadyLinked:
          existingLinks.has(file.basename.toLowerCase()) || existingLinks.has(file.path.replace(/\.md$/i, "").toLowerCase()),
      });
      if (i % 40 === 39) await new Promise((resolve) => setTimeout(resolve, 0));
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return {
      elapsedMs: +(performance.now() - t0).toFixed(1),
      scannedCount,
      wasmActive: false,
      matches: results.slice(0, 8),
    };
  }

  async insertExecutiveBriefIntoActiveNote(passedAnalysis = null) {
    const obsidian = require("obsidian");
    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file) {
      new obsidian.Notice(
        i18n({
          en: "Open a Markdown note first to insert an Executive Brief.",
          ru: "Сначала откройте заметку Markdown для вставки Нейро-Брифа.",
        }, this)
      );
      return false;
    }

    const file = activeView.file;
    const isRu = (this.settings.uiLanguage || "en") === "ru";

    // Splits the note at the place where the summary goes. A summary that is already there is cut out,
    // so a second run replaces it instead of stacking another one, and the analysis below never reads
    // the old summary as note text.
    const briefHead = /^> \[!abstract\][+-]? .*\(`(?:structure \d+%|\d+% Clarity)` · `0x[0-9a-fA-F]+`\)\s*$/;
    const splitAtBrief = (text) => {
      const lines = text.split("\n");
      let start = -1;
      for (let i = 0; i < lines.length; i++) {
        if (briefHead.test(lines[i].replace(/\r$/, ""))) {
          start = i;
          break;
        }
      }
      if (start !== -1) {
        let end = start + 1;
        while (end < lines.length && lines[end].startsWith(">")) end++;
        if (end < lines.length && lines[end].trim() === "") end++;
        const before = lines.slice(0, start).join("\n");
        return { before: before ? before + "\n" : "", after: lines.slice(end).join("\n") };
      }
      const fm = text.match(/^---[\s\S]*?---\r?\n/);
      if (fm) return { before: fm[0] + "\n", after: text.slice(fm[0].length) };
      return { before: "", after: text };
    };

    const build = (cur) => {
      const parts = splitAtBrief(cur);
      const a = passedAnalysis || this.analyzeNoteDualCognition(parts.before + parts.after, file.basename, file.path);

      const thesisBullets =
        a.thesisList.length > 0
          ? a.thesisList.slice(0, 3).map((t, idx) => `> **0${idx + 1} //** ${t}`).join("\n")
          : `> **01 //** ${a.title}`;

      const metricsLine =
        a.metricsList.length > 0
          ? `> - **${isRu ? "Ключевые цифры и метрики" : "Key Metrics & Numbers"}:** ${a.metricsList
              .slice(0, 6)
              .map((m) => "`" + m.value + "`")
              .join(" · ")}\n`
          : "";

      const calloutBlock = [
        `> [!abstract]+ ${isRu ? "Сводка заметки" : "Note summary"} (\`structure ${a.structureScore}%\` · \`0x${a.hashHex}\`)`,
        thesisBullets,
        metricsLine ? metricsLine.trimEnd() : `> - **${isRu ? "Объём" : "Scope"}:** ~${a.readMinutes} ${isRu ? "мин чтения" : "min read"} (${a.wordCount} ${isRu ? "слов" : "words"})`,
        ``,
      ].join("\n");

      return `${parts.before}${calloutBlock}\n${parts.after}`;
    };

    // Through the open editor when the note is being edited, so unsaved typing is not overwritten.
    await this.editNote(file, build);
    new obsidian.Notice(
      i18n({
        en: "Executive Brief callout inserted at the top of your note!",
        ru: "Нейро-Бриф (Callout) вставлен в начало вашей заметки!",
      }, this)
    );
    return true;
  }

  async compileVaultLlmsTxtFile() {
    const obsidian = require("obsidian");
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((f) => !f.path.startsWith(".") && f.name !== "llms.txt")
      .sort((a, b) => (b.stat?.mtime || 0) - (a.stat?.mtime || 0))
      .slice(0, 40);

    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const header = [
      `# Obsidian Knowledge Vault — llms.txt (Compiled by Alchemy Craft v5.6.1)`,
      `> Dual-Cognition Knowledge Index for Human Readers & AI Agents (Cursor, Claude Code, MCP, Windsurf).`,
      `> Generated: ${new Date().toISOString()} | Indexed Notes: ${files.length}`,
      ``,
      `## Vault Architecture & High-Signal Note Capsules`,
      ``,
    ];

    let totalRawTokens = 0;
    let totalCompressedTokens = 0;

    for (const file of files) {
      try {
        const raw = await this.app.vault.cachedRead(file);
        const a = this.analyzeNoteDualCognition(raw, file.basename, file.path);
        totalRawTokens += a.rawTokens;
        const thesis = a.thesisList[0] || file.basename;
        const metrics = a.metricsList.slice(0, 4).map((m) => m.value).join(", ");
        const secList = a.headings.slice(0, 5).map((h) => h.text).join(" → ");
        const block = [
          `### [${file.basename}](${file.path})`,
          `- **Hash**: \`0x${a.hashHex}\` | **Structure**: ${a.structureScore}% | **Words**: ${a.wordCount}`,
          `- **Core Thesis**: ${thesis}`,
          ...(metrics ? [`- **Metrics**: ${metrics}`] : []),
          ...(secList ? [`- **Sections**: ${secList}`] : []),
          ``,
        ].join("\n");
        totalCompressedTokens += Math.max(1, Math.ceil(block.length / 3.8));
        header.push(block);
      } catch (e) {}
    }

    // Sizes are estimates (3.8 characters per token). The ratio is reported as it is, not clamped.
    const savedPct = totalRawTokens > 0 ? Math.round((1 - totalCompressedTokens / totalRawTokens) * 100) : 0;
    const sizeNote = savedPct >= 0 ? savedPct + "% smaller" : Math.abs(savedPct) + "% larger";
    const sizeNoteRu = savedPct >= 0 ? "на " + savedPct + "% меньше" : "на " + Math.abs(savedPct) + "% больше";
    header.splice(
      3,
      0,
      `> Size estimate: about ${totalCompressedTokens} tokens here vs about ${totalRawTokens} in the source notes (${sizeNote}; 3.8 characters per token).`
    );

    const finalContent = header.join("\n");
    const targetPath = "llms.txt";
    const existing = this.app.vault.getAbstractFileByPath(targetPath);
    if (existing) {
      await this.app.vault.modify(existing, finalContent);
    } else {
      await this.app.vault.create(targetPath, finalContent);
    }

    new obsidian.Notice(
      isRu
        ? `llms.txt собран в корне хранилища: ${files.length} заметок, по оценке ${sizeNoteRu} исходного текста.`
        : `llms.txt written to the vault root: ${files.length} notes, an estimated ${sizeNote} than the source text.`
    );
    return { count: files.length, savedPct, path: targetPath };
  }


  // =========================================================================
  // v5.3.0: VISIBLE TACTILE ARCHIVAL PAPER FIBER & GRAIN OVERLAY
  // =========================================================================
  // --- PAPER SURFACE ---
  // The page carries a real paper texture: fine grain, soft cloudiness and scattered fibres. It is drawn
  // once into a seamless tile and laid as a background that scrolls with the text, while a soft pool of
  // light stays fixed to the pane. Moving the page under still light is what makes paper look like paper.
  ensureTactilePaperGrainOverlay(activeView) {
    this.applyPaperTexture();
    // layers left by versions before 5.5
    if (activeView && activeView.containerEl) {
      activeView.containerEl.querySelectorAll(".artcraft-paper-grain-layer").forEach((el) => el.remove());
    }
  }

  applyPaperTexture() {
    const raw = this.settings.paperGrain !== undefined ? Number(this.settings.paperGrain) : 42;
    const grainPct = Math.max(0, Math.min(100, Number.isFinite(raw) ? raw : 42));
    const surface = this.isDarkPage() ? "dark" : (this.settings.surfaceMode || "white");
    const key = grainPct > 0 ? surface + ":" + grainPct : "off";
    if (this.paperTileKey === key) return;
    this.paperTileKey = key;
    if (key === "off" || grainPct <= 0) {
      this.releasePaperTexture();
      return;
    }
    const canvas = this.buildPaperTile(surface, grainPct / 100);
    canvas.toBlob((blob) => {
      if (!blob || this._unloaded || this.paperTileKey !== key) return;
      const url = URL.createObjectURL(blob);
      const old = this.paperTileUrl;
      this.paperTileUrl = url;
      document.body.style.setProperty("--artcraft-paper-tile", 'url("' + url + '")');
      document.body.classList.add("artcraft-paper-on");
      if (old) URL.revokeObjectURL(old);
    }, "image/png");
  }

  releasePaperTexture() {
    document.body.classList.remove("artcraft-paper-on");
    document.body.style.removeProperty("--artcraft-paper-tile");
    if (this.paperTileUrl) {
      URL.revokeObjectURL(this.paperTileUrl);
      this.paperTileUrl = null;
    }
  }

  buildPaperTile(surface, strength) {
    const S = 512;
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(S, S);
    const d = img.data;

    // Fixed seed: the same sheet every session, so the page does not "change paper" between launches.
    let seed = 0x9e3779b9;
    const rnd = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };

    // Periodic value noise: the lattice wraps around, so the tile has no visible seam.
    const lattice = (n) => {
      const g = new Float32Array(n * n);
      for (let i = 0; i < g.length; i++) g[i] = rnd() * 2 - 1;
      return (x, y) => {
        const fx = (x / S) * n;
        const fy = (y / S) * n;
        const x0 = Math.floor(fx) % n;
        const y0 = Math.floor(fy) % n;
        const x1 = (x0 + 1) % n;
        const y1 = (y0 + 1) % n;
        let tx = fx - Math.floor(fx);
        let ty = fy - Math.floor(fy);
        tx = tx * tx * (3 - 2 * tx);
        ty = ty * ty * (3 - 2 * ty);
        const top = g[y0 * n + x0] + (g[y0 * n + x1] - g[y0 * n + x0]) * tx;
        const bottom = g[y1 * n + x0] + (g[y1 * n + x1] - g[y1 * n + x0]) * tx;
        return top + (bottom - top) * ty;
      };
    };
    const cloudWide = lattice(5); // uneven density of the pulp
    const cloudFine = lattice(19);
    const tooth = lattice(110); // the "tooth" a pencil would catch on

    // On the dark sheet the specks are black and a warm off-white; light specks show far more on dark, so they are thinned.
    const dark = surface === "dark";
    const ink = dark ? [0, 0, 0] : surface === "white" ? [72, 74, 82] : [108, 82, 48];
    const pale = dark ? [232, 222, 202] : [255, 255, 255];
    const paleGain = dark ? 0.2 : 1;
    const inkGain = dark ? 1.5 : 1;
    const amp = 0.05 + strength * 0.2;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const grain = (rnd() + rnd() + rnd()) / 1.5 - 1;
        const v = cloudWide(x, y) * 0.16 + cloudFine(x, y) * 0.2 + tooth(x, y) * 0.3 + grain * 0.46;
        const i = (y * S + x) * 4;
        if (v < 0) {
          d[i] = ink[0];
          d[i + 1] = ink[1];
          d[i + 2] = ink[2];
          d[i + 3] = Math.min(255, -v * amp * 255 * inkGain);
        } else {
          d[i] = pale[0];
          d[i + 1] = pale[1];
          d[i + 2] = pale[2];
          d[i + 3] = Math.min(255, v * amp * 216 * paleGain);
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // Fibres: short curved hairs, some darker than the sheet and some lighter. Each is drawn nine times
    // with a tile-sized offset so a fibre that crosses an edge continues on the other side.
    const fibres = Math.round(50 + strength * 230);
    ctx.lineCap = "round";
    for (let k = 0; k < fibres; k++) {
      const x = rnd() * S;
      const y = rnd() * S;
      const len = 5 + rnd() * 22;
      const ang = rnd() * Math.PI * 2;
      const bend = (rnd() - 0.5) * 9;
      const light = rnd() < 0.35;
      const alpha = light ? (0.22 + rnd() * 0.38) * paleGain : (0.05 + rnd() * 0.13) * (0.5 + strength) * inkGain;
      ctx.strokeStyle = light
        ? "rgba(" + pale[0] + "," + pale[1] + "," + pale[2] + "," + alpha.toFixed(3) + ")"
        : "rgba(" + ink[0] + "," + ink[1] + "," + ink[2] + "," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 0.45 + rnd() * 0.6;
      const ex = Math.cos(ang) * len;
      const ey = Math.sin(ang) * len;
      for (let ox = -S; ox <= S; ox += S) {
        for (let oy = -S; oy <= S; oy += S) {
          ctx.beginPath();
          ctx.moveTo(x + ox, y + oy);
          ctx.quadraticCurveTo(x + ox + ex / 2 + bend, y + oy + ey / 2 - bend, x + ox + ex, y + oy + ey);
          ctx.stroke();
        }
      }
    }
    return canvas;
  }

  // =========================================================================
  // v5.3.0: IDE POLY-CHROMATIC CODE STUDIO (5 PALETTES + TOKENIZER + COPY)
  // =========================================================================
  tokenizeCodeToColorfulHtml(rawCode = "", lang = "js") {
    const lines = String(rawCode || "").replace(/\r\n/g, "\n").split("\n");
    if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();

    const esc = (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Which marker starts a comment depends on the language: "#include" in C and "--flag" in a shell are code.
    const langId = String(lang || "").toLowerCase();
    const usesHash = /^(py|python|rb|ruby|sh|bash|zsh|fish|shell|console|yaml|yml|toml|ini|conf|cfg|r|perl|pl|ps1|powershell|dockerfile|docker|makefile|make|nginx|elixir|ex|exs|julia|jl|nim|tcl|env|properties|gitignore|graphql|gql|coffee|crystal|awk|cmake|tf|hcl|terraform|php)$/.test(langId);
    const usesDash = /^(sql|mysql|pgsql|postgres|postgresql|plsql|tsql|sqlite|lua|haskell|hs|elm|ada|vhdl|applescript)$/.test(langId);
    const usesSlash = /^(js|javascript|jsx|mjs|cjs|ts|typescript|tsx|java|c|h|cpp|c\+\+|cc|hpp|cs|csharp|go|golang|rust|rs|swift|kotlin|kt|php|scala|dart|json5|jsonc|scss|sass|less|glsl|objc|objective-c|zig|groovy|gradle|proto|protobuf|solidity|sol)$/.test(langId);
    const plainText = /^(html|xml|svg|css|json|md|markdown|text|txt|plain|csv|diff|log)$/.test(langId);
    const unknownLang = !usesHash && !usesDash && !usesSlash && !plainText;
    const noSlashComments = (usesHash || usesDash || plainText) && !usesSlash;

    // Index where a "#" or "--" comment starts on the line, or -1. Markers inside quotes do not count.
    const commentStart = (line) => {
      let quote = "";
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quote) {
          if (ch === "\\") i++;
          else if (ch === quote) quote = "";
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
          quote = ch;
          continue;
        }
        const lead = i === 0 || /\s/.test(line[i - 1]);
        if (!lead) continue;
        const atLineStart = line.slice(0, i).trim() === "";
        if (ch === "#") {
          if (usesHash) return i;
          // language not named: "# text" and "#!shebang" read as comments, "#include" and "#define" stay code
          const next = line[i + 1];
          if (unknownLang && atLineStart && (next === " " || next === "!" || next === undefined)) return i;
        } else if (ch === "-" && line[i + 1] === "-") {
          if (usesDash) return i;
          if (unknownLang && atLineStart && line[i + 2] === " ") return i;
        }
      }
      return -1;
    };

    const tokenizeLine = (line) => {
      const cut = commentStart(line);
      if (cut === 0) return `<span class="ide-tok-comment">${esc(line)}</span>`;
      if (cut > 0) return tokenizeCode(line.slice(0, cut)) + `<span class="ide-tok-comment">${esc(line.slice(cut))}</span>`;
      return tokenizeCode(line);
    };

    const tokenizeCode = (line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") && !noSlashComments) {
        return `<span class="ide-tok-comment">${esc(line)}</span>`;
      }

      // Single-pass regex tokenizer over raw line so we never corrupt HTML entities
      const tokenRegex = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)|(\/\/.*$)|(\b(?:const|let|var|function|return|async|await|import|from|export|default|class|extends|new|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|typeof|instanceof|in|of|def|elif|except|lambda|yield|with|as|pass|pragma|solidity|contract|mapping|struct|event|emit|public|private|internal|external|view|pure|payable|memory|storage|returns|interface|type|enum|impl|fn|pub|mut|use|mod|match)\b)|(\b(?:true|false|null|undefined|None|True|False|self|this|super|window|document|console|Math|JSON|Promise|Array|Object|String|Number|Boolean|Map|Set|uint256|address|bytes32|bool|string)\b)|(\b(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:px|rem|em|ms|s|%)?)\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|(\.[a-zA-Z_$][a-zA-Z0-9_$]*)|([{}()\[\]])/g;

      let out = "";
      let lastIdx = 0;
      let m;
      while ((m = tokenRegex.exec(line)) !== null) {
        if (m.index > lastIdx) {
          out += esc(line.slice(lastIdx, m.index));
        }
        const [full, strTok, comTok, kwTok, builtinTok, numTok, fnTok, propTok, brkTok] = m;
        if (strTok) out += `<span class="ide-tok-string">${esc(full)}</span>`;
        else if (comTok) {
          // "//" inside an unquoted URL, or in a language where it is not a comment marker
          if (noSlashComments || (m.index > 0 && line[m.index - 1] === ":")) {
            out += esc("//");
            lastIdx = m.index + 2;
            tokenRegex.lastIndex = lastIdx;
            continue;
          }
          out += `<span class="ide-tok-comment">${esc(full)}</span>`;
        }
        else if (kwTok) out += `<span class="ide-tok-keyword">${esc(full)}</span>`;
        else if (builtinTok) out += `<span class="ide-tok-type">${esc(full)}</span>`;
        else if (numTok) out += `<span class="ide-tok-number">${esc(full)}</span>`;
        else if (fnTok) out += `<span class="ide-tok-fn">${esc(full)}</span>`;
        else if (propTok) out += `<span class="ide-tok-prop">${esc(full)}</span>`;
        else if (brkTok) out += `<span class="ide-tok-bracket">${esc(full)}</span>`;
        else out += esc(full);
        lastIdx = m.index + full.length;
      }
      if (lastIdx < line.length) {
        out += esc(line.slice(lastIdx));
      }
      return out || " ";
    };

    return lines
      .map(
        (ln, i) =>
          `<div class="ide-code-line"><span class="ide-line-num">${i + 1}</span><span class="ide-line-code">${tokenizeLine(ln)}</span></div>`
      )
      .join("");
  }

  enhanceCodeBlocksInView(rootEl) {
    if (!rootEl || this.settings.ideCodeStudio === false) return;
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const palettes = [
      { id: "vscode-dark", label: "VS Code Dark+" },
      { id: "tokyo-night", label: "Tokyo Night" },
      { id: "monokai-pro", label: "Monokai Pro" },
      { id: "catppuccin", label: "Catppuccin" },
      { id: "alabaster-light", label: "Alabaster Light" },
    ];
    const currentPalette = this.settings.codeThemePalette || "vscode-dark";

    const preBlocks = rootEl.querySelectorAll("pre:not(.dc-code-preview)");
    preBlocks.forEach((pre) => {
      pre.setAttribute("data-ide-palette", currentPalette);
      if (pre.dataset.artcraftIdeEnhanced === "true") return;
      const codeEl = pre.querySelector("code");
      if (!codeEl) return;

      pre.dataset.artcraftIdeEnhanced = "true";
      pre.classList.add("artcraft-ide-code-window");

      const rawCode = codeEl.innerText || codeEl.textContent || "";
      const langCls = Array.from(codeEl.classList).find((c) => c.startsWith("language-")) || "";
      const lang = (langCls.replace("language-", "") || "code").toUpperCase();
      const lineCount = Math.max(1, rawCode.replace(/\r\n/g, "\n").trimEnd().split("\n").length);

      // Obsidian's own highlighter rewrites <code class="language-*"> after post-processors have run, which
      // used to flatten the numbered lines into one run of text. The numbered view therefore lives in
      // its own element and the original <code> stays untouched (hidden).
      const numbered = document.createElement("code");
      numbered.className = "artcraft-ide-code-body";
      numbered.innerHTML = this.tokenizeCodeToColorfulHtml(rawCode, lang);
      codeEl.classList.add("artcraft-ide-code-source");
      codeEl.after(numbered);

      // Build IDE Window Header Bar
      const header = document.createElement("div");
      header.className = "artcraft-ide-header";
      header.innerHTML = `
        <div class="ide-win-left">
          <span class="ide-dot is-red"></span>
          <span class="ide-dot is-yellow"></span>
          <span class="ide-dot is-green"></span>
          <span class="ide-lang-pill">${escHtml(lang)}</span>
          <span class="ide-lines-meta">${lineCount} ${isRu ? "стр." : "lines"}</span>
        </div>
        <div class="ide-win-right">
          <select class="ide-palette-select" title="${isRu ? "Выбрать цветовую палитру кода" : "Choose IDE Color Palette"}">
            ${palettes
              .map(
                (p) =>
                  `<option value="${p.id}" ${p.id === currentPalette ? "selected" : ""}>${p.label}</option>`
              )
              .join("")}
          </select>
          <button type="button" class="ide-copy-btn">
            <span>${isRu ? "Копировать" : "Copy"}</span>
          </button>
        </div>
      `;

      pre.insertBefore(header, pre.firstChild);

      const selectEl = header.querySelector(".ide-palette-select");
      selectEl?.addEventListener("change", async (e) => {
        e.stopPropagation();
        const chosen = selectEl.value;
        this.settings.codeThemePalette = chosen;
        await this.saveSettings();
        document.querySelectorAll("pre.artcraft-ide-code-window").forEach((b) => {
          b.setAttribute("data-ide-palette", chosen);
        });
        document.querySelectorAll(".ide-palette-select").forEach((s) => {
          s.value = chosen;
        });
        this.playTactileMicroFeedback("tap");
      });

      const copyBtn = header.querySelector(".ide-copy-btn");
      copyBtn?.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(rawCode);
          this.playTactileMicroFeedback("tap");
          copyBtn.innerHTML = `<span>✓ ${isRu ? "Скопировано!" : "Copied!"}</span>`;
          copyBtn.classList.add("is-copied");
          setTimeout(() => {
            copyBtn.innerHTML = `<span>${isRu ? "Копировать" : "Copy"}</span>`;
            copyBtn.classList.remove("is-copied");
          }, 1600);
        } catch (err) {}
      });
    });
  }

  // =========================================================================
  // v5.3.0: BESPOKE DUOTONE SQUIRCLE FOLDER & NOTE ICON PACK (FULCRUM STYLE)
  // =========================================================================
  // --- FILE EXPLORER ICONS ---
  // One thin outline per item, drawn in the text colour at low contrast: the icon tells folders and
  // notes apart at a glance and then gets out of the way of the name.
  getBespokeSidebarIconSvg(name = "", isFolder = true) {
    const lower = String(name || "").toLowerCase();
    let glyph = isFolder ? "folder" : "doc";
    if (isFolder) {
      if (/inbox|входящ|capture/.test(lower)) glyph = "inbox";
      else if (/book|книг|библиот|read|чтени|lit/.test(lower)) glyph = "book";
      else if (/project|проект|work|работ/.test(lower)) glyph = "project";
      else if (/archiv|архив/.test(lower)) glyph = "archive";
      else if (/daily|journal|дневник|ежеднев/.test(lower)) glyph = "day";
      else if (/templat|шаблон/.test(lower)) glyph = "template";
      else if (/moc|map|карт|index|индекс/.test(lower)) glyph = "map";
    }
    const glyphs = {
      folder: '<path d="M2.5 5a1.5 1.5 0 0 1 1.5-1.5h2.4l1.4 1.5H12A1.5 1.5 0 0 1 13.5 6.5v4.5A1.5 1.5 0 0 1 12 12.5H4A1.5 1.5 0 0 1 2.5 11V5z"/>',
      doc: '<path d="M4.5 2.5h4.8l2.2 2.3v8.7h-7z"/><path d="M6.5 7.5h3M6.5 9.8h3"/>',
      inbox: '<path d="M2.5 9.5l1.8-5h7.4l1.8 5v3h-11z"/><path d="M2.5 9.5h3l.8 1.3h3.4l.8-1.3h3"/>',
      book: '<path d="M8 4.3C6.8 3.4 5.2 3.2 3 3.4v8.4c2.2-.2 3.8 0 5 .9 1.2-.9 2.8-1.1 5-.9V3.4c-2.2-.2-3.8 0-5 .9z"/><path d="M8 4.3v8.4"/>',
      project: '<path d="M3 12.5h10"/><path d="M4.5 12.5v-4M8 12.5v-8M11.5 12.5v-6"/>',
      archive: '<path d="M2.5 3.5h11v2.6h-11z"/><path d="M3.5 6.1v6.4h9V6.1"/><path d="M6.5 8.6h3"/>',
      day: '<path d="M3 4.5h10v8H3z"/><path d="M3 7h10M5.5 3v2.4M10.5 3v2.4"/>',
      template: '<path d="M3 3.5h10v9H3z"/><path d="M3 6.5h10M7 6.5v6"/>',
      map: '<circle cx="8" cy="8" r="5"/><path d="M9.9 6.1L8.8 8.8 6.1 9.9l1.1-2.7z"/>',
    };
    return (
      '<span class="artcraft-bespoke-squircle" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" ' +
      'stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      (glyphs[glyph] || glyphs.folder) +
      "</svg></span>"
    );
  }

  setupSidebarObserver() {
    if (this._sidebarObserver) return;
    try {
      const findAndObserve = () => {
        const container = document.querySelector(".nav-files-container");
        if (!container) return false;
        let timer = null;
        this._sidebarObserver = new MutationObserver(() => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            if (!this._unloaded) this.decorateSidebarFileExplorer();
          }, 80);
        });
        this._sidebarObserver.observe(container, { childList: true, subtree: true });
        return true;
      };
      if (!findAndObserve()) {
        setTimeout(findAndObserve, 800);
      }
    } catch (e) {
      console.error("[Alchemy Craft] observer error:", e);
    }
  }

  decorateSidebarFileExplorer() {
    if (this.settings.bespokeSidebarIcons === false) return;
    try {
      const folderTitles = document.querySelectorAll(".nav-files-container .nav-folder-title");
      folderTitles.forEach((ft) => {
        const contentEl = ft.querySelector(".nav-folder-title-content");
        if (!contentEl) return;
        const name = (contentEl.textContent || "").trim();
        if (!name || name === "/") return;

        let iconWrap = ft.querySelector(".artcraft-sidebar-icon-slot");
        if (!iconWrap) {
          iconWrap = document.createElement("span");
          iconWrap.className = "artcraft-sidebar-icon-slot";
          iconWrap.dataset.folderName = name;
          iconWrap.innerHTML = this.getBespokeSidebarIconSvg(name, true);
          ft.insertBefore(iconWrap, contentEl);
        } else if (iconWrap.dataset.folderName !== name) {
          iconWrap.dataset.folderName = name;
          iconWrap.innerHTML = this.getBespokeSidebarIconSvg(name, true);
        }

        // Number of items directly inside the folder
        const folderEl = ft.parentElement;
        const childrenWrap = folderEl ? folderEl.querySelector(":scope > .nav-folder-children") : null;
        if (childrenWrap) {
          const count = childrenWrap.querySelectorAll(":scope > .nav-file, :scope > .nav-folder").length;
          let countBadge = ft.querySelector(".artcraft-folder-count-pill");
          if (count > 0) {
            if (!countBadge) {
              countBadge = document.createElement("span");
              countBadge.className = "artcraft-folder-count-pill";
              ft.appendChild(countBadge);
            }
            const label = String(count);
            if (countBadge.textContent !== label) countBadge.textContent = label;
          } else if (countBadge) {
            countBadge.remove();
          }
        }
      });

      const fileTitles = document.querySelectorAll(".nav-files-container .nav-file-title");
      fileTitles.forEach((flt) => {
        const contentEl = flt.querySelector(".nav-file-title-content");
        if (!contentEl) return;
        if (!flt.querySelector(".artcraft-bespoke-squircle")) {
          const iconWrap = document.createElement("span");
          iconWrap.className = "artcraft-sidebar-icon-slot";
          iconWrap.innerHTML = this.getBespokeSidebarIconSvg("", false);
          flt.insertBefore(iconWrap, contentEl);
        }
      });
    } catch (e) {}
  }

  // =========================================================================
  // RELATED NOTES ("kin") — slips of paper hanging on threads under the note
  // =========================================================================
  // Every related note is a small slip tied by a thread to the current note. The slips are simulated:
  // each one is a mass on a spring with a pendulum lean, pushed by a slow wind with occasional gusts
  // that travel left to right, by the air the cursor moves, and by the inertia of scrolling. The title
  // stays sharp, the text stays blurred until the slip is opened. Threads are arrows: they point the
  // way the link points.
  //
  // Rendering: the simulation is not stepped once per frame. It is run a few seconds ahead and the
  // resulting trajectory is handed to the compositor as transform keyframes (kinBake). Between
  // interactions the main thread does nothing at all; a push, a hover or a scroll re-bakes from the
  // exact state the slips are in at that moment.
  async renderWindTetheredNoteChainFooter(activeView) {
    try {
      if (!activeView || !activeView.file || !activeView.containerEl) return;
      const container = activeView.containerEl;
      if (this.settings.windChainFooter === false) {
        this.kinDestroyIn(container);
        return;
      }
      const file = activeView.file;
      const mode = activeView.getMode ? activeView.getMode() : "source";
      // Right after the last line of the note. Obsidian keeps its own footer element (.mod-footer, the home
      // of "backlinks in document") across re-renders, and removes anything else added to the sizer.
      const host =
        mode === "preview"
          ? container.querySelector(".markdown-preview-sizer > .mod-footer") || container.querySelector(".markdown-preview-view")
          : container.querySelector(".cm-sizer > .mod-footer") || container.querySelector(".cm-sizer");
      if (!host) return;

      const related = await this.kinCollect(file);
      if (this._unloaded || activeView.file !== file) return; // the view moved on while we were reading

      const signature = file.path + "|" + mode + "|" + related.map((r) => r.path + ":" + r.kind + ":" + r.score).join(",");
      const existing = container.querySelector(".artcraft-kin");
      if (existing && existing.dataset.sig === signature && existing.parentElement === host) return;
      this.kinDestroyIn(container);
      if (related.length === 0) return;
      this.kinBuild(host, file, related, signature, mode);
    } catch (e) {
      console.error("[Alchemy Craft] related notes", e);
    }
  }

  // Outgoing links, backlinks and notes with similar wording, strongest first, six at most.
  async kinCollect(file) {
    const cache = this.app.metadataCache;
    const resolved = cache.resolvedLinks || {};
    const byPath = new Map();
    const add = (path, kind) => {
      if (path === file.path || !path.endsWith(".md")) return;
      const prev = byPath.get(path);
      if (!prev) byPath.set(path, { path, kind, score: 0 });
      else if (prev.kind !== kind) prev.kind = "both";
    };
    Object.keys(resolved[file.path] || {}).forEach((p) => add(p, "out"));
    Object.keys(resolved).forEach((src) => {
      if (resolved[src] && resolved[src][file.path]) add(src, "in");
    });
    const similar = await this.kinSimilar(file, byPath);
    similar.forEach((s) => {
      if (!byPath.has(s.path)) byPath.set(s.path, { path: s.path, kind: "sim", score: s.score });
    });

    const order = { both: 0, out: 1, in: 2, sim: 3 };
    const list = Array.from(byPath.values())
      .sort((a, b) => order[a.kind] - order[b.kind] || b.score - a.score || a.path.localeCompare(b.path))
      .slice(0, 6);

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const f = this.app.vault.getAbstractFileByPath(item.path);
      item.file = f;
      item.title = f && f.basename ? f.basename : item.path;
      item.excerpt = "";
      if (f && f.stat) {
        try {
          const raw = await this.app.vault.cachedRead(f);
          item.excerpt = kinExcerpt(raw, 230);
        } catch (e) {}
      }
    }
    return list.filter((item) => item.file);
  }

  // Lexical similarity: cosine between term vectors of the two notes (stop-words removed, word endings
  // folded). Works the same for Cyrillic and Latin text. Results are cached per file version.
  async kinVector(f) {
    if (!this.kinVectors) this.kinVectors = new Map();
    const hit = this.kinVectors.get(f.path);
    if (hit && hit.mtime === f.stat.mtime) return hit.vec;
    let raw = "";
    try {
      raw = await this.app.vault.cachedRead(f);
    } catch (e) {
      return null;
    }
    const body = raw
      .replace(/\r\n/g, "\n")
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .replace(/```[\s\S]*?```/g, " ");
    const tf = new Map();
    keyWords(body + " " + f.basename).forEach((w) => {
      const st = keyStem(w);
      tf.set(st, (tf.get(st) || 0) + 1);
    });
    let norm = 0;
    tf.forEach((count, st) => {
      const weight = 1 + Math.log(count);
      tf.set(st, weight);
      norm += weight * weight;
    });
    const vec = { tf, norm: Math.sqrt(norm) || 1, size: tf.size };
    if (this.kinVectors.size > 900) this.kinVectors.clear();
    this.kinVectors.set(f.path, { mtime: f.stat.mtime, vec });
    return vec;
  }

  async kinSimilar(file, linked) {
    if (!this.kinSimCache) this.kinSimCache = new Map();
    const cached = this.kinSimCache.get(file.path);
    if (cached && cached.mtime === file.stat.mtime && Date.now() - cached.at < 120000) return cached.list;
    const me = await this.kinVector(file);
    if (!me || me.size < 8) return [];
    let files = this.app.vault.getMarkdownFiles();
    if (files.length > 400) files = files.slice().sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 400);
    const out = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.path === file.path || linked.has(f.path)) continue;
      const other = await this.kinVector(f);
      if (!other || other.size < 8) continue;
      const small = me.size <= other.size ? me : other;
      const large = small === me ? other : me;
      let dot = 0;
      small.tf.forEach((w, st) => {
        const w2 = large.tf.get(st);
        if (w2) dot += w * w2;
      });
      const score = dot / (me.norm * other.norm);
      if (score >= 0.2) out.push({ path: f.path, score: Math.round(score * 100) });
      if (i % 40 === 39) await new Promise((resolve) => setTimeout(resolve, 0)); // keep typing smooth on big vaults
      if (this._unloaded) return [];
    }
    out.sort((a, b) => b.score - a.score);
    const list = out.slice(0, 3);
    if (this.kinSimCache.size > 40) this.kinSimCache.clear();
    this.kinSimCache.set(file.path, { mtime: file.stat.mtime, at: Date.now(), list });
    return list;
  }

  kinBuild(host, file, related, signature, mode) {
    const L = (dict) => i18n(dict, this);
    const kindInfo = {
      out: { glyph: "→", label: L({ en: "links to", ru: "ссылка", zh: "链接", ja: "リンク", es: "enlace", de: "Link" }) },
      in: { glyph: "←", label: L({ en: "links here", ru: "ссылается сюда", zh: "反向链接", ja: "バックリンク", es: "enlaza aquí", de: "Rücklink" }) },
      both: { glyph: "↔", label: L({ en: "two-way", ru: "взаимная", zh: "双向", ja: "相互", es: "mutuo", de: "beidseitig" }) },
      sim: { glyph: "≈", label: L({ en: "similar", ru: "похожая", zh: "相似", ja: "類似", es: "similar", de: "ähnlich" }) },
    };

    const footer = document.createElement("div");
    footer.className = "artcraft-kin";
    footer.dataset.sig = signature;
    footer.dataset.mode = mode;
    footer.contentEditable = "false";

    const head = footer.createDiv({ cls: "kin-head" });
    head.createSpan({ cls: "kin-head-title", text: L({ en: "Related notes", ru: "Связанные заметки", zh: "相关笔记", ja: "関連ノート", es: "Notas relacionadas", de: "Verwandte Notizen" }) });
    head.createSpan({ cls: "kin-head-count", text: String(related.length) });

    const stage = footer.createDiv({ cls: "kin-stage" });
    const NS = "http://www.w3.org/2000/svg";
    const uid = "kin" + Math.random().toString(36).slice(2, 8);
    // one shared arrowhead definition
    const defsSvg = document.createElementNS(NS, "svg");
    defsSvg.setAttribute("class", "kin-defs");
    defsSvg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(NS, "defs");
    const marker = document.createElementNS(NS, "marker");
    marker.setAttribute("id", uid);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8.5");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto-start-reverse");
    const arrow = document.createElementNS(NS, "path");
    arrow.setAttribute("d", "M1.5 1.5 L8.5 5 L1.5 8.5");
    arrow.setAttribute("class", "kin-arrowhead");
    marker.appendChild(arrow);
    defs.appendChild(marker);
    defsSvg.appendChild(defs);
    stage.appendChild(defsSvg);

    const root = stage.createDiv({ cls: "kin-root" });
    root.createSpan({ cls: "kin-root-dot" });
    root.createSpan({ cls: "kin-root-title", text: file.basename });

    const canopy = {
      footer,
      stage,
      root,
      leaves: [],
      W: 0,
      H: 0,
      baseH: 0,
      rootX: 0,
      rootY: 0,
      inView: false,
      reader: null,
      seg: null,
      rebakeTimer: null,
      pushTimer: null,
      pointer: { x: -9999, y: -9999, t: 0 },
      scroller: host.closest(".markdown-preview-view, .cm-scroller"),
      lastScrollTop: 0,
      reduced: !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    };

    related.forEach((item, idx) => {
      const info = kindInfo[item.kind] || kindInfo.sim;

      // each thread is its own tiny SVG element, so the compositor can move it without repainting
      const threadSvg = document.createElementNS(NS, "svg");
      threadSvg.setAttribute("class", "kin-thread-svg");
      threadSvg.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(NS, "path");
      path.setAttribute("class", "kin-thread kin-kind-" + item.kind);
      if (item.kind === "out" || item.kind === "both") path.setAttribute("marker-end", "url(#" + uid + ")");
      if (item.kind === "in" || item.kind === "both") path.setAttribute("marker-start", "url(#" + uid + ")");
      threadSvg.appendChild(path);
      stage.insertBefore(threadSvg, root);

      const el = stage.createEl("button", { cls: "kin-leaf kin-kind-" + item.kind });
      el.type = "button";
      const meta = el.createSpan({ cls: "kin-leaf-meta" });
      meta.createSpan({ cls: "kin-leaf-glyph", text: info.glyph });
      meta.createSpan({ cls: "kin-leaf-kind", text: item.kind === "sim" && item.score ? info.label + " " + item.score + "%" : info.label });
      el.createSpan({ cls: "kin-leaf-title", text: item.title });
      el.createSpan({ cls: "kin-leaf-body", text: item.excerpt });

      const leaf = {
        el, threadSvg, path, data: item,
        ax: 0, ay: 0, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, w: 0, h: 0,
        hover: false, open: false, phase: idx * 1.37 + 0.4, anim: null, threadAnim: null,
      };
      el.addEventListener("pointerenter", () => {
        leaf.hover = true;
        this.kinBake(canopy);
      });
      el.addEventListener("pointerleave", () => {
        leaf.hover = false;
        this.kinBake(canopy);
      });
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) this.kinOpenNote(item, true);
        else this.kinOpenLeaf(canopy, leaf);
      });
      canopy.leaves.push(leaf);
    });

    // The cursor moves air: slips near a fast pointer get pushed. Pushes are collected and applied in
    // one re-bake at most every 90 ms.
    canopy.onPointer = (e) => {
      const rect = stage.getBoundingClientRect();
      const now = performance.now();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const p = canopy.pointer;
      if (p.t && now - p.t < 120) {
        const dt = Math.max(8, now - p.t) / 1000;
        const vx = Math.max(-1400, Math.min(1400, (px - p.x) / dt));
        const vy = Math.max(-1400, Math.min(1400, (py - p.y) / dt));
        if (Math.abs(vx) + Math.abs(vy) > 160) {
          this.kinPush(canopy, (leaf, s) => {
            if (leaf.hover || leaf.open) return;
            const dx = s.x - px;
            const dy = s.y + leaf.h / 2 - py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 170) return;
            const fall = 1 - dist / 170;
            s.vx += vx * 0.11 * fall;
            s.vy += vy * 0.07 * fall;
          });
        }
      }
      p.x = px;
      p.y = py;
      p.t = now;
    };
    stage.addEventListener("pointermove", canopy.onPointer, { passive: true });

    // Scrolling the page drags the threads; the slips lag behind and swing back.
    if (canopy.scroller) {
      canopy.lastScrollTop = canopy.scroller.scrollTop;
      canopy.onScroll = () => {
        const top = canopy.scroller.scrollTop;
        const delta = top - canopy.lastScrollTop;
        canopy.lastScrollTop = top;
        if (!canopy.inView || !delta) return;
        const kick = Math.max(-150, Math.min(150, delta * 1.1));
        this.kinPush(canopy, (leaf, s) => {
          if (leaf.open) return;
          s.vy += kick;
          s.va += kick * 0.003 * (leaf.ax < canopy.rootX ? -1 : 1);
        });
      };
      canopy.scroller.addEventListener("scroll", canopy.onScroll, { passive: true });
    }

    canopy.onKey = (e) => {
      if (e.key === "Escape" && canopy.reader) {
        e.stopPropagation();
        this.kinCloseReader(canopy);
      }
    };
    footer.addEventListener("keydown", canopy.onKey);
    stage.addEventListener("click", (e) => {
      if (canopy.reader && !e.target.closest(".kin-reader")) this.kinCloseReader(canopy);
    });

    host.appendChild(footer);
    if (!this.kinCanopies) this.kinCanopies = new Map();
    this.kinCanopies.set(footer, canopy);

    this.kinLayout(canopy);
    if (typeof ResizeObserver !== "undefined") {
      canopy.ro = new ResizeObserver(() => {
        if (Math.abs(stage.clientWidth - canopy.W) <= 2 || canopy.layoutFrame) return;
        // layout changes the stage height; doing it in the next frame keeps the observer from re-firing in a loop
        canopy.layoutFrame = requestAnimationFrame(() => {
          canopy.layoutFrame = null;
          if (canopy.footer.isConnected) this.kinLayout(canopy);
        });
      });
      canopy.ro.observe(stage);
    }
    if (typeof IntersectionObserver !== "undefined") {
      canopy.io = new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting;
        if (visible === canopy.inView) return;
        canopy.inView = visible;
        footer.classList.toggle("is-in-view", visible);
        if (visible) this.kinBake(canopy);
        else this.kinRest(canopy);
      });
      canopy.io.observe(footer);
    } else {
      canopy.inView = true;
      this.kinBake(canopy);
    }
  }

  // Rest positions: slips hang in staggered rows under the root, each from its own thread.
  kinLayout(canopy) {
    const W = canopy.stage.clientWidth;
    if (!W) return;
    this.kinSyncState(canopy);
    canopy.W = W;
    const n = canopy.leaves.length;
    const cols = Math.max(1, Math.min(n, W >= 720 ? 3 : W >= 440 ? 2 : 1));
    const leafW = Math.min(232, Math.floor((W - (cols + 1) * 18) / cols));
    canopy.rootX = W / 2;
    canopy.rootY = 22;
    const ry = canopy.rootY + 9;
    let rowTop = 96;
    for (let start = 0; start < n; start += cols) {
      const row = canopy.leaves.slice(start, start + cols);
      const span = row.length * leafW + (row.length - 1) * 22;
      let rowH = 0;
      row.forEach((leaf, i) => {
        leaf.el.style.width = leafW + "px";
        leaf.w = leafW;
        leaf.h = leaf.el.offsetHeight || 120;
        leaf.ax = (W - span) / 2 + i * (leafW + 22) + leafW / 2;
        // neighbours hang at slightly different heights, like things tied by hand
        leaf.ay = rowTop + ((start + i) % 2 === 0 ? 0 : 20) + (i === 1 && row.length === 3 ? 14 : 0);
        leaf.x = leaf.ax;
        leaf.y = leaf.ay;
        leaf.vx = leaf.vy = leaf.va = 0;
        leaf.a = 0;
        // the thread at rest, in stage coordinates; motion is an affine map of this curve about the root
        leaf.dy0 = leaf.ay - 3 - ry;
        const d =
          "M" + canopy.rootX.toFixed(1) + "," + ry.toFixed(1) +
          " C" + canopy.rootX.toFixed(1) + "," + (ry + leaf.dy0 * 0.62).toFixed(1) +
          " " + leaf.ax.toFixed(1) + "," + (ry + leaf.dy0 * 0.34).toFixed(1) +
          " " + leaf.ax.toFixed(1) + "," + (leaf.ay - 3).toFixed(1);
        leaf.restD = d;
        if (!leaf.open) leaf.path.setAttribute("d", d);
        leaf.threadSvg.style.transformOrigin = canopy.rootX.toFixed(1) + "px " + ry.toFixed(1) + "px";
        rowH = Math.max(rowH, leaf.ay - rowTop + leaf.h);
      });
      rowTop += rowH + 44;
    }
    canopy.baseH = rowTop - 8;
    if (!canopy.reader) {
      canopy.H = canopy.baseH;
      canopy.stage.style.height = canopy.H + "px";
    }
    canopy.root.style.transform = "translate3d(" + Math.round(canopy.rootX) + "px, " + canopy.rootY + "px, 0) translate(-50%, -50%)";
    canopy.seg = null;
    this.kinPlace(canopy);
    if (canopy.inView) this.kinBake(canopy);
  }

  kinLeafTransform(leaf, x, y, a) {
    return "translate3d(" + (x - leaf.w / 2).toFixed(2) + "px, " + y.toFixed(2) + "px, 0) rotate(" + a.toFixed(4) + "rad)";
  }

  kinThreadTransform(canopy, leaf, x, y) {
    const ry = canopy.rootY + 9;
    const shear = (x - leaf.ax) / leaf.dy0;
    const stretch = (y - 3 - ry) / leaf.dy0;
    return "matrix(1, 0, " + shear.toFixed(5) + ", " + stretch.toFixed(5) + ", 0, 0)";
  }

  // Static placement from the current state (no animation running).
  kinPlace(canopy) {
    canopy.leaves.forEach((leaf) => {
      leaf.el.style.transform = this.kinLeafTransform(leaf, leaf.x, leaf.y, leaf.a);
      if (!leaf.open) leaf.threadSvg.style.transform = this.kinThreadTransform(canopy, leaf, leaf.x, leaf.y);
    });
  }

  // Reads where every slip is right now on its baked trajectory.
  kinSyncState(canopy) {
    const seg = canopy.seg;
    if (!seg) return;
    const idx = Math.max(0, Math.min(seg.samples - 1, Math.round((performance.now() - seg.t0) / seg.stepMs)));
    canopy.leaves.forEach((leaf, i) => {
      const s = seg.states[i][idx];
      leaf.x = s[0];
      leaf.y = s[1];
      leaf.vx = s[2];
      leaf.vy = s[3];
      leaf.a = s[4];
      leaf.va = s[5];
    });
  }

  // Collects pushes and applies them in one re-bake.
  kinPush(canopy, fn) {
    if (!canopy.inView || canopy.reduced) return;
    if (!canopy.pending) canopy.pending = [];
    canopy.pending.push(fn);
    if (canopy.pushTimer) return;
    canopy.pushTimer = setTimeout(() => {
      canopy.pushTimer = null;
      const fns = canopy.pending || [];
      canopy.pending = null;
      this.kinBake(canopy, (leaf, s) => fns.forEach((f) => f(leaf, s)));
    }, 90);
  }

  // Runs the simulation ahead and hands the trajectory to the compositor.
  kinBake(canopy, push) {
    if (this._unloaded || !canopy.footer.isConnected) return;
    if (canopy.rebakeTimer) {
      clearTimeout(canopy.rebakeTimer);
      canopy.rebakeTimer = null;
    }
    this.kinSyncState(canopy);
    if (push) {
      canopy.leaves.forEach((leaf) => push(leaf, leaf));
    }
    if (!canopy.inView || canopy.reduced || document.hidden) {
      this.kinRest(canopy);
      return;
    }
    const HORIZON = 6; // seconds simulated ahead
    const RATE = 30; // keyframes per second; the compositor interpolates between them
    const SUB = 4; // physics steps per keyframe
    const samples = HORIZON * RATE + 1;
    const dt = 1 / (RATE * SUB);
    const now = performance.now();
    let t = now / 1000;
    const states = canopy.leaves.map(() => new Array(samples));
    for (let k = 0; k < samples; k++) {
      for (let i = 0; i < canopy.leaves.length; i++) {
        const leaf = canopy.leaves[i];
        states[i][k] = [leaf.x, leaf.y, leaf.vx, leaf.vy, leaf.a, leaf.va];
      }
      if (k === samples - 1) break;
      for (let s = 0; s < SUB; s++) {
        this.kinStep(canopy, dt, t);
        t += dt;
      }
    }
    const timing = { duration: HORIZON * 1000, easing: "linear", fill: "forwards" };
    canopy.leaves.forEach((leaf, i) => {
      const leafFrames = new Array(samples);
      const threadFrames = new Array(samples);
      for (let k = 0; k < samples; k++) {
        const s = states[i][k];
        leafFrames[k] = { transform: this.kinLeafTransform(leaf, s[0], s[1], s[4]) };
        threadFrames[k] = { transform: this.kinThreadTransform(canopy, leaf, s[0], s[1]) };
      }
      if (leaf.anim) leaf.anim.cancel();
      if (leaf.threadAnim) leaf.threadAnim.cancel();
      leaf.anim = leaf.el.animate(leafFrames, timing);
      leaf.threadAnim = leaf.open ? null : leaf.threadSvg.animate(threadFrames, timing);
      // leave the simulation state at the start of the segment; kinSyncState moves it forward
      const s0 = states[i][0];
      leaf.x = s0[0];
      leaf.y = s0[1];
      leaf.vx = s0[2];
      leaf.vy = s0[3];
      leaf.a = s0[4];
      leaf.va = s0[5];
    });
    canopy.seg = { t0: now, stepMs: 1000 / RATE, samples, states };
    canopy.rebakeTimer = setTimeout(() => {
      canopy.rebakeTimer = null;
      this.kinBake(canopy);
    }, HORIZON * 1000 - 150);
  }

  // Stops all motion and leaves the slips where they are (block scrolled away, window hidden, reduced motion).
  kinRest(canopy) {
    if (canopy.rebakeTimer) {
      clearTimeout(canopy.rebakeTimer);
      canopy.rebakeTimer = null;
    }
    this.kinSyncState(canopy);
    canopy.seg = null;
    canopy.leaves.forEach((leaf) => {
      if (leaf.anim) {
        leaf.anim.cancel();
        leaf.anim = null;
      }
      if (leaf.threadAnim) {
        leaf.threadAnim.cancel();
        leaf.threadAnim = null;
      }
    });
    this.kinPlace(canopy);
  }

  // Wakes every block that is on screen (called when the window becomes visible again).
  kinStartLoop() {
    if (this._unloaded || !this.kinCanopies) return;
    this.kinCanopies.forEach((canopy, el) => {
      if (!el.isConnected) {
        this.kinDispose(canopy);
        this.kinCanopies.delete(el);
        return;
      }
      if (canopy.inView) this.kinBake(canopy);
    });
  }

  kinStep(canopy, dt, t) {
    const K = 30; // spring to the hanging point, 1/s^2
    const C = 3.3; // air drag: underdamped, so a pushed slip swings a few times
    const KA = 44;
    const CA = 4.4;
    const calm = canopy.reader ? 0.4 : 1;
    for (let i = 0; i < canopy.leaves.length; i++) {
      const leaf = canopy.leaves[i];
      // the gust front travels left to right: slips further right feel it later
      const tt = t - (leaf.ax / Math.max(1, canopy.W)) * 0.9;
      const breeze =
        Math.sin(tt * 0.83 + leaf.phase) * 0.55 + Math.sin(tt * 0.37 + leaf.phase * 1.7) * 0.3 + Math.sin(tt * 1.71 + leaf.phase * 0.6) * 0.15;
      const gust = Math.pow(Math.max(0, Math.sin(tt * 0.13 + 1.1)), 6) * 2.3;
      const still = leaf.hover || leaf.open ? 0.1 : 1; // a slip under the cursor holds still so it can be read and clicked
      const windX = (breeze * 210 + gust * 400) * calm * still;
      const windY = (Math.cos(tt * 0.61 + leaf.phase) * 70 - gust * 110) * calm * still;
      const drag = leaf.hover ? C * 2.4 : C;
      leaf.vx += (windX - K * (leaf.x - leaf.ax) - drag * leaf.vx) * dt;
      leaf.vy += (windY - K * (leaf.y - leaf.ay) - drag * leaf.vy) * dt;
      leaf.x += leaf.vx * dt;
      leaf.y += leaf.vy * dt;
      const lean = Math.max(-0.2, Math.min(0.2, (breeze * 0.05 + gust * 0.06) * calm * still - leaf.vx * 0.0036));
      leaf.va += (-KA * (leaf.a - lean) - CA * leaf.va) * dt;
      leaf.a += leaf.va * dt;
    }
  }

  // Opening a slip: it grows into a reading card from where it hangs (spring-driven), the text clears
  // block by block, the other slips are blown aside and dimmed. Click the title to go to the note.
  async kinOpenLeaf(canopy, leaf) {
    if (canopy.opening) return;
    if (canopy.reader) {
      const same = canopy.reader.leaf === leaf;
      await this.kinCloseReader(canopy);
      if (same) return;
    }
    canopy.opening = true;
    try {
      const obsidian = require("obsidian");
      const L = (dict) => i18n(dict, this);
      const from = leaf.el.getBoundingClientRect();
      const stageRect = canopy.stage.getBoundingClientRect();

      const card = canopy.stage.createDiv({ cls: "kin-reader kin-kind-" + leaf.data.kind });
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-label", leaf.data.title);
      const width = Math.min(canopy.W - 16, 640);
      const left = (canopy.W - width) / 2;
      const top = canopy.rootY + 54;
      card.style.width = width + "px";
      card.style.left = left + "px";
      card.style.top = top + "px";

      const bar = card.createDiv({ cls: "kin-reader-bar" });
      const title = bar.createEl("button", { cls: "kin-reader-title", text: leaf.data.title });
      title.type = "button";
      title.addEventListener("click", (e) => this.kinOpenNote(leaf.data, e.ctrlKey || e.metaKey));
      const open = bar.createEl("button", { cls: "kin-reader-open", text: L({ en: "Open note", ru: "Открыть заметку", zh: "打开笔记", ja: "ノートを開く", es: "Abrir nota", de: "Notiz öffnen" }) });
      open.type = "button";
      open.addEventListener("click", (e) => this.kinOpenNote(leaf.data, e.ctrlKey || e.metaKey));
      const close = bar.createEl("button", { cls: "kin-reader-close", text: "×" });
      close.type = "button";
      close.setAttribute("aria-label", L({ en: "Close", ru: "Закрыть", zh: "关闭", ja: "閉じる", es: "Cerrar", de: "Schließen" }));
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        this.kinCloseReader(canopy);
      });

      const body = card.createDiv({ cls: "kin-reader-body markdown-rendered" });
      const component = new obsidian.Component();
      component.load();
      let raw = "";
      try {
        raw = await this.app.vault.cachedRead(leaf.data.file);
      } catch (e) {}
      const md = kinReaderMarkdown(raw, 1500);
      try {
        await obsidian.MarkdownRenderer.render(this.app, md.text, body, leaf.data.path, component);
      } catch (e) {
        body.setText(kinExcerpt(raw, 900));
      }
      if (md.truncated) body.createDiv({ cls: "kin-reader-more", text: "…" });
      if (!canopy.footer.isConnected) {
        component.unload();
        return;
      }

      const to = card.getBoundingClientRect();
      const need = to.bottom - stageRect.top + 28;
      if (need > canopy.H) {
        canopy.H = need;
        canopy.stage.style.height = need + "px";
      }
      canopy.reader = { el: card, leaf, component };
      leaf.open = true;
      leaf.el.classList.add("is-open");
      canopy.stage.classList.add("has-reader");

      // the opened slip's thread now runs to the top of the card
      if (leaf.threadAnim) {
        leaf.threadAnim.cancel();
        leaf.threadAnim = null;
      }
      const ry = canopy.rootY + 9;
      const cx = left + width / 2;
      leaf.threadSvg.style.transform = "none";
      leaf.path.setAttribute(
        "d",
        "M" + canopy.rootX.toFixed(1) + "," + ry.toFixed(1) + " L" + cx.toFixed(1) + "," + (top - 3).toFixed(1)
      );

      // push the neighbours away from where the card lands
      const cy = top + Math.min(to.height, 260) / 2;
      this.kinBake(canopy, (other, s) => {
        if (other === leaf) return;
        const dx = s.x - cx;
        const dy = s.y + other.h / 2 - cy;
        const dist = Math.max(40, Math.sqrt(dx * dx + dy * dy));
        s.vx += (dx / dist) * 260;
        s.vy += (dy / dist) * 150;
        s.va += (dx > 0 ? 1 : -1) * 0.9;
      });

      if (!canopy.reduced && card.animate) {
        const sx = from.width / to.width;
        const sy = from.height / to.height;
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        card.style.transformOrigin = "0 0";
        const frames = kinSpringFrames(210, 21, 34).map((p) => {
          const q = 1 - p; // q: 1 at the slip, 0 at rest (dips below 0 on the overshoot)
          return {
            transform:
              "translate(" + (dx * q).toFixed(2) + "px, " + (dy * q).toFixed(2) + "px) scale(" + (1 + (sx - 1) * q).toFixed(4) + ", " + (1 + (sy - 1) * q).toFixed(4) + ")",
          };
        });
        card.animate(frames, { duration: 640, easing: "linear", fill: "both" });
        card.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 220, easing: "ease-out", fill: "both" });
        // the mist lifts top to bottom, one block after another
        Array.from(body.children)
          .slice(0, 14)
          .forEach((block, i) => {
            block.animate(
              [
                { opacity: 0, transform: "translateY(5px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 200, delay: i * 12, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
            );
          });
      }
      // Bring the card into view by scrolling the note itself. scrollIntoView would also scroll the pane
      // around it (it scrolls every ancestor, even ones with hidden overflow) and push the tool row
      // under the tab header.
      const sc = canopy.scroller;
      if (sc) {
        const cr = card.getBoundingClientRect();
        const sr = sc.getBoundingClientRect();
        let delta = 0;
        if (cr.bottom > sr.bottom - 16) delta = Math.min(cr.bottom - sr.bottom + 24, cr.top - sr.top - 16);
        else if (cr.top < sr.top + 8) delta = cr.top - sr.top - 16;
        if (Math.abs(delta) > 2) sc.scrollBy({ top: delta, behavior: canopy.reduced ? "auto" : "smooth" });
      }
      title.focus({ preventScroll: true });
    } finally {
      canopy.opening = false;
    }
  }

  kinCloseReader(canopy) {
    const reader = canopy.reader;
    if (!reader) return Promise.resolve();
    canopy.reader = null;
    const leaf = reader.leaf;
    const card = reader.el;
    const finish = () => {
      try {
        reader.component.unload();
      } catch (e) {}
      card.remove();
      leaf.open = false;
      leaf.el.classList.remove("is-open");
      canopy.stage.classList.remove("has-reader");
      leaf.path.setAttribute("d", leaf.restD);
      canopy.H = canopy.baseH;
      canopy.stage.style.height = canopy.H + "px";
      // the slip drops back onto its thread and swings
      this.kinBake(canopy, (other, s) => {
        if (other !== leaf) return;
        s.vy += 150;
        s.va += leaf.ax < canopy.rootX ? -1.3 : 1.3;
      });
    };
    if (canopy.reduced || !card.animate) {
      finish();
      return Promise.resolve();
    }
    const from = card.getBoundingClientRect();
    const to = leaf.el.getBoundingClientRect();
    const anim = card.animate(
      [
        { transform: "translate(0px, 0px) scale(1, 1)", opacity: 1 },
        {
          transform:
            "translate(" + (to.left - from.left).toFixed(1) + "px, " + (to.top - from.top).toFixed(1) + "px) scale(" + (to.width / from.width).toFixed(4) + ", " + (to.height / from.height).toFixed(4) + ")",
          opacity: 0,
        },
      ],
      { duration: 260, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "both" }
    );
    return anim.finished.then(finish, finish);
  }

  async kinOpenNote(item, newTab) {
    const f = this.app.vault.getAbstractFileByPath(item.path);
    if (f) await this.app.workspace.getLeaf(newTab ? "tab" : false).openFile(f);
  }

  kinDispose(canopy) {
    try {
      if (canopy.rebakeTimer) clearTimeout(canopy.rebakeTimer);
      if (canopy.pushTimer) clearTimeout(canopy.pushTimer);
      canopy.rebakeTimer = null;
      canopy.pushTimer = null;
      canopy.leaves.forEach((leaf) => {
        if (leaf.anim) leaf.anim.cancel();
        if (leaf.threadAnim) leaf.threadAnim.cancel();
      });
      if (canopy.io) canopy.io.disconnect();
      if (canopy.ro) canopy.ro.disconnect();
      if (canopy.scroller && canopy.onScroll) canopy.scroller.removeEventListener("scroll", canopy.onScroll);
      if (canopy.reader && canopy.reader.component) canopy.reader.component.unload();
    } catch (e) {}
    canopy.reader = null;
    canopy.inView = false;
  }

  kinDestroyIn(container) {
    container.querySelectorAll(".artcraft-kin").forEach((el) => {
      const canopy = this.kinCanopies && this.kinCanopies.get(el);
      if (canopy) {
        this.kinDispose(canopy);
        this.kinCanopies.delete(el);
      }
      el.remove();
    });
  }

  kinDestroyAll() {
    if (this.kinCanopies) {
      this.kinCanopies.forEach((canopy, el) => {
        this.kinDispose(canopy);
        el.remove();
      });
      this.kinCanopies.clear();
    }
    document.querySelectorAll(".artcraft-kin").forEach((el) => el.remove());
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

      // cheap pre-check: is there anything on this line the token pass could style?
      const hasTokens =
        /(?:0[1-4]\s*\/\/|\d\s?(?:%|[$€₽]|[kKкК]|тыс|млн|млрд|USD)|[$€₽]\d|https?:\/\/|\.(?:com|io|org|ru|dev|net|ai)|0x[a-fA-F0-9]{4,}|[1-9A-HJ-NP-Za-km-z]{32,}|TRC20|BEP20|ERC20|EVM|SOL|TON|Bybit|Binance|UID\s*\d+|✅|\d{4}-\d{2}-\d{2})/.test(
          text
        );

      if (!hasTokens && isLivePreview) return;

      const frag = document.createDocumentFragment();
      if (!isLivePreview && this.settings.sentenceFocus) {
        // Split on real sentence ends only: "1.5", "$4.99" and "т. е." stay inside their sentence.
        const sentences = [];
        let cut = 0;
        keySplitSentences(text).forEach((r) => {
          if (r.start > cut) sentences.push(text.slice(cut, r.start));
          sentences.push(text.slice(r.start, r.end));
          cut = r.end;
        });
        if (cut < text.length) sentences.push(text.slice(cut));
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
    // Word edges are written as look-arounds over Unicode letters and digits. The plain \b only knows
    // ASCII, so "50%", "10 $" and "5 тыс" never matched: \b cannot follow "%" or a Cyrillic letter.
    // A long base58 run counts as an address only when it contains a digit (so long words are left alone).
    const tokenRegex =
      /((?<![\p{L}\p{N}])0[1-4]\s*\/\/|(?<![\p{L}\p{N}])(?:[$€₽]\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?(?:[–-]\d+(?:[.,]\d+)?)?\s?(?:%|[$€₽]|[kKкК]|тыс\.?|млн|млрд|USDT|USD))(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])https?:\/\/[^\s<]+|(?<![\p{L}\p{N}.-])[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:com|io|org|ru|dev|net|ai)(?![\p{L}\p{N}])(?:\/[^\s<]*)?|(?<![\p{L}\p{N}])0x[a-fA-F0-9]{40}(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])(?=[1-9A-HJ-NP-Za-km-z]*\d)[1-9A-HJ-NP-Za-km-z]{32,44}(?![\p{L}\p{N}])|(?<![\p{L}\p{N}])(?:TRC20|BEP20|ERC20|EVM|SOL|TON|Bybit|Binance|UID\s*\d+)(?![\p{L}\p{N}])|✅\s*(?:\d{4}-\d{2}-\d{2})?|✅|(?<![\p{L}\p{N}])\d{4}-\d{2}-\d{2}(?![\p{L}\p{N}]))/gu;

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
        span.style.backgroundColor = color;
        span.style.color = "#FFFFFF";
        parent.appendChild(span);
        parent.appendChild(document.createTextNode(" // "));
      } else if (stepMatch) {
        // step badges are switched off: a "01 //" marker is ordinary text, not a capsule
        parent.appendChild(document.createTextNode(matchStr));
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
      } else if (/^(?:[$€₽]\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?(?:[–-]\d+(?:[.,]\d+)?)?\s?(?:%|[$€₽]|[kKкК]|тыс\.?|млн|млрд|USDT|USD))$/.test(matchStr)) {
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

  // --- KEY SENTENCE MARKER (reading view) ---
  // Finds the sentences that carry the note's subject and underlines them with a highlighter stroke, so a
  // reader scanning the page lands on them first. Everything is computed locally from the note itself:
  // a sentence scores high when it packs many of the note's repeated, meaningful words (heading words
  // count extra), with a small bonus for figures and for cue words such as "therefore" or "важно".
  async getKeySentenceModel(sourcePath) {
    const file = this.app.vault.getAbstractFileByPath(sourcePath);
    if (!file || !file.stat || file.extension !== "md") return null;
    if (!this.keyModelCache) this.keyModelCache = new Map();
    const cached = this.keyModelCache.get(sourcePath);
    if (cached && cached.mtime === file.stat.mtime) return cached.model;
    let raw = "";
    try {
      raw = await this.app.vault.cachedRead(file);
    } catch (e) {
      return null;
    }
    const model = this.buildKeySentenceModel(raw, file.basename);
    if (this.keyModelCache.size > 60) this.keyModelCache.clear();
    this.keyModelCache.set(sourcePath, { mtime: file.stat.mtime, model });
    return model;
  }

  buildKeySentenceModel(markdown, title) {
    const body = markdown
      .replace(/\r\n/g, "\n")
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`\n]*`/g, " ");
    const headingWords = [];
    const sentences = [];
    const allWords = [];
    const collect = (text) => {
      const words = keyWords(text);
      for (let i = 0; i < words.length; i++) allWords.push(words[i]);
      return words;
    };
    collect(title || "").forEach((w) => headingWords.push(w));

    body.split(/\n{2,}/).forEach((para) => {
      const lines = para.split("\n");
      const prose = [];
      lines.forEach((line) => {
        if (/^\s*\|/.test(line) || /^\s*(?:[-*_]\s*){3,}$/.test(line)) return;
        const heading = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
        const plain = keyPlainText(heading ? heading[1] : line);
        if (heading) {
          collect(plain).forEach((w) => headingWords.push(w));
          return;
        }
        if (/^\s*(?:[-*+]|\d+[.)])\s+\[.\]\s/.test(line)) {
          collect(plain); // a task is something to do, not a statement to highlight
          return;
        }
        if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
          // each list item is its own unit
          collect(plain);
          keySplitSentences(plain).forEach((r) => sentences.push(plain.slice(r.start, r.end)));
          return;
        }
        prose.push(plain);
      });
      if (prose.length) {
        const text = prose.join(" ");
        collect(text);
        keySplitSentences(text).forEach((r) => sentences.push(text.slice(r.start, r.end)));
      }
    });

    const tf = new Map();
    allWords.forEach((w) => {
      const st = keyStem(w);
      tf.set(st, (tf.get(st) || 0) + 1);
    });
    const weights = new Map();
    tf.forEach((count, st) => {
      if (count >= 2) weights.set(st, Math.log(1 + count));
    });
    headingWords.forEach((w) => {
      const st = keyStem(w);
      weights.set(st, Math.max(0.7, (weights.get(st) || 0) * 1.6));
    });

    const scores = sentences.map((s) => keyScoreSentence(s, weights)).filter((v) => v > 0);
    if (scores.length < 5) return null; // a short note needs no guide
    scores.sort((a, b) => b - a);
    const keep = Math.max(1, Math.min(14, Math.round(scores.length * 0.16)));
    return { weights, threshold: scores[keep - 1] };
  }

  markKeySentences(rootEl, model) {
    const blocks = rootEl.matches && rootEl.matches("p, li") ? [rootEl] : Array.from(rootEl.querySelectorAll("p, li"));
    blocks.forEach((block) => {
      if (block.dataset.artcraftKeyDone === "1") return;
      block.dataset.artcraftKeyDone = "1";
      if (block.closest("table, pre, .callout-title, .task-list-item, .artcraft-wind-chain-footer")) return;
      if (block.tagName === "LI" && block.querySelector(":scope > p")) return; // its <p> children are handled on their own

      // Text nodes of this block in document order, skipping code and nested lists
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      let full = "";
      let node;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || parent.closest("code, pre, .math, .artcraft-key-mark")) continue;
        if (block.tagName === "LI" && parent.closest("ul, ol") !== block.parentElement) continue;
        nodes.push({ node, start: full.length });
        full += node.nodeValue;
      }
      if (full.trim().length < 30) return;

      const picked = keySplitSentences(full)
        .map((r) => ({ start: r.start, end: r.end, score: keyScoreSentence(full.slice(r.start, r.end), model.weights) }))
        .filter((r) => r.score > 0 && r.score >= model.threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .sort((a, b) => b.start - a.start); // wrap from the end so earlier offsets stay valid

      picked.forEach((range) => {
        const pieces = [];
        for (let i = nodes.length - 1; i >= 0; i--) {
          const item = nodes[i];
          const len = item.node.nodeValue.length;
          const a = Math.max(range.start, item.start) - item.start;
          const b = Math.min(range.end, item.start + len) - item.start;
          if (b <= a) continue;
          const mid = a > 0 ? item.node.splitText(a) : item.node;
          if (b - a < mid.nodeValue.length) mid.splitText(b - a);
          const mark = document.createElement("span");
          mark.className = "artcraft-key-mark";
          mid.parentNode.replaceChild(mark, mid);
          mark.appendChild(mid);
          pieces.unshift(mark);
        }
        if (!pieces.length) return;
        // One continuous stroke across all pieces: each piece starts when the previous one ends.
        const total = pieces.reduce((sum, el) => sum + el.textContent.length, 0) || 1;
        const duration = Math.max(450, Math.min(1100, total * 9));
        let before = 0;
        pieces.forEach((el) => {
          const len = el.textContent.length;
          el.style.setProperty("--key-delay", Math.round((before / total) * duration) + "ms");
          el.style.setProperty("--key-time", Math.max(60, Math.round((len / total) * duration)) + "ms");
          before += len;
        });
        pieces[0].classList.add("is-key-start");
        pieces[0].artcraftKeyPieces = pieces;
        this.observeKeyMark(pieces[0]);
      });
    });
  }

  // The stroke is drawn the first time the sentence scrolls into view.
  observeKeyMark(startEl) {
    if (typeof IntersectionObserver === "undefined") {
      (startEl.artcraftKeyPieces || [startEl]).forEach((el) => el.classList.add("is-inked"));
      return;
    }
    if (!this.keyMarkObserver) {
      this.keyMarkObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.keyMarkObserver.unobserve(entry.target);
            (entry.target.artcraftKeyPieces || [entry.target]).forEach((el) => el.classList.add("is-inked"));
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.4 }
      );
    }
    this.keyMarkObserver.observe(startEl);
  }

  async toggleKeySentenceMarker() {
    this.settings.keySentenceMarker = this.settings.keySentenceMarker === false;
    await this.saveSettings();
    this.applyBodyClasses();
    this.rerenderReadingViews();
    const on = this.settings.keySentenceMarker !== false;
    new Notice(
      on
        ? i18n({ en: "Key sentence marker: on (reading view)", ru: "Маркер ключевых предложений: включён (режим чтения)", zh: "关键句标记：已开启（阅读视图）", ja: "重要文マーカー：オン（閲覧モード）", es: "Marcador de frases clave: activado (vista de lectura)", de: "Kernsatz-Markierung: an (Leseansicht)" }, this)
        : i18n({ en: "Key sentence marker: off", ru: "Маркер ключевых предложений: выключен", zh: "关键句标记：已关闭", ja: "重要文マーカー：オフ", es: "Marcador de frases clave: desactivado", de: "Kernsatz-Markierung: aus" }, this)
    );
  }

  rerenderReadingViews() {
    this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
      const view = leaf.view;
      if (view && view.previewMode && typeof view.previewMode.rerender === "function") {
        view.previewMode.rerender(true);
      }
    });
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
      this.settings.dockSide = "right";
    }

    const badge = document.createElement("span");
    badge.className = "artcraft-dock-badge";
    badge.title = t("dockCollapseTip", this);
    badge.innerHTML = `<span class="artcraft-dock-badge-full">${ALCHEMY_ICON_SVG}<span class="artcraft-badge-text">ALCHEMY CRAFT</span></span><span class="artcraft-dock-badge-short">
      <div class="artcraft-flask-wrap">
        ${ALCHEMY_ICON_SVG}
        <div class="artcraft-familiar-stage" aria-hidden="true">
          <div class="artcraft-familiar-paw">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <ellipse cx="10" cy="14" rx="4.5" ry="3.5" fill="#69BD28"/>
              <circle cx="6" cy="8.5" r="1.8" fill="#69BD28"/>
              <circle cx="10" cy="7" r="2" fill="#69BD28"/>
              <circle cx="14" cy="8.5" r="1.8" fill="#69BD28"/>
              <circle cx="10" cy="13.5" r="1.8" fill="#FFFFFF" opacity="0.6"/>
            </svg>
          </div>
          <div class="artcraft-familiar-smile">
            <svg viewBox="0 0 24 16" fill="none" stroke="#69BD28" stroke-width="1.8" stroke-linecap="round">
              <path d="M5 5 C6.5 2, 8.5 2, 10 5" />
              <path d="M14 5 C15.5 2, 17.5 2, 19 5" />
              <path d="M4 8 C8 15, 16 15, 20 8" />
            </svg>
          </div>
          <div class="artcraft-familiar-ears">
            <svg viewBox="0 0 24 12" fill="#69BD28">
              <polygon points="5,11 2,3 9,8" />
              <polygon points="19,11 22,3 15,8" />
            </svg>
          </div>
          <div class="artcraft-familiar-vapour">
            <span class="vapour-ring r1"></span>
            <span class="vapour-ring r2"></span>
            <span class="vapour-ring r3"></span>
          </div>
        </div>
      </div>
    </span>`;
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDockCollapse();
    });
    dock.appendChild(badge);

    const contentWrap = document.createElement("div");
    contentWrap.className = "artcraft-dock-content";
    contentWrap.addEventListener("pointerdown", (e) => e.stopPropagation());
    contentWrap.addEventListener("click", (e) => e.stopPropagation());

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
      this.togglePomodoroPopover(this.timerEl);
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
    this.btnZen.innerHTML = `${sicraftIcon('zen')}<span class="artcraft-btn-label">${t("zenBtn", this)}</span>`;
    this.btnZen.addEventListener("click", () => {
      this.triggerZenCameraTransition(!this.zenMode);
    });
    contentWrap.appendChild(this.btnZen);

    // 2. Focus & Book Studio Submenu button (Click or Right-click opens Craft Submenu with checkboxes)
    this.btnSentence = document.createElement("button");
    this.btnSentence.className = "artcraft-dock-btn";
    this.btnSentence.title =
      (this.settings.uiLanguage || "en") === "ru"
        ? "Меню фокуса: предложение, абзац, книжная страница, закладки, штамп"
        : "Focus menu: sentence, paragraph, book page, stickers, stamp";
    this.btnSentence.innerHTML = `${sicraftIcon('focus')}<span class="artcraft-btn-label">${t("focusBtn", this)}</span><span class="artcraft-btn-caret">▾</span>`;
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

    // 3. Laser Pointer button (LMB: Toggle / Open Menu | RMB or Caret: Open Laser Studio Menu)
    this.btnLaser = document.createElement("button");
    this.btnLaser.className = "artcraft-dock-btn";
    this.btnLaser.title = t("laserTip", this);
    this.btnLaser.innerHTML = `${SICRAFT_SVGS.laser}<span class="artcraft-btn-label">${t("laserBtn", this)}</span><span class="artcraft-btn-caret" data-laser-menu="1">▾</span>`;
    this.btnLaser.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target && e.target.closest && e.target.closest("[data-laser-menu]")) {
        this.toggleLaserPopover(this.btnLaser);
        return;
      }
      if (this.mode !== "laser") {
        this.toggleMode("laser");
        this.toggleLaserPopover(this.btnLaser);
      } else if (!this.laserPopoverEl) {
        this.toggleLaserPopover(this.btnLaser);
      } else {
        this.closeAllDockPopovers();
        this.toggleMode("none");
      }
    });
    this.btnLaser.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleLaserPopover(this.btnLaser);
    });
    contentWrap.appendChild(this.btnLaser);

    // 4. Draw Marker button (LMB: Toggle / Open Menu | RMB or Caret: Open Draw Studio Menu)
    this.btnDraw = document.createElement("button");
    this.btnDraw.className = "artcraft-dock-btn";
    this.btnDraw.title = t("drawTip", this);
    this.btnDraw.innerHTML = `${SICRAFT_SVGS.draw}<span class="artcraft-btn-label">${t("drawBtn", this)}</span><span class="artcraft-btn-caret" data-draw-menu="1">▾</span>`;
    this.btnDraw.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target && e.target.closest && e.target.closest("[data-draw-menu]")) {
        this.toggleDrawPopover(this.btnDraw);
        return;
      }
      if (this.mode !== "draw") {
        this.toggleMode("draw");
        this.toggleDrawPopover(this.btnDraw);
      } else if (!this.drawPopoverEl) {
        this.toggleDrawPopover(this.btnDraw);
      } else {
        this.closeAllDockPopovers();
        this.toggleMode("none");
      }
    });
    this.btnDraw.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleDrawPopover(this.btnDraw);
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
        this.settings.drawColor = p.color;
        this.settings.laserColor = p.color;
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
      this.btnCleanAI.innerHTML = `${sicraftIcon('spark')}<span class="artcraft-btn-label">${t("aiCleanBtn", this)}</span>`;
      this.btnCleanAI.addEventListener("click", () => {
        this.cleanCurrentNoteAIWatermarks();
      });
      contentWrap.appendChild(this.btnCleanAI);
    }

    // 6.5. Smart LED Cursor Lamp Button (LMB: Toggle | RMB: Open 2700K-6500K Smart LED Controller)
    this.btnLamp = document.createElement("button");
    this.btnLamp.className = this.settings.enableAiCleaner ? "artcraft-dock-btn" : "artcraft-dock-btn is-full-row";
    this.btnLamp.title = t("lampTip", this);
    this.btnLamp.innerHTML = `${sicraftIcon('lamp')}<span class="artcraft-btn-label">${t("lampBtn", this)}</span>`;
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
      // native tooltip removed - Dynamic Island handles title smoothly
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
      // click: connect PC audio / next style. double click: disconnect. The single click waits a moment
      // so a double click does not also cycle the style twice.
      let eqClickTimer = null;
      eqWrap.addEventListener("click", () => {
        if (eqClickTimer) return;
        eqClickTimer = setTimeout(() => {
          eqClickTimer = null;
          this.cycleEqualizerMode();
        }, 230);
      });
      eqWrap.addEventListener("dblclick", (e) => {
        e.preventDefault();
        if (eqClickTimer) {
          clearTimeout(eqClickTimer);
          eqClickTimer = null;
        }
        this.toggleDesktopAudioCapture();
      });
      eqWrap.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showAudioMenu(e);
      });
      eqWrap.addEventListener("auxclick", (e) => {
        if (e.button === 1) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleAudioPlayStop();
        } else if (e.button === 3) {
          e.preventDefault();
          e.stopPropagation();
          this.cycleAmbientSound(-1);
        } else if (e.button === 4) {
          e.preventDefault();
          e.stopPropagation();
          this.cycleAmbientSound(1);
        }
      });
      eqWrap.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
          if (this.ambientNodes || this.desktopAudioNodes) {
            this.stopAmbientSound();
            this.settings.ambientSound = "off";
            this.saveSettings();
            this.updateEqualizerPillUI();
            this.showIslandTrackCapsule((this.settings.uiLanguage || "en") === "ru" ? "🔇 Пауза / Звук выключен" : "🔇 Sound Paused");
          } else {
            const resumeId = this._lastAmbientSound || "balanced";
            this.startAmbientSound(resumeId);
            this.settings.ambientSound = resumeId;
            this.saveSettings();
            this.updateEqualizerPillUI();
            const sObj = AMBIENT_SOUNDSCAPES.find(s => s.id === resumeId);
            const isRu = (this.settings.uiLanguage || "en") === "ru";
            this.showIslandTrackCapsule(sObj ? (isRu ? sObj.ru : sObj.en) : resumeId);
          }
        }
      });
      eqWrap.addEventListener("mouseenter", () => {
        const cur = this.settings.ambientSound || "off";
        if (cur !== "off") {
          const soundObj = AMBIENT_SOUNDSCAPES.find((s) => s.id === cur);
          const isRu = (this.settings.uiLanguage || "en") === "ru";
          const name = soundObj ? (isRu ? soundObj.ru : soundObj.en) : cur;
          this.showIslandTrackCapsule(name);
        }
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
          // native tooltip removed - Dynamic Island handles title smoothly
          const curSnd = this.settings.ambientSound || "off";
          const soundObj = AMBIENT_SOUNDSCAPES.find((s) => s.id === curSnd);
          const isRu = (this.settings.uiLanguage || "en") === "ru";
          const name = soundObj ? (isRu ? soundObj.ru : soundObj.en) : (curSnd === "off" ? (isRu ? "Звук выключен" : "Audio muted") : curSnd);
          this.showIslandTrackCapsule(name, null, nextVol, { mode: "wheel", step });
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
    this.initArgonFlaskHydroEngine();
    this.startFamiliarCycle();
    this.updateEqualizerPillUI();
    this.fitDockToWindow();
  }

  // =========================================================================
  // CLEAN VECTOR FLASK FAMILIAR ENGINE (Zero-Canvas, Zero-Lag GPU CSS)
  // =========================================================================
  getFlaskDirectionConfig() {
    const isVert = !!(this.dockEl && this.dockEl.classList.contains("is-vertical"));
    return { isVert, isLeft: false, isRight: isVert, dirX: isVert ? -0.82 : 0, dirY: isVert ? -0.57 : -1.0, nozzleTiltRad: 0 };
  }

  initArgonFlaskHydroEngine() {
    if (!this.dockEl) return;
    const flaskWrap = this.dockEl.querySelector(".artcraft-flask-wrap");
    if (!flaskWrap) return;
    const oldCanvas = flaskWrap.querySelector(".artcraft-flask-hydro-canvas");
    if (oldCanvas) oldCanvas.remove();
    const legacyStage = flaskWrap.querySelector(".artcraft-familiar-stage");
    if (legacyStage) legacyStage.style.display = "";
  }

  splashFlask() {}
  emitFlaskPlume() {}
  wakeFlaskHydroLoop() {}
  stopFlaskHydroLoop() {
    if (this._flaskHydroRaf) {
      cancelAnimationFrame(this._flaskHydroRaf);
      this._flaskHydroRaf = null;
    }
  }

  triggerFlaskManifestation(forcedMode = null) {
    if (!this.dockEl) return;
    const stage = this.dockEl.querySelector(".artcraft-familiar-stage");
    if (!stage) return;
    stage.classList.remove("is-waving", "is-smiling", "is-ears", "is-steaming");
    void stage.offsetWidth;
    const classes = ["is-waving", "is-smiling", "is-ears", "is-steaming"];
    const map = { paw: "is-waving", smile: "is-smiling", ears: "is-ears", astrolabe: "is-steaming", phoenix: "is-waving" };
    const cls = (forcedMode && map[forcedMode]) || classes[(this._familiarIdx = ((this._familiarIdx || 0) + 1) % classes.length)];
    stage.classList.add(cls);
    if (this._familiarMorphTimer) clearTimeout(this._familiarMorphTimer);
    this._familiarMorphTimer = setTimeout(() => {
      stage.classList.remove("is-waving", "is-smiling", "is-ears", "is-steaming");
    }, 3200);
  }

  startFamiliarCycle() {
    if (this.familiarInterval) clearInterval(this.familiarInterval);
    const playEmotion = () => {
      if (!this.dockEl || !this.settings.dockCollapsed || document.hidden) return;
      this.triggerFlaskManifestation();
    };
    this.familiarInterval = setInterval(playEmotion, 11000);
    if (this.dockEl && !this.dockEl.dataset.familiarHoverWired) {
      this.dockEl.dataset.familiarHoverWired = "1";
      this.dockEl.addEventListener("mouseenter", () => {
        if (this.settings.dockCollapsed) playEmotion();
      });
    }
  }

  triggerAlchemicalBloom() {
    if (!this.dockEl) return;
    this.dockEl.classList.remove("is-blooming");
    void this.dockEl.offsetWidth;
    this.dockEl.classList.add("is-blooming");
    setTimeout(() => {
      if (this.dockEl) this.dockEl.classList.remove("is-blooming");
    }, 550);
  }

  async setDockPositionMode(posMode) {
    const isVert = posMode === "right" || posMode === "vertical";
    this.settings.dockVertical = isVert;
    this.settings.dockSide = "right";
    await this.saveSettings();
    if (this.dockEl) {
      this.dockEl.classList.remove("is-left");
      this.dockEl.classList.toggle("is-vertical", isVert);
      if (this.dockEl.getAnimations) {
        this.dockEl.getAnimations().forEach((a) => a.cancel());
      }
      this.dockEl.style.transform = "";
    }
    this.closeAllDockPopovers();
    this.fitDockToWindow();
  }

  async toggleDockOrientation() {
    const nextMode = this.settings.dockVertical ? "bottom" : "right";
    await this.setDockPositionMode(nextMode);
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const posName = nextMode === "bottom" ? (isRu ? "Снизу" : "Bottom") : (isRu ? "Справа" : "Right");
    new Notice(isRu ? "Расположение панели: " + posName : "Dock position: " + posName);
  }

  async toggleDockCollapse() {
    this.settings.dockCollapsed = !this.settings.dockCollapsed;
    await this.saveSettings();
    this.closeAllDockPopovers();

    if (this.dockEl) {
      const isCol = !!this.settings.dockCollapsed;
      const isVert = !!this.settings.dockVertical;

      if (this.dockEl.getAnimations) {
        this.dockEl.getAnimations().forEach((a) => a.cancel());
      }
      const content = this.dockEl.querySelector(".artcraft-dock-content");
      if (content && content.children) {
        Array.from(content.children).forEach((ch) => {
          if (ch.getAnimations) ch.getAnimations().forEach((a) => a.cancel());
          ch.style.transform = "";
          ch.style.opacity = "";
        });
      }

      this.dockEl.classList.remove("is-left");
      this.dockEl.classList.toggle("is-vertical", isVert);
      this.dockEl.classList.toggle("is-collapsed", isCol);
      this.dockEl.style.transform = "";

      if (!isCol) {
        this.triggerAlchemicalBloom();
        this.fitDockToWindow();
        if (this.dockEl.animate) {
          const baseTf = isVert ? "translateY(-50%)" : "translate3d(0, 0, 0)";
          const startTf = isVert
            ? "translateY(-50%) translateX(10px) scale(0.92)"
            : "translate3d(0, 8px, 0) scale(0.92)";
          this.dockEl.animate(
            [
              { opacity: 0.75, transform: startTf },
              { opacity: 1, transform: baseTf }
            ],
            { duration: 180, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      } else {
        this.triggerFlaskManifestation();
        if (this.dockEl.animate) {
          const baseTf = isVert ? "translateY(-50%)" : "translate3d(0, 0, 0)";
          const startTf = isVert
            ? "translateY(-50%) scale(0.84)"
            : "translate3d(0, 4px, 0) scale(0.84)";
          this.dockEl.animate(
            [
              { opacity: 0.8, transform: startTf },
              { opacity: 1, transform: baseTf }
            ],
            { duration: 170, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      }
    }
    this.fitDockToWindow();
  }

  // Keeps the horizontal dock inside the window: first it drops button labels, then lets the row scroll.
  fitDockToWindow() {
    const dock = this.dockEl;
    if (!dock) return;
    dock.classList.remove("is-compact", "is-scrollable");
    if (dock.classList.contains("is-vertical") || dock.classList.contains("is-collapsed")) return;
    const room = window.innerWidth - 32;
    if (dock.offsetWidth <= room) return;
    dock.classList.add("is-compact");
    if (dock.offsetWidth > room) dock.classList.add("is-scrollable");
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
    this.registerDomEvent(window, "resize", () => {
      if (this.dockFitFrame) return;
      this.dockFitFrame = requestAnimationFrame(() => {
        this.dockFitFrame = null;
        this.fitDockToWindow();
      });
    });

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
          color: this.settings.drawColor || this.settings.strokeColor || "#2563EB",
          size: this.settings.drawSize || 4,
          opacity: (this.settings.drawOpacity !== undefined ? this.settings.drawOpacity : 90) / 100,
          style: this.settings.drawStyle || "pen",
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

    // Window-level listeners go through registerDomEvent so they are removed when the plugin is disabled.
    canvas.addEventListener("touchstart", onStart, { passive: false });
    this.registerDomEvent(window, "touchmove", onMove, { passive: false });
    this.registerDomEvent(window, "touchend", onEnd, { passive: true });
    this.registerDomEvent(window, "touchcancel", onEnd, { passive: true });

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

    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) onStart(e); // right and middle buttons must not start a stroke
    });
    this.registerDomEvent(window, "mousemove", onMove);
    this.registerDomEvent(window, "mouseup", onEnd);

    // Start lightweight 30 FPS loop for mini 62x20 Equalizer & Graph Studio FX only (never touches full-screen 2D canvas!)
    this.startBackgroundVisualLoops();
  }

  startBackgroundVisualLoops() {
    this.wakeVisualLoop();
  }

  hasOpenGraphView() {
    if (this.settings.enableBentoGraph === false) return false;
    const ws = this.app.workspace;
    return ws.getLeavesOfType("graph").length > 0 || ws.getLeavesOfType("localgraph").length > 0;
  }

  // The loop runs only while the picture can change from frame to frame: live audio, bars still settling,
  // or an open graph view. Otherwise it parks, and the plugin costs no CPU while you read or write.
  visualLoopHasWork() {
    if (this._unloaded || document.hidden) return false;
    if (this.desktopAudioNodes || this.ambientNodes) return true;
    if ((this.eqRestFrames || 0) < 45) return true;
    return this.hasOpenGraphView();
  }

  wakeVisualLoop() {
    if (this.eqAnimFrame || this.eqIdleTimer || this._unloaded) return;
    let lastTick = 0;
    const tick = (ts) => {
      this.eqAnimFrame = null;
      if (this._unloaded) return;
      if (ts - lastTick >= 32) {
        lastTick = ts;
        this.renderEqualizerFrame();
        this.renderGraphStudioFX();
      }
      if (!this.visualLoopHasWork()) return;
      if ((this.eqRestFrames || 0) >= 45 && !this.hasOpenGraphView()) {
        // Capture is on but nothing is playing: listen for sound 5 times a second instead of every frame.
        this.eqIdleTimer = setTimeout(() => {
          this.eqIdleTimer = null;
          if (!this._unloaded) this.eqAnimFrame = requestAnimationFrame(tick);
        }, 200);
      } else {
        this.eqAnimFrame = requestAnimationFrame(tick);
      }
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
      const sColor = stroke.color || this.settings.drawColor || "#2563EB";
      const sWidth = stroke.size || this.settings.drawSize || 4;
      const sStyle = stroke.style || "pen";
      const sAlpha = stroke.opacity !== undefined ? stroke.opacity : (sStyle === "highlighter" ? 0.38 : 0.9);
      ctx.strokeStyle = sColor;
      ctx.lineWidth = sWidth;
      ctx.lineCap = sStyle === "highlighter" ? "square" : "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = sAlpha;

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, Math.max(1.5, sWidth / 2), 0, Math.PI * 2);
        ctx.fillStyle = sColor;
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
    const trailMaxMs = this.settings.laserTrailMs || 450;
    const laserCol = this.settings.laserColor || this.settings.strokeColor || "#EF4444";
    const laserBaseSize = this.settings.laserSize || 6;
    this.laserTrail = this.laserTrail.filter((p) => now - p.t < trailMaxMs);
    if (this.laserTrail.length > 1) {
      ctx.save();
      for (let i = 1; i < this.laserTrail.length; i++) {
        const p0 = this.laserTrail[i - 1];
        const p1 = this.laserTrail[i];
        const age = (now - p1.t) / trailMaxMs;
        const alpha = Math.max(0, 1 - age);
        ctx.beginPath();
        ctx.strokeStyle = laserCol;
        ctx.lineWidth = laserBaseSize * alpha + 1;
        ctx.lineCap = "round";
        ctx.globalAlpha = alpha * 0.9;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      const head = this.laserTrail[this.laserTrail.length - 1];
      ctx.beginPath();
      ctx.fillStyle = laserCol;
      ctx.globalAlpha = 0.28;
      ctx.arc(head.x, head.y, laserBaseSize * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = laserCol;
      ctx.globalAlpha = 0.96;
      ctx.arc(head.x, head.y, laserBaseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#FFFFFF";
      ctx.globalAlpha = 0.92;
      ctx.arc(head.x, head.y, Math.max(1.5, laserBaseSize * 0.38), 0, Math.PI * 2);
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

  // Folds the live spectrum into 16 log-spaced bands (40 Hz to 16 kHz, half an octave each), so bass,
  // voice and highs get comparable room on the meter. Returns null while the source is silent.
  readSpectrumBands(analyser) {
    if (!analyser) return null;
    if (analyser.fftSize !== 2048) {
      try {
        analyser.fftSize = 2048;
      } catch (e) {}
    }
    const binCount = analyser.frequencyBinCount;
    if (!this.eqFreqBuf || this.eqFreqBuf.length !== binCount) this.eqFreqBuf = new Uint8Array(binCount);
    const data = this.eqFreqBuf;
    analyser.getByteFrequencyData(data);

    const hzPerBin = analyser.context.sampleRate / analyser.fftSize;
    if (!this.eqBands) this.eqBands = new Float32Array(16);
    const bands = this.eqBands;
    const F_MIN = 40;
    const RATIO = 16000 / F_MIN;
    let frameMax = 0;
    for (let i = 0; i < 16; i++) {
      const lo = (F_MIN * Math.pow(RATIO, i / 16)) / hzPerBin;
      const hi = (F_MIN * Math.pow(RATIO, (i + 1) / 16)) / hzPerBin;
      const b0 = Math.max(1, Math.floor(lo));
      const b1 = Math.min(binCount - 1, Math.max(b0, Math.ceil(hi) - 1));
      let peak = 0;
      for (let b = b0; b <= b1; b++) {
        if (data[b] > peak) peak = data[b];
      }
      // Music loses energy towards the highs; a gentle tilt keeps the right half of the meter alive.
      const v = (peak / 255) * (1 + i * 0.035);
      bands[i] = v;
      if (v > frameMax) frameMax = v;
    }
    if (frameMax < 0.007) {
      this.eqAgcPeak = (this.eqAgcPeak || 0) * 0.98;
      return null;
    }
    // Slow auto-gain: a quiet player still fills the meter, a loud one is left alone, noise floor is not inflated.
    this.eqAgcPeak = Math.max(frameMax, (this.eqAgcPeak || 0) * 0.995);
    const gain = this.eqAgcPeak > 0.12 ? Math.min(4, Math.max(1, 0.92 / this.eqAgcPeak)) : 1;
    if (gain > 1.02) {
      for (let i = 0; i < 16; i++) bands[i] = Math.min(1, bands[i] * gain);
    }
    return bands;
  }

  // Beat = onset of bass energy. Measured as spectral flux: how much the four bass bands (40 to 180 Hz)
  // grew since the previous frame, compared with the recent average growth. Flux catches a kick drum even
  // when it sweeps across bands, where a plain level threshold would miss it.
  trackBeat(bands) {
    const prev = this.beatPrevBands || (this.beatPrevBands = new Float32Array(4));
    let flux = 0;
    let level = 0;
    for (let i = 0; i < 4; i++) {
      const v = bands ? bands[i] : 0;
      if (v > prev[i]) flux += v - prev[i];
      if (v > level) level = v;
      prev[i] = v;
    }
    const avg = this.beatFluxAvg || 0;
    const now = performance.now();
    if (level > 0.35 && flux > 0.14 && flux > avg * 1.7 && now - (this.beatLastTs || 0) > 230) {
      this.beatLastTs = now;
      this.beatCount = (this.beatCount || 0) + 1;
      this.onAudioBeat(Math.min(1, 0.4 + flux * 0.6));
    }
    this.beatFluxAvg = avg + (flux - avg) * 0.1;
  }

  onAudioBeat(strength) {
    // Both reactions animate opacity/transform only, so they run on the compositor and never repaint the page.
    const dot = this.eqWrap && this.eqWrap.querySelector(".artcraft-eq-status-dot");
    if (dot && dot.animate) {
      dot.animate(
        [
          { transform: "scale(" + (1 + 0.9 * strength).toFixed(2) + ")", opacity: 1 },
          { transform: "scale(1)", opacity: 0.8 },
        ],
        { duration: 260, easing: "ease-out" }
      );
    }
    if (this.settings.lampBeatSync && this.settings.magicLamp && this.lampWrapEl && this.lampWrapEl.animate) {
      this.lampWrapEl.animate([{ opacity: 1 - 0.2 * strength }, { opacity: 1 }], { duration: 340, easing: "ease-out" });
    }
  }

  renderEqualizerFrame() {
    if (!this.eqCanvas) {
      this.eqRestFrames = 999;
      return;
    }
    const eqCtx = this.eqCanvas.getContext("2d");
    // Logical drawing space is always 62x20; canvas backing store is 2x for crisp lines on HiDPI
    const ew = 62;
    const eh = 20;
    const eqScale = this.eqCanvas.width / ew;
    const mode = this.settings.eqMode || "craft";
    const colors = ["#69BD28", "#D97706", "#F4F3EF", "#10B981", "#2563EB", "#F59E0B", "#EAB308", "#A7F3D0"];

    this.connectPageMediaElementsToAnalyser();
    const sysBands = this.desktopAudioNodes && this.desktopAudioNodes.analyser
      ? this.readSpectrumBands(this.desktopAudioNodes.analyser)
      : null;
    const ambBands = this.ambientNodes && this.ambientNodes.analyser
      ? this.readSpectrumBands(this.ambientNodes.analyser)
      : null;
    const pageBands = !sysBands && this._pageMediaAnalyser
      ? this.readSpectrumBands(this._pageMediaAnalyser)
      : null;
    let bands = sysBands || ambBands || pageBands;
    if (sysBands && ambBands) {
      if (!this._mixedBands) this._mixedBands = new Float32Array(16);
      for (let bIdx = 0; bIdx < 16; bIdx++) {
        this._mixedBands[bIdx] = Math.min(1, Math.max(sysBands[bIdx], ambBands[bIdx] * 0.85));
      }
      bands = this._mixedBands;
    }
    const hasSound = !!bands;

    if (!this.eqPeaks) this.eqPeaks = new Array(16).fill(2);
    if (!this.eqSmooth) this.eqSmooth = new Array(16).fill(2);
    if (!this.eqPhase) this.eqPhase = 0;

    // Fast attack, steady gravity release, slowly falling peak caps
    let totalEnergy = 0;
    for (let i = 0; i < 16; i++) {
      const targetH = hasSound ? Math.max(2, Math.min(eh - 2, bands[i] * (eh - 2))) : 2;
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
    this.trackBeat(bands);

    // Silent and fully settled: the picture cannot change, so the redraw (and the repaint it causes) is skipped.
    const restKey = mode + ":" + this.eqCanvas.width;
    if (!hasSound && totalEnergy < 0.3) {
      this.eqRestFrames = (this.eqRestFrames || 0) + 1;
      if (this.eqRestFrames > 45 && this.eqRestKey === restKey && this.eqRestCanvas === this.eqCanvas) return;
      if (this.eqRestFrames > 45) {
        this.eqRestKey = restKey;
        this.eqRestCanvas = this.eqCanvas;
      }
    } else {
      this.eqRestFrames = 0;
      this.eqRestKey = null;
    }

    eqCtx.setTransform(eqScale, 0, 0, eqScale, 0, 0);
    eqCtx.clearRect(0, 0, ew, eh);

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


  // --- NEW MODULE 1: LIFE RPG & SHA-256 BLOCKCHAIN QUEST CHAIN (DEEP WORK & VALUE EQUATION) ---
  async computeSha256Hex(message) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {}
    // Fallback deterministic FNV-1a / 256-bit hex mixer if WebCrypto is unavailable
    let h1 = 0xdeadbeef ^ message.length;
    let h2 = 0x41c6ce57 ^ message.length;
    for (let i = 0; i < message.length; i++) {
      const ch = message.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const base = (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
    return (base + base + base + base).slice(0, 64);
  }

  // Blocks are added one at a time. Two tasks ticked in quick succession used to read the same
  // "previous block" and produce two blocks with one index, which broke verification.
  mineQuestBlock(questTitle, xpReward = 35, notify = true) {
    const run = () => this.mineQuestBlockNow(questTitle, xpReward, notify);
    this.mineQueue = (this.mineQueue || Promise.resolve()).then(run, run);
    return this.mineQueue;
  }

  async mineQuestBlockNow(questTitle, xpReward = 35, notify = true) {
    if (!this.settings.questBlockchain || !Array.isArray(this.settings.questBlockchain) || this.settings.questBlockchain.length === 0) {
      this.settings.questBlockchain = [
        {
          index: 0,
          timestamp: new Date().toISOString(),
          quest: "GENESIS BLOCK // ALCHEMY CRAFT LIFE RPG LEDGER",
          notePath: "Vault Root",
          xp: 100,
          prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
          hash: "0000a48f9c2e71b8d34e19a8c50f62d4e89b12c34f56a78b90c12d34e56f789a",
          nonce: 480
        }
      ];
    }
    const chain = this.settings.questBlockchain;
    const prevBlock = chain[chain.length - 1];
    // Prevent duplicate mining of the exact same task within 15 seconds
    if (prevBlock && prevBlock.quest === questTitle && Date.now() - new Date(prevBlock.timestamp).getTime() < 15000) {
      return prevBlock;
    }

    const obsidian = require("obsidian");
    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    const notePath = activeView && activeView.file ? activeView.file.path : "Life RPG Studio";
    const index = (Number(prevBlock.index) || 0) + 1; // the list is capped at 250 entries, so its length is not the index
    const timestamp = new Date().toISOString();
    const prevHash = prevBlock.hash;

    // Mine a lightweight Proof-of-Work nonce (finds hash starting with "00" within up to 300 iterations for instant UX)
    let nonce = 0;
    let hash = "";
    // A hash starting with "00" takes 256 tries on average. The old limit of 320 gave up about 29% of
    // the time and stored a block that did not meet its own rule.
    for (let n = 0; n < 6000; n++) {
      nonce = n;
      const payload = `${index}|${timestamp}|${questTitle}|${notePath}|${xpReward}|${prevHash}|${nonce}`;
      hash = await this.computeSha256Hex(payload);
      if (hash.startsWith("00")) break;
    }

    const newBlock = {
      index,
      timestamp,
      quest: questTitle,
      notePath,
      xp: xpReward,
      prevHash,
      hash,
      nonce
    };
    chain.push(newBlock);
    if (chain.length > 250) chain.shift();

    if (!this.settings.lifeRpg) {
      this.settings.lifeRpg = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.lifeRpg));
    }
    this.settings.lifeRpg.xp = (this.settings.lifeRpg.xp || 0) + xpReward;
    this.settings.lifeRpg.level = Math.max(1, Math.floor(this.settings.lifeRpg.xp / 100) + 1);

    await this.saveSettings();
    this.updateTaskProgressBar();
    this.playTactileMicroFeedback("mine");

    if (notify) {
      const isRu = (this.settings.uiLanguage || "en") === "ru";
      new Notice(
        isRu
          ? `Блок #${index} подписан в цепочке квестов! +${xpReward} XP • SHA-256: ${hash.slice(0, 10)}…`
          : `Block #${index} mined in Quest Chain! +${xpReward} XP • SHA-256: ${hash.slice(0, 10)}…`
      );
    }
    return newBlock;
  }

  async verifyQuestBlockchain() {
    const chain = this.settings.questBlockchain || [];
    if (chain.length === 0) return { valid: true, blocks: 0 };
    for (let i = 0; i < chain.length; i++) {
      const cur = chain[i];
      // every block must link to the one before it
      if (i > 0 && cur.prevHash !== chain[i - 1].hash) {
        return { valid: false, brokenAt: i };
      }
      // the fixed starting block (index 0) carries a placeholder hash; every other block, including the
      // first one left after the list was trimmed, must reproduce its own hash
      if (Number(cur.index) === 0) continue;
      const payload = `${cur.index}|${cur.timestamp}|${cur.quest}|${cur.notePath}|${cur.xp}|${cur.prevHash}|${cur.nonce}`;
      const recomputed = await this.computeSha256Hex(payload);
      if (recomputed !== cur.hash) {
        return { valid: false, brokenAt: i };
      }
    }
    return { valid: true, blocks: chain.length };
  }

  // Multi-harmonic WebAudio Tactile Micro-Feedback (Sub-bass thock + crystal harmonic chime)
  playTactileMicroFeedback(kind = "tap") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.keyAudioCtx) this.keyAudioCtx = new AudioCtx();
      const ctx = this.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      if (kind === "mine" || kind === "anchor") {
        const freqs = kind === "anchor" ? [220, 329.63, 440, 659.25] : [196, 293.66, 440];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = idx === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(f, now + idx * 0.045);
          g.gain.setValueAtTime(0.0001, now + idx * 0.045);
          g.gain.linearRampToValueAtTime(0.08, now + idx * 0.045 + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.45);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + idx * 0.045);
          osc.stop(now + idx * 0.045 + 0.48);
        });
      } else {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(165, now);
        osc.frequency.exponentialRampToValueAtTime(68, now + 0.038);
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      }
    } catch (e) {}
  }

  // --- EMBEDDED WEBASSEMBLY (WASM) 144 FPS ACCELERATOR & BIONIC FOCUS ENGINE (v5.1.0) ---
  async initWasmCore() {
    this.wasmExports = null;
    this.wasmReady = false;
    try {
      const b64 = "AGFzbQEAAAABFwNgAn9/AX9gBn19fX19fQF9YAJ9fQF9AwQDAAECByoDCmZudjFhX3N0ZXAAAAtzcHJpbmdfc3RlcAABC3JlcHVsc2VfbWFnAAIKOgMNACAAIAFzQZODgAhsCxwAIAAgAiABIACTIAOUIAIgBJSTIAWUkiAFlJILDQAgASAAQwAAgEKSlQs=";
      const binStr = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
      const res = await WebAssembly.instantiate(bytes, {});
      if (res && res.instance && res.instance.exports) {
        this.wasmExports = res.instance.exports;
        this.wasmReady = true;
      }
    } catch (e) {
      this.wasmReady = false;
    }
  }

  wasmSpringStep(pos, target, vel, stiffness = 220, damping = 22, dt = 0.016) {
    if (this.wasmReady && this.wasmExports && typeof this.wasmExports.spring_step === "function") {
      return this.wasmExports.spring_step(pos, target, vel, stiffness, damping, dt);
    }
    const accel = (target - pos) * stiffness - vel * damping;
    const nextVel = vel + accel * dt;
    return pos + nextVel * dt;
  }

  wasmRepulseMag(distSq, strength = 1200) {
    if (this.wasmReady && this.wasmExports && typeof this.wasmExports.repulse_mag === "function") {
      return this.wasmExports.repulse_mag(distSq, strength);
    }
    return strength / (distSq + 64.0);
  }

  wasmFastHashHex(inputStr) {
    const s = String(inputStr || "");
    let h = -2128831035; // 0x811c9dc5 FNV-1a offset basis
    const fnvStep = (this.wasmReady && this.wasmExports && this.wasmExports.fnv1a_step) ? this.wasmExports.fnv1a_step : null;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i) & 0xff;
      h = fnvStep ? fnvStep(h, c) : Math.imul(h ^ c, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  initMagicSpotlightTracker() {
    if (this._spotlightHandler) return;
    let rafPending = false;
    this._spotlightHandler = (ev) => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const target = ev.target && ev.target.closest ? ev.target.closest(".artcraft-rpg-card, .artcraft-modal-header-card, .focus-pop-act-btn, .artcraft-floating-dock") : null;
        if (target) {
          const rect = target.getBoundingClientRect();
          target.style.setProperty("--spot-x", `${Math.round(ev.clientX - rect.left)}px`);
          target.style.setProperty("--spot-y", `${Math.round(ev.clientY - rect.top)}px`);
        }
      });
    };
    document.addEventListener("pointermove", this._spotlightHandler, { passive: true });
  }

  refreshBionicAnchorsInDOM() {
    if (!this.settings.bionicAnchors) {
      document.querySelectorAll("span.artcraft-bionic-word").forEach((el) => {
        const txt = document.createTextNode(el.textContent || "");
        if (el.parentNode) el.parentNode.replaceChild(txt, el);
      });
      return;
    }
    document.querySelectorAll(".markdown-rendered p, .markdown-rendered li").forEach((block) => {
      this.applyBionicToElement(block);
    });
  }

  applyBionicToElement(rootEl) {
    if (!this.settings.bionicAnchors || !rootEl) return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (!p || p.closest("code, pre, a, button, svg, .artcraft-bionic-word, .artcraft-step-badge, .artcraft-pill-number, .inline-title")) continue;
      if ((n.nodeValue || "").trim().length >= 4) nodes.push(n);
    }
    nodes.forEach((textNode) => {
      const raw = textNode.nodeValue || "";
      const parts = raw.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((word) => {
        const clean = word.replace(/[^\p{L}\p{N}]/gu, "");
        if (clean.length >= 4) {
          const fixLen = Math.max(2, Math.ceil(word.length * 0.38));
          const wrap = document.createElement("span");
          wrap.className = "artcraft-bionic-word";
          const boldPart = document.createElement("b");
          boldPart.className = "artcraft-bionic-fix";
          boldPart.textContent = word.slice(0, fixLen);
          wrap.appendChild(boldPart);
          wrap.appendChild(document.createTextNode(word.slice(fixLen)));
          frag.appendChild(wrap);
        } else {
          frag.appendChild(document.createTextNode(word));
        }
      });
      if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  // Encode ABI calldata for `anchorQuestChainRoot(bytes32,uint64,uint64,uint32,string)`
  encodeAnchorCalldata(rootHashHex, blockCount, totalXp, level, vaultTag) {
    // Verified EVM function selector for anchorQuestChainRoot(bytes32,uint64,uint64,uint32,string): 0xd38e5522
    const selector = "0xd38e5522";
    const cleanHash = String(rootHashHex || "").replace(/^0x/, "").padStart(64, "0").slice(0, 64);
    const blkHex = Math.max(1, Number(blockCount || 1)).toString(16).padStart(64, "0");
    const xpHex = Math.max(0, Number(totalXp || 0)).toString(16).padStart(64, "0");
    const lvlHex = Math.max(1, Number(level || 1)).toString(16).padStart(64, "0");
    const offsetHex = (5 * 32).toString(16).padStart(64, "0"); // 0xa0
    const utf8Bytes = Array.from(new TextEncoder().encode(String(vaultTag || "AlchemyCraft").slice(0, 64)));
    const lenHex = utf8Bytes.length.toString(16).padStart(64, "0");
    const dataHex = utf8Bytes.map((b) => b.toString(16).padStart(2, "0")).join("").padEnd(64, "0");
    return `${selector}${cleanHash}${blkHex}${xpHex}${lvlHex}${offsetHex}${lenHex}${dataHex}`;
  }

  // 60-Second Free Pro Test-Drive
  async startProTestDrive60s() {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    if (this.settings.isPro && !this.proTestDriveActive) {
      new Notice(isRu ? "У вас уже активирован полный статус Alchemy Craft Pro!" : "You already have full Alchemy Craft Pro unlocked!");
      return;
    }
    if (this.proTestDriveTimer) {
      clearInterval(this.proTestDriveTimer);
      this.proTestDriveTimer = null;
    }
    this.proTestDriveActive = true;
    const prevPro = this.settings.isPro;
    const prevDark = this.settings.darkCraftTheme;
    this.proTestDrivePrev = { isPro: prevPro, darkCraftTheme: prevDark };
    this.settings.isPro = true;
    // this.settings.darkCraftTheme = false; (dark mode removed from test drive)
    this.applyBodyClasses();
    this.createFloatingDock();
    this.playTactileMicroFeedback("anchor");

    let remaining = 60;
    let banner = document.querySelector(".artcraft-testdrive-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "artcraft-testdrive-banner";
      document.body.appendChild(banner);
    }

    const updateBanner = () => {
      if (!banner) return;
      banner.innerHTML = `
        <div class="td-left">
          <span class="td-pulse-dot"></span>
          <strong>${isRu ? `ТЕСТ-ДРАЙВ PRO АКТИВЕН (${remaining} сек)` : `PRO TEST-DRIVE LIVE (${remaining}s)`}</strong>
          <span>${isRu ? "Разблокированы все 8 цветов палитры Bento, 16 саундскейпов и Pro-инструменты" : "All 8 Bento Palette Colors, 16 Soundscapes & Pro Studio unlocked"}</span>
        </div>
        <div class="td-actions">
          <button class="td-buy-btn">${isRu ? "Открыть Pro навсегда ($9.99)" : "Unlock Pro Forever ($9.99)"}</button>
          <button class="td-stop-btn">×</button>
        </div>
      `;
      banner.querySelector(".td-buy-btn")?.addEventListener("click", () => {
        endTestDrive(false);
        new AlchemyCraftProModal(this.app, this, "evm").open();
      });
      banner.querySelector(".td-stop-btn")?.addEventListener("click", () => endTestDrive(true));
    };

    const endTestDrive = (showEndNotice = true) => {
      if (this.proTestDriveTimer) {
        clearInterval(this.proTestDriveTimer);
        this.proTestDriveTimer = null;
      }
      this.proTestDriveActive = false;
      if (banner) {
        banner.remove();
        banner = null;
      }
      if (!this.settings.proTxHash) {
        this.settings.isPro = prevPro;
        this.settings.darkCraftTheme = prevDark;
        this.applyBodyClasses();
        this.createFloatingDock();
        if (showEndNotice) {
          new Notice(
            isRu
              ? "60-секундный тест-драйв завершён. Понравились звуки и расширенная палитра? Откройте Pro навсегда!"
              : "60-second Pro Test-Drive finished. Loved the soundscapes & palette? Unlock Pro anytime!"
          );
        }
      }
    };

    updateBanner();
    this.proTestDriveTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        endTestDrive(true);
      } else {
        updateBanner();
      }
    }, 1000);
  }

  // 5 Mindful Focus Calibration Alarms Scheduler
  startAutopilotAlarmScheduler() {
    const checkAlarm = () => {
      if (!this.settings.autopilotAlarms || !this.settings.autopilotAlarms.enabled) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const curHm = `${hh}:${mm}`;
      const todayKey = `${localDayKey(now)}_${curHm}`;
      const times = this.settings.autopilotAlarms.times || ["11:00", "13:30", "15:15", "17:00", "19:30"];
      if (times.includes(curHm) && this.settings.autopilotAlarms.lastTriggeredKey !== todayKey) {
        this.settings.autopilotAlarms.lastTriggeredKey = todayKey;
        this.saveSettings();
        this.openAutopilotInterruptModal(curHm);
      }
    };
    const id = window.setInterval(checkAlarm, 30000);
    this.registerInterval(id);
  }

  openQuestChainModal() {
    this.playTactileMicroFeedback("tap");
    new LifeRpgQuestChainModal(this.app, this).open();
  }

  openBioFlowModal() {
    this.playTactileMicroFeedback("tap");
    new BioRhythmFlowModal(this.app, this).open();
  }

  openCreativeSketchModal() {
    this.playTactileMicroFeedback("tap");
    new CreativeMarginSketchModal(this.app, this).open();
  }

  openCreatorOsModal() {
    this.playTactileMicroFeedback("tap");
    new CreatorOsStudioModal(this.app, this).open();
  }

  openAutopilotInterruptModal(triggerTime = "") {
    this.playTactileMicroFeedback("mine");
    new AutopilotInterruptModal(this.app, this, triggerTime).open();
  }

  async loadSettings() {
    // Defaults are cloned so nested objects (quest chain, alarms, analytics) are never shared with the
    // constant, and a nested default added in a newer version reaches users who already have that object.
    const defaults = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    const saved = (await this.loadData()) || {};
    this.settings = Object.assign({}, defaults, saved);
    Object.keys(defaults).forEach((key) => {
      const d = defaults[key];
      const s = saved[key];
      if (d && typeof d === "object" && !Array.isArray(d) && s && typeof s === "object" && !Array.isArray(s)) {
        this.settings[key] = Object.assign({}, d, s);
      }
    });
    // Auto-detect Obsidian language if not explicitly chosen or if set to legacy auto
    if (!this.settings.uiLanguage || this.settings.uiLanguage === "auto" || !SUPPORTED_LANGS.includes(this.settings.uiLanguage)) {
      try {
        const obsLang = (
          window.localStorage?.getItem("language") ||
          window.moment?.locale?.() ||
          document.documentElement?.lang ||
          navigator.language ||
          "en"
        ).toLowerCase();
        if (obsLang.startsWith("ru")) this.settings.uiLanguage = "ru";
        else if (obsLang.startsWith("zh")) this.settings.uiLanguage = "zh";
        else if (obsLang.startsWith("ja")) this.settings.uiLanguage = "ja";
        else if (obsLang.startsWith("es")) this.settings.uiLanguage = "es";
        else if (obsLang.startsWith("de")) this.settings.uiLanguage = "de";
        else this.settings.uiLanguage = "en";
      } catch (e) {
        this.settings.uiLanguage = "en";
      }
    }
    // Migrate the removed "Vintage Typewriter" sound to the new creamy default
    if (this.settings.tactileTypingSound === "typewriter") {
      this.settings.tactileTypingSound = "creamy_pom";
    }
    // 4.6.2: the peripheral "Golden Pomodoro" sandglass thread was removed (it pulled the eye away from the reading centre)
    this.settings.marginSandglass = false;
  }

  updateCurrentLeafKin() {
    this.updateTaskProgressBar();
  }

  triggerZenCameraTransition(enterZen) {
    this.zenMode = !!enterZen;
    if (this.zenAtmosphereEl) {
      this.zenAtmosphereEl.remove();
      this.zenAtmosphereEl = null;
    }

    if (this.zenMode) {
      if (this.app.workspace.leftSplit && !this.app.workspace.leftSplit.collapsed) {
        this._zenRestoredLeft = true;
        this.app.workspace.leftSplit.collapse();
      }
      if (this.app.workspace.rightSplit && !this.app.workspace.rightSplit.collapsed) {
        this._zenRestoredRight = true;
        this.app.workspace.rightSplit.collapse();
      }
    } else {
      if (this._zenRestoredLeft && this.app.workspace.leftSplit) {
        this.app.workspace.leftSplit.expand();
        this._zenRestoredLeft = false;
      }
      if (this._zenRestoredRight && this.app.workspace.rightSplit) {
        this.app.workspace.rightSplit.expand();
        this._zenRestoredRight = false;
      }
    }

    this.applyBodyClasses();
    this.updateDockUI();
  }

  attachPopoverTactilePhysics(popEl, anchorBtn) {
    // Lightweight no-op: unified GPU popover animation is handled by positionDockPopover
  }

  initBookFolio3DPhysics() {
    // Lightweight no-op: eliminates continuous scroll/pointermove :root CSS variable thrashing
  }

  destroyBookFolio3DPhysics() {
    ["--book-curl-rot-y", "--book-curl-rot-x", "--book-curl-lift", "--book-parallax-x", "--book-parallax-y"].forEach((p) =>
      document.documentElement.style.removeProperty(p)
    );
  }

  // =========================================================================
  // INTERACTIVE PRO & STUDIO CONTROL HUB (Click-to-Toggle & Select Every Feature)
  // =========================================================================
  renderProFeaturesControlHub(parentEl, onStateChanged = null) {
    if (!parentEl) return;
    parentEl.empty();
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const notifyChange = async (msgRu, msgEn) => {
      await this.saveSettings();
      this.applyBodyClasses();
      this.updateDockUI();
      this.updateEqualizerPillUI();
      if (typeof onStateChanged === "function") onStateChanged();
      if (msgRu || msgEn) new Notice(isRu ? msgRu : msgEn, 1800);
    };

    const wrap = parentEl.createDiv({ cls: "artcraft-pro-hub-wrap" });

    // Top Status & Quick Action Bar
    const topBar = wrap.createDiv({ cls: "artcraft-pro-hub-topbar" });
    topBar.innerHTML = `
      <div class="pro-hub-top-left">
        <span class="pro-hub-badge">${PRO_VERIFIED_BADGE_SVG} <span>${
      this.settings.isPro
        ? isRu ? "PRO STUDIO АКТИВЕН" : "PRO STUDIO ACTIVE"
        : isRu ? "ЦЕНТР УПРАВЛЕНИЯ ФУНКЦИЯМИ PRO" : "PRO FEATURES CONTROL HUB"
    }</span></span>
        <p class="pro-hub-sub">${
          isRu
            ? "Включайте, выключайте и настраивайте каждую функцию плагина прямо из одного окна."
            : "Toggle, configure, and launch every Pro & Studio feature directly from one unified hub."
        }</p>
      </div>
      <div class="pro-hub-top-actions">
        <button class="artcraft-pay-action-btn is-soft" data-hub-act="test-flask">
          <span class="svg-inline-icon">${ALCHEMY_ICON_SVG}</span>
          <span>${isRu ? "Тест анимации колбы" : "Test Flask Magic"}</span>
        </button>
        <button class="artcraft-pay-action-btn is-green" data-hub-act="open-sonic">
          <span class="svg-inline-icon">${SICRAFT_SVGS.sliders}</span>
          <span>${isRu ? "Аудио-Студия" : "Sonic Studio"}</span>
        </button>
      </div>
    `;

    topBar.querySelector('[data-hub-act="test-flask"]')?.addEventListener("click", () => {
      if (!this.settings.dockCollapsed) {
        this.toggleDockCollapse();
      } else {
        this.triggerFlaskManifestation();
      }
      new Notice(isRu ? "Запущена процедурная анимация колбы-эликсира!" : "Triggered Alchemical Flask manifestation!");
    });
    topBar.querySelector('[data-hub-act="open-sonic"]')?.addEventListener("click", () => {
      this.openSonicStudioModal();
    });

    const grid = wrap.createDiv({ cls: "artcraft-pro-hub-grid" });

    const addHubCard = (iconSvg, titleRu, titleEn, descRu, descEn, controlsBuilder) => {
      const card = grid.createDiv({ cls: "artcraft-pro-hub-card" });
      const head = card.createDiv({ cls: "pro-hub-card-head" });
      head.innerHTML = `
        <span class="pro-hub-card-icon">${iconSvg}</span>
        <div class="pro-hub-card-titles">
          <h4>${isRu ? titleRu : titleEn}</h4>
          <p>${isRu ? descRu : descEn}</p>
        </div>
      `;
      const body = card.createDiv({ cls: "pro-hub-card-controls" });
      controlsBuilder(body);
    };

    const makeToggleRow = (container, labelRu, labelEn, isChecked, onChange) => {
      const row = container.createDiv({ cls: "pro-hub-ctrl-row" });
      const lbl = row.createEl("span", { cls: "pro-hub-ctrl-lbl", text: isRu ? labelRu : labelEn });
      const toggle = row.createEl("input", { type: "checkbox", cls: "pro-hub-checkbox" });
      toggle.checked = !!isChecked;
      toggle.onchange = () => onChange(toggle.checked);
      return row;
    };

    const makeSelectRow = (container, labelRu, labelEn, options, curVal, onChange) => {
      const row = container.createDiv({ cls: "pro-hub-ctrl-row" });
      row.createEl("span", { cls: "pro-hub-ctrl-lbl", text: isRu ? labelRu : labelEn });
      const sel = row.createEl("select", { cls: "pro-hub-select" });
      options.forEach((opt) => {
        const o = sel.createEl("option", { value: opt.value, text: isRu ? opt.ru : opt.en });
        if (opt.value === curVal) o.selected = true;
      });
      sel.onchange = () => onChange(sel.value);
      return row;
    };

    // CARD 1: 3D Book Folio, Midnight Craft & Page Surface
    addHubCard(
      SICRAFT_SVGS.book,
      "1. Книжная студия 3D и Midnight Craft",
      "1. 3D Book Folio & Midnight Craft",
      "Переплёт из 14 страниц с физическим изгибом при скролле, ночная тема и дыхание корешка.",
      "14-sheet hardcover book folio with scroll page curl, Midnight Craft dark mode & breathing spine.",
      (body) => {
        makeToggleRow(body, "Журнальная тема Alchemy Craft", "Alchemy Craft Editorial Theme", this.settings.artcraftTheme, async (v) => {
          this.settings.artcraftTheme = v;
          await notifyChange("Тема обновлена", "Theme updated");
        });
        makeToggleRow(body, "Тёмная страница Midnight Craft", "Midnight Craft Dark Page", this.settings.darkCraftTheme, async (v) => {
          this.settings.darkCraftTheme = v;
          this.settings.surfaceMode = v ? "dark" : "warm";
          await notifyChange("Режим Midnight Craft обновлён", "Midnight Craft mode updated");
        });
        makeToggleRow(body, "3D-Книжный разворот и изгиб листа", "3D Book Spread & Page Curl", this.settings.bookSpreadMode, async (v) => {
          this.settings.bookSpreadMode = v;
          await notifyChange("3D-переплёт книги обновлён", "3D Book Folio updated");
        });
        makeToggleRow(body, "Дыхание корешка 6 BPM", "6-BPM Breathing Book Spine", this.settings.breathingSpine, async (v) => {
          this.settings.breathingSpine = v;
          await notifyChange("Дыхательный ритм обновлён", "Breathing spine updated");
        });
      }
    );

    // CARD 2: Alchemical Flask, Familiar & Directional Dock
    addHubCard(
      ALCHEMY_ICON_SVG,
      "2. Живая Колба-Эликсир и Позиция Панели",
      "2. Living Elixir Flask & Dock Kinematics",
      "Направленная анимация вылета из колбы (снизу, слева, справа) и 5 воплощений Фамильяра.",
      "Directional wind-arc kinematics (bottom, left, right) & 5 articulated Familiar manifestations.",
      (body) => {
        const curPos = !this.settings.dockVertical ? "bottom" : this.settings.dockSide === "left" ? "left" : "right";
        makeSelectRow(
          body,
          "Позиция панели и колбы",
          "Dock & Flask Position",
          [
            { value: "bottom", ru: "Снизу (вылет вверх и вправо)", en: "Bottom (upward arc)" },
            { value: "left", ru: "Слева сбоку (вылет вправо из колбы)", en: "Left Side (rightward arc)" },
            { value: "right", ru: "Справа сбоку (вылет влево из колбы)", en: "Right Side (leftward arc)" },
          ],
          curPos,
          async (val) => {
            await this.setDockPositionMode(val);
            await notifyChange("Позиция колбы изменена", "Dock position updated");
          }
        );
        makeSelectRow(
          body,
          "Воплощение из горлышка колбы",
          "Flask Familiar Manifestation",
          [
            { value: "auto", ru: "✨ Авто-смена всех 5 сцен", en: "✨ Auto-cycle all 5 scenes" },
            { value: "paw", ru: "🐾 Лапка с коготками и золотым клубком", en: "🐾 Cat Paw, Claws & Golden Orb" },
            { value: "smile", ru: "😺 Дух Чешира со следящими глазами", en: "😺 Cheshire Spirit & Tracking Eyes" },
            { value: "ears", ru: "🦊 Чувствительные ушки-локаторы", en: "🦊 Audio-Reactive Ears & Halo" },
            { value: "astrolabe", ru: "🧭 3D Алхимическая Астролябия", en: "🧭 3D Alchemical Astrolabe" },
            { value: "phoenix", ru: "🦋 Эфирный дух-феникс", en: "🦋 Ether Phoenix Sprite" },
          ],
          this.settings.familiarAnimationMode || "auto",
          async (val) => {
            this.settings.familiarAnimationMode = val;
            await this.saveSettings();
            if (this.settings.dockCollapsed) this.triggerFlaskManifestation(val === "auto" ? null : val);
            new Notice(isRu ? "Сцена Фамильяра выбрана!" : "Familiar manifestation selected!");
          }
        );
        makeToggleRow(body, "Связанные карточки на ветру внизу заметки", "Wind-Tethered Related Cards Footer", this.settings.windChainFooter !== false, async (v) => {
          this.settings.windChainFooter = v;
          await this.saveSettings();
          this.updateCurrentLeafKin();
        });
      }
    );

    // CARD 3: PC Audio Loopback Equalizer & Soundscapes
    addHubCard(
      SICRAFT_SVGS.sliders,
      "3. Эквалайзер Звука ПК и Фоновые Шумы",
      "3. PC Audio Equalizer & Soundscapes",
      "Живой спектр системного звука компьютера (WASAPI / Loopback), Dynamic Island и 16 звуков фокуса.",
      "Real-time PC system audio loopback spectrum, Dynamic Island & 16 stereo soundscapes.",
      (body) => {
        makeToggleRow(body, "Показывать эквалайзер в панели", "Show Equalizer in Dock", this.settings.showEqualizer !== false, async (v) => {
          this.settings.showEqualizer = v;
          await this.saveSettings();
          this.createFloatingDock();
        });
        makeToggleRow(
          body,
          "Синхронизация со звуком ПК (Loopback)",
          "Sync with PC System Audio (Loopback)",
          !!this.desktopAudioNodes,
          async (v) => {
            if (v) await this.startSystemAudioCapture(false);
            else this.stopAudioCapture(false);
            if (typeof onStateChanged === "function") onStateChanged();
          }
        );
        makeSelectRow(
          body,
          "Визуальный режим эквалайзера",
          "Equalizer Visual Mode",
          [
            { value: "craft", ru: "01 // Крафтовый Сейсмограф", en: "01 // Craft Ink Seismograph" },
            { value: "dna", ru: "02 // Квантовая Матрица", en: "02 // Quantum Matrix" },
            { value: "bars", ru: "03 // Ризограф и Штампы", en: "03 // Craft Risograph Stamps" },
            { value: "wave", ru: "04 // Чернильная Лента", en: "04 // Botanical Ink Ribbon" },
            { value: "orb", ru: "05 // Бумажное Оригами", en: "05 // Origami Topography" },
            { value: "ferro", ru: "06 // Струны Архитектора", en: "06 // Harmonic Strings" },
          ],
          this.settings.eqMode || "craft",
          async (val) => {
            this.settings.eqMode = val;
            await notifyChange("Режим эквалайзера обновлён", "Equalizer style updated");
          }
        );
        makeSelectRow(
          body,
          "Фоновый звук фокуса",
          "Background Soundscape",
          [{ value: "off", ru: "Выкл (Off)", en: "Off" }].concat(
            AMBIENT_SOUNDSCAPES.map((s) => ({ value: s.id, ru: s.ru, en: s.en }))
          ),
          this.settings.ambientSound || "off",
          async (val) => {
            await this.setAmbientSound(val);
          }
        );
      }
    );

    // CARD 4: Extended Knowledge Graph Studio
    addHubCard(
      SICRAFT_SVGS.graph,
      "4. Живой Граф Знаний (Extended Graph)",
      "4. Extended Knowledge Graph Studio",
      "Прямая раскраска узлов в памяти рендерера Obsidian, тепловая карта хабов и фильтрация.",
      "Direct PixiJS/WebGL node coloring, BFS folder propagation, hub heatmaps & focus isolation.",
      (body) => {
        makeToggleRow(body, "Включить студию графа Alchemy Craft", "Enable Alchemy Graph Studio", this.settings.enableBentoGraph !== false, async (v) => {
          this.settings.enableBentoGraph = v;
          await this.saveSettings();
          this.applyBodyClasses();
          this.injectGraphViewHUD();
        });
        makeSelectRow(
          body,
          "Алгоритм раскраски узлов",
          "Node Coloring Algorithm",
          [
            { value: "folders", ru: "🎨 Папки + Поток цвета (BFS)", en: "🎨 Folders + BFS Color Spread" },
            { value: "heatmap", ru: "🔥 Тепловая карта хабов (Связность)", en: "🔥 Hub Connectivity Heatmap" },
            { value: "recency", ru: "⚡ Свежесть изменения заметок", en: "⚡ Note Recency Heatmap" },
            { value: "nutrients", ru: "📚 Штампы книг и 5 Нутриентов", en: "📚 Book Stamps & 5 Nutrients" },
          ],
          this.settings.graphColorMode || "folders",
          async (val) => {
            this.settings.graphColorMode = val;
            this._graphColorsDirty = true;
            await this.saveSettings();
            this.injectGraphViewHUD();
            new Notice(isRu ? "Режим раскраски графа обновлён!" : "Graph coloring mode updated!");
          }
        );
        makeSelectRow(
          body,
          "Пространственный режим графа",
          "Graph Spatial Preset",
          [
            { value: "bento", ru: "Bento Grid (Сетка)", en: "Bento Grid" },
            { value: "mindpalace", ru: "3D Mind-Palace (Чертоги разума)", en: "3D Mind-Palace" },
            { value: "constellation", ru: "Созвездие хабов (Constellation)", en: "Hub Constellation" },
            { value: "radar", ru: "Фокус-Радар (Radar Sweep)", en: "Focus Radar" },
          ],
          this.settings.graphPreset || "bento",
          async (val) => {
            this.settings.graphPreset = val;
            this._graphColorsDirty = true;
            await this.saveSettings();
            this.injectGraphViewHUD();
          }
        );
        makeSelectRow(
          body,
          "Фильтр изоляции узлов",
          "Node Isolation Filter",
          [
            { value: "all", ru: "Все заметки", en: "All Notes" },
            { value: "hubs", ru: "Только главные хабы (Топ 25%)", en: "Top 25% Knowledge Hubs" },
            { value: "stamped", ru: "Только книги со штампом / закладками", en: "Stamped & Annotated Books Only" },
            { value: "no_orphans", ru: "Скрыть заметки-одиночки", en: "Hide Orphan Notes" },
          ],
          this.settings.graphFilterMode || "all",
          async (val) => {
            this.settings.graphFilterMode = val;
            this._graphColorsDirty = true;
            await this.saveSettings();
            this.injectGraphViewHUD();
          }
        );
      }
    );

    // CARD 5: Smart LED Lamp, Bionic Reading & Focus
    addHubCard(
      SICRAFT_SVGS.lamp,
      "5. Умная Лампа Lumina и Режимы Фокуса",
      "5. Smart LED Lamp & Focus Modes",
      "Настольный луч 2700K–6500K, световая линейка чтения, бионические корни слов и маркер.",
      "2700K–6500K desk beam, reading ruler, Bionic word anchors, sentence focus & key markers.",
      (body) => {
        makeToggleRow(body, "Включить умную лампу Lumina", "Enable Smart LED Lamp", !!this.settings.magicLamp, async (v) => {
          this.settings.magicLamp = v;
          await this.saveSettings();
          this.updateLampGpuStyle();
          this.updateDockUI();
        });
        makeSelectRow(
          body,
          "Форма светового луча",
          "Lamp Beam Shape",
          [
            { value: "radial", ru: "Круглый тёплый фокус", en: "Radial Warm Spotlight" },
            { value: "ruler", ru: "Горизонтальная линейка чтения", en: "Horizontal Reading Ruler" },
            { value: "deskbar", ru: "Широкая настольная лампа", en: "Wide Desk Bar" },
          ],
          this.settings.lampShape || "radial",
          async (val) => {
            this.settings.lampShape = val;
            this.settings.magicLamp = true;
            await this.saveSettings();
            this.updateLampGpuStyle();
            this.updateDockUI();
          }
        );
        makeToggleRow(body, "Пульсация света в такт басам ПК", "Audio Beat Lamp Sync", !!this.settings.lampBeatSync, async (v) => {
          this.settings.lampBeatSync = v;
          await this.saveSettings();
        });
        makeToggleRow(body, "Бионическое чтение (Bionic Anchors)", "Bionic Reading Word Anchors", !!this.settings.bionicAnchors, async (v) => {
          this.settings.bionicAnchors = v;
          await notifyChange("Бионическое чтение обновлено", "Bionic reading updated");
        });
        makeToggleRow(body, "Фокус на предложении / абзаце", "Sentence & Spotlight Focus", !!(this.settings.sentenceFocus || this.settings.spotlightFocus), async (v) => {
          this.settings.sentenceFocus = v;
          this.settings.spotlightFocus = v;
          await notifyChange("Режим фокуса обновлён", "Focus mode updated");
        });
        makeSelectRow(
          body,
          "Цвет маркера ключевых мыслей",
          "Key Sentence Marker Color",
          [
            { value: "lime", ru: "Изумрудно-лаймовый", en: "Alchemical Lime" },
            { value: "amber", ru: "Тёплый янтарь", en: "Warm Amber" },
            { value: "rose", ru: "Крафтовый розовый", en: "Archival Rose" },
            { value: "sky", ru: "Небесный лазурит", en: "Sky Lapis" },
            { value: "lavender", ru: "Мягкая лаванда", en: "Soft Lavender" },
          ],
          this.settings.keyMarkerColor || "lime",
          async (val) => {
            this.settings.keyMarkerColor = val;
            await notifyChange("Цвет маркера обновлён", "Marker color updated");
          }
        );
      }
    );

    // CARD 6: Book Shelf, 5-Nutrients, Tactile Typing & AI Cleaner
    addHubCard(
      SICRAFT_SVGS.shelf,
      "6. Книжная Полка, Печать и Чистка ИИ",
      "6. Classics Shelf, Typing Acoustics & AI",
      "Механический звук клавиш, чистка текста от ИИ-мусора, полка изученных книг и дайджест.",
      "Mechanical switch acoustics, AI watermark cleaner, Classics bookshelf & nutrient digest.",
      (body) => {
        makeSelectRow(
          body,
          "Звук механической клавиатуры",
          "Tactile Mechanical Keystrokes",
          [
            { value: "off", ru: "Выкл (Off)", en: "Off" },
            { value: "creamy_pom", ru: "Сливочный POM (Creamy Linear)", en: "Creamy POM Linear" },
            { value: "thock", ru: "Глубокий PBT Thock", en: "Deep PBT Thock" },
            { value: "matcha_lubed", ru: "Мягкий Matcha Yellow", en: "Smooth Matcha Yellow" },
            { value: "raindrop_wood", ru: "Древесный Орех (Walnut)", en: "Warm Walnut Tactile" },
            { value: "velvet_felt", ru: "Тихий Бархат (Silent Velvet)", en: "Silent Velvet" },
            { value: "paper_brush", ru: "Перо по пергаменту", en: "Quill on Parchment" },
          ],
          this.settings.tactileTypingSound || "off",
          async (val) => {
            this.settings.tactileTypingSound = val;
            await this.saveSettings();
            if (val !== "off") this.playTactileKeySound("a");
          }
        );
        makeToggleRow(body, "Кнопка чистки ИИ-символов в доке", "AI Text Cleaner Button in Dock", !!this.settings.enableAiCleaner, async (v) => {
          this.settings.enableAiCleaner = v;
          await this.saveSettings();
          this.createFloatingDock();
        });
        const btnRow = body.createDiv({ cls: "pro-hub-btn-row" });
        const btnShelf = btnRow.createEl("button", { cls: "artcraft-pay-action-btn is-soft" });
        btnShelf.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('shelf')}</span><span>${isRu ? "Открыть Полку Классики" : "Open Classics Shelf"}</span>`;
        btnShelf.onclick = () => new ClassicsBookshelfModal(this.app, this).open();

        const btnTour = btnRow.createEl("button", { cls: "artcraft-pay-action-btn is-soft" });
        btnTour.innerHTML = `<span class="svg-inline-icon">${sicraftIcon('spark')}</span><span>${isRu ? "Открыть Тур-Песочницу" : "Open Interactive Tour"}</span>`;
        btnTour.onclick = () => this.openInteractiveTourNote();
      }
    );
  }

  async saveSettings() {
    // During the 60-second test-drive isPro is switched on in memory only. Anything saved in that
    // minute must keep the real value, otherwise the preview would become a permanent unlock.
    if (this.proTestDriveActive && this.proTestDrivePrev && !this.settings.proTxHash) {
      await this.saveData({ ...this.settings, ...this.proTestDrivePrev });
      return;
    }
    await this.saveData(this.settings);
  }
}

class AlchemyCraftProModal extends Modal {
  constructor(app, plugin, initialMethod = "evm") {
    super(app);
    this.plugin = plugin;
    this.selectedNetwork = initialMethod === "promo" || initialMethod === "hub" ? "evm" : initialMethod;
    this.activeTab = initialMethod === "hub" ? "hub" : initialMethod === "promo" ? "promo" : (plugin.settings.isPro ? "hub" : "support");
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
      <h2 class="artcraft-soft-pro-title">${isRu ? "Угостить Капучино и открыть Alchemy Craft Pro" : "Treat a Cappuccino & Unlock Alchemy Craft Pro"} ${PRO_VERIFIED_BADGE_SVG}</h2>
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

    const tabHub = tabBar.createEl("button", {
      cls: "artcraft-ko-tab" + (this.activeTab === "hub" ? " is-active" : ""),
    });
    tabHub.innerHTML = `<span class="svg-inline-icon">${SICRAFT_SVGS.sliders}</span><span>${
      isRu ? "★ Все функции Pro (Вкл / Выкл)" : "★ Pro Features Hub (On / Off)"
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
        badge: isRu ? "ЛЮБИМЫЙ БЛЕНД • PRO" : "FAVORITE BLEND • PRO",
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

        const expectedAmount = isPromoView ? 0 : parseFloat(tiers[this.selectedTier] && tiers[this.selectedTier].amount) || 0;
        const verified = await this.verifyOnChain(val, isPromoView ? "promo" : this.selectedNetwork, expectedAmount);
        if (verified) {
          const uniqueLicenseKey = isValidSiCraftLicenseKey(val) ? val.toUpperCase() : generateSiCraftLicenseKey(val);
          const chosenPlan = this.verifiedPlan || tiers[this.selectedTier]?.planKey || "1_year";
          this.plugin.settings.isPro = true;
          this.plugin.settings.proTxHash = uniqueLicenseKey;
          this.plugin.settings.proActivatedAt = Date.now();
          this.plugin.settings.proPlan = chosenPlan;
          if (chosenPlan === "patron_lifetime") {
            this.plugin.settings.patronGiftKeys = [
              generateSiCraftLicenseKey(uniqueLicenseKey + "-GIFT1"),
              generateSiCraftLicenseKey(uniqueLicenseKey + "-GIFT2"),
              generateSiCraftLicenseKey(uniqueLicenseKey + "-GIFT3"),
            ];
          }
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.createFloatingDock();
          this.triggerProKeyMintingForge(verifyBox, uniqueLicenseKey, this.plugin.settings.patronGiftKeys);
          this.plugin.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 75);

          statusMsg.setText(t("successMsg", this.plugin));
          statusMsg.style.color = "#16A34A";
          new Notice(t("successMsg", this.plugin));

          setTimeout(() => this.close(), chosenPlan === "patron_lifetime" ? 3200 : 1850);
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
      tabHub.toggleClass("is-active", this.activeTab === "hub");

      // TAB 3: INTERACTIVE PRO FEATURES CONTROL HUB
      if (this.activeTab === "hub") {
        this.plugin.renderProFeaturesControlHub(bodyContainer);
        return;
      }

      // TAB 2: DEDICATED ZERO-CLUTTER PROMO CODE & VIP KEY VIEW
      if (this.activeTab === "promo") {
        renderVerificationBlock(bodyContainer, true);

        const promoFooter = bodyContainer.createDiv({ cls: "artcraft-soft-support-row" });
        promoFooter.innerHTML = `
          <div class="soft-support-left">
            <span class="svg-inline-icon">${SICRAFT_SVGS.chat}</span>
            <span>${isRu ? "Хотите получить промокод или оплатить картой напрямую?" : "Need a promo key or direct card link?"}</span>
            <strong class="pro-tg-author-link" style="cursor: pointer; text-decoration: underline;" title="${isRu ? "Написать в Telegram" : "Contact in Telegram"}">@StratAlchemy</strong>
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
          ${tObj.badge ? `<div class="ko-tier-popular">${PRO_VERIFIED_BADGE_SVG} <span>${tObj.badge}</span></div>` : ""}
          <div class="ko-tier-art">${tObj.svg}</div>
          <div class="ko-tier-name">${tObj.name}</div>
          <div class="ko-tier-price">${tObj.period}</div>
          <p class="ko-tier-desc">${tObj.desc}</p>
        `;
          card.dataset.tierId = tObj.id;
          card.onclick = () => {
            this.selectedTier = tObj.id;
            this.plugin.playTactileMicroFeedback("tap");
            renderView();
            this.triggerTierPourAnimation(tObj.id);
          };
        });
      this.mountRoasteryInteractiveSteam(tierGrid);

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
            <input type="text" inputmode="decimal" class="ko-custom-input" placeholder="5.00" value="${escHtml(this.customAmount)}" />
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
          syncCustomTier(); // the invoice and the summary must use the amount on the chip
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
      methodsLabel.setText(isRu ? "Способ оплаты:" : "Select Payment Method:");

      const methodPills = bodyContainer.createDiv({ cls: "artcraft-soft-method-pills" });
      const methods = [
        { id: "cryptobot", icon: SICRAFT_SVGS.send, label: "@CryptoBot (Telegram)" },
        { id: "evm", icon: SICRAFT_SVGS.globe, label: "Universal EVM (0x...)" },
        { id: "bybit", icon: SICRAFT_SVGS.zap, label: "Bybit UID" },
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
              <button class="artcraft-pay-action-btn is-sapphire" id="pro-create-api-invoice">
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
              if (this.invoicePending) return;
              this.invoicePending = true;
              setTimeout(() => (this.invoicePending = false), 15000);
              btnApiCb.disabled = true;
              btnApiCb.textContent = isRu ? "Создаём счёт в @CryptoBot..." : "Creating @CryptoBot invoice...";
              try {
                const obsidianApi = require("obsidian");
                const cleanAmount = (parseFloat(curAmount) || 4.99).toFixed(2);
                const tierName = activeTierObj ? activeTierObj.name : "Pro";
                const customDesc = `Alchemy Craft — ${tierName} (${cleanAmount})`;
                const sbKey = "sb_publishable_bmw71GhgQ24MoXaWq4fhSg_WU7YBmlG";
                const supabaseEndpoint = "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay";
                const res = await obsidianApi.requestUrl({
                  url: supabaseEndpoint,
                  method: "POST",
                  contentType: "application/json",
                  headers: {
                    "Content-Type": "application/json",
                    "apikey": sbKey,
                    "Authorization": `Bearer ${sbKey}`,
                  },
                  body: JSON.stringify({
                    action: "create_invoice",
                    amount: cleanAmount,
                    tier: activeTierObj ? activeTierObj.id : "silver",
                    description: customDesc,
                  }),
                  throw: false,
                });
                const d = res && res.json ? res.json : null;
                const payUrl = d?.pay_url || d?.result?.bot_invoice_url || d?.result?.pay_url || d?.result?.mini_app_invoice_url;
                const invId = d?.invoice_id || d?.result?.invoice_id;
                if (d && d.ok && payUrl) {
                  if (invId) {
                    const txField = this.contentEl.querySelector(".verify-tx-input");
                    if (txField) txField.value = String(invId);
                  }
                  new Notice(
                    isRu
                      ? `Счёт #${invId || ""} на $${cleanAmount} создан! Переходим в @CryptoBot...`
                      : `Invoice #${invId || ""} for $${cleanAmount} created! Opening @CryptoBot...`,
                    5000
                  );
                  this.invoicePending = false;
                  let safePayUrl = false;
                  try {
                    safePayUrl = new URL(payUrl).protocol === "https:";
                  } catch (e) {
                    safePayUrl = false;
                  }
                  if (safePayUrl) openExternalUrl(payUrl);
                  else new Notice(isRu ? "Сервер вернул некорректную ссылку на оплату." : "The server returned an invalid payment link.");
                  return;
                }
                const errDetail = d && (d.error?.name || d.error || d.message)
                  ? (typeof d.error === "object" ? JSON.stringify(d.error) : (d.error || d.message))
                  : (res?.status ? `HTTP ${res.status}` : "Network Error");
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
        let addrValue = ["0x5df707dda914", "77fc7c7563f683", "030da9d6cde7e2"].join("");
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
          addrValue = ["7vffsVxUZbBj3i", "LhagyaP8qCE7pK", "ybYrxmnHX9xdCKCs"].join("");
          noteText = isRu ? "Сеть Solana SPL (комиссия ~$0.001)." : "Solana SPL network (~$0.001 fee).";
        } else if (netId === "trc20") {
          labelText = "TRON Network (USDT TRC-20)";
          addrValue = ["TLR1QhncMJghep", "CyPPNDZodUxWtEjs8Qjy"].join("");
          noteText = isRu ? "Стандартный перевод USDT в сети TRON (TRC-20)." : "Standard USDT transfer on TRON (TRC-20).";
        }

        paymentDetailBox.innerHTML = `
          <div class="soft-pay-summary-row">
            <span class="soft-pay-tier-tag">${labelText}</span>
            <button class="soft-amount-copy-pill" id="pro-copy-amount-btn" title="${isRu ? "Скопировать сумму" : "Copy the amount"}">
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
    tabHub.onclick = () => {
      this.activeTab = "hub";
      renderView();
    };

    renderView();
  }

  // Checks a payment or a code. It returns true only when something was actually verified:
  //   1. a code redeemed on the server (promo codes and licences issued by the author);
  //   2. an offline licence key, or a built-in promo code (kept as SHA-256 hashes, not as text);
  //   3. a paid @CryptoBot invoice confirmed by the server, for at least the price of the chosen tier;
  //   4. a confirmed transfer to the author's wallet: USDT on TRON (token and amount checked),
  //      BNB Chain and Solana (recipient checked).
  // A network error is not a payment: it returns false and asks to try again.
  // What only a server can close: a public transaction can be reused by another person, and an offline
  // key or a promo code can be shared. See CHANGES-5.5.0.md.
  async verifyOnChain(txHash, network, expectedAmount = 0) {
    const input = (txHash || "").trim();
    const rawCode = input.toUpperCase();
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
    const say = (ru, en) => new Notice(isRu ? ru : en, 8000);
    const obsidianApi = require("obsidian");
    this.verifiedPlan = null;

    const SB = "https://tsnnckbvxokjmbgfeqdj.supabase.co";
    const sbKey = "sb_publishable_bmw71GhgQ24MoXaWq4fhSg_WU7YBmlG";
    const sbHeaders = { "Content-Type": "application/json", apikey: sbKey, Authorization: `Bearer ${sbKey}` };
    let serverReached = true;

    // 1. A code known to the server
    try {
      const resp = await fetch(SB + "/rest/v1/rpc/redeem_code", {
        method: "POST",
        headers: sbHeaders,
        body: JSON.stringify({ p_code: rawCode }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success) {
          this.verifiedPlan = data.plan || null;
          say(`Код принят. Тариф: ${data.plan || "1_year"}`, `Code accepted. Plan: ${data.plan || "1_year"}`);
          return true;
        }
      }
    } catch (err) {
      serverReached = false;
    }

    // 2. Offline licence key or built-in promo code
    if (isValidSiCraftLicenseKey(rawCode)) {
      say("Лицензионный ключ принят.", "Licence key accepted.");
      return true;
    }
    const PROMO_HASHES = [
      "25efc118fbc4dac7aae21864249094bb99d2942f575ff162e6ad72bf87106eef",
      "0de7565a69da8c0c6aed023bb8b9b8f3e418d03d44b963c02d0cb64713a3c7c1",
      "22306f6e255cb2807aaa0d68d2f714aba08a629f2a88767fe2767211611550b5",
      "0cad3ff0ea6fd68e518ea0fc5d5a55a626f7579070ae8e6cc01559216a168a61",
      "a5a70ac00df223736198e44660f7e8c73a031012f11b6c5321787127f088aba3",
      "a4411ed59391293bbc3275d234a27fa297ab631cdf289f05185abe9b92f63918",
      "226d23c0b1eef43ef2de7df4a7fb1720742d1b77605a011b5f228e790b4f6e9b",
      "7da3d70d12af442640d11af70d44977fb4b025f8a400b82c7b17cb307fbeaf1a",
      "6367381d4a5b0256a41e1937160cf7cd8cc23e547f51fd5550285f91cd421f8d",
      "0a26d836004baa341c3fc05a6a24d90bf15f55a38d6ee6c2687c2a48d59f6a69",
      "c12812d6be95180d2249b5304d6bac673f317b3116b41dbe1e48bd2147adafb4",
    ];
    const promoHash = await this.plugin.computeSha256Hex("alchemy-craft-promo:" + rawCode);
    if (PROMO_HASHES.includes(promoHash)) {
      say("Промокод принят.", "Promo code accepted.");
      return true;
    }
    if (network === "promo") {
      if (serverReached) say("Такого кода нет.", "This code is not known.");
      else say("Нет связи с сервером: код проверить не удалось. Повторите позже.", "The server could not be reached, so the code was not checked. Try again later.");
      return false;
    }

    // 3. A @CryptoBot invoice number (short and numeric; a transaction hash is never treated as one)
    const digits = rawCode.replace(/[^0-9]/g, "");
    const looksLikeInvoice = network === "cryptobot" || /^#?IV[0-9]{5,12}$/.test(rawCode);
    if (looksLikeInvoice) {
      if (digits.length < 5) {
        say("Введите номер счёта @CryptoBot.", "Enter the @CryptoBot invoice number.");
        return false;
      }
      let d = null;
      try {
        const cbRes = await obsidianApi.requestUrl({
          url: SB + "/functions/v1/cryptobot-pay",
          method: "POST",
          contentType: "application/json",
          headers: sbHeaders,
          body: JSON.stringify({ action: "check_invoice", invoice_id: digits }),
          throw: false,
        });
        try {
          d = cbRes.json;
        } catch (e) {
          d = null;
        }
      } catch (e) {
        say("Нет связи: счёт проверить не удалось. Повторите позже.", "No connection: the invoice was not checked. Try again later.");
        return false;
      }
      const items = (d && d.result && d.result.items) || [];
      const mine = items.filter((inv) => inv && (inv.invoice_id === undefined || String(inv.invoice_id) === digits));
      const paidItem = mine.find((inv) => inv.status === "paid");
      const paid = !!((d && d.ok && d.paid) || paidItem);
      const amount = parseFloat((paidItem && paidItem.amount) || (d && d.amount) || "0") || 0;
      if (paid) {
        if (expectedAmount && amount && amount + 0.01 < expectedAmount) {
          say(
            `Счёт #${digits} оплачен на $${amount}, а выбранный тариф стоит $${expectedAmount}. Выберите тариф по сумме оплаты.`,
            `Invoice #${digits} was paid for $${amount}, the selected tier costs $${expectedAmount}. Pick the tier that matches the payment.`
          );
          return false;
        }
        say(`Счёт @CryptoBot #${digits} оплачен.`, `@CryptoBot invoice #${digits} is paid.`);
        return true;
      }
      if (mine.length > 0 || (d && d.ok && d.paid === false)) {
        say("Счёт ещё не оплачен. Оплатите его в Telegram и нажмите проверку ещё раз.", "The invoice is not paid yet. Pay it in Telegram and verify again.");
      } else {
        say("Счёт с таким номером не найден.", "No invoice with this number was found.");
      }
      return false;
    }

    // 4. A transfer to the author's wallet
    const TRON_WALLET = ["TLR1QhncMJghep", "CyPPNDZodUxWtEjs8Qjy"].join("");
    const TRON_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const EVM_WALLET = ["0x5df707dda914", "77fc7c7563f683", "030da9d6cde7e2"].join("").toLowerCase();
    const SOL_WALLET = ["7vffsVxUZbBj3iLhagyaP8q", "CE7pKybYrxmnHX9xdCKCs"].join("");
    const notToAuthor = () =>
      say(
        "В этой транзакции нет подтверждённого перевода на кошелёк автора.",
        "This transaction has no confirmed transfer to the author's wallet."
      );
    try {
      if (network === "trc20") {
        if (!/^[0-9a-fA-F]{64}$/.test(input)) {
          say("Хеш транзакции TRON состоит из 64 знаков (0-9, a-f).", "A TRON transaction hash has 64 characters (0-9, a-f).");
          return false;
        }
        // TronGrid lists the token events of a confirmed transaction without an API key. requestUrl goes
        // through Obsidian itself, so a CORS policy cannot block the check.
        const res = await obsidianApi.requestUrl({
          url: "https://api.trongrid.io/v1/transactions/" + input.toLowerCase() + "/events?only_confirmed=true",
          method: "GET",
          throw: false,
        });
        if (res.status >= 400) throw new Error("trongrid " + res.status);
        let events = null;
        try {
          events = res.json && res.json.data;
        } catch (e) {
          events = null;
        }
        if (!Array.isArray(events)) throw new Error("trongrid: unreadable answer");
        // the author's address in the hex form the events use
        const TRON_WALLET_HEX = "0x72926563fda0715b99c923c6dfabee7cf2afae69";
        const transfer = events.find(
          (ev) =>
            ev &&
            ev.event_name === "Transfer" &&
            ev.contract_address === TRON_USDT &&
            ev.result &&
            String(ev.result.to || "").toLowerCase() === TRON_WALLET_HEX
        );
        if (!transfer) {
          notToAuthor();
          return false;
        }
        const paid = Number(transfer.result.value || 0) / 1e6; // USDT on TRON has 6 decimals
        if (expectedAmount && paid + 0.01 < expectedAmount) {
          say(
            `Переведено ${paid} USDT, а выбранный тариф стоит $${expectedAmount}. Выберите тариф по сумме оплаты.`,
            `${paid} USDT was sent, the selected tier costs $${expectedAmount}. Pick the tier that matches the payment.`
          );
          return false;
        }
        return true;
      }
      if (network === "evm") {
        if (!/^0x[0-9a-fA-F]{64}$/.test(input)) {
          say("Хеш транзакции начинается с 0x и содержит 64 знака после него.", "A transaction hash starts with 0x followed by 64 characters.");
          return false;
        }
        // BNB Chain public node. Other EVM networks are not checked automatically.
        const rpc = await obsidianApi.requestUrl({
          url: "https://bsc-dataseed.binance.org",
          method: "POST",
          contentType: "application/json",
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getTransactionReceipt", params: [input] }),
          throw: false,
        });
        let r = null;
        try {
          r = rpc.json && rpc.json.result;
        } catch (e) {
          r = null;
        }
        if (rpc.status >= 400) throw new Error("bsc rpc " + rpc.status);
        if (!r) {
          say(
            "Транзакция не найдена в BNB Chain. Автоматически проверяется только эта сеть; если платили в другой, напишите автору.",
            "The transaction was not found on BNB Chain. Only this network is checked automatically; for another one, contact the author."
          );
          return false;
        }
        const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
        const walletTail = EVM_WALLET.slice(2);
        const toAuthor =
          String(r.to || "").toLowerCase() === EVM_WALLET ||
          (r.logs || []).some((log) => log && log.topics && log.topics[0] === TRANSFER_TOPIC && String(log.topics[2] || "").toLowerCase().endsWith(walletTail));
        if (r.status !== "0x1" || !toAuthor) {
          notToAuthor();
          return false;
        }
        return true;
      }
      if (network === "solana") {
        if (!/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(input)) {
          say("Это не похоже на подпись транзакции Solana.", "This does not look like a Solana transaction signature.");
          return false;
        }
        const rpc = await obsidianApi.requestUrl({
          url: "https://api.mainnet-beta.solana.com",
          method: "POST",
          contentType: "application/json",
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTransaction", params: [input, { encoding: "json", maxSupportedTransactionVersion: 0 }] }),
          throw: false,
        });
        let tx = null;
        try {
          tx = rpc.json && rpc.json.result;
        } catch (e) {
          tx = null;
        }
        if (rpc.status >= 400) throw new Error("solana rpc " + rpc.status);
        const keys = (tx && tx.transaction && tx.transaction.message && tx.transaction.message.accountKeys) || [];
        const tokenOwners = ((tx && tx.meta && tx.meta.postTokenBalances) || []).map((b) => b && b.owner);
        if (!tx || !tx.meta || tx.meta.err !== null || !(keys.includes(SOL_WALLET) || tokenOwners.includes(SOL_WALLET))) {
          notToAuthor();
          return false;
        }
        return true;
      }
    } catch (e) {
      console.warn("[Alchemy Craft] payment check failed", e);
      say("Сеть проверки недоступна. Платёж не проверен, повторите позже.", "The verification network is unavailable. The payment was not checked, try again later.");
      return false;
    }

    // Bybit transfers by UID have no public record to check.
    say(
      "Перевод по Bybit UID автоматически не проверяется. Напишите автору в Telegram (@StratAlchemy), он пришлёт код активации.",
      "A Bybit UID transfer cannot be checked automatically. Message the author on Telegram (@StratAlchemy) to receive an activation code."
    );
    return false;
  }

  // =========================================================================
  // ARGON BRIEF #6: INTERACTIVE CAPPUCCINO STEAM, COFFEE POUR / CRYPTO COIN
  // DROP & HOT-METAL PRO KEY MINTING FORGE
  // =========================================================================
  mountRoasteryInteractiveSteam(tierGrid) {
    if (this._roasteryRaf) {
      cancelAnimationFrame(this._roasteryRaf);
      this._roasteryRaf = null;
    }
    if (!tierGrid) return;
    tierGrid.style.position = "relative";

    let cv = tierGrid.querySelector(".artcraft-roastery-fx-canvas");
    if (!cv) {
      cv = document.createElement("canvas");
      cv.className = "artcraft-roastery-fx-canvas";
      cv.width = 640;
      cv.height = 175;
      tierGrid.appendChild(cv);
    }
    this._roasteryCanvas = cv;

    if (!this._roasteryState) {
      this._roasteryState = {
        vx: 0,
        vy: 0,
        mx: -999,
        my: -999,
        steam: Array.from({ length: 27 }, (_, i) => ({
          tierIdx: i % 3,
          xOff: ((i * 7) % 26) - 13,
          y: 22 + ((i * 13) % 52),
          r: 3.5 + (i % 4) * 1.8,
          vy: 0.36 + (i % 3) * 0.14,
          vx: 0,
          phase: i * 0.8,
          alpha: 0.18 + (i % 3) * 0.12,
        })),
        drops: [],
        coins: [],
        ripples: [],
      };
    }

    let lastMx = 0;
    let lastMy = 0;
    tierGrid.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(1, r.width)) * cv.width;
      const y = ((e.clientY - r.top) / Math.max(1, r.height)) * cv.height;
      const st = this._roasteryState;
      if (st) {
        st.vx = Math.max(-18, Math.min(18, x - lastMx));
        st.vy = Math.max(-18, Math.min(18, y - lastMy));
        st.mx = x;
        st.my = y;
      }
      lastMx = x;
      lastMy = y;
    });

    const stepRoastery = () => {
      this._roasteryRaf = null;
      if (!cv.isConnected || document.hidden) return;
      const ctx = cv.getContext("2d");
      const W = cv.width;
      const H = cv.height;
      ctx.clearRect(0, 0, W, H);

      const st = this._roasteryState;
      st.vx *= 0.9;
      st.vy *= 0.9;
      const centers = [W * 0.166, W * 0.5, W * 0.833];

      // 1. Procedural Cappuccino & Chemex Steam reacting to cursor wind
      st.steam.forEach((p) => {
        p.phase += 0.05;
        p.y -= p.vy;
        const baseCx = centers[p.tierIdx] + p.xOff;
        const dx = baseCx + p.vx - st.mx;
        const dy = p.y - st.my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 3600) {
          const push = (1 - Math.sqrt(distSq) / 60) * 0.42;
          p.vx += st.vx * push;
        }
        p.vx *= 0.94;
        if (p.y < 6) {
          p.y = 62;
          p.vx = 0;
        }
        const prog = 1 - (p.y - 6) / 56;
        const curX = baseCx + Math.sin(p.phase) * 4.5 + p.vx;
        const curR = p.r + prog * 6.5;
        const curA = Math.sin(prog * Math.PI) * (this.selectedTier === ["bronze", "silver", "gold"][p.tierIdx] ? 0.46 : 0.26);

        const g = ctx.createRadialGradient(curX, p.y, 0.5, curX, p.y, curR);
        g.addColorStop(0, `rgba(196, 148, 102, ${curA.toFixed(3)})`);
        g.addColorStop(1, "rgba(196, 148, 102, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(curX, p.y, curR, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Coffee Pour Stream & Foam Droplets on Tier Selection
      for (let i = st.drops.length - 1; i >= 0; i--) {
        const d = st.drops[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.28;
        d.life++;
        if (d.y >= 64 || d.life >= d.maxLife) {
          if (d.y >= 64) {
            st.ripples.push({ x: d.x, y: 64, r: 2, maxR: 16, alpha: 0.75, color: d.color });
          }
          st.drops.splice(i, 1);
          continue;
        }
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Golden Crypto Coin Drop into Cup/Flask
      for (let i = st.coins.length - 1; i >= 0; i--) {
        const c = st.coins[i];
        c.y += c.vy;
        c.vy += 0.36;
        c.rot += 0.22;
        if (c.y >= 62) {
          st.ripples.push({ x: c.x, y: 62, r: 3, maxR: 22, alpha: 0.9, color: "#F59E0B" });
          for (let s = 0; s < 8; s++) {
            const ang = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
            st.drops.push({
              x: c.x,
              y: 60,
              vx: Math.cos(ang) * (1.2 + Math.random() * 2.2),
              vy: Math.sin(ang) * (1.8 + Math.random() * 2.2),
              r: 1.8,
              color: "#FBBF24",
              life: 0,
              maxLife: 24,
            });
          }
          st.coins.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(Math.cos(c.rot), 1);
        ctx.fillStyle = "#F59E0B";
        ctx.strokeStyle = "#FEF08A";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 4. Cup Surface Ripples
      for (let i = st.ripples.length - 1; i >= 0; i--) {
        const rp = st.ripples[i];
        rp.r += 0.85;
        rp.alpha -= 0.045;
        if (rp.alpha <= 0) {
          st.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      this._roasteryRaf = requestAnimationFrame(stepRoastery);
    };
    this._roasteryRaf = requestAnimationFrame(stepRoastery);
  }

  triggerTierPourAnimation(tierId) {
    const st = this._roasteryState;
    const cv = this._roasteryCanvas;
    if (!st || !cv) return;
    const idx = tierId === "bronze" ? 0 : tierId === "silver" ? 1 : 2;
    const cx = cv.width * [0.166, 0.5, 0.833][idx];

    // Pour warm espresso & crema droplets
    for (let i = 0; i < 18; i++) {
      st.drops.push({
        x: cx + (Math.random() - 0.5) * 6,
        y: 4 + i * 1.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 1.5 + Math.random() * 1.6,
        r: i % 3 === 0 ? 2.4 : 1.9,
        color: i % 3 === 0 ? "#FDE68A" : "#A45A2A",
        life: 0,
        maxLife: 36,
      });
    }
    // Drop a spinning golden alchemical coin
    st.coins.push({ x: cx, y: 6, vy: 1.4, rot: 0 });
  }

  playKeyMintingAcousticSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.plugin.keyAudioCtx) this.plugin.keyAudioCtx = new AudioCtx();
      const ctx = this.plugin.keyAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      // 1. Crisp tactile anvil micro-click impact
      const impactOsc = ctx.createOscillator();
      const impactGain = ctx.createGain();
      impactOsc.type = "triangle";
      impactOsc.frequency.setValueAtTime(280, now);
      impactOsc.frequency.exponentialRampToValueAtTime(58, now + 0.065);
      impactGain.gain.setValueAtTime(0.24, now);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      impactOsc.connect(impactGain);
      impactGain.connect(ctx.destination);
      impactOsc.start(now);
      impactOsc.stop(now + 0.075);

      // 2. Golden alchemical minting harmonic bell resonance
      [528, 792, 1056, 1584].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + 0.03 + i * 0.025);
        g.gain.setValueAtTime(0.0001, now + 0.03 + i * 0.025);
        g.gain.linearRampToValueAtTime(0.11 / (i + 1), now + 0.05 + i * 0.025);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + 0.03 + i * 0.025);
        osc.stop(now + 1.5);
      });
    } catch (e) {}
  }

  triggerProKeyMintingForge(verifyBox, mintedKey, giftKeys) {
    this.playKeyMintingAcousticSound();
    if (!verifyBox) return;
    verifyBox.classList.add("is-minting-gold");
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    const stampOverlay = document.createElement("div");
    stampOverlay.className = "artcraft-minted-key-seal";
    const giftHtml =
      Array.isArray(giftKeys) && giftKeys.length > 0
        ? `<div class="minted-gift-keys">${isRu ? "Ваши 3 подарочных ключа для друзей:" : "Your 3 Patron Gift Keys for friends:"} <code>${giftKeys.join("</code> · <code>")}</code></div>`
        : "";
    stampOverlay.innerHTML = `
      <div class="minted-seal-badge">★ ${isRu ? "ВЫЧЕКАНЕНО В ЗОЛОТЕ АЛХИМИКА" : "MINTED IN ALCHEMICAL GOLD"} ★</div>
      <div class="minted-seal-code">${escHtml(mintedKey)}</div>
      ${giftHtml}
    `;
    verifyBox.appendChild(stampOverlay);

    if (stampOverlay.animate) {
      stampOverlay.animate(
        [
          { opacity: 0, transform: "scale(1.65) rotate(-6deg)", filter: "brightness(2.2) blur(4px)" },
          { opacity: 1, transform: "scale(0.95) rotate(1deg)", filter: "brightness(1.3) blur(0px)", offset: 0.45 },
          { opacity: 1, transform: "scale(1) rotate(0deg)", filter: "brightness(1) blur(0px)" }
        ],
        { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
      );
    }
  }

  onClose() {
    if (this._roasteryRaf) {
      cancelAnimationFrame(this._roasteryRaf);
      this._roasteryRaf = null;
    }
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
    const loc = getLocale(this.plugin);
    const isRu = loc === "ru";

    const createSectionGroup = (num, title, subOrTitleEn, iconOrSubRu, subEn, iconSvg) => {
      let resolvedTitle, resolvedSub, finalIcon;
      if (typeof title === "object") {
        resolvedTitle = i18n(title, this.plugin);
        resolvedSub = typeof subOrTitleEn === "object" ? i18n(subOrTitleEn, this.plugin) : subOrTitleEn;
        finalIcon = iconOrSubRu;
      } else {
        resolvedTitle = isRu ? title : subOrTitleEn;
        resolvedSub = isRu ? iconOrSubRu : subEn;
        finalIcon = iconSvg;
      }
      const groupWrap = containerEl.createDiv({ cls: "artcraft-settings-group-card" });
      const groupHead = groupWrap.createDiv({ cls: "artcraft-settings-group-head" });
      groupHead.innerHTML = `
        <div class="settings-group-badge-row">
          <span class="settings-group-num">${num}</span>
          <span class="settings-group-icon">${finalIcon}</span>
          <span class="settings-group-title">${resolvedTitle}</span>
        </div>
        ${resolvedSub ? `<div class="settings-group-sub">${resolvedSub}</div>` : ""}
      `;
      return groupWrap.createDiv({ cls: "artcraft-settings-group-items" });
    };

    // Clean Header Card
    const heroBanner = containerEl.createDiv({ cls: "artcraft-settings-bento-hero" });
    heroBanner.innerHTML = `
      <div class="artcraft-settings-hero-left">
        <div class="artcraft-settings-flask-box">${ALCHEMY_ICON_SVG}</div>
        <div>
          <div class="artcraft-settings-hero-title">
            Alchemy Craft
            <span class="artcraft-hero-version-pill">v${this.plugin.manifest.version}</span>
          </div>
          <div class="artcraft-settings-hero-sub">By Elyaz Aliverdiyev (@StratAlchemy)</div>
        </div>
      </div>
      <div class="artcraft-settings-hero-actions">
        <button class="artcraft-hero-soft-btn is-primary-soft" id="artcraft-open-site-btn">
          <span class="svg-inline-icon">${sicraftIcon('globe')}</span>
          <span>${isRu ? "Сайт" : "Website"}</span>
          <span class="svg-inline-icon">${sicraftIcon('external')}</span>
        </button>
        <button class="artcraft-hero-soft-btn" id="artcraft-check-rel-btn">
          <span class="svg-inline-icon">${sicraftIcon('spark')}</span>
          <span>${t("checkUpdatesBtn", this.plugin)}</span>
        </button>
      </div>
    `;
    heroBanner.querySelector("#artcraft-open-site-btn")?.addEventListener("click", () => {
      openExternalUrl("https://elyazaliverdiyev.github.io/alchemy-craft/");
    });
    heroBanner.querySelector("#artcraft-check-rel-btn")?.addEventListener("click", () => {
      window.open("obsidian://show-plugin?id=artcraft-reader");
    });

    // =========================================================================
    // SECTION 01: READING & TYPOGRAPHY
    // =========================================================================
    const secReadability = createSectionGroup(
      "01",
      { en: "Reading & Typography", ru: "Чтение и Типографика" },
      { en: "Interface language, book layout, and note header.", ru: "Язык интерфейса, книжная вёрстка и шапка заметки." },
      SICRAFT_SVGS.book
    );

    new Setting(secReadability)
      .setName(t("langName", this.plugin))
      .setDesc(isRu ? "Язык меню и панели инструментов." : "Language for menus and dock controls.")
      .addDropdown((drop) =>
        drop
          .addOption("en", "EN — English")
          .addOption("ru", "RU — Русский")
          .addOption("zh", "ZH — 中文 (Chinese)")
          .addOption("ja", "JA — 日本語 (Japanese)")
          .addOption("es", "ES — Español")
          .addOption("de", "DE — Deutsch")
          .setValue(this.plugin.settings.uiLanguage || getLocale(this.plugin))
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
      .setDesc(isRu ? "Включить книжную вёрстку и оформление заголовков." : "Enable book typography and structured headings.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.artcraftTheme).onChange(async (value) => {
          this.plugin.settings.artcraftTheme = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    new Setting(secReadability)
      .setName(isRu ? "Расположение нижней панели" : "Floating Dock Position")
      .setDesc(isRu ? "Снизу по центру или вертикально справа." : "Bottom horizontal bar or right vertical bar.")
      .addDropdown((drop) =>
        drop
          .addOption("bottom", isRu ? "Снизу (Bottom)" : "Bottom")
          .addOption("right", isRu ? "Справа (Right)" : "Right Side")
          .setValue(this.plugin.settings.dockVertical ? "right" : "bottom")
          .onChange(async (val) => {
            await this.plugin.setDockPositionMode(val);
          })
      );

    new Setting(secReadability)
      .setName(t("taskBarName", this.plugin))
      .setDesc(isRu ? "Полоса выполнения чек-боксов в шапке заметки." : "Checklist progress bar at the top of the note.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showTaskProgress !== false).onChange(async (val) => {
          this.plugin.settings.showTaskProgress = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
      .setName(isRu ? "Время чтения и счётчик слов" : "Reading Time & Word Count")
      .setDesc(isRu ? "Компактная плашка статистики в шапке заметки." : "Compact reading stats pill in the note header.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showReadingStats !== false).onChange(async (val) => {
          this.plugin.settings.showReadingStats = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
      .setName(isRu ? "Книжная страница (3D-переплёт)" : "Book Page Folio Mode")
      .setDesc(isRu ? "Оформление заметки в виде книжного листа с корешком." : "Present notes as a physical book page with a spine.")
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.bookSpreadMode).onChange(async (val) => {
          this.plugin.settings.bookSpreadMode = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateTaskProgressBar();
        })
      );

    new Setting(secReadability)
      .setName(t("numBadgeSetName", this.plugin))
      .setDesc(isRu ? "Подсвечивать цифры, проценты и даты в режиме чтения." : "Highlight numbers, percentages, and dates in reading view.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.colorizeNumbers).onChange(async (value) => {
          this.plugin.settings.colorizeNumbers = value;
          await this.plugin.saveSettings();
        })
      );

    // =========================================================================
    // SECTION 02: AUDIO & EQUALIZER
    // =========================================================================
    const secSonic = createSectionGroup(
      "02",
      { en: "Audio & Equalizer", ru: "Звук и Эквалайзер" },
      { en: "Equalizer visualizer, ambient soundscapes, and typing acoustics.", ru: "Визуализатор эквалайзера, фоновые звуки и озвучка клавиш." },
      SICRAFT_SVGS.sliders
    );

    new Setting(secSonic)
      .setName(t("eqSetName", this.plugin))
      .setDesc(isRu ? "Показывать живой эквалайзер в панели управления." : "Show the live audio equalizer pill in the dock.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showEqualizer !== false).onChange(async (val) => {
          this.plugin.settings.showEqualizer = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    new Setting(secSonic)
      .setName(isRu ? "Стиль эквалайзера" : "Equalizer Style")
      .setDesc(isRu ? "Режим отображения волн эквалайзера." : "Waveform visualization style.")
      .addDropdown((drop) =>
        drop
          .addOption("craft", isRu ? "01 // Сейсмограф" : "01 // Craft Seismograph")
          .addOption("dna", isRu ? "02 // Световая Волна" : "02 // Harmonic Wave")
          .addOption("bars", isRu ? "03 // Ризограф" : "03 // Risograph Bars")
          .addOption("wave", isRu ? "04 // Шёлковая Лента" : "04 // Silk Ribbon")
          .addOption("orb", isRu ? "05 // Оригами" : "05 // Origami")
          .addOption("ferro", isRu ? "06 // Струны" : "06 // Strings")
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
      .setDesc(isRu ? "Фоновый звук для концентрации." : "Background ambient sound for focus.")
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
      .setDesc(isRu ? "Механический отклик при наборе текста." : "Mechanical keystroke sound while typing.")
      .addDropdown((drop) =>
        drop
          .addOption("off", isRu ? "Выкл (Off)" : "Off")
          .addOption("creamy_pom", isRu ? "Creamy POM" : "Creamy POM")
          .addOption("thock", isRu ? "Deep PBT Thock" : "Deep PBT Thock")
          .addOption("matcha_lubed", isRu ? "Smooth Yellow" : "Smooth Yellow")
          .addOption("raindrop_wood", isRu ? "Warm Walnut" : "Warm Walnut")
          .addOption("velvet_felt", isRu ? "Silent Velvet" : "Silent Velvet")
          .addOption("paper_brush", isRu ? "Шорох бумаги" : "Paper Whisper")
          .setValue(this.plugin.settings.tactileTypingSound || "off")
          .onChange(async (val) => {
            this.plugin.settings.tactileTypingSound = val;
            await this.plugin.saveSettings();
            if (val !== "off") this.plugin.playTactileKeySound("a");
          })
      );

    // =========================================================================
    // SECTION 03: FOCUS, POMODORO & LAMP
    // =========================================================================
    const secFocus = createSectionGroup(
      "03",
      { en: "Focus, Pomodoro & Lamp", ru: "Фокус, Помодоро и Лампа" },
      { en: "Work timer, reading focus modes, and warm desk lamp.", ru: "Таймер спринтов, фокус на тексте и настольная лампа." },
      SICRAFT_SVGS.lamp
    );

    new Setting(secFocus)
      .setName(t("pomoDurName", this.plugin))
      .setDesc(isRu ? "Длительность рабочего спринта Помодоро." : "Duration of a single Pomodoro focus sprint.")
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
      .setName(isRu ? "Приглушать звук на перерыве" : "Auto-Fade Audio on Break")
      .setDesc(isRu ? "Плавно снижает громкость во время отдыха Помодоро." : "Lowers ambient volume automatically during Pomodoro breaks.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.pomoAudioLink !== false).onChange(async (val) => {
          this.plugin.settings.pomoAudioLink = val;
          await this.plugin.saveSettings();
        })
      );

    new Setting(secFocus)
      .setName(t("lampSetName", this.plugin))
      .setDesc(isRu ? "Мягкая настольная подсветка (2700K–6500K)." : "Warm adjustable reading light (2700K–6500K).")
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
      .setDesc(isRu ? "Выделять предложение под курсором при чтении." : "Highlight the active sentence under the cursor.")
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
      .setDesc(isRu ? "Приглушать соседние абзацы для концентрации." : "Dim surrounding paragraphs to keep focus on the active block.")
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.spotlightFocus).onChange(async (val) => {
          this.plugin.settings.spotlightFocus = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    // =========================================================================
    // SECTION 04: KNOWLEDGE GRAPH
    // =========================================================================
    const secGraph = createSectionGroup(
      "04",
      { en: "Knowledge Graph", ru: "Граф Знаний" },
      { en: "Folder color palette and graph controls.", ru: "Цветовая палитра папок и управление графом." },
      SICRAFT_SVGS.graph
    );

    new Setting(secGraph)
      .setName(t("bentoGraphName", this.plugin))
      .setDesc(isRu ? "Автоматическая раскраска папок графа в 8 цветов." : "Colorize graph folders with an 8-color palette.")
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

    // =========================================================================
    // SECTION 05: PRO LICENSE & SUPPORT
    // =========================================================================
    const secPro = createSectionGroup(
      "05",
      { en: "Pro License & Support", ru: "Pro-Лицензия и Поддержка" },
      { en: "Manage Pro features, support the creator, or activate a license key.", ru: "Управление функциями Pro, поддержка автора и активация ключа." },
      SICRAFT_SVGS.coffee
    );

    const statusCard = secPro.createDiv({ cls: "artcraft-pro-status-banner" });
    statusCard.innerHTML = `
      <div class="pro-status-left">
        <div class="pro-status-badge-row">
          <span class="pro-verified-tag">${PRO_VERIFIED_BADGE_SVG} <span>${this.plugin.settings.isPro ? (isRu ? "PRO АКТИВЕН" : "PRO ACTIVE") : (isRu ? "БАЗОВАЯ ВЕРСИЯ" : "STANDARD")}</span></span>
          <span class="pro-plan-name">${this.plugin.settings.isPro ? (isRu ? "Lifetime License" : "Lifetime License") : (isRu ? "Доступно обновление" : "Upgrade Available")}</span>
        </div>
        <div class="pro-status-sub">${
          this.plugin.settings.isPro
            ? (isRu ? "Все Pro-функции разблокированы и доступны." : "All Pro features are unlocked and active.")
            : (isRu ? "Поддержите проект, чтобы разблокировать все функции Pro." : "Support the project to unlock all Pro features.")
        }</div>
      </div>
      <div class="pro-status-right">
        <button class="artcraft-pay-action-btn is-sapphire" id="pro-open-roastery-btn">
          <span class="svg-inline-icon">${SICRAFT_SVGS.coffee}</span>
          <span>${isRu ? "Кофейня / Ключ Pro" : "Support / License Key"}</span>
        </button>
      </div>
    `;
    statusCard.querySelector("#pro-open-roastery-btn")?.addEventListener("click", () => {
      if (this.plugin.activeProModal) this.plugin.activeProModal.close();
      new AlchemyCraftProModal(this.app, this.plugin, "support").open();
    });

    new Setting(secPro)
      .setName(isRu ? "Тёмная тема Midnight Craft" : "Midnight Craft Dark Mode")
      .setDesc(isRu ? "Глубокий тёмный режим для чтения ночью." : "Deep dark mode for night reading.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.darkCraftTheme).onChange(async (val) => {
          this.plugin.settings.darkCraftTheme = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    new Setting(secPro)
      .setName(isRu ? "Дыхание корешка книги (6 BPM)" : "Breathing Book Spine (6 BPM)")
      .setDesc(isRu ? "Плавное свечение вдоль корешка для спокойного ритма чтения." : "Subtle rhythmic glow along the book spine.")
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.breathingSpine).onChange(async (val) => {
          this.plugin.settings.breathingSpine = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    new Setting(secPro)
      .setName(isRu ? "Карточки связанных заметок внизу страницы" : "Related Note Cards Footer")
      .setDesc(isRu ? "Показывать аккуратную схему связанных заметок под текстом." : "Show linked note cards at the bottom of the page.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.windChainFooter !== false).onChange(async (val) => {
          this.plugin.settings.windChainFooter = val;
          await this.plugin.saveSettings();
          this.plugin.updateCurrentLeafKin();
        })
      );

    new Setting(secPro)
      .setName(isRu ? "Бионическое чтение (Bionic Reading)" : "Bionic Reading Word Anchors")
      .setDesc(isRu ? "Выделять начало слов для быстрого чтения." : "Emphasize word beginnings for faster scanning.")
      .addToggle((toggle) =>
        toggle.setValue(!!this.plugin.settings.bionicAnchors).onChange(async (val) => {
          this.plugin.settings.bionicAnchors = val;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
        })
      );

    new Setting(secPro)
      .setName(isRu ? "Связь с автором и сообщество" : "Community & Contact")
      .setDesc(isRu ? "Telegram-канал автора и страница проекта на GitHub." : "Official Telegram channel and GitHub repository.")
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
  }
}

// --- INTERACTIVE TOUR NOTE CONTENT (RU / EN) ---
function getAlchemyTourMarkdown(isRu, version) {
  const today = localDayKey();
  if (isRu) {
    return `---
title: "Alchemy Craft — Интерактивный тур"
tags: [alchemy-craft, tour]
created: ${today}
plugin-version: "${version}"
---

# Alchemy Craft — Интерактивный тур

> [!abstract] Зачем этот плагин
> Alchemy Craft превращает обычную заметку в **тёплую книжную страницу**: ясная иерархия глав, цветные номера, живой прогресс задач, фокус-режимы и звук. Эта заметка — живая песочница: всё, что вы видите ниже, отрисовано самим плагином. Меняйте, кликайте, проверяйте.

---

## 01 // Главы, подглавы и разделы

Заголовки строят «оглавление на глаз»: глава → подглава → раздел. Каждый уровень получает свой вес, цветной корешок и отступ — структура считывается за секунду.

### 1.1 Подглава: как устроена иерархия

#### Раздел A — заголовок 4-го уровня
Используйте \`#\` для названия книги, \`##\` для глав, \`###\` для подглав и \`####\` для разделов.

#### Раздел B — нумерованные шаги
1. Нумерованные списки превращаются в квадратные бейджи **01, 02, 03**.
2. Глаз сразу видит порядок действий.
3. Вложенность сохраняется:
   1. подшаг первый;
   2. подшаг второй.

---

## 02 // Цифры и метрики сами бросаются в глаза

Пример: выручка выросла на **+340%**, конверсия — 4.8%, средний чек — $49.99, спринт длится 25 минут, релиз назначен на ${today}. Плагин подсвечивает числа, проценты, суммы и даты без какой-либо разметки.

| Метрика | Было | Стало | Изменение |
| :--- | ---: | ---: | ---: |
| Время на чтение главы | 42 мин | 18 мин | −57% |
| Запомненных идей | 3 | 9 | +200% |
| Закрытых задач | 4/12 | 11/12 | 92% |

> Таблицы получают зелёную «финансовую» шапку и чёткие границы.

---

## 03 // Галочки, прогресс и штамп «Изучено»

Отмечайте пункты — над заметкой обновляется полоска **«Задачи: x/y»**. На 100% прозвучит аккорд виолончели и арфы, а в углу появится штамп **ИЗУЧЕНО**.

- [x] Открыть интерактивный тур
- [x] Посмотреть главы и подглавы
- [ ] Включить «Книжный лист» (кнопка **Книжный лист** над заметкой)
- [ ] Прикрепить закладку-нутриент (кнопка **+ Закладка**)
- [ ] Запустить Помодоро в нижней панели
- [ ] Отметить последний пункт и услышать аккорд 

---

## 04 // Книжный лист: корешок и стопка страниц

Нажмите **Книжный лист** — заметка ляжет на тёплый стол как раскрытая книга: кожаный корешок со строчкой, внутренняя тень переплёта и стопка листов справа и снизу.

1. Материал корешка: нижняя панель → **Focus ▾** → *Коньяк / Сафьян / Бархат / Лён*.
2. «Дыхание корешка» — мягкая волна света 5.5 с вдох / 5.5 с выдох для спокойного ритма.
3. «Хроно-чернила» — старые заметки (14+ дней) получают благородный оттенок архивных чернил.

---

## 05 // 5 закладок-нутриентов (метод чтения книг)

Каждая идея получает роль, как питательное вещество:

- 🔴 **Белки** — сделать немедленно
- 🟠 **Углеводы** — обдумать утром
- 🟡 **Жиры** — истории и примеры
- 🟢 **Витамины** — цитаты
- 🔵 **Клетчатка** — факты и цифры

Кнопка **+ Закладка** над заметкой → выберите тип → закладка появится полоской над текстом. **Дайджест** собирает все закладки в план действий.

---

## 06 // Фокус-режимы для чтения

- **Фокус предложения** — наведите на предложение: оно мягко подсвечивается. Клик закрепляет подсветку выбранным цветом.
- **Spotlight** — всё, кроме текущего абзаца, слегка приглушается.
- **Световая линейка** — тёплая полоса по строке чтения.
- **Пейсер 300 слов/мин** — плавный луч ведёт взгляд по строкам.
- **Умная лампа** — круг или настольная планка света 2700K–6500K, остальная «комната» затемняется.

> [!tip] Где включать
> Нижняя панель → кнопка **Focus ▾**. Лампа — кнопка **Lamp**.

---

## 07 // Помодоро, звук и эквалайзер

1. Клик по таймеру — старт/пауза, двойной клик — сброс, **правый клик** — пресеты 15 / 25 / 45 / 60 / 90 минут.
2. **Sonic Studio** — фоновые сцены (дождь, кофейня, 40Hz Gamma, поезд), звуки «кремовых» свитчей при наборе.
3. Эквалайзер реагирует на реальный звук ПК (YouTube, Spotify, Telegram).

---

## 08 // Капсула времени (сургучная печать)

Как это работает:

1. **Focus ▾ → «Капсула времени»** (или команда *Time Capsule: seal / open current note*).
2. Выберите срок (1 день — 1 месяц) и напишите вопрос себе: *«Какие 3 главные идеи этой главы?»*.
3. Заметка скроется под печатью с обратным отсчётом. Файл **не изменяется** и не шифруется — это режим активного припоминания.
4. Пока срок не наступил, вспоминайте ответ по памяти. Досрочно — удерживайте печать 1,5 секунды.
5. В день вскрытия Obsidian пришлёт уведомление, печать засияет золотом — нажмите и сравните ответ с текстом.

---

## 09 // Презентация и инструменты

- **Laser** — светящаяся указка с хвостом (Esc — выключить).
- **Draw / Eraser** — рисуйте стрелки и круги прямо поверх текста, Ctrl+Z — отмена.
- **Полка классики** — все заметки базы со штампом «Изучено» на деревянной полке; экслибрис можно сохранить в PNG.
- **Граф** — пастельные группы папок, режимы *Bento Grid*, *3D Mind-Palace*, *Focus Radar*.

---

> [!success] Готово
> Отметьте все галочки в разделе 03 — и эта заметка получит штамп **ИЗУЧЕНО**. Сайт и руководство: https://elyazaliverdiyev.github.io/alchemy-craft/
`;
  }

  return `---
title: "Alchemy Craft — Interactive Tour"
tags: [alchemy-craft, tour]
created: ${today}
plugin-version: "${version}"
---

# Alchemy Craft — Interactive Tour

> [!abstract] Why this plugin exists
> Alchemy Craft turns a plain note into a **warm book page**: a clear chapter hierarchy, colour-coded numbers, live task progress, focus modes and sound. This note is a live sandbox — everything below is rendered by the plugin itself. Edit it, click it, try it.

---

## 01 // Chapters, sub-chapters and sections

Headings build a "table of contents at a glance": chapter → sub-chapter → section. Every level gets its own weight, coloured spine and spacing, so structure reads in a second.

### 1.1 Sub-chapter: how the hierarchy works

#### Section A — a level-4 heading
Use \`#\` for the book title, \`##\` for chapters, \`###\` for sub-chapters and \`####\` for sections.

#### Section B — numbered steps
1. Numbered lists become square badges **01, 02, 03**.
2. Your eye sees the order of actions instantly.
3. Nesting is preserved:
   1. first sub-step;
   2. second sub-step.

---

## 02 // Numbers and metrics stand out on their own

Example: revenue grew **+340%**, conversion is 4.8%, average order $49.99, a sprint lasts 25 minutes, release is set for ${today}. The plugin highlights numbers, percentages, amounts and dates with zero extra markup.

| Metric | Before | After | Change |
| :--- | ---: | ---: | ---: |
| Time to read a chapter | 42 min | 18 min | −57% |
| Ideas remembered | 3 | 9 | +200% |
| Tasks closed | 4/12 | 11/12 | 92% |

> Tables get a green "financial" header and crisp borders.

---

## 03 // Checkboxes, progress and the "Mastered" stamp

Tick items — the **"Tasks: x/y"** bar above the note updates live. At 100% a cello & harp chord plays and a **MASTERED** stamp appears in the corner.

- [x] Open the Interactive Tour
- [x] Look at chapters and sub-chapters
- [ ] Turn on "Book Page" (the **Book Page** button above the note)
- [ ] Attach a nutrient sticker (the **+ Sticker** button)
- [ ] Start a Pomodoro in the bottom dock
- [ ] Tick the last item and hear the chord 

---

## 04 // Book Page: spine and stacked sheets

Press **Book Page** — the note rests on a warm desk like an open hardcover: a stitched leather spine, inner binding shadow and a stack of sheets along the right and bottom edges.

1. Spine material: bottom dock → **Focus ▾** → *Cognac / Emerald / Crimson / Linen*.
2. "Breathing spine" — a soft 5.5 s inhale / 5.5 s exhale glow for a calm rhythm.
3. "Chrono-ink" — older notes (14+ days) take on a noble archival ink tone.

---

## 05 // 5 nutrient stickers (a book-reading method)

Every idea gets a role, like a nutrient:

- 🔴 **Proteins** — do it now
- 🟠 **Carbs** — ponder in the morning
- 🟡 **Fats** — stories and examples
- 🟢 **Vitamins** — quotes
- 🔵 **Fiber** — facts and figures

**+ Sticker** above the note → choose a type → the sticker appears as a strip above the text. **Digest** gathers all stickers into an action plan.

---

## 06 // Focus modes for reading

- **Sentence focus** — hover a sentence and it softly lights up; click to pin it in your colour.
- **Spotlight** — everything except the current paragraph is gently dimmed.
- **Reading ruler** — a warm band along the line you read.
- **300 WPM pacer** — a gliding beam guides your eyes.
- **Smart lamp** — a circle or desk bar of 2700K–6500K light, the rest of the "room" dims.

> [!tip] Where to switch them on
> Bottom dock → **Focus ▾**. The lamp is the **Lamp** button.

---

## 07 // Pomodoro, sound and equalizer

1. Click the timer to start/pause, double-click to reset, **right-click** for 15 / 25 / 45 / 60 / 90 minute presets.
2. **Sonic Studio** — ambient scenes (rain, café, 40Hz Gamma, night train) and creamy switch sounds while typing.
3. The equalizer reacts to real desktop audio (YouTube, Spotify, Telegram).

---

## 08 // Time Capsule (wax seal)

How it works:

1. **Focus ▾ → "Time Capsule"** (or the command *Time Capsule: seal / open current note*).
2. Pick a period (1 day — 1 month) and write a question to yourself: *"What are the 3 key ideas of this chapter?"*.
3. The note hides under a seal with a countdown. The file is **not modified** or encrypted — this is an active-recall mode.
4. Until the date, recall the answer from memory. To open early, press & hold the seal for 1.5 seconds.
5. On the unlock day Obsidian shows a notice and the seal turns gold — click it and compare your answer with the text.

---

## 09 // Presenting and tools

- **Laser** — a glowing pointer with a comet tail (Esc to exit).
- **Draw / Eraser** — draw arrows and circles right over the text, Ctrl+Z to undo.
- **Classics shelf** — every "Mastered" note on a wooden shelf; export an ex-libris card as PNG.
- **Graph** — pastel folder groups, *Bento Grid*, *3D Mind-Palace*, *Focus Radar* modes.

---

> [!success] Done
> Tick every box in chapter 03 and this note earns the **MASTERED** stamp. Website & guide: https://elyazaliverdiyev.github.io/alchemy-craft/
`;
}

// --- TIME CAPSULE SEAL MODAL (EXPLAINS THE FEATURE, PICKS DATE + RECALL QUESTION) ---
class TimeCapsuleSealModal extends Modal {
  constructor(app, plugin, file) {
    super(app);
    this.plugin = plugin;
    this.file = file;
    this.days = 7;
    this.customDate = "";
    this.message = "";
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    modalEl.addClass("artcraft-capsule-modal");
    const loc = getLocale(this.plugin);
    const locTag = LOCALE_TAGS[loc] || "en-US";
    modalEl.setAttribute("lang", locTag);
    contentEl.empty();

    const presets = I18N_CAPSULE.presets;
    const minDate = localDayKey(new Date(Date.now() + 86400000));

    contentEl.innerHTML = `
      <div class="capsule-head">
        <span class="capsule-badge">${i18n(I18N_CAPSULE.badge, this.plugin)}</span>
        <h2 class="capsule-title">${i18n(I18N_CAPSULE.title, this.plugin)}</h2>
        <div class="capsule-file">${escHtml(this.file.basename)}</div>
      </div>
      <ol class="capsule-steps">
        <li><span>01</span><div><strong>${i18n(I18N_CAPSULE.step1Title, this.plugin)}</strong><small>${
          i18n(I18N_CAPSULE.step1Desc, this.plugin)
        }</small></div></li>
        <li><span>02</span><div><strong>${i18n(I18N_CAPSULE.step2Title, this.plugin)}</strong><small>${
          i18n(I18N_CAPSULE.step2Desc, this.plugin)
        }</small></div></li>
        <li><span>03</span><div><strong>${i18n(I18N_CAPSULE.step3Title, this.plugin)}</strong><small>${
          i18n(I18N_CAPSULE.step3Desc, this.plugin)
        }</small></div></li>
      </ol>
      <div class="capsule-label">${i18n(I18N_CAPSULE.unlockAfter, this.plugin)}</div>
      <div class="capsule-chips">
        ${presets.map((p) => `<button class="capsule-chip ${p.d === this.days ? "is-active" : ""}" data-days="${p.d}">${p[loc] || p.en}</button>`).join("")}
        <label class="capsule-date-wrap" title="${i18n(I18N_CAPSULE.datePlaceholder, this.plugin)}">${i18n(I18N_CAPSULE.orDate, this.plugin)} <input type="date" class="capsule-date" min="${minDate}" lang="${locTag}"></label>
      </div>
      <div class="capsule-label">${i18n(I18N_CAPSULE.questionLabel, this.plugin)}</div>
      <textarea class="capsule-message" rows="3" maxlength="600" placeholder="${
        i18n(I18N_CAPSULE.questionPlaceholder, this.plugin)
      }"></textarea>
      <div class="capsule-summary"></div>
      <div class="capsule-actions">
        <button class="capsule-cancel">${i18n(I18N_CAPSULE.cancel, this.plugin)}</button>
        <button class="capsule-seal mod-cta">${i18n(I18N_CAPSULE.sealBtn, this.plugin)}</button>
      </div>
    `;

    const summaryEl = contentEl.querySelector(".capsule-summary");
    const computeUnlock = () => {
      if (this.customDate) {
        const [y, m, d] = this.customDate.split("-").map(Number);
        const t = new Date(y, (m || 1) - 1, d || 1, 9, 0, 0).getTime();
        if (Number.isFinite(t) && t > Date.now()) return t;
      }
      return Date.now() + this.days * 86400000;
    };
    const refreshSummary = () => {
      const t = computeUnlock();
      const label = new Date(t).toLocaleString(locTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      summaryEl.textContent = `${i18n(I18N_CAPSULE.summaryPrefix, this.plugin)}${label}`;
    };

    contentEl.querySelectorAll(".capsule-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        this.days = Number(chip.getAttribute("data-days")) || 7;
        this.customDate = "";
        const dateInput = contentEl.querySelector(".capsule-date");
        if (dateInput) dateInput.value = "";
        contentEl.querySelectorAll(".capsule-chip").forEach((c) => c.classList.toggle("is-active", c === chip));
        refreshSummary();
      });
    });
    contentEl.querySelector(".capsule-date")?.addEventListener("change", (e) => {
      this.customDate = e.target.value || "";
      contentEl.querySelectorAll(".capsule-chip").forEach((c) => c.classList.toggle("is-active", !this.customDate && Number(c.getAttribute("data-days")) === this.days));
      refreshSummary();
    });
    contentEl.querySelector(".capsule-message")?.addEventListener("input", (e) => {
      this.message = e.target.value || "";
    });
    contentEl.querySelector(".capsule-cancel")?.addEventListener("click", () => this.close());
    contentEl.querySelector(".capsule-seal")?.addEventListener("click", async () => {
      const unlockAt = computeUnlock();
      this.close();
      await this.plugin.sealTimeCapsule(this.file, unlockAt, this.message);
    });
    refreshSummary();
  }

  onClose() {
    this.contentEl.empty();
  }
}




// =========================================================================
// 1. LIFE RPG & SHA-256 BLOCKCHAIN QUEST CHAIN MODAL (CLEAN SWISS BENTO DESIGN, 6 LANGUAGES)
// =========================================================================
class LifeRpgQuestChainModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.activeTab = "rpg";
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    if (modalEl) modalEl.addClass("artcraft-wide-craft-modal", "artcraft-quest-chain-modal", "artcraft-airy-modal");
    contentEl.empty();
    const loc = getLocale(this.plugin);
    const isRu = loc === "ru";

    if (!this.plugin.settings.lifeRpg) {
      this.plugin.settings.lifeRpg = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.lifeRpg));
    }
    const rpg = this.plugin.settings.lifeRpg;
    const chain = this.plugin.settings.questBlockchain || [];
    const latestBlock = chain[chain.length - 1] || { hash: "0000a48f...", index: 0 };
    const xpInLevel = (rpg.xp || 0) % 100;

    const render = () => {
      contentEl.empty();
      const head = contentEl.createDiv({ cls: "artcraft-rpg-hero" });
      head.innerHTML = `
        <div class="artcraft-rpg-hero-top">
          <div>
            <div class="artcraft-rpg-badge">${sicraftIcon('chain')} <span>${i18n({
              en: "QUEST JOURNAL · SHA-256 TASK LEDGER",
              ru: "ЖУРНАЛ ЗАДАЧ · РЕЕСТР SHA-256",
              zh: "人生 RPG · SHA-256 工作量证明账本",
              ja: "ライフRPG · SHA-256 プルーフ・オブ・ワーク台帳",
              es: "LIFE RPG · REGISTRO SHA-256",
              de: "LIFE RPG · SHA-256 PROOF-OF-WORK REGISTER"
            }, this.plugin)}</span></div>
            <h2 class="artcraft-rpg-title">${i18n({
              en: "Quest Architecture & Cryptographic Task Chain",
              ru: "Архитектура Квестов и Крипто-Цепочка Задач",
              zh: "任务架构与加密任务链",
              ja: "クエスト設計と暗号化タスクチェーン",
              es: "Arquitectura de Misiones y Cadena de Tareas",
              de: "Quest-Architektur & Kryptografische Aufgabenkette"
            }, this.plugin)}</h2>
          </div>
          <div class="artcraft-rpg-level-card">
            <div class="rpg-lvl-num">LVL ${rpg.level || 1}</div>
            <div class="rpg-lvl-xp">${rpg.xp || 0} XP · ${chain.length} ${i18n({ en: "blocks", ru: "блоков", zh: "区块", ja: "ブロック", es: "bloques", de: "Blöcke" }, this.plugin)}</div>
            <div class="rpg-lvl-bar"><span style="width:${xpInLevel}%"></span></div>
          </div>
        </div>
        <div class="artcraft-rpg-hash-strip">
          <span><small>SHA-256:</small> <code>#${latestBlock.index} · ${String(latestBlock.hash || "").slice(0, 28)}…</code></span>
          <button class="artcraft-rpg-verify-btn" data-act="verify">${sicraftIcon('shield')} <span>${i18n({
            en: "Verify Chain",
            ru: "Проверить цепочку",
            zh: "验证哈希链",
            ja: "チェーン検証",
            es: "Verificar cadena",
            de: "Kette prüfen"
          }, this.plugin)}</span></button>
        </div>
      `;

      const tabs = contentEl.createDiv({ cls: "artcraft-rpg-tabs" });
      [
        { id: "rpg", icon: "focus", label: i18n({ en: "Quests (6-OS)", ru: "Квесты (6-OS)", zh: "任务矩阵", ja: "クエスト", es: "Misiones", de: "Quests" }, this.plugin) },
        { id: "heatmap", icon: "eqMatrix", label: i18n({ en: "365 Heatmap", ru: "365-Карта", zh: "365热力图", ja: "365日マップ", es: "Mapa 365", de: "365-Heatmap" }, this.plugin) },
        { id: "onchain", icon: "globe", label: i18n({ en: "Testnet Record ($0)", ru: "Запись в сети ($0)", zh: "智能合约 ($0)", ja: "コントラクト ($0)", es: "Contrato ($0)", de: "Smart Contract ($0)" }, this.plugin) },
        { id: "ledger", icon: "chain", label: `${i18n({ en: "SHA-256 Blocks", ru: "Блоки SHA-256", zh: "SHA-256 区块", ja: "SHA-256 ブロック", es: "Bloques SHA-256", de: "SHA-256 Blöcke" }, this.plugin)} (${chain.length})` },
        { id: "value-formula", icon: "zap", label: i18n({ en: "Value Formula", ru: "Формула ценности", zh: "价值公式", ja: "価値方程式", es: "Fórmula de Valor", de: "Wertformel" }, this.plugin) }
      ].forEach((tObj) => {
        const b = tabs.createEl("button", {
          cls: "artcraft-rpg-tab" + (this.activeTab === tObj.id ? " is-active" : "")
        });
        b.innerHTML = `${sicraftIcon(tObj.icon)}<span>${tObj.label}</span>`;
        b.addEventListener("click", () => {
          this.plugin.playTactileMicroFeedback("tap");
          this.activeTab = tObj.id;
          render();
        });
      });

      const body = contentEl.createDiv({ cls: "artcraft-rpg-body" });

      if (this.activeTab === "rpg") {
        body.innerHTML = `
          <div class="artcraft-rpg-grid-2">
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">01 · ${i18n({ en: "ANTI-VISION (AVOID)", ru: "АНТИ-ВИДЕНИЕ (ЧЕГО ИЗБЕГАЕМ)", zh: "反愿景 (避免的状态)", ja: "アンチビジョン (避けるべき状態)", es: "ANTI-VISIÓN", de: "ANTI-VISION" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="antiVision" rows="2">${escHtml(rpg.antiVision || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">02 · ${i18n({ en: "VISION MVP (IDEAL DAY)", ru: "ВИДЕНИЕ (ИДЕАЛЬНЫЙ ДЕНЬ)", zh: "理想愿景 MVP", ja: "理想の1日 (Vision MVP)", es: "VISIÓN MVP", de: "VISION MVP" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="visionMvp" rows="2">${escHtml(rpg.visionMvp || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">03 · ${i18n({ en: "1-YEAR MISSION", ru: "МИССИЯ НА 1 ГОД", zh: "1年核心使命", ja: "1年間のミッション", es: "MISIÓN A 1 AÑO", de: "1-JAHRES-MISSION" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="oneYearMission" rows="2">${escHtml(rpg.oneYearMission || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">04 · ${i18n({ en: "1-MONTH BOSS FIGHT", ru: "ГЛАВНЫЙ ПРОЕКТ МЕСЯЦА", zh: "本月核心攻坚 (Boss Fight)", ja: "今月の最重要課題", es: "PROYECTO DEL MES", de: "MONATS-PROJEKT" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="oneMonthBoss" rows="2">${escHtml(rpg.oneMonthBoss || "")}</textarea>
            </div>
          </div>

          <div class="artcraft-rpg-levers-box">
            <div class="rpg-card-kicker">05 · ${i18n({ en: "DAILY LEVERS (EACH TASK MINES A SHA-256 BLOCK)", ru: "ЕЖЕДНЕВНЫЕ РЫЧАГИ (КАЖДЫЙ ШАГ ПОДПИСЫВАЕТСЯ SHA-256)", zh: "每日核心杠杆 (完成即生成 SHA-256 区块)", ja: "毎日のレバー (完了ごとに SHA-256 ブロックを生成)", es: "PALANCAS DIARIAS (FIRMA SHA-256)", de: "TÄGLICHE HEBEL (SHA-256 SIGNATUR)" }, this.plugin)}</div>
            <div class="rpg-levers-list">
              ${(rpg.dailyLevers || [])
                .map(
                  (lv, idx) => `
                <div class="rpg-lever-row ${lv.done ? "is-done" : ""}" data-idx="${idx}">
                  <button class="rpg-lever-check" data-toggle="${idx}">${lv.done ? "✓" : ""}</button>
                  <span class="rpg-lever-title">${escHtml(lv.title)}</span>
                  <span class="rpg-lever-xp">+${lv.xp || 35} XP</span>
                  <button class="rpg-lever-del" data-del="${idx}">×</button>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="rpg-add-row">
              <input type="text" class="rpg-new-quest-input" placeholder="${
                i18n({
                  en: "Add a daily lever or quest...",
                  ru: "Добавить новый квест или рычаг дня...",
                  zh: "添加新的每日杠杆任务...",
                  ja: "新しいデイリークエストを追加...",
                  es: "Añadir nueva misión diaria...",
                  de: "Neuen täglichen Quest hinzufügen..."
                }, this.plugin)
              }" />
              <button class="rpg-add-quest-btn mod-cta">${i18n({ en: "+ Add (+40 XP)", ru: "+ Добавить (+40 XP)", zh: "+ 添加 (+40 XP)", ja: "+ 追加 (+40 XP)", es: "+ Añadir (+40 XP)", de: "+ Hinzufügen (+40 XP)" }, this.plugin)}</button>
            </div>
          </div>

          <div class="artcraft-rpg-footer-actions">
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="insert-cert">
              ${sicraftIcon('stamp')} <span>${i18n({
                en: "Insert Signed SHA-256 Certificate into Note",
                ru: "Вставить сертификат SHA-256 в заметку",
                zh: "将 SHA-256 证书插入当前笔记",
                ja: "SHA-256 証明書をノートに挿入",
                es: "Insertar certificado SHA-256 en la nota",
                de: "SHA-256 Zertifikat in Notiz einfügen"
              }, this.plugin)}</span>
            </button>
          </div>
        `;

        body.querySelectorAll(".rpg-input-area").forEach((ta) => {
          ta.addEventListener("change", async () => {
            const f = ta.getAttribute("data-field");
            if (f) {
              rpg[f] = ta.value;
              await this.plugin.saveSettings();
            }
          });
        });

        body.querySelectorAll("[data-toggle]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const idx = Number(btn.getAttribute("data-toggle"));
            const item = rpg.dailyLevers[idx];
            if (!item) return;
            item.done = !item.done;
            if (item.done) {
              await this.plugin.mineQuestBlock(item.title, item.xp || 35, true);
            } else {
              await this.plugin.saveSettings();
            }
            render();
          });
        });

        body.querySelectorAll("[data-del]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const idx = Number(btn.getAttribute("data-del"));
            rpg.dailyLevers.splice(idx, 1);
            await this.plugin.saveSettings();
            render();
          });
        });

        const addInput = body.querySelector(".rpg-new-quest-input");
        const addBtn = body.querySelector(".rpg-add-quest-btn");
        const submitNewQuest = async () => {
          const val = (addInput && addInput.value || "").trim();
          if (!val) return;
          rpg.dailyLevers.push({ id: "lever-" + Date.now(), title: val, xp: 40, done: false });
          await this.plugin.saveSettings();
          render();
        };
        addBtn?.addEventListener("click", submitNewQuest);
        addInput?.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitNewQuest();
        });
      } else if (this.activeTab === "heatmap") {
        const dayMap = {};
        chain.forEach((b) => {
          // the day in the user's time zone; the fixed starting block is not an activity
          const when = new Date(b.timestamp || "");
          if (Number.isNaN(when.getTime()) || Number(b.index) === 0) return;
          const dKey = localDayKey(when);
          if (!dayMap[dKey]) dayMap[dKey] = { xp: 0, count: 0, quests: [] };
          dayMap[dKey].xp += Number(b.xp) || 25;
          dayMap[dKey].count += 1;
          dayMap[dKey].quests.push(b.quest);
        });
        const today = new Date();
        // A day without activity stays empty. It used to be filled with the lifetime totals.
        const todayIso = localDayKey(today);
        const todayRec = dayMap[todayIso] || { xp: 0, count: 0, quests: [] };

        const cells = [];
        let activeDaysCount = 0;
        for (let d = 364; d >= 0; d--) {
          const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d);
          const iso = localDayKey(dt);
          const rec = dayMap[iso] || { xp: 0, count: 0, quests: [] };
          if (rec.count > 0) activeDaysCount++;
          const lvl = rec.xp >= 120 ? 4 : rec.xp >= 70 ? 3 : rec.xp >= 35 ? 2 : rec.xp > 0 ? 1 : 0;
          cells.push({ iso, xp: rec.xp, count: rec.count, lvl, sample: rec.quests[rec.quests.length - 1] || "" });
        }

        body.innerHTML = `
          <div class="artcraft-heatmap-card">
            <div class="heatmap-head-row">
              <div>
                <div class="rpg-card-kicker">${i18n({
                  en: "365-DAY PROOF-OF-WORK ACTIVITY",
                  ru: "АКТИВНОСТЬ ЗА 365 ДНЕЙ (PROOF-OF-WORK)",
                  zh: "365天工作量证明热力图",
                  ja: "365日プルーフ・オブ・ワーク活動記録",
                  es: "MAPA DE ACTIVIDAD DE 365 DÍAS",
                  de: "365-TAGE PROOF-OF-WORK AKTIVITÄT"
                }, this.plugin)}</div>
                <div class="heatmap-sub">${i18n({
                  en: `Active days: ${activeDaysCount} · Signed blocks: ${chain.length} · Level ${rpg.level || 1}`,
                  ru: `Активных дней: ${activeDaysCount} · Подписано блоков: ${chain.length} · Уровень ${rpg.level || 1}`,
                  zh: `活跃天数：${activeDaysCount} · 已签名区块：${chain.length} · 等级 ${rpg.level || 1}`,
                  ja: `アクティブ日数：${activeDaysCount} · 署名済みブロック：${chain.length} · レベル ${rpg.level || 1}`,
                  es: `Días activos: ${activeDaysCount} · Bloques: ${chain.length} · Nivel ${rpg.level || 1}`,
                  de: `Aktive Tage: ${activeDaysCount} · Blöcke: ${chain.length} · Level ${rpg.level || 1}`
                }, this.plugin)}</div>
              </div>
              <div class="heatmap-legend">
                <span>${i18n({ en: "Less", ru: "Меньше", zh: "少", ja: "少", es: "Menos", de: "Weniger" }, this.plugin)}</span>
                <i class="hm-lvl-0"></i><i class="hm-lvl-1"></i><i class="hm-lvl-2"></i><i class="hm-lvl-3"></i><i class="hm-lvl-4"></i>
                <span>${i18n({ en: "Flow", ru: "Поток", zh: "高能", ja: "多", es: "Más", de: "Mehr" }, this.plugin)}</span>
              </div>
            </div>
            <div class="artcraft-heatmap-grid">
              ${cells
                .map(
                  (c) =>
                    `<div class="artcraft-hm-cell hm-lvl-${c.lvl}" data-iso="${c.iso}" data-xp="${c.xp}" data-cnt="${c.count}" title="${c.iso}: ${c.xp} XP (${c.count})"></div>`
                )
                .join("")}
            </div>
            <div class="artcraft-hm-hover-inspector">
              <strong>${todayIso}</strong> — <strong>${todayRec.xp} XP</strong> (${todayRec.count})
            </div>
          </div>
          <div class="artcraft-rpg-footer-actions">
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="log-sprint-now">
              ${sicraftIcon('zap')} <span>${i18n({
                en: "+ Log 90-Min Deep Work Sprint (+60 XP)",
                ru: "+ Записать 90-мин спринт Deep Work (+60 XP)",
                zh: "+ 记录 90 分钟深度工作冲刺 (+60 XP)",
                ja: "+ 90分ディープワークを記録 (+60 XP)",
                es: "+ Registrar sprint de 90 min (+60 XP)",
                de: "+ 90-Min Deep-Work-Sprint buchen (+60 XP)"
              }, this.plugin)}</span>
            </button>
          </div>
        `;

        const inspector = body.querySelector(".artcraft-hm-hover-inspector");
        body.querySelectorAll(".artcraft-hm-cell").forEach((cell) => {
          cell.addEventListener("mouseenter", () => {
            if (!inspector) return;
            inspector.innerHTML = `<strong>${cell.getAttribute("data-iso")}</strong> — <strong>${cell.getAttribute("data-xp")} XP</strong> (${cell.getAttribute("data-cnt")} SHA-256)`;
          });
        });

        body.querySelector('[data-act="log-sprint-now"]')?.addEventListener("click", async () => {
          await this.plugin.mineQuestBlock(
            isRu ? "90-минутный спринт Deep Work" : "90-Minute Deep Work Sprint",
            60,
            true
          );
          render();
        });
      } else if (this.activeTab === "onchain") {
        if (!this.plugin.settings.onChainConfig) {
          this.plugin.settings.onChainConfig = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.onChainConfig));
        }
        const oc = this.plugin.settings.onChainConfig;
        if (!oc.lastAnchorTx && oc.lastAnchoredTx) oc.lastAnchorTx = oc.lastAnchoredTx;
        if (oc.isVerifiedOnChain && !oc.verifiedPatron) oc.verifiedPatron = true;
        const rootHashHex = "0x" + String(latestBlock.hash || "").replace(/^0x/, "").padStart(64, "0").slice(0, 64);
        const vaultTag = (rpg.oneMonthBoss || "AlchemyCraft").slice(0, 48);
        const calldata = this.plugin.encodeAnchorCalldata(rootHashHex, chain.length, rpg.xp || 100, rpg.level || 1, vaultTag);

        const networks = {
          "base-sepolia": { name: "Base Sepolia Testnet ($0.00 Free)", chainId: "84532", rpc: "https://sepolia.base.org", explorer: "https://sepolia.basescan.org" },
          "polygon-amoy": { name: "Polygon Amoy Testnet ($0.00 Free)", chainId: "80002", rpc: "https://rpc-amoy.polygon.technology", explorer: "https://amoy.polygonscan.com" },
          "base-mainnet": { name: "Base Mainnet (L2 • ~$0.0004)", chainId: "8453", rpc: "https://mainnet.base.org", explorer: "https://basescan.org" },
          "opbnb": { name: "opBNB Mainnet (L2 • ~$0.0002)", chainId: "204", rpc: "https://opbnb-mainnet-rpc.bnbchain.org", explorer: "https://opbnbscan.com" }
        };
        const netInfo = networks[oc.network] || networks["base-sepolia"];

        body.innerHTML = `
          <div class="artcraft-onchain-box">
            <div class="onchain-status-banner ${oc.lastAnchorTx ? "is-anchored" : ""}">
              <div>
                <div class="rpg-card-kicker">AlchemyProofOfWorkRegistry.sol · Chain ID ${netInfo.chainId}</div>
                <strong>${
                  oc.lastAnchorTx
                    ? `★ TX SAVED (not checked by the plugin): ${escHtml(String(oc.lastAnchorTx).slice(0, 18))}…`
                    : i18n({
                        en: "Zero-cost anchoring on Base Sepolia Testnet ($0.00 gas)",
                        ru: "Бесплатная фиксация цепочки квестов в сети Base Sepolia ($0.00 газ)",
                        zh: "在 Base Sepolia 测试网免费锚定任务链 ($0.00 Gas)",
                        ja: "Base Sepolia テストネットで無料アンカリング ($0.00 ガス)",
                        es: "Anclaje gratuito en Base Sepolia ($0.00 gas)",
                        de: "Kostenlose Verankerung auf Base Sepolia ($0.00 Gas)"
                      }, this.plugin)
                }</strong>
              </div>
            </div>

            <div class="artcraft-rpg-grid-2">
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">01 · ${i18n({ en: "NETWORK", ru: "СЕТЬ БЛОКЧЕЙНА", zh: "区块链网络", ja: "ネットワーク", es: "RED", de: "NETZWERK" }, this.plugin)}</div>
                <select class="onchain-net-select">
                  ${Object.keys(networks)
                    .map((k) => `<option value="${k}" ${oc.network === k ? "selected" : ""}>${networks[k].name}</option>`)
                    .join("")}
                </select>
                <div class="onchain-meta-lines">
                  <div>RPC: <code>${netInfo.rpc}</code></div>
                </div>
              </div>
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">02 · ${i18n({ en: "CONTRACT ADDRESS", ru: "АДРЕС КОНТРАКТА", zh: "合约地址", ja: "コントラクトアドレス", es: "DIRECCIÓN DEL CONTRATO", de: "VERTRAGSADRESSE" }, this.plugin)}</div>
                <input type="text" class="onchain-contract-input" value="${escHtml(oc.contractAddress || "")}" placeholder="0x..." />
                <div class="onchain-meta-lines">
                  <div>Root: <code>${rootHashHex.slice(0, 22)}…</code></div>
                </div>
              </div>
            </div>

            <div class="artcraft-calldata-box">
              <div class="rpg-card-kicker">03 · ABI CALLDATA (anchorQuestChainRoot)</div>
              <div class="calldata-params-line"><code>["${escHtml(rootHashHex)}", ${chain.length}, ${rpg.xp || 100}, ${rpg.level || 1}, "${escHtml(vaultTag)}"]</code></div>
              <div class="calldata-btn-row">
                <button class="sketch-tool-btn" data-act="copy-params">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Args", ru: "Скопировать аргументы", zh: "复制参数", ja: "引数をコピー", es: "Copiar argumentos", de: "Argumente kopieren" }, this.plugin)}</span></button>
                <button class="sketch-tool-btn" data-act="copy-calldata">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Calldata", ru: "Скопировать HEX Calldata", zh: "复制 Calldata", ja: "Calldataをコピー", es: "Copiar Calldata", de: "Calldata kopieren" }, this.plugin)}</span></button>
                <button class="sketch-tool-btn" data-act="open-remix">${sicraftIcon('external')} <span>Remix IDE</span></button>
                <button class="sketch-tool-btn" data-act="open-explorer">${sicraftIcon('globe')} <span>Explorer</span></button>
              </div>
            </div>

            <div class="rpg-add-row">
              <input type="text" class="onchain-tx-input" value="${escHtml(oc.lastAnchorTx || "")}" placeholder="${i18n({ en: "Paste transaction hash (0x...)...", ru: "Вставьте хеш транзакции (0x...)...", zh: "粘贴交易哈希 (0x...)...", ja: "トランザクションハッシュ (0x...)...", es: "Pegar hash de transacción (0x...)...", de: "Transaktions-Hash einfügen (0x...)..." }, this.plugin)}" />
              <button class="rpg-add-quest-btn mod-cta" data-act="save-tx">${i18n({ en: "Verify On-Chain", ru: "Подтвердить хеш", zh: "确认上链", ja: "オンチェーン確認", es: "Verificar", de: "Bestätigen" }, this.plugin)}</button>
            </div>
          </div>
        `;

        body.querySelector(".onchain-net-select")?.addEventListener("change", async (e) => {
          oc.network = e.target.value;
          await this.plugin.saveSettings();
          render();
        });
        body.querySelector(".onchain-contract-input")?.addEventListener("change", async (e) => {
          oc.contractAddress = e.target.value.trim();
          await this.plugin.saveSettings();
        });
        body.querySelector('[data-act="copy-params"]')?.addEventListener("click", () => {
          navigator.clipboard?.writeText(`["${rootHashHex}", ${chain.length}, ${rpg.xp || 100}, ${rpg.level || 1}, ${JSON.stringify(vaultTag)}]`);
          this.plugin.playTactileMicroFeedback("tap");
          new Notice("Copied!");
        });
        body.querySelector('[data-act="copy-calldata"]')?.addEventListener("click", () => {
          navigator.clipboard?.writeText(calldata);
          this.plugin.playTactileMicroFeedback("tap");
          new Notice("ABI Calldata copied!");
        });
        body.querySelector('[data-act="open-remix"]')?.addEventListener("click", () => openExternalUrl("https://remix.ethereum.org/"));
        body.querySelector('[data-act="open-explorer"]')?.addEventListener("click", () => openExternalUrl(netInfo.explorer));
        body.querySelector('[data-act="save-tx"]')?.addEventListener("click", async () => {
          const txVal = (body.querySelector(".onchain-tx-input")?.value || "").trim();
          // The plugin does not query the chain here. It stores the hash the user pasted, and only a
          // well-formed one; an empty field used to be filled with a made-up hash and shown as verified.
          if (!/^0x[0-9a-fA-F]{64}$/.test(txVal)) {
            new Notice(
              (this.plugin.settings.uiLanguage || "en") === "ru"
                ? "Вставьте хеш транзакции: 0x и 64 знака."
                : "Paste the transaction hash: 0x followed by 64 characters."
            );
            return;
          }
          const finalTx = txVal;
          oc.lastAnchorTx = finalTx;
          oc.lastAnchoredTx = finalTx;
          oc.lastAnchoredHash = rootHashHex;
          oc.lastAnchoredAt = new Date().toISOString();
          oc.verifiedPatron = true;
          oc.isVerifiedOnChain = true;
          await this.plugin.saveSettings();
          this.plugin.playTactileMicroFeedback("anchor");
          render();
        });
      } else if (this.activeTab === "ledger") {
        const rev = [...chain].reverse();
        body.innerHTML = `
          <div class="artcraft-ledger-scroll">
            ${rev
              .map(
                (blk) => `
              <div class="artcraft-ledger-block">
                <div class="ledger-block-head">
                  <span>#${escHtml(blk.index)}</span>
                  <span>${new Date(blk.timestamp).toLocaleString()}</span>
                  <span>+${escHtml(blk.xp)} XP · Nonce ${escHtml(blk.nonce)}</span>
                </div>
                <div class="ledger-block-quest">${escHtml(blk.quest)}</div>
                <div class="ledger-block-hashes">
                  <code>${escHtml(blk.hash)}</code>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="artcraft-rpg-footer-actions">
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="insert-cert">
              ${sicraftIcon('stamp')} <span>${i18n({ en: "Export SHA-256 Certificate to Note", ru: "Вставить выписку SHA-256 в заметку", zh: "导出 SHA-256 证书至笔记", ja: "SHA-256 証明書をノートへ出力", es: "Exportar certificado SHA-256", de: "SHA-256 Zertifikat exportieren" }, this.plugin)}</span>
            </button>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div class="artcraft-value-eq-box">
            <div class="rpg-card-kicker">HIGH-LEVERAGE VALUE EQUATION // (DREAM × LIKELIHOOD) ÷ (DELAY × EFFORT)</div>
            <div class="value-eq-sliders-grid">
              <label><span>01 · ${i18n({ en: "Dream Outcome (1–10)", ru: "Сила результата (1–10)", zh: "理想结果 (1–10)", ja: "理想の成果 (1–10)", es: "Resultado soñado (1–10)", de: "Traumergebnis (1–10)" }, this.plugin)}</span><input type="range" min="1" max="10" value="9" data-hm="dream" /></label>
              <label><span>02 · ${i18n({ en: "Perceived Likelihood (1–10)", ru: "Доказанность и вера (1–10)", zh: "实现概率 (1–10)", ja: "実現可能性 (1–10)", es: "Probabilidad (1–10)", de: "Wahrscheinlichkeit (1–10)" }, this.plugin)}</span><input type="range" min="1" max="10" value="8" data-hm="like" /></label>
              <label><span>03 · ${i18n({ en: "Time Delay (1=Instant, 10=Slow)", ru: "Ожидание результата (1=мгновенно)", zh: "时间延迟 (1=即刻)", ja: "時間遅延 (1=即時)", es: "Demora (1=Inmediato)", de: "Zeitverzögerung (1=Sofort)" }, this.plugin)}</span><input type="range" min="1" max="10" value="2" data-hm="delay" /></label>
              <label><span>04 · ${i18n({ en: "Effort & Friction (1=Easy)", ru: "Сложность для клиента (1=в 1 клик)", zh: "阻力与门槛 (1=极简)", ja: "労力と摩擦 (1=簡単)", es: "Esfuerzo (1=Fácil)", de: "Aufwand (1=Einfach)" }, this.plugin)}</span><input type="range" min="1" max="10" value="2" data-hm="effort" /></label>
            </div>
            <div class="value-eq-score-banner">
              <div class="hm-score-val">18.0x</div>
              <div class="hm-score-txt">${i18n({
                en: "Value Multiplier (Target > 10x: instant visual result in 1 click)",
                ru: "Индекс ценности предложения (Цель > 10x: мгновенный результат в 1 клик)",
                zh: "价值乘数 (目标 > 10x：一键即达的直观成果)",
                ja: "価値倍率 (目標 > 10x：1クリックで即座に視覚的成果を提供)",
                es: "Multiplicador de valor (Meta > 10x: resultado en 1 clic)",
                de: "Wert-Multiplikator (Ziel > 10x: sofortiges Ergebnis mit 1 Klick)"
              }, this.plugin)}</div>
            </div>
          </div>
        `;
        const updateHm = () => {
          const d = Number(body.querySelector('[data-hm="dream"]')?.value || 9);
          const l = Number(body.querySelector('[data-hm="like"]')?.value || 8);
          const t = Number(body.querySelector('[data-hm="delay"]')?.value || 2);
          const e = Number(body.querySelector('[data-hm="effort"]')?.value || 2);
          const score = ((d * l) / Math.max(1, t * e)).toFixed(1);
          const el = body.querySelector(".hm-score-val");
          if (el) el.textContent = `${score}x`;
        };
        body.querySelectorAll('input[type="range"]').forEach((inp) => inp.addEventListener("input", updateHm));
        updateHm();
      }

      head.querySelector('[data-act="verify"]')?.addEventListener("click", async () => {
        const res = await this.plugin.verifyQuestBlockchain();
        if (res.valid) {
          new Notice(i18n({
            en: `SHA-256 Chain verified (${res.blocks} blocks intact).`,
            ru: `Цепочка SHA-256 верифицирована (${res.blocks} блоков целостны).`,
            zh: `SHA-256 哈希链验证通过 (${res.blocks} 个区块完整)。`,
            ja: `SHA-256 チェーン検証完了 (${res.blocks} ブロック正常)。`,
            es: `Cadena SHA-256 verificada (${res.blocks} bloques).`,
            de: `SHA-256 Kette verifiziert (${res.blocks} Blöcke intakt).`
          }, this.plugin));
        }
      });

      body.querySelector('[data-act="insert-cert"]')?.addEventListener("click", async () => {
        const obsidian = require("obsidian");
        if (!chain.some((b) => Number(b.index) > 0)) {
          new Notice((this.plugin.settings.uiLanguage || "en") === "ru" ? "В журнале пока нет записей." : "The log has no entries yet.");
          return;
        }
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view || !view.file) return;
        const blk = chain[chain.length - 1];
        const certMd = [
          "",
          `> [!success] PROOF-OF-WORK CERTIFICATE // BLOCK #${blk.index} (LVL ${rpg.level || 1} · ${rpg.xp || 0} XP)`,
          `> - **Quest:** ${blk.quest}`,
          `> - **Timestamp:** \`${blk.timestamp}\` · **Nonce:** \`${blk.nonce}\``,
          `> - **SHA-256 Signature:** \`${blk.hash}\``,
          ""
        ].join("\n");
        const cur = await this.app.vault.read(view.file);
        await this.app.vault.modify(view.file, cur + "\n" + certMd);
        this.close();
      });
    };

    render();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// =========================================================================
// 2. BIO-RHYTHM & COGNITIVE FLOW READINESS MODAL (CLEAN AIRY DESIGN, ZERO EMOJIS, 6 LANGUAGES)
// =========================================================================
class BioRhythmFlowModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    if (modalEl) modalEl.addClass("artcraft-wide-craft-modal", "artcraft-bio-flow-modal", "artcraft-airy-modal");
    contentEl.empty();
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";

    if (!this.plugin.settings.bioFlow) {
      this.plugin.settings.bioFlow = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.bioFlow));
    }
    const bf = this.plugin.settings.bioFlow;

    const diagnoseFlow = (challenge, skill) => {
      const diff = challenge - skill;
      if (challenge >= 55 && skill >= 55 && Math.abs(diff) <= 18) {
        return {
          zone: i18n({ en: "FLOW CHANNEL · OPTIMAL BALANCE", ru: "КАНАЛ ПОТОКА · ОПТИМАЛЬНЫЙ БАЛАНС", zh: "心流通道 · 最佳平衡", ja: "フローチャネル · 最適バランス", es: "CANAL DE FLUJO · EQUILIBRIO", de: "FLOW-KANAL · OPTIMALE BALANCE" }, this.plugin),
          color: "#16A34A",
          advice: i18n({
            en: "Challenge matches your current skill (+4% growth corridor). Ideal window for a 90-minute deep work block.",
            ru: "Сложность задачи соответствует вашему мастерству. Идеальное окно для 90 минут непрерывной глубокой работы.",
            zh: "挑战难度与当前技能完美匹配。非常适合开启 90 分钟深度工作。",
            ja: "課題の難易度とスキルが一致しています。90分間のディープワークに最適です。",
            es: "El desafío coincide con tu habilidad. Ventana ideal para 90 minutos de enfoque profundo.",
            de: "Herausforderung und Fähigkeit sind im Gleichgewicht. Ideal für 90 Minuten Deep Work."
          }, this.plugin)
        };
      }
      if (diff > 18) {
        return {
          zone: i18n({ en: "HIGH FRICTION · BREAK DOWN THE TASK", ru: "ВЫСОКАЯ СЛОЖНОСТЬ · РАЗБЕЙТЕ ЗАДАЧУ НА ШАГИ", zh: "高阻力区 · 建议拆解步骤", ja: "高負荷ゾーン · タスクを細分化", es: "ALTA FRICCIÓN · DIVIDIR TAREA", de: "HOHE REIBUNG · AUFGABE TEILEN" }, this.plugin),
          color: "#D97706",
          advice: i18n({
            en: "The scope feels too broad right now. Split the task into three small steps (01, 02, 03) to restore momentum.",
            ru: "Задача кажется слишком объёмной. Разделите её на 3 коротких шага (01, 02, 03), чтобы убрать внутреннее сопротивление.",
            zh: "当前任务范围过大。将其拆解为 01、02、03 三个微步骤即可恢复心流。",
            ja: "タスクが大きすぎます。01、02、03の3つの小さなステップに分割してください。",
            es: "Divide la tarea en 3 pasos cortos (01, 02, 03) para recuperar el ritmo.",
            de: "Teile die Aufgabe in 3 kleine Schritte (01, 02, 03), um den Fokus zurückzugewinnen."
          }, this.plugin)
        };
      }
      return {
        zone: i18n({ en: "ROUTINE ZONE · RAISE THE TEMPO", ru: "ЗОНА РУТИНЫ · УСКОРЬТЕ ТЕМП", zh: "常规舒适区 · 提升节奏", ja: "ルーチンゾーン · ペースを上げる", es: "ZONA DE RUTINA · SUBIR RITMO", de: "ROUTINE-ZONE · TEMPO ERHÖHEN" }, this.plugin),
        color: "#2563EB",
        advice: i18n({
          en: "Your skill exceeds the task difficulty. Set a 25-minute Pomodoro sprint to finish it quickly.",
          ru: "Ваш навык выше текущей задачи. Поставьте таймер на 25 минут и закройте её в быстром спринте.",
          zh: "您的技能已超越当前难度。建议开启 25 分钟番茄钟快速完成。",
          ja: "スキルが難易度を上回っています。25分のタイマーで一気に片付けましょう。",
          es: "Tu habilidad supera la dificultad. Usa un sprint de 25 minutos.",
          de: "Deine Fähigkeit übersteigt die Aufgabe. Nutze einen 25-Minuten-Sprint."
        }, this.plugin)
      };
    };

    const render = () => {
      contentEl.empty();
      const diag = diagnoseFlow(bf.challenge || 75, bf.skill || 75);
      const readiness = Math.round((bf.energy * 0.55) + (100 - Math.abs((bf.challenge || 75) - (bf.skill || 75))) * 0.45);

      contentEl.innerHTML = `
        <div class="artcraft-bio-hero">
          <div>
            <div class="artcraft-rpg-badge">${sicraftIcon('pulse')} <span>${i18n({
              en: "BIO-RHYTHM · COGNITIVE READINESS",
              ru: "БИО-РИТМ · КОГНИТИВНАЯ ГОТОВНОСТЬ",
              zh: "生物节律 · 认知准备度",
              ja: "バイオリズム · 認知準備度",
              es: "BIO-RITMO · PREPARACIÓN COGNITIVA",
              de: "BIO-RHYTHMUS · KOGNITIVE BEREITSCHAFT"
            }, this.plugin)}</span></div>
            <h2 class="artcraft-rpg-title">${i18n({
              en: "Energy Rhythm & Flow Balance",
              ru: "Ритм Энергии и Баланс Потока",
              zh: "能量节律与心流平衡",
              ja: "エネルギーリズムとフローバランス",
              es: "Ritmo de Energía y Estado de Flujo",
              de: "Energierhythmus & Flow-Balance"
            }, this.plugin)}</h2>
          </div>
          <div class="artcraft-bio-ring-card">
            <div class="bio-readiness-val">${readiness}%</div>
            <div class="bio-readiness-lbl">${i18n({ en: "READINESS", ru: "ИНДЕКС ПОТОКА", zh: "心流指数", ja: "フロー指数", es: "ÍNDICE", de: "FLOW-INDEX" }, this.plugin)}</div>
          </div>
        </div>

        <div class="artcraft-bio-phases">
          ${[
            {
              id: "low",
              kicker: "01",
              title: i18n({ en: "Morning Deep Work", ru: "Утро: Чистый Фокус", zh: "清晨：低熵深度创造", ja: "朝：ディープワーク", es: "Mañana: Foco Profundo", de: "Morgen: Deep Work" }, this.plugin),
              sub: i18n({ en: "Architecture, writing & complex code", ru: "Архитектура, сложный код и ключевые идеи", zh: "核心架构、写作与复杂代码", ja: "設計・執筆・複雑なコード", es: "Arquitectura, escritura y código", de: "Architektur, Schreiben & Code" }, this.plugin)
            },
            {
              id: "mid",
              kicker: "02",
              title: i18n({ en: "Afternoon Execution", ru: "День: Исполнение", zh: "午后：中熵推进", ja: "午後：タスク実行", es: "Tarde: Ejecución", de: "Nachmittag: Umsetzung" }, this.plugin),
              sub: i18n({ en: "Distribution, reviews & linear tasks", ru: "Дистрибуция, ревью и линейные задачи", zh: "内容分发、审阅与常规任务", ja: "配信・レビュー・定型作業", es: "Distribución y tareas lineales", de: "Verteilung & lineare Aufgaben" }, this.plugin)
            },
            {
              id: "high",
              kicker: "03",
              title: i18n({ en: "Evening Synthesis", ru: "Вечер: Спокойное Чтение", zh: "夜晚：阅读与复盘", ja: "夜：読書と内省", es: "Noche: Lectura y Calma", de: "Abend: Ruhiges Lesen" }, this.plugin),
              sub: i18n({ en: "Book reading, sketching & reflection", ru: "Чтение книг, скетчинг и подведение итогов", zh: "深度阅读、手绘草图与总结", ja: "読書・スケッチ・振り返り", es: "Lectura, bocetos y reflexión", de: "Lesen, Skizzieren & Reflexion" }, this.plugin)
            }
          ]
            .map(
              (ph) => `
            <div class="artcraft-bio-phase-card ${bf.entropyPhase === ph.id ? "is-active" : ""}" data-phase="${ph.id}">
              <span class="rpg-card-kicker">${ph.kicker}</span>
              <strong>${ph.title}</strong>
              <small>${ph.sub}</small>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="artcraft-bio-sliders">
          <div class="bio-slider-row">
            <div class="bio-slider-top">
              <span>${i18n({ en: "01 · Cognitive Energy & Clarity", ru: "01 · Ресурс внимания и ясность", zh: "01 · 认知能量与清晰度", ja: "01 · 集中エネルギーと明晰さ", es: "01 · Energía cognitiva", de: "01 · Kognitive Energie" }, this.plugin)}</span>
              <strong id="bio-val-energy">${bf.energy}%</strong>
            </div>
            <input type="range" min="10" max="100" value="${bf.energy}" data-bio="energy" />
          </div>
          <div class="bio-slider-row">
            <div class="bio-slider-top">
              <span>${i18n({ en: "02 · Current Task Challenge", ru: "02 · Сложность текущей задачи", zh: "02 · 当前任务挑战度", ja: "02 · 現在の課題の難易度", es: "02 · Dificultad de la tarea", de: "02 · Aufgabenschwierigkeit" }, this.plugin)}</span>
              <strong id="bio-val-challenge">${bf.challenge}%</strong>
            </div>
            <input type="range" min="10" max="100" value="${bf.challenge}" data-bio="challenge" />
          </div>
          <div class="bio-slider-row">
            <div class="bio-slider-top">
              <span>${i18n({ en: "03 · Skill & Tool Mastery", ru: "03 · Понятность шагов и навык", zh: "03 · 技能与工具掌控度", ja: "03 · スキルと手順の明確さ", es: "03 · Claridad y habilidad", de: "03 · Fähigkeit & Klarheit" }, this.plugin)}</span>
              <strong id="bio-val-skill">${bf.skill}%</strong>
            </div>
            <input type="range" min="10" max="100" value="${bf.skill}" data-bio="skill" />
          </div>
        </div>

        <div class="artcraft-bio-diagnosis">
          <div class="bio-diag-zone" style="color: ${diag.color}">${diag.zone}</div>
          <div class="bio-diag-advice">${diag.advice}</div>
        </div>

        <div class="artcraft-rpg-footer-actions">
          <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="log-bio">
            ${sicraftIcon('check')} <span>${i18n({
              en: "Save Flow Check-In to Note (+20 XP)",
              ru: "Записать состояние потока в заметку (+20 XP)",
              zh: "将心流状态记录至笔记 (+20 XP)",
              ja: "フロー状態をノートに記録 (+20 XP)",
              es: "Guardar estado de flujo en la nota (+20 XP)",
              de: "Flow-Status in Notiz speichern (+20 XP)"
            }, this.plugin)}</span>
          </button>
        </div>
      `;

      contentEl.querySelectorAll(".artcraft-bio-phase-card").forEach((card) => {
        card.addEventListener("click", async () => {
          bf.entropyPhase = card.getAttribute("data-phase") || "low";
          this.plugin.playTactileMicroFeedback("tap");
          await this.plugin.saveSettings();
          render();
        });
      });

      contentEl.querySelectorAll("input[data-bio]").forEach((inp) => {
        // "input" fires on every pixel of a drag. Redrawing the window there destroyed the slider under
        // the pointer, so the value is kept while dragging and the redraw waits for the release.
        inp.addEventListener("input", () => {
          bf[inp.getAttribute("data-bio")] = Number(inp.value);
        });
        inp.addEventListener("change", async () => {
          bf[inp.getAttribute("data-bio")] = Number(inp.value);
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
          render();
        });
      });

      contentEl.querySelector('[data-act="log-bio"]')?.addEventListener("click", async () => {
        await this.plugin.mineQuestBlock(
          isRu ? `Индекс Потока: ${readiness}% (${diag.zone})` : `Flow Readiness: ${readiness}% (${diag.zone})`,
          20,
          true
        );
        const obsidian = require("obsidian");
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view && view.file) {
          const md = [
            "",
            `> [!tip] FLOW CHECK-IN · ${readiness}% (${new Date().toLocaleDateString()})`,
            `> - **Status:** ${diag.zone}`,
            `> - **Metrics:** Energy ${bf.energy}% · Challenge ${bf.challenge}% · Skill ${bf.skill}%`,
            `> - **Focus Note:** ${diag.advice}`,
            ""
          ].join("\n");
          const cur = await this.app.vault.read(view.file);
          await this.app.vault.modify(view.file, cur + "\n" + md);
        }
        this.close();
      });
    };

    render();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// =========================================================================
// 3. CREATIVE MARGIN SKETCHPAD & VECTOR INK CANVAS MODAL
// =========================================================================
class CreativeMarginSketchModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.penColor = "#1F2328";
    this.penSize = 3.2;
    this.paperBg = "grid";
    this.paths = [];
    this.currentPath = null;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    if (modalEl) modalEl.addClass("artcraft-wide-craft-modal", "artcraft-sketch-modal", "artcraft-airy-modal");
    contentEl.empty();

    contentEl.innerHTML = `
      <div class="artcraft-sketch-head">
        <div>
          <div class="artcraft-rpg-badge">${sicraftIcon('palette')} <span>${i18n({
            en: "VISUAL THINKING · INK SKETCHPAD",
            ru: "ВИЗУАЛЬНОЕ МЫШЛЕНИЕ · СКЕТЧБУК",
            zh: "视觉思考 · 手绘草图板",
            ja: "ビジュアル思考 · スケッチパッド",
            es: "PENSAMIENTO VISUAL · BOCETOS",
            de: "VISUELLES DENKEN · SKIZZENBUCH"
          }, this.plugin)}</span></div>
          <h2 class="artcraft-rpg-title">${i18n({
            en: "Draw a Diagram or Idea & Embed in Your Note",
            ru: "Схема или Зарисовка Прямо в Заметку",
            zh: "绘制架构草图并一键嵌入笔记",
            ja: "図解やアイデアを描いてノートに埋め込む",
            es: "Dibuja un esquema e insértalo en tu nota",
            de: "Diagramm zeichnen & direkt in Notiz einbetten"
          }, this.plugin)}</h2>
        </div>
      </div>

      <div class="artcraft-sketch-toolbar">
        <div class="sketch-colors">
          ${["#1F2328", "#2563EB", "#16A34A", "#D97706", "#DC2626", "#7C3AED", "#EC4899", "#FFFFFF"]
            .map(
              (c) =>
                `<button class="sketch-color-dot ${c === this.penColor ? "is-active" : ""}" data-color="${c}" style="background:${c}"></button>`
            )
            .join("")}
        </div>
        <div class="sketch-sizes">
          <button class="sketch-tool-btn" data-size="2">${(this.plugin.settings.uiLanguage || "en") === "ru" ? "Тонкая" : "Fine"}</button>
          <button class="sketch-tool-btn is-active" data-size="3.5">${(this.plugin.settings.uiLanguage || "en") === "ru" ? "Средняя" : "Medium"}</button>
          <button class="sketch-tool-btn" data-size="7">${(this.plugin.settings.uiLanguage || "en") === "ru" ? "Толстая" : "Bold"}</button>
        </div>
        <div class="sketch-bgs">
          <button class="sketch-tool-btn is-active" data-bg="grid">${i18n({ en: "Dot Grid", ru: "Точки", zh: "点阵", ja: "ドット", es: "Puntos", de: "Punktraster" }, this.plugin)}</button>
          <button class="sketch-tool-btn" data-bg="cream">${i18n({ en: "Paper", ru: "Бумага", zh: "纸张", ja: "用紙", es: "Papel", de: "Papier" }, this.plugin)}</button>
          <button class="sketch-tool-btn" data-bg="blueprint">${i18n({ en: "Blueprint", ru: "Чертёж", zh: "蓝图", ja: "青写真", es: "Plano", de: "Blaupause" }, this.plugin)}</button>
        </div>
        <div class="sketch-acts">
          <button class="sketch-tool-btn" data-act="undo">${sicraftIcon('undo')}</button>
          <button class="sketch-tool-btn" data-act="clear">${sicraftIcon('clear')}</button>
        </div>
      </div>

      <div class="artcraft-sketch-canvas-wrap">
        <canvas class="artcraft-sketch-canvas" width="820" height="400"></canvas>
      </div>

      <div class="artcraft-rpg-footer-actions">
        <input type="text" class="sketch-caption-input" placeholder="${i18n({
          en: "Sketch caption...",
          ru: "Название или подпись к рисунку...",
          zh: "草图标题...",
          ja: "スケッチのタイトル...",
          es: "Título del boceto...",
          de: "Skizzen-Titel..."
        }, this.plugin)}" />
        <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="embed">
          ${sicraftIcon('spark')} <span>${i18n({
            en: "Embed Sketch in Note (+30 XP)",
            ru: "Вставить скетч в заметку (+30 XP)",
            zh: "嵌入草图至笔记 (+30 XP)",
            ja: "スケッチをノートに挿入 (+30 XP)",
            es: "Insertar boceto en la nota (+30 XP)",
            de: "Skizze in Notiz einfügen (+30 XP)"
          }, this.plugin)}</span>
        </button>
      </div>
    `;

    const cv = contentEl.querySelector(".artcraft-sketch-canvas");
    const ctx = cv.getContext("2d");

    const drawBackground = () => {
      if (this.paperBg === "blueprint") {
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.14)";
        ctx.lineWidth = 1;
        for (let x = 0; x < cv.width; x += 28) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cv.height); ctx.stroke();
        }
        for (let y = 0; y < cv.height; y += 28) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cv.width, y); ctx.stroke();
        }
      } else if (this.paperBg === "cream") {
        ctx.fillStyle = "#FAF8F3";
        ctx.fillRect(0, 0, cv.width, cv.height);
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#D4D4D8";
        for (let x = 20; x < cv.width; x += 24) {
          for (let y = 20; y < cv.height; y += 24) {
            ctx.beginPath();
            ctx.arc(x, y, 1.05, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const redrawAll = () => {
      drawBackground();
      const all = this.currentPath ? [...this.paths, this.currentPath] : this.paths;
      all.forEach((p) => {
        if (!p.pts || p.pts.length === 0) return;
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(p.pts[0].x, p.pts[0].y);
        for (let i = 1; i < p.pts.length - 1; i++) {
          const midX = (p.pts[i].x + p.pts[i + 1].x) / 2;
          const midY = (p.pts[i].y + p.pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(p.pts[i].x, p.pts[i].y, midX, midY);
        }
        if (p.pts.length > 1) {
          const last = p.pts[p.pts.length - 1];
          ctx.lineTo(last.x, last.y);
        } else {
          ctx.arc(p.pts[0].x, p.pts[0].y, p.size / 2, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
      });
    };

    redrawAll();

    const getPt = (e) => {
      const r = cv.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * cv.width,
        y: ((e.clientY - r.top) / r.height) * cv.height
      };
    };

    let drawing = false;
    cv.addEventListener("pointerdown", (e) => {
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      this.currentPath = { color: this.penColor, size: this.penSize, pts: [getPt(e)] };
      redrawAll();
    });
    cv.addEventListener("pointermove", (e) => {
      if (!drawing || !this.currentPath) return;
      this.currentPath.pts.push(getPt(e));
      redrawAll();
    });
    const finishStroke = () => {
      if (!drawing) return;
      drawing = false;
      if (this.currentPath) {
        this.paths.push(this.currentPath);
        this.currentPath = null;
      }
      redrawAll();
    };
    cv.addEventListener("pointerup", finishStroke);
    cv.addEventListener("pointercancel", finishStroke);

    contentEl.querySelectorAll(".sketch-color-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        this.penColor = dot.getAttribute("data-color") || "#1F2328";
        contentEl.querySelectorAll(".sketch-color-dot").forEach((d) => d.classList.toggle("is-active", d === dot));
      });
    });

    contentEl.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.penSize = Number(btn.getAttribute("data-size")) || 3.5;
        contentEl.querySelectorAll("[data-size]").forEach((b) => b.classList.toggle("is-active", b === btn));
      });
    });

    contentEl.querySelectorAll("[data-bg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.paperBg = btn.getAttribute("data-bg") || "grid";
        if (this.paperBg === "blueprint" && this.penColor === "#1F2328") {
          this.penColor = "#38BDF8";
        } else if (this.paperBg !== "blueprint" && this.penColor === "#38BDF8") {
          this.penColor = "#1F2328";
        }
        contentEl.querySelectorAll("[data-bg]").forEach((b) => b.classList.toggle("is-active", b === btn));
        redrawAll();
      });
    });

    contentEl.querySelector('[data-act="undo"]')?.addEventListener("click", () => {
      this.paths.pop();
      redrawAll();
    });

    contentEl.querySelector('[data-act="clear"]')?.addEventListener("click", () => {
      this.paths = [];
      redrawAll();
    });

    contentEl.querySelector('[data-act="embed"]')?.addEventListener("click", async () => {
      const obsidian = require("obsidian");
      const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      if (!view || !view.file) return;
      const caption = (contentEl.querySelector(".sketch-caption-input")?.value || "").trim() || "Sketch";
      // The drawing is saved as a PNG next to the note's other attachments and the note gets a link to it.
      // It used to be written into the note itself as base64: hundreds of kilobytes in a single line.
      const failed = () =>
        new Notice(i18n({ en: "Could not save the sketch.", ru: "Не удалось сохранить скетч." }, this.plugin));
      const blob = await new Promise((resolve) => cv.toBlob(resolve, "image/png"));
      if (!blob) {
        failed();
        return;
      }
      const stamp = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "-").slice(0, 17);
      const fileName = `sketch-${stamp}.png`;
      let imgPath = null;
      try {
        if (typeof this.app.fileManager.getAvailablePathForAttachment === "function") {
          imgPath = await this.app.fileManager.getAvailablePathForAttachment(fileName, view.file.path);
        }
      } catch (e) {
        imgPath = null;
      }
      if (!imgPath) {
        const parent = view.file.parent;
        const dir = parent && parent.path && parent.path !== "/" ? parent.path + "/" : "";
        imgPath = obsidian.normalizePath(dir + fileName);
      }
      let imgFile = null;
      const buf = await blob.arrayBuffer();
      try {
        const existing = this.app.vault.getAbstractFileByPath(imgPath);
        if (existing) {
          imgPath = imgPath.replace(/\.png$/i, `-${Date.now().toString().slice(-4)}.png`);
        }
        imgFile = await this.app.vault.createBinary(imgPath, buf);
      } catch (e) {
        try {
          const fallbackPath = obsidian.normalizePath(`sketch-${Date.now()}.png`);
          imgFile = await this.app.vault.createBinary(fallbackPath, buf);
        } catch (e2) {
          failed();
          return;
        }
      }
      let link = `![[${imgFile.path}]]`;
      try {
        const gen = this.app.fileManager.generateMarkdownLink(imgFile, view.file.path);
        if (gen && gen.length < 260) {
          link = gen.startsWith("!") ? gen : "!" + gen;
        }
      } catch (e) {}
      const mdBlock = ["", `> [!abstract] ${caption} (${new Date().toLocaleDateString()})`, `> ${link}`, ""].join("\n");
      await this.plugin.editNote(view.file, (cur) => cur + "\n" + mdBlock);
      await this.plugin.mineQuestBlock(`Sketch: ${caption}`, 30, true);
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// =========================================================================
// 4. CREATOR OS STUDIO MODAL (AIRY SWISS EDITORIAL TYPOGRAPHY, ZERO CLIPPED TABS, 6 LANGUAGES)
// =========================================================================
class CreatorOsStudioModal extends Modal {
  constructor(app, plugin, initialTab = "brand") {
    super(app);
    this.plugin = plugin;
    this.activeTab = initialTab;
    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
    this.apag = {
      hook: isRu
        ? "Писать заметки в Obsidian легко. Перечитывать их через 2 недели — вот где большинство бросает."
        : "Taking notes in Obsidian is easy. Re-reading them 2 weeks later is where most people quit.",
      perspective: isRu
        ? "Причина не в дисциплине, а в том, что сырой текст сливается в монотонное серое полотно без визуальных точек опоры."
        : "The root cause isn't discipline — it's raw text turning into a monotone grey wall with no visual anchors.",
      advantage: isRu
        ? "Когда заголовки, шаги 01–03 и выводы разделены воздухом и швейцарским контрастом, глаза считывают суть страницы за секунду."
        : "When headings, 01–03 action steps, and key takeaways are isolated with air and Swiss contrast, the eye scans the core message in seconds.",
      gamify: isRu
        ? "01 // Выберите чистый белый или книжный фон\n02 // Отмечайте главные мысли закладками-нутриентами\n03 // Закрывайте задачи с подписью в SHA-256"
        : "01 // Choose Pure White or Warm Book surface\n02 // Anchor key insights with Nutrient Bookmarks\n03 // Complete daily levers signed with verifiable SHA-256"
    };
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    if (modalEl) modalEl.addClass("artcraft-wide-craft-modal", "artcraft-creator-os-modal", "artcraft-airy-modal");
    contentEl.empty();

    if (!this.plugin.settings.creatorOs) {
      this.plugin.settings.creatorOs = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.creatorOs));
    }
    const cos = this.plugin.settings.creatorOs;
    const rpg = this.plugin.settings.lifeRpg || DEFAULT_SETTINGS.lifeRpg;

    const render = () => {
      contentEl.empty();
      const head = contentEl.createDiv({ cls: "artcraft-rpg-hero" });
      head.innerHTML = `
        <div class="artcraft-rpg-hero-top">
          <div>
            <div class="artcraft-rpg-badge">${sicraftIcon('bolt')} <span>${i18n({
              en: "CREATOR STUDIO · CONTEXT, CONTENT & KANBAN",
              ru: "СТУДИЯ АВТОРА · КОНТЕКСТ, ПОСТЫ И КАНБАН",
              zh: "创作者工坊 · 上下文、内容与看板",
              ja: "クリエイタースタジオ · 文脈・投稿・カンバン",
              es: "ESTUDIO CREADOR · CONTEXTO Y KANBAN",
              de: "CREATOR STUDIO · KONTEXT, INHALT & KANBAN"
            }, this.plugin)}</span></div>
            <h2 class="artcraft-rpg-title">${this.activeTab === "kanban" 
              ? (isRu ? "🎯 ДОСКА ЗАДАЧ КАНБАН (NOTE KANBAN STUDIO)" : "🎯 NOTE KANBAN STUDIO")
              : i18n({
              en: "Turn Notes into AI Context, Posts & Actionable Tasks",
              ru: "Превращение Заметок в Контекст для ИИ, Посты и Задачи",
              zh: "将笔记转化为 AI 上下文、高转化帖文与看板任务",
              ja: "ノートをAI文脈・投稿・実践タスクへ変換",
              es: "Convierte notas en contexto IA, publicaciones y tareas",
              de: "Notizen in KI-Kontext, Beiträge & Aufgaben verwandeln"
            }, this.plugin)}</h2>
          </div>
          <button class="sketch-tool-btn" data-open-sketch="1">${sicraftIcon('palette')} <span>${i18n({ en: "Sketchpad", ru: "Скетчбук", zh: "手绘板", ja: "スケッチ", es: "Bocetos", de: "Skizze" }, this.plugin)}</span></button>
        </div>
      `;

      head.querySelector('[data-open-sketch="1"]')?.addEventListener("click", () => {
        this.close();
        this.plugin.openCreativeSketchModal();
      });

      const tabs = contentEl.createDiv({ cls: "artcraft-rpg-tabs" });
      [
        { id: "brand", icon: "brain", label: i18n({ en: "@brand Context", ru: "@brand для ИИ", zh: "@brand 上下文", ja: "@brand 文脈", es: "Contexto @brand", de: "@brand Kontext" }, this.plugin) },
        { id: "apag", icon: "edit", label: i18n({ en: "APAG Builder", ru: "Пост по APAG", zh: "APAG 写作", ja: "APAG 投稿作成", es: "Constructor APAG", de: "APAG-Editor" }, this.plugin) },
        { id: "map", icon: "columns", label: i18n({ en: "4 Content Angles", ru: "4 Угла Темы", zh: "4维内容矩阵", ja: "4つの切り口", es: "4 Ángulos", de: "4 Blickwinkel" }, this.plugin) },
        { id: "kanban", icon: "card", label: i18n({ en: "Note Kanban", ru: "Канбан Задач", zh: "笔记任务看板", ja: "タスクカンバン", es: "Kanban de Nota", de: "Aufgaben-Kanban" }, this.plugin) }
      ].forEach((tObj) => {
        const b = tabs.createEl("button", {
          cls: "artcraft-rpg-tab" + (this.activeTab === tObj.id ? " is-active" : "")
        });
        b.innerHTML = `${sicraftIcon(tObj.icon)}<span>${tObj.label}</span>`;
        b.addEventListener("click", () => {
          this.plugin.playTactileMicroFeedback("tap");
          this.activeTab = tObj.id;
          render();
        });
      });

      const body = contentEl.createDiv({ cls: "artcraft-rpg-body" });

      if (this.activeTab === "brand") {
        const allBms = [];
        const bmMap = this.plugin.settings.marginBookmarks || {};
        Object.keys(bmMap).forEach((fp) => {
          (bmMap[fp] || []).forEach((b) => allBms.push({ fp, ...b }));
        });
        const sampleInsights = allBms.slice(0, 5).map((b) => `- ${b.meaning || b.snippet || ""}`).join("\n") ||
          "- Воздушная читаемость без стены серого текста\n- Геймификация задач с крипто-подписью SHA-256";

        const compiledPrompt = [
          "# @brand_context.md",
          `- **${isRu ? "Миссия" : "Mission"}:** ${rpg.oneYearMission || (isRu ? "Превратить хаос заметок в произведение издательского искусства" : "Transform notes into editorial craft")}`,
          `- **${isRu ? "Текущий фокус" : "Current Focus"}:** ${rpg.oneMonthBoss || (isRu ? "Релиз флагманского набора тактильных карточек и крипто-реестра" : "Ship tactile editorial cards")}`,
          `- **${isRu ? "Голос и стиль" : "Voice & Style"}:** ${cos.brandVoice || (isRu ? "Прямой, структурный, без воды — синтез глубокой работы и швейцарской чистоты" : "Direct, structural, concise")}`,
          `- **${isRu ? "Целевая аудитория" : "Audience"}:** ${cos.coreAudience || (isRu ? "Авторы, исследователи и создатели баз знаний, уставшие от серых стен текста" : "Creators and researchers")}`,
          `- **${isRu ? "Главный продукт" : "Core Offer"}:** ${cos.flagshipOffer || (isRu ? "Alchemy Craft Pro — тактильное книжное фолио, SHA-256 квест-чейн и студия автора" : "Alchemy Craft Pro")}`,
          `- **${isRu ? "Ключевые инсайты хранилища" : "Key Vault Insights"}:**\n${sampleInsights}`
        ].join("\n");

        body.innerHTML = `
          <div class="artcraft-rpg-grid-2">
            <div class="artcraft-rpg-card is-voice">
              <div class="rpg-card-kicker-pill is-voice">${sicraftIcon('spark')} 01 · ${isRu ? "ГОЛОС И СТИЛЬ" : "VOICE & STYLE"}</div>
              <textarea class="rpg-input-area" data-cos="brandVoice" rows="4" placeholder="${isRu ? 'Прямой, структурный, без воды — синтез глубокой работы и швейцарской эстетики...' : 'Direct, concise, structural tone...'}">${escHtml(cos.brandVoice || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card is-audience">
              <div class="rpg-card-kicker-pill is-audience">${sicraftIcon('target')} 02 · ${isRu ? "АУДИТОРИЯ И БОЛИ" : "AUDIENCE & PAIN"}</div>
              <textarea class="rpg-input-area" data-cos="coreAudience" rows="4" placeholder="${isRu ? 'Авторы, исследователи, создатели систем знаний, ценящие тактильную эстетику...' : 'Creators, researchers, and thinkers...'}">${escHtml(cos.coreAudience || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card is-offer">
              <div class="rpg-card-kicker-pill is-offer">${sicraftIcon('bookmark')} 03 · ${isRu ? "ПРОДУКТ И ПРЕДЛОЖЕНИЕ" : "CORE OFFER"}</div>
              <textarea class="rpg-input-area" data-cos="flagshipOffer" rows="4" placeholder="${isRu ? 'Alchemy Craft — тактильное книжное фолио, криптографический трекер и студия контента...' : 'Alchemy Craft Pro — tactile book folio & creator studio...'}">${escHtml(cos.flagshipOffer || "")}</textarea>
            </div>
            <div class="artcraft-rpg-card is-pillar">
              <div class="rpg-card-kicker-pill is-pillar">${sicraftIcon('compass')} 04 · ${isRu ? "ГЛАВНАЯ ТЕМА И СМЫСЛЫ" : "MAIN TOPIC PILLAR"}</div>
              <textarea class="rpg-input-area" data-cos="contentPillar" rows="4" placeholder="${isRu ? 'Когнитивная архитектура, глубокая концентрация и визуальное мышление...' : 'Cognitive architecture, focus, and visual thinking...'}">${escHtml(cos.contentPillar || "")}</textarea>
            </div>
          </div>
          <div class="artcraft-rpg-levers-box">
            <div class="rpg-card-kicker">${i18n({ en: "COMPILED @brand_context.md FOR AI", ru: "СВОДНЫЙ КОНТЕКСТ @brand_context.md ДЛЯ ИИ", zh: "生成的 AI 品牌上下文", ja: "AI用 @brand_context.md プレビュー", es: "CONTEXTO @brand_context.md", de: "KOMPILIERTER KI-KONTEXT" }, this.plugin)}</div>
            <textarea class="rpg-input-area is-mono-preview" rows="8" readonly>${escHtml(compiledPrompt)}</textarea>
          </div>
          <div class="artcraft-rpg-footer-actions">
            <button class="sketch-tool-btn" data-act="copy-brand">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Context", ru: "Скопировать", zh: "复制", ja: "コピー", es: "Copiar", de: "Kopieren" }, this.plugin)}</span></button>
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="save-brand-file">
              ${sicraftIcon('spark')} <span>${i18n({ en: "Save @brand_context.md in Vault", ru: "Сохранить @brand_context.md в базу", zh: "保存至知识库", ja: "保管庫に保存", es: "Guardar en bóveda", de: "Im Tresor speichern" }, this.plugin)}</span>
            </button>
          </div>
        `;

        body.querySelectorAll("[data-cos]").forEach((ta) => {
          ta.addEventListener("change", async () => {
            cos[ta.getAttribute("data-cos")] = ta.value;
            await this.plugin.saveSettings();
            render();
          });
        });
        body.querySelector('[data-act="copy-brand"]')?.addEventListener("click", () => {
          navigator.clipboard?.writeText(compiledPrompt);
          this.plugin.playTactileMicroFeedback("tap");
          new Notice("Copied!");
        });
        body.querySelector('[data-act="save-brand-file"]')?.addEventListener("click", async () => {
          const path = "@brand_context.md";
          const existing = this.app.vault.getAbstractFileByPath(path);
          if (existing) await this.app.vault.modify(existing, compiledPrompt);
          else await this.app.vault.create(path, compiledPrompt);
          await this.plugin.mineQuestBlock("Compiled @brand_context.md", 45, true);
          this.close();
        });
      } else if (this.activeTab === "apag") {
        body.innerHTML = `
          <div class="artcraft-rpg-grid-2">
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">01 · ATTENTION (${i18n({ en: "HOOK & CONTRAST", ru: "ХУК И КОНТРАСТ", zh: "吸引注意", ja: "フック", es: "GANCHO", de: "HOOK" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="hook" rows="4">${escHtml(this.apag.hook)}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">02 · PERSPECTIVE (${i18n({ en: "ROOT CAUSE", ru: "СУТЬ ПРОБЛЕМЫ", zh: "视角转换", ja: "視点の転換", es: "PERSPECTIVA", de: "PERSPEKTIVE" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="perspective" rows="4">${escHtml(this.apag.perspective)}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">03 · ADVANTAGE (${i18n({ en: "YOUR MECHANISM", ru: "НОВОЕ РЕШЕНИЕ", zh: "核心优势", ja: "解決メカニズム", es: "SOLUCIÓN", de: "LÖSUNG" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="advantage" rows="4">${escHtml(this.apag.advantage)}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">04 · GAMIFY (${i18n({ en: "ACTION STEPS 01–03", ru: "ШАГИ 01–03", zh: "行动步骤", ja: "実践ステップ", es: "PASOS 01–03", de: "SCHRITTE 01–03" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="gamify" rows="4">${escHtml(this.apag.gamify)}</textarea>
            </div>
          </div>
          <div class="artcraft-rpg-footer-actions">
            <button class="sketch-tool-btn" data-act="copy-apag">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Post", ru: "Скопировать текст", zh: "复制帖文", ja: "投稿をコピー", es: "Copiar", de: "Kopieren" }, this.plugin)}</span></button>
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="insert-apag">
              ${sicraftIcon('send')} <span>${i18n({ en: "Insert into Note (+40 XP)", ru: "Вставить в заметку (+40 XP)", zh: "插入至笔记 (+40 XP)", ja: "ノートに挿入 (+40 XP)", es: "Insertar en nota (+40 XP)", de: "In Notiz einfügen (+40 XP)" }, this.plugin)}</span>
            </button>
          </div>
        `;

        body.querySelectorAll("[data-apag]").forEach((ta) => {
          ta.addEventListener("input", () => {
            this.apag[ta.getAttribute("data-apag")] = ta.value;
          });
        });
        const buildApagText = () => `${this.apag.hook}\n\n${this.apag.perspective}\n\n${this.apag.advantage}\n\n${this.apag.gamify}`;
        body.querySelector('[data-act="copy-apag"]')?.addEventListener("click", () => {
          navigator.clipboard?.writeText(buildApagText());
          this.plugin.playTactileMicroFeedback("tap");
          new Notice("Copied!");
        });
        body.querySelector('[data-act="insert-apag"]')?.addEventListener("click", async () => {
          const obsidian = require("obsidian");
          const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
          if (view && view.file) {
            const cur = await this.app.vault.read(view.file);
            await this.app.vault.modify(view.file, cur + "\n\n## APAG Draft\n\n" + buildApagText() + "\n");
          }
          await this.plugin.mineQuestBlock("APAG Post Drafted", 40, true);
          this.close();
        });
      } else if (this.activeTab === "map") {
        const obsidian = require("obsidian");
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        const rawTitle = view && view.file ? view.file.basename : cos.contentPillar;
        const shortTopic = rawTitle.replace(/^Alchemy Craft\s*[—\-]\s*/i, "").slice(0, 36) || "Фокус и Система Заметок";

        body.innerHTML = `
          <div class="artcraft-airy-angles-wrap">
            <div class="airy-topic-header">
              <span class="rpg-card-kicker">${i18n({ en: "ACTIVE TOPIC", ru: "ТЕМА РАЗБОРА", zh: "当前主题", ja: "対象テーマ", es: "TEMA ACTIVO", de: "AKTIVES THEMA" }, this.plugin)}</span>
              <strong>${escHtml(shortTopic)}</strong>
            </div>
            <div class="artcraft-rpg-grid-2">
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">01 · ${i18n({ en: "CONTRARIAN INSIGHT", ru: "СВЕЖИЙ ВЗГЛЯД", zh: "反直觉洞察", ja: "逆転の発想", es: "IDEA DISRUPTIVA", de: "NEUE PERSPEKTIVE" }, this.plugin)}</div>
                <div class="airy-card-body">${i18n({
                  en: "Why the standard approach creates visual clutter instead of clarity.",
                  ru: "Почему стандартный подход создаёт «стену текста» вместо ясности.",
                  zh: "为什么传统方法只会制造文字墙，而非真正的清晰感。",
                  ja: "なぜ従来のやり方では明確さではなく「文字の壁」が生まれるのか。",
                  es: "Por qué el enfoque estándar crea ruido visual en lugar de claridad.",
                  de: "Warum der Standardansatz eine Textwand statt Klarheit erzeugt."
                }, this.plugin)}</div>
              </div>
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">02 · ${i18n({ en: "PERSONAL EXPERIMENT", ru: "ЛИЧНЫЙ ОПЫТ", zh: "个人实践", ja: "実践ケース", es: "CASO PRÁCTICO", de: "PRAXIS-EXPERIMENT" }, this.plugin)}</div>
                <div class="airy-card-body">${i18n({
                  en: "What changed when I stripped away the noise and kept only visual anchors.",
                  ru: "Что изменилось в работе, когда я убрал лишний шум и оставил чистую иерархию.",
                  zh: "当我剔除视觉噪音、只保留清晰锚点后发生的改变。",
                  ja: "視覚的ノイズをなくし、明確な階層だけを残したことで起きた変化。",
                  es: "Qué cambió cuando eliminé el ruido y dejé solo anclas visuales limpias.",
                  de: "Was sich änderte, als ich das Rauschen entfernte und klare Anker behielt."
                }, this.plugin)}</div>
              </div>
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">03 · ${i18n({ en: "3-STEP SYSTEM", ru: "СИСТЕМА В 3 ШАГА", zh: "三步法框架", ja: "3ステップ体系", es: "SISTEMA EN 3 PASOS", de: "3-SCHRITTE-SYSTEM" }, this.plugin)}</div>
                <div class="airy-card-body">${i18n({
                  en: "A repeatable 15-minute workflow: structure, highlights, and action.",
                  ru: "Простой алгоритм на 15 минут: чистый лист, смысловые акценты и действие.",
                  zh: "15分钟可复用流程：纯净排版、养分高亮与闭环行动。",
                  ja: "15分で再現できる手順：余白の確保、要点の抽出、そして行動。",
                  es: "Un flujo de 15 minutos: estructura limpia, resaltado y acción.",
                  de: "Ein 15-Minuten-Ablauf: sauberes Layout, Fokus-Punkte und Umsetzung."
                }, this.plugin)}</div>
              </div>
              <div class="artcraft-rpg-card">
                <div class="rpg-card-kicker">04 · ${i18n({ en: "DAILY QUEST", ru: "ЕЖЕДНЕВНЫЙ РЫЧАГ", zh: "每日行动杠杆", ja: "毎日のクエスト", es: "PALANCA DIARIA", de: "TÄGLICHER HEBEL" }, this.plugin)}</div>
                <div class="airy-card-body">${i18n({
                  en: "How to turn passive notes into verifiable daily progress.",
                  ru: "Как превратить пассивное чтение конспектов в наглядный ежедневный прогресс.",
                  zh: "如何将被动记笔记转化为每日可验证的真实进步。",
                  ja: "受動的な読書を、毎日検証できる確かな前進に変える方法。",
                  es: "Cómo convertir notas pasivas en progreso diario verificable.",
                  de: "Wie man passives Lesen in messbaren täglichen Fortschritt verwandelt."
                }, this.plugin)}</div>
              </div>
            </div>
          </div>
          <div class="artcraft-rpg-footer-actions">
            <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="insert-map">
              ${sicraftIcon('spark')} <span>${i18n({ en: "Insert Outline into Note", ru: "Добавить план в заметку", zh: "将大纲插入笔记", ja: "構成案をノートに挿入", es: "Insertar esquema en la nota", de: "Gliederung in Notiz einfügen" }, this.plugin)}</span>
            </button>
          </div>
        `;

        body.querySelector('[data-act="insert-map"]')?.addEventListener("click", async () => {
          if (view && view.file) {
            const md = [
              "",
              `### ${shortTopic} — 4 Angles`,
              `- **01 // Insight:** Why the old way creates clutter.`,
              `- **02 // Case Study:** What changed with a clean hierarchy.`,
              `- **03 // System:** Three clear steps to replicate.`,
              `- **04 // Action:** Daily lever to track progress.`,
              ""
            ].join("\n");
            const cur = await this.app.vault.read(view.file);
            await this.app.vault.modify(view.file, cur + "\n" + md);
            await this.plugin.mineQuestBlock(`Content outline: ${shortTopic}`, 30, true);
          }
          this.close();
        });
      } else {
        const obsidian = require("obsidian");
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
        let rawContent = "";
        let lines = [];
        const tasks = [];
        if (view && view.file) {
          rawContent = view.editor ? view.editor.getValue() : (view.data || "");
          lines = rawContent.replace(/\r\n/g, "\n").split("\n");
          let inFence = false;
          lines.forEach((ln, idx) => {
            if (/^\s*(```|~~~)/.test(ln)) {
              inFence = !inFence;
              return;
            }
            if (inFence) return; // a "- [ ]" inside a code block is code, not a task
            const m = ln.match(/^\s*[-*+]\s+\[([ xX/\->])\]\s+(.+)$/);
            if (m) {
              const ch = m[1];
              const col = (ch === "x" || ch === "X") ? "done" : ch === "/" ? "flow" : ch === "-" || ch === ">" ? "review" : "todo";
              const rawTxt = m[2].trim();
              // priority comes from a tag in the task; without a tag the task is "normal"
              const prioMatch = rawTxt.match(/#(high|med|low|срочно|важно)/i);
              const prio = prioMatch ? prioMatch[1].toLowerCase() : "low";
              tasks.push({ lineIdx: idx, col, text: rawTxt, prio });
            }
          });
        }
        const taskLineRe = /^(\s*[-*+]\s+\[)[ xX/\->](\]\s+)/;
        // The note as it is right now, never the copy taken when the board was drawn.
        const readCurrent = async () => (view.editor ? view.editor.getValue() : await this.app.vault.read(view.file));

        const todoList = tasks.filter((t) => t.col === "todo");
        const flowList = tasks.filter((t) => t.col === "flow");
        const revList  = tasks.filter((t) => t.col === "review");
        const doneList = tasks.filter((t) => t.col === "done");
        const totalCnt = tasks.length || 1;
        const pctTodo = Math.round((todoList.length / totalCnt) * 100);
        const pctFlow = Math.round((flowList.length / totalCnt) * 100);
        const pctRev  = Math.round((revList.length  / totalCnt) * 100);
        const pctDone = Math.round((doneList.length / totalCnt) * 100);

        const updateTaskState = async (lineIdx, targetCol) => {
          if (!view || !view.file) return;
          const charMap = { todo: " ", flow: "/", review: "-", done: "x" };
          const newChar = charMap[targetCol] || " ";
          const taskObj = tasks.find((x) => x.lineIdx === lineIdx);
          if (!taskObj || taskObj.col === targetCol) return;
          // The note may have changed since the board was drawn (typing, sync, another plugin). Touch the
          // line only if it is still the same task, and change that one line instead of the whole note.
          const current = (await readCurrent()).replace(/\r\n/g, "\n").split("\n");
          if (current[lineIdx] !== lines[lineIdx] || !taskLineRe.test(current[lineIdx] || "")) {
            new Notice(isRu ? "Заметка изменилась. Доска обновлена, повторите действие." : "The note has changed. The board was refreshed, please repeat.");
            render();
            return;
          }
          const newLine = current[lineIdx].replace(taskLineRe, `$1${newChar}$2`);
          if (view.editor) {
            view.editor.replaceRange(newLine, { line: lineIdx, ch: 0 }, { line: lineIdx, ch: current[lineIdx].length });
          } else {
            current[lineIdx] = newLine;
            await this.app.vault.modify(view.file, current.join("\n"));
          }
          // XP is given once per task, for the first move into "done" (moving it back and forth earns nothing).
          const rewardKey = view.file.path + "::" + taskObj.text;
          if (!this.rewardedTasks) this.rewardedTasks = new Set();
          if (targetCol === "done" && !this.rewardedTasks.has(rewardKey)) {
            this.rewardedTasks.add(rewardKey);
            await this.plugin.mineQuestBlock(taskObj.text.slice(0, 110), 30, true);
          } else {
            this.plugin.playTactileMicroFeedback("tap");
          }
          render();
        };

        const renderColCards = (items, colId) => {
          if (!items.length) {
            return `<div class="artcraft-kanban-empty">${isRu ? "Перетащите карточку сюда или создайте выше" : "Drop a card here or add one above"}</div>`;
          }
          const order = ["todo", "flow", "review", "done"];
          const cIdx = order.indexOf(colId);
          const prevCol = cIdx > 0 ? order[cIdx - 1] : null;
          const nextCol = cIdx < order.length - 1 ? order[cIdx + 1] : null;

          return items.map((t) => {
            const prioLabel = t.prio === "high" || t.prio === "срочно"
              ? (isRu ? "Высокий" : "High")
              : t.prio === "med" || t.prio === "важно"
              ? (isRu ? "Средний" : "Med")
              : (isRu ? "Обычный" : "Normal");
            const prioCls = (t.prio === "high" || t.prio === "срочно") ? "is-high" : (t.prio === "med" || t.prio === "важно") ? "is-med" : "is-low";
            const shortHash = this.plugin.wasmFastHashHex(t.text).slice(0, 6);
            return `
              <div class="artcraft-kanban-card is-pro-card" draggable="true" data-kline="${t.lineIdx}">
                <div class="kcard-top-meta">
                  <span class="kcard-prio-pill ${prioCls}">${prioLabel}</span>
                  <span class="kcard-hash-tag">0x${shortHash}</span>
                </div>
                <div class="artcraft-kanban-card-txt">${t.text.replace(/</g, "&lt;")}</div>
                <div class="artcraft-kanban-card-acts">
                  ${prevCol ? `<button class="k-move-btn" data-kline="${t.lineIdx}" data-kto="${prevCol}" title="${isRu ? "Шаг назад" : "Move left"}">←</button>` : `<span></span>`}
                  <span class="kcard-line-badge">L${t.lineIdx + 1}</span>
                  ${nextCol ? `<button class="k-move-btn is-forward" data-kline="${t.lineIdx}" data-kto="${nextCol}" title="${isRu ? "Дальше по потоку" : "Advance"}">${nextCol === "done" ? "✓ Done +30 XP" : "→"}</button>` : `<span class="k-done-chip">SHA-256</span>`}
                </div>
              </div>
            `;
          }).join("");
        };

        body.innerHTML = `
          <div class="clipy-kanban-dashboard">
            <div class="clipy-kpi-strip">
              <div class="clipy-kpi-card is-amber">
                <span class="clipy-kpi-lbl">${isRu ? "ИДЕИ / БЭКЛОГ" : "BACKLOG"}</span>
                <div class="clipy-kpi-row"><strong>${todoList.length}</strong><span class="clipy-delta">${pctTodo}%</span></div>
              </div>
              <div class="clipy-kpi-card is-blue">
                <span class="clipy-kpi-lbl">${isRu ? "В РАБОТЕ (WIP)" : "IN PROGRESS"}</span>
                <div class="clipy-kpi-row"><strong>${flowList.length}</strong><span class="clipy-delta">${pctFlow}%</span></div>
              </div>
              <div class="clipy-kpi-card is-purple">
                <span class="clipy-kpi-lbl">${isRu ? "ПРОВЕРКА / РЕВЬЮ" : "IN REVIEW"}</span>
                <div class="clipy-kpi-row"><strong>${revList.length}</strong><span class="clipy-delta">${pctRev}%</span></div>
              </div>
              <div class="clipy-kpi-card is-lime">
                <span class="clipy-kpi-lbl">${isRu ? "✅ ГОТОВО (ON-CHAIN)" : "✅ SHIPPED"}</span>
                <div class="clipy-kpi-row"><strong>${doneList.length}</strong><span class="clipy-delta is-positive">+${pctDone}%</span></div>
              </div>
            </div>

            <div class="clipy-sankey-bar-wrap">
              <div class="clipy-sankey-head">
                <span>${isRu ? "Поток выполнения заметки (Conversion Funnel)" : "Note Execution Flow Funnel"}</span>
                <span>${doneList.length}/${tasks.length} ${isRu ? "завершено" : "completed"} (${pctDone}%)</span>
              </div>
              <div class="clipy-sankey-track">
                <div class="sankey-seg is-todo" style="width:${Math.max(4, pctTodo)}%"></div>
                <div class="sankey-seg is-flow" style="width:${Math.max(4, pctFlow)}%"></div>
                <div class="sankey-seg is-rev" style="width:${Math.max(4, pctRev)}%"></div>
                <div class="sankey-seg is-done" style="width:${Math.max(4, pctDone)}%"></div>
              </div>
            </div>

            <div class="clipy-quick-add-row">
              <input type="text" class="clipy-new-task-input" placeholder="${
                isRu ? "Введите новую задачу и нажмите Enter (добавится в активную заметку как - [ ])..." : "Type a new task and press Enter (appends - [ ] to active note)..."
              }" />
              <button class="artcraft-pay-action-btn is-green clipy-add-btn">
                <span>+ ${isRu ? "Добавить задачу" : "Add Task"}</span>
              </button>
            </div>

            <div class="artcraft-kanban-board is-four-cols">
              <div class="artcraft-kanban-col" data-kcol="todo">
                <div class="artcraft-kanban-col-head is-todo">
                  <span>01 // ${isRu ? "Идеи" : "Backlog"}</span>
                  <strong>${todoList.length}</strong>
                </div>
                <div class="artcraft-kanban-col-list">${renderColCards(todoList, "todo")}</div>
              </div>
              <div class="artcraft-kanban-col" data-kcol="flow">
                <div class="artcraft-kanban-col-head is-flow">
                  <span>02 // ${isRu ? "В Работе" : "In Progress"}</span>
                  <strong>${flowList.length}</strong>
                </div>
                <div class="artcraft-kanban-col-list">${renderColCards(flowList, "flow")}</div>
              </div>
              <div class="artcraft-kanban-col" data-kcol="review">
                <div class="artcraft-kanban-col-head is-rev">
                  <span>03 // ${isRu ? "Проверка" : "Review"}</span>
                  <strong>${revList.length}</strong>
                </div>
                <div class="artcraft-kanban-col-list">${renderColCards(revList, "review")}</div>
              </div>
              <div class="artcraft-kanban-col" data-kcol="done">
                <div class="artcraft-kanban-col-head is-done">
                  <span>04 // ${isRu ? "Готово" : "Shipped"}</span>
                  <strong>${doneList.length}</strong>
                </div>
                <div class="artcraft-kanban-col-list">${renderColCards(doneList, "done")}</div>
              </div>
            </div>
          </div>
        `;

        // Quick Add Task handler
        const addNewTask = async () => {
          const inp = body.querySelector(".clipy-new-task-input");
          const val = (inp && inp.value || "").trim();
          if (!val) return;
          if (!view || !view.file) {
            new Notice(isRu ? "Откройте заметку, в которую добавить задачу." : "Open the note the task should go into.");
            return;
          }
          // Appended at the end of the note as it is now; nothing else in the note is rewritten.
          const cur = await readCurrent();
          const addition = (cur.length === 0 || cur.endsWith("\n") ? "" : "\n") + `- [ ] ${val}\n`;
          if (view.editor) {
            const last = view.editor.lastLine();
            view.editor.replaceRange(addition, { line: last, ch: view.editor.getLine(last).length });
          } else {
            await this.app.vault.modify(view.file, cur + addition);
          }
          this.plugin.playTactileMicroFeedback("tap");
          render();
        };

        body.querySelector(".clipy-add-btn")?.addEventListener("click", addNewTask);
        body.querySelector(".clipy-new-task-input")?.addEventListener("keydown", (e) => {
          if (e.key === "Enter") addNewTask();
        });

        // Button move handlers
        body.querySelectorAll(".k-move-btn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const lineIdx = parseInt(btn.getAttribute("data-kline"), 10);
            const targetCol = btn.getAttribute("data-kto");
            await updateTaskState(lineIdx, targetCol);
          });
        });

        // HTML5 Drag & Drop handlers
        let draggedLineIdx = null;
        body.querySelectorAll(".artcraft-kanban-card[draggable='true']").forEach((card) => {
          card.addEventListener("dragstart", (e) => {
            draggedLineIdx = parseInt(card.getAttribute("data-kline"), 10);
            card.classList.add("is-dragging");
            if (e.dataTransfer) e.dataTransfer.setData("text/plain", String(draggedLineIdx));
          });
          card.addEventListener("dragend", () => {
            card.classList.remove("is-dragging");
            draggedLineIdx = null;
          });
        });

        body.querySelectorAll(".artcraft-kanban-col").forEach((colEl) => {
          colEl.addEventListener("dragover", (e) => {
            e.preventDefault();
            colEl.classList.add("is-drag-over");
          });
          colEl.addEventListener("dragleave", () => {
            colEl.classList.remove("is-drag-over");
          });
          colEl.addEventListener("drop", async (e) => {
            e.preventDefault();
            colEl.classList.remove("is-drag-over");
            const targetCol = colEl.getAttribute("data-kcol");
            // only a card dragged from this board counts; text dropped from elsewhere is ignored
            const lineIdx = draggedLineIdx;
            draggedLineIdx = null;
            if (lineIdx !== null && lineIdx >= 0 && targetCol) {
              await updateTaskState(lineIdx, targetCol);
            }
          });
        });
      }

      // Auto-fit textarea height so user never has to drag corners
      body.querySelectorAll("textarea.rpg-input-area").forEach((ta) => {
        const fitHeight = () => {
          ta.style.height = "auto";
          const minH = ta.classList.contains("is-mono-preview") ? 180 : 84;
          ta.style.height = Math.max(minH, ta.scrollHeight + 4) + "px";
        };
        ta.addEventListener("input", fitHeight);
        setTimeout(fitHeight, 20);
      });
    };

    render();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// =========================================================================
// 5. MINDFUL FOCUS CALIBRATION MODAL (6 LANGUAGES)
// =========================================================================
class AutopilotInterruptModal extends Modal {
  constructor(app, plugin, triggerTime = "") {
    super(app);
    this.plugin = plugin;
    this.triggerTime = triggerTime || new Date().toTimeString().slice(0, 5);
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    if (modalEl) modalEl.addClass("artcraft-wide-craft-modal", "artcraft-autopilot-modal", "artcraft-airy-modal");
    contentEl.empty();
    const rpg = this.plugin.settings.lifeRpg || DEFAULT_SETTINGS.lifeRpg;

    const chosenPrompt = i18n({
      en: "Is what I am doing right now moving me toward my main project or toward distraction?",
      ru: "То, что я делаю прямо сейчас — это движение к главной цели или уход в расфокус?",
      zh: "我此刻正在做的事情，是在推进核心目标，还是在陷入分心？",
      ja: "今していることは、最重要目標への前進ですか、それとも気晴らしですか？",
      es: "¿Lo que estoy haciendo ahora me acerca a mi meta principal o a la distracción?",
      de: "Bringt mich das, was ich gerade tue, meinem Hauptziel näher oder lenkt es mich ab?"
    }, this.plugin);

    contentEl.innerHTML = `
      <div class="artcraft-rpg-hero">
        <div class="artcraft-rpg-badge">${sicraftIcon('timer')} <span>${i18n({
          en: `MINDFUL CHECK-IN · ${this.triggerTime}`,
          ru: `ПРОВЕРКА ФОКУСА · ${this.triggerTime}`,
          zh: `专注力校准 · ${this.triggerTime}`,
          ja: `フォーカス確認 · ${this.triggerTime}`,
          es: `CONTROL DE ENFOQUE · ${this.triggerTime}`,
          de: `FOKUS-CHECK · ${this.triggerTime}`
        }, this.plugin)}</span></div>
        <h2 class="artcraft-rpg-title">${chosenPrompt}</h2>
      </div>
      <div class="artcraft-rpg-levers-box">
        <div class="rpg-card-kicker">${escHtml(rpg.oneMonthBoss)}</div>
        <textarea class="rpg-input-area autopilot-ans" rows="3" placeholder="${i18n({
          en: "Write one brief sentence to lock in your focus (+30 XP)...",
          ru: "Напишите одну короткую фразу для фиксации внимания (+30 XP)...",
          zh: "写下一句简短反思以锁定注意力 (+30 XP)...",
          ja: "集中を取り戻すための短い一言を記入 (+30 XP)...",
          es: "Escribe una frase breve para fijar tu atención (+30 XP)...",
          de: "Schreibe einen kurzen Satz zur Fokus-Kalibrierung (+30 XP)..."
        }, this.plugin)}"></textarea>
      </div>
      <div class="artcraft-rpg-footer-actions" style="justify-content: space-between; align-items: center;">
        <label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);cursor:pointer;">
          <input type="checkbox" class="autopilot-schedule-toggle" ${this.plugin.settings.autopilotAlarms?.enabled ? "checked" : ""} />
          <span>${i18n({ en: "Auto-prompt on schedule", ru: "Авто-вопросы по расписанию" }, this.plugin)}</span>
        </label>
        <div style="display:inline-flex;gap:8px;">
          <button class="sketch-tool-btn" data-act="close">${i18n({ en: "Later", ru: "Позже", zh: "稍后", ja: "後で", es: "Luego", de: "Später" }, this.plugin)}</button>
          <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="commit">
            ${sicraftIcon('chain')} <span>${i18n({ en: "Sign in SHA-256 (+30 XP)", ru: "Подписать в SHA-256 (+30 XP)", zh: "SHA-256 签名记录 (+30 XP)", ja: "SHA-256 に署名 (+30 XP)", es: "Firmar en SHA-256 (+30 XP)", de: "In SHA-256 signieren (+30 XP)" }, this.plugin)}</span>
          </button>
        </div>
      </div>
    `;

    contentEl.querySelector(".autopilot-schedule-toggle")?.addEventListener("change", async (e) => {
      if (!this.plugin.settings.autopilotAlarms) this.plugin.settings.autopilotAlarms = { enabled: false, times: ["11:00", "13:30", "15:15", "17:00", "19:30"], lastTriggeredKey: "", reflections: [] };
      this.plugin.settings.autopilotAlarms.enabled = !!e.target.checked;
      await this.plugin.saveSettings();
    });

    contentEl.querySelector('[data-act="close"]')?.addEventListener("click", () => this.close());
    contentEl.querySelector('[data-act="commit"]')?.addEventListener("click", async () => {
      const ans = (contentEl.querySelector(".autopilot-ans")?.value || "").trim() || "Focus recalibrated";
      await this.plugin.mineQuestBlock(`Check-in (${this.triggerTime}): ${ans}`, 30, true);
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}


// ============================================================================
// v5.2.0 MODAL: HUMAN × AI DUAL-COGNITION STUDIO, llms.txt & WASM RADAR
// ============================================================================
class DualCognitionNeuralStudioModal extends require("obsidian").Modal {
  constructor(app, plugin, initialTab = "human") {
    super(app);
    this.plugin = plugin;
    this.activeTab = initialTab;
    this.aiFormat = "mcp";
    this.radarData = null;
  }

  async onOpen() {
    const obsidian = require("obsidian");
    const { contentEl, modalEl } = this;
    if (modalEl) {
      modalEl.addClass("artcraft-wide-craft-modal", "artcraft-dual-cognition-shell");
    }
    contentEl.empty();
    contentEl.addClass("artcraft-dual-cognition-modal");

    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    this.activeFile = activeView && activeView.file ? activeView.file : this.app.workspace.getActiveFile();
    this.rawText = "";
    if (this.activeFile) {
      try {
        this.rawText = await this.app.vault.read(this.activeFile);
      } catch (e) {}
    }
    const title = this.activeFile ? this.activeFile.basename : "Vault Synthesis";
    const path = this.activeFile ? this.activeFile.path : "";
    this.analysis = this.plugin.analyzeNoteDualCognition(this.rawText, title, path);

    await this.renderStudio();
  }

  async renderStudio() {
    const obsidian = require("obsidian");
    const { contentEl } = this;
    contentEl.empty();

    const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
    const a = this.analysis;
    const capsuleText = this.plugin.buildAiSemanticCapsule(a, this.aiFormat);
    const capsuleTokens = Math.max(1, Math.ceil(capsuleText.length / 3.8));
    // Estimated size change of the capsule against the note (3.8 characters per token), unclamped.
    const savedPct = a.rawTokens > 0 ? Math.round((1 - capsuleTokens / a.rawTokens) * 100) : 0;
    const savedLabel = (savedPct >= 0 ? "−" : "+") + Math.abs(savedPct) + "%";

    const stampedCount = Object.keys(this.plugin.settings.stampedNotes || {}).length;
    const questBlocks = Array.isArray(this.plugin.settings.questBlockchain)
      ? this.plugin.settings.questBlockchain.length
      : 0;

    contentEl.innerHTML = `
      <div class="dc-studio-shell">
        <div class="dc-studio-header">
          <div>
            <div class="dc-eyebrow">${isRu ? "Сводка заметки" : "Note summary"} · Alchemy Craft ${this.plugin.manifest.version}</div>
            <h2 class="dc-title">${
              isRu
                ? "Сводка заметки, капсула для ИИ и похожие заметки"
                : "Note Summary, AI Capsule & Similar Notes Studio"
            }</h2>
            <p class="dc-subtitle">${
              isRu
                ? `Активная заметка: <strong>${escHtml(a.title)}</strong> · Кристальная структура без «стены текста» для глаз человека и сжатая семантическая капсула для ИИ-агентов.`
                : `Active note: <strong>${escHtml(a.title)}</strong> · High-anchor visual architecture for human eyes and token-compressed semantic capsules for AI agents.`
            }</p>
          </div>
          <div class="dc-kpi-strip">
            <div class="dc-kpi-pill is-emerald">
              <span class="dc-kpi-lbl">${isRu ? "СТРУКТУРА" : "STRUCTURE"}</span>
              <strong class="dc-kpi-val">${a.structureScore}%</strong>
            </div>
            <div class="dc-kpi-pill is-indigo">
              <span class="dc-kpi-lbl">${isRu ? "ЭКОНОМИЯ ТОКЕНОВ ИИ" : "AI TOKEN SAVINGS"}</span>
              <strong class="dc-kpi-val">${savedLabel}</strong>
            </div>
            <div class="dc-kpi-pill is-amber">
              <span class="dc-kpi-lbl">HASH</span>
              <strong class="dc-kpi-val">0x${a.hashHex}</strong>
            </div>
          </div>
        </div>

        <div class="dc-tab-bar">
          <button class="dc-tab-btn ${this.activeTab === "human" ? "is-active" : ""}" data-tab="human">
            <span>${isRu ? "1. Выжимка для Человека (TL;DR)" : "1. Human Executive Brief"}</span>
          </button>
          <button class="dc-tab-btn ${this.activeTab === "ai" ? "is-active" : ""}" data-tab="ai">
            <span>${isRu ? "2. Капсула для ИИ (llms.txt / MCP)" : "2. AI Agent Capsule (llms.txt / MCP)"}</span>
          </button>
          <button class="dc-tab-btn ${this.activeTab === "radar" ? "is-active" : ""}" data-tab="radar">
            <span>${isRu ? "3. Похожие заметки" : "3. Similar notes"}</span>
          </button>
          <button class="dc-tab-btn ${this.activeTab === "seals" ? "is-active" : ""}" data-tab="seals">
            <span>${isRu ? "4. Векторные 3D-Печати Мастерства" : "4. Vector SVG Ex-Libris Seals"}</span>
          </button>
        </div>

        <div class="dc-tab-body" id="dcTabBody"></div>
      </div>
    `;

    contentEl.querySelectorAll(".dc-tab-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        this.activeTab = btn.dataset.tab;
        await this.renderStudio();
      });
    });

    const bodyEl = contentEl.querySelector("#dcTabBody");
    if (!bodyEl) return;

    if (this.activeTab === "human") {
      bodyEl.innerHTML = `
        <div class="dc-bento-grid">
          <div class="dc-card dc-card-wide">
            <div class="dc-card-head">
              <span class="dc-badge is-blue">${isRu ? "01 · Главные мысли" : "01 · Key points"}</span>
              <h3>${isRu ? "Ключевые смысловые опоры заметки (без воды)" : "High-Signal Executive Thesis Anchors"}</h3>
            </div>
            <ul class="dc-thesis-list">
              ${
                a.thesisList.length > 0
                  ? a.thesisList
                      .map(
                        (t, idx) =>
                          `<li><span class="dc-step-chip">0${idx + 1}</span><span>${escHtml(t)}</span></li>`
                      )
                      .join("")
                  : `<li class="dc-empty">${
                      isRu
                        ? "Добавьте абзацы с ключевыми выводами или жирным выделением — движок автоматически соберёт выжимку."
                        : "Add paragraphs with bold takeaways or metrics — the engine will extract them automatically."
                    }</li>`
              }
            </ul>
            <div class="dc-action-row">
              <button class="dc-primary-btn" data-act="insert-brief">
                ${
                  isRu
                    ? "Вставить этот Нейро-Бриф (Callout) в шапку заметки"
                    : "Insert Executive Brief Callout at Top of Note"
                }
              </button>
              <button class="dc-secondary-btn" data-act="toggle-bionic">
                ${
                  isRu
                    ? `Бионический фокус корней слов: ${this.plugin.settings.bionicAnchors ? "ВКЛ" : "ВЫКЛ"}`
                    : `Bionic Word-Root Anchors: ${this.plugin.settings.bionicAnchors ? "ON" : "OFF"}`
                }
              </button>
            </div>
          </div>

          <div class="dc-card">
            <div class="dc-card-head">
              <span class="dc-badge is-emerald">${isRu ? "02 · Числа и даты" : "02 · Figures and dates"}</span>
              <h3>${isRu ? "Матрица цифр, дат и метрик" : "Extracted Numbers, Dates & KPIs"}</h3>
            </div>
            <div class="dc-metrics-pills">
              ${
                a.metricsList.length > 0
                  ? a.metricsList
                      .map(
                        (m) => `
                        <div class="dc-metric-chip" title="${m.context.replace(/"/g, "&quot;")}">
                          <strong>${escHtml(m.value)}</strong>
                          <span>${escHtml(m.context.slice(0, 48))}${m.context.length > 48 ? "…" : ""}</span>
                        </div>`
                      )
                      .join("")
                  : `<div class="dc-empty">${
                      isRu ? "В тексте пока нет числовых метрик (%, $, дат, множителей)." : "No numeric metrics (%, $, dates, multipliers) detected yet."
                    }</div>`
              }
            </div>
          </div>

          <div class="dc-card">
            <div class="dc-card-head">
              <span class="dc-badge is-amber">${isRu ? "03 · Структура и задачи" : "03 · Structure and tasks"}</span>
              <h3>${isRu ? `Карта глав (${a.headings.length}) и шагов (${a.tasks.length + a.steps.length})` : `Section Map (${a.headings.length}) & Action Levers (${a.tasks.length + a.steps.length})`}</h3>
            </div>
            <div class="dc-outline-list">
              ${
                a.headings.slice(0, 8).map(
                  (h) => `
                  <div class="dc-outline-row" style="padding-left:${Math.max(0, h.level - 1) * 10}px">
                    <span class="dc-h-tag">H${h.level}</span>
                    <span class="dc-h-txt">${escHtml(h.text)}</span>
                    <span class="dc-h-line">L${h.line}</span>
                  </div>`
                ).join("") || `<div class="dc-empty">${isRu ? "Заголовки H1–H4 не найдены" : "No H1–H4 headings yet"}</div>`
              }
            </div>
          </div>
        </div>
      `;

      bodyEl.querySelector('[data-act="insert-brief"]')?.addEventListener("click", async () => {
        await this.plugin.insertExecutiveBriefIntoActiveNote(a);
        this.close();
      });

      bodyEl.querySelector('[data-act="toggle-bionic"]')?.addEventListener("click", async () => {
        this.plugin.settings.bionicAnchors = !this.plugin.settings.bionicAnchors;
        await this.plugin.saveSettings();
        this.plugin.applyBodyClasses();
        this.plugin.refreshBionicAnchorsInDOM();
        await this.renderStudio();
      });
    } else if (this.activeTab === "ai") {
      bodyEl.innerHTML = `
        <div class="dc-ai-panel">
          <div class="dc-ai-toolbar">
            <div class="dc-format-group">
              <button class="dc-fmt-btn ${this.aiFormat === "mcp" ? "is-active" : ""}" data-fmt="mcp">MCP / Claude XML (&lt;knowledge_capsule&gt;)</button>
              <button class="dc-fmt-btn ${this.aiFormat === "llms" ? "is-active" : ""}" data-fmt="llms">llms.txt Standard</button>
              <button class="dc-fmt-btn ${this.aiFormat === "jsonld" ? "is-active" : ""}" data-fmt="jsonld">JSON-LD Graph Node</button>
            </div>
            <div class="dc-token-badge">
              <span>${isRu ? "Сжатие:" : "Compression:"} <strong>${a.rawTokens} → ${capsuleTokens} tokens (${savedLabel})</strong></span>
            </div>
          </div>

          <pre class="dc-code-preview"><code>${capsuleText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>

          <div class="dc-action-row">
            <button class="dc-primary-btn" data-act="copy-capsule">
              ${isRu ? "Скопировать капсулу для ИИ (Claude / ChatGPT / Cursor)" : "Copy AI Semantic Capsule to Clipboard"}
            </button>
            <button class="dc-secondary-btn" data-act="compile-llms-txt">
              ${isRu ? "Собрать и сохранить llms.txt в корне хранилища Obsidian" : "Compile & Save Master llms.txt in Vault Root"}
            </button>
          </div>
        </div>
      `;

      bodyEl.querySelectorAll(".dc-fmt-btn").forEach((b) => {
        b.addEventListener("click", async () => {
          this.aiFormat = b.dataset.fmt;
          await this.renderStudio();
        });
      });

      bodyEl.querySelector('[data-act="copy-capsule"]')?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(capsuleText);
          new obsidian.Notice(
            isRu
              ? `Семантическая капсула скопирована (${capsuleTokens} токенов, экономия ${savedLabel})!`
              : `AI Semantic Capsule copied (${capsuleTokens} tokens, ${savedLabel} saved)!`
          );
        } catch (e) {}
      });

      bodyEl.querySelector('[data-act="compile-llms-txt"]')?.addEventListener("click", async () => {
        await this.plugin.compileVaultLlmsTxtFile();
      });
    } else if (this.activeTab === "radar") {
      bodyEl.innerHTML = `<div class="dc-loading">${
        isRu ? "Сравниваю словарь заметок..." : "Comparing the vocabulary of your notes..."
      }</div>`;
      if (!this.radarData) {
        this.radarData = await this.plugin.scanVaultWasmSemanticRadar(this.activeFile, this.rawText);
      }
      const r = this.radarData;
      bodyEl.innerHTML = `
        <div class="dc-radar-wrap">
          <div class="dc-radar-banner">
            <div>
              <strong>${
                isRu
                  ? `Похожие заметки (считается на этом устройстве)`
                  : `Similar notes (computed on this device)`
              }</strong>
              <p>${
                isRu
                  ? `Просканировано ${r.scannedCount} заметок за ${r.elapsedMs} мс . Найдены скрытые смысловые пересечения:`
                  : `Scanned ${r.scannedCount} notes in ${r.elapsedMs} ms. Discovered semantic resonances:`
              }</p>
            </div>
          </div>
          <div class="dc-radar-list">
            ${
              r.matches.length > 0
                ? r.matches
                    .map(
                      (m) => `
                      <div class="dc-radar-row">
                        <div class="dc-radar-main">
                          <div class="dc-radar-title-line">
                            <span class="dc-sim-badge ${m.similarity >= 70 ? "is-high" : ""}">${m.similarity}% match</span>
                            <strong>${escHtml(m.title)}</strong>
                            
                            ${
                              m.isAlreadyLinked
                                ? `<span class="dc-linked-pill">${isRu ? "Уже связана [[...]]" : "Linked [[...]]"}</span>`
                                : `<span class="dc-unlinked-pill">${isRu ? "Скрытая связь!" : "Unlinked Discovery"}</span>`
                            }
                          </div>
                          <div class="dc-radar-sub">
                            ${
                              m.sharedKeywords.length > 0
                                ? `${isRu ? "Общие концепты:" : "Shared concepts:"} <code>${m.sharedKeywords.map(escHtml).join("</code> · <code>")}</code>`
                                : `${isRu ? "Похожий словарь" : "Similar vocabulary"} (${escHtml(m.path)})`
                            }
                          </div>
                        </div>
                        <div class="dc-radar-actions">
                          <button class="dc-mini-link-btn" data-link-note="${m.title.replace(/"/g, "&quot;")}">
                            + [[${ isRu ? "Связать" : "Link" }]]
                          </button>
                          <button class="dc-mini-open-btn" data-open-path="${m.path.replace(/"/g, "&quot;")}">
                            ↗
                          </button>
                        </div>
                      </div>`
                    )
                    .join("")
                : `<div class="dc-empty">${
                    isRu ? "В хранилище пока недостаточно других заметок для построения матрицы связей." : "Not enough other Markdown notes in vault yet to compute semantic links."
                  }</div>`
            }
          </div>
        </div>
      `;

      bodyEl.querySelectorAll("[data-link-note]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const targetTitle = btn.getAttribute("data-link-note");
          if (!this.activeFile || !targetTitle) return;
          const cur = await this.app.vault.read(this.activeFile);
          const appendBlock = `\n- Related: [[${targetTitle}]]`;
          await this.app.vault.modify(this.activeFile, cur + appendBlock);
          this.rawText = cur + appendBlock;
          this.radarData = null;
          new obsidian.Notice(
            isRu ? `Ссылка [[${targetTitle}]] добавлена в заметку!` : `Linked [[${targetTitle}]] into active note!`
          );
          await this.renderStudio();
        });
      });

      bodyEl.querySelectorAll("[data-open-path]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const p = btn.getAttribute("data-open-path");
          const f = this.app.vault.getAbstractFileByPath(p);
          if (f) {
            await this.app.workspace.getLeaf(false).openFile(f);
            this.close();
          }
        });
      });
    } else if (this.activeTab === "seals") {
      const seals = [
        {
          id: "initiate",
          title: isRu ? "01 // Архивный Инициат" : "01 // Archival Initiate",
          desc: isRu ? "Первая изученная заметка и старт цепочки SHA-256" : "First stamped note & SHA-256 chain genesis",
          unlocked: true,
          color: "#D97706",
          bg: "#FEF3C7",
        },
        {
          id: "bento",
          title: isRu ? "02 // Архитектор Ясности" : "02 // Swiss Craft Architect",
          desc: isRu ? "Индекс структурной читаемости заметки выше 75%" : "Note structural readability score above 75%",
          unlocked: a.structureScore >= 75 || stampedCount >= 1,
          color: "#059669",
          bg: "#D1FAE5",
        },
        {
          id: "neural",
          title: isRu ? "03 // Нейро-Алхимик (Human × AI)" : "03 // Dual-Cognition Alchemist",
          desc: isRu ? "Синтез человеческого чтения и капсул ИИ (llms.txt / MCP)" : "Mastery of Human × AI Semantic Capsules",
          unlocked: true,
          color: "#2563EB",
          bg: "#DBEAFE",
        },
        {
          id: "sovereign",
          title: isRu ? "04 // Грандмастер Потока (On-Chain)" : "04 // Sovereign Proof-of-Work Monolith",
          desc: isRu ? `Блоков в цепи: ${questBlocks} · Изучено книг: ${stampedCount}` : `Chain blocks: ${questBlocks} · Stamped notes: ${stampedCount}`,
          unlocked: questBlocks >= 3 || stampedCount >= 2,
          color: "#7C3AED",
          bg: "#EDE9FE",
        },
      ];

      bodyEl.innerHTML = `
        <div class="dc-seals-grid">
          ${seals
            .map(
              (s) => `
              <div class="dc-seal-card ${s.unlocked ? "is-unlocked" : "is-locked"}" style="--seal-accent:${s.color};--seal-bg:${s.bg}">
                <div class="dc-seal-svg-wrap">
                  <svg viewBox="0 0 80 80" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="36" fill="${s.bg}" stroke="${s.color}" stroke-width="2.5"/>
                    <circle cx="40" cy="40" r="29" stroke="${s.color}" stroke-width="1.2" stroke-dasharray="3 3"/>
                    <polygon points="40,14 47,29 63,31 51,42 54,58 40,50 26,58 29,42 17,31 33,29" fill="${s.color}" fill-opacity="0.18" stroke="${s.color}" stroke-width="1.8"/>
                    <circle cx="40" cy="40" r="6" fill="${s.color}"/>
                  </svg>
                </div>
                <div class="dc-seal-info">
                  <h4>${s.title}</h4>
                  <p>${s.desc}</p>
                  <button class="dc-mini-link-btn" data-stamp-seal="${s.title.replace(/"/g, "&quot;")}">
                    ${isRu ? "Вставить печать Ex-Libris в заметку" : "Stamp Ex-Libris Badge into Note"}
                  </button>
                </div>
              </div>`
            )
            .join("")}
        </div>
      `;

      bodyEl.querySelectorAll("[data-stamp-seal]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const sealName = btn.getAttribute("data-stamp-seal");
          if (!this.activeFile) return;
          const cur = await this.app.vault.read(this.activeFile);
          const badgeMd = `\n> [!success] **EX-LIBRIS SEAL // ${sealName}** — Verified \`0x${a.hashHex}\` (${new Date().toLocaleDateString()})\n`;
          await this.app.vault.modify(this.activeFile, cur + badgeMd);
          new obsidian.Notice(
            isRu ? `Печать «${sealName}» поставлена в заметку!` : `Seal "${sealName}" stamped into note!`
          );
          this.close();
        });
      });
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = AlchemyFlowPlugin;

/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */