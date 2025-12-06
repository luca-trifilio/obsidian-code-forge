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
 * Creates a ViewPlugin that manually attaches a paste event listener
 * with capture phase to intercept before Obsidian
 */
export function createPasteHandler() {
  console.warn("[Code Forge] createPasteHandler() called");

  return ViewPlugin.fromClass(
    class {
      private handlePaste: (event: ClipboardEvent) => void;

      constructor(private view: EditorView) {
        this.handlePaste = (event: ClipboardEvent) => {
          console.warn("[Code Forge] Capture paste event fired");

          const pos = this.view.state.selection.main.head;
          const insideCodeBlock = isInsideCodeBlock(this.view, pos);
          console.warn("[Code Forge] Inside code block:", insideCodeBlock);

          if (!insideCodeBlock) {
            return; // Let default handler process
          }

          // Get plain text from clipboard
          const text = event.clipboardData?.getData("text/plain");
          if (!text) {
            return;
          }

          console.warn("[Code Forge] Text length:", text.length);

          // Get base indentation from current line
          const baseIndent = getBaseIndent(this.view);
          console.warn("[Code Forge] Base indent:", JSON.stringify(baseIndent));

          // Process the pasted code
          const processed = processPastedCode(text, baseIndent);
          console.warn("[Code Forge] Processed:", processed.slice(0, 100));

          // Get current selection
          const { from, to } = this.view.state.selection.main;

          // Insert processed text, replacing any selection
          this.view.dispatch({
            changes: { from, to, insert: processed },
            selection: { anchor: from + processed.length },
          });

          // Prevent default paste behavior
          event.preventDefault();
          event.stopPropagation();
        };

        // Attach with capture phase to intercept before Obsidian
        this.view.dom.addEventListener("paste", this.handlePaste, true);
        console.warn("[Code Forge] Paste listener attached with capture");
      }

      update(_update: ViewUpdate) {
        // No updates needed
      }

      destroy() {
        this.view.dom.removeEventListener("paste", this.handlePaste, true);
        console.warn("[Code Forge] Paste listener removed");
      }
    }
  );
}
