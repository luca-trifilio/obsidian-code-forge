# Code Forge - Work Log

> Registro delle attività operative di sviluppo

---

## 2025-12-05

### Sessione 1: Setup Progetto (Fase 0)

**Completato:**
- [x] Rinominato branch `master` → `main`
- [x] `npm install` (con workaround per npm registry down)
- [x] Verificato `npm run build` ✅
- [x] Verificato `npm run test` ✅ (7/7 test)
- [x] Verificato `npm run lint` ✅ (0 errori, 2 warning)
- [x] Setup husky pre-commit hooks (lint + test)
- [x] Commit iniziale
- [x] Creato repo GitHub: https://github.com/luca-trifilio/obsidian-code-forge
- [x] Push su GitHub
- [x] Configurato repo settings (delete branch on merge, auto-merge, etc.)
- [x] Configurato secrets GitHub:
  - `PAT_TOKEN`
  - `RELEASE_TOKEN`
  - `GPG_PRIVATE_KEY`
  - `GPG_PASSPHRASE`
- [x] Copiato ruleset "Protect main" da smart-image-renamer
- [x] Creato label release: `release:patch`, `release:minor`, `release:major`

**Fix applicati:**
- Aggiunto `override` modifier a `onload()` e `onunload()` in main.ts

---

### Sessione 2: Shiki Engine (Fase 1)

**Branch:** `feature/shiki-engine`

**Completato:**
- [x] Creato `src/engine/shiki-engine.ts` - ShikiEngine class
  - Lazy initialization del highlighter
  - 20 linguaggi bundled (top languages)
  - Lazy loading per altri linguaggi
  - Alias resolution (js→javascript, py→python, etc.)
  - Metodi: `highlight()`, `loadLanguage()`, `getTokens()`, `dispose()`
- [x] Creato `src/engine/post-processor.ts` - MarkdownPostProcessor
  - Intercetta code blocks in Reading view
  - Estrae linguaggio da classe CSS
  - Sostituisce HTML con output Shiki
  - Aggiunge classe `code-forge-highlighted`
- [x] Creato `src/engine/index.ts` - exports
- [x] Aggiornato `main.ts` per integrare ShikiEngine
- [x] Aggiornato `src/types/settings.ts` - temi Shiki corretti
- [x] Aggiornato `src/ui/settings-tab.ts` - dropdown temi aggiornati
- [x] Creato `tests/shiki-engine.test.ts` - 21 test
- [x] Tutti i test passano (28 totali)
- [x] Push su `feature/shiki-engine`

**Temi Shiki supportati:**
- github-dark, github-light
- dracula, nord, one-dark-pro
- solarized-dark, solarized-light
- vitesse-dark, vitesse-light

**Linguaggi bundled (20):**
javascript, typescript, python, java, c, cpp, csharp, go, rust, php,
ruby, swift, kotlin, sql, html, css, json, yaml, markdown, bash

---

### Sessione 3: Debug PostProcessor

**Problema:** Code blocks non mostrano highlighting Shiki in Reading view

**Investigazione:**
1. Plugin si carica correttamente ✅
2. PostProcessor viene registrato ✅
3. PostProcessor trova code blocks ✅
4. Shiki genera HTML ✅
5. Pre element viene sostituito ✅
6. **MA** i colori non cambiano - problema CSS

**Causa:** Il tema Baseline sovrascrive gli stili inline di Shiki

**Fix tentati:**
1. Aggiunto CSS per `pre.code-forge-highlighted`
2. Reset colori con `color: unset` su spans

**Status:** In corso - testing CSS fix

---

## Note Tecniche

### Come funziona il PostProcessor

```
Reading view render
       ↓
MarkdownPostProcessor chiamato per ogni elemento
       ↓
Cerca "pre > code" nell'elemento
       ↓
Estrae linguaggio da classe "language-xxx"
       ↓
Chiama ShikiEngine.highlight(code, lang)
       ↓
Shiki genera HTML con inline styles
       ↓
Sostituisce <pre> originale con nuovo HTML
       ↓
Aggiunge classe "code-forge-highlighted"
```

### CSS Specificity Issue

Shiki usa inline styles: `<span style="color: #fff">`

I temi Obsidian possono sovrascrivere con:
```css
.markdown-preview-view pre code span {
  color: var(--code-color) !important;
}
```

Soluzione: usare `color: unset` per resettare le regole del tema.

---

## Prossimi Passi

### Da completare (Fase 1)
- [ ] Risolvere CSS conflict con tema Baseline
- [ ] Testare con altri temi
- [ ] Rimuovere debug logging
- [ ] Merge PR con label `release:minor`

### Fase 2: Multi-mode Support
- [ ] EditorExtension per Live Preview
- [ ] Decorations per Source mode
- [ ] Sync cache tra modi

### Fase 3: Paste Handling
- [ ] Intercettare paste event
- [ ] Preservare whitespace
- [ ] Auto-detect language

### Fase 4: UI Components
- [ ] Header con language name/icon
- [ ] Copy button
- [ ] Line numbers
- [ ] Fold/collapse
