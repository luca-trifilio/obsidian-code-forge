/**
 * Code block header component
 *
 * Displays language icon, name, and copy button.
 *
 * Structure:
 * ┌─────────────────────────────────────────┐
 * │ [icon] JavaScript              [copy]   │
 * └─────────────────────────────────────────┘
 */

import { getLanguageIcon, getLanguageDisplayName } from "../icons/language-icons";
import { createCopyButton } from "./CopyButton";

export interface CodeBlockHeaderOptions {
  /** Language identifier (e.g., "javascript", "py") */
  language: string;
  /** Function to get code content for copy */
  getCode: () => string;
  /** Whether to show copy button */
  showCopyButton: boolean;
}

/**
 * Create a code block header element
 */
export function createCodeBlockHeader(options: CodeBlockHeaderOptions): HTMLElement {
  const { language, getCode, showCopyButton } = options;

  const header = document.createElement("div");
  header.className = "code-forge-header";

  // Left side: icon + language name
  const left = document.createElement("div");
  left.className = "code-forge-header-left";

  // Language icon
  const iconWrapper = document.createElement("span");
  iconWrapper.className = "code-forge-language-icon";
  iconWrapper.innerHTML = getLanguageIcon(language);
  left.appendChild(iconWrapper);

  // Language name
  const langName = document.createElement("span");
  langName.className = "code-forge-language-name";
  langName.textContent = getLanguageDisplayName(language);
  left.appendChild(langName);

  header.appendChild(left);

  // Right side: copy button
  if (showCopyButton) {
    const right = document.createElement("div");
    right.className = "code-forge-header-right";

    const copyButton = createCopyButton({ getCode });
    right.appendChild(copyButton);

    header.appendChild(right);
  }

  return header;
}

/**
 * Wrap a pre element with container and header
 */
export function wrapCodeBlock(
  pre: HTMLElement,
  options: Omit<CodeBlockHeaderOptions, "getCode">
): HTMLElement {
  const container = document.createElement("div");
  container.className = "code-forge-container";

  // Create header
  const header = createCodeBlockHeader({
    ...options,
    getCode: () => {
      // Get code from the pre's code element
      const code = pre.querySelector("code");
      return code?.textContent ?? "";
    },
  });

  container.appendChild(header);
  container.appendChild(pre);

  return container;
}
