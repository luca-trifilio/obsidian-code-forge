# Code Forge - Stato del Progetto

> Documento di riepilogo sullo stato di sviluppo del plugin Code Forge per Obsidian

**Data:** 2025-12-05
**Fase corrente:** Fase 1 - Shiki Engine Base

---

## Indice

1. [Recap Requisiti](#recap-requisiti)
2. [Decisioni Prese](#decisioni-prese)
3. [Lavoro Completato](#lavoro-completato)
4. [Lavoro Mancante](#lavoro-mancante)
5. [Struttura File Creati](#struttura-file-creati)
6. [Prossimi Passi](#prossimi-passi)

---

## Recap Requisiti

### Problema da Risolvere

| Componente | Stato Attuale | Limitazioni |
|------------|---------------|-------------|
| **Prism.js** (built-in Obsidian) | Abbandonato 2-3 anni | Grammar poveri, no metodi/variabili/annotazioni |
| **Code Styler** | Inattivo (feb 2024) | Solo UI, usa ancora Prism |
| **Shiki Highlighter** | Attivo | No UI avanzata, no paste handling |
| **Paste Mode** | Attivo | Solo paste, no integrazione code blocks |

### Soluzione: Code Forge

Plugin "all-in-one" che combina:
- **ShikiEngine** - TextMate grammars (qualità VS Code)
- **PasteHandler** - Preserva indentazione
- **ThemeBridge** - Sync automatico con tema Obsidian
- **UI completa** - Header, icone, fold, line numbers, highlighting

### Requisiti Funzionali

| ID | Requisito | Descrizione |
|----|-----------|-------------|
| R1 | Syntax Highlighting Moderno | Shiki engine, 100+ linguaggi, riconoscimento keywords/types/methods/variables/annotations |
| R2 | Paste Intelligente | Preserva indentazione, auto-format, auto-detect linguaggio |
| R3 | Integrazione Tema | Legge CSS variables Obsidian, genera tema Shiki dinamico, temi bundled |
| R4 | UI Code Block | Header, copy button, fold/collapse, line numbers, line highlighting, diff mode |
| R5 | Configurazione | Settings tab, per-language overrides, export/import config |

---

## Decisioni Prese

### Domande Risolte nella Sessione

| Domanda | Decisione | Motivazione |
|---------|-----------|-------------|
| **Bundle strategy** | Ibrido | Top 20 linguaggi bundled (~500KB), lazy load per altri |
| **Mobile support** | Alta priorit&agrave; | Must work su iOS/Android dalla v1.0 |
| **Paste behavior** | Cmd+V preserva | Smart paste di default, Cmd+Shift+V per raw |
| **Conflitti plugin** | Solo warning | Mostra avviso ma permette coesistenza |

### Decisioni Implicite dal Documento Originale

| Aspetto | Valore |
|---------|--------|
| Nome plugin | Code Forge |
| Repository | `luca-trifilio/obsidian-code-forge` |
| Licenza | MIT |
| minAppVersion | 0.15.0 |
| Linguaggi i18n | EN + IT |

---

## Lavoro Completato

### Fase 0: Setup Progetto

| Task | Stato | File |
|------|-------|------|
| Creare directory progetto | ✅ | `/obsidian-code-forge/` |
| package.json | ✅ | `package.json` |
| tsconfig.json | ✅ | `tsconfig.json` |
| esbuild.config.mjs | ✅ | `esbuild.config.mjs` |
| eslint.config.mjs | ✅ | `eslint.config.mjs` |
| vitest.config.ts | ✅ | `vitest.config.ts` |
| manifest.json | ✅ | `manifest.json` |
| versions.json | ✅ | `versions.json` |
| version-bump.mjs | ✅ | `version-bump.mjs` |
| main.ts scaffold | ✅ | `main.ts` |
| styles.css | ✅ | `styles.css` |
| Settings types | ✅ | `src/types/settings.ts` |
| Settings tab UI | ✅ | `src/ui/settings-tab.ts` |
| Obsidian mock per test | ✅ | `tests/__mocks__/obsidian.ts` |
| Test base settings | ✅ | `tests/settings.test.ts` |
| .gitignore | ✅ | `.gitignore` |
| GitHub workflow PR | ✅ | `.github/workflows/pr.yml` |
| GitHub workflow Release | ✅ | `.github/workflows/release.yml` |
| GitHub workflow Manual | ✅ | `.github/workflows/manual-release.yml` |
| CLAUDE.md | ✅ | `CLAUDE.md` |
| Struttura cartelle src/ | ✅ | `src/types/`, `src/engine/`, `src/theme/`, `src/paste/`, `src/ui/`, `src/utils/`, `src/i18n/` |

---

## Lavoro Mancante

### Fase 0: Da Completare

| Task | Stato | Note |
|------|-------|------|
| `npm install` | ✅ | Completato |
| `git init` | ✅ | Completato |
| Rinominare branch master → main | ✅ | Completato |
| Verificare `npm run build` | ✅ | Completato |
| Verificare `npm run test` | ✅ | 7/7 test passati |
| Verificare `npm run lint` | ✅ | 0 errori, 2 warning |
| Setup husky pre-commit | ✅ | lint + test |
| Commit iniziale | ✅ | Completato |
| Push su GitHub | ✅ | Completato |

### Fase 1: Shiki Engine Base (Non iniziata)

| Task | Stato |
|------|-------|
| Integrare Shiki come dipendenza | ❌ |
| Creare ShikiEngine class | ❌ |
| Implementare lazy loading grammar | ❌ |
| Creare MarkdownPostProcessor | ❌ |
| Language detection dal fence | ❌ |
| Unit tests ShikiEngine | ❌ |

### Fase 2: Multi-mode Support (Non iniziata)

| Task | Stato |
|------|-------|
| EditorExtension per Live Preview | ❌ |
| Decorations per Source mode | ❌ |
| Gestione transizioni tra modi | ❌ |
| Sync cache tra modi | ❌ |
| Performance test file grandi | ❌ |

### Fase 3: Paste Handling (Non iniziata)

| Task | Stato |
|------|-------|
| Intercettare paste event | ❌ |
| Detectare cursor in code block | ❌ |
| Preservare whitespace | ❌ |
| Auto-wrap in code fence | ❌ |
| Auto-detect language | ❌ |
| Settings behavior paste | ❌ |

### Fase 4: UI Components (Non iniziata)

| Task | Stato |
|------|-------|
| Header component | ❌ |
| Language icons (170+ SVG) | ❌ |
| Copy button con feedback | ❌ |
| Fold/collapse con persistenza | ❌ |
| Line numbers | ❌ |
| Line highlighting | ❌ |
| Diff mode | ❌ |
| Titolo custom | ❌ |

### Fase 5: Theme Integration (Non iniziata)

| Task | Stato |
|------|-------|
| ThemeBridge per CSS variables | ❌ |
| Mappatura variabili → token Shiki | ❌ |
| MutationObserver per theme change | ❌ |
| Tema Shiki dinamico | ❌ |
| Override manuali settings | ❌ |
| Bundled themes (Dracula, Nord, etc) | ❌ |

### Fase 6: Polish & Release (Non iniziata)

| Task | Stato |
|------|-------|
| Settings tab completa | ❌ |
| Export/import config | ❌ |
| i18n EN + IT | ❌ |
| README con screenshots | ❌ |
| Test cross-platform | ❌ |
| Submit Community Plugins | ❌ |

---

## Struttura File Creati

```
obsidian-code-forge/
├── .github/
│   └── workflows/
│       ├── pr.yml              # CI per PR: lint → test → build → beta
│       ├── release.yml         # Release su merge PR con label
│       └── manual-release.yml  # Release manuale
├── docs/
│   └── PROJECT_STATUS.md       # Questo documento
├── src/
│   ├── engine/                 # (vuoto - Fase 1)
│   ├── i18n/                   # (vuoto - Fase 6)
│   ├── paste/                  # (vuoto - Fase 3)
│   ├── theme/
│   │   └── themes/             # (vuoto - Fase 5)
│   ├── types/
│   │   ├── index.ts
│   │   └── settings.ts         # ✅ CodeForgeSettings interface
│   ├── ui/
│   │   ├── components/         # (vuoto - Fase 4)
│   │   ├── icons/              # (vuoto - Fase 4)
│   │   ├── index.ts
│   │   └── settings-tab.ts     # ✅ Settings UI base
│   └── utils/                  # (vuoto)
├── tests/
│   ├── __mocks__/
│   │   └── obsidian.ts         # ✅ Mock Obsidian API
│   └── settings.test.ts        # ✅ Test settings
├── .gitignore                  # ✅
├── CLAUDE.md                   # ✅ Istruzioni per Claude
├── esbuild.config.mjs          # ✅ Build config
├── eslint.config.mjs           # ✅ Lint config
├── main.ts                     # ✅ Entry point plugin
├── manifest.json               # ✅ Obsidian manifest
├── package.json                # ✅ Dependencies
├── styles.css                  # ✅ CSS base
├── tsconfig.json               # ✅ TypeScript config
├── version-bump.mjs            # ✅ Script version bump
├── versions.json               # ✅ Version compatibility
└── vitest.config.ts            # ✅ Test config
```

---

## Prossimi Passi

### Immediati (Fase 0)

1. **Completare npm install** - Attendere completamento
2. **Rinominare branch**: `git branch -m master main`
3. **Verificare build**: `npm run build`
4. **Verificare test**: `npm run test`
5. **Verificare lint**: `npm run lint`
6. **Setup husky**: Configurare pre-commit hooks
7. **Commit iniziale**: `git commit -m "Initial setup"`
8. **Creare repo GitHub**: `luca-trifilio/obsidian-code-forge`
9. **Push**: `git push -u origin main`

### Fase 1 (Dopo setup)

1. Studiare API Shiki v3
2. Creare `src/engine/shiki-engine.ts`
3. Implementare highlighting base
4. Testare con Java, Python, JS, TS

---

## Dipendenze Installate

### Production

| Package | Versione | Scopo |
|---------|----------|-------|
| shiki | ^3.0.0 | Syntax highlighting engine |

### Development

| Package | Versione | Scopo |
|---------|----------|-------|
| @types/node | ^20.x | Node.js types |
| @typescript-eslint/eslint-plugin | ^8.x | ESLint TS rules |
| @typescript-eslint/parser | ^8.x | ESLint TS parser |
| @vitest/coverage-v8 | ^3.x | Test coverage |
| builtin-modules | ^4.x | Node builtins list |
| esbuild | ^0.25.x | Bundler |
| eslint | ^9.x | Linter |
| globals | ^16.x | Global variables |
| husky | ^9.x | Git hooks |
| jsdom | ^27.x | DOM testing |
| obsidian | latest | Obsidian API types |
| tslib | ^2.x | TS runtime helpers |
| typescript | ^5.x | TypeScript compiler |
| vitest | ^3.x | Test framework |

---

## Note Tecniche

### Sfide Identificate

1. **Edit mode vs Reading mode** - Obsidian usa sistemi diversi (CodeMirror vs HTML)
2. **Performance** - Shiki può essere lento su code block grandi (>500 righe)
3. **Tema dinamico** - Shiki vuole tema JSON statico, CSS vars cambiano
4. **Paste interception** - Obsidian processa paste prima del plugin
5. **WASM su Mobile** - Shiki usa WASM, potrebbe non funzionare su mobile

### Soluzioni Proposte

- **Multi-mode**: MarkdownPostProcessor + EditorExtension + ViewPlugin
- **Performance**: Lazy loading, cache LRU, Web Worker per >500 righe
- **Tema**: MutationObserver + generazione dinamica tema
- **Paste**: EditorView.domEventHandlers con preventDefault
- **Mobile**: Test immediato, fallback a Prism se WASM non disponibile

---

## Riferimenti

- [Shiki Documentation](https://shiki.style/)
- [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin)
- [Code Styler](https://github.com/mayurankv/Obsidian-Code-Styler)
- [Paste Mode](https://github.com/jglev/obsidian-paste-mode)

---

*Documento generato automaticamente - Ultimo aggiornamento: 2025-12-05*
