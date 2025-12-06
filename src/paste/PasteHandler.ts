/**
 * PasteHandler - Smart paste handling for code blocks
 *
 * Intercepts paste events inside code blocks and preserves
 * the original indentation of the pasted code.
 */

import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
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
 * Creates a ViewPlugin that intercepts paste events in code blocks
 * Uses capture phase to intercept before Obsidian's default handling
 */
export function createPasteHandler() {
  return ViewPlugin.fromClass(
    class {
      private handlePaste: (event: ClipboardEvent) => void;

      constructor(private view: EditorView) {
        this.handlePaste = (event: ClipboardEvent) => {
          const pos = this.view.state.selection.main.head;

          if (!isInsideCodeBlock(this.view, pos)) {
            return; // Let default handler process
          }

          const text = event.clipboardData?.getData("text/plain");
          if (!text) {
            return;
          }

          const baseIndent = getBaseIndent(this.view);
          const processed = processPastedCode(text, baseIndent);
          const { from, to } = this.view.state.selection.main;

          this.view.dispatch({
            changes: { from, to, insert: processed },
            selection: { anchor: from + processed.length },
          });

          event.preventDefault();
          event.stopPropagation();
        };

        // Attach with capture phase to intercept before Obsidian
        this.view.dom.addEventListener("paste", this.handlePaste, true);
      }

      update(_update: ViewUpdate) {
        // No updates needed
      }

      destroy() {
        this.view.dom.removeEventListener("paste", this.handlePaste, true);
      }
    }
  );
}
