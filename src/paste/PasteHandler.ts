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
 * Check if the cursor is inside a code block
 */
function isInsideCodeBlock(view: EditorView): boolean {
  const pos = view.state.selection.main.head;
  const tree = syntaxTree(view.state);

  let result = false;
  const foundNodes: string[] = [];

  tree.iterate({
    enter: (node) => {
      // Log nodes that contain the cursor position
      if (node.from <= pos && pos <= node.to) {
        foundNodes.push(node.name);
      }

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

  console.warn("[Code Forge] Nodes at cursor:", foundNodes);
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
 */
export function createPasteHandler() {
  return EditorView.domEventHandlers({
    paste(event: ClipboardEvent, view: EditorView) {
      console.warn("[Code Forge] Paste event fired");

      // Only handle paste inside code blocks
      const insideCodeBlock = isInsideCodeBlock(view);
      console.warn("[Code Forge] Inside code block:", insideCodeBlock);

      if (!insideCodeBlock) {
        return false;
      }

      // Get plain text from clipboard
      const text = event.clipboardData?.getData("text/plain");
      if (!text) {
        return false;
      }

      // Get base indentation from current line
      const baseIndent = getBaseIndent(view);

      // Process the pasted code
      const processed = processPastedCode(text, baseIndent);

      // Get current selection
      const { from, to } = view.state.selection.main;

      // Insert processed text, replacing any selection
      view.dispatch({
        changes: { from, to, insert: processed },
        selection: { anchor: from + processed.length },
      });

      // Prevent default paste behavior
      event.preventDefault();
      return true;
    },
  });
}
