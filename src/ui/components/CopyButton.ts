/**
 * Copy button component for code blocks
 *
 * Provides visual feedback on copy success/failure.
 */

const COPY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>`;

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

export interface CopyButtonOptions {
  /** Code content to copy */
  getCode: () => string;
  /** Duration to show success state (ms) */
  feedbackDuration?: number;
}

/**
 * Create a copy button element
 */
export function createCopyButton(options: CopyButtonOptions): HTMLButtonElement {
  const { getCode, feedbackDuration = 2000 } = options;

  const button = document.createElement("button");
  button.className = "code-forge-copy-btn";
  button.setAttribute("aria-label", "Copy code");
  button.innerHTML = COPY_ICON;

  let timeout: ReturnType<typeof setTimeout> | null = null;

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const code = getCode();

    try {
      await navigator.clipboard.writeText(code);

      // Show success state
      button.innerHTML = CHECK_ICON;
      button.classList.add("copied");
      button.setAttribute("aria-label", "Copied!");

      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Reset after delay
      timeout = setTimeout(() => {
        button.innerHTML = COPY_ICON;
        button.classList.remove("copied");
        button.setAttribute("aria-label", "Copy code");
        timeout = null;
      }, feedbackDuration);
    } catch (err) {
      console.error("[Code Forge] Failed to copy:", err);
      // Could show error state here if needed
    }
  });

  return button;
}
