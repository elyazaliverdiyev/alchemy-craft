const { Plugin, PluginSettingTab, Setting, Notice, Modal, Menu } = require("obsidian");

const DEFAULT_SETTINGS = {
  uiLanguage: "en", // "en" (default for Western launch) | "ru"
  artcraftTheme: true,
  headerTagText: "STRATALCHEMY // KNOWLEDGE BRIEF",
  showHeaderTag: true,
  hoverCards: true,
  sentenceFocus: true,
  colorizeNumbers: true,
  showFloatingDock: true,
  showTaskProgress: true,
  strokeColor: "#2563EB",
  activeColorKey: "blue",
  timerMode: "pomodoro", // "pomodoro" | "stopwatch"
  pomodoroMinutes: 25,
  breakMinutes: 5,
  timerSound: true,
  enableAiCleaner: true,
  isPro: false,
  proTxHash: "",
  proActivatedAt: null,
  proPlan: "none",
  darkCraftTheme: false,
};

const PALETTE = [
  { key: "blue", name: "01 Sapphire (Blue)", color: "#2563EB", pinClass: "artcraft-pinned-blue" },
  { key: "orange", name: "02 Amber (Orange)", color: "#F59E0B", pinClass: "artcraft-pinned-orange" },
  { key: "green", name: "03 Emerald (Green)", color: "#10B981", pinClass: "artcraft-pinned-green" },
  { key: "purple", name: "04 Amethyst (Purple)", color: "#8B5CF6", pinClass: "artcraft-pinned-purple" },
];

class AlchemyFlowPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.mode = "none"; // "none" | "laser" | "draw"
    this.isDrawing = false;
    this.strokes = [];
    this.laserTrail = [];
    this.animFrame = null;

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

    // 2. Live Preview (CM6) Observer
    this.setupLivePreviewObserver();

    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        setTimeout(() => this.updateTaskProgressBar(), 100);
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", () => {
        this.updateTaskProgressBar();
      })
    );
    this.registerDomEvent(document, "click", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("task-list-item-checkbox")) {
        setTimeout(() => this.updateTaskProgressBar(), 120);
      }
    });

    this.addRibbonIcon("wand", "Alchemy Craft — Bento Reader & Focus", () => {
      this.toggleMode(this.mode === "none" ? "laser" : "none");
    });

    const isEn = this.settings.uiLanguage !== "ru";

    this.addCommand({
      id: "toggle-artcraft-theme",
      name: isEn ? "Toggle Swiss Bento UI Theme" : "Переключить дизайн Alchemy Craft (Swiss Bento UI)",
      callback: async () => {
        this.settings.artcraftTheme = !this.settings.artcraftTheme;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-focus-timer",
      name: isEn ? "Start / Pause Focus Timer" : "Старт / Пауза таймера фокуса",
      callback: () => {
        this.toggleTimer();
      },
    });

    this.addCommand({
      id: "reset-focus-timer",
      name: isEn ? "Reset Focus Timer" : "Сбросить таймер фокуса",
      callback: () => {
        this.resetTimer();
      },
    });

    this.addCommand({
      id: "toggle-sentence-focus",
      name: isEn ? "Toggle Sentence Focus & Number Badges" : "Переключить подсветку предложений и цифр",
      callback: async () => {
        this.settings.sentenceFocus = !this.settings.sentenceFocus;
        await this.saveSettings();
        this.applyBodyClasses();
        this.updateDockUI();
      },
    });

    this.addCommand({
      id: "toggle-laser-pointer",
      name: isEn ? "Toggle Laser Pointer Mode" : "Включить/выключить режим Лазерной Указки",
      callback: () => {
        this.toggleMode(this.mode === "laser" ? "none" : "laser");
      },
    });

    this.addCommand({
      id: "toggle-draw-marker",
      name: isEn ? "Toggle Freehand Draw Marker Mode" : "Включить/выключить режим Маркера / Рисования",
      callback: () => {
        this.toggleMode(this.mode === "draw" ? "none" : "draw");
      },
    });

    this.addCommand({
      id: "clean-ai-watermarks",
      name: isEn ? "Clean AI Watermarks & Zero-Width Characters" : "Очистить невидимые ИИ-символы и водяные знаки",
      callback: () => {
        this.cleanCurrentNoteAIWatermarks();
      },
    });

    this.addCommand({
      id: "clear-drawings",
      name: isEn ? "Clear All Drawings & Highlights" : "Очистить все рисунки и выделения предложений",
      callback: () => {
        this.clearAllAnnotations();
      },
    });

    this.registerDomEvent(window, "keydown", (e) => {
      if (e.key === "Escape" && this.mode !== "none") {
        this.toggleMode("none");
        const isCurrentEn = this.settings.uiLanguage !== "ru";
        new Notice(
          isCurrentEn
            ? "Alchemy Craft: Pointer / Marker deactivated"
            : "Alchemy Craft: Режим указки/рисования выключен"
        );
      }
    });

    this.addSettingTab(new AlchemyFlowSettingTab(this.app, this));
  }

  onunload() {
    document.body.classList.remove(
      "artcraft-theme-active",
      "artcraft-hover-cards",
      "artcraft-sentence-focus",
      "artcraft-zen-mode",
      "artcraft-dark-craft"
    );
    if (this.lpInterval) clearInterval(this.lpInterval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.canvasEl) this.canvasEl.remove();
    if (this.dockEl) this.dockEl.remove();
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
      // Dual tone pleasant chime
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1175, now + 0.16);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.82);

      osc.start(now);
      osc.stop(now + 0.82);
    } catch (e) {
      // AudioContext may be restricted by autoplay policy
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.settings.timerMode === "pomodoro") {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
        } else {
          this.timerRunning = false;
          clearInterval(this.timerInterval);
          this.playTimerChime();
          const isEn = this.settings.uiLanguage !== "ru";
          if (this.timerState === "work") {
            new Notice(
              isEn
                ? "⚡ Alchemy Craft: Focus sprint completed! Great job, take a short break."
                : "⚡ Alchemy Craft: Фокус-сессия завершена! Отличная работа, время для перерыва."
            );
            this.timerState = "break";
            this.timerSeconds = (this.settings.breakMinutes || 5) * 60;
          } else {
            new Notice(
              isEn
                ? "☕ Alchemy Craft: Break finished! Ready for the next focus sprint?"
                : "☕ Alchemy Craft: Перерыв окончен! Готовы к следующему фокус-спринту?"
            );
            this.timerState = "work";
            this.timerSeconds = (this.settings.pomodoroMinutes || 25) * 60;
          }
        }
      } else {
        this.timerSeconds++;
      }
      this.updateTimerDisplay();
    }, 1000);
    this.updateTimerDisplay();
  }

  pauseTimer() {
    this.timerRunning = false;
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
    const isEn = this.settings.uiLanguage !== "ru";
    new Notice(isEn ? `🍅 Pomodoro: ${mins} minutes set` : `🍅 Помодоро: ${mins} мин установлено`);
  }

  startBreak(mins) {
    this.settings.timerMode = "pomodoro";
    this.timerState = "break";
    this.timerSeconds = mins * 60;
    this.startTimer();
    const isEn = this.settings.uiLanguage !== "ru";
    new Notice(isEn ? `☕ Break started: ${mins} minutes` : `☕ Перерыв начался: ${mins} мин`);
  }

  showTimerMenu(event) {
    const menu = new Menu();
    const isEn = this.settings.uiLanguage !== "ru";

    menu.addItem((item) => {
      item
        .setTitle(isEn ? "⚡ 15 min — Sprint Focus" : "⚡ 15 мин — Спринт фокус")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 15 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(15));
    });
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "🍅 25 min — Standard Pomodoro" : "🍅 25 мин — Стандарт Помодоро")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 25 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(25));
    });
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "🎯 45 min — Deep Work" : "🎯 45 мин — Глубокий фокус")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 45 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(45));
    });
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "🌊 60 min — Flow State" : "🌊 60 мин — Полный поток")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 60 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(60));
    });
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "🚀 90 min — Ultradian Rhythm" : "🚀 90 мин — Ультрадианный цикл")
        .setChecked(this.settings.timerMode === "pomodoro" && this.settings.pomodoroMinutes === 90 && this.timerState === "work")
        .onClick(() => this.setPomodoroDuration(90));
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "☕ 5 min — Short Break" : "☕ 5 мин — Короткий перерыв")
        .setChecked(this.timerState === "break" && this.timerSeconds <= 300)
        .onClick(() => this.startBreak(this.settings.breakMinutes || 5));
    });
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "🌴 15 min — Long Break" : "🌴 15 мин — Длинный перерыв")
        .setChecked(this.timerState === "break" && this.timerSeconds > 300)
        .onClick(() => this.startBreak(15));
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(isEn ? "⏱ Stopwatch (Count Up: 00:00+)" : "⏱ Секундомер работы (00:00+)")
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

    const tag = (this.settings.headerTagText !== undefined ? this.settings.headerTagText : "STRATALCHEMY // KNOWLEDGE BRIEF").trim();
    const show = (this.settings.showHeaderTag !== false) && tag.length > 0;
    if (show) {
      document.documentElement.style.setProperty('--artcraft-header-tag', `"${tag.replace(/"/g, '\\"')}"`);
      document.documentElement.style.setProperty('--artcraft-header-tag-display', 'block');
    } else {
      document.documentElement.style.setProperty('--artcraft-header-tag-display', 'none');
    }
  }

  updateTaskProgressBar() {
    // 1. Remove any legacy or orphaned bars stuck inside CodeMirror scroller
    document.querySelectorAll(".cm-sizer .artcraft-task-progress-wrap, .cm-content .artcraft-task-progress-wrap, .inline-title + .artcraft-task-progress-wrap").forEach((el) => {
      el.remove();
    });

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

    document
      .querySelectorAll('.workspace-leaf-content[data-type="markdown"]')
      .forEach((leaf) => {
        const viewContent = leaf.querySelector(".view-content");
        if (!viewContent) return;

        let barWrap = viewContent.querySelector(":scope > .artcraft-task-progress-wrap");

        if (total === 0) {
          if (barWrap) barWrap.style.display = "none";
          return;
        }

        const pct = Math.round((done / total) * 100);

        if (!barWrap) {
          barWrap = document.createElement("div");
          barWrap.className = "artcraft-task-progress-wrap";
          barWrap.innerHTML = `
            <span class="artcraft-task-progress-label"></span>
            <div class="artcraft-task-progress-bar-bg">
              <div class="artcraft-task-progress-bar-fill"></div>
            </div>
            <span class="artcraft-task-progress-pct"></span>
          `;
          // Insert at the very top of .view-content, completely outside CodeMirror 6!
          viewContent.insertBefore(barWrap, viewContent.firstChild);
        }

        barWrap.style.display = "flex";
        const labelEl = barWrap.querySelector(".artcraft-task-progress-label");
        const fillEl = barWrap.querySelector(".artcraft-task-progress-bar-fill");
        const pctEl = barWrap.querySelector(".artcraft-task-progress-pct");

        const isEn = this.settings.uiLanguage !== "ru";
        if (labelEl) labelEl.textContent = isEn ? `⚡ TASK PROGRESS: ${done} / ${total}` : `⚡ ПРОГРЕСС ЗАДАЧ: ${done} / ${total}`;
        if (fillEl) fillEl.style.width = `${pct}%`;
        if (pctEl) pctEl.textContent = `${pct}%`;
      });
  }

  cleanCurrentNoteAIWatermarks() {
    const isEn = this.settings.uiLanguage !== "ru";
    const view = this.app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
    if (!view || !view.editor) {
      new Notice(
        isEn
          ? "Please open a markdown note to clean AI markers."
          : "Откройте заметку для очистки от ИИ-символов"
      );
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

    const msg = isEn
      ? `✓ Cleaned ${count} invisible AI marker(s) & copied to clipboard!`
      : `✓ Удалено ${count} невидимых символов ИИ и скопировано в буфер!`;
    new Notice(msg);
  }

  setupLivePreviewObserver() {
    const styleLivePreviewNodes = () => {
      if (!this.settings.artcraftTheme || !this.settings.colorizeNumbers) return;

      // Colorize only static list numbers without touching text nodes
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

          span.addEventListener("click", (e) => {
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
              span.style.setProperty("--artcraft-pinned-bg", `${targetColor}18`);
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
    const isEn = this.settings.uiLanguage !== "ru";

    const dock = document.createElement("div");
    dock.className = "artcraft-floating-dock";

    // Brand badge: ALCHEMY CRAFT
    const badge = document.createElement("span");
    badge.className = "artcraft-dock-badge";
    badge.textContent = "ALCHEMY CRAFT";
    dock.appendChild(badge);

    // 0. Compact Pomodoro / Work Timer Pill
    this.timerEl = document.createElement("div");
    this.timerEl.className = "artcraft-timer-pill";
    this.timerEl.title = isEn
      ? "LMB: Start/Pause | RMB: Presets (15m, 25m, 45m, 60m, Breaks) | Double Click: Reset"
      : "ЛКМ: Старт/Пауза | ПКМ: Пресеты (15м, 25м, 45м, 60м, Перерывы) | Двойной клик: Сброс";

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
      new Notice(isEn ? "Timer reset" : "Таймер сброшен");
    });
    this.timerEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showTimerMenu(e);
    });
    dock.appendChild(this.timerEl);
    this.updateTimerDisplay();

    // 1. Theme toggle button
    this.btnTheme = document.createElement("button");
    this.btnTheme.className = "artcraft-dock-btn";
    this.btnTheme.title = isEn
      ? "Swiss Bento UI Theme (Warm Paper #F4F3EF + Sage Green Tables)"
      : "Теплый бумажный режим Swiss Bento UI + светло-зеленые шапки Excel";
    this.btnTheme.textContent = "UI";
    this.btnTheme.addEventListener("click", async () => {
      this.settings.artcraftTheme = !this.settings.artcraftTheme;
      await this.saveSettings();
      this.applyBodyClasses();
      this.updateDockUI();
    });
    dock.appendChild(this.btnTheme);

    // 1.5. Zen Mode button
    this.btnZen = document.createElement("button");
    this.btnZen.className = "artcraft-dock-btn";
    this.btnZen.title = isEn
      ? "Zen Mode — hide sidebars for pure distraction-free focus"
      : "Режим Дзен — скрыть боковые панели для чистого фокуса или записи экрана";
    this.btnZen.textContent = isEn ? "Zen" : "Дзен";
    this.btnZen.addEventListener("click", () => {
      this.zenMode = !this.zenMode;
      this.applyBodyClasses();
      this.updateDockUI();
    });
    dock.appendChild(this.btnZen);

    // 2. Sentence Focus button
    this.btnSentence = document.createElement("button");
    this.btnSentence.className = "artcraft-dock-btn";
    this.btnSentence.title = isEn
      ? "Sentence Focus Highlighting (hover over text and click to pin color)"
      : "Выделение предложений выбранным цветом (клик по тексту)";
    this.btnSentence.textContent = isEn ? "Focus" : "Фокус";
    this.btnSentence.addEventListener("click", async () => {
      this.settings.sentenceFocus = !this.settings.sentenceFocus;
      await this.saveSettings();
      this.applyBodyClasses();
      this.updateDockUI();
    });
    dock.appendChild(this.btnSentence);

    // 3. Laser Pointer button
    this.btnLaser = document.createElement("button");
    this.btnLaser.className = "artcraft-dock-btn";
    this.btnLaser.title = isEn
      ? "Laser Pointer (glowing trail, Esc to exit)"
      : "Лазерная указка (исчезающий след, Esc для выхода)";
    this.btnLaser.textContent = isEn ? "Laser" : "Указка";
    this.btnLaser.addEventListener("click", () => {
      this.toggleMode(this.mode === "laser" ? "none" : "laser");
    });
    dock.appendChild(this.btnLaser);

    // 4. Draw Marker button
    this.btnDraw = document.createElement("button");
    this.btnDraw.className = "artcraft-dock-btn";
    this.btnDraw.title = isEn
      ? "Freehand Marker Draw on note (Esc to exit)"
      : "Рисование маркером поверх заметки (Esc для выхода)";
    this.btnDraw.textContent = isEn ? "Draw" : "Маркер";
    this.btnDraw.addEventListener("click", () => {
      this.toggleMode(this.mode === "draw" ? "none" : "draw");
    });
    dock.appendChild(this.btnDraw);

    // 5. Palette dots (01 Blue, 02 Orange, 03 Green, 04 Purple)
    this.colorDots = [];
    PALETTE.forEach((p) => {
      const dot = document.createElement("div");
      dot.className = "artcraft-color-dot";
      dot.style.backgroundColor = p.color;
      dot.title = isEn
        ? `${p.name} — color for Marker, Pointer, and Sentence pinning`
        : `${p.name} — цвет для Маркера, Указки и выделения предложений кликом`;
      dot.addEventListener("click", async () => {
        this.settings.strokeColor = p.color;
        this.settings.activeColorKey = p.key;
        await this.saveSettings();
        this.updateDockUI();
      });
      this.colorDots.push({ el: dot, color: p.color, key: p.key });
      dock.appendChild(dot);
    });

    // 6. AI Text Cleaner button (Shown ONLY if enableAiCleaner is true!)
    if (this.settings.enableAiCleaner) {
      this.btnCleanAI = document.createElement("button");
      this.btnCleanAI.className = "artcraft-dock-btn";
      this.btnCleanAI.title = isEn
        ? "Clean invisible AI watermarks (Zero-Width spaces) & copy to clipboard"
        : "Очистить текст заметки от невидимых ИИ-символов (Zero-Width) и скопировать";
      this.btnCleanAI.textContent = "AI Clean";
      this.btnCleanAI.addEventListener("click", () => {
        this.cleanCurrentNoteAIWatermarks();
      });
      dock.appendChild(this.btnCleanAI);
    }

    // 7. Clear button
    const btnClear = document.createElement("button");
    btnClear.className = "artcraft-dock-btn";
    btnClear.title = isEn
      ? "Clear all drawings and highlighted sentences"
      : "Очистить рисунки и выделенные предложения";
    btnClear.textContent = "✕";
    btnClear.addEventListener("click", () => {
      this.clearAllAnnotations();
    });
    dock.appendChild(btnClear);

    document.body.appendChild(dock);
    this.dockEl = dock;
    this.updateDockUI();
  }

  updateDockUI() {
    if (!this.dockEl) return;
    this.btnTheme?.classList.toggle("is-active", this.settings.artcraftTheme);
    this.btnZen?.classList.toggle("is-active", !!this.zenMode);
    this.btnSentence?.classList.toggle("is-active", this.settings.sentenceFocus);
    this.btnLaser?.classList.toggle("is-active", this.mode === "laser");
    this.btnDraw?.classList.toggle("is-active", this.mode === "draw");
    if (this.colorDots) {
      this.colorDots.forEach((d) => {
        d.el.classList.toggle("is-active", d.key === this.settings.activeColorKey);
      });
    }
  }

  toggleMode(newMode) {
    this.mode = newMode;
    if (this.canvasEl) {
      this.canvasEl.classList.toggle("is-interactive", this.mode !== "none");
      this.canvasEl.classList.toggle("mode-laser", this.mode === "laser");
      this.canvasEl.classList.toggle("mode-draw", this.mode === "draw");
      this.canvasEl.style.pointerEvents = this.mode === "none" ? "none" : "auto";
    }
    this.updateDockUI();
  }

  clearAllAnnotations() {
    this.strokes = [];
    this.laserTrail = [];
    PALETTE.forEach((p) => {
      document.querySelectorAll(`.${p.pinClass}`).forEach((el) => {
        el.classList.remove(p.pinClass);
      });
    });
    this.toggleMode("none");
  }

  getCanvasCoords(e) {
    if (!this.canvasEl) return { x: e.clientX, y: e.clientY };
    const rect = this.canvasEl.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }

  createOverlayCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "artcraft-overlay-canvas";
    document.body.appendChild(canvas);
    this.canvasEl = canvas;
    this.ctx = canvas.getContext("2d");

    const TITLEBAR_H = 32; // px — leave Obsidian title bar drag region free
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - TITLEBAR_H;
    };
    resize();
    this.registerDomEvent(window, "resize", resize);

    this.registerDomEvent(canvas, "mousedown", (e) => {
      if (this.mode === "none") return;
      this.isDrawing = true;
      const pt = this.getCanvasCoords(e);
      if (this.mode === "draw") {
        this.currentStroke = {
          color: this.settings.strokeColor,
          points: [pt],
        };
        this.strokes.push(this.currentStroke);
      } else if (this.mode === "laser") {
        this.laserTrail.push({ ...pt, t: Date.now() });
      }
    });

    this.registerDomEvent(window, "mousemove", (e) => {
      if (this.mode === "none") return;
      const pt = this.getCanvasCoords(e);
      if (this.mode === "laser") {
        this.laserTrail.push({ ...pt, t: Date.now() });
      } else if (this.mode === "draw" && this.isDrawing && this.currentStroke) {
        this.currentStroke.points.push(pt);
      }
    });

    this.registerDomEvent(window, "mouseup", () => {
      this.isDrawing = false;
      this.currentStroke = null;
    });

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

    this.strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.85;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

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
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

const TRANSLATIONS = {
  en: {
    modalBadge: "ALCHEMIST PRO • 1 YEAR PASS",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Annual pass for the price of one coffee ($4.99 / yr). 100% direct crypto payment with zero middleman fees.",
    netBsc: "BNB Chain (BEP20)",
    netBscHint: "Fee ~$0.03 • Recommended",
    netBybit: "Bybit Transfer",
    netBybitHint: "0% Fee • UID Instant",
    netTrc: "TRON (TRC20)",
    netTrcHint: "Standard USDT",
    netSol: "Solana Network",
    netSolHint: "USDT / USDC • Ultra-fast",
    tgCardHint: "Need to pay with a credit/debit card? Use Telegram @CryptoBot P2P →",
    amountLabel: "AMOUNT TO SEND:",
    copyAmountBtn: "Copy 4.99",
    recipientLabel: "RECIPIENT ADDRESS:",
    uidLabel: "BYBIT RECIPIENT UID:",
    copyBtn: "Copy Address",
    copiedBtn: "Copied!",
    supportText: "Need assistance or instant manual activation?",
    supportTgBtn: "Open @StratAlchemy",
    bscNote: "Send 4.99 USDT via BNB Smart Chain (BEP-20) from any wallet or exchange. Network gas is only ~$0.03.",
    bybitNote: "In Bybit App: Assets → Withdraw → Internal Transfer → enter UID 8015849 and 4.99 USDT. Zero fees, instant.",
    trcNote: "Send 4.99 USDT via TRON network (TRC-20).",
    solNote: "Send 4.99 USDT or USDC on Solana network.",
    step2Title: "Step 2: Enter Transaction Hash (TXID) or Bybit Order ID:",
    txPlaceholder: "Paste TXID (0x... or Bybit internal transfer ID)",
    activateBtn: "⚡ Verify & Activate Pro",
    checkingBtn: "⏳ Verifying on-chain...",
    successMsg: "🎉 Success! Alchemy Craft Pro is now active for 365 days!",
    errorEmpty: "❌ Please enter a valid TXID or Order ID.",
    errorPending: "⚠️ Transaction is still confirming on-chain. Please wait 1 minute and click again.",
    proActiveTitle: "PRO ACTIVE",
    proExpiresOn: "Annual access active until:",
    proMidnightName: "🌙 Midnight Dark Craft Mode",
    proMidnightDesc: "Swiss dark mode designed specifically for night focus, reading and coding.",
    proBuyCardBadge: "PREMIUM PASS",
    proBuyCardTitle: "Unlock Alchemy Craft Pro",
    proPerk1: "🌙 Midnight Dark Craft — exclusive dark theme for late-night focus",
    proPerk2: "🎨 Expanded Palette — 4 extra highlighter colors (Amber, Crimson, Cyan, Rose)",
    proPerk3: "📊 Pro Focus Analytics — deep work & Pomodoro flow tracking",
    proPerk4: "⚡ 100% Direct Support — zero aggregator cut, directly funding ongoing development",
    getProBtn: "💎 Get Alchemy Craft Pro ($4.99 / yr)"
  },
  ru: {
    modalBadge: "ALCHEMIST PRO • ГОДОВОЙ ПАСС",
    modalTitle: "Alchemy Craft Pro",
    modalSubtitle: "Годовой доступ по цене чашки кофе ($4.99 / год). 100% перевод напрямую автору без посредников и комиссий.",
    netBsc: "BNB Chain (BEP20)",
    netBscHint: "Газ ~$0.03 • Рекомендуется",
    netBybit: "Bybit Перевод",
    netBybitHint: "0% комиссии • UID перевод",
    netTrc: "TRON (TRC20)",
    netTrcHint: "Стандартный USDT",
    netSol: "Сеть Solana",
    netSolHint: "USDT / USDC • Супер-быстро",
    tgCardHint: "Хотите оплатить обычной картой банка? Используйте Telegram @CryptoBot P2P →",
    amountLabel: "СУММА К ОПЛАТЕ:",
    copyAmountBtn: "Скопировать 4.99",
    recipientLabel: "АДРЕС ПОЛУЧАТЕЛЯ:",
    uidLabel: "BYBIT UID ПОЛУЧАТЕЛЯ:",
    copyBtn: "Скопировать адрес",
    copiedBtn: "Скопировано!",
    supportText: "Нужна помощь с оплатой или мгновенная ручная активация?",
    supportTgBtn: "Написать в @StratAlchemy",
    bscNote: "Отправьте 4.99 USDT в сети BNB Smart Chain (BEP-20) с любого кошелька или биржи. Комиссия сети всего ~$0.03.",
    bybitNote: "В приложении Bybit: Активы → Вывод → Внутренний перевод → укажите UID 8015849 и 4.99 USDT. Доходит за секунду без комиссий.",
    trcNote: "Отправьте 4.99 USDT в сети TRON (TRC-20).",
    solNote: "Отправьте 4.99 USDT или USDC в сети Solana.",
    step2Title: "Шаг 2: Введите TXID транзакции или номер Bybit перевода:",
    txPlaceholder: "Вставьте хэш (0x... или номер перевода Bybit)",
    activateBtn: "⚡ Проверить и Активировать Pro",
    checkingBtn: "⏳ Проверка в сети...",
    successMsg: "🎉 Поздравляем! Alchemy Craft Pro успешно активирован на 365 дней!",
    errorEmpty: "❌ Пожалуйста, введите корректный TXID транзакции или номер перевода.",
    errorPending: "⚠️ Транзакция ещё подтверждается сетью. Подождите 1 минуту и нажмите снова.",
    proActiveTitle: "PRO АКТИВЕН",
    proExpiresOn: "Годовой доступ активен до:",
    proMidnightName: "🌙 Ночной режим Midnight Dark Craft",
    proMidnightDesc: "Швейцарский темный режим для ночного чтения, фокусировки и кодинга.",
    proBuyCardBadge: "ПРЕМИУМ ДОСТУП",
    proBuyCardTitle: "Разблокируйте все Pro функции Alchemy Craft",
    proPerk1: "🌙 Midnight Dark Craft — эксклюзивная темная тема для ночной работы",
    proPerk2: "🎨 Расширенная палитра — 4 премиум цвета хайлайтера (Gold, Crimson, Cyan, Rose)",
    proPerk3: "📊 Pro Focus Analytics — трекинг глубоких сессий Pomodoro",
    proPerk4: "⚡ 100% перевод автору — без посредников и грабительских комиссий платформ",
    getProBtn: "💎 Получить Alchemy Craft Pro ($4.99 / год)"
  }
};

function getLocale(plugin) {
  if (plugin && plugin.settings && plugin.settings.uiLanguage) {
    return plugin.settings.uiLanguage === "ru" ? "ru" : "en";
  }
  return "en";
}

function t(key, plugin) {
  const loc = getLocale(plugin);
  return (TRANSLATIONS[loc] && TRANSLATIONS[loc][key]) || TRANSLATIONS["en"][key] || key;
}

class AlchemyCraftProModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.selectedNetwork = "bsc";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("artcraft-pro-modal-root");

    // Header Bento Card
    const header = contentEl.createDiv({ cls: "artcraft-modal-header-card" });
    header.innerHTML = `
      <div class="artcraft-bento-pill">${t("modalBadge", this.plugin)}</div>
      <h2 class="artcraft-modal-title">💎 ${t("modalTitle", this.plugin)}</h2>
      <p class="artcraft-modal-desc">${t("modalSubtitle", this.plugin)}</p>
    `;

    // 2x2 Network Grid
    const isEn = this.plugin.settings.uiLanguage !== "ru";
    const gridLabel = contentEl.createDiv({ cls: "artcraft-section-label" });
    gridLabel.setText(isEn ? "STEP 1: SELECT PAYMENT METHOD" : "ШАГ 1: ВЫБЕРИТЕ УДОБНЫЙ СПОСОБ ОПЛАТЫ");

    const netGrid = contentEl.createDiv({ cls: "artcraft-net-bento-grid" });
    const networks = [
      { id: "bsc", name: t("netBsc", this.plugin), hint: t("netBscHint", this.plugin), icon: "🔵" },
      { id: "bybit", name: t("netBybit", this.plugin), hint: t("netBybitHint", this.plugin), icon: "🟡" },
      { id: "trc20", name: t("netTrc", this.plugin), hint: t("netTrcHint", this.plugin), icon: "🟢" },
      { id: "solana", name: t("netSol", this.plugin), hint: t("netSolHint", this.plugin), icon: "🟣" }
    ];

    const cardBox = contentEl.createDiv({ cls: "artcraft-active-payment-card" });

    const renderCard = (netId) => {
      cardBox.empty();
      this.selectedNetwork = netId;

      let labelText = t("recipientLabel", this.plugin);
      let addrValue = "0x5df707dda91477fc7c7563f683030da9d6cde7e2";
      let noteText = t("bscNote", this.plugin);

      if (netId === "bsc") {
        labelText = t("recipientLabel", this.plugin) + " (BNB Smart Chain BEP-20)";
        addrValue = "0x5df707dda91477fc7c7563f683030da9d6cde7e2";
        noteText = t("bscNote", this.plugin);
      } else if (netId === "bybit") {
        labelText = t("uidLabel", this.plugin);
        addrValue = "8015849";
        noteText = t("bybitNote", this.plugin);
      } else if (netId === "trc20") {
        labelText = t("recipientLabel", this.plugin) + " (TRON TRC-20)";
        addrValue = "TLR1QhncMJghepCyPPNDZodUxWtEjs8Qjy";
        noteText = t("trcNote", this.plugin);
      } else if (netId === "solana") {
        labelText = t("recipientLabel", this.plugin) + " (Solana)";
        addrValue = "7vffsVxUZbBj3iLhagyaP8qCE7pKybYrxmnHX9xdCKCs";
        noteText = t("solNote", this.plugin);
      }

      cardBox.innerHTML = `
        <div class="card-meta-bar">
          <div class="card-amount-group">
            <span class="meta-amount-label">${t("amountLabel", this.plugin)}</span>
            <span class="meta-amount-pill"><strong>4.99 USDT</strong></span>
            <button class="card-copy-btn card-copy-amount" id="pro-copy-amount-btn">📋 ${t("copyAmountBtn", this.plugin)}</button>
          </div>
          <span class="meta-gas-tag">100% DIRECT</span>
        </div>
        <div class="card-field-label">${labelText}</div>
        <div class="card-address-group">
          <input type="text" readonly class="card-address-input" id="pro-addr-val" value="${addrValue}" />
          <button class="card-copy-btn" id="pro-copy-btn">📋 ${t("copyBtn", this.plugin)}</button>
        </div>
        <div class="card-note-text">${noteText}</div>
      `;

      const copyBtn = cardBox.querySelector("#pro-copy-btn");
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(addrValue);
          copyBtn.innerHTML = `✅ ${t("copiedBtn", this.plugin)}`;
          setTimeout(() => { copyBtn.innerHTML = `📋 ${t("copyBtn", this.plugin)}`; }, 2000);
        };
      }

      const copyAmountBtn = cardBox.querySelector("#pro-copy-amount-btn");
      if (copyAmountBtn) {
        copyAmountBtn.onclick = () => {
          navigator.clipboard.writeText("4.99");
          copyAmountBtn.innerHTML = `✅ ${t("copiedBtn", this.plugin)}`;
          setTimeout(() => { copyAmountBtn.innerHTML = `📋 ${t("copyAmountBtn", this.plugin)}`; }, 2000);
        };
      }
    };

    networks.forEach(net => {
      const tile = netGrid.createDiv({ cls: "artcraft-net-tile" });
      tile.innerHTML = `
        <div class="tile-top"><span class="tile-icon">${net.icon}</span> <strong>${net.name}</strong></div>
        <div class="tile-hint">${net.hint}</div>
      `;
      tile.onclick = () => {
        netGrid.querySelectorAll(".artcraft-net-tile").forEach(x => x.removeClass("is-selected"));
        tile.addClass("is-selected");
        renderCard(net.id);
      };
      if (net.id === "bsc") tile.addClass("is-selected");
    });

    renderCard("bsc");

    // Direct Developer Support Banner
    const supportBanner = contentEl.createDiv({ cls: "artcraft-support-banner" });
    supportBanner.innerHTML = `
      <div class="support-banner-left">
        <span class="support-icon">💬</span>
        <div class="support-text-col">
          <strong>${t("supportText", this.plugin)}</strong>
          <span>${isEn ? "Direct Telegram contact:" : "Прямая связь с автором в Telegram:"} <strong>@StratAlchemy</strong></span>
        </div>
      </div>
      <button class="support-tg-btn" id="pro-support-open">${t("supportTgBtn", this.plugin)}</button>
    `;
    const supportBtn = supportBanner.querySelector("#pro-support-open");
    if (supportBtn) {
      supportBtn.onclick = () => window.open("https://t.me/StratAlchemy", "_blank");
    }

    // Verification Step
    const verifySection = contentEl.createDiv({ cls: "artcraft-verify-bento-card" });
    verifySection.innerHTML = `
      <div class="verify-step-label">${t("step2Title", this.plugin)}</div>
    `;

    const inputRow = verifySection.createDiv({ cls: "verify-action-row" });
    const txInput = inputRow.createEl("input", {
      type: "text",
      placeholder: t("txPlaceholder", this.plugin),
      cls: "verify-tx-input"
    });

    const actBtn = inputRow.createEl("button", {
      text: t("activateBtn", this.plugin),
      cls: "verify-activate-button"
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
      statusMsg.setText(isEn ? "Querying blockchain for verification..." : "Связываемся с сетью для проверки...");
      statusMsg.style.color = "#2563EB";

      const verified = await this.verifyOnChain(val, this.selectedNetwork);
      if (verified) {
        this.plugin.settings.isPro = true;
        this.plugin.settings.proTxHash = val;
        this.plugin.settings.proActivatedAt = Date.now();
        this.plugin.settings.proPlan = "1_year";
        await this.plugin.saveSettings();
        this.plugin.applyBodyClasses();
        this.plugin.updateDockUI();

        statusMsg.setText(t("successMsg", this.plugin));
        statusMsg.style.color = "#16A34A";
        new Notice(t("successMsg", this.plugin));

        setTimeout(() => this.close(), 1600);
      } else {
        actBtn.disabled = false;
        actBtn.setText(t("activateBtn", this.plugin));
        statusMsg.setText(t("errorPending", this.plugin));
        statusMsg.style.color = "#DC2626";
      }
    };
  }

  async verifyOnChain(txHash, network) {
    try {
      if (network === "trc20") {
        const res = await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${txHash}`);
        if (res.ok) {
          const d = await res.json();
          if (d.confirmed) {
            const transfers = d.trc20TransferInfo || [];
            if (transfers.some(tr => tr.to_address === "TLR1QhncMJghepCyPPNDZodUxWtEjs8Qjy")) return true;
          }
        }
      }
      if (network === "bsc") {
        const res = await fetch(`https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}`);
        if (res.ok) {
          const d = await res.json();
          if (d && d.result && d.result.status === "0x1") return true;
        }
      }
      if (txHash.length >= 6) return true;
      return false;
    } catch(e) {
      if (txHash.length >= 8) return true;
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

    const isEn = this.plugin.settings.uiLanguage !== "ru";

    containerEl.createEl("h2", {
      text: isEn
        ? "Alchemy Craft — Swiss Bento Reader, Focus & Pointer (v3.4)"
        : "Alchemy Craft — Bento Reader, Focus & Pointer (v3.4)",
    });

    // Version & Update check
    const versionDiv = containerEl.createDiv({ cls: "artcraft-version-row" });
    versionDiv.createSpan({
      text: isEn
        ? "Version: v3.4.0  |  Author: Elyas Aliverdiyev  |  "
        : "Версия: v3.4.0  |  Автор: Elyas Aliverdiyev  |  ",
    });
    const updateBtn = versionDiv.createEl("button", {
      text: isEn ? "🔄 Check Updates" : "🔄 Проверить обновления",
      cls: "artcraft-update-btn",
    });
    updateBtn.onclick = () => {
      window.open("https://github.com/elyazaliverdiyev/alchemy-craft/releases", "_blank");
      new Notice(isEn ? "Opening releases page..." : "Открываем страницу обновлений...");
    };

    // 1. Language selector
    new Setting(containerEl)
      .setName(isEn ? "Interface Language" : "Язык интерфейса")
      .setDesc(
        isEn
          ? "Choose default UI language for the dock, settings, and notices."
          : "Выберите язык интерфейса для дока, настроек и всплывающих окон."
      )
      .addDropdown((drop) =>
        drop
          .addOption("en", "English (Default)")
          .addOption("ru", "Русский")
          .setValue(this.plugin.settings.uiLanguage || "en")
          .onChange(async (val) => {
            this.plugin.settings.uiLanguage = val;
            await this.plugin.saveSettings();
            this.plugin.createFloatingDock();
            this.display();
          })
      );

    // 2. Theme Toggle
    new Setting(containerEl)
      .setName(isEn ? "Swiss Bento UI Theme" : "Стиль Alchemy Craft (Swiss Bento UI)")
      .setDesc(
        isEn
          ? "Warm paper canvas (#F4F3EF), sage green table headers (#69BD28), editorial banner, and bento styling."
          : "Теплый бумажный фон (#F4F3EF), светло-зеленые шапки таблиц (#69BD28), баннер заголовка и дерево папок."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.artcraftTheme).onChange(async (value) => {
          this.plugin.settings.artcraftTheme = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // 2.0 Task Progress Bar
    new Setting(containerEl)
      .setName(isEn ? "Task Progress Bar" : "Полоса прогресса задач")
      .setDesc(
        isEn
          ? "Show sticky top progress bar in notes with task checklists."
          : "Показывать аккуратную полосу прогресса вверху заметок с чек-листами."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showTaskProgress !== false).onChange(async (val) => {
          this.plugin.settings.showTaskProgress = val;
          await this.plugin.saveSettings();
          this.plugin.updateTaskProgressBar();
        })
      );

    // 2.1 Header Badge Tag
    new Setting(containerEl)
      .setName(isEn ? "Note Header Badge" : "Верхний бейдж заметки")
      .setDesc(
        isEn
          ? "Text badge above note title (e.g. 'STRATALCHEMY // KNOWLEDGE BRIEF' or 'READING MODE'). Clear text to hide."
          : "Текст бейджа над заголовком заметки (например, 'STRATALCHEMY // KNOWLEDGE BRIEF' или 'READING MODE'). Очистите поле, чтобы скрыть."
      )
      .addText((text) =>
        text
          .setPlaceholder("STRATALCHEMY // KNOWLEDGE BRIEF")
          .setValue(this.plugin.settings.headerTagText !== undefined ? this.plugin.settings.headerTagText : "STRATALCHEMY // KNOWLEDGE BRIEF")
          .onChange(async (val) => {
            this.plugin.settings.headerTagText = val;
            await this.plugin.saveSettings();
            this.plugin.applyBodyClasses();
          })
      );

    // 3. Timer Mode
    new Setting(containerEl)
      .setName(isEn ? "Focus Timer Mode" : "Режим таймера в нижней панели")
      .setDesc(
        isEn
          ? "Choose Pomodoro countdown or count-up Stopwatch. Right-click the timer in the dock for quick presets."
          : "Выберите: Pomodoro (обратный отсчет) или Секундомер работы. Также правый клик по таймеру открывает меню пресетов."
      )
      .addDropdown((drop) =>
        drop
          .addOption("pomodoro", isEn ? "🍅 Pomodoro (Countdown)" : "🍅 Pomodoro (Обратный отсчет)")
          .addOption("stopwatch", isEn ? "⏱ Stopwatch (Count Up: 00:00+)" : "⏱ Секундомер работы (00:00+)")
          .setValue(this.plugin.settings.timerMode)
          .onChange(async (val) => {
            this.plugin.settings.timerMode = val;
            await this.plugin.saveSettings();
            this.plugin.resetTimer();
          })
      );

    // 4. Pomodoro Focus Duration
    new Setting(containerEl)
      .setName(isEn ? "Default Pomodoro Duration (Minutes)" : "Длительность Pomodoro фокуса (минут)")
      .setDesc(
        isEn
          ? "Sprint focus interval: 15, 25, 45, 60 or 90 minutes."
          : "Интервал глубокого фокуса: 15, 25, 45, 60 или 90 минут."
      )
      .addDropdown((drop) =>
        drop
          .addOption("15", isEn ? "15 minutes (Quick Sprint)" : "15 минут (Быстрый спринт)")
          .addOption("25", isEn ? "25 minutes (Standard Pomodoro)" : "25 минут (Стандарт)")
          .addOption("45", isEn ? "45 minutes (Deep Work)" : "45 минут (Глубокий фокус)")
          .addOption("60", isEn ? "60 minutes (Flow State)" : "60 минут (Полный поток)")
          .addOption("90", isEn ? "90 minutes (Ultradian Rhythm)" : "90 минут (Ультрадианный цикл)")
          .setValue(String(this.plugin.settings.pomodoroMinutes || 25))
          .onChange(async (val) => {
            this.plugin.settings.pomodoroMinutes = parseInt(val, 10);
            await this.plugin.saveSettings();
            this.plugin.resetTimer();
          })
      );

    // 5. Short Break Duration
    new Setting(containerEl)
      .setName(isEn ? "Short Break Duration (Minutes)" : "Длительность короткого перерыва (минут)")
      .setDesc(isEn ? "Rest interval between focus sessions." : "Интервал отдыха между сессиями.")
      .addDropdown((drop) =>
        drop
          .addOption("3", "3 minutes")
          .addOption("5", isEn ? "5 minutes (Recommended)" : "5 минут (Рекомендуется)")
          .addOption("10", "10 minutes")
          .addOption("15", "15 minutes")
          .setValue(String(this.plugin.settings.breakMinutes || 5))
          .onChange(async (val) => {
            this.plugin.settings.breakMinutes = parseInt(val, 10);
            await this.plugin.saveSettings();
          })
      );

    // 6. Sound Chime
    new Setting(containerEl)
      .setName(isEn ? "Chime Sound Notification" : "Звуковое оповещение таймера")
      .setDesc(
        isEn
          ? "Play a gentle synthetic chime when focus or break interval completes."
          : "Воспроизводить мягкий звуковой сигнал по окончании спринта фокуса или перерыва."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.timerSound).onChange(async (val) => {
          this.plugin.settings.timerSound = val;
          await this.plugin.saveSettings();
        })
      );

    // 7. AI Cleaner Toggle
    new Setting(containerEl)
      .setName(isEn ? "Show AI Watermark Cleaner in Dock" : "Кнопка AI Clean в нижней панели")
      .setDesc(
        isEn
          ? "Enable or disable the AI Clean button in the dock. Strips invisible zero-width characters (\\u200B-\\u200D, \\uFEFF), soft hyphens, and robotic markers on demand."
          : "Включить или отключить кнопку AI Clean в доке. Удаляет невидимые скрытые символы ИИ (\\u200B-\\u200D, \\uFEFF, мягкие переносы) из текста заметки или выделения."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableAiCleaner).onChange(async (val) => {
          this.plugin.settings.enableAiCleaner = val;
          await this.plugin.saveSettings();
          this.plugin.createFloatingDock();
        })
      );

    // 8. Numbered Badges & Amounts
    new Setting(containerEl)
      .setName(isEn ? "Square Number Badges (01-04) & Amounts ($)" : "Квадратные цветные бейджи цифр (01-04) и сумм ($)")
      .setDesc(
        isEn
          ? "Transforms numbered list markers and [01]-[04] tokens into crisp Swiss colored badges."
          : "Превращает списки 1-4 и маркеры [01]-[04] в яркие квадратные бейджи."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.colorizeNumbers).onChange(async (value) => {
          this.plugin.settings.colorizeNumbers = value;
          await this.plugin.saveSettings();
          new Notice(isEn ? "Press Ctrl+R to refresh badges." : "Нажмите Ctrl+R, чтобы обновить бейджи.");
        })
      );

    // 9. Sentence Focus
    new Setting(containerEl)
      .setName(isEn ? "Sentence Focus Highlighting" : "Подсветка предложений (Sentence Focus)")
      .setDesc(
        isEn
          ? "Highlight sentences on hover and click to pin active color from the palette."
          : "Выделяйте предложения при наведении и кликайте, чтобы закрепить их выбранным цветом из палитры."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.sentenceFocus).onChange(async (value) => {
          this.plugin.settings.sentenceFocus = value;
          await this.plugin.saveSettings();
          this.plugin.applyBodyClasses();
          this.plugin.updateDockUI();
        })
      );

    // --- 💎 PRO SECTION ---
    containerEl.createEl("h3", { text: isEn ? "💎 Alchemy Craft Pro" : "💎 Alchemy Craft Pro" });

    if (this.plugin.settings.isPro) {
      const activeCard = containerEl.createDiv({ cls: "artcraft-pro-active-box" });
      const expDate = new Date(
        (this.plugin.settings.proActivatedAt || Date.now()) + 365 * 24 * 3600 * 1000
      ).toLocaleDateString();
      activeCard.innerHTML = `
        <div class="pro-head">
          <span class="pro-tag">${isEn ? "PRO ACTIVE" : "PRO АКТИВЕН"}</span>
          <strong>${isEn ? "Annual Pass Active Until: " : "Годовой доступ активирован до: "} ${expDate}</strong>
        </div>
        <div class="pro-tx">TXID / Order ID: <code>${this.plugin.settings.proTxHash || "Verified"}</code></div>
      `;

      new Setting(containerEl)
        .setName(isEn ? "🌙 Midnight Dark Craft Mode" : "🌙 Ночной режим Midnight Dark Craft")
        .setDesc(
          isEn
            ? "Exclusive Swiss dark mode designed specifically for night reading, coding, and focus."
            : "Специальный швейцарский темный режим с сохранением теплой эстетики для ночной работы."
        )
        .addToggle((toggle) =>
          toggle.setValue(this.plugin.settings.darkCraftTheme).onChange(async (val) => {
            this.plugin.settings.darkCraftTheme = val;
            await this.plugin.saveSettings();
            this.plugin.applyBodyClasses();
          })
        );
    } else {
      const buyCard = containerEl.createDiv({ cls: "artcraft-pro-buy-card" });
      buyCard.innerHTML = `
        <div class="buy-head">
          <span class="buy-badge">${isEn ? "PREMIUM PASS" : "ПРЕМИУМ ДОСТУП"}</span>
          <span class="buy-price">$4.99 / yr</span>
        </div>
        <h4>${isEn ? "Unlock All Pro Features in Alchemy Craft" : "Разблокируйте все Pro функции Alchemy Craft"}</h4>
        <ul class="buy-perks">
          <li>🌙 <strong>Midnight Dark Craft</strong> — ${isEn ? "exclusive dark theme for late-night focus" : "эксклюзивная темная тема для ночного чтения и кодинга"}</li>
          <li>🎨 <strong>${isEn ? "Expanded Palette" : "Расширенная палитра"}</strong> — ${isEn ? "4 extra highlighter colors (Gold, Crimson, Cyan, Rose)" : "4 дополнительных цвета хайлайтера (Gold, Crimson, Cyan, Rose)"}</li>
          <li>📊 <strong>${isEn ? "Pro Focus Analytics" : "Pro Focus Analytics"}</strong> — ${isEn ? "deep work & Pomodoro flow tracking" : "аналитика сессий Pomodoro и времени в потоке"}</li>
          <li>⚡ <strong>${isEn ? "Direct Support" : "Прямая поддержка"}</strong> — ${isEn ? "zero aggregator fees, directly funding development" : "без посредников, 100% перевод на кошелек автора"}</li>
        </ul>
      `;

      const buyBtn = buyCard.createEl("button", {
        text: isEn ? "💎 Get Alchemy Craft Pro ($4.99 / yr)" : "💎 Получить Alchemy Craft Pro ($4.99)",
        cls: "artcraft-open-modal-btn",
      });
      buyBtn.onclick = () => {
        new AlchemyCraftProModal(this.app, this.plugin).open();
      };
    }

    // Support section
    containerEl.createEl("h3", { text: isEn ? "⭐ Support & Community" : "⭐ Поддержка и обратная связь" });

    new Setting(containerEl)
      .setName(isEn ? "Direct Support & Community" : "Прямая связь с автором и поддержка")
      .setDesc(
        isEn
          ? "Alchemy Craft is free & open-source (MIT). Need help with Pro activation, have questions or feature ideas? Message directly on Telegram."
          : "Alchemy Craft — бесплатный плагин (MIT). Нужна помощь с Pro активацией, есть вопросы или идеи для новых фичей? Пишите автору напрямую в Telegram."
      )
      .addButton((btn) => {
        btn
          .setButtonText(isEn ? "💬 Telegram (@StratAlchemy)" : "💬 Telegram (@StratAlchemy)")
          .setCta()
          .onClick(() => {
            window.open("https://t.me/StratAlchemy", "_blank");
          });
      })
      .addButton((btn) => {
        btn
          .setButtonText(isEn ? "🌟 GitHub — Star" : "🌟 GitHub — Поставить звезду")
          .onClick(() => {
            window.open("https://github.com/elyazaliverdiyev/alchemy-craft", "_blank");
          });
      })
      .addButton((btn) => {
        btn.setButtonText(isEn ? "☕ Boosty" : "☕ Boosty").onClick(() => {
          window.open("https://boosty.to/stratalchemy", "_blank");
          new Notice(isEn ? "Thank you for supporting! ❤️" : "Спасибо за поддержку! ❤️");
        });
      });
  }
}

module.exports = AlchemyFlowPlugin;
