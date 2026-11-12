# Alchemy Craft

A reading and focus studio for Obsidian: a paper page with real grain, a key sentence marker, related notes hanging on threads under the note, a focus timer, soundscapes with an equalizer that follows what your PC plays, drawing tools and graph styling.

Version 5.6.0. MIT License.

## Install

1. Copy `main.js`, `manifest.json` and `styles.css` into `.obsidian/plugins/artcraft-reader/` in your vault.
2. Reload Obsidian and enable **Alchemy Craft** in Settings → Community plugins.

`data.json` holds your personal settings. Do not share it or ship it with the plugin.

## What's new in 5.6.0

### The page

- **Paper with grain.** The page carries a paper texture: fine grain, soft cloudiness and scattered fibres. It is drawn once by the plugin, scrolls with the text, and a soft pool of light stays fixed to the pane, so the sheet moves under still light. Strength: the *Grain* control in the tool row (0 turns it off). Before 5.5 the grain layer was attached in a way that left it invisible.
- **Ink.** Body text is a near-black with a slight hue instead of pure black, secondary text is no longer washed-out grey. Contrast is about 14:1 for body text and 5:1 for secondary text.
- **Plain page by default.** Headings, quotes and tables are set by type alone: no cards, gradients, coloured side bars or shadows. Figures in the text are marked by weight instead of coloured badges, inline code is a quiet grey chip, a code block is a code block and not a mock application window. The dock and the tool row use one neutral colour and the interface font. The earlier decorated look is one switch away: Focus menu → *Decorated page (heading cards)*.
- **Your font.** The text font chosen in Obsidian settings is used. The plugin used to force its own; that font is now only the fallback.
- **Line breaking.** Paragraphs avoid a lonely last word, headings split into lines of similar length.
- **Quieter chrome.** The tool row under the tab header stays faint until you point at it. File explorer rows have no boxes or coloured side bars; icons are thin outlines in the text colour. The brand tag above the note title is off by default (and its switch in settings now works).
- **Narrow panes.** A split view or a phone used to leave 77 px for text in a 288 px pane, and headings broke in the middle of words. Narrow panes now get their own margins and heading sizes.

### Related notes on threads

Under every note, related notes hang as slips of paper tied by threads to the current note. Arrows show the direction of the link: → a link from this note, ← a backlink, ↔ both, a dotted thread for a note with similar wording and no link.

- The title of each slip is sharp, its text is out of focus. Click a slip and it grows into a reading card with the opening of that note; the text clears block by block. Click the title to open the note (Ctrl-click for a new tab), Esc or a click outside to fold it back.
- The slips move: each is a mass on a spring with a pendulum lean, pushed by a slow wind with gusts that travel left to right. Moving the cursor past them pushes them, scrolling makes them lag and swing back, a slip under the cursor holds still.
- Cost: the motion is simulated a few seconds ahead and handed to the GPU as a finished trajectory, so the main thread is idle between interactions. Measured in Obsidian 1.15: about 11% of one core while the block is on screen (the first, frame-by-frame version took about 40%), 0% when it is scrolled away.
- "Similar" is computed on your device from the words of the notes (stop-words removed, word endings folded). It works for Cyrillic as well as Latin text.
- Off switch: Focus menu in the dock → *Related notes under the note*, or the command *Toggle related notes under the note*.

### Fixes that protect your notes and settings

- The graph button no longer rewrites `.obsidian/graph.json`. It used to replace all your colour groups, forces and filters, once automatically the first time a graph was opened. Now it adds folder colours next to your own groups and touches nothing else.
- The task board (Creator Studio) changed a task by rewriting the whole note from a copy taken when the board was drawn. If the note had changed since, the edit was lost or the wrong line was changed. It now edits one line and checks that the line is still the same task.
- "Clean AI watermarks" removed the joiners inside emoji and inside Persian, Arabic and Indic words, replaced every typographic quote and non-breaking space, rewrote the whole note and copied it to the clipboard. It now removes only invisible characters, in place.
- Stamps, seals and stickers follow a note when it is renamed or moved.
- Text from notes, file names and typed fields is escaped everywhere it is put into the interface (59 places). A note containing HTML could run script inside Obsidian before.

### Other fixes

- Code blocks: lines ran together with their numbers (`1function …{2 const …`). Fixed.
- Ctrl+Z while typing no longer also undoes a drawing.
- Pausing or resetting the timer no longer stops a soundscape you started yourself.
- The header refreshed on every metadata change of any file in the vault; now only for the note on screen, debounced.
- A sealed note could open early by itself when the header refreshed during "hold to open".
- Quest log: two tasks ticked in quick succession produced two blocks with one index; about 29% of blocks did not meet the stated difficulty; the first block was never checked. All three fixed.
- Number badges: `50%`, `10 $`, `5 тыс`, `2 млн` and ranges like `20–30%` were never recognised. Fixed.
- Streaks and alarms use your local day instead of the UTC day.
- Two switches needed two clicks the first time. Night Light compensation did nothing. Both fixed.
- 365-day map had 364 cells and filled an empty today with lifetime totals.

### Honest numbers and names

- "AI tokens saved" was clamped to 15–92% (18–88% in one place) with made-up fallbacks of 58% and 64%. It now shows the real ratio, larger or smaller, and says it is an estimate at 3.8 characters per token.
- "Human Clarity" is renamed "Structure". It counts headings, steps, callouts and links; it does not measure readability. An empty note scores 0, not 58.
- The similar-notes tab no longer says "WASM kernel" or "64-bit SimHash": the old hash dropped the high byte of every character, so Cyrillic text collided. It now uses the same word comparison as the related notes block, over up to 400 recent notes instead of the first 120.
- A pasted transaction hash in the quest log is labelled "saved (not checked by the plugin)" instead of "ON-CHAIN VERIFIED", and an empty field is no longer filled with an invented hash.
- Soundscape tiles are named for what they play. Health claims are removed.
- Commands have plain names without emoji; about two thirds of the emoji in the interface are gone. Tooltips say what a button does in one short line.
- A new user starts with an empty quest log at level 1. The defaults used to contain the author's own goals, 340 XP and level 4.

### Pro activation

- Removed: "any text of 6 characters", "anything starting with IV / VIP- / AC-PRO-", and activation on a network error.
- Built-in promo codes are stored as SHA-256 hashes instead of readable text.
- Transfers are checked against the author's wallet: USDT on TRON (token and amount), BNB Chain and Solana (recipient). Before, any successful BNB Chain transaction by anyone was accepted.
- A paid @CryptoBot invoice must cover the price of the chosen tier.
- Still open, and only a server can close it: a public transaction can be reused by another person, offline keys and promo codes can be shared, and `isPro` lives in `data.json`.

## Network use and payments

The plugin works offline. It connects to the network only for the optional Pro purchase:

- `tsnnckbvxokjmbgfeqdj.supabase.co`: creating a @CryptoBot invoice, checking a paid invoice, redeeming a code.
- `api.trongrid.io`, `bsc-dataseed.binance.org`, `api.mainnet-beta.solana.com`: looking up a transaction hash you paste.

Nothing from your notes is sent anywhere. Pro features are paid; the free part needs no account.

## Known limits

- Tested in Obsidian 1.15 and 1.8.10 on Windows. Not tested on macOS, Linux or mobile.
- System audio for the equalizer is a Windows feature.
- The page stays light in Obsidian's dark theme; the plugin has no dark page yet.
- The key sentence marker works in reading view only. The related notes block works in reading view and in Live Preview.
- `CHANGES-5.6.0.md` lists what was checked, what was not, and what is left for the author.

## License

MIT License © 2026 Elyaz Aliverdiyev

---

## Earlier releases

### 5.4.0

#### The equalizer hears what the PC plays

Click the equalizer pill in the dock. The plugin connects to the Windows output mix, so the meter follows the browser, a player or a game without a microphone and without "Stereo Mix".

- The spectrum is real: 16 bands spaced by octaves from 40 Hz to 16 kHz, computed from the live signal.
- The status dot blinks on bass beats. The command *Toggle cursor lamp pulse on music beats* makes the cursor lamp breathe with them.
- The connection is remembered: once connected, PC audio reconnects on the next launch until you disconnect it.
- How it works: Electron only gives loopback audio together with a screen-video track. The plugin asks for a 16×16 px, 1 fps track and stops it immediately. No screen content is read, nothing is recorded, nothing leaves the computer.
- System loopback is a Windows feature. On macOS and on mobile the button reports that it is unavailable; a microphone can still be chosen in Sonic Studio.

Removed: the old path that kept a full-resolution screen capture running for as long as audio was connected, the PowerShell bridge, and the simulated spectrum that was drawn when no real signal was available.

#### Key sentence marker

In reading view the plugin underlines the sentences that carry the note's subject, so a reader scanning the page lands on them first. The stroke is drawn once, left to right, when the sentence scrolls into view.

- It runs locally on the text of the note. A sentence ranks high when it packs many of the note's repeated, meaningful words; heading words count extra, figures and cue words ("therefore", "важно") add a small bonus.
- About one sentence in six is marked, two per paragraph at most. Tasks, tables, code and short notes are left alone.
- Toggle: Focus menu in the dock → *Key sentence marker*, or the command *Toggle key sentence marker*.
- Reading view only. Live Preview is not marked.

#### Performance

Measured in Obsidian 1.8.10 on Windows, one note open, nothing playing:

| | 5.3.1 | 5.4.0 |
|---|---|---|
| CPU used by the app at rest (one core) | 34–37% | about 2% |
| Screen capture while audio is connected | full screen, continuous | none |

- The equalizer and graph loop now runs only while there is something to draw. With audio connected but nothing playing it checks for sound five times a second.
- Decorative loops (the dock flask, the related-notes footer) run only on hover or while on screen.
- The system "reduce motion" setting is respected.

#### Fixes

- The dock no longer slides off the left edge on windows narrower than about 1200 px. It drops button labels first, then scrolls.
- Disabling the plugin now removes everything it added: body classes, CSS variables, sidebar icons, the paper-grain layer, the footer, window listeners and the background loop.
- Sentence Focus no longer splits a sentence at a decimal point ("1.5", "$4.99") or at "т. е.".
- The 60-second Pro test-drive no longer survives disabling the plugin, and saving settings during the preview no longer writes Pro into `data.json` for good.
- The lamp notice no longer claims a frame rate.

### Before 5.4.0

- **5.3.1**: stylesheet clean-up (parser errors removed).
- **5.3.0**: code blocks as a window with line numbers, palettes and a copy button; related notes under the note; file explorer icons; four-column task board; page width modes and paper grain.
- **5.2.0**: note summary window (summary for people, capsule for AI tools, similar notes).
- **5.0.2**: page surface chips; two-page spread fix; English and Russian templates in the post builder.
- **5.0.1**: button colours; wider Creator Studio with auto-sized fields.
- **5.0.0**: three page surfaces; time capsule; bookshelf; graph view fixes.
- **4.9.0**: 365-day activity map; quest log with an optional test-network record; Creator Studio; 60-second Pro preview.
- **4.8.2**: paragraph cards; Night Light compensation; graph styling; quest log; energy tracker; sketchpad.
- **4.3.4**: focus presets; margin stickers; two-column spread; reading stamp.

## What's New in v5.6.0 — Argon Cinematic Physics & Zero-Slop Audit

1. **Verlet Flask Hydrodynamics & Living Familiar (Canvas 2D)**:
   - Real-time 1D spring-wave fluid simulation (`initArgonFlaskHydroEngine`) with cursor inertia, wall splashing, internal caustic light refraction, and multi-density buoyant bubbles.
   - Procedural alchemical vapor plume on dock expand and golden/emerald vortex suction on collapse (`emitFlaskPlume`).
   - Smooth spring-interpolated Familiar morphing: 3D paw wave, floating Cheshire grin & wink, and audio/timer-reactive ear twitches.
2. **Wind & Scatter Dock Kinematics**:
   - Fluid-to-interface parabolic arc trajectory with dynamic velocity motion blur and damped pendulum wind settle on expand, plus spiral vortex suction on collapse.
3. **Dynamic Island iOS Fluid & Real-Time Spectrogram**:
   - Jelly squash & stretch on mouse-wheel volume scrub, directional shockwave on side-button track switch, live 5-band WebAudio frequency bars, and SVG metaball gooey bridge.
4. **Cinematic Zen Focus Camera Transition**:
   - Optical focal depth zoom with radial atmospheric fog veil (`.artcraft-zen-atmosphere-veil`) and layout-jump-free sidebar dissolution.
5. **Tactile Popovers (3D Tilt & Magnetic Tether)**:
   - Elastic SVG bezier bridge connecting the active pill to Pomodoro/Focus/Equalizer popovers, paired with interactive 3D cursor tilt and specular glass glare.
6. **Roastery Interactive Steam & Pro Key Minting Forge**:
   - Cursor-repelled Canvas steam over the Cappuccino & Chemex hero, procedural coffee pour / crypto coin drop on tier selection, and molten gold seal forging with WebAudio chime + 3 verifiable `ACPRO-...` gift keys for Gold Patrons.
7. **3D Hardcover Book Folio Page Curl & Parallax**:
   - Scroll-velocity cylindrical page curl (`--book-curl-rot-y/x`), spine crease depth modulation, and cursor-driven multi-layer shadow parallax.
