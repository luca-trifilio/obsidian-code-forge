/**
 * PasteHandler - Smart paste handling for code blocks
 *
 * Intercepts paste events inside code blocks and preserves
 * the original indentation of the pasted code.
 */

import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { getLeadingWhitespace, normalizeIndentation } from "./indentation";

/**
 * Check if a position is inside a code block
 */
function isInsideCodeBlock(view: EditorView, pos: number): boolean {
  const tree = syntaxTree(view.state);

  let result = false;

  tree.iterate({
    enter: (node) => {
      // Match code block content lines (not begin/end fences)
      if (
        node.name === "HyperMD-codeblock_HyperMD-codeblock-bg" &&
        node.from <= pos &&
        pos <= node.to
      ) {
        result = true;
      }
    },
  });

  return result;
}

/**
 * Get the base indentation at the current cursor position
 */
function getBaseIndent(view: EditorView): string {
  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  return getLeadingWhitespace(line.text);
}

/**
 * Process pasted text for code blocks
 */
function processPastedCode(text: string, baseIndent: string): string {
  return normalizeIndentation(text, baseIndent);
}

/**
 * Creates an EditorView extension that handles paste events in code blocks
 * Uses inputHandler which intercepts text input including paste
 */
export function createPasteHandler() {
  console.warn("[Code Forge] createPasteHandler() called");

  return EditorView.inputHandler.of(
    (view: EditorView, from: number, to: number, text: string) => {
      // Only intercept multi-line input (likely paste)
      if (!text.includes("\n")) {
        return false;
      }

      console.warn("[Code Forge] inputHandler fired, text length:", text.length);

      // Only handle paste inside code blocks
      const insideCodeBlock = isInsideCodeBlock(view, from);
      console.warn("[Code Forge] Inside code block:", insideCodeBlock);

      if (!insideCodeBlock) {
        return false; // Let default handler process
      }

      // Get base indentation from current line
      const baseIndent = getBaseIndent(view);
      console.warn("[Code Forge] Base indent:", JSON.stringify(baseIndent));

      // Process the pasted code
      const processed = processPastedCode(text, baseIndent);
      console.warn("[Code Forge] Processed text:", processed.slice(0, 100));

      // Insert processed text, replacing any selection
      view.dispatch({
        changes: { from, to, insert: processed },
        selection: { anchor: from + processed.length },
      });

      return true; // We handled it
    }
  );
}
