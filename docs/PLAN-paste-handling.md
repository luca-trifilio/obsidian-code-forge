# Piano: Smart Paste Handling ✅ COMPLETATO

## Problema

Quando si incolla codice in un code block, Obsidian/CodeMirror:
- Può alterare l'indentazione originale
- Non riconosce che siamo in un code block
- Applica auto-indent del markdown invece del codice

## Soluzione Implementata

Intercettare paste events nei code blocks e normalizzare l'indentazione.

---

## Decisioni

1. **Formato clipboard**: solo `text/plain`
2. **Indentazione**: standard 2 spazi, tab convertiti in 2 spazi
3. **No formattazione ricca**: ignoriamo `text/html`

---

## File Creati

```
src/paste/
├── PasteHandler.ts      # Logica principale (EditorView.domEventHandlers)
├── indentation.ts       # Utility per indentazione
└── index.ts             # Export
```

---

## Implementazione

### PasteHandler.ts

- `createPasteHandler()` - Extension per CodeMirror 6
- `isInsideCodeBlock()` - Detect code block via syntax tree
- `getBaseIndent()` - Ottieni indentazione corrente
- `processPastedCode()` - Normalizza il codice incollato

### indentation.ts

- `INDENT_SIZE = 2` - Dimensione indent standard
- `getLeadingWhitespace()` - Estrae whitespace iniziale
- `tabsToSpaces()` - Converte tab → 2 spazi
- `getIndentLevel()` - Calcola livello indentazione
- `createIndent()` - Crea stringa indent
- `normalizeIndentation()` - Normalizza codice multi-linea

---

## Algoritmo normalizeIndentation

1. Converti tutti i tab in 2 spazi
2. Trova l'indentazione minima comune (ignorando linee vuote)
3. Rimuovi l'indentazione comune da tutte le linee
4. Aggiungi base indent alle linee successive (non alla prima)
5. Preserva linee vuote senza aggiungere indent

---

## Test

43 unit test in `tests/indentation.test.ts`:

- ✅ getLeadingWhitespace (6 test)
- ✅ tabsToSpaces (6 test)
- ✅ getIndentLevel (6 test)
- ✅ createIndent (4 test)
- ✅ normalizeIndentation single line (2 test)
- ✅ normalizeIndentation multi-line (8 test)
- ✅ normalizeIndentation empty lines (3 test)
- ✅ normalizeIndentation edge cases (4 test)
- ✅ normalizeIndentation real-world examples (4 test)

---

## Integrazione

```typescript
// main.ts
import { createPasteHandler } from "@/paste";

this.registerEditorExtension(createPasteHandler());
```

---

## PR

- PR #10: https://github.com/luca-trifilio/obsidian-code-forge/pull/10
- Closes Issue #4
- Label: `release:minor`
