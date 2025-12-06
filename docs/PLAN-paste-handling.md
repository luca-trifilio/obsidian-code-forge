# Piano: Smart Paste Handling

## Problema

Quando si incolla codice in un code block, Obsidian/CodeMirror:
- Può alterare l'indentazione originale
- Non riconosce che siamo in un code block
- Applica auto-indent del markdown invece del codice

## Obiettivo

Preservare l'indentazione e la formattazione originale del codice incollato.

---

## Analisi Tecnica

### Come funziona il paste in CodeMirror 6

1. L'evento `paste` viene intercettato dal DOM
2. CodeMirror processa il contenuto della clipboard
3. Viene applicato l'auto-indent basato sul contesto

### Come intercettare

```typescript
EditorView.domEventHandlers({
  paste(event: ClipboardEvent, view: EditorView) {
    // Intercetta qui
    // return true per bloccare comportamento default
  }
})
```

### Come detectare se siamo in un code block

Usando il syntax tree (stesso approccio di ShikiViewPlugin):

```typescript
import { syntaxTree } from "@codemirror/language";

function isInsideCodeBlock(view: EditorView): boolean {
  const pos = view.state.selection.main.head;
  const tree = syntaxTree(view.state);

  let inCodeBlock = false;
  tree.iterate({
    enter: (node) => {
      if (node.name.includes("codeblock") &&
          node.from <= pos && pos <= node.to) {
        inCodeBlock = true;
      }
    }
  });

  return inCodeBlock;
}
```

---

## Implementazione

### File da creare

```
src/paste/
├── PasteHandler.ts      # Logica principale
├── indentation.ts       # Utility per indentazione
└── index.ts             # Export
```

### Step 1: PasteHandler base

```typescript
// src/paste/PasteHandler.ts

import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";

export function createPasteHandler() {
  return EditorView.domEventHandlers({
    paste(event: ClipboardEvent, view: EditorView) {
      // 1. Check se siamo in un code block
      if (!isInsideCodeBlock(view)) {
        return false; // Comportamento default
      }

      // 2. Ottieni testo dalla clipboard
      const text = event.clipboardData?.getData("text/plain");
      if (!text) return false;

      // 3. Processa e inserisci
      const processed = processCodePaste(text, view);

      // 4. Inserisci nel documento
      view.dispatch({
        changes: {
          from: view.state.selection.main.from,
          to: view.state.selection.main.to,
          insert: processed
        }
      });

      // 5. Blocca comportamento default
      event.preventDefault();
      return true;
    }
  });
}
```

### Step 2: Detect code block

```typescript
function isInsideCodeBlock(view: EditorView): boolean {
  const pos = view.state.selection.main.head;
  const tree = syntaxTree(view.state);

  let result = false;

  tree.iterate({
    enter: (node) => {
      // Code block content (non begin/end)
      if (node.name === "HyperMD-codeblock_HyperMD-codeblock-bg" &&
          node.from <= pos && pos <= node.to) {
        result = true;
      }
    }
  });

  return result;
}
```

### Step 3: Processare il codice incollato

```typescript
function processCodePaste(text: string, view: EditorView): string {
  // Ottieni indentazione corrente della linea
  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const currentIndent = getLeadingWhitespace(line.text);

  // Normalizza il codice incollato
  const lines = text.split('\n');

  // Se è una sola linea, inserisci così com'è
  if (lines.length === 1) {
    return text;
  }

  // Per multi-linea: mantieni indentazione relativa
  const firstLineIndent = getLeadingWhitespace(lines[0]);

  return lines.map((line, i) => {
    if (i === 0) {
      // Prima linea: inserisci così com'è (cursor già posizionato)
      return line;
    }

    // Altre linee: rimuovi indent comune, aggiungi indent corrente
    const lineIndent = getLeadingWhitespace(line);
    const relativeIndent = lineIndent.slice(firstLineIndent.length);
    return currentIndent + relativeIndent + line.trimStart();
  }).join('\n');
}

function getLeadingWhitespace(text: string): string {
  const match = text.match(/^(\s*)/);
  return match ? match[1] : '';
}
```

### Step 4: Registrare l'extension

```typescript
// main.ts

import { createPasteHandler } from "./paste";

// In onload():
this.registerEditorExtension(createPasteHandler());
```

---

## Edge Cases da gestire

1. **Selezione multipla**: paste con più cursori
2. **Paste su selezione**: sostituire testo selezionato
3. **Tab vs Spaces**: rispettare le impostazioni dell'editor
4. **Code block vuoto**: prima linea dopo ```
5. **Paste da IDE**: preservare formattazione ricca?

---

## Testing

### Unit tests

```typescript
describe("PasteHandler", () => {
  it("should preserve indentation for multi-line paste");
  it("should not modify single-line paste");
  it("should handle mixed tabs and spaces");
  it("should work with empty lines");
});
```

### Manual tests

- [ ] Paste codice da VSCode
- [ ] Paste codice da browser
- [ ] Paste in code block vuoto
- [ ] Paste con selezione attiva
- [ ] Paste multi-linea con indent variabile

---

## Decisioni

1. **Formato clipboard**: solo `text/plain`
2. **Indentazione**: standard 2 spazi, tab convertiti in 2 spazi
3. **No formattazione ricca**: ignoriamo `text/html`

---

## Timeline

1. [ ] Creare struttura file `src/paste/`
2. [ ] Implementare `isInsideCodeBlock()`
3. [ ] Implementare `processCodePaste()` base
4. [ ] Registrare extension in main.ts
5. [ ] Test manuale
6. [ ] Gestire edge cases
7. [ ] Unit tests
