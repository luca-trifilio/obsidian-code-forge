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

interface CodeBlock {
  from: number;
  to: number;
  language: string;
  code: string;
  codeStart: number; // Position where actual code starts (after ```)
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
      // Initial async decoration computation
      this.computeDecorationsAsync(view);
    }

    update(update: ViewUpdate) {
      // Recompute on document or viewport changes
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

        // Apply decorations
        this.decorations = decorations;
        // Trigger redraw
        view.requestMeasure();
      } finally {
        this.pendingUpdate = false;
      }
    }

    /**
     * Find all code blocks in the visible viewport
     */
    private findCodeBlocks(view: EditorView): CodeBlock[] {
      const blocks: CodeBlock[] = [];
      const doc = view.state.doc;
      const tree = syntaxTree(view.state);

      // Track code block state
      let currentBlock: {
        from: number;
        language: string;
        codeStart: number;
        lines: string[];
      } | null = null;

      tree.iterate({
        enter: (node) => {
          const name = node.name;

          // HyperMD-codeblock-begin marks the start (```)
          if (name === "HyperMD-codeblock-begin" || name.includes("codeblock-begin")) {
            const lineText = doc.sliceString(node.from, node.to);
            // Extract language from ```language
            const match = lineText.match(/^```(\w+)?/);
            const language = match?.[1] || "text";

            currentBlock = {
              from: node.from,
              language,
              codeStart: node.to + 1, // After the newline
              lines: [],
            };
          }

          // HyperMD-codeblock is the content line
          if (
            currentBlock &&
            (name === "HyperMD-codeblock" || name.includes("codeblock")) &&
            !name.includes("begin") &&
            !name.includes("end")
          ) {
            const lineText = doc.sliceString(node.from, node.to);
            currentBlock.lines.push(lineText);
          }

          // HyperMD-codeblock-end marks the end (```)
          if (name === "HyperMD-codeblock-end" || name.includes("codeblock-end")) {
            if (currentBlock) {
              blocks.push({
                from: currentBlock.from,
                to: node.to,
                language: currentBlock.language,
                code: currentBlock.lines.join("\n"),
                codeStart: currentBlock.codeStart,
              });
              currentBlock = null;
            }
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

      for (const block of codeBlocks) {
        if (block.code.length === 0) continue;

        try {
          const result = await engine.getTokens(block.code, block.language);
          const doc = view.state.doc;

          // Calculate base position (start of first code line)
          let pos = block.codeStart;

          for (let lineIdx = 0; lineIdx < result.tokens.length; lineIdx++) {
            const lineTokens = result.tokens[lineIdx];
            if (!lineTokens) continue;

            let charOffset = 0;

            // Get the line in the document
            const lineStart = pos;

            for (const token of lineTokens) {
              const tokenStart = lineStart + charOffset;
              const tokenEnd = tokenStart + token.content.length;

              // Only add decoration if within document bounds
              if (tokenStart >= 0 && tokenEnd <= doc.length) {
                // Convert placeholder hex to CSS variable
                const color = themeMapper.placeholderToCssVar(token.color);

                if (color) {
                  const decoration = Decoration.mark({
                    attributes: {
                      style: `color: ${color};`,
                      class: "code-forge-token",
                    },
                  });

                  builder.add(tokenStart, tokenEnd, decoration);
                }
              }

              charOffset += token.content.length;
            }

            // Move to next line (+1 for newline character)
            pos += (lineIdx < result.tokens.length - 1 ? charOffset + 1 : charOffset);
          }
        } catch (error) {
          console.warn("[Code Forge] Failed to highlight code block:", error);
        }
      }

      return builder.finish();
    }

    destroy() {
      // Cleanup if needed
    }
  }

  return ViewPlugin.fromClass(ShikiViewPluginClass, {
    decorations: (instance) => instance.decorations,
  });
}
