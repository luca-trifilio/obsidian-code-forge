# Piano Integrazione Approccio Shiki Plugin

> Integrazione dell'approccio CSS variables dal plugin [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) di mProjectsCode (MIT License)

---

## Il Problema Fondamentale

Shiki usa `vscode-textmate` che richiede colori HEX validi nel tema. Non supporta CSS variables nativamente.

```
Tema Dracula: { keyword: '#FF79C6' }     ← hardcoded
Noi vogliamo: { keyword: 'var(--xxx)' }  ← dinamico
```

---

## La Soluzione

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUSSO COMPLETO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ObsidianTheme.ts definisce:                                │
│     scope: ['keyword'] → 'var(--shiki-code-keyword)'           │
│                                                                 │
│  2. ThemeMapper.mapColor() al load:                            │
│     'var(--shiki-code-keyword)' → '#000001' (placeholder)      │
│     'var(--shiki-code-function)' → '#000002'                   │
│     ... salva mapping in Map<string, string>                   │
│                                                                 │
│  3. Shiki riceve tema con placeholder HEX validi               │
│     Genera: <span style="color: #000001">private</span>        │
│                                                                 │
│  4. ThemeMapper.fixHTML() post-processing:                     │
│     Sostituisce '#000001' → 'var(--shiki-code-keyword)'        │
│                                                                 │
│  5. Output finale:                                              │
│     <span style="color: var(--shiki-code-keyword)">private</span>
│                                                                 │
│  6. CSS del tema Obsidian (es. Baseline):                      │
│     :root { --shiki-code-keyword: #FF79C6; }                   │
│                                                                 │
│  7. Browser applica il colore dal tema! ✓                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Struttura File

```
src/
├── engine/
│   ├── shiki-engine.ts      ← MODIFICA: usa ThemeMapper
│   ├── post-processor.ts    ← invariato
│   └── index.ts
├── themes/                   ← NUOVA CARTELLA
│   ├── ObsidianTheme.ts     ← NUOVO: ~400 righe di scope mappings
│   ├── ThemeMapper.ts       ← NUOVO: ~60 righe
│   └── index.ts             ← NUOVO: exports
styles.css                   ← MODIFICA: CSS variables fallback
README.md                    ← MODIFICA: crediti
```

---

## File da Creare

### 1. src/themes/ObsidianTheme.ts

Copiare da mProjectsCode/obsidian-shiki-plugin. Struttura:

```typescript
import { type ThemeRegistration } from 'shiki';

export const OBSIDIAN_THEME = {
  displayName: 'Obsidian Theme',
  name: 'obsidian-theme',
  semanticHighlighting: true,
  colors: {
    'editor.background': 'var(--shiki-code-background)',
    'editor.foreground': 'var(--shiki-code-normal)',
  },
  tokenColors: [
    // Keywords: if, return, new, throw, catch, try
    {
      scope: ['keyword', 'punctuation.definition.keyword'],
      settings: { foreground: 'var(--shiki-code-keyword)' }
    },
    // Funzioni e metodi
    {
      scope: [
        'entity.name.function',
        'meta.function-call.object',
        'meta.method-call.java meta.method',
        // ... altri scope
      ],
      settings: { foreground: 'var(--shiki-code-function)' }
    },
    // Tipi e classi
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'source.java storage.type',
        // ... altri scope
      ],
      settings: { foreground: 'var(--shiki-code-property)' }
    },
    // ... altri 50+ scope mappings (vedi file originale)
  ]
} satisfies ThemeRegistration;
```

### 2. src/themes/ThemeMapper.ts

```typescript
import { type ThemeRegistration } from 'shiki';
import { OBSIDIAN_THEME } from './ObsidianTheme';

export const OBSIDIAN_THEME_IDENTIFIER = 'obsidian-theme';

export class ThemeMapper {
  private mapping = new Map<string, string>();
  private counter = 0;

  /**
   * Converte CSS variable → placeholder HEX
   * 'var(--shiki-code-keyword)' → '#000001'
   */
  mapColor(cssVar: string): string {
    if (!cssVar.startsWith('var(')) {
      return cssVar; // già un colore HEX
    }

    if (this.mapping.has(cssVar)) {
      return this.mapping.get(cssVar)!;
    }

    const placeholder = `#${this.counter.toString(16).padStart(6, '0').toUpperCase()}`;
    this.counter++;
    this.mapping.set(cssVar, placeholder);
    return placeholder;
  }

  /**
   * Genera tema con placeholder HEX per Shiki
   */
  getMappedTheme(): ThemeRegistration {
    return {
      displayName: OBSIDIAN_THEME.displayName,
      name: OBSIDIAN_THEME.name,
      semanticHighlighting: OBSIDIAN_THEME.semanticHighlighting,
      colors: Object.fromEntries(
        Object.entries(OBSIDIAN_THEME.colors).map(
          ([key, value]) => [key, this.mapColor(value)]
        )
      ),
      tokenColors: OBSIDIAN_THEME.tokenColors.map(token => ({
        ...token,
        settings: {
          ...token.settings,
          foreground: token.settings.foreground
            ? this.mapColor(token.settings.foreground)
            : undefined
        }
      }))
    };
  }

  /**
   * Post-processing: sostituisce placeholder → CSS variable nell'HTML
   */
  fixHTML(html: string): string {
    let result = html;
    for (const [cssVar, placeholder] of this.mapping) {
      result = result.replaceAll(placeholder, cssVar);
    }
    return result;
  }

  /**
   * Resetta il mapping (utile per reload)
   */
  reset(): void {
    this.mapping.clear();
    this.counter = 0;
  }
}
```

### 3. src/themes/index.ts

```typescript
export { OBSIDIAN_THEME } from './ObsidianTheme';
export { ThemeMapper, OBSIDIAN_THEME_IDENTIFIER } from './ThemeMapper';
```

---

## File da Modificare

### 4. src/engine/shiki-engine.ts

```typescript
// Aggiungere import
import { ThemeMapper, OBSIDIAN_THEME_IDENTIFIER } from '../themes';

// Nella classe ShikiEngine, aggiungere
private themeMapper: ThemeMapper;

// Nel metodo init()
async init(): Promise<void> {
  if (this.highlighter) return;

  // Creare mapper e ottenere tema con placeholder
  this.themeMapper = new ThemeMapper();
  const mappedTheme = this.themeMapper.getMappedTheme();

  this.highlighter = await createHighlighter({
    themes: [mappedTheme],  // ← tema con placeholder
    langs: BUNDLED_LANGUAGES,
  });
}

// Nel metodo highlight()
async highlight(code: string, lang: string): Promise<string> {
  await this.init();
  // ... language resolution ...

  const rawHtml = this.highlighter!.codeToHtml(code, {
    lang: resolvedLang,
    theme: OBSIDIAN_THEME_IDENTIFIER,  // ← usare nostro tema
  });

  // Post-processing: placeholder → CSS variables
  return this.themeMapper.fixHTML(rawHtml);
}
```

### 5. styles.css (aggiungere)

```css
/* ==========================================================================
   Shiki CSS Variables - Fallback per temi che non le definiscono
   ========================================================================== */

/*
 * Questi valori vengono usati se il tema Obsidian attivo non definisce
 * le CSS variables --shiki-code-*. Colori ispirati a Dracula.
 */

/* Dark mode fallback */
.theme-dark {
  --shiki-code-background: #282a36;
  --shiki-code-normal: #f8f8f2;
  --shiki-code-keyword: #ff79c6;
  --shiki-code-function: #50fa7b;
  --shiki-code-property: #8be9fd;
  --shiki-code-string: #f1fa8c;
  --shiki-code-comment: #6272a4;
  --shiki-code-value: #bd93f9;
  --shiki-code-important: #ffb86c;
  --shiki-code-punctuation: #f8f8f2;
}

/* Light mode fallback */
.theme-light {
  --shiki-code-background: #f8f8f2;
  --shiki-code-normal: #282a36;
  --shiki-code-keyword: #d63384;
  --shiki-code-function: #28a745;
  --shiki-code-property: #0d6efd;
  --shiki-code-string: #fd7e14;
  --shiki-code-comment: #6c757d;
  --shiki-code-value: #6f42c1;
  --shiki-code-important: #dc3545;
  --shiki-code-punctuation: #282a36;
}
```

### 6. README.md (aggiungere sezione Credits)

```markdown
## Credits

- Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)
- Theme CSS variables mapping based on their ObsidianTheme implementation
```

---

## CSS Variables Reference

| Variable | Uso | Esempio |
|----------|-----|---------|
| `--shiki-code-background` | Sfondo code block | `#282a36` |
| `--shiki-code-normal` | Testo normale, variabili | `#f8f8f2` |
| `--shiki-code-keyword` | `if`, `return`, `new`, `throw` | `#ff79c6` |
| `--shiki-code-function` | Nomi funzioni e metodi | `#50fa7b` |
| `--shiki-code-property` | Tipi, classi, proprietà | `#8be9fd` |
| `--shiki-code-string` | Stringhe letterali | `#f1fa8c` |
| `--shiki-code-comment` | Commenti | `#6272a4` |
| `--shiki-code-value` | Costanti, valori speciali | `#bd93f9` |
| `--shiki-code-important` | Parametri, annotazioni | `#ffb86c` |
| `--shiki-code-punctuation` | `()`, `{}`, `;`, `,` | `#f8f8f2` |

---

## Vantaggi

| Vantaggio | Descrizione |
|-----------|-------------|
| **Dinamico** | Colori cambiano automaticamente con tema Obsidian |
| **Dark/Light** | Funziona con entrambi i modi senza re-init |
| **Compatibile** | Funziona con tutti i temi che definiscono le variables |
| **Fallback** | Se tema non ha variables, usiamo i nostri colori |
| **Provato** | Plugin originale ha 1000+ utenti |

---

## Rischi e Mitigazioni

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| Tema senza CSS variables | Media | Fallback nel nostro CSS |
| Conflitto placeholder/codice | Molto bassa | Placeholder sono `#000000`-`#00000F` |
| Performance | Molto bassa | String replace è O(n), HTML piccolo |

---

## Checklist Implementazione

- [ ] Creare `src/themes/ObsidianTheme.ts`
- [ ] Creare `src/themes/ThemeMapper.ts`
- [ ] Creare `src/themes/index.ts`
- [ ] Modificare `src/engine/shiki-engine.ts`
- [ ] Aggiungere CSS variables fallback a `styles.css`
- [ ] Test con tema Baseline
- [ ] Test dark/light mode
- [ ] Test con altri temi
- [ ] Aggiungere crediti a `README.md`
- [ ] Commit e push
