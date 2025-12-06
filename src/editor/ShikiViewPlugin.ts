/**
 * ShikiViewPlugin - CodeMirror 6 ViewPlugin for syntax highlighting in Edit mode
 *
 * This plugin applies Shiki syntax highlighting to code blocks in Live Preview
 * and Source mode by creating mark decorations for each token.
 */

import {
  ViewPlugin,
  ViewUpdate,
  Decoration,
  DecorationSet,
  EditorView,
  PluginValue,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import type { ShikiEngine } from "../engine/shiki-engine";

interface CodeBlockLine {
  from: number; // Document position where line starts
  to: number;   // Document position where line ends
  text: string; // Line content
}

interface CodeBlock {
  language: string;
  lines: CodeBlockLine[];
}

/**
 * Creates a ViewPlugin that applies Shiki highlighting to code blocks
 */
export function createShikiViewPlugin(engine: ShikiEngine) {
  class ShikiViewPluginClass implements PluginValue {
    decorations: DecorationSet;
    private pendingUpdate: boolean = false;

    constructor(view: EditorView) {
      this.decorations = Decoration.none;
      this.computeDecorationsAsync(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.computeDecorationsAsync(update.view);
      }
    }

    private async computeDecorationsAsync(view: EditorView) {
      if (this.pendingUpdate) return;
      this.pendingUpdate = true;

      try {
        const codeBlocks = this.findCodeBlocks(view);
        const decorations = await this.buildDecorations(view, codeBlocks);
        this.decorations = decorations;
        view.requestMeasure();
      } finally {
        this.pendingUpdate = false;
      }
    }

    /**
     * Find all code blocks by traversing the syntax tree
     */
    private findCodeBlocks(view: EditorView): CodeBlock[] {
      const blocks: CodeBlock[] = [];
      const doc = view.state.doc;
      const tree = syntaxTree(view.state);

      let currentBlock: {
        language: string;
        lines: CodeBlockLine[];
        seenPositions: Set<number>;
      } | null = null;

      tree.iterate({
        enter: (node) => {
          const name = node.name;

          // Start of code block (```)
          if (name === "HyperMD-codeblock-begin" || name.includes("codeblock-begin")) {
            const lineText = doc.sliceString(node.from, node.to);
            const match = lineText.match(/^```(\w+)?/);
            const language = match?.[1] || "text";

            currentBlock = {
              language,
              lines: [],
              seenPositions: new Set(),
            };
          }

          // Code content line - match the line-level node, not token nodes
          // Line nodes are exactly "HyperMD-codeblock_HyperMD-codeblock-bg"
          // Begin/end nodes have additional suffixes like "-begin" or "-end"
          if (
            currentBlock &&
            name === "HyperMD-codeblock_HyperMD-codeblock-bg" &&
            !currentBlock.seenPositions.has(node.from)
          ) {
            currentBlock.seenPositions.add(node.from);
            currentBlock.lines.push({
              from: node.from,
              to: node.to,
              text: doc.sliceString(node.from, node.to),
            });
          }

          // End of code block (```)
          if (name === "HyperMD-codeblock-end" || name.includes("codeblock-end")) {
            if (currentBlock && currentBlock.lines.length > 0) {
              blocks.push({
                language: currentBlock.language,
                lines: currentBlock.lines,
              });
            }
            currentBlock = null;
          }
        },
      });

      return blocks;
    }

    /**
     * Build decorations for all code blocks
     */
    private async buildDecorations(
      view: EditorView,
      codeBlocks: CodeBlock[]
    ): Promise<DecorationSet> {
      const builder = new RangeSetBuilder<Decoration>();
      const themeMapper = engine.getThemeMapper();
      const doc = view.state.doc;

      for (const block of codeBlocks) {
        if (block.lines.length === 0) continue;

        try {
          // Get code as single string for Shiki
          const code = block.lines.map(l => l.text).join("\n");
          const result = await engine.getTokens(code, block.language);

          // Apply tokens line by line
          for (let lineIdx = 0; lineIdx < result.tokens.length; lineIdx++) {
            const lineTokens = result.tokens[lineIdx];
            const codeLine = block.lines[lineIdx];

            if (!lineTokens || !codeLine) continue;

            let charOffset = 0;

            for (const token of lineTokens) {
              const tokenStart = codeLine.from + charOffset;
              const tokenEnd = tokenStart + token.content.length;

              // Ensure within bounds
              if (tokenStart >= 0 && tokenEnd <= doc.length && tokenEnd <= codeLine.to + 1) {
                // Convert placeholder to CSS variable, fallback to normal color
                const color = themeMapper.placeholderToCssVar(token.color)
                  ?? "var(--shiki-code-normal)";

                const decoration = Decoration.mark({
                  attributes: {
                    style: `color: ${color};`,
                    class: "code-forge-token",
                  },
                });

                builder.add(tokenStart, tokenEnd, decoration);
              }

              charOffset += token.content.length;
            }
          }
        } catch (error) {
          console.warn("[Code Forge] Failed to highlight code block:", error);
        }
      }

      return builder.finish();
    }

    destroy() {}
  }

  return ViewPlugin.fromClass(ShikiViewPluginClass, {
    decorations: (instance) => instance.decorations,
  });
}
