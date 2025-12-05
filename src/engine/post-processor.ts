import { MarkdownPostProcessorContext } from "obsidian";
import { ShikiEngine } from "./shiki-engine";

/**
 * Creates a MarkdownPostProcessor for Shiki syntax highlighting
 *
 * This processor intercepts code blocks in Reading view and replaces
 * Obsidian's default Prism.js highlighting with Shiki.
 */
export function createShikiPostProcessor(engine: ShikiEngine, debug = false) {
  return async (
    el: HTMLElement,
    _ctx: MarkdownPostProcessorContext
  ): Promise<void> => {
    // Find all code blocks in the element
    const codeBlocks = el.querySelectorAll("pre > code");

    if (codeBlocks.length === 0) {
      return;
    }

    const promises = Array.from(codeBlocks).map(async (codeEl) => {
      const pre = codeEl.parentElement;
      if (!pre) return;

      // Extract language from class (e.g., "language-javascript")
      const lang = extractLanguage(codeEl);
      const code = codeEl.textContent ?? "";

      if (debug) {
        console.log(`[Code Forge] Processing code block: lang=${lang}, length=${code.length}`);
      }

      try {
        // Get highlighted HTML from Shiki
        const highlightedHtml = await engine.highlight(code, lang);

        if (debug) {
          console.log(`[Code Forge] Got highlighted HTML, length=${highlightedHtml.length}`);
        }

        // Create a temporary container to parse the HTML
        const temp = document.createElement("div");
        temp.innerHTML = highlightedHtml;

        const newPre = temp.querySelector("pre");
        if (newPre) {
          // Preserve original classes and add our marker
          newPre.classList.add("code-forge-highlighted");

          // Copy data attributes from original
          copyDataAttributes(pre, newPre);

          // Replace the original pre element
          pre.replaceWith(newPre);

          if (debug) {
            console.log("[Code Forge] Replaced pre element successfully");
          }
        }
      } catch (error) {
        console.error("[Code Forge] Failed to highlight code block:", error);
        // Keep original code block on error
      }
    });

    await Promise.all(promises);
  };
}

/**
 * Extract language identifier from code element's class
 *
 * Obsidian adds classes like "language-javascript" or "language-js"
 */
export function extractLanguage(codeEl: Element): string {
  const classes = Array.from(codeEl.classList);

  for (const cls of classes) {
    if (cls.startsWith("language-")) {
      return cls.slice(9); // Remove "language-" prefix
    }
  }

  // Check parent pre element for language class
  const pre = codeEl.parentElement;
  if (pre) {
    const preClasses = Array.from(pre.classList);
    for (const cls of preClasses) {
      if (cls.startsWith("language-")) {
        return cls.slice(9);
      }
    }
  }

  // Default to text if no language found
  return "text";
}

/**
 * Copy data attributes from source to target element
 */
function copyDataAttributes(source: Element, target: Element): void {
  const dataset = (source as HTMLElement).dataset;
  for (const [key, value] of Object.entries(dataset)) {
    if (value !== undefined) {
      (target as HTMLElement).dataset[key] = value;
    }
  }
}
