# Code Forge - Piano di Progetto

## Overview

Code Forge è un plugin Obsidian per syntax highlighting moderno usando Shiki, con UI avanzata per i blocchi di codice.

**Filosofia**: Semplice, pulito, funziona. Niente bloat.

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
- [x] Settings semplificati (v0.1.1)

**Releases**:
- `0.1.0` - Initial Shiki integration
- `0.1.1` - Settings cleanup, removed debug logging

**File chiave**:
- `src/engine/shiki-engine.ts` - Core engine
- `src/themes/ObsidianTheme.ts` - TextMate scope mappings
- `src/themes/ThemeMapper.ts` - Placeholder → CSS var replacement

---

### Fase 2: UI Components 🔄 IN CORSO

Header con icona linguaggio e pulsante copia.

**Tasks**:
- [ ] Header component
  - [ ] Icona linguaggio (SVG per linguaggi comuni)
  - [ ] Nome linguaggio
  - [ ] Pulsante copia con feedback
- [ ] Container wrapper per code blocks
- [ ] Stili CSS per header

**Struttura UI**:
```
┌─────────────────────────────────────────┐
│ [icon] JavaScript              [copy]   │  ← Header
├─────────────────────────────────────────┤
│ const foo = "bar";                      │
│ console.log(foo);                       │  ← Code (Shiki)
│                                         │
└─────────────────────────────────────────┘
```

**File da creare**:
- `src/ui/components/CodeBlockHeader.ts`
- `src/ui/components/CopyButton.ts`
- `src/ui/icons/` - SVG icone linguaggi

---

### Fase 3: Paste Handling

Smart paste che preserva indentazione nel code block.

**Tasks**:
- [ ] Intercettare paste via EditorView.domEventHandlers
- [ ] Detectare se cursore è dentro code block
- [ ] Preservare whitespace/indentazione originale
- [ ] (Opzionale) Auto-detect linguaggio

**File da creare**:
- `src/paste/PasteHandler.ts`
- `src/paste/LanguageDetector.ts` (opzionale)

---

### Fase 4: Live Preview Support

Supporto per Source mode e Live Preview (non solo Reading view).

**Tasks**:
- [ ] EditorExtension per CodeMirror 6
- [ ] Decorations per Source mode
- [ ] Sync tra modalità

**File da creare**:
- `src/editor/ShikiExtension.ts`
- `src/editor/decorations.ts`

---

### Fase 5: Polish & Release

- [ ] Testing cross-platform (desktop + mobile)
- [ ] Performance profiling
- [ ] Documentazione utente
- [ ] Submission a Obsidian community plugins

---

## Settings

**Filosofia**: Meno è meglio. Il plugin funziona out-of-the-box.

### Settings esposti all'utente

| Setting | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `showCopyButton` | boolean | `true` | Mostra pulsante copia nell'header |

### Settings interni (non esposti)

| Setting | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `cacheEnabled` | boolean | `true` | Cache per performance |
| `cacheMaxSize` | number | `100` | Max entries in cache |

### Rimossi (obsoleti dopo Phase 1)

- ~~`themeSource`~~ → Usiamo sempre CSS variables
- ~~`bundledTheme`~~ → Non più necessario
- ~~`themeDark/themeLight`~~ → CSS variables si adattano
- ~~`tokenOverrides`~~ → Tema definisce i colori
- ~~`enabled`~~ → Ridondante (Obsidian ha già toggle plugin)
- ~~`highlightingEnabled`~~ → Se plugin attivo, highlighting attivo
- ~~`debugMode`~~ → Rimosso console.log (lint clean)
- ~~`lineNumbers`~~ → Delegato al tema Obsidian
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
│  Engine   │  │    UI     │  │   Paste   │
│  (Shiki)  │  │ (Header)  │  │ (Handler) │
└─────┬─────┘  └─────┬─────┘  └───────────┘
      │              │
      ▼              ▼
┌───────────┐  ┌───────────┐
│  Themes   │  │   Icons   │
│ (CSS var) │  │  (SVG)    │
└───────────┘  └───────────┘
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

## Icone Linguaggi

Approccio: SVG inline per i linguaggi più comuni, fallback a testo per gli altri.

**Linguaggi con icona dedicata** (priorità alta):
- JavaScript/TypeScript
- Python
- Java
- C/C++/C#
- Go
- Rust
- HTML/CSS
- JSON/YAML
- Bash/Shell
- SQL
- Markdown

**Source icone**: [devicon](https://devicon.dev/) o simili (verificare licenza).

---

## Credits

- Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)
