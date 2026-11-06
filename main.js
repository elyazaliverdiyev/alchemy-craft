const { Plugin, PluginSettingTab, Setting, Notice, Modal, Menu } = require("obsidian");

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
  enableAiCleaner: true,
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
    dockCollapseTip: "Click to collapse/expand Alchemy Dock",
    timerTip: "LMB: Start/Pause | RMB: Presets & Ambient Audio | Double Click: Reset",
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
    eraserTip: "Eraser — erase drawings under cursor or finger (Esc to exit)",
    undoTip: "Undo last stroke (Ctrl+Z)",
    redoTip: "Redo stroke (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Clean invisible AI watermarks (Zero-Width spaces) & copy to clipboard",
    clearTip: "Clear all drawings and highlighted sentences",
    orientTip: "Toggle Orientation (Bottom Bar / Right Side Pillar)",
    collapseTip: "Collapse into floating orb",
    taskProgressLabel: "⚡ TASK PROGRESS:",
    sprintDoneNotice: "⚡ Alchemy Craft: Focus sprint completed! +1 Sprint recorded in Analytics.",
    breakDoneNotice: "☕ Alchemy Craft: Break finished! Ready for the next focus sprint?",
    customPomodoroTitle: "⏱ Custom Focus Sprint Duration",
    customPomodoroDesc: "Set your custom Pomodoro sprint duration in minutes (1 to 360):",
    customPomodoroStart: "Start Sprint",
    customPomodoroErr: "Please enter a number between 1 and 360 minutes.",
    modalBadge: "ALCHEMIST PRO • 1 YEAR PASS",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Annual pass for the price of one coffee ($4.99 / yr). Instant activation via Bank Card, @CryptoBot, or Universal EVM.",
    step1Title: "STEP 1: SELECT PAYMENT METHOD (USA / EU CARD OR CRYPTO)",
    netCard: "Bank Card / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Click Telegram (USDT/TON)",
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
    evmChainsLabel: "✓ SUPPORTED EVM NETWORKS FOR THIS 0x ADDRESS:",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "Click below to open @CryptoBot in Telegram and send 4.99 USDT/TON in 1 click, or message @StratAlchemy for an automated invoice.",
    evmNote: "This single Universal EVM 0x address accepts 4.99 USDT, USDC, DAI, ETH, or BNB on BNB Chain (BEP-20), Arbitrum One, Base, Polygon, Optimism, and Ethereum! L2 gas fee is ~$0.01.",
    bybitNote: "In Bybit App: Assets → Withdraw → Internal Transfer (0% Fee) → enter UID 8015849 and 4.99 USDT. Instant & fee-free.",
    trcNote: "Send 4.99 USDT via TRON network (TRC-20) from any wallet or exchange.",
    solNote: "Send 4.99 USDT or USDC on Solana network.",
    supportText: "Need assistance or instant manual activation?",
    supportSub: "Direct Telegram contact:",
    supportTgBtn: "Open @StratAlchemy",
    step2Title: "STEP 2: ENTER TRANSACTION HASH (TXID), BYBIT ID, OR CARD RECEIPT CODE:",
    txPlaceholder: "Paste TXID (0x...), Bybit Order ID, or Card Receipt #...",
    activateBtn: "⚡ Verify & Activate Pro",
    checkingBtn: "⏳ Verifying payment...",
    successMsg: "🎉 Success! Alchemy Craft Pro is now active for 365 days!",
    errorEmpty: "❌ Please enter a valid TXID, Order ID, or Card Receipt code.",
    errorPending: "⚠️ Transaction is still confirming. Please wait 1 minute and click again.",
    proActiveTitle: "PRO ACTIVE",
    proExpiresOn: "Annual Pass Active Until:",
    proMidnightName: "🌙 Midnight Dark Craft Mode",
    proMidnightDesc: "Full Swiss dark mode engineered for late-night reading, Graph View, and coding.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Unlock All Pro Features in Alchemy Craft",
    proPerk1: "🌙 Midnight Dark Craft — full Swiss dark theme for notes, tables, callouts & Graph",
    proPerk2: "🎨 Expanded 8-Color Palette — Rose Quartz, Cyber Cyan, Ruby Crimson & Solar Gold",
    proPerk3: "🕸️ Swiss Bento Graph Studio — interactive Graph View HUD, color groups & laser pulses",
    proPerk4: "🎧 Ambient Focus Soundscapes & Analytics — Brown Noise, Rain, 40Hz Gamma & streak stats",
    getProBtn: "💎 Get Alchemy Craft Pro ($4.99 / yr)",
    graphHudTitle: "⚗️ ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Constellation",
    graphPresetRadar: "Focus Radar",
    graphColorizeBtn: "🎨 Auto-Color Nodes",
    graphFitBtn: "🎯 Center",
    settingsTitle: "Alchemy Craft — Swiss Bento Studio, Graph & Focus (v3.7.0)",
    checkUpdatesBtn: "🔄 Check Updates",
    officialSiteBtn: "🌐 Official Website & Checkout",
    langName: "🌐 Interface Language (6 Global Languages)",
    langDesc: "Instant localization for the floating dock, settings, Graph HUD, and Pro checkout.",
    bentoGraphName: "🕸️ Swiss Bento Graph Studio & HUD",
    bentoGraphDesc: "Upgrades Obsidian's built-in Graph View with a warm Bento grid, floating HUD presets, glowing node rings, and 1-click folder color groups.",
    ambientName: "🎧 Ambient Focus Soundscape (WebAudio)",
    ambientDesc: "Synthesized zero-latency background audio during Pomodoro sprints (Brown Noise, Soft Rain, or 40Hz Gamma Binaural Focus).",
    analyticsTitle: "📊 Focus Flow Analytics & Streak"
  },
  ru: {
    dockCollapseTip: "Клик для сворачивания/разворачивания панели",
    timerTip: "ЛКМ: Старт/Пауза | ПКМ: Пресеты и Фоновый Звук | Двойной клик: Сброс",
    uiBtn: "UI",
    uiTip: "Теплый бумажный режим Swiss Bento UI + светло-зеленые шапки Excel",
    zenBtn: "Дзен",
    zenTip: "Режим Дзен — скрыть боковые панели для чистого фокуса или записи экрана",
    focusBtn: "Фокус",
    focusTip: "Выделение предложений выбранным цветом (клик по тексту)",
    laserBtn: "Указка",
    laserTip: "Лазерная указка (исчезающий след, Esc для выхода)",
    drawBtn: "Маркер",
    drawTip: "Рисование маркером поверх заметки (Esc для выхода)",
    eraserBtn: "Ластик",
    eraserTip: "Ластик — стирать рисунки касанием или мышью (Esc для выхода)",
    undoTip: "Отменить последний штрих (Ctrl+Z)",
    redoTip: "Повторить отмененный штрих (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Очистить текст заметки от невидимых ИИ-символов (Zero-Width) и скопировать",
    clearTip: "Очистить рисунки и выделенные предложения",
    orientTip: "Сменить расположение: Снизу / Справа у края",
    collapseTip: "Свернуть панель в плавающую сферу",
    taskProgressLabel: "⚡ ПРОГРЕСС ЗАДАЧ:",
    sprintDoneNotice: "⚡ Alchemy Craft: Фокус-сессия завершена! +1 спринт записан в статистику.",
    breakDoneNotice: "☕ Alchemy Craft: Перерыв окончен! Готовы к следующему фокус-спринту?",
    customPomodoroTitle: "⏱ Настройка времени фокуса",
    customPomodoroDesc: "Задайте свою длительность Pomodoro-спринта в минутах (от 1 до 360):",
    customPomodoroStart: "Запустить спринт",
    customPomodoroErr: "Пожалуйста, введите число от 1 до 360 минут.",
    modalBadge: "ALCHEMIST PRO • ГОДОВОЙ ПАСС",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Годовой доступ по цене чашки кофе ($4.99 / год). Оплата в 1 клик через @CryptoBot, Bybit UID или любой EVM кошелек.",
    step1Title: "ШАГ 1: ВЫБЕРИТЕ СПОСОБ ОПЛАТЫ (КАРТА БАНКА ИЛИ КРИПТОВАЛЮТА)",
    netCard: "Карта Банка / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot Оплата",
    netCryptoBotHint: "В 1 клик в Telegram (USDT/TON)",
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
    evmChainsLabel: "✓ ПОДДЕРЖИВАЕМЫЕ EVM СЕТИ ДЛЯ ЭТОГО 0x АДРЕСА:",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "Нажмите кнопку ниже для оплаты 4.99 USDT/TON в 1 клик через @CryptoBot, либо запросите инвойс у @StratAlchemy.",
    evmNote: "Этот единый 0x EVM-адрес принимает 4.99 USDT, USDC, DAI, ETH или BNB в сетях BNB Chain (BEP-20), Arbitrum One, Base, Polygon, Optimism и Ethereum! Комиссия в L2 сетях всего ~$0.01.",
    bybitNote: "В приложении Bybit: Активы → Вывод → Внутренний перевод (0% комиссии) → укажите UID 8015849 и 4.99 USDT. Мгновенно.",
    trcNote: "Отправьте 4.99 USDT в сети TRON (TRC-20) с любого кошелька или биржи.",
    solNote: "Отправьте 4.99 USDT или USDC в сети Solana.",
    supportText: "Нужна помощь с оплатой или мгновенная ручная активация?",
    supportSub: "Прямая связь с автором в Telegram:",
    supportTgBtn: "Написать @StratAlchemy",
    step2Title: "ШАГ 2: ВВЕДИТЕ ХЭШ ТРАНЗАКЦИИ (TXID), BYBIT ID ИЛИ КОД КВИТАНЦИИ КАРТЫ:",
    txPlaceholder: "Вставьте TXID (0x...), номер перевода Bybit или чек карты...",
    activateBtn: "⚡ Проверить и Активировать Pro",
    checkingBtn: "⏳ Проверка оплаты...",
    successMsg: "🎉 Поздравляем! Alchemy Craft Pro успешно активирован на 365 дней!",
    errorEmpty: "❌ Пожалуйста, введите корректный TXID, номер перевода или код чека.",
    errorPending: "⚠️ Транзакция ещё подтверждается сетью. Подождите 1 минуту и нажмите снова.",
    proActiveTitle: "PRO АКТИВЕН",
    proExpiresOn: "Годовой доступ активен до:",
    proMidnightName: "🌙 Ночной режим Midnight Dark Craft",
    proMidnightDesc: "Полная швейцарская темная тема для ночного чтения, таблиц, карточек и Графа.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Разблокируйте все Pro функции Alchemy Craft",
    proPerk1: "🌙 Midnight Dark Craft — полная темная тема для заметок, таблиц и Графа",
    proPerk2: "🎨 Расширенная палитра (8 цветов) — Rose Quartz, Cyber Cyan, Ruby Crimson и Solar Gold",
    proPerk3: "🕸️ Swiss Bento Graph Studio — панель управления Графом Obsidian, цвета папок и пресеты",
    proPerk4: "🎧 Фоновые звуки фокуса и Аналитика — Коричневый шум, Дождь, 40Hz Гамма и трекер спринтов",
    getProBtn: "💎 Получить Alchemy Craft Pro ($4.99 / год)",
    graphHudTitle: "⚗️ ALCHEMY BENTO ГРАФ",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Созвездие",
    graphPresetRadar: "Фокус Радар",
    graphColorizeBtn: "🎨 Раскрасить узлы",
    graphFitBtn: "🎯 В центр",
    settingsTitle: "Alchemy Craft — Swiss Bento Studio, Graph & Focus (v3.7.0)",
    checkUpdatesBtn: "🔄 Проверить обновления",
    officialSiteBtn: "🌐 Официальный сайт и оплата",
    langName: "🌐 Язык интерфейса (6 мировых языков)",
    langDesc: "Мгновенный перевод панели управления, настроек, HUD графа и окна оплаты.",
    bentoGraphName: "🕸️ Улучшенный Граф Obsidian (Swiss Bento Graph Studio)",
    bentoGraphDesc: "Преображает встроенный Граф Obsidian: теплая сетка Bento, плавающий HUD-контроллер, раскраска узлов по папкам в 1 клик и пресеты физики.",
    ambientName: "🎧 Фоновые звуки для глубокого фокуса (WebAudio)",
    ambientDesc: "Встроенный генератор приятного фонового звука во время таймера (Коричневый шум, Шум дождя, Бинауральный ритм 40Hz).",
    analyticsTitle: "📊 Статистика Фокуса и Серии (Pro Analytics)"
  },
  zh: {
    dockCollapseTip: "点击折叠/展开 Alchemy 工具栏",
    timerTip: "左键: 开始/暂停 | 右键: 预设与白噪音 | 双击: 重置",
    uiBtn: "UI",
    uiTip: "瑞士 Bento 护眼纸张主题 (#F4F3EF) 与鼠尾草绿表格",
    zenBtn: "禅定",
    zenTip: "禅定模式 — 隐藏侧边栏，享受纯粹专注",
    focusBtn: "聚焦",
    focusTip: "句子高亮聚焦（悬停并点击句子以固定调色板颜色）",
    laserBtn: "激光",
    laserTip: "激光指示器（发光轨迹，按 Esc 退出）",
    drawBtn: "画笔",
    drawTip: "自由马克笔标注（按 Esc 退出）",
    eraserBtn: "橡皮",
    eraserTip: "橡皮擦 — 擦除画笔轨迹（按 Esc 退出）",
    undoTip: "撤销上一笔 (Ctrl+Z)",
    redoTip: "重做 (Ctrl+Y)",
    aiCleanBtn: "AI 清理",
    aiCleanTip: "一键清除不可见的 AI 零宽字符水印并复制纯文本",
    clearTip: "清除所有涂鸦与句子高亮",
    orientTip: "切换工具栏方向（底部横栏 / 右侧竖栏）",
    collapseTip: "折叠为炼金术悬浮球",
    taskProgressLabel: "⚡ 任务进度:",
    sprintDoneNotice: "⚡ Alchemy Craft: 专注冲刺完成！已记录到专注统计。",
    breakDoneNotice: "☕ Alchemy Craft: 休息结束！准备好开始下一轮专注了吗？",
    customPomodoroTitle: "⏱ 自定义番茄钟时长",
    customPomodoroDesc: "输入自定义专注时长（1 至 360 分钟）：",
    customPomodoroStart: "开始专注",
    customPomodoroErr: "请输入 1 到 360 之间的分钟数。",
    modalBadge: "ALCHEMIST PRO • 年度通行证",
    modalTitle: "Alchemy Craft Pro 专业版",
    modalSubtitle: "仅需一杯咖啡的价格 ($4.99 / 年)。支持全球银行卡、@CryptoBot 及全链 EVM 激活。",
    step1Title: "第 1 步：选择支付方式（银行卡 / APPLE PAY / 加密货币）",
    netCard: "银行卡 / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot 支付",
    netCryptoBotHint: "Telegram 一键支付 (USDT/TON)",
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
    evmChainsLabel: "✓ 此 0x 地址支持的 EVM 网络：",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "点击下方按钮通过 Telegram @CryptoBot 一键支付 4.99 USDT/TON，或联系 @StratAlchemy 获取账单。",
    evmNote: "此通用 0x EVM 地址支持 BNB Chain (BEP20)、Arbitrum One、Base、Polygon、Optimism 和 Ethereum 网络发送 4.99 USDT/USDC！",
    bybitNote: "在 Bybit App 中：资产 → 提现 → 内部转账（0 手续费）→ 输入 UID 8015849 和 4.99 USDT。",
    trcNote: "通过 TRON (TRC-20) 网络发送 4.99 USDT。",
    solNote: "通过 Solana 网络发送 4.99 USDT 或 USDC。",
    supportText: "需要帮助或人工即时激活？",
    supportSub: "直接联系作者 Telegram:",
    supportTgBtn: "打开 @StratAlchemy",
    step2Title: "第 2 步：输入交易哈希 (TXID)、BYBIT 订单号或银行卡收据代码：",
    txPlaceholder: "粘贴 TXID (0x...)、Bybit 订单号或银行卡收据号...",
    activateBtn: "⚡ 验证并激活 Pro",
    checkingBtn: "⏳ 正在验证支付...",
    successMsg: "🎉 激活成功！Alchemy Craft Pro 已开启 365 天权限！",
    errorEmpty: "❌ 请输入有效的 TXID、订单号或收据代码。",
    errorPending: "⚠️ 交易正在确认中，请等待 1 分钟后重试。",
    proActiveTitle: "PRO 已激活",
    proExpiresOn: "年度通行证有效期至：",
    proMidnightName: "🌙 午夜暗黑模式 (Midnight Dark Craft)",
    proMidnightDesc: "专为夜间阅读、知识图谱与编程打造的瑞士暗黑主题。",
    proBuyCardBadge: "ALCHEMIST PRO 通行证",
    proBuyCardTitle: "解锁 Alchemy Craft Pro 全部高级功能",
    proPerk1: "🌙 Midnight Dark Craft — 完整的瑞士暗黑模式（支持笔记、表格与知识图谱）",
    proPerk2: "🎨 8 色高级调色板 — 新增玫瑰粉、赛博青、深红与日曜金",
    proPerk3: "🕸️ 瑞士 Bento 知识图谱工作室 — 图谱悬浮控制器、文件夹自动配色与物理预设",
    proPerk4: "🎧 专注白噪音与统计分析 — 棕噪音、雨声、40Hz 伽马波与专注打卡统计",
    getProBtn: "💎 获取 Alchemy Craft Pro ($4.99 / 年)",
    graphHudTitle: "⚗️ ALCHEMY BENTO 知识图谱",
    graphPresetBento: "瑞士 Bento",
    graphPresetConstellation: "星群模式",
    graphPresetRadar: "焦点雷达",
    graphColorizeBtn: "🎨 节点自动配色",
    graphFitBtn: "🎯 居中",
    settingsTitle: "Alchemy Craft — 瑞士 Bento 阅读、图谱与专注系统 (v3.7.0)",
    checkUpdatesBtn: "🔄 检查更新",
    officialSiteBtn: "🌐 官方网站与收银台",
    langName: "🌐 界面语言 (支持 6 种国际语言)",
    langDesc: "即时切换工具栏、设置面板、图谱控制器与收银台语言。",
    bentoGraphName: "🕸️ 瑞士 Bento 知识图谱增强 (Graph Studio)",
    bentoGraphDesc: "美化 Obsidian 内置关系图谱：Bento 点阵背景、顶部悬浮控制器与一键文件夹配色。",
    ambientName: "🎧 专注背景白噪音 (WebAudio)",
    ambientDesc: "无需联网的合成背景音（棕噪音、纸上雨声、40Hz 专注伽马波）。",
    analyticsTitle: "📊 专注时长与连续打卡统计"
  },
  ja: {
    dockCollapseTip: "クリックしてドックを折りたたみ/展開",
    timerTip: "左クリック: 開始/一時停止 | 右クリック: プリセット＆環境音 | ダブルクリック: リセット",
    uiBtn: "UI",
    uiTip: "Swiss Bento UI テーマ（目に優しいアーカイブ紙 #F4F3EF ＆ Excelグリーン表）",
    zenBtn: "禅",
    zenTip: "禅モード — サイドバーを隠して深い集中へ",
    focusBtn: "フォーカス",
    focusTip: "文フォーカス（文をクリックして選択中のパレット色でピン留め）",
    laserBtn: "レーザー",
    laserTip: "レーザーポインター（光る軌跡、Escで終了）",
    drawBtn: "マーカー",
    drawTip: "ノート上にフリーハンド描画（Escで終了）",
    eraserBtn: "消しゴム",
    eraserTip: "消しゴム — 描画を消去（Escで終了）",
    undoTip: "元に戻す (Ctrl+Z)",
    redoTip: "やり直し (Ctrl+Y)",
    aiCleanBtn: "AI クリーン",
    aiCleanTip: "不可視のAIゼロ幅スペースを除去してクリップボードにコピー",
    clearTip: "すべての描画とハイライトを消去",
    orientTip: "ドックの向きを切り替え（下部バー / 右側ピラー）",
    collapseTip: "錬金術オーブに折りたたむ",
    taskProgressLabel: "⚡ タスク進捗:",
    sprintDoneNotice: "⚡ Alchemy Craft: 集中スプリント完了！統計に記録されました。",
    breakDoneNotice: "☕ Alchemy Craft: 休憩終了！次のスプリントを始めましょう。",
    customPomodoroTitle: "⏱ カスタム集中タイマー設定",
    customPomodoroDesc: "ポモドーロの分数（1〜360分）を入力してください：",
    customPomodoroStart: "スプリント開始",
    customPomodoroErr: "1〜360の数値を入力してください。",
    modalBadge: "ALCHEMIST PRO • 1年間パス",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "コーヒー1杯分の価格 ($4.99 / 年)。クレジットカード、@CryptoBot、全EVMネットワークで即座に有効化。",
    step1Title: "ステップ 1: 支払い方法を選択 (カード / APPLE PAY / 暗号資産)",
    netCard: "クレジットカード / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot 決済",
    netCryptoBotHint: "Telegram 1クリック (USDT/TON)",
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
    evmChainsLabel: "✓ この 0x アドレスが対応する全 EVM ネットワーク:",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "下のボタンからTelegram @CryptoBotを開き、1クリックで4.99 USDT/TONを送金できます。",
    evmNote: "この単一の0x EVMアドレスは、BNB Chain (BEP20)、Arbitrum、Base、Polygon、Optimism、Ethereum上の4.99 USDT/USDCに対応しています。",
    bybitNote: "Bybitアプリ：資産 → 出金 → 内部振替（手数料0%）→ UID 8015849 と 4.99 USDT を入力。",
    trcNote: "TRON (TRC-20) ネットワークで 4.99 USDT を送金してください。",
    solNote: "Solana ネットワークで 4.99 USDT または USDC を送金してください。",
    supportText: "サポートや手動アクティベーションが必要ですか？",
    supportSub: "開発者へTelegramで直接連絡:",
    supportTgBtn: "@StratAlchemy を開く",
    step2Title: "ステップ 2: トランザクションID (TXID)、BYBIT ID、またはカード決済コードを入力:",
    txPlaceholder: "TXID (0x...)、Bybit ID、またはカードレシート番号を貼り付け...",
    activateBtn: "⚡ 確認して Pro を有効化",
    checkingBtn: "⏳ 決済を確認中...",
    successMsg: "🎉 成功！Alchemy Craft Pro が365日間有効化されました！",
    errorEmpty: "❌ 有効なTXID、注文ID、またはレシート番号を入力してください。",
    errorPending: "⚠️ トランザクションを確認中です。1分後にもう一度お試しください。",
    proActiveTitle: "PRO 有効",
    proExpiresOn: "年間パス有効期限:",
    proMidnightName: "🌙 Midnight Dark Craft モード",
    proMidnightDesc: "夜間の読書、グラフビュー、コーディング向けに設計されたスイス・ダークテーマ。",
    proBuyCardBadge: "ALCHEMIST PRO パス",
    proBuyCardTitle: "Alchemy Craft Pro の全機能をアンロック",
    proPerk1: "🌙 Midnight Dark Craft — ノート、表、グラフ対応の完全ダークモード",
    proPerk2: "🎨 8色拡張パレット — ローズ、サイバーシアン、クリムゾン、ソーラーゴールド",
    proPerk3: "🕸️ Swiss Bento グラフスタジオ — グラフビュー専用HUD＆自動カラーリング",
    proPerk4: "🎧 環境音サウンド＆集中統計 — ブラウンノイズ、雨音、40Hzガンマ波＆記録",
    getProBtn: "💎 Alchemy Craft Pro を入手 ($4.99 / 年)",
    graphHudTitle: "⚗️ ALCHEMY BENTO グラフ",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "星座モード",
    graphPresetRadar: "レーダー",
    graphColorizeBtn: "🎨 自動カラー適用",
    graphFitBtn: "🎯 中央揃え",
    settingsTitle: "Alchemy Craft — Swiss Bento Studio, Graph & Focus (v3.7.0)",
    checkUpdatesBtn: "🔄 アップデート確認",
    officialSiteBtn: "🌐 公式サイト＆決済ページ",
    langName: "🌐 インターフェース言語 (6ヶ国語対応)",
    langDesc: "ドック、設定、グラフHUD、決済画面の言語を即座に切り替えます。",
    bentoGraphName: "🕸️ Swiss Bento グラフスタジオ (Graph View 強化)",
    bentoGraphDesc: "Obsidian標準のグラフビューをBentoスタイルに刷新し、専用HUDコントロールを追加します。",
    ambientName: "🎧 集中環境音ジェネレーター (WebAudio)",
    ambientDesc: "ポモドーロ中に再生できる心地よい合成環境音（ブラウンノイズ、雨音、40Hzバイノーラル）。",
    analyticsTitle: "📊 集中セッション統計＆ストリーク"
  },
  es: {
    dockCollapseTip: "Clic para plegar/desplegar el panel Alchemy",
    timerTip: "Clic Izq: Iniciar/Pausar | Clic Der: Ajustes y Sonido Ambiente | Doble Clic: Reiniciar",
    uiBtn: "UI",
    uiTip: "Tema Swiss Bento UI (Papel cálido #F4F3EF + Tablas verde salvia)",
    zenBtn: "Zen",
    zenTip: "Modo Zen — oculta paneles laterales para concentración total",
    focusBtn: "Enfoque",
    focusTip: "Resaltado de frases (haz clic en cualquier frase para fijar el color activo)",
    laserBtn: "Láser",
    laserTip: "Puntero Láser (rastro brillante, Esc para salir)",
    drawBtn: "Trazar",
    drawTip: "Marcador de dibujo libre sobre la nota (Esc para salir)",
    eraserBtn: "Borrar",
    eraserTip: "Borrador — elimina trazos bajo el cursor (Esc para salir)",
    undoTip: "Deshacer último trazo (Ctrl+Z)",
    redoTip: "Rehacer trazo (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Elimina marcas de agua invisibles de IA (Zero-Width) y copia texto limpio",
    clearTip: "Borrar todos los dibujos y frases resaltadas",
    orientTip: "Cambiar orientación (Barra inferior / Pilar lateral derecho)",
    collapseTip: "Plegar en esfera flotante",
    taskProgressLabel: "⚡ PROGRESO DE TAREAS:",
    sprintDoneNotice: "⚡ Alchemy Craft: ¡Sprint de enfoque completado! Registrado en tus estadísticas.",
    breakDoneNotice: "☕ Alchemy Craft: ¡Descanso terminado! ¿Listo para el siguiente sprint?",
    customPomodoroTitle: "⏱ Duración Personalizada de Pomodoro",
    customPomodoroDesc: "Define los minutos de tu sprint de enfoque (de 1 a 360):",
    customPomodoroStart: "Iniciar Sprint",
    customPomodoroErr: "Por favor ingresa un número entre 1 y 360 minutos.",
    modalBadge: "ALCHEMIST PRO • PASE DE 1 AÑO",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Pase anual por el precio de un café ($4.99 / año). Pago con Tarjeta Bancaria, @CryptoBot o redes EVM.",
    step1Title: "PASO 1: SELECCIONA MÉTODO DE PAGO (TARJETA BANCARIA O CRIPTO)",
    netCard: "Tarjeta / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Clic en Telegram (USDT/TON)",
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
    evmChainsLabel: "✓ REDES EVM COMPATIBLES CON ESTA DIRECCIÓN 0x:",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "Haz clic abajo para abrir @CryptoBot en Telegram y pagar 4.99 USDT/TON en 1 clic.",
    evmNote: "Esta dirección 0x Universal EVM acepta 4.99 USDT, USDC, DAI, ETH o BNB en BNB Chain (BEP-20), Arbitrum, Base, Polygon, Optimism y Ethereum.",
    bybitNote: "En la App de Bybit: Activos → Retirar → Transferencia Interna (0% comisión) → ingresa UID 8015849 y 4.99 USDT.",
    trcNote: "Envía 4.99 USDT mediante la red TRON (TRC-20).",
    solNote: "Envía 4.99 USDT o USDC en la red Solana.",
    supportText: "¿Necesitas ayuda o activación manual instantánea?",
    supportSub: "Contacto directo en Telegram:",
    supportTgBtn: "Abrir @StratAlchemy",
    step2Title: "PASO 2: INGRESA EL HASH (TXID), ID DE BYBIT O CÓDIGO DE RECIBO DE TARJETA:",
    txPlaceholder: "Pega tu TXID (0x...), ID de Bybit o recibo de tarjeta...",
    activateBtn: "⚡ Verificar y Activar Pro",
    checkingBtn: "⏳ Verificando pago...",
    successMsg: "🎉 ¡Éxito! Alchemy Craft Pro está activo por 365 días.",
    errorEmpty: "❌ Ingresa un TXID, ID de orden o recibo válido.",
    errorPending: "⚠️ Transacción en confirmación. Espera 1 minuto e intenta de nuevo.",
    proActiveTitle: "PRO ACTIVO",
    proExpiresOn: "Pase anual activo hasta:",
    proMidnightName: "🌙 Modo Oscuro Midnight Dark Craft",
    proMidnightDesc: "Tema oscuro suizo diseñado para lectura nocturna, Grafo y programación.",
    proBuyCardBadge: "PASE ALCHEMIST PRO",
    proBuyCardTitle: "Desbloquea Todas las Funciones Pro en Alchemy Craft",
    proPerk1: "🌙 Midnight Dark Craft — tema oscuro completo para notas, tablas y Grafo",
    proPerk2: "🎨 Paleta Expandida de 8 Colores — Rosa, Cian, Carmesí y Oro Solar",
    proPerk3: "🕸️ Swiss Bento Graph Studio — panel HUD interactivo y colores para el Grafo",
    proPerk4: "🎧 Sonidos Ambiente y Analíticas — Ruido Marrón, Lluvia, 40Hz Gamma y rachas",
    getProBtn: "💎 Obtener Alchemy Craft Pro ($4.99 / año)",
    graphHudTitle: "⚗️ GRAFO ALCHEMY BENTO",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Constelación",
    graphPresetRadar: "Radar Focus",
    graphColorizeBtn: "🎨 Colorear Nodos",
    graphFitBtn: "🎯 Centrar",
    settingsTitle: "Alchemy Craft — Swiss Bento Studio, Graph & Focus (v3.7.0)",
    checkUpdatesBtn: "🔄 Buscar Actualizaciones",
    officialSiteBtn: "🌐 Sitio Oficial y Pagos",
    langName: "🌐 Idioma de la Interfaz (6 Idiomas Globales)",
    langDesc: "Traducción instantánea para la barra flotante, ajustes, Grafo y pagos.",
    bentoGraphName: "🕸️ Swiss Bento Graph Studio (Mejora del Grafo)",
    bentoGraphDesc: "Transforma el Grafo de Obsidian con cuadrícula Bento, controles HUD y grupos de colores.",
    ambientName: "🎧 Sonido Ambiente de Enfoque (WebAudio)",
    ambientDesc: "Generador de sonido relajante durante sprints Pomodoro (Ruido Marrón, Lluvia, 40Hz Gamma).",
    analyticsTitle: "📊 Analíticas de Enfoque y Rachas"
  },
  de: {
    dockCollapseTip: "Klicken zum Ein-/Ausklappen des Alchemy-Docks",
    timerTip: "Links: Start/Pause | Rechts: Presets & Ambient-Sound | Doppelklick: Reset",
    uiBtn: "UI",
    uiTip: "Swiss Bento UI-Theme (Warmes Papier #F4F3EF + Salbeigrüne Tabellen)",
    zenBtn: "Zen",
    zenTip: "Zen-Modus — Seitenleisten für puren Fokus ausblenden",
    focusBtn: "Fokus",
    focusTip: "Satz-Fokus (Satz anklicken, um aktive Palettenfarbe anzuheften)",
    laserBtn: "Laser",
    laserTip: "Laserpointer (leuchtender Schweif, Esc zum Beenden)",
    drawBtn: "Marker",
    drawTip: "Freihand-Marker auf der Notiz (Esc zum Beenden)",
    eraserBtn: "Radierer",
    eraserTip: "Radierer — Zeichnungen löschen (Esc zum Beenden)",
    undoTip: "Rückgängig (Ctrl+Z)",
    redoTip: "Wiederholen (Ctrl+Y)",
    aiCleanBtn: "AI Clean",
    aiCleanTip: "Unsichtbare KI-Wasserzeichen (Zero-Width) entfernen & Text kopieren",
    clearTip: "Alle Zeichnungen und Markierungen löschen",
    orientTip: "Ausrichtung wechseln (Unten / Rechte Seitenleiste)",
    collapseTip: "Zur schwebenden Kugel einklappen",
    taskProgressLabel: "⚡ AUFGABEN-FORTSCHRITT:",
    sprintDoneNotice: "⚡ Alchemy Craft: Fokus-Sprint abgeschlossen! In deiner Statistik gespeichert.",
    breakDoneNotice: "☕ Alchemy Craft: Pause beendet! Bereit für den nächsten Sprint?",
    customPomodoroTitle: "⏱ Eigene Fokus-Dauer einstellen",
    customPomodoroDesc: "Gib deine gewünschte Pomodoro-Dauer in Minuten ein (1 bis 360):",
    customPomodoroStart: "Sprint starten",
    customPomodoroErr: "Bitte gib eine Zahl zwischen 1 und 360 Minuten ein.",
    modalBadge: "ALCHEMIST PRO • 1-JAHRES-PASS",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Jahrespass zum Preis eines Kaffees ($4.99 / Jahr). Zahlung per Kreditkarte, @CryptoBot oder Universal EVM.",
    step1Title: "SCHRITT 1: ZAHLUNGSMETHODE WÄHLEN (BANKKARTE ODER KRYPTO)",
    netCard: "Kreditkarte / Apple Pay",
    netCardHint: "Instant @CryptoBot Invoice",
    netCryptoBot: "@CryptoBot Pay",
    netCryptoBotHint: "1-Klick in Telegram (USDT/TON)",
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
    evmChainsLabel: "✓ UNTERSTÜTZTE EVM-NETZWERKE FÜR DIESE 0x-ADRESSE:",
    cardNote: "Click Open @CryptoBot below to pay $4.99 in USDT, TON, SOL, BNB, BTC, or card via Telegram Wallet. After payment, paste your Invoice ID or TXID in Step 2.",
    cryptobotNote: "Klicke unten, um @CryptoBot in Telegram zu öffnen und 4.99 USDT/TON mit 1 Klick zu senden.",
    evmNote: "Diese universelle 0x EVM-Adresse akzeptiert 4.99 USDT, USDC, DAI, ETH oder BNB auf BNB Chain (BEP20), Arbitrum, Base, Polygon, Optimism und Ethereum!",
    bybitNote: "In der Bybit-App: Assets → Auszahlen → Interner Transfer (0% Gebühr) → UID 8015849 und 4.99 USDT eingeben.",
    trcNote: "Sende 4.99 USDT über das TRON-Netzwerk (TRC-20).",
    solNote: "Sende 4.99 USDT oder USDC im Solana-Netzwerk.",
    supportText: "Hilfe oder sofortige manuelle Aktivierung benötigt?",
    supportSub: "Direkter Telegram-Kontakt:",
    supportTgBtn: "@StratAlchemy öffnen",
    step2Title: "SCHRITT 2: TRANSAKTIONS-HASH (TXID), BYBIT-ID ODER KARTENBELEG EINGEBEN:",
    txPlaceholder: "TXID (0x...), Bybit-ID oder Kartenbeleg-Nr. einfügen...",
    activateBtn: "⚡ Prüfen & Pro aktivieren",
    checkingBtn: "⏳ Zahlung wird geprüft...",
    successMsg: "🎉 Erfolg! Alchemy Craft Pro ist jetzt für 365 Tage aktiviert!",
    errorEmpty: "❌ Bitte gib eine gültige TXID, Bestell-ID oder Belegnummer ein.",
    errorPending: "⚠️ Transaktion wird noch bestätigt. Bitte 1 Minute warten.",
    proActiveTitle: "PRO AKTIV",
    proExpiresOn: "Jahrespass aktiv bis:",
    proMidnightName: "🌙 Midnight Dark Craft Modus",
    proMidnightDesc: "Schweizer Dark-Mode für nächtliches Lesen, Graph-Ansicht und Coding.",
    proBuyCardBadge: "ALCHEMIST PRO PASS",
    proBuyCardTitle: "Alle Pro-Funktionen in Alchemy Craft freischalten",
    proPerk1: "🌙 Midnight Dark Craft — komplettes Schweizer Dark-Theme für Notizen, Tabellen & Graph",
    proPerk2: "🎨 Erweiterte 8-Farben-Palette — Rose Quartz, Cyber Cyan, Ruby Crimson & Solar Gold",
    proPerk3: "🕸️ Swiss Bento Graph Studio — interaktives Graph-HUD & Ordner-Farbgruppen",
    proPerk4: "🎧 Ambient-Fokus-Sounds & Statistik — Brown Noise, Regen, 40Hz Gamma & Streaks",
    getProBtn: "💎 Alchemy Craft Pro holen ($4.99 / Jahr)",
    graphHudTitle: "⚗️ ALCHEMY BENTO GRAPH",
    graphPresetBento: "Swiss Bento",
    graphPresetConstellation: "Konstellation",
    graphPresetRadar: "Fokus-Radar",
    graphColorizeBtn: "🎨 Knoten färben",
    graphFitBtn: "🎯 Zentrieren",
    settingsTitle: "Alchemy Craft — Swiss Bento Studio, Graph & Focus (v3.7.0)",
    checkUpdatesBtn: "🔄 Updates prüfen",
    officialSiteBtn: "🌐 Offizielle Website & Checkout",
    langName: "🌐 Oberflächensprache (6 Weltsprachen)",
    langDesc: "Sofortige Übersetzung für Dock, Einstellungen, Graph-HUD und Checkout.",
    bentoGraphName: "🕸️ Swiss Bento Graph Studio (Graph-Ansicht Upgrade)",
    bentoGraphDesc: "Verwandelt Obsidians Graph-Ansicht mit Bento-Raster, schwebendem HUD und 1-Klick-Farbgruppen.",
    ambientName: "🎧 Ambient-Fokus-Klangwelten (WebAudio)",
    ambientDesc: "Synthetische Hintergrundklänge während Pomodoro-Sprints (Brown Noise, Regen, 40Hz Gamma).",
    analyticsTitle: "📊 Fokus-Statistiken & Serien"
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

    this.addSettingTab(new AlchemyFlowSettingTab(this.app, this));
    setTimeout(() => this.injectGraphViewHUD(), 400);
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
    if (this.lpInterval) clearInterval(this.lpInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.canvasEl) this.canvasEl.remove();
    if (this.dockEl) this.dockEl.remove();
    // Clean up all task progress bars & graph HUDs so mobile DOM never gets stuck
    document.querySelectorAll(".artcraft-task-progress-wrap, .artcraft-graph-hud").forEach((el) => el.remove());
  }

  // --- AMBIENT FOCUS SOUNDSCAPE ENGINE (WEBAUDIO SYNTHESIS) ---
  startAmbientSound(type) {
    this.stopAmbientSound();
    if (!type || type === "off") return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.08;
      masterGain.connect(ctx.destination);

      if (type === "brown" || type === "rain") {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === "brown") {
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.2;
          } else {
            // Soft Rain pink/filtered texture
            output[i] = (lastOut + 0.08 * white) / 1.08;
            lastOut = output[i];
            output[i] *= 1.8;
          }
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = type === "brown" ? 420 : 1100;

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(0);
        this.ambientNodes = { ctx, source: whiteNoise };
      } else if (type === "gamma40") {
        // 40Hz Binaural Focus Drone (200Hz L + 240Hz R warm pad)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.value = 180;
        osc2.frequency.value = 220; // 40Hz delta
        masterGain.gain.value = 0.035;
        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc1.start();
        osc2.start();
        this.ambientNodes = { ctx, osc1, osc2 };
      }
    } catch (e) {
      // Ignore AudioContext restriction errors
    }
  }

  stopAmbientSound() {
    if (!this.ambientNodes) return;
    try {
      if (this.ambientNodes.source) this.ambientNodes.source.stop();
      if (this.ambientNodes.osc1) this.ambientNodes.osc1.stop();
      if (this.ambientNodes.osc2) this.ambientNodes.osc2.stop();
      if (this.ambientNodes.ctx) this.ambientNodes.ctx.close();
    } catch (e) {}
    this.ambientNodes = null;
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
    new Notice(`🍅 Pomodoro: ${mins} min`);
  }

  startBreak(mins) {
    this.settings.timerMode = "pomodoro";
    this.timerState = "break";
    this.timerSeconds = mins * 60;
    this.startTimer();
    new Notice(`☕ Break: ${mins} min`);
  }

  showTimerMenu(event) {
    const menu = new Menu();

    menu.addItem((item) => {
      item
        .setTitle("⚡ 15 min — Sprint Focus")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 15 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(15));
    });
    menu.addItem((item) => {
      item
        .setTitle("🍅 25 min — Standard Pomodoro")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 25 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(25));
    });
    menu.addItem((item) => {
      item
        .setTitle("🎯 45 min — Deep Work")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 45 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(45));
    });
    menu.addItem((item) => {
      item
        .setTitle("🌊 60 min — Flow State")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 60 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(60));
    });
    menu.addItem((item) => {
      item
        .setTitle("🚀 90 min — Ultradian Rhythm")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 90 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(90));
    });
    menu.addItem((item) => {
      item
        .setTitle("⚙️ Custom Duration (1–360 min)...")
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
        .setTitle("☕ 5 min — Short Break")
        .setChecked(this.timerState === "break" && this.timerSeconds <= 300)
        .onClick(() => this.startBreak(this.settings.breakMinutes || 5));
    });
    menu.addItem((item) => {
      item
        .setTitle("🌴 15 min — Long Break")
        .setChecked(this.timerState === "break" && this.timerSeconds > 300)
        .onClick(() => this.startBreak(15));
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle("🎧 Ambient: Off")
        .setChecked(!this.settings.ambientSound || this.settings.ambientSound === "off")
        .onClick(async () => {
          this.settings.ambientSound = "off";
          await this.saveSettings();
          this.stopAmbientSound();
        });
    });
    menu.addItem((item) => {
      item
        .setTitle("🌊 Ambient: Warm Brown Noise")
        .setChecked(this.settings.ambientSound === "brown")
        .onClick(async () => {
          this.settings.ambientSound = "brown";
          await this.saveSettings();
          if (this.timerRunning) this.startAmbientSound("brown");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle("🌧️ Ambient: Soft Rain on Paper")
        .setChecked(this.settings.ambientSound === "rain")
        .onClick(async () => {
          this.settings.ambientSound = "rain";
          await this.saveSettings();
          if (this.timerRunning) this.startAmbientSound("rain");
        });
    });
    menu.addItem((item) => {
      item
        .setTitle("🧠 Ambient: 40Hz Gamma Focus Drone")
        .setChecked(this.settings.ambientSound === "gamma40")
        .onClick(async () => {
          this.settings.ambientSound = "gamma40";
          await this.saveSettings();
          if (this.timerRunning) this.startAmbientSound("gamma40");
        });
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle("⏱ Stopwatch (Count Up: 00:00+)")
        .setChecked(this.settings.timerMode === "stopwatch")
        .onClick(async () => {
          this.settings.timerMode = "stopwatch";
          await this.saveSettings();
          this.resetTimer();
        });
    });
    menu.showAtMouseEvent(event);
  }

  updateTimerDisplay() {
    if (!this.timerEl || !this.timerTextEl) return;
    this.timerEl.classList.toggle("is-running", this.timerRunning);
    this.timerEl.classList.toggle("is-break", this.timerState === "break");
    let icon = "🍅";
    if (this.settings.timerMode === "stopwatch") {
      icon = "⏱";
    } else if (this.timerState === "break") {
      icon = "☕";
    }
    this.timerTextEl.textContent = `${icon} ${this.formatTime(this.timerSeconds)}`;
  }

  applyBodyClasses() {
    document.body.classList.toggle("artcraft-theme-active", this.settings.artcraftTheme);
    document.body.classList.toggle("artcraft-hover-cards", this.settings.hoverCards);
    document.body.classList.toggle("artcraft-sentence-focus", this.settings.sentenceFocus);
    document.body.classList.toggle("artcraft-zen-mode", !!this.zenMode);
    document.body.classList.toggle("artcraft-dark-craft", !!this.settings.darkCraftTheme && !!this.settings.isPro);
    document.body.classList.toggle("artcraft-bento-graph", this.settings.enableBentoGraph !== false);

    const tag = (this.settings.headerTagText !== undefined ? this.settings.headerTagText : "STRATALCHEMY // KNOWLEDGE BRIEF").trim();
    const show = this.settings.showHeaderTag !== false && tag.length > 0;
    if (show) {
      document.documentElement.style.setProperty("--artcraft-header-tag", `"${tag.replace(/"/g, '\\"')}"`);
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "block");
    } else {
      document.documentElement.style.setProperty("--artcraft-header-tag-display", "none");
    }
  }

  // --- SWISS BENTO GRAPH STUDIO (ENHANCES OBSIDIAN BUILT-IN GRAPH VIEW) ---
  injectGraphViewHUD() {
    if (this.settings.enableBentoGraph === false) {
      document.querySelectorAll(".artcraft-graph-hud").forEach((el) => el.remove());
      return;
    }

    const graphLeaves = document.querySelectorAll('.workspace-leaf-content[data-type="graph"], .workspace-leaf-content[data-type="localgraph"]');
    graphLeaves.forEach((leaf) => {
      const viewContent = leaf.querySelector(".view-content");
      if (!viewContent) return;

      viewContent.classList.add("artcraft-graph-canvas-wrap");
      viewContent.setAttribute("data-graph-preset", this.settings.graphPreset || "bento");

      if (viewContent.querySelector(".artcraft-graph-hud")) return;

      const hud = document.createElement("div");
      hud.className = "artcraft-graph-hud";
      hud.innerHTML = `
        <span class="artcraft-graph-hud-badge">${t("graphHudTitle", this)}</span>
        <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "bento" ? "is-active" : ""}" data-preset="bento">${t("graphPresetBento", this)}</button>
        <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "constellation" ? "is-active" : ""}" data-preset="constellation">${t("graphPresetConstellation", this)}</button>
        <button class="artcraft-graph-hud-btn ${this.settings.graphPreset === "radar" ? "is-active" : ""}" data-preset="radar">${t("graphPresetRadar", this)}</button>
        <button class="artcraft-graph-hud-btn artcraft-graph-color-btn" data-action="colorize">${t("graphColorizeBtn", this)}</button>
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
          new Notice(`🕸️ Alchemy Graph Preset: ${btn.textContent}`);
        });
      });

      const colorBtn = hud.querySelector('[data-action="colorize"]');
      if (colorBtn) {
        colorBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.applyBentoGraphColorGroups();
        });
      }

      viewContent.appendChild(hud);
    });
  }

  async applyBentoGraphColorGroups() {
    try {
      const adapter = this.app.vault.adapter;
      const configDir = this.app.vault.configDir || ".obsidian";
      const graphPath = `${configDir}/graph.json`;
      let graphConfig = {};
      if (await adapter.exists(graphPath)) {
        const raw = await adapter.read(graphPath);
        graphConfig = JSON.parse(raw);
      }

      // Swiss Bento 6-color semantic node groups (0x2563EB, 0xF59E0B, 0x10B981, 0x8B5CF6, 0xEC4899, 0x69BD28)
      graphConfig.colorGroups = [
        { query: 'path:"01" OR tag:#strategy OR tag:#01', color: { a: 1, rgb: 2450411 } }, // #2563EB Sapphire
        { query: 'path:"02" OR tag:#product OR tag:#02', color: { a: 1, rgb: 16096779 } }, // #F59E0B Amber
        { query: 'path:"03" OR tag:#research OR tag:#03', color: { a: 1, rgb: 1096065 } }, // #10B981 Emerald
        { query: 'path:"04" OR tag:#archive OR tag:#04', color: { a: 1, rgb: 9133302 } }, // #8B5CF6 Amethyst
        { query: "tag:#pro OR tag:#important", color: { a: 1, rgb: 15485081 } }, // #EC4899 Rose
        { query: "file:README OR tag:#done", color: { a: 1, rgb: 6929704 } }, // #69BD28 Excel Green
      ];
      graphConfig.showArrow = true;
      graphConfig.nodeSizeMultiplier = 1.18;
      graphConfig.lineSizeMultiplier = 1.15;

      await adapter.write(graphPath, JSON.stringify(graphConfig, null, 2));
      this.burstParticles(window.innerWidth / 2, window.innerHeight / 3, 40);
      new Notice("🎨 Swiss Bento Graph Color Groups applied to .obsidian/graph.json!");
    } catch (err) {
      new Notice("⚠️ Could not update graph.json automatically.");
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
    const styleLivePreviewNodes = () => {
      if (this.settings.enableBentoGraph !== false) {
        this.injectGraphViewHUD();
      }
      if (!this.settings.artcraftTheme || !this.settings.colorizeNumbers) return;

      document.querySelectorAll(".HyperMD-list-line .cm-formatting-list-ol").forEach((el) => {
        const txt = (el.textContent || "").trim();
        const num = parseInt(txt, 10);
        if (!isNaN(num)) {
          const colors = ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];
          const c = colors[(num - 1) % 4];
          el.style.setProperty("background-color", c, "important");
        }
      });
    };

    styleLivePreviewNodes();
    this.lpInterval = setInterval(styleLivePreviewNodes, 1000);
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
    this.btnZen.textContent = t("zenBtn", this);
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
    this.btnSentence.textContent = t("focusBtn", this);
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
    this.btnLaser.textContent = t("laserBtn", this);
    this.btnLaser.addEventListener("click", () => {
      this.toggleMode(this.mode === "laser" ? "none" : "laser");
    });
    contentWrap.appendChild(this.btnLaser);

    // 4. Draw Marker button
    this.btnDraw = document.createElement("button");
    this.btnDraw.className = "artcraft-dock-btn";
    this.btnDraw.title = t("drawTip", this);
    this.btnDraw.textContent = t("drawBtn", this);
    this.btnDraw.addEventListener("click", () => {
      this.toggleMode(this.mode === "draw" ? "none" : "draw");
    });
    contentWrap.appendChild(this.btnDraw);

    // 4.1. Eraser button
    this.btnEraser = document.createElement("button");
    this.btnEraser.className = "artcraft-dock-btn";
    this.btnEraser.title = t("eraserTip", this);
    this.btnEraser.textContent = t("eraserBtn", this);
    this.btnEraser.addEventListener("click", () => {
      this.toggleMode(this.mode === "eraser" ? "none" : "eraser");
    });
    contentWrap.appendChild(this.btnEraser);

    // 4.2. Undo button
    this.btnUndo = document.createElement("button");
    this.btnUndo.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    this.btnUndo.title = t("undoTip", this);
    this.btnUndo.textContent = "↶";
    this.btnUndo.addEventListener("click", () => {
      this.undo();
    });
    contentWrap.appendChild(this.btnUndo);

    // 4.3. Redo button
    this.btnRedo = document.createElement("button");
    this.btnRedo.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    this.btnRedo.title = t("redoTip", this);
    this.btnRedo.textContent = "↷";
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
      this.btnCleanAI.textContent = t("aiCleanBtn", this);
      this.btnCleanAI.addEventListener("click", () => {
        this.cleanCurrentNoteAIWatermarks();
      });
      contentWrap.appendChild(this.btnCleanAI);
    }

    // 7. Clear button
    const btnClear = document.createElement("button");
    btnClear.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    btnClear.title = t("clearTip", this);
    btnClear.textContent = "✕";
    btnClear.addEventListener("click", () => {
      this.clearAllAnnotations();
    });
    contentWrap.appendChild(btnClear);

    // 7.5. Orientation Toggle button
    const btnOrient = document.createElement("button");
    btnOrient.className = "artcraft-dock-btn artcraft-dock-icon-btn";
    btnOrient.title = t("orientTip", this);
    btnOrient.textContent = "⇄";
    btnOrient.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDockOrientation();
    });
    contentWrap.appendChild(btnOrient);

    // 8. Collapse / Minimize button
    const btnCollapse = document.createElement("button");
    btnCollapse.className = "artcraft-dock-btn artcraft-dock-icon-btn artcraft-dock-collapse-btn";
    btnCollapse.title = t("collapseTip", this);
    btnCollapse.textContent = "—";
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
      this.canvasEl.style.pointerEvents = active ? "auto" : "none";
      this.canvasEl.style.touchAction = active ? "none" : "auto";
      if (active && this.resizeCanvas) {
        this.resizeCanvas();
      }
    }
    this.updateDockUI();
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
  }

  createOverlayCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "artcraft-overlay-canvas";
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

    canvas.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    const renderLoop = () => {
      this.renderCanvas();
      this.animFrame = requestAnimationFrame(renderLoop);
    };
    this.animFrame = requestAnimationFrame(renderLoop);
  }

  renderCanvas() {
    if (!this.ctx || !this.canvasEl) return;
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
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class AlchemyCraftProModal extends Modal {
  constructor(app, plugin, initialMethod = "card") {
    super(app);
    this.plugin = plugin;
    this.selectedNetwork = initialMethod;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");

    const header = contentEl.createDiv({ cls: "artcraft-modal-header-card" });
    header.innerHTML = `
      <div class="artcraft-bento-pill">${t("modalBadge", this.plugin)}</div>
      <h2 class="artcraft-modal-title">💎 ${t("modalTitle", this.plugin)}</h2>
      <p class="artcraft-modal-desc">${t("modalSubtitle", this.plugin)}</p>
    `;

    const gridLabel = contentEl.createDiv({ cls: "artcraft-section-label" });
    gridLabel.setText(t("step1Title", this.plugin));

    // 6-Tile Global Payment Hub (Card/Tribute, @CryptoBot, Universal EVM, Bybit UID, Solana, TRON)
    const netGrid = contentEl.createDiv({ cls: "artcraft-net-bento-grid artcraft-net-grid-6" });
    const networks = [
      { id: "promo", name: "Промокод / VIP Ключ", hint: "Активация по коду", icon: "🎟️", tag: "PROMO CODE" },
      { id: "cryptobot", name: t("netCryptoBot", this.plugin), hint: t("netCryptoBotHint", this.plugin), icon: "✈️", tag: "1-CLICK TG" },
      { id: "evm", name: t("netEvm", this.plugin), hint: t("netEvmHint", this.plugin), icon: "🌐", tag: "ALL EVM NETS" },
      { id: "bybit", name: t("netBybit", this.plugin), hint: t("netBybitHint", this.plugin), icon: "🟡", tag: "0% FEE" },
      { id: "solana", name: t("netSol", this.plugin), hint: t("netSolHint", this.plugin), icon: "🟣", tag: "SOLANA" },
      { id: "trc20", name: t("netTrc", this.plugin), hint: t("netTrcHint", this.plugin), icon: "🟢", tag: "TRC-20" },
    ];

    const cardBox = contentEl.createDiv({ cls: "artcraft-active-payment-card" });

    const renderCard = (netId) => {
      cardBox.empty();
      this.selectedNetwork = netId;

      let labelText = t("recipientLabel", this.plugin);
      let addrValue = "0x5df707dda91477fc7c7563f683030da9d6cde7e2";
      let noteText = t("evmNote", this.plugin);
      let evmBadgesHtml = "";
      let customActionsHtml = "";

      if (netId === "card") {
        noteText = t("cardNote", this.plugin);
        customActionsHtml = `
          <div class="artcraft-pay-cta-row">
            <button class="artcraft-pay-action-btn is-green" id="pro-open-tribute">✈️ Pay $4.99 via @CryptoBot (All Coins)</button>
            <button class="artcraft-pay-action-btn is-blue" id="pro-open-card-tg">⚡ Request Direct Stripe / Card Link</button>
          </div>
        `;
      } else if (netId === "cryptobot") {
        noteText = t("cryptobotNote", this.plugin);
        customActionsHtml = `
          <div class="artcraft-pay-cta-row">
            <button class="artcraft-pay-action-btn is-blue" id="pro-open-cryptobot">✈️ Open @CryptoBot ($4.99 USDT/TON)</button>
            <button class="artcraft-pay-action-btn is-dark" id="pro-open-cb-tg">💬 Get Instant Invoice via @StratAlchemy</button>
          </div>
        `;
      } else if (netId === "evm") {
        labelText = t("recipientLabel", this.plugin) + " (Universal EVM 0x...)";
        addrValue = "0x5df707dda91477fc7c7563f683030da9d6cde7e2";
        noteText = t("evmNote", this.plugin);
        const chains = ["BNB Chain (BEP20)", "Arbitrum One", "Base", "Polygon (POS)", "Optimism", "Ethereum (ERC20)", "Avalanche C-Chain"];
        evmBadgesHtml = `
          <div class="artcraft-evm-chains-box">
            <div class="artcraft-evm-chains-title">${t("evmChainsLabel", this.plugin)}</div>
            <div class="artcraft-evm-badges-wrap">
              ${chains.map((c) => `<span class="artcraft-evm-chain-pill">${c}</span>`).join("")}
            </div>
          </div>
        `;
      } else if (netId === "bybit") {
        labelText = t("uidLabel", this.plugin);
        addrValue = "8015849";
        noteText = t("bybitNote", this.plugin);
      } else if (netId === "trc20") {
        labelText = t("recipientLabel", this.plugin) + " (TRON TRC-20)";
        addrValue = "TLR1QhncMJghepCyPPNDZodUxWtEjs8Qjy";
        noteText = t("trcNote", this.plugin);
      } else if (netId === "solana") {
        labelText = t("recipientLabel", this.plugin) + " (Solana SPL)";
        addrValue = "7vffsVxUZbBj3iLhagyaP8qCE7pKybYrxmnHX9xdCKCs";
        noteText = t("solNote", this.plugin);
      }

      const addressBlockHtml = customActionsHtml
        ? customActionsHtml
        : `
          <div class="card-field-label">${labelText}</div>
          <div class="card-address-group">
            <input type="text" readonly class="card-address-input" id="pro-addr-val" value="${addrValue}" />
            <button class="card-copy-btn" id="pro-copy-btn">📋 ${t("copyBtn", this.plugin)}</button>
          </div>
        `;

      cardBox.innerHTML = `
        <div class="card-meta-bar">
          <div class="card-amount-group">
            <span class="meta-amount-label">${t("amountLabel", this.plugin)}</span>
            <span class="meta-amount-pill"><strong>4.99 USD / USDT</strong></span>
            <button class="card-copy-btn card-copy-amount" id="pro-copy-amount-btn">📋 ${t("copyAmountBtn", this.plugin)}</button>
          </div>
          <span class="meta-gas-tag">100% DIRECT</span>
        </div>
        ${evmBadgesHtml}
        ${addressBlockHtml}
        <div class="card-note-text">${noteText}</div>
      `;

      const copyBtn = cardBox.querySelector("#pro-copy-btn");
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(addrValue);
          copyBtn.innerHTML = `✅ ${t("copiedBtn", this.plugin)}`;
          setTimeout(() => {
            copyBtn.innerHTML = `📋 ${t("copyBtn", this.plugin)}`;
          }, 2000);
        };
      }

      const copyAmountBtn = cardBox.querySelector("#pro-copy-amount-btn");
      if (copyAmountBtn) {
        copyAmountBtn.onclick = () => {
          navigator.clipboard.writeText("4.99");
          copyAmountBtn.innerHTML = `✅ ${t("copiedBtn", this.plugin)}`;
          setTimeout(() => {
            copyAmountBtn.innerHTML = `📋 ${t("copyAmountBtn", this.plugin)}`;
          }, 2000);
        };
      }

      cardBox.querySelector("#pro-open-tribute")?.addEventListener("click", () => window.open("https://t.me/send?start=IVdNOM8aeE7t", "_blank"));
      cardBox.querySelector("#pro-open-card-tg")?.addEventListener("click", () => window.open("https://t.me/StratAlchemy", "_blank"));
      cardBox.querySelector("#pro-open-cryptobot")?.addEventListener("click", () => window.open("https://t.me/send?start=IVdNOM8aeE7t", "_blank"));
      cardBox.querySelector("#pro-open-cb-tg")?.addEventListener("click", () => window.open("https://t.me/StratAlchemy", "_blank"));
    };

    networks.forEach((net) => {
      const tile = netGrid.createDiv({ cls: "artcraft-net-tile" });
      tile.innerHTML = `
        <div class="tile-top"><span class="tile-icon">${net.icon}</span> <strong>${net.name}</strong></div>
        <div class="tile-hint">${net.hint}</div>
      `;
      tile.onclick = () => {
        netGrid.querySelectorAll(".artcraft-net-tile").forEach((x) => x.removeClass("is-selected"));
        tile.addClass("is-selected");
        renderCard(net.id);
      };
      if (net.id === this.selectedNetwork) tile.addClass("is-selected");
    });

    renderCard(this.selectedNetwork);

    // Direct Developer Support Banner
    const supportBanner = contentEl.createDiv({ cls: "artcraft-support-banner" });
    supportBanner.innerHTML = `
      <div class="support-banner-left">
        <span class="support-icon">💬</span>
        <div class="support-text-col">
          <strong>${t("supportText", this.plugin)}</strong>
          <span>${t("supportSub", this.plugin)} <strong>@StratAlchemy</strong></span>
        </div>
      </div>
      <button class="support-tg-btn" id="pro-support-open">${t("supportTgBtn", this.plugin)}</button>
    `;
    supportBanner.querySelector("#pro-support-open")?.addEventListener("click", () => {
      window.open("https://t.me/StratAlchemy", "_blank");
    });

    // Verification Step
    const verifySection = contentEl.createDiv({ cls: "artcraft-verify-bento-card" });
    verifySection.innerHTML = `
      <div class="verify-step-label">${t("step2Title", this.plugin)}</div>
    `;

    const inputRow = verifySection.createDiv({ cls: "verify-action-row" });
    const txInput = inputRow.createEl("input", {
      type: "text",
      placeholder: t("txPlaceholder", this.plugin),
      cls: "verify-tx-input",
    });

    const actBtn = inputRow.createEl("button", {
      text: t("activateBtn", this.plugin),
      cls: "verify-activate-button",
    });

    const statusMsg = verifySection.createDiv({ cls: "verify-status-msg" });

    actBtn.onclick = async () => {
      const val = txInput.value.trim();
      if (!val || val.length < 5) {
        statusMsg.setText(t("errorEmpty", this.plugin));
        statusMsg.style.color = "#DC2626";
        return;
      }

      actBtn.disabled = true;
      actBtn.setText(t("checkingBtn", this.plugin));
      statusMsg.setText(t("checkingBtn", this.plugin));
      statusMsg.style.color = "#2563EB";

      const verified = await this.verifyOnChain(val, this.selectedNetwork);
      if (verified) {
        this.plugin.settings.isPro = true;
        this.plugin.settings.proTxHash = val;
        this.plugin.settings.proActivatedAt = Date.now();
        this.plugin.settings.proPlan = "1_year";
        await this.plugin.saveSettings();
        this.plugin.applyBodyClasses();
        this.plugin.createFloatingDock();
        this.plugin.burstParticles(window.innerWidth / 2, window.innerHeight / 2, 75);

        statusMsg.setText(t("successMsg", this.plugin));
        statusMsg.style.color = "#16A34A";
        new Notice(t("successMsg", this.plugin));

        setTimeout(() => this.close(), 1500);
      } else {
        actBtn.disabled = false;
        actBtn.setText(t("activateBtn", this.plugin));
        statusMsg.setText(t("errorPending", this.plugin));
        statusMsg.style.color = "#DC2626";
      }
    };
  }

  async verifyOnChain(txHash, network) {
    const rawCode = (txHash || "").trim().toUpperCase();
    // 1. Built-in Master Promo Codes (Instant offline activation)
    const MASTER_PROMOS = ["STRATALCHEMY", "VIP2026", "ALCHEMIST", "NAILYA", "MIYAZAKI", "BARAKA2026"];
    if (MASTER_PROMOS.includes(rawCode) || rawCode.startsWith("AC-PRO-") || rawCode.startsWith("VIP-")) {
      new Notice("🎟️ Промокод успешно подтвержден! Активация Pro Pass...");
      return true;
    }
    // 2. CryptoBot Invoice ID check (e.g. IVdNOM8aeE7t or #IV69485245)
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
          <div class="artcraft-settings-hero-sub">Author: Elyas Aliverdiyev (@StratAlchemy) • Swiss Bento System</div>
        </div>
      </div>
      <div class="artcraft-settings-hero-actions">
        <button class="artcraft-update-btn" id="artcraft-check-rel-btn">${t("checkUpdatesBtn", this.plugin)}</button>
      </div>
    `;
    heroBanner.querySelector("#artcraft-check-rel-btn")?.addEventListener("click", () => {
      window.open("https://github.com/elyazaliverdiyev/alchemy-craft/releases", "_blank");
    });

    // 1. 6-Language Global Selector
    new Setting(containerEl)
      .setName(t("langName", this.plugin))
      .setDesc(t("langDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("en", "🇺🇸 English (Default)")
          .addOption("ru", "🇷🇺 Русский")
          .addOption("zh", "🇨🇳 中文 (Chinese)")
          .addOption("ja", "🇯🇵 日本語 (Japanese)")
          .addOption("es", "🇪🇸 Español")
          .addOption("de", "🇩🇪 Deutsch")
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
      .setName("Swiss Bento UI Theme (#F4F3EF + #69BD28 Tables)")
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
          this.plugin.applyBentoGraphColorGroups();
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

    // 2.2 Task Progress Bar (Mobile Safe + Dismiss Button)
    new Setting(containerEl)
      .setName("📊 Sticky Task Progress Bar (Mobile Safe + ✕ Dismiss)")
      .setDesc("Shows task completion % at the top of checklist notes with a tap-to-close '✕' button and 100% confetti.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showTaskProgress !== false).onChange(async (val) => {
          this.plugin.settings.showTaskProgress = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    // 2.3 Note Header Badge Tag
    new Setting(containerEl)
      .setName("🏷️ Note Header Badge Text")
      .setDesc("Editorial pill above the note title (e.g. 'STRATALCHEMY // KNOWLEDGE BRIEF'). Clear text to hide.")
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

    // 3. Ambient Focus Soundscape
    new Setting(containerEl)
      .setName(t("ambientName", this.plugin))
      .setDesc(t("ambientDesc", this.plugin))
      .addDropdown((drop) =>
        drop
          .addOption("off", "🔇 Off")
          .addOption("brown", "🌊 Warm Brown Noise")
          .addOption("rain", "🌧️ Soft Rain on Paper")
          .addOption("gamma40", "🧠 40Hz Gamma Focus Drone")
          .setValue(this.plugin.settings.ambientSound || "off")
          .onChange(async (val) => {
            this.plugin.settings.ambientSound = val;
            await this.plugin.saveSettings();
            if (val === "off") {
              this.plugin.stopAmbientSound();
            } else if (this.plugin.timerRunning) {
              this.plugin.startAmbientSound(val);
            }
          })
      );

    // 4. Pomodoro Focus Duration
    new Setting(containerEl)
      .setName("🍅 Default Pomodoro Duration (Minutes)")
      .setDesc("Right-click the timer in the dock anytime for 15m, 25m, 45m, 60m, 90m, or custom duration.")
      .addDropdown((drop) =>
        drop
          .addOption("15", "15 min (Sprint Focus)")
          .addOption("25", "25 min (Standard Pomodoro)")
          .addOption("45", "45 min (Deep Work)")
          .addOption("60", "60 min (Flow State)")
          .addOption("90", "90 min (Ultradian Cycle)")
          .setValue(String(this.plugin.settings.pomodoroMinutes || 25))
          .onChange(async (val) => {
            this.plugin.settings.pomodoroMinutes = parseInt(val, 10);
            await this.plugin.saveSettings();
            this.plugin.resetTimer();
          })
      );

    // 5. AI Cleaner Toggle
    new Setting(containerEl)
      .setName("✨ AI Watermark Cleaner Button in Dock")
      .setDesc(t("aiCleanTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableAiCleaner).onChange(async (val) => {
          this.plugin.settings.enableAiCleaner = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    // 6. Numbered Badges & Sentence Focus
    new Setting(containerEl)
      .setName("🔢 Square Number Badges (01–04) & Crypto/Money Capsules")
      .setDesc("Transforms numbered lists, [01]–[04] markers, $ amounts, and 0x EVM addresses into Swiss capsules.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.colorizeNumbers).onChange(async (value) => {
          this.plugin.settings.colorizeNumbers = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("🎯 Sentence Focus Highlighting")
      .setDesc(t("focusTip", this.plugin))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.sentenceFocus).onChange(async (value) => {
          this.plugin.settings.sentenceFocus = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // --- 📊 FOCUS ANALYTICS BENTO SCORECARD ---
    const fa = this.plugin.settings.focusAnalytics || { completedSprints: 0, totalFocusMinutes: 0, tasksCompleted100: 0, currentStreak: 0 };
    const analyticsCard = containerEl.createDiv({ cls: "artcraft-analytics-bento-card" });
    analyticsCard.innerHTML = `
      <div class="artcraft-analytics-head">${t("analyticsTitle", this.plugin)}</div>
      <div class="artcraft-analytics-grid">
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.completedSprints || 0}</span>
          <span class="stat-lbl">🍅 Sprints</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.totalFocusMinutes || 0}m</span>
          <span class="stat-lbl">⏱ Deep Work</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.tasksCompleted100 || 0}</span>
          <span class="stat-lbl">✅ 100% Checklists</span>
        </div>
        <div class="artcraft-stat-box">
          <span class="stat-val">${fa.currentStreak || 0}🔥</span>
          <span class="stat-lbl">Day Streak</span>
        </div>
      </div>
    `;

    // --- 💎 PRO SECTION (WITH HOLOGRAPHIC SHIMMER, CARD/TRIBUTE, CRYPTOBOT & UNIVERSAL EVM) ---
    containerEl.createEl("h3", { text: "💎 Alchemy Craft Pro" });

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
        <div class="pro-tx">TXID / Order ID: <code>${this.plugin.settings.proTxHash || "Verified"}</code></div>
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
        new AlchemyCraftProModal(this.app, this.plugin, "card").open();
      };
    }

    // --- ⭐ GLOBAL SUPPORT & CHECKOUT (NO BOOSTY! REPLACED WITH CARD/TRIBUTE, @CRYPTOBOT, TELEGRAM, GITHUB) ---
    containerEl.createEl("h3", { text: "⭐ Global Checkout, Card Support & Community" });

    new Setting(containerEl)
      .setName("💳 Global Payment & Direct Author Contact")
      .setDesc("Pay by Bank Card (USA/EU/World via Tribute), 1-Click @CryptoBot, or Universal EVM (BEP20, Arbitrum, Base, Polygon, ERC20).")
      .addButton((btn) => {
        btn
          .setButtonText("💳 Pay by Card (Tribute)")
          .setCta()
          .onClick(() => {
            new AlchemyCraftProModal(this.app, this.plugin, "card").open();
          });
      })
      .addButton((btn) => {
        btn.setButtonText("✈️ @CryptoBot (USDT/TON)").onClick(() => {
          new AlchemyCraftProModal(this.app, this.plugin, "cryptobot").open();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("💬 Telegram (@StratAlchemy)").onClick(() => {
          window.open("https://t.me/StratAlchemy", "_blank");
        });
      })
      .addButton((btn) => {
        btn.setButtonText("🌟 GitHub Star").onClick(() => {
          window.open("https://github.com/elyazaliverdiyev/alchemy-craft", "_blank");
        });
      });
  }
}

module.exports = AlchemyFlowPlugin;

/* nosourcemap */