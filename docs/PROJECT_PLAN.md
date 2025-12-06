# Code Forge - Piano di Progetto

## Overview

Code Forge è un plugin Obsidian per syntax highlighting moderno usando Shiki.

**Filosofia**: Semplice, pulito, funziona. Focus sul miglior highlighting possibile, delegando UI ai temi.

## Fasi di Sviluppo

### Fase 1: Shiki Engine ✅ COMPLETATA

Integrazione di Shiki con tema CSS variables che si adatta al tema Obsidian attivo.

**Completato**:
- [x] ShikiEngine class con lazy loading grammatiche
- [x] Bundle top 20 linguaggi, altri caricati on-demand
- [x] MarkdownPostProcessor per Reading view
- [x] ObsidianTheme con CSS variables (~400 scope mappings)
- [x] ThemeMapper per placeholder hex → CSS variables
- [x] Fallback colors in styles.css (dark/light mode)
- [x] CI/CD con beta release automatiche via BRAT
- [x] Settings semplificati

**Releases**: `0.1.0`, `0.1.1`

---

### Fase 2: Live Preview / Edit Mode ✅ COMPLETATA

Supporto per Source mode e Live Preview (non solo Reading view).

**Completato**:
- [x] ShikiViewPlugin per CodeMirror 6
- [x] Parsing syntax tree per identificare code blocks
- [x] Nodi corretti: `HyperMD-codeblock_HyperMD-codeblock-bg` per linee
- [x] Decorazioni mark con colori CSS variables
- [x] Conversione placeholder → CSS var via ThemeMapper
- [x] Colori identici tra Read e Edit mode
- [x] Gestione duplicati e posizioni corrette

**Release**: `0.2.0`

**File chiave**:
- `src/editor/ShikiViewPlugin.ts` - ViewPlugin con decorazioni

---

### Fase 3: Paste Handling (PLANNED)

Smart paste che preserva indentazione nel code block.

**Tasks**:
- [ ] Intercettare paste via EditorView.domEventHandlers
- [ ] Detectare se cursore è dentro code block
- [ ] Preservare whitespace/indentazione originale

**File da creare**:
- `src/paste/PasteHandler.ts`

---

### Fase 4: Polish & Release (PLANNED)

- [ ] Testing cross-platform (desktop + mobile)
- [ ] Performance profiling
- [ ] Documentazione utente
- [ ] Submission a Obsidian community plugins

---

## Settings

**Filosofia**: Meno è meglio. Il plugin funziona out-of-the-box.

Attualmente nessun setting esposto all'utente. Il plugin si attiva e funziona.

---

## Architettura

```
┌─────────────────────────────────────────────────────────┐
│                      main.ts                            │
│                   (Plugin entry)                        │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  Engine   │  │  Editor   │  │   Paste   │
│  (Shiki)  │  │(CM6 Ext)  │  │ (Handler) │
└─────┬─────┘  └───────────┘  └───────────┘
      │
      ▼
┌───────────┐
│  Themes   │
│ (CSS var) │
└───────────┘
```

---

## Bundle Strategy

### Linguaggi bundled (sempre disponibili)
```
javascript, typescript, python, java, c, cpp, csharp,
go, rust, ruby, php, swift, kotlin, html, css, json,
yaml, markdown, bash, sql
```

### Linguaggi lazy-loaded (on-demand)
Tutti gli altri ~150 linguaggi supportati da Shiki.

---

## CSS Variables

Il tema usa queste CSS variables (con fallback in styles.css):

```css
--shiki-code-background
--shiki-code-normal
--shiki-code-keyword
--shiki-code-function
--shiki-code-property
--shiki-code-string
--shiki-code-comment
--shiki-code-value
--shiki-code-important
--shiki-code-punctuation
```

I temi Obsidian possono definire queste variabili per personalizzare i colori.

---

## Credits

- Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)
