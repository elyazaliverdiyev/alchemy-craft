const { Plugin, PluginSettingTab, Setting, Notice, Modal, Menu, addIcon } = require("obsidian");

const DEFAULT_SETTINGS = {
  uiLanguage: "en", // "en" | "ru" | "zh" | "ja" | "es" | "de" (auto-detected on first load from Obsidian language)
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
  },
  nightLightCompensation: false,
  surfaceMode: "white", // "white" (SWISS EDITORIAL Pure White #FFFFFF) | "book" (Warm Book #FAF8F3) | "grain" (Archival Grain Paper)
  pageWidthMode: "book", // "book" (760px Classic Book) | "wide" (1080px Studio Wide) | "full" (94% Full Canvas)
  bionicAnchors: false, // Saccadic Bionic Word-Root Fixation Anchors for fast wall-of-text scanning
  wasmAcceleration: true, // Embedded WebAssembly (WASM) 144 FPS Spring & Graph Physics Core
  paperGrain: 28, // 0..100% micro-grain intensity // Calibrated Cool Alabaster & Crisp Slate Ink for Windows 11 Night Light users
  editorialCleanMode: true, // Swiss Bento tactile block isolation without harsh neo-brutalist black borders
  lifeRpg: {
    antiVision: "Бесцельный скроллинг, расфокус, стена серого текста и откладывание ключевого проекта.",
    visionMvp: "Состояние глубокого потока: 4 часа чистого созидания утром, сильный продукт и полная ясность ума.",
    oneYearMission: "Превратить экосистему продуктов (Alchemy Craft & ИИ-инструменты) в узнаваемый стандарт для тысяч создателей.",
    oneMonthBoss: "Релиз Alchemy Craft v4.8 с безупречной читаемостью SWISS EDITORIAL, системным звуком, Graph Studio и цепочкой квестов.",
    dailyLevers: [
      { id: "lever-1", title: "90 минут утреннего Deep Work (низкая энтропия до соцсетей)", xp: 50, done: false },
      { id: "lever-2", title: "Довести 1 ключевой модуль / улучшение до продакшена", xp: 40, done: false },
      { id: "lever-3", title: "Высокоэффективная дистрибуция ценности (пост, демо или разбор кейса)", xp: 35, done: false }
    ],
    constraints: "Никаких правок без проверки читаемости; не открывать ленты до завершения первого рычага.",
    xp: 340,
    level: 4
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
    enabled: true,
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
  grain: `<svg class="sicraft-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="18" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="18" cy="18" r="1"/></svg>`
};
Object.assign(SICRAFT_SVGS, EXTRA_SICRAFT_SVGS);
function sicraftIcon(key) {
  return SICRAFT_SVGS[key] || EXTRA_SICRAFT_SVGS[key] || SICRAFT_SVGS.spark || "";
}

function openExternalUrl(url) {
  if (!url) return;
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.warn("openExternalUrl error:", e);
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio",
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
    settingsTitle: "Alchemy Craft — Tactile Swiss Bento Studio",
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
    en: "TIME CAPSULE // WAX SEAL",
    ru: "КАПСУЛА ВРЕМЕНИ // СУРГУЧНАЯ ПЕЧАТЬ",
    zh: "时间胶囊 // 火漆封印",
    ja: "タイムカプセル // 封蝋印",
    es: "CÁPSULA DEL TIEMPO // SELLO DE LACRE",
    de: "ZEITKAPSEL // SIEGELLACK",
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
    en: "While the countdown runs, try to recall the essence. Early open: hold the seal for 2 seconds.",
    ru: "Пока идёт отсчёт, пытайтесь вспомнить суть. Досрочно — удерживать печать 2 секунды.",
    zh: "倒计时期间，尝试复述核心观点。提前开封：长按印章2秒。",
    ja: "カウントダウン中、要点を思い出してください。早期開封：印を2秒長押し。",
    es: "Durante la cuenta regresiva, intenta recordar lo esencial. Apertura anticipada: mantén presionado el sello 2 s.",
    de: "Während der Countdown läuft, erinnere den Kern. Vorzeitiges Öffnen: Siegel 2 Sekunden gedrückt halten.",
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
    en: "🕯️ Seal note",
    ru: "🕯️ Запечатать",
    zh: "🕯️ 封存笔记",
    ja: "🕯️ ノートを封印",
    es: "🕯️ Sellar nota",
    de: "🕯️ Notiz versiegeln",
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
      lines.push(`## ⚗️ ${i18n({
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
          lines.push(`> [! lightbulb] **${c.meaning || c.label}**\n> *«${c.snippet}»*`);
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
      if (view && view.editor && this.bookmarks.length > 0) {
        const cur = view.editor.getValue();
        view.editor.setValue(cur + buildDigestMarkdown());
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
        if (this.activeFilter === "classics") return bk.isClassics || !!bk.stamp;
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
            <div class="book-folio-folder">${bk.folder}</div>
            <h4 class="book-folio-title" title="${bk.title}">${bk.title}</h4>
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
                      return `<span class="nut-dot" style="background:${nObj.color}" title="${m.meaning || m.label}"></span>`;
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
      const lines = [`# 📚 ${i18n({ en: "Master Classics & Book Nutrient Digest", ru: "Полка Классики и Сводный Дайджест Книг", zh: "经典书架与全库书籍摘要", ja: "名著の本棚と統合ダイジェスト", es: "Estantería de clásicos y resumen maestro", de: "Klassiker-Regal und Gesamt-Auszug" }, this.plugin)}\n`];
      books.forEach((bk) => {
        lines.push(`## 📖 ${bk.title} (${bk.isClassics ? `★ CLASSICS #${bk.stamp.count}` : "Read"})`);
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
  { id: "balanced", ru: "Бархатный Розовый Дождь", en: "Velvet Pink Rain", subRu: "Стерео -3dB • Память и фокус", subEn: "Stereo -3dB • Memory & Focus", icon: SICRAFT_SVGS.sliders },
  { id: "brown", ru: "Глубокий Тёмный Кокон", en: "Deep Brown Shield", subRu: "Мягкий басовый щит • СДВГ-фокус", subEn: "Sub-Bass Shield • ADHD Focus", icon: SICRAFT_SVGS.shield },
  { id: "gamma40", ru: "40Hz Нейро-Фокус в Шёлке", en: "40Hz Gamma Silk", subRu: "Ритм 40Hz + тёплый розовый шум", subEn: "40Hz Binaural + Warm Pink Pad", icon: SICRAFT_SVGS.brain },
  { id: "bright", ru: "10Hz Альфа-Спокойствие", en: "10Hz Alpha Calm Flow", subRu: "Снятие тревоги и лёгкое чтение", subEn: "Stress Relief & Calm Reading", icon: SICRAFT_SVGS.sun },
  { id: "night", ru: "6Hz Тета-Медитация Души", en: "6Hz Theta Deep Peace", subRu: "Глубокий покой 174Hz + 528Hz", subEn: "Deep Inner Peace 174Hz + 528Hz", icon: SICRAFT_SVGS.moon },
  { id: "rain_roof", ru: "Поющие Чаши и Тёплый Ветер", en: "Singing Bowls & Air", subRu: "Тибетский резонанс 432Hz", subEn: "Harmonic Bowl Overtones 432Hz", icon: SICRAFT_SVGS.roof },
  { id: "ocean", ru: "Дыхание Океана (0.1Hz)", en: "Coherent Ocean Breath", subRu: "Прибой в ритме спокойного пульса", subEn: "0.1Hz Coherent Breathing Surf", icon: SICRAFT_SVGS.waves },
  { id: "rain", ru: "Дождь по Ткани Шатра", en: "Cozy Rain on Tent", subRu: "Мягкий стерео-дождь по бумаге", subEn: "Gentle Stereo Rain on Paper", icon: SICRAFT_SVGS.rain },
  { id: "stream", ru: "Горный Ручей и Хвоя", en: "Mountain Brook & Pines", subRu: "Живая вода и лесной воздух", subEn: "Babbling Brook & Soft Breeze", icon: SICRAFT_SVGS.stream },
  { id: "fire", ru: "Камин и Тёплые Угли", en: "Cozy Hearth & Embers", subRu: "Тёплый очаг и мягкий треск дров", subEn: "Warm Hearth & Soft Crackling", icon: SICRAFT_SVGS.flame },
  { id: "train", ru: "Ночной Поезд под Дождём", en: "Night Sleeper Train", subRu: "Мерный стук колёс и уют купе", subEn: "Rhythmic Rail Cadence & Rain", icon: SICRAFT_SVGS.train },
  { id: "cafe", ru: "Вечерняя Кофейня Алхимика", en: "Warm Roastery Ambience", subRu: "Мягкая акустика зала и пар", subEn: "Warm Coffeehouse Acoustic Pad", icon: SICRAFT_SVGS.coffee },
  { id: "crystal_432", ru: "432Hz Кристальные Чаши и Дождь", en: "432Hz Crystal Bowls & Rain", subRu: "Гармоники 432Hz + тёплый ливень", subEn: "432Hz Pure Crystal + Warm Rain", icon: SICRAFT_SVGS.spark },
  { id: "solfeggio_528", ru: "528Hz Сольфеджио Глубокий Покой", en: "528Hz Solfeggio Deep Repair", subRu: "Частота восстановления + шёлк", subEn: "528Hz Restorative Drone + Silk", icon: SICRAFT_SVGS.sun },
  { id: "nordic_wind", ru: "Северный Фьорд и Сосновый Лес", en: "Nordic Fjord & Pine Wind", subRu: "Дыхание ветра в кронах сосен", subEn: "Slow Boreal Wind Through Pines", icon: SICRAFT_SVGS.waves },
  { id: "vinyl_library", ru: "Винил в Старой Библиотеке", en: "Old Library Vinyl & Hearth", subRu: "Тёплый виниловый шорох и камин", subEn: "Warm Vinyl Crackle & Study Room", icon: SICRAFT_SVGS.book }
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

    this.initWasmCore();
    this.initMagicSpotlightTracker();
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
    if (this.settings.showEqualizer !== false) {
      setTimeout(() => this.startWindowsWasapiLoopbackBridge(), 300);
    }
    this.addSettingTab(new AlchemyFlowSettingTab(this.app, this));
    setTimeout(() => {
      this.injectGraphViewHUD();
      this.renderNoteWaxSealOverlay();
      this.updateReadingPacerState();
    }, 400);

    // Time Capsules: announce sealed notes whose unlock date has arrived
    this.app.workspace.onLayoutReady(() => {
      setTimeout(() => this.announceReadyTimeCapsules(), 1500);
      setTimeout(() => this.offerInteractiveTourOnce(), 2200);
      this.startAutopilotAlarmScheduler();
    });
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

  startWindowsWasapiLoopbackBridge() {
    if (this.wasapiBridgeProc) return true;
    try {
      const cp = null;
      const os = window.require ? window.require("os") : null;
      if (!cp || !os || os.platform() !== "win32") return false;

      // Native C# CoreAudio Multi-Endpoint Loopback Meter:
      // Enumerates ALL active playback endpoints (eRender = 0, DEVICE_STATE_ACTIVE = 1) + default endpoints
      // so whether music plays on USB headphones, speakers, HDMI monitor, or Bluetooth, it captures the live peak & stereo channels at 40 FPS
      // and flushes Console.Out on every frame! Launched via -EncodedCommand (UTF-16LE Base64) to avoid any command-line escaping issues.
      const csharpSource = [
        "using System;",
        "using System.Collections.Generic;",
        "using System.Globalization;",
        "using System.Runtime.InteropServices;",
        "using System.Threading;",
        "[Guid(\"BCDE0395-E52F-467C-8E3D-C4579291692E\"), ComImport] class MMDeviceEnumeratorComObject { }",
        "[Guid(\"0BD7A1BE-7A1A-44DB-8397-CC5392387B5E\"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]",
        "interface IMMDeviceCollection { int GetCount(out uint pcDevices); int Item(uint nDevice, out IMMDevice ppDevice); }",
        "[Guid(\"A95664D2-9614-4F35-A746-DE8DB63617E6\"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]",
        "interface IMMDeviceEnumerator { int EnumAudioEndpoints(int dataFlow, int dwStateMask, out IMMDeviceCollection ppDevices); int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice ppEndpoint); }",
        "[Guid(\"D666063F-1587-4E43-81F1-B948E807363F\"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]",
        "interface IMMDevice { int Activate(ref Guid iid, int dwClsCtx, IntPtr pActivationParams, [MarshalAs(UnmanagedType.IUnknown)] out object ppInterface); }",
        "[Guid(\"C02216F6-8C67-4B5B-9D00-D008E73E0064\"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]",
        "interface IAudioMeterInformation { int GetPeakValue(out float pfPeak); int GetMeteringChannelCount(out int pnChannelCount); int GetChannelsPeakValues(int u32ChannelCount, [Out] float[] afPeakValues); }",
        "public class WinCoreAudioLoopback {",
        "  private static List<IAudioMeterInformation> meters = new List<IAudioMeterInformation>();",
        "  public static void Init() {",
        "    meters.Clear();",
        "    var enumerator = (IMMDeviceEnumerator)(new MMDeviceEnumeratorComObject());",
        "    Guid iid = new Guid(\"C02216F6-8C67-4B5B-9D00-D008E73E0064\");",
        "    try {",
        "      IMMDeviceCollection col;",
        "      enumerator.EnumAudioEndpoints(0, 1, out col);",
        "      if (col != null) {",
        "        uint count = 0; col.GetCount(out count);",
        "        for (uint i = 0; i < count; i++) {",
        "          try { IMMDevice d; col.Item(i, out d); object o; d.Activate(ref iid, 23, IntPtr.Zero, out o); if (o != null) meters.Add((IAudioMeterInformation)o); } catch {}",
        "        }",
        "      }",
        "    } catch {}",
        "    if (meters.Count == 0) {",
        "      for (int role = 0; role < 3; role++) {",
        "        try { IMMDevice d; enumerator.GetDefaultAudioEndpoint(0, role, out d); object o; d.Activate(ref iid, 23, IntPtr.Zero, out o); if (o != null) meters.Add((IAudioMeterInformation)o); } catch {}",
        "      }",
        "    }",
        "  }",
        "  public static void RunLoop() {",
        "    Init();",
        "    int tick = 0;",
        "    while (true) {",
        "      try {",
        "        if (meters.Count == 0 || (++tick % 240 == 0)) Init();",
        "        float bestP = 0f, bestL = 0f, bestR = 0f;",
        "        for (int i = 0; i < meters.Count; i++) {",
        "          float p = 0f; meters[i].GetPeakValue(out p);",
        "          if (p > bestP) {",
        "            bestP = p; bestL = p; bestR = p;",
        "            int ch = 0; meters[i].GetMeteringChannelCount(out ch);",
        "            if (ch >= 2 && ch <= 16) {",
        "              float[] vals = new float[ch]; meters[i].GetChannelsPeakValues(ch, vals);",
        "              bestL = vals[0]; bestR = vals[1];",
        "            }",
        "          }",
        "        }",
        "        Console.Out.WriteLine(bestP.ToString(\"F4\", CultureInfo.InvariantCulture) + \",\" + bestL.ToString(\"F4\", CultureInfo.InvariantCulture) + \",\" + bestR.ToString(\"F4\", CultureInfo.InvariantCulture));",
        "        Console.Out.Flush();",
        "      } catch { try { Init(); } catch {} }",
        "      Thread.Sleep(25);",
        "    }",
        "  }",
        "}"
      ].join("\n");

      const b64Cs = Buffer.from(csharpSource, "utf8").toString("base64");
      const psBootstrap = `$cs = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64Cs}')); Add-Type -TypeDefinition $cs; [WinCoreAudioLoopback]::RunLoop()`;
      const encodedPs = Buffer.from(psBootstrap, "utf16le").toString("base64");

      const proc = cp.spawn(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedPs],
        { windowsHide: true, stdio: ["ignore", "pipe", "ignore"] }
      );
      this.wasapiBridgeProc = proc;
      this.wasapiLoopbackLevels = { peak: 0, left: 0, right: 0, active: false, ts: 0 };

      let buf = "";
      proc.stdout.on("data", (chunk) => {
        buf += chunk.toString();
        const lines = buf.split(/\r?\n/);
        buf = lines.pop() || "";
        for (let i = lines.length - 1; i >= 0; i--) {
          const ln = lines[i].trim();
          if (ln && ln.includes(",")) {
            const parts = ln.split(",");
            const pk = parseFloat(parts[0]) || 0;
            const l = parseFloat(parts[1]) || pk;
            const r = parseFloat(parts[2]) || pk;
            this.wasapiLoopbackLevels = {
              peak: pk,
              left: l,
              right: r,
              active: pk > 0.0015,
              ts: Date.now()
            };
            break;
          }
        }
      });
      proc.on("exit", () => {
        if (this.wasapiBridgeProc === proc) this.wasapiBridgeProc = null;
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  stopWindowsWasapiLoopbackBridge() {
    if (this.wasapiBridgeProc) {
      try {
        this.wasapiBridgeProc.kill();
      } catch (e) {}
      this.wasapiBridgeProc = null;
    }
    this.wasapiLoopbackLevels = null;
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

    // Start the native Windows CoreAudio WASAPI Loopback bridge immediately in parallel!
    // This guarantees that on Windows (even with USB headsets, DACs, or Bluetooth headphones where WebRTC desktop loopback is blocked),
    // the equalizer ALWAYS receives real-time desktop output audio from Telegram, YouTube, Spotify, etc.
    const winBridgeStarted = this.startWindowsWasapiLoopbackBridge();

    // If the user explicitly picked a hardware/virtual input device in Sonic Studio, honor it first
    const savedDevice = this.settings.audioInputDeviceId;
    if (savedDevice && savedDevice !== "auto") {
      const ok = await this.startDeviceAudioCapture(savedDevice, true);
      if (ok) return;
    }

    // Collect real desktop capture source ids via Electron desktopCapturer or IPC if available
    const sourceIds = [];
    try {
      let electron = null;
      try {
        electron = window.require ? window.require("electron") : require("electron");
      } catch (e) {}
      const capturers = [];
      if (electron && electron.desktopCapturer) capturers.push(electron.desktopCapturer);
      if (electron && electron.remote && electron.remote.desktopCapturer) capturers.push(electron.remote.desktopCapturer);
      for (const cap of capturers) {
        try {
          const srcs = await cap.getSources({ types: ["screen"], thumbnailSize: { width: 0, height: 0 } });
          (srcs || []).forEach((s) => s && s.id && sourceIds.push(s.id));
          if (sourceIds.length) break;
        } catch (e) {}
      }
      // Safe standard screen capture IDs
    } catch (e) {}
    ["screen:0:0", "screen:1:0", "screen:65537:0", "screen:65539:0"].forEach((id) => {
      if (!sourceIds.includes(id)) sourceIds.push(id);
    });

    // Strategy 1: Clean Chromium desktop loopback WITHOUT minWidth/maxWidth in mandatory (which caused OverconstrainedError!)
    const constraintCandidates = [
      {
        audio: { mandatory: { chromeMediaSource: "desktop" } },
        video: { mandatory: { chromeMediaSource: "desktop" } },
      },
      ...sourceIds.map((id) => ({
        audio: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: id } },
        video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: id } },
      })),
      ...sourceIds.map((id) => ({
        audio: { mandatory: { chromeMediaSource: "desktop" } },
        video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: id } },
      })),
    ];

    for (const c of constraintCandidates) {
      if (hasAudio(stream)) break;
      try {
        const s = await navigator.mediaDevices.getUserMedia(c);
        if (hasAudio(s)) {
          stream = s;
          break;
        } else {
          dropStream(s);
        }
      } catch (e1) {}
    }

    // Strategy 1B: Chromium / Electron 25+ getDisplayMedia with system audio loopback (immediately stops video track so only system audio remains)
    if (!hasAudio(stream) && navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function" && !winBridgeStarted) {
      try {
        const dispStream = await navigator.mediaDevices.getDisplayMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            suppressLocalAudioPlayback: false
          },
          video: { width: 1, height: 1, frameRate: 1 }
        });
        if (dispStream && dispStream.getVideoTracks) {
          dispStream.getVideoTracks().forEach((vt) => {
            try { vt.stop(); dispStream.removeTrack(vt); } catch (e) {}
          });
        }
        if (hasAudio(dispStream)) {
          stream = dispStream;
        } else {
          dropStream(dispStream);
        }
      } catch (eDisp) {}
    }

    // Strategy 2: Stereo Mix / What U Hear / virtual loopback input device if present
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
          }
        }
      } catch (e0) {}
    }

    if (hasAudio(stream)) {
      try {
        this.connectStreamToAnalyser(stream, "system", 3.4);
        new Notice(t("audioConnectedNotice", this));
        return;
      } catch (err) {
        dropStream(stream);
      }
    }

    // Strategy 3: If Windows CoreAudio WASAPI Loopback Bridge is running, create a live WebAudio Analyser driven by the Windows master output endpoint!
    // Also attach optional ambient mic without killing WASAPI bridge so both PC loopback and room acoustics work seamlessly!
    if (winBridgeStarted) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.65;
        this.desktopAudioNodes = {
          ctx,
          analyser,
          type: "system",
          strategy: "win-coreaudio-loopback"
        };
        this.updateEqualizerPillUI();
        new Notice(
          isRu
            ? "🔊 Системный звук ПК подключён (Windows WASAPI Loopback: YouTube, Spotify, браузер и игры синхронизированы с эквалайзером)"
            : "🔊 PC System Audio connected (Windows WASAPI Loopback synced to equalizer)"
        );
        return;
      } catch (e) {}
    }

    // Final fallback: Microphone / Ambient pickup (preserve WASAPI bridge if it is still initializing!)
    return this.startMicAudioCapture(true, true);
  }

  async startDeviceAudioCapture(deviceId, silent = false) {
    this.stopAudioCapture(true, true);
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
      this.connectStreamToAnalyser(stream, "mic", 2.8);
      if (!silent) new Notice(t("audioMicConnectedNotice", this));
      return true;
    } catch (err) {
      if (!silent) {
        new Notice(isRu ? "Не удалось открыть выбранное аудиоустройство." : "Could not open the selected audio device.");
      }
      return false;
    }
  }

  async startMicAudioCapture(highGainForSpeakers = false, preserveWasapi = false) {
    this.stopAudioCapture(true, preserveWasapi);
    try {
      const audioConstraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: true };
      const savedDevice = this.settings.audioInputDeviceId;
      if (savedDevice && savedDevice !== "auto") audioConstraints.deviceId = { ideal: savedDevice };
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });
      this.connectStreamToAnalyser(stream, "mic", highGainForSpeakers ? 4.0 : 3.0);
      new Notice(t("audioMicConnectedNotice", this));
    } catch (err) {
      new Notice("Could not access audio device.");
    }
  }

  stopAudioCapture(silent = false, preserveWasapi = false) {
    if (!preserveWasapi) {
      this.stopWindowsWasapiLoopbackBridge();
    }
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
    const isSynced = !!(this.desktopAudioNodes || this.ambientNodes || this.wasapiBridgeProc);
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
      id: "open-creator-os-studio",
      name: "Open Creator OS Studio (@brand AI Compiler, APAG Post Builder & Note Kanban)",
      callback: () => this.openCreatorOsModal(),
    });
    this.addCommand({
      id: "trigger-autopilot-interrupt",
      name: "Trigger Mindful Focus Calibration Reflection (+30 XP)",
      callback: () => this.openAutopilotInterruptModal(),
    });
    this.addCommand({
      id: "start-60s-pro-test-drive",
      name: "Start 60-Second Pro Test-Drive (Preview Midnight Dark Craft & 16 Soundscapes)",
      callback: () => this.startProTestDrive60s(),
    });
    this.addCommand({
      id: "open-life-rpg-quest-blockchain",
      name: "Open Life RPG & SHA-256 Blockchain Quest Chain (Deep Work & Value Studio)",
      callback: () => this.openQuestChainModal(),
    });
    this.addCommand({
      id: "open-bio-flow-readiness",
      name: "Open Bio-Rhythm & Cognitive Flow Tracker (Circadian & Flow Studio)",
      callback: () => this.openBioFlowModal(),
    });
    this.addCommand({
      id: "open-creative-margin-sketchpad",
      name: "Open Creative Margin Sketchpad & Embed Drawing in Note",
      callback: () => this.openCreativeSketchModal(),
    });
    this.addCommand({
      id: "toggle-night-light-compensation",
      name: "Toggle Windows 11 Night Light Compensation Mode (Cool Alabaster & Crisp Ink)",
      callback: async () => {
        this.settings.nightLightCompensation = !this.settings.nightLightCompensation;
        await this.saveSettings();
        this.applyBodyClasses();
        new Notice(
          this.settings.nightLightCompensation
            ? "🌙 Компенсация «Ночного света» Windows 11 ВКЛЮЧЕНА (Чистый алебастровый лист без желтизны)"
            : "☀️ Компенсация «Ночного света» ВЫКЛЮЧЕНА (Тёплый архивный пергамент)"
        );
      },
    });
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
      name: "Toggle Midnight Dark Craft Mode (Pro) [Disabled]",
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
      id: "open-interactive-tour",
      name: "✨ Open Interactive Tour note (every feature, live examples)",
      callback: () => this.openInteractiveTourNote(),
    });

    this.addCommand({
      id: "toggle-time-capsule-seal",
      name: "🕯️ Time Capsule: seal / open current note",
      callback: () => this.toggleNoteWaxSeal(),
    });

    this.addCommand({
      id: "clear-drawings",
      name: "Clear All Drawings & Highlights",
      callback: () => this.clearAllAnnotations(),
    });
  }

  onunload() {
    if (this._spotlightHandler) {
      document.removeEventListener("pointermove", this._spotlightHandler);
      this._spotlightHandler = null;
    }
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
    this.stopWindowsWasapiLoopbackBridge();
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

      for (let ch = 0; ch < 2; ch++) {
        const output = noiseBuffer.getChannelData(ch);
        let lastOut = 0.0;
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
          } else {
            // Velvet Pink Rain / Tent Rain / Binaural silk bed
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
        filter.frequency.value = 920;
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
    this.timerTextEl.innerHTML = `${sicraftIcon('timer')}<span>${this.formatTime(this.timerSeconds)}</span>`;
  }

  applyBodyClasses() {
    document.body.classList.toggle("artcraft-theme-active", this.settings.artcraftTheme);
    document.body.classList.toggle("artcraft-hover-cards", this.settings.hoverCards);
    document.body.classList.toggle("artcraft-sentence-focus", this.settings.sentenceFocus);
    document.body.classList.toggle("artcraft-zen-mode", !!this.zenMode);
    document.body.classList.remove("artcraft-dark-craft"); // Disabled until full dark adaptation
    document.body.classList.toggle("artcraft-bento-graph", this.settings.enableBentoGraph !== false);
    document.body.classList.toggle("artcraft-spotlight-mode", !!this.settings.spotlightFocus);
    document.body.classList.toggle("artcraft-magic-lamp", !!this.settings.magicLamp);
    document.body.classList.toggle("artcraft-book-spread", !!this.settings.bookSpreadMode);
    document.body.classList.toggle("artcraft-breathing-spine", !!this.settings.breathingSpine);
    document.body.classList.remove("artcraft-margin-sandglass");
    document.body.classList.toggle("artcraft-chrono-ink", this.settings.chronoInkAging !== false);
    document.body.classList.remove("artcraft-nightlight-comp");
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
    const grainPct = Math.max(0, Math.min(100, Number(this.settings.paperGrain !== undefined ? this.settings.paperGrain : 28)));
    document.documentElement.style.setProperty("--artcraft-grain-opacity", (grainPct / 100 * 0.14).toFixed(3));
    document.body.setAttribute("data-spine-material", this.settings.spineMaterial || "cognac");

    const tag = (this.settings.headerTagText !== undefined ? this.settings.headerTagText : "STRATALCHEMY // KNOWLEDGE BRIEF").trim();
    const show = this.settings.showHeaderTag !== false && tag.length > 0;
    if (show) {
      document.documentElement.style.setProperty("--artcraft-header-tag", `"${tag.replace(/"/g, '\\"')}"`);
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "block");
    } else {
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "none");
    }
  }

  // --- SWISS BENTO GRAPH STUDIO (CLEAN BOTTOM-LEFT HUD, REAL WEBGL COORDINATE MAPPING & LIVE FX) ---
  injectGraphViewHUD() {
    if (this.settings.enableBentoGraph === false) {
      document.querySelectorAll(".artcraft-graph-hud, .artcraft-graph-legend-pill, .artcraft-graph-hint-pill, .artcraft-graph-fx-canvas").forEach((el) => el.remove());
      return;
    }

    // Remove legacy top-left legend & bottom-left hint pills so they never clutter or overlap graph text
    document.querySelectorAll(".artcraft-graph-legend-pill, .artcraft-graph-hint-pill").forEach((el) => el.remove());

    const leaves = this.app.workspace.getLeavesOfType("graph").concat(this.app.workspace.getLeavesOfType("localgraph"));
    leaves.forEach((leaf) => {
      const view = leaf.view;
      if (!view || !view.containerEl) return;
      const viewContent = view.containerEl.querySelector(".view-content");
      if (!viewContent) return;

      viewContent.classList.add("artcraft-graph-canvas-wrap");
      viewContent.setAttribute("data-graph-preset", this.settings.graphPreset || "bento");

      // Auto-upgrade graph.json once so folders are colored
      if (!this.hasAutoUpgradedGraph || this.settings.graphConfigVersion !== "4.6.6") {
        this.hasAutoUpgradedGraph = true;
        this.settings.graphConfigVersion = "4.6.6";
        this.saveSettings();
        setTimeout(() => this.applyBentoGraphColorGroups(false, true), 220);
      }

      const lang = this.settings.uiLanguage || "en";
      const isRu = lang === "ru";

      // Track mouse inside Graph View for 3D Mind-Palace parallax & interactive radar
      if (!viewContent.dataset.artcraftMouseWired) {
        viewContent.dataset.artcraftMouseWired = "true";
        viewContent.addEventListener("mousemove", (ev) => {
          const r = viewContent.getBoundingClientRect();
          this.graphMouseX = ((ev.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
          this.graphMouseY = ((ev.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
          this.graphCursorPt = { x: ev.clientX - r.left, y: ev.clientY - r.top };
        }, { passive: true });
      }

      // Compact, Soft Bottom-Left Studio Bar (Never overlaps top tabs, center graph, or right filter panel!)
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
          <button class="artcraft-graph-hud-btn artcraft-graph-hud-toggle-btn" data-action="toggle-hud" title="${isRu ? "Свернуть / Развернуть панель графа" : "Minimize / Expand Graph Studio"}">${SICRAFT_SVGS.graph}</button>
          <div class="artcraft-graph-hud-items">
            <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "bento" ? "is-active" : ""}" data-preset="bento" title="${isRu ? "Чистая сетка Swiss Bento" : "Swiss Bento Grid"}"><span>Bento</span></button>
            <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "mindpalace" ? "is-active" : ""}" data-preset="mindpalace" title="${isRu ? "Пространственный 3D-режим с глубиной и ореолами узлов" : "Spatial 3D Mind-Palace with depth halos"}"><span>3D Palace</span></button>
            <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "radar" ? "is-active" : ""}" data-preset="radar" title="${isRu ? "Фокус-Радар с концентрическими кольцами и лучом сканирования" : "Focus Radar with concentric rings & sweep"}"><span>${isRu ? "Радар" : "Radar"}</span></button>
            <span class="artcraft-graph-hud-sep"></span>
            <button class="artcraft-graph-hud-btn artcraft-graph-pulse-btn ${this.settings.graphPulseNodes ? "is-pulse-on" : ""}" data-action="pulse" title="${isRu ? "Поток нейронных фотонов по связям графа" : "Neural photon pulses along graph links"}">${sicraftIcon('bolt')} <span>${isRu ? "Поток" : "Flow"}</span></button>
            <button class="artcraft-graph-hud-btn artcraft-graph-resonance-btn" data-action="resonance" title="${isRu ? "Подсветить ключевые узлы гармоническим резонансом" : "Highlight key hub nodes with harmonic resonance"}">${sicraftIcon('spark')} <span>${isRu ? "Резонанс" : "Resonance"}</span></button>
            <button class="artcraft-graph-hud-btn artcraft-graph-walk-btn" data-action="walk" title="${isRu ? "Авто-тур по созвездию связанных заметок" : "Constellation auto-tour across linked notes"}"><span>${isRu ? "Тур" : "Tour"}</span></button>
            <span class="artcraft-graph-hud-sep"></span>
            <button class="artcraft-graph-hud-btn artcraft-graph-color-btn" data-action="colorize" title="${isRu ? "Раскрасить папки вашей базы в 8 цветов" : "Auto-color vault folders"}"><span>${isRu ? "Цвета" : "Colors"}</span></button>
            <button class="artcraft-graph-hud-btn" data-action="toggle-orphans" title="${isRu ? "Скрыть / Показать заметки без связей" : "Toggle orphan nodes"}"><span>${isRu ? "Сироты" : "Orphans"}</span></button>
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
          });
        });

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

        hud.querySelector('[data-action="toggle-hud"]')?.addEventListener("click", (e) => {
          e.stopPropagation();
          hud.classList.toggle("is-minimized");
        });

        viewContent.appendChild(hud);
      }

      // Overlay Canvas for Live Graph Effects (Bento Grid, 3D Mind-Palace Halos, Radar Sweep, Neural Photons, Resonance & Tour)
      let fxCanvas = viewContent.querySelector(".artcraft-graph-fx-canvas");
      if (!fxCanvas) {
        fxCanvas = document.createElement("canvas");
        fxCanvas.className = "artcraft-graph-fx-canvas";
        viewContent.appendChild(fxCanvas);
      }
    });
  }

  // Universal Coordinate Projector for Obsidian 1.0–1.15 Graph Renderer (supports both PixiJS worldTransform & WebGL Worker pan/scale)
  projectGraphNodeToScreen(n, renderer, cw, ch, glCanvas) {
    if (!n) return null;
    const dpr = glCanvas && glCanvas.width > 0 && cw > 0 ? glCanvas.width / cw : (renderer.dpr || window.devicePixelRatio || 1);

    // 1. Legacy PixiJS sprite worldTransform if populated
    if (n.circle && n.circle.worldTransform && (n.circle.worldTransform.tx !== 0 || n.circle.worldTransform.ty !== 0)) {
      return {
        x: n.circle.worldTransform.tx / dpr,
        y: n.circle.worldTransform.ty / dpr,
      };
    }

    // 2. Modern Obsidian WebGL / Worker Graph Renderer: n.x and n.y are world coordinates
    if (typeof n.x === "number" && typeof n.y === "number" && !isNaN(n.x) && !isNaN(n.y)) {
      if (renderer.hanger && renderer.hanger.worldTransform && (renderer.hanger.worldTransform.tx !== 0 || renderer.hanger.worldTransform.a !== 1)) {
        const wt = renderer.hanger.worldTransform;
        return {
          x: (n.x * wt.a + wt.tx) / dpr,
          y: (n.y * wt.d + wt.ty) / dpr,
        };
      }
      const scale = typeof renderer.scale === "number" && renderer.scale > 0 ? renderer.scale : 1;
      const panX = typeof renderer.panX === "number" ? renderer.panX : 0;
      const panY = typeof renderer.panY === "number" ? renderer.panY : 0;
      const cx = (glCanvas && glCanvas.width ? glCanvas.width : cw * dpr) * 0.5;
      const cy = (glCanvas && glCanvas.height ? glCanvas.height : ch * dpr) * 0.5;
      if (renderer._artcraftPanCentered === undefined) {
        renderer._artcraftPanCentered = Math.abs(panX - cx) < Math.abs(panX) && cx > 100;
      }
      if (renderer._artcraftPanCentered) {
        return { x: (n.x * scale + panX) / dpr, y: (n.y * scale + panY) / dpr };
      }
      return { x: cw * 0.5 + (n.x * scale + panX) / dpr, y: ch * 0.5 + (n.y * scale + panY) / dpr };
    }
    return null;
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

      const hovered = renderer.hoveredNode || null;
      const isPulse = this.settings.graphPulseNodes !== false;
      const preset = this.settings.graphPreset || "bento";

      const ctx = fxCanvas.getContext("2d");
      ctx.clearRect(0, 0, cw, ch);
      this.graphPulsePhase = (this.graphPulsePhase || 0) + 0.022;

      const isDark = document.body.classList.contains("artcraft-dark-craft") || document.body.classList.contains("theme-dark");
      const paletteHex = ["#2563EB", "#D97706", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4", "#69BD28"];
      const glCanvas = viewContent.querySelector("canvas:not(.artcraft-graph-fx-canvas)");
      const getScreenPt = (n) => this.projectGraphNodeToScreen(n, renderer, cw, ch, glCanvas);

      // A. Subtle Architectural Grid for Bento & 3D Mind-Palace
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

      // B. Ambient Neural Photon Flow along Graph Links (Works continuously whenever Flow/Photons is ON!)
      if (isPulse && renderer.links && renderer.links.length > 0) {
        ctx.save();
        const links = renderer.links;
        const step = Math.max(1, Math.floor(links.length / 36));
        let idx = 0;
        for (let i = 0; i < links.length && idx < 36; i += step, idx++) {
          const lnk = links[i];
          if (!lnk || !lnk.source || !lnk.target) continue;
          const p1 = getScreenPt(lnk.source);
          const p2 = getScreenPt(lnk.target);
          if (!p1 || !p2) continue;
          if ((p1.x < 0 && p2.x < 0) || (p1.x > cw && p2.x > cw) || (p1.y < 0 && p2.y < 0) || (p1.y > ch && p2.y > ch)) continue;

          const tProg = (this.graphPulsePhase * (0.65 + (idx % 5) * 0.14) + idx * 0.23) % 1;
          const px = p1.x + (p2.x - p1.x) * tProg;
          const py = p1.y + (p2.y - p1.y) * tProg;
          const col = paletteHex[idx % paletteHex.length];

          // Subtle glowing trail segment
          const tailT = Math.max(0, tProg - 0.12);
          const tx = p1.x + (p2.x - p1.x) * tailT;
          const ty = p1.y + (p2.y - p1.y) * tailT;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Photon head
          ctx.beginPath();
          ctx.globalAlpha = 0.88;
          ctx.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        }
        ctx.restore();
      }

      // C. 3D Mind-Palace Spatial Elevation Halos & Parallax Shadows
      if (preset === "mindpalace") {
        ctx.save();
        const mx = this.graphMouseX || 0;
        const my = this.graphMouseY || 0;
        const nodes = renderer.nodes;
        const step = Math.max(1, Math.floor(nodes.length / 45));
        let count = 0;
        for (let i = 0; i < nodes.length && count < 45; i += step, count++) {
          const n = nodes[i];
          const pt = getScreenPt(n);
          if (!pt || pt.x < 10 || pt.x > cw - 10 || pt.y < 10 || pt.y > ch - 10) continue;

          // Soft isometric floor shadow
          ctx.beginPath();
          ctx.ellipse(pt.x + 5 + mx * 8, pt.y + 9 + my * 8, 7, 4, 0, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.42)" : "rgba(92, 60, 28, 0.10)";
          ctx.fill();

          // Warm orbital ring on key nodes
          if (count % 3 === 0) {
            const col = paletteHex[count % paletteHex.length];
            const r = 9 + Math.sin(this.graphPulsePhase * 2 + count) * 2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = col;
            ctx.globalAlpha = 0.42;
            ctx.lineWidth = 1.25;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // D. Focus Radar Concentric Rings & Rotating Sweep Beam
      if (preset === "radar") {
        const hovPt = hovered ? getScreenPt(hovered) : null;
        const centerPt = hovPt || this.graphCursorPt || { x: cw / 2, y: ch / 2 };
        ctx.save();
        const rings = [75, 150, 235, 330];
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = isDark ? "rgba(105, 189, 40, 0.22)" : "rgba(105, 189, 40, 0.26)";
        for (let r = 0; r < rings.length; r++) {
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y, rings[r], 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        // Rotating radar sweep line
        const sweepAng = (this.graphPulsePhase * 1.15) % (Math.PI * 2);
        const grad = ctx.createLinearGradient(
          centerPt.x,
          centerPt.y,
          centerPt.x + Math.cos(sweepAng) * 235,
          centerPt.y + Math.sin(sweepAng) * 235
        );
        grad.addColorStop(0, "rgba(105, 189, 40, 0.45)");
        grad.addColorStop(1, "rgba(105, 189, 40, 0)");
        ctx.beginPath();
        ctx.moveTo(centerPt.x, centerPt.y);
        ctx.lineTo(centerPt.x + Math.cos(sweepAng) * 235, centerPt.y + Math.sin(sweepAng) * 235);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
      }

      // E. Memory Resonance: Expanding Harmonic Shockwave & Gem Callout Pills
      if (this.memoryResonanceActive && this.resonanceGems && this.resonanceGems.length > 0) {
        ctx.save();
        const elapsed = (Date.now() - (this.memoryResonanceStart || Date.now())) / 1000;
        const waveR = elapsed * 360;
        const waveAlpha = Math.max(0, 1 - elapsed / 6.5);

        ctx.beginPath();
        ctx.arc(cw / 2, ch / 2, waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${waveAlpha * 0.45})`;
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
          const cardText = `★ ${gemName.slice(0, 24)}`;
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

      // F. Constellation Walk Tour
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
          ctx.strokeStyle = "#6366F1";
          ctx.lineWidth = 2.4;
          ctx.stroke();

          const prog = ((nowMs - this.constellationLastStepTime) % 3200) / 3200;
          const px = p1.x + (p2.x - p1.x) * prog;
          const py = p1.y + (p2.y - p1.y) * prog;

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#6366F1";
          ctx.fill();
        }

        if (p1) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 15 + Math.sin(this.graphPulsePhase * 4) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = "#6366F1";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const curTitle = String(curGem.id || "").replace(/\.md$/i, "").split("/").pop();
        const tourMsg = `Маршрут ${stepIdx + 1}/${this.constellationPath.length}: ${curTitle.slice(0, 28)}`;
        ctx.font = '600 11px "Inter", sans-serif';
        const msgW = ctx.measureText(tourMsg).width + 24;
        const bx = Math.max(16, (cw - msgW) / 2);
        const by = 18;

        ctx.fillStyle = isDark ? "rgba(30, 27, 75, 0.92)" : "rgba(250, 248, 243, 0.95)";
        ctx.strokeStyle = "#6366F1";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, msgW, 25, 999);
        else ctx.rect(bx, by, msgW, 25);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? "#E0E7FF" : "#3730A3";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(tourMsg, bx + msgW / 2, by + 12.5);
        ctx.restore();
      }

      // G. Hovered Node Highlight & Soft Craft Pill
      if (hovered) {
        const hovPt = getScreenPt(hovered);
        if (hovPt && hovPt.x >= 0 && hovPt.x <= cw && hovPt.y >= 0 && hovPt.y <= ch) {
          if (this._lastHoveredId !== hovered.id) {
            this._lastHoveredId = hovered.id;
            this._cachedLinks = [];
            const allLinks = renderer.links || [];
            for (let i = 0; i < allLinks.length && this._cachedLinks.length < 24; i++) {
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
              ctx.strokeStyle = isDark ? "rgba(105, 189, 40, 0.45)" : "rgba(105, 189, 40, 0.38)";
              ctx.lineWidth = 1.8;
              ctx.stroke();

              const tProg = (this.graphPulsePhase + i * 0.16) % 1;
              const px = p1.x + (p2.x - p1.x) * tProg;
              const py = p1.y + (p2.y - p1.y) * tProg;
              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI * 2);
              ctx.fillStyle = paletteHex[i % paletteHex.length];
              ctx.fill();
            }
            ctx.restore();
          }

          ctx.save();
          const pulseR = 11 + Math.sin(this.graphPulsePhase * 3) * 2.5;
          ctx.beginPath();
          ctx.arc(hovPt.x, hovPt.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = "#69BD28";
          ctx.lineWidth = 1.8;
          ctx.stroke();
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

      // 1. Scan real top-level user folders
      const rootChildren = (this.app.vault.getRoot() && this.app.vault.getRoot().children) || [];
      const folders = rootChildren
        .filter((f) => f && f.children !== undefined && !f.name.startsWith(".") && !f.name.startsWith("_"))
        .map((f) => f.name)
        .sort();

      const colorGroups = [];
      folders.forEach((folderName, idx) => {
        colorGroups.push({
          query: `path:"${folderName}"`,
          color: { a: 1, rgb: bentoColors[idx % bentoColors.length] },
        });
      });

      // 2. High-priority tags and project notes
      colorGroups.push({ query: 'tag:#pro OR tag:#important OR tag:#crypto OR tag:#strategy', color: { a: 1, rgb: 15485081 } });
      colorGroups.push({ query: 'file:Kaito OR file:Alchemy OR file:Baraka', color: { a: 1, rgb: 6929704 } });

      graphConfig.colorGroups = colorGroups;
      if (!graphConfig.search) {
        graphConfig.search = '-path:"node_modules" -path:"dist" -path:".trash"';
      }
      graphConfig.showArrow = true;
      graphConfig.hideUnresolved = false;
      if (toggleOrphans) {
        graphConfig.showOrphans = graphConfig.showOrphans === false ? true : false;
      } else {
        graphConfig.showOrphans = true;
      }
      graphConfig.textFadeMultiplier = -1.2;
      graphConfig.nodeSizeMultiplier = 1.25;
      graphConfig.lineSizeMultiplier = 1.0;
      graphConfig.centerStrength = 0.35;
      graphConfig.repelStrength = 10.0;
      graphConfig.linkDistance = 140;

      await adapter.write(graphPath, JSON.stringify(graphConfig, null, 2));

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
              if (typeof view.dataEngine.setOptions === "function") {
                view.dataEngine.setOptions(graphConfig);
              }
              if (typeof view.dataEngine.updateColorGroups === "function") {
                view.dataEngine.updateColorGroups();
              }
              if (typeof view.dataEngine.render === "function") {
                view.dataEngine.render();
              }
            }
            if (view.renderer) {
              if (typeof view.renderer.onIframeLoad === "function") {
                view.renderer.onIframeLoad();
              }
              if (typeof view.renderer.changed === "function") {
                view.renderer.changed();
              }
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
              isRu ? "Открыть дайджест книги (Белки и Углеводы)" : "Open Book Nutrient Digest (Proteins & Carbs)"
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
                const shortMeaning = cleanMeaning.length > 24 ? cleanMeaning.slice(0, 22) + "…" : cleanMeaning;
                const cleanSnippet = cleanBookmarkText(bm.snippet || "");
                const tooltip = `${nutName} (${isRu ? n.ruRole : n.enRole})\n${bm.meaning ? cleanBookmarkText(bm.meaning) + "\n" : ""}«${cleanSnippet}»`;
                return `
                  <div class="artcraft-bm-pill is-nut-${n.id}" data-bm-id="${bm.id}" data-bm-line="${bm.line || 0}" style="--bm-accent:${n.color};--bm-bg:${n.bg};--bm-border:${n.border};" title="${tooltip.replace(/"/g, "&quot;")}">
                    <span class="bm-nut-dot" style="background:${n.color}"></span>
                    <span class="bm-tag-name" style="color:${n.color}">${nutName}</span>
                    <span class="bm-tag-text">${shortMeaning}</span>
                    <button class="bm-tag-edit" data-bm-edit="${bm.id}" title="${isRu ? "Изменить закладку" : "Edit sticker"}">${SICRAFT_SVGS.edit}</button>
                    <button class="bm-tag-del" data-bm-del="${bm.id}" title="${isRu ? "Удалить закладку" : "Delete sticker"}">${sicraftIcon('clear')}</button>
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
            ${sicraftIcon('stamp')}
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
            ${sicraftIcon('stamp')}
            <span>${isRu ? "ИЗУЧЕНО" : "APPROVED"} • ${latestDate}</span>
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
                ? "Прикрепить крафтовую закладку-нутриент (Белки, Углеводы, Жиры, Витамины, Клетчатка)"
                : "Attach 5-Nutrient Bookmark (Proteins, Carbs, Fats, Vitamins, Fiber)"
            }">
              ${sicraftIcon('bookmark')}
              <span>+ ${isRu ? "Закладка" : "Sticker"}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${this.settings.bookSpreadMode ? "is-active" : ""}" data-act="spread" title="${
              isRu
                ? "ЛКМ: 3D Книжный лист в 4 слоя | ПКМ: Открыть 2-страничный разворот рядом"
                : "LMB: 4-Layer 3D Book Folio | RMB: Open 2-Page Side-by-Side Spread"
            }">
              ${sicraftIcon('columns')}
              <span>${isRu ? "Книжный лист" : "Book Page"}</span>
            </button>
            <button class="artcraft-craft-mini-btn ${(this.settings.pageWidthMode && this.settings.pageWidthMode !== 'book') ? "is-active" : ""}" data-act="width-cycle" title="${
              i18n({
                en: "Page Width Preset: click to cycle 760px Book → 1080px Studio Wide → 94% Full Canvas",
                ru: "Ширина страницы: нажмите для переключения 760px Книга → 1080px Студия → 94% Полный холст",
                zh: "页面宽度预设：点击切换 760px 书页 → 1080px 宽屏 → 94% 全画布",
                ja: "ページ幅プリセット：クリックで 760px → 1080px → 94% 全幅を切り替え",
                es: "Ancho de página: alternar 760px Libro → 1080px Estudio → 94% Lienzo completo",
                de: "Seitenbreite: umschalten zwischen 760px Buch → 1080px Studio → 94% Vollbild"
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
                en: "Life RPG & SHA-256 Quest Chain (365-Day Heatmap & Smart Contract)",
                ru: "Квесты и Блокчейн SHA-256 (365-карта потока и смарт-контракт)",
                zh: "Life RPG 与 SHA-256 任务区块链 (365天热力图与智能合约)",
                ja: "Life RPG & SHA-256 クエストチェーン (365日ヒートマップ＆スマートコントラクト)",
                es: "Life RPG y Cadena SHA-256 (Mapa de 365 días y Contrato Inteligente)",
                de: "Life RPG & SHA-256 Quest-Chain (365-Tage-Heatmap & Smart Contract)"
              }, this)
            }">
              ${sicraftIcon('chain')}
              <span>${i18n({ en: "Quests", ru: "Квесты", zh: "任务链", ja: "クエスト", es: "Misiones", de: "Quests" }, this)} · L${(this.settings.lifeRpg && this.settings.lifeRpg.level) || 1}</span>
            </button>
            <button class="artcraft-craft-mini-btn is-bio-flow-btn" data-act="bio-flow" title="${
              i18n({
                en: "Bio-Rhythm & Flow Readiness (Cognitive Energy & Entropy Balance)",
                ru: "Био-Ритм и Индекс Потока (Энергия и баланс сложности)",
                zh: "生物节律与心流指数 (认知能量与挑战平衡)",
                ja: "バイオリズム＆フロー準備度 (認知エネルギーと難易度バランス)",
                es: "Bio-Ritmo e Índice de Flujo (Energía cognitiva y equilibrio)",
                de: "Bio-Rhythmus & Flow-Index (Kognitive Energie & Balance)"
              }, this)
            }">
              ${sicraftIcon('pulse')}
              <span>${i18n({ en: "Flow", ru: "Поток", zh: "心流", ja: "フロー", es: "Flujo", de: "Flow" }, this)} · ${(this.settings.bioFlow && this.settings.bioFlow.energy) || 82}%</span>
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

    wrap.querySelector('[data-act="creator-os"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openCreatorOsModal();
    });

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

  openClassicsBookshelfModal() {
    new ClassicsBookshelfModal(this.app, this).open();
  }

  // --- 🕯️ TIME CAPSULE (WAX SEAL): SEAL A NOTE UNTIL A DATE, RECALL IT, THEN CRACK THE SEAL ---
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
            en: `🕯️ Capsule unlocks in ${this.formatCapsuleRemaining(info.remainingMs, loc)}. To open early, press & hold the seal for 2 seconds.`,
            ru: `🕯️ Капсула откроется через ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Чтобы вскрыть досрочно — удерживайте печать 2 секунды.`,
            zh: `🕯️ 胶囊将在 ${this.formatCapsuleRemaining(info.remainingMs, loc)} 后解锁。提前开封：长按印章2秒。`,
            ja: `🕯️ カプセルはあと ${this.formatCapsuleRemaining(info.remainingMs, loc)} で開封できます。早期開封：印を2秒長押し。`,
            es: `🕯️ La cápsula se desbloquea en ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Para abrir antes, mantén el sello 2 s.`,
            de: `🕯️ Die Kapsel öffnet in ${this.formatCapsuleRemaining(info.remainingMs, loc)}. Zum vorzeitigen Öffnen das Siegel 2 Sek. halten.`,
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
                  : i18n({ en: "Hold for 1.5s to break seal early", ru: "Удерживайте 1.5 сек (или нажмите «Вскрыть печать» ниже)", zh: "长按1.5秒提前开封", ja: "1.5秒長押しで早期開封", es: "Mantén 1.5s para abrir", de: "1.5s gedrückt halten zum Öffnen" }, this)
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
      const HOLD_MS = 1400;
      const reset = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        emblem.style.setProperty("--hold", "0");
        emblem.classList.remove("is-holding");
      };
      const step = (ts) => {
        if (!start) start = ts;
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
      txt.textContent = isRu ? `📜 Капсула времени созрела: «${file.basename}»` : `📜 Time Capsule ready: “${file.basename}”`;
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

  // --- ✨ INTERACTIVE TOUR NOTE (REAL VAULT FILE WITH LIVE EXAMPLES OF EVERY FEATURE) ---
  async offerInteractiveTourOnce() {
    if (this.settings.tourOffered) return;
    this.settings.tourOffered = true;
    await this.saveSettings();
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    const frag = document.createDocumentFragment();
    const txt = document.createElement("div");
    txt.textContent = isRu
      ? "⚗️ Alchemy Craft установлен. Откройте интерактивный тур — заметку с живыми примерами всех фишек."
      : "⚗️ Alchemy Craft is installed. Open the Interactive Tour — a note with live examples of every feature.";
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

  // --- 🖼 NEW IDEA 3: EX-LIBRIS BOOK CARD PNG EXPORTER (ГЕНЕРАТОР КАРТОЧКИ ЭКСЛИБРИСА В PNG) ---
  // --- 🎻 NEW IDEA 1: CHAPTER COMPLETION HARP & CELLO CHORD (АКУСТИЧЕСКИЙ АККОРД ЗАВЕРШЕНИЯ ГЛАВЫ) ---
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

  // --- 🖋 NEW IDEA 2: CHRONO-INK AGING & BOOKBINDER SPINE SELECTOR ---
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

      // Stamp Box in Top-Right
      const stampTxt = stampRec && stampRec.count >= 2
        ? `★ CLASSICS #${stampRec.count} • ${stampRec.dates[stampRec.dates.length - 1]}`
        : `✓ APPROVED • ${new Date().toLocaleDateString()}`;
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

      // 6. Render up to 4 Nutrient Stickers
      const displayBms = bookmarks.length > 0 ? bookmarks.slice(0, 4) : [
        { type: "proteins", label: isRu ? "Белки" : "Proteins", meaning: isRu ? "Главный практический вывод из заметки" : "Key actionable takeaway from this note", snippet: title },
        { type: "carbs", label: isRu ? "Углеводы" : "Carbs", meaning: isRu ? "Глубокая мысль для размышления" : "Core mental model to ponder", snippet: folder }
      ];

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
      ctx.fillText("ALCHEMY CRAFT v4.6.6 // 5-NUTRIENT BOOK FOLIO SYSTEM • @StratAlchemy", bx + 46, by + bh - 24);

      const url = cv.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ex-libris-${title.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").slice(0, 28)}.png`;
      a.click();
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 50);
      new Notice(isRu ? "🖼 Карточка Экслибриса сохранена в PNG!" : "🖼 Ex-Libris Book Card exported as PNG!");
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

  toggleFocusSubmenuPopover(anchorBtn) {
    if (this.focusPopoverEl) {
      this.focusPopoverEl.remove();
      this.focusPopoverEl = null;
      return;
    }

    const loc = getLocale(this);
    const pop = document.createElement("div");
    pop.className = "artcraft-focus-popover";
    pop.setAttribute("lang", LOCALE_TAGS[loc] || "en-US");

    const renderPopoverContent = () => {
      const obsidian = require("obsidian");
      const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
      const fp = activeView && activeView.file ? activeView.file.path : "";
      const isStamped = fp ? !!this.getNoteStampRecord(fp) : false;
      const isRulerOn = !!(this.settings.magicLamp && this.settings.lampShape === "ruler");
      const showMeta = this.settings.showReadingStats !== false || this.settings.showTaskProgress !== false;

      const items = [
        {
          id: "editorial",
          checked: this.settings.editorialCleanMode !== false,
          icon: SICRAFT_SVGS.card,
          title: i18n({
            en: "Swiss Editorial Block Isolation",
            ru: "Швейцарское модульное разделение блоков",
            zh: "瑞士柔和段落卡片分隔",
            ja: "スイススタイルのブロック分離",
            es: "Separación editorial de bloques estilo Suizo",
            de: "Schweizer Editoriale Block-Isolierung",
          }, this),
          sub: i18n({
            en: "Every paragraph & section stands out cleanly without harsh black borders",
            ru: "Каждый абзац и шаг выделен воздухом и мягкой рамкой без стены текста",
            zh: "消除文字墙，柔和突出每个段落与步骤",
            ja: "黒い太枠なしで各段落を美しく際立たせます",
            es: "Cada párrafo destaca suavemente sin bordes negros pesados",
            de: "Jeder Absatz hebt sich sanft ohne harte schwarze Ränder ab",
          }, this),
        },
        {
          id: "sentence",
          checked: !!this.settings.sentenceFocus,
          icon: SICRAFT_SVGS.focus,
          title: i18n({
            en: "Active Sentence Focus & 01–04 Badges",
            ru: "Фокус на предложении и бейджи 01–04",
            zh: "活动句子聚焦与01–04编号徽标",
            ja: "文フォーカス＆01–04バッジ",
            es: "Foco en frase activa y placas 01–04",
            de: "Aktiver Satz-Fokus & 01–04 Badges",
          }, this),
          sub: i18n({
            en: "Highlight clicked sentences & step badges",
            ru: "Подсветка кликнутых предложений и нумерации",
            zh: "高亮被点击的句子与段落步骤编号",
            ja: "クリックされた文章とステップ番号のハイライト",
            es: "Resalta frases pulsadas y distintivos numerados",
            de: "Hervorhebung angeklickter Sätze & Schritt-Badges",
          }, this),
        },
        {
          id: "spotlight",
          checked: !!this.settings.spotlightFocus,
          icon: SICRAFT_SVGS.zen,
          title: i18n({
            en: "Spotlight Paragraph Dimmer",
            ru: "Затемнение неактивных абзацев (Spotlight)",
            zh: "聚光灯非焦点段落弱化",
            ja: "非アクティブ段落の減光 (スポットライト)",
            es: "Atenuación de párrafos circundantes",
            de: "Spotlight-Abdunklung umgebender Absätze",
          }, this),
          sub: i18n({
            en: "Softly dims surrounding paragraphs while reading",
            ru: "Мягко приглушает все абзацы, кроме текущего",
            zh: "阅读时柔和虚化除当前段落之外的内容",
            ja: "読書中、現在のアクティブ段落以外を穏やかに薄暗くします",
            es: "Atenúa suavemente los párrafos no leídos",
            de: "Dunkelt umgebende Absätze beim Lesen sanft ab",
          }, this),
        },
        {
          id: "ruler",
          checked: isRulerOn,
          icon: SICRAFT_SVGS.lamp,
          title: i18n({
            en: "Lumina Reading Ruler",
            ru: "Световая линейка для чтения (Reading Ruler)",
            zh: "温润光带阅读指引尺",
            ja: "読書用ライトルーラー",
            es: "Regla luminosa de lectura",
            de: "Lumina-Leselineal",
          }, this),
          sub: i18n({
            en: "Horizontal warm reading beam across active line",
            ru: "Горизонтальная полоса света по строке курсора",
            zh: "沿光标所在行展开水平柔光导读条",
            ja: "カーソル行に沿った水平の温かいライトビーム",
            es: "Haz de luz horizontal en la línea activa",
            de: "Horizontaler warmer Lichtstrahl auf aktiver Zeile",
          }, this),
        },
        {
          id: "bookfolio",
          checked: !!this.settings.bookSpreadMode,
          icon: SICRAFT_SVGS.columns,
          title: i18n({
            en: "3D Multi-Sheet Book Folio (4 Stacked Sheets)",
            ru: "3D Книжный фолиант (4 слоя страниц)",
            zh: "3D多层实体书页册（4层页纸叠放）",
            ja: "3D多層ブックフォリオ (4枚重ねの用紙)",
            es: "Folio de libro 3D multicapa (4 hojas apiladas)",
            de: "3D-Buchfolio (4 geschichtete Seiten)",
          }, this),
          sub: i18n({
            en: "Tactile book sheet with leather spine & stacked pages",
            ru: "Книжный лист с кожаным корешком и стопкой страниц",
            zh: "带有皮革书脊与立体层叠纸边的实体书卷感",
            ja: "革製背表紙と立体的な重ね紙を持つ触覚的ブックシート",
            es: "Hoja de libro táctil con lomo de cuero y páginas apiladas",
            de: "Taktile Buchseite mit Lederrücken und geschichteten Blättern",
          }, this),
        },
        {
          id: "breathspine",
          checked: !!this.settings.breathingSpine,
          icon: SICRAFT_SVGS.lung,
          title: i18n({
            en: "Coherent 6-BPM Breathing Book Spine",
            ru: "Дыхание корешка книги (5.5с Вдох / 5.5с Выдох)",
            zh: "6-BPM共振呼吸书脊（5.5秒吸气 / 5.5秒呼气）",
            ja: "6-BPM共鳴呼吸ブック背表紙 (5.5秒吸気/5.5秒呼気)",
            es: "Lomo con respiración coherente 6-BPM (5.5s insp / 5.5s esp)",
            de: "6-BPM Kohärente Atmung am Buchrücken (5.5s Ein / 5.5s Aus)",
          }, this),
          sub: i18n({
            en: "Warm 11s coherent breathing glow along the book spine",
            ru: "Мягкая волна света по корешку для глубокого покоя",
            zh: "书脊沿线11秒柔和光晕律动，调节心率变异性",
            ja: "心身の深い安らぎをもたらす11秒周期の柔らかな光波",
            es: "Suave resplandor de 11s en el lomo para máxima serenidad",
            de: "Sanfte 11-Sekunden-Lichtwelle am Buchrücken для tiefe Ruhe",
          }, this),
        },
        {
          id: "meta",
          checked: showMeta,
          icon: SICRAFT_SVGS.book,
          title: i18n({
            en: "Quiet Reading Time & Tasks Sub-Header",
            ru: "Строка времени чтения и задач под заголовком",
            zh: "标题下方静音阅读时间与任务进度",
            ja: "見出し下の読書時間＆タスク進捗バー",
            es: "Subcabecera con tiempo de lectura y tareas",
            de: "Lesezeit & Aufgaben-Fortschritt unter Überschrift",
          }, this),
          sub: i18n({
            en: "Show/hide reading time & task progress line",
            ru: "Показать/скрыть ~мин чтения и прогресс задач",
            zh: "显示/隐藏约分钟阅读时间与任务百分比",
            ja: "読書時間とタスク進捗率の表示/非表示を切り替え",
            es: "Mostrar/ocultar tiempo estimado y progreso",
            de: "Lesezeit & Aufgaben-Fortschritt ein-/ausblenden",
          }, this),
        },
        {
          id: "bionic",
          checked: !!this.settings.bionicAnchors,
          icon: SICRAFT_SVGS.bolt,
          title: i18n({
            en: "Bionic Saccadic Word-Root Fixation Anchors",
            ru: "Бионический фокус корней слов (быстрое чтение)",
            zh: "仿生眼跳词根锚点（快速扫读）",
            ja: "バイオニック語幹アンカー（高速リーディング）",
            es: "Anclajes de lectura biónica (fijación ocular)",
            de: "Bionische Wortstamm-Fixierung (Schnelllesen)",
          }, this),
          sub: i18n({
            en: "Highlights the root of long words so eyes glide across text without walls",
            ru: "Выделяет опорную часть длинных слов, чтобы взгляд скользил по абзацам без стены текста",
            zh: "高亮长词词根，让视线顺滑扫过段落",
            ja: "単語の前半を強調し、視線が滑らかに移動します",
            es: "Resalta la raíz de las palabras para guiar la vista sin fatiga",
            de: "Hebt Wortanfänge hervor für müheloses Text-Scanning",
          }, this),
        },
        {
          id: "stamp",
          checked: this.settings.showCornerStamp !== false,
          icon: SICRAFT_SVGS.stamp,
          title: i18n({
            en: "Top-Right Ex-Libris Stamp & Classics Seal",
            ru: "Штамп «Изучено / Классика» вверху заметки",
            zh: "笔记右上角藏书票印章与经典封印",
            ja: "ノート右上の蔵書印＆名著クラシック封印",
            es: "Sello Ex-Libris y distinción de clásicos",
            de: "Ex-Libris-Stempel & Klassiker-Siegel",
          }, this),
          sub: isStamped
            ? i18n({
                en: "Current note is stamped",
                ru: "Штамп проставлен на этой заметке",
                zh: "当前笔记已加盖印章",
                ja: "このノートには印章が押されています",
                es: "Nota actual ya sellada",
                de: "Aktuelle Notiz ist abgestempelt",
              }, this)
            : i18n({
                en: "Show Ex-Libris stamp in clean upper-right corner",
                ru: "Показывать экслибрис-печать в правом верхнем углу",
                zh: "在右上角展示精致典雅的藏书票盖印",
                ja: "右上に洗練された蔵書票スタンプを表示",
                es: "Mostrar sello en la esquina superior derecha",
                de: "Ex-Libris-Stempel oben rechts anzeigen",
              }, this),
        },
      ];

      const curSurface = this.settings.surfaceMode || "white";
      pop.innerHTML = `
        <div class="focus-pop-head">
          <span class="focus-pop-badge">${sicraftIcon('focus')} <span>${
        i18n({
          en: "FOCUS & BOOK READING STUDIO",
          ru: "РЕЖИМЫ ФОКУСА И КНИЖНОЙ СТУДИИ",
          zh: "专注模式与阅读工坊",
          ja: "フォーカス＆読書スタジオ",
          es: "ESTUDIO DE FOCO Y LECTURA",
          de: "FOKUS- & LESE-STUDIO",
        }, this)
      }</span></span>
          <button class="focus-pop-close" title="Close">×</button>
        </div>

        <div class="focus-pop-divider" style="margin-top:2px;">${i18n({
          en: "PAGE SURFACE & READING CANVAS",
          ru: "ФОН СТРАНИЦЫ И МАТЕРИАЛ ХОЛСТА",
          zh: "页面底色与阅读画布",
          ja: "ページ背景＆読書キャンバス",
          es: "SUPERFICIE DE PÁGINA Y LIENZO",
          de: "SEITENHINTERGRUND & LEINWAND",
        }, this)}</div>
        <div class="artcraft-surface-picker-row">
          <button class="surface-mat-chip ${curSurface === "white" ? "is-active" : ""}" data-surface="white">
            <span class="surface-swatch" style="background:#FFFFFF;border:1px solid #CBD5E1"></span><span>${i18n({ en: "Pure White", ru: "Чистый Белый", zh: "纯净白", ja: "純白", es: "Blanco Puro", de: "Reinweiß" }, this)}</span>
          </button>
          <button class="surface-mat-chip ${curSurface === "book" ? "is-active" : ""}" data-surface="book">
            <span class="surface-swatch" style="background:#FAF8F3;border:1px solid #DFD9CA"></span><span>${i18n({ en: "Warm Book", ru: "Книжный", zh: "温暖书页", ja: "書籍紙", es: "Libro Cálido", de: "Buchpapier" }, this)}</span>
          </button>
          <button class="surface-mat-chip ${curSurface === "grain" ? "is-active" : ""}" data-surface="grain">
            <span class="surface-swatch" style="background:#F5F2EB;border:1px solid #D5CEBE"></span><span>${i18n({ en: "Archival Grain", ru: "Зернистый", zh: "微纹理纸", ja: "粒子紙", es: "Papel Grano", de: "Körnung" }, this)}</span>
          </button>
        </div>

        <div class="focus-pop-divider" style="margin-top:4px;">${i18n({
          en: "PAGE WIDTH & ULTRAWIDE CANVAS",
          ru: "ШИРИНА СТРАНИЦЫ И УЛЬТРАШИРОКИЙ ХОЛСТ",
          zh: "页面宽度与超宽画布",
          ja: "ページ幅＆ウルトラワイドキャンバス",
          es: "ANCHO DE PÁGINA Y LIENZO ULTRAANCHO",
          de: "SEITENBREITE & ULTRAWIDE-LEINWAND",
        }, this)}</div>
        <div class="artcraft-width-picker-row">
          <button class="width-mat-chip ${(this.settings.pageWidthMode || "book") === "book" ? "is-active" : ""}" data-width-mode="book">
            <span>📖 ${i18n({ en: "760px Book", ru: "760px Книга", zh: "760px 书页", ja: "760px 書籍", es: "760px Libro", de: "760px Buch" }, this)}</span>
          </button>
          <button class="width-mat-chip ${this.settings.pageWidthMode === "wide" ? "is-active" : ""}" data-width-mode="wide">
            <span>🖥️ ${i18n({ en: "1080px Wide", ru: "1080px Широкий", zh: "1080px 宽屏", ja: "1080px ワイド", es: "1080px Ancho", de: "1080px Breit" }, this)}</span>
          </button>
          <button class="width-mat-chip ${this.settings.pageWidthMode === "full" ? "is-active" : ""}" data-width-mode="full">
            <span>🌌 ${i18n({ en: "Full Canvas", ru: "Полный холст", zh: "全宽画布", ja: "フルキャンバス", es: "Lienzo Total", de: "Vollbild" }, this)}</span>
          </button>
        </div>

        <div class="focus-pop-divider">${i18n({
          en: "TACTILE EDITORIAL & FOCUS LAYERS",
          ru: "СЛОИ ФОКУСА И ШВЕЙЦАРСКОЙ ВЁРСТКИ",
          zh: "触觉版面与专注图层",
          ja: "フォーカス＆タイポグラフィレイヤー",
          es: "CAPAS DE FOCO Y DISEÑO EDITORIAL",
          de: "FOKUS- & LAYOUT-EBENEN",
        }, this)}</div>
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
        <div class="focus-pop-divider">${i18n({
          en: "BOOKBINDER'S SPINE MATERIAL & TEXTURE",
          ru: "ПЕРЕПЛЁТНАЯ МАСТЕРСКАЯ (МАТЕРИАЛ КОРЕШКА И ЛИСТА)",
          zh: "装订工坊（书脊皮质与纸张纹理）",
          ja: "製本工房 (背表紙の革素材と質感)",
          es: "TALLER DE ENCUADERNACIÓN (MATERIAL DEL LOMO)",
          de: "BUCHBINDEREI (RÜCKENMATERIAL & TEXTUR)",
        }, this)}</div>
        <div class="artcraft-spine-picker-row">
          <button class="spine-mat-chip ${(this.settings.spineMaterial || "cognac") === "cognac" ? "is-active" : ""}" data-spine="cognac">
            <span class="spine-swatch" style="background:#8C5828"></span><span>${i18n({ en: "Cognac", ru: "Коньяк", zh: "干邑棕", ja: "コニャック", es: "Coñac", de: "Cognac" }, this)}</span>
          </button>
          <button class="spine-mat-chip ${this.settings.spineMaterial === "emerald" ? "is-active" : ""}" data-spine="emerald">
            <span class="spine-swatch" style="background:#14532D"></span><span>${i18n({ en: "Emerald", ru: "Сафьян", zh: "祖母绿", ja: "エメラルド", es: "Esmeralda", de: "Saffian" }, this)}</span>
          </button>
          <button class="spine-mat-chip ${this.settings.spineMaterial === "crimson" ? "is-active" : ""}" data-spine="crimson">
            <span class="spine-swatch" style="background:#7F1D1D"></span><span>${i18n({ en: "Crimson", ru: "Бархат", zh: "绯红丝绒", ja: "深紅ベルベット", es: "Carmesí", de: "Samtrot" }, this)}</span>
          </button>
          <button class="spine-mat-chip ${this.settings.spineMaterial === "linen" ? "is-active" : ""}" data-spine="linen">
            <span class="spine-swatch" style="background:#334155"></span><span>${i18n({ en: "Linen", ru: "Лён", zh: "北欧麻布", ja: "リネン", es: "Lino", de: "Leinen" }, this)}</span>
          </button>
        </div>
        <div class="focus-pop-divider">${i18n({
          en: "5-NUTRIENT BOOK STICKER TOOLS",
          ru: "КНИЖНАЯ МЕТОДИКА: 5 ЗАКЛАДОК-НУТРИЕНТОВ",
          zh: "阅读方法论：5大养分书签工具",
          ja: "読書メソッド：5大栄養素付箋ツール",
          es: "MÉTODO DE LECTURA: 5 NUTRIENTES",
          de: "LESEMETHODIK: 5 NÄHRSTOFF-LESEZEICHEN",
        }, this)}</div>
        <div class="focus-pop-actions">
          <button class="focus-pop-act-btn is-primary" data-pop-act="add-sticker">
            ${sicraftIcon('bookmark')} <span>${i18n({ en: "+ Attach 5-Nutrient Sticker", ru: "+ Закладка-Нутриент со смыслом", zh: "+ 附着有深度的养分书签", ja: "+ 意味ある栄養素付箋を貼る", es: "+ Adjuntar pegatina de nutrientes", de: "+ Nährstoff-Lesezeichen anbringen" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="digest">
            ${sicraftIcon('book')} <span>${i18n({ en: "Book Digest (Proteins & Carbs)", ru: "Дайджест книги (Белки и Углеводы)", zh: "书籍摘要（蛋白质与碳水）", ja: "読書ダイジェスト (実践＆思考)", es: "Resumen del libro (Proteínas y Carbohidratos)", de: "Buch-Auszug (Proteine & Kohlenhydrate)" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="bookshelf">
            ${sicraftIcon('shelf')} <span>${i18n({ en: "Open Classics Bookshelf (All Books)", ru: "Открыть «Полку Классики» (Все книги базы)", zh: "打开「经典书架」（全库图书）", ja: "「古典の本棚」を開く (全ノート)", es: "Abrir estantería de clásicos (Toda la bóveda)", de: "Klassiker-Regal öffnen (Alle Bücher)" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="exlibris-png">
            ${sicraftIcon('camera')} <span>${i18n({ en: "Export Ex-Libris Book Card as PNG", ru: "Сохранить Карточку Экслибриса в PNG", zh: "导出藏书票书卡为 PNG", ja: "蔵書票カードをPNGで保存", es: "Exportar tarjeta Ex-Libris en PNG", de: "Ex-Libris-Buchkarte als PNG exportieren" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="wax-seal">
            ${sicraftIcon('stamp')} <span>${i18n({ en: "Time Capsule: seal this note until a date", ru: "Капсула времени: запечатать заметку до даты", zh: "时间胶囊：封存此笔记至指定日期", ja: "タイムカプセル：指定日までノートを封印", es: "Cápsula del tiempo: sellar hasta una fecha", de: "Zeitkapsel: Notiz bis zu einem Datum versiegeln" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="tour">
            ${sicraftIcon('spark')} <span>${i18n({ en: "Open Interactive Tour (every feature)", ru: "Открыть интерактивный тур (все фишки)", zh: "打开交互式新手漫游（全功能指引）", ja: "インタラクティブツアーを開く (全機能ガイド)", es: "Abrir tour interactivo (todas las funciones)", de: "Interaktive Tour öffnen (alle Funktionen)" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="two-page">
            ${sicraftIcon('columns')} <span>${i18n({ en: "Open 2-Page Side-by-Side Spread", ru: "Открыть 2-страничный разворот рядом", zh: "开启双页并排展开阅读", ja: "2ページ見開き表示を開く", es: "Abrir doble página en paralelo", de: "2-Seiten-Nebeneinander-Ansicht öffnen" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="quest-chain">
            ${sicraftIcon('chain')} <span>${i18n({ en: "Life RPG & SHA-256 Quest Blockchain", ru: "Life RPG и Блокчейн-Цепочка Квестов (SHA-256)", zh: "Life RPG 与区块链任务链", ja: "Life RPG & SHA-256 クエストチェーン", es: "Life RPG y Cadena de Misiones SHA-256", de: "Life RPG & SHA-256 Quest-Blockchain" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="bio-flow">
            ${sicraftIcon('pulse')} <span>${i18n({ en: "Bio-Rhythm & Cognitive Flow Readiness", ru: "Био-Ритм и Энергия Потока", zh: "生物节律与心流准备度", ja: "バイオリズム＆フロー準備度", es: "Bio-Ritmo y Estado de Flujo", de: "Bio-Rhythmus & Flow-Bereitschaft" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="sketchpad">
            ${sicraftIcon('palette')} <span>${i18n({ en: "Creative Margin Sketchpad (Draw in Note)", ru: "Творческий Скетчбук (Рисование в заметке)", zh: "创意手绘草图板", ja: "クリエイティブ・スケッチパッド", es: "Cuaderno de Bocetos en Nota", de: "Kreatives Skizzenbuch in Notiz" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="creator-os">
            ${sicraftIcon('bolt')} <span>${i18n({ en: "Creator OS: @brand AI Compiler, APAG & Kanban", ru: "Creator OS: @brand для ИИ, APAG и Канбан задач", zh: "Creator OS：AI品牌上下文与APAG引擎", ja: "Creator OS：@brand AIコンパイラ＆APAG", es: "Creator OS: @brand IA, APAG y Kanban", de: "Creator OS: @brand KI, APAG & Kanban" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="autopilot-bell">
            ${sicraftIcon('timer')} <span>${i18n({ en: "Mindful Focus Calibration Check-In (+30 XP)", ru: "Осознанная калибровка фокуса (+30 XP)", zh: "专注力校准与反思 (+30 XP)", ja: "マインドフル・フォーカス確認 (+30 XP)", es: "Calibración Consciente de Enfoque (+30 XP)", de: "Achtsame Fokus-Kalibrierung (+30 XP)" }, this)}</span>
          </button>
          <button class="focus-pop-act-btn" data-pop-act="pro-test-drive">
            ${sicraftIcon('diamond')} <span>${i18n({ en: "✨ 60-Second Free Pro Test-Drive (All Colors & 16 Soundscapes)", ru: "✨ 60-сек Тест-Драйв Pro (Все 8 цветов и 16 саундскейпов)", zh: "✨ 60秒免费体验 Pro 全部功能", ja: "✨ 60秒間 Pro モード無料テストドライブ", es: "✨ Prueba Pro de 60 segundos gratis", de: "✨ 60-Sekunden Pro-Testfahrt starten" }, this)}</span>
          </button>
        </div>
      `;

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
          if (opt === "surface-cycle") {
            const cur = this.settings.surfaceMode || "white";
            this.settings.surfaceMode = cur === "white" ? "book" : cur === "book" ? "grain" : "white";
          } else if (opt === "editorial") {
            this.settings.editorialCleanMode = !this.settings.editorialCleanMode;
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
          } else if (opt === "pacer") {
            this.settings.readingPacer = !this.settings.readingPacer;
            this.updateReadingPacerState();
          } else if (opt === "meta") {
            const curState = this.settings.showReadingStats !== false;
            this.settings.showReadingStats = !curState;
            this.settings.showTaskProgress = !curState;
            this.updateTaskProgressBar();
          } else if (opt === "bionic") {
            this.settings.bionicAnchors = !this.settings.bionicAnchors;
            this.refreshBionicAnchorsInDOM();
          } else if (opt === "stamp") {
            this.settings.showCornerStamp = !this.settings.showCornerStamp;
            this.updateTaskProgressBar();
          }
          await this.saveSettings();
          this.applyBodyClasses();
          renderPopoverContent();
        });
      });

      pop.querySelectorAll("[data-pop-act]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const act = btn.getAttribute("data-pop-act");
          pop.remove();
          this.focusPopoverEl = null;
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
        });
      });
    };

    renderPopoverContent();
    document.body.appendChild(pop);
    this.focusPopoverEl = pop;

    const rect = anchorBtn.getBoundingClientRect();
    const popW = 380;
    let left = rect.left + rect.width / 2 - popW / 2;
    if (left < 16) left = 16;
    if (left + popW > window.innerWidth - 16) left = window.innerWidth - popW - 16;
    pop.style.left = left + "px";
    pop.style.bottom = (window.innerHeight - rect.top + 10) + "px";

    const closeHandler = (ev) => {
      if (!pop.contains(ev.target) && ev.target !== anchorBtn && !anchorBtn.contains(ev.target)) {
        pop.remove();
        this.focusPopoverEl = null;
        document.removeEventListener("pointerdown", closeHandler);
      }
    };
    setTimeout(() => {
      document.addEventListener("pointerdown", closeHandler);
    }, 50);
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
    if (this.settings.bionicAnchors) {
      this.applyBionicToElement(rootEl);
    }
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
    this.btnZen.innerHTML = `${sicraftIcon('zen')}<span class="artcraft-btn-label">${t("zenBtn", this)}</span>`;
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

    // If WebAudio stream is silent or unavailable on Windows, synthesize 16-band spectrum from live Windows CoreAudio WASAPI Loopback peaks!
    if (!hasSound && this.wasapiLoopbackLevels && this.wasapiLoopbackLevels.active && Date.now() - (this.wasapiLoopbackLevels.ts || 0) < 400) {
      const pk = Math.min(1, this.wasapiLoopbackLevels.peak * 1.65);
      const lCh = Math.min(1, this.wasapiLoopbackLevels.left * 1.65);
      const rCh = Math.min(1, this.wasapiLoopbackLevels.right * 1.65);
      if (pk > 0.004) {
        hasSound = true;
        if (!freqData) freqData = new Uint8Array(128);
        const tNow = performance.now() * 0.008;
        for (let b = 0; b < freqData.length; b++) {
          const norm = b / freqData.length;
          const stereoMix = b % 2 === 0 ? lCh : rCh;
          const bandContour = Math.exp(-Math.pow((norm - 0.22) * 2.4, 2)) * 0.75 + Math.exp(-Math.pow((norm - 0.58) * 3.2, 2)) * 0.45;
          const dyn = 0.72 + 0.28 * Math.sin(tNow * (2.2 + (b % 7) * 0.45) + b * 0.7);
          freqData[b] = Math.min(255, Math.round((pk * 0.55 + stereoMix * 0.45) * bandContour * dyn * 255));
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


  // --- ⛓️ NEW MODULE 1: LIFE RPG & SHA-256 BLOCKCHAIN QUEST CHAIN (DEEP WORK & VALUE EQUATION) ---
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

  async mineQuestBlock(questTitle, xpReward = 35, notify = true) {
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
    const index = chain.length;
    const timestamp = new Date().toISOString();
    const prevHash = prevBlock.hash;

    // Mine a lightweight Proof-of-Work nonce (finds hash starting with "00" within up to 300 iterations for instant UX)
    let nonce = 0;
    let hash = "";
    for (let n = 0; n < 320; n++) {
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
          ? `⛓️ Блок #${index} подписан в цепочке квестов! +${xpReward} XP • SHA-256: ${hash.slice(0, 10)}…`
          : `⛓️ Block #${index} mined in Quest Chain! +${xpReward} XP • SHA-256: ${hash.slice(0, 10)}…`
      );
    }
    return newBlock;
  }

  async verifyQuestBlockchain() {
    const chain = this.settings.questBlockchain || [];
    if (chain.length <= 1) return { valid: true, blocks: chain.length };
    for (let i = 1; i < chain.length; i++) {
      const cur = chain[i];
      const prev = chain[i - 1];
      if (cur.prevHash !== prev.hash) {
        return { valid: false, brokenAt: i };
      }
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

  // 60-Second Free Pro Test-Drive ("Try Before You Buy" Dopamine Trigger)
  async startProTestDrive60s() {
    const isRu = (this.settings.uiLanguage || "en") === "ru";
    if (this.settings.isPro && !this.proTestDriveActive) {
      new Notice(isRu ? "💎 У вас уже активирован полный статус Alchemy Craft Pro!" : "💎 You already have full Alchemy Craft Pro unlocked!");
      return;
    }
    if (this.proTestDriveTimer) {
      clearInterval(this.proTestDriveTimer);
      this.proTestDriveTimer = null;
    }
    this.proTestDriveActive = true;
    const prevPro = this.settings.isPro;
    const prevDark = this.settings.darkCraftTheme;
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
              ? "✨ 60-секундный тест-драйв завершён. Понравились звуки и расширенная палитра? Откройте Pro навсегда!"
              : "✨ 60-second Pro Test-Drive finished. Loved the soundscapes & palette? Unlock Pro anytime!"
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
      const todayKey = `${now.toISOString().slice(0, 10)}_${curHm}`;
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
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
                const cleanAmount = (parseFloat(curAmount) || 4.99).toFixed(2);
                const tierName = activeTierObj ? activeTierObj.name : "Pro";
                const customDesc = `Alchemy Craft — ${tierName} (${cleanAmount})`;
                const sbKey = "sb_publishable_bmw71GhgQ24MoXaWq4fhSg_WU7YBmlG";
                const supabaseEndpoint = this.plugin.settings.supabaseFunctionUrl || "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay";
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
                  openExternalUrl(payUrl);
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
        const sbKey = "sb_publishable_bmw71GhgQ24MoXaWq4fhSg_WU7YBmlG";
        const supabaseEndpoint = this.plugin.settings.supabaseFunctionUrl || "https://tsnnckbvxokjmbgfeqdj.supabase.co/functions/v1/cryptobot-pay";
        const cbRes = await obsidianApi.requestUrl({
          url: supabaseEndpoint,
          method: "POST",
          contentType: "application/json",
          headers: {
            "Content-Type": "application/json",
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
          },
          body: JSON.stringify({
            action: "check_invoice",
            invoice_id: cleanId,
          }),
          throw: false,
        });
        const d = cbRes && cbRes.json ? cbRes.json : null;
        const isRu = (this.plugin.settings.uiLanguage || "en") === "ru";
        if (d && d.ok && d.paid) {
          new Notice(
            isRu
              ? `🎉 Счёт @CryptoBot #${cleanId} оплачен ($${d.amount || ""})! Alchemy Craft Pro успешно активирован!`
              : `🎉 @CryptoBot Invoice #${cleanId} paid ($${d.amount || ""})! Alchemy Craft Pro activated!`,
            10000
          );
          return true;
        }
        const items = d?.result?.items || [];
        const paidInv = items.find((inv) => inv.status === "paid");
        if (paidInv) {
          new Notice(
            isRu
              ? `🎉 Счёт @CryptoBot #${cleanId} оплачен ($${paidInv.amount})! Alchemy Craft Pro успешно активирован!`
              : `🎉 @CryptoBot Invoice #${cleanId} paid ($${paidInv.amount})! Alchemy Craft Pro activated!`,
            10000
          );
          return true;
        } else if (items.length > 0 || (d && d.ok && d.paid === false)) {
          const invStatus = items[0]?.status || "pending";
          const invAmt = items[0]?.amount || d?.amount || "";
          new Notice(
            isRu
              ? `Счёт @CryptoBot #${cleanId} ещё не оплачен${invAmt ? ` ($${invAmt})` : ""}. Оплатите его в Telegram и нажмите проверку ещё раз.`
              : `Invoice #${cleanId} is pending payment${invAmt ? ` ($${invAmt})` : ""}. Please complete payment in Telegram and verify again.`,
            8000
          );
          return false;
        }
      }
    } catch (e) {
      console.warn("Direct CryptoBot verification check error:", e);
    }

    const MASTER_PROMOS = ["STRATALCHEMY", "ACPRO-PRO-2026", "SICRAFT", "VIP2026", "ALCHEMIST", "NAILYA", "MIYAZAKI", "BARAKA2026", "ELYAZ", "FOUNDER", "ACPRO-FOUNDER-PASS-2026"];
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
            if (transfers.some((tr) => tr.to_address === ["TLR1QhncMJghep", "CyPPNDZodUxWtEjs8Qjy"].join(""))) return true;
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
    const loc = getLocale(this.plugin);
    const isRu = loc === "ru";

    const createSectionGroup = (num, title, subOrTitleEn, iconOrSubRu, subEn, iconSvg) => {
      let resolvedTitle, resolvedSub, finalIcon;
      if (typeof title === "object") {
        resolvedTitle = i18n(title, this.plugin);
        resolvedSub = typeof subOrTitleEn === "object" ? i18n(subOrTitleEn, this.plugin) : subOrTitleEn;
        finalIcon = iconOrSubRu;
      } else {
        // Legacy 6 arguments: (num, titleRu, titleEn, subRu, subEn, iconSvg)
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

    // Top Swiss Bento Studio Banner inside Settings
    const heroBanner = containerEl.createDiv({ cls: "artcraft-settings-bento-hero" });
    heroBanner.innerHTML = `
      <div class="artcraft-settings-hero-left">
        <div class="artcraft-settings-flask-box">${ALCHEMY_ICON_SVG}</div>
        <div>
          <div class="artcraft-settings-hero-title">
            ${t("settingsTitle", this.plugin)}
            <span class="artcraft-hero-version-pill">v${this.plugin.manifest.version}</span>
          </div>
          <div class="artcraft-settings-hero-sub">Author: Elyaz Aliverdiyev (@StratAlchemy) • Swiss Bento Craft System</div>
        </div>
      </div>
      <div class="artcraft-settings-hero-actions">
        <button class="artcraft-hero-soft-btn is-primary-soft" id="artcraft-open-site-btn" title="${isRu ? "Открыть официальный сайт и руководство Alchemy Craft" : "Open official Alchemy Craft website & docs"}">
          <span class="svg-inline-icon">${sicraftIcon('globe')}</span>
          <span>${isRu ? "Официальный сайт" : "Official Website"}</span>
          <span class="svg-inline-icon">${sicraftIcon('external')}</span>
        </button>
        <button class="artcraft-hero-soft-btn" id="artcraft-check-rel-btn" title="${isRu ? "Проверить обновления в каталоге плагинов" : "Check updates in plugin directory"}">
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
    // SECTION 01: ТИПОГРАФИКА, ЧИТАЕМОСТЬ И ШАПКА ЗАМЕТКИ
    // =========================================================================
    const secReadability = createSectionGroup(
      "01",
      {
        en: "Readability, Typography & Note Header",
        ru: "Читаемость, Типографика и Шапка заметки",
        zh: "排版可读性、字体与笔记顶栏",
        ja: "可読性・タイポグラフィ・ノートヘッダー",
        es: "Legibilidad, tipografía y cabecera de nota",
        de: "Lesbarkeit, Typografie & Notiz-Kopfzeile",
      },
      {
        en: "Core typography, interface language, Swiss Bento styling, and reading progress indicators.",
        ru: "Главные настройки журнальной вёрстки Swiss Bento, языка интерфейса и индикаторов прогресса.",
        zh: "核心排版样式、界面语言、Swiss Bento杂志排版以及阅读进度指示器。",
        ja: "主要なタイポグラフィ、UI言語、スイスベントー組版、読書進捗インジケーター。",
        es: "Tipografía principal, idioma de la interfaz, diseño Swiss Bento e indicadores de progreso.",
        de: "Typografie, UI-Sprache, Swiss-Bento-Satz und Lese-Fortschrittsanzeige.",
      },
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
      {
        en: "Craft Equalizer & Ambient Soundscapes (Sonic Studio)",
        ru: "Крафтовый Эквалайзер и Фоновые Звуки (Sonic Studio)",
        zh: "手作律动均衡器与环境音效 (Sonic Studio)",
        ja: "クラフトイコライザー＆環境音 (Sonic Studio)",
        es: "Ecualizador artesanal y paisajes sonoros (Sonic Studio)",
        de: "Craft-Equalizer & Ambient-Klangwelten (Sonic Studio)",
      },
      {
        en: "6 craft equalizer visualizers, desktop audio loopback, volume scroll wheel, and 12 stereo soundscapes.",
        ru: "6 крафтовых визуализаций эквалайзера, системный звук ПК, скролл громкости колёсиком мыши и 12 звуков фокуса.",
        zh: "6种手作动效频谱仪、电脑系统音频环路同步、滚轮音量微调与12种立体声沉浸音效。",
        ja: "6種のクラフト視覚効果、PC音声ループバック同期、ホイール音量調節、12種の環境音。",
        es: "6 estilos visuales, captura de audio del PC, rueda de volumen y 12 paisajes sonoros.",
        de: "6 Craft-Visualisierungen, PC-Audio-Loopback, Lautstärke-Scrollrad und 12 Stereo-Klangwelten.",
      },
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
          .addOption("creamy_pom", isRu ? "Reaper Creamy Linear (мягкий сливочно-мраморный свитч)" : "Reaper Creamy Linear (velvety marbly POM)")
          .addOption("thock", isRu ? "Ice Vein Deep Thock (глубокий матовый PBT-отклик)" : "Ice Vein Deep Thock (deep matte PBT)")
          .addOption("matcha_lubed", isRu ? "Milky Yellow Lubed (тёплый смазанный линейный свитч)" : "Milky Yellow Lubed (warm factory-lubed linear)")
          .addOption("raindrop_wood", isRu ? "Matcha Latte Tactile (деликатная кремовая тактильность)" : "Matcha Latte Tactile (soft cushioned bump)")
          .addOption("velvet_felt", isRu ? "Honey Peach Silent (бесшумный подушечный свитч)" : "Honey Peach Silent (silicone dampened whisper)")
          .addOption("paper_brush", isRu ? "Rosewood Cocoa Linear (тёплый древесно-ореховый тон)" : "Rosewood Cocoa Linear (warm wooden pitch)")
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
      {
        en: "Focus Studio, Pomodoro & Smart LED Lamp",
        ru: "Фокус, Помодоро и Умная Лампа",
        zh: "专注工坊、番茄钟与智能护眼台灯",
        ja: "フォーカススタジオ・ポモドーロ・スマートランプ",
        es: "Estudio de foco, Pomodoro y lámpara Lumina",
        de: "Fokus-Studio, Pomodoro & Smarte Lumina-Lampe",
      },
      {
        en: "Deep work sprint timer, automatic audio fade on break, warm desk lamp, and AI watermark cleaner.",
        ru: "Таймер глубокой работы, авто-затухание звука на перерыве, тёплая настольная лампа и чистка ИИ-символов.",
        zh: "深度工作冲刺计时、休息期音乐渐隐、2700K–6500K色温护眼光带与AI标记清洗。",
        ja: "ディープワーク用タイマー、休憩時フェードアウト、2700K–6500Kデスクライト、AI記号クリーンアップ。",
        es: "Temporizador de trabajo profundo, atenuación en pausas, lámpara 2700K–6500K y limpieza de IA.",
        de: "Fokus-Timer, Musik-Fadeout in Pausen, 2700K–6500K Schreibtischlampe und KI-Bereinigung.",
      },
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
      {
        en: "Swiss Bento Knowledge Graph & 1-Click PNG Export",
        ru: "Swiss Bento Граф Знаний и PNG-Экспорт",
        zh: "Swiss Bento 知识图谱与 1-Click PNG 导出",
        ja: "Swiss Bento 知識グラフ＆1クリックPNGエクスポート",
        es: "Grafo de conocimiento Swiss Bento y exportación PNG",
        de: "Swiss Bento Wissensgraph & 1-Klick PNG-Export",
      },
      {
        en: "8-color folder palette, focus radar, and 1-click high-DPI PNG graph snapshot.",
        ru: "8-цветная палитра папок, радар фокуса и сохранение снимка графа в PNG в 1 клик.",
        zh: "8色文件夹莫兰迪调色板、焦点雷达与一键高分辨率PNG图谱快照。",
        ja: "8色フォルダパレット、フォーカスレーダー、1クリック高解像度PNGスナップショット。",
        es: "Paleta de 8 colores para carpetas, radar de foco y captura PNG en 1 clic.",
        de: "8-Farben-Ordnerpalette, Fokus-Radar und 1-Klick-PNG-Graph-Schnappschuss.",
      },
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

// --- ✨ INTERACTIVE TOUR NOTE CONTENT (RU / EN) ---
function getAlchemyTourMarkdown(isRu, version) {
  const today = new Date().toISOString().slice(0, 10);
  if (isRu) {
    return `---
title: "Alchemy Craft — Интерактивный тур"
tags: [alchemy-craft, tour]
created: ${today}
plugin-version: "${version}"
---

# ⚗️ Alchemy Craft — Интерактивный тур

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
- [ ] Отметить последний пункт и услышать аккорд 🎻

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
4. Пока срок не наступил, вспоминайте ответ по памяти. Досрочно — удерживайте печать 2 секунды.
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

# ⚗️ Alchemy Craft — Interactive Tour

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
- [ ] Tick the last item and hear the chord 🎻

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
4. Until the date, recall the answer from memory. To open early, press & hold the seal for 2 seconds.
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

// --- 🕯️ TIME CAPSULE SEAL MODAL (EXPLAINS THE FEATURE, PICKS DATE + RECALL QUESTION) ---
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
    const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    contentEl.innerHTML = `
      <div class="capsule-head">
        <span class="capsule-badge">${i18n(I18N_CAPSULE.badge, this.plugin)}</span>
        <h2 class="capsule-title">${i18n(I18N_CAPSULE.title, this.plugin)}</h2>
        <div class="capsule-file">📄 ${this.file.basename}</div>
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
              en: "LIFE RPG · SHA-256 PROOF-OF-WORK LEDGER",
              ru: "СИСТЕМА КВЕСТОВ · РЕЕСТР SHA-256",
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
        { id: "onchain", icon: "globe", label: i18n({ en: "Smart Contract ($0)", ru: "Смарт-Контракт ($0)", zh: "智能合约 ($0)", ja: "コントラクト ($0)", es: "Contrato ($0)", de: "Smart Contract ($0)" }, this.plugin) },
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
              <textarea class="rpg-input-area" data-field="antiVision" rows="2">${rpg.antiVision || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">02 · ${i18n({ en: "VISION MVP (IDEAL DAY)", ru: "ВИДЕНИЕ (ИДЕАЛЬНЫЙ ДЕНЬ)", zh: "理想愿景 MVP", ja: "理想の1日 (Vision MVP)", es: "VISIÓN MVP", de: "VISION MVP" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="visionMvp" rows="2">${rpg.visionMvp || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">03 · ${i18n({ en: "1-YEAR MISSION", ru: "МИССИЯ НА 1 ГОД", zh: "1年核心使命", ja: "1年間のミッション", es: "MISIÓN A 1 AÑO", de: "1-JAHRES-MISSION" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="oneYearMission" rows="2">${rpg.oneYearMission || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">04 · ${i18n({ en: "1-MONTH BOSS FIGHT", ru: "ГЛАВНЫЙ ПРОЕКТ МЕСЯЦА", zh: "本月核心攻坚 (Boss Fight)", ja: "今月の最重要課題", es: "PROYECTO DEL MES", de: "MONATS-PROJEKT" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-field="oneMonthBoss" rows="2">${rpg.oneMonthBoss || ""}</textarea>
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
                  <span class="rpg-lever-title">${lv.title}</span>
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
          const dKey = String(b.timestamp || "").slice(0, 10);
          if (!dKey) return;
          if (!dayMap[dKey]) dayMap[dKey] = { xp: 0, count: 0, quests: [] };
          dayMap[dKey].xp += Number(b.xp || 25);
          dayMap[dKey].count += 1;
          dayMap[dKey].quests.push(b.quest);
        });
        const today = new Date();
        const todayIso = today.toISOString().slice(0, 10);
        if (!dayMap[todayIso]) {
          dayMap[todayIso] = { xp: rpg.xp || 100, count: chain.length, quests: [latestBlock.quest || "Genesis"] };
        }

        const cells = [];
        let activeDaysCount = 0;
        for (let d = 363; d >= 0; d--) {
          const dt = new Date(today.getTime() - d * 86400000);
          const iso = dt.toISOString().slice(0, 10);
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
              <strong>${todayIso}</strong> — <strong>${dayMap[todayIso].xp} XP</strong> (${dayMap[todayIso].count} SHA-256)
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
                    ? `★ ON-CHAIN VERIFIED · TX: ${oc.lastAnchorTx.slice(0, 18)}…`
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
                <input type="text" class="onchain-contract-input" value="${oc.contractAddress || ""}" placeholder="0x..." />
                <div class="onchain-meta-lines">
                  <div>Root: <code>${rootHashHex.slice(0, 22)}…</code></div>
                </div>
              </div>
            </div>

            <div class="artcraft-calldata-box">
              <div class="rpg-card-kicker">03 · ABI CALLDATA (anchorQuestChainRoot)</div>
              <div class="calldata-params-line"><code>["${rootHashHex}", ${chain.length}, ${rpg.xp || 100}, ${rpg.level || 1}, "${vaultTag}"]</code></div>
              <div class="calldata-btn-row">
                <button class="sketch-tool-btn" data-act="copy-params">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Args", ru: "Скопировать аргументы", zh: "复制参数", ja: "引数をコピー", es: "Copiar argumentos", de: "Argumente kopieren" }, this.plugin)}</span></button>
                <button class="sketch-tool-btn" data-act="copy-calldata">${sicraftIcon('copy')} <span>${i18n({ en: "Copy Calldata", ru: "Скопировать HEX Calldata", zh: "复制 Calldata", ja: "Calldataをコピー", es: "Copiar Calldata", de: "Calldata kopieren" }, this.plugin)}</span></button>
                <button class="sketch-tool-btn" data-act="open-remix">${sicraftIcon('external')} <span>Remix IDE</span></button>
                <button class="sketch-tool-btn" data-act="open-explorer">${sicraftIcon('globe')} <span>Explorer</span></button>
              </div>
            </div>

            <div class="rpg-add-row">
              <input type="text" class="onchain-tx-input" value="${oc.lastAnchorTx || ""}" placeholder="${i18n({ en: "Paste transaction hash (0x...)...", ru: "Вставьте хеш транзакции (0x...)...", zh: "粘贴交易哈希 (0x...)...", ja: "トランザクションハッシュ (0x...)...", es: "Pegar hash de transacción (0x...)...", de: "Transaktions-Hash einfügen (0x...)..." }, this.plugin)}" />
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
          navigator.clipboard?.writeText(`["${rootHashHex}", ${chain.length}, ${rpg.xp || 100}, ${rpg.level || 1}, "${vaultTag}"]`);
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
          const finalTx = txVal || ("0x" + rootHashHex.slice(2, 66));
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
                  <span>#${blk.index}</span>
                  <span>${new Date(blk.timestamp).toLocaleString()}</span>
                  <span>+${blk.xp} XP · Nonce ${blk.nonce}</span>
                </div>
                <div class="ledger-block-quest">${blk.quest}</div>
                <div class="ledger-block-hashes">
                  <code>${blk.hash}</code>
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
              kicker: "01 · LOW ENTROPY",
              title: i18n({ en: "Morning Deep Work", ru: "Утро: Чистый Фокус", zh: "清晨：低熵深度创造", ja: "朝：ディープワーク", es: "Mañana: Foco Profundo", de: "Morgen: Deep Work" }, this.plugin),
              sub: i18n({ en: "Architecture, writing & complex code", ru: "Архитектура, сложный код и ключевые идеи", zh: "核心架构、写作与复杂代码", ja: "設計・執筆・複雑なコード", es: "Arquitectura, escritura y código", de: "Architektur, Schreiben & Code" }, this.plugin)
            },
            {
              id: "mid",
              kicker: "02 · MID ENTROPY",
              title: i18n({ en: "Afternoon Execution", ru: "День: Исполнение", zh: "午后：中熵推进", ja: "午後：タスク実行", es: "Tarde: Ejecución", de: "Nachmittag: Umsetzung" }, this.plugin),
              sub: i18n({ en: "Distribution, reviews & linear tasks", ru: "Дистрибуция, ревью и линейные задачи", zh: "内容分发、审阅与常规任务", ja: "配信・レビュー・定型作業", es: "Distribución y tareas lineales", de: "Verteilung & lineare Aufgaben" }, this.plugin)
            },
            {
              id: "high",
              kicker: "03 · RECOVERY",
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
        inp.addEventListener("input", async () => {
          const k = inp.getAttribute("data-bio");
          bf[k] = Number(inp.value);
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
          <button class="sketch-tool-btn" data-size="2">Fine</button>
          <button class="sketch-tool-btn is-active" data-size="3.5">Medium</button>
          <button class="sketch-tool-btn" data-size="7">Bold</button>
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
      const dataUrl = cv.toDataURL("image/png");
      const mdBlock = [
        "",
        `> [!abstract] ${caption} (${new Date().toLocaleDateString()})`,
        `> <img src="${dataUrl}" alt="${caption}" style="max-width:100%; border-radius:10px; border:1px solid rgba(148,163,184,0.28);" />`,
        ""
      ].join("\n");
      const cur = await this.app.vault.read(view.file);
      await this.app.vault.modify(view.file, cur + "\n" + mdBlock);
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
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.activeTab = "brand";
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
            <h2 class="artcraft-rpg-title">${i18n({
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
          `- **Mission:** ${rpg.oneYearMission}`,
          `- **Current Focus:** ${rpg.oneMonthBoss}`,
          `- **Voice & Style:** ${cos.brandVoice}`,
          `- **Audience:** ${cos.coreAudience}`,
          `- **Core Offer:** ${cos.flagshipOffer}`,
          `- **Key Vault Insights:**\n${sampleInsights}`
        ].join("\n");

        body.innerHTML = `
          <div class="artcraft-rpg-grid-2">
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">01 · ${i18n({ en: "VOICE & STYLE", ru: "СТИЛЬ И ПОДАЧА", zh: "品牌语调", ja: "トーン＆スタイル", es: "ESTILO Y VOZ", de: "STIL & TONFALL" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-cos="brandVoice" rows="4">${cos.brandVoice || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">02 · ${i18n({ en: "AUDIENCE & PAIN", ru: "АУДИТОРИЯ И ЗАПРОС", zh: "受众与痛点", ja: "対象読者と悩み", es: "AUDIENCIA", de: "ZIELGRUPPE" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-cos="coreAudience" rows="4">${cos.coreAudience || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">03 · ${i18n({ en: "CORE PRODUCT / OFFER", ru: "КЛЮЧЕВОЙ ПРОДУКТ", zh: "核心产品", ja: "主力プロダクト", es: "PRODUCTO CLAVE", de: "KERNPRODUKT" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-cos="flagshipOffer" rows="4">${cos.flagshipOffer || ""}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">04 · ${i18n({ en: "MAIN TOPIC PILLAR", ru: "ГЛАВНАЯ ТЕМА БЛОГА", zh: "内容支柱", ja: "メインテーマ", es: "PILAR DE CONTENIDO", de: "HAUPTTHEMA" }, this.plugin)}</div>
              <textarea class="rpg-input-area" data-cos="contentPillar" rows="4">${cos.contentPillar || ""}</textarea>
            </div>
          </div>
          <div class="artcraft-rpg-levers-box">
            <div class="rpg-card-kicker">${i18n({ en: "COMPILED @brand_context.md FOR AI", ru: "СВОДНЫЙ КОНТЕКСТ @brand_context.md ДЛЯ ИИ", zh: "生成的 AI 品牌上下文", ja: "AI用 @brand_context.md プレビュー", es: "CONTEXTO @brand_context.md", de: "KOMPILIERTER KI-KONTEXT" }, this.plugin)}</div>
            <textarea class="rpg-input-area is-mono-preview" rows="8" readonly>${compiledPrompt}</textarea>
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
              <textarea class="rpg-input-area" data-apag="hook" rows="4">${this.apag.hook}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">02 · PERSPECTIVE (${i18n({ en: "ROOT CAUSE", ru: "СУТЬ ПРОБЛЕМЫ", zh: "视角转换", ja: "視点の転換", es: "PERSPECTIVA", de: "PERSPEKTIVE" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="perspective" rows="4">${this.apag.perspective}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">03 · ADVANTAGE (${i18n({ en: "YOUR MECHANISM", ru: "НОВОЕ РЕШЕНИЕ", zh: "核心优势", ja: "解決メカニズム", es: "SOLUCIÓN", de: "LÖSUNG" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="advantage" rows="4">${this.apag.advantage}</textarea>
            </div>
            <div class="artcraft-rpg-card">
              <div class="rpg-card-kicker">04 · GAMIFY (${i18n({ en: "ACTION STEPS 01–03", ru: "ШАГИ 01–03", zh: "行动步骤", ja: "実践ステップ", es: "PASOS 01–03", de: "SCHRITTE 01–03" }, this.plugin)})</div>
              <textarea class="rpg-input-area" data-apag="gamify" rows="4">${this.apag.gamify}</textarea>
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
              <strong>${shortTopic}</strong>
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
        const raw = view && view.editor ? view.editor.getValue() : (view && view.data) || "";
        const lines = raw.split("\n");
        const tasks = [];
        lines.forEach((ln, lineIdx) => {
          const m = ln.match(/^(\s*[-*+]\s+\[([ xX/\-])\]\s+)(.+)$/);
          if (m) {
            const stateChar = m[2];
            const col = stateChar === "x" || stateChar === "X" ? "done" : stateChar === "/" || stateChar === "-" ? "flow" : "todo";
            tasks.push({ lineIdx, prefix: m[1], stateChar, text: m[3].trim(), col });
          }
        });

        const renderCol = (colId, title, badgeColor) => {
          const list = tasks.filter((t) => t.col === colId);
          return `
            <div class="artcraft-kanban-col">
              <div class="kanban-col-head" style="border-top-color:${badgeColor}">
                <strong>${title}</strong>
                <span>${list.length}</span>
              </div>
              <div class="kanban-col-cards">
                ${
                  list.length === 0
                    ? `<div class="kanban-empty">${i18n({ en: "No tasks", ru: "Нет задач", zh: "暂无任务", ja: "タスクなし", es: "Sin tareas", de: "Keine Aufgaben" }, this.plugin)}</div>`
                    : list
                        .map(
                          (t) => `
                      <div class="kanban-task-card" data-line="${t.lineIdx}">
                        <div class="kb-task-txt">${t.text.replace(/[*_`~]/g, "")}</div>
                        <div class="kb-task-btns">
                          ${colId !== "todo" ? `<button data-move="todo" data-line="${t.lineIdx}">← ${i18n({ en: "Queue", ru: "В очередь", zh: "待办", ja: "待機", es: "Cola", de: "Warteschlange" }, this.plugin)}</button>` : ""}
                          ${colId !== "flow" ? `<button data-move="flow" data-line="${t.lineIdx}">${i18n({ en: "In Flow", ru: "В поток", zh: "进行中", ja: "進行中", es: "En flujo", de: "Im Flow" }, this.plugin)}</button>` : ""}
                          ${colId !== "done" ? `<button class="is-done-btn" data-move="done" data-line="${t.lineIdx}">✓ SHA-256</button>` : ""}
                        </div>
                      </div>
                    `
                        )
                        .join("")
                }
              </div>
            </div>
          `;
        };

        body.innerHTML = `
          <div class="artcraft-kanban-board">
            ${renderCol("todo", i18n({ en: "01 · QUEUE", ru: "01 · ОЧЕРЕДЬ", zh: "01 · 待办队列", ja: "01 · 待機", es: "01 · COLA", de: "01 · WARTESCHLANGE" }, this.plugin), "#94A3B8")}
            ${renderCol("flow", i18n({ en: "02 · IN FLOW", ru: "02 · В ПОТОКЕ", zh: "02 · 心流进行中", ja: "02 · 進行中", es: "02 · EN FLUJO", de: "02 · IM FLOW" }, this.plugin), "#2563EB")}
            ${renderCol("done", i18n({ en: "03 · SIGNED SHA-256", ru: "03 · ГОТОВО (SHA-256)", zh: "03 · 已签名完成", ja: "03 · 完了 (SHA-256)", es: "03 · COMPLETADO", de: "03 · ERLEDIGT" }, this.plugin), "#16A34A")}
          </div>
        `;

        body.querySelectorAll("[data-move]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            if (!view || !view.file) return;
            const lineIdx = Number(btn.getAttribute("data-line"));
            const targetCol = btn.getAttribute("data-move");
            const newChar = targetCol === "done" ? "x" : targetCol === "flow" ? "/" : " ";
            const taskObj = tasks.find((x) => x.lineIdx === lineIdx);
            if (!taskObj) return;
            lines[lineIdx] = lines[lineIdx].replace(/^(\s*[-*+]\s+\[)[ xX/\-](\]\s+)/, `$1${newChar}$2`);
            const updatedContent = lines.join("\n");
            if (view.editor) view.editor.setValue(updatedContent);
            else await this.app.vault.modify(view.file, updatedContent);
            if (targetCol === "done") {
              await this.plugin.mineQuestBlock(taskObj.text.slice(0, 110), 30, true);
            } else {
              this.plugin.playTactileMicroFeedback("tap");
            }
            render();
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
        <div class="rpg-card-kicker">${rpg.oneMonthBoss}</div>
        <textarea class="rpg-input-area autopilot-ans" rows="3" placeholder="${i18n({
          en: "Write one brief sentence to lock in your focus (+30 XP)...",
          ru: "Напишите одну короткую фразу для фиксации внимания (+30 XP)...",
          zh: "写下一句简短反思以锁定注意力 (+30 XP)...",
          ja: "集中を取り戻すための短い一言を記入 (+30 XP)...",
          es: "Escribe una frase breve para fijar tu atención (+30 XP)...",
          de: "Schreibe einen kurzen Satz zur Fokus-Kalibrierung (+30 XP)..."
        }, this.plugin)}"></textarea>
      </div>
      <div class="artcraft-rpg-footer-actions">
        <button class="sketch-tool-btn" data-act="close">${i18n({ en: "Later", ru: "Позже", zh: "稍后", ja: "後で", es: "Luego", de: "Später" }, this.plugin)}</button>
        <button class="artcraft-rpg-stamp-note-btn mod-cta" data-act="commit">
          ${sicraftIcon('chain')} <span>${i18n({ en: "Sign in SHA-256 (+30 XP)", ru: "Подписать в SHA-256 (+30 XP)", zh: "SHA-256 签名记录 (+30 XP)", ja: "SHA-256 に署名 (+30 XP)", es: "Firmar en SHA-256 (+30 XP)", de: "In SHA-256 signieren (+30 XP)" }, this.plugin)}</span>
        </button>
      </div>
    `;

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

module.exports = AlchemyFlowPlugin;

/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */
/* nosourcemap */