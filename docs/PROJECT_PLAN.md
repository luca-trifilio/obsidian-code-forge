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

**Releases**:
- `0.1.0` - Initial Shiki integration
- `0.1.1` - Settings cleanup, removed debug logging

**File chiave**:
- `src/engine/shiki-engine.ts` - Core engine
- `src/themes/ObsidianTheme.ts` - TextMate scope mappings
- `src/themes/ThemeMapper.ts` - Placeholder → CSS var replacement

---

### Fase 2: Live Preview / Edit Mode 🔄 IN CORSO

Supporto per Source mode e Live Preview (non solo Reading view).

**Completato**:
- [x] EditorExtension per CodeMirror 6
- [x] ViewPlugin per rendering code blocks
- [x] Decorations per Source mode
- [x] Sync con ShikiEngine esistente
- [x] Posizioni token corrette
- [x] Colori CSS variables allineati con Read mode

**In corso**:
- [ ] **Testing** - Verificare che colori siano identici in entrambi i mode

**Soluzione implementata**:
1. `ThemeMapper.placeholderToCssVar()` ora ritorna `undefined` se placeholder non trovato
2. `ShikiViewPlugin` usa fallback `var(--shiki-code-normal)` per token senza colore
3. CSS specifico per `.code-forge-token` in Edit mode (styles.css)

Questo assicura che:
- Tutti i token abbiano sempre un colore CSS variable
- Il fallback sia consistente con Read mode (`--shiki-code-normal`)
- Le decorazioni CM6 abbiano priorità sui colori default dell'editor

**File**:
- `src/editor/ShikiViewPlugin.ts` - ViewPlugin con decorazioni e fallback colori
- `src/themes/ThemeMapper.ts` - Conversione placeholder → CSS var
- `styles.css` - Regole CSS per Edit mode

---

### Fase 3: Paste Handling

Smart paste che preserva indentazione nel code block.

**Tasks**:
- [ ] Intercettare paste via EditorView.domEventHandlers
- [ ] Detectare se cursore è dentro code block
- [ ] Preservare whitespace/indentazione originale

**File da creare**:
- `src/paste/PasteHandler.ts`

---

### Fase 4: Polish & Release

- [ ] Testing cross-platform (desktop + mobile)
- [ ] Performance profiling
- [ ] Documentazione utente
- [ ] Submission a Obsidian community plugins

---

## Settings

**Filosofia**: Meno è meglio. Il plugin funziona out-of-the-box.

### Settings interni (non esposti)

| Setting | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `cacheEnabled` | boolean | `true` | Cache per performance |
| `cacheMaxSize` | number | `100` | Max entries in cache |

### Rimossi

- ~~`themeSource`~~ → Usiamo sempre CSS variables
- ~~`bundledTheme`~~ → Non più necessario
- ~~`themeDark/themeLight`~~ → CSS variables si adattano
- ~~`tokenOverrides`~~ → Tema definisce i colori
- ~~`enabled`~~ → Ridondante (Obsidian ha già toggle plugin)
- ~~`highlightingEnabled`~~ → Se plugin attivo, highlighting attivo
- ~~`debugMode`~~ → Rimosso console.log
- ~~`lineNumbers`~~ → Delegato al tema Obsidian
- ~~`showCopyButton`~~ → Delegato al tema (Baseline ha già questa feature)
- ~~`enableFolding`~~ → Feature non prioritaria
- ~~`enableDiffMode`~~ → Feature non prioritaria

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
