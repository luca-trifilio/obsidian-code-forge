/**
 * Indentation utilities for paste handling
 */

/** Standard indent: 2 spaces */
export const INDENT_SIZE = 2;
export const INDENT_CHAR = " ";
export const INDENT_UNIT = INDENT_CHAR.repeat(INDENT_SIZE);

/**
 * Get leading whitespace from a line
 */
export function getLeadingWhitespace(text: string): string {
  const match = text.match(/^(\s*)/);
  return match?.[1] ?? "";
}

/**
 * Convert tabs to spaces (2 spaces per tab)
 */
export function tabsToSpaces(text: string): string {
  return text.replace(/\t/g, INDENT_UNIT);
}

/**
 * Calculate indent level (number of indent units)
 */
export function getIndentLevel(whitespace: string): number {
  const normalized = tabsToSpaces(whitespace);
  return Math.floor(normalized.length / INDENT_SIZE);
}

/**
 * Create indentation string for a given level
 */
export function createIndent(level: number): string {
  return INDENT_UNIT.repeat(level);
}

/**
 * Normalize indentation in multi-line code
 * - Converts tabs to spaces
 * - Preserves relative indentation
 * - Applies base indent to all lines
 */
export function normalizeIndentation(
  text: string,
  baseIndent: string
): string {
  const lines = text.split("\n");

  if (lines.length === 1) {
    return tabsToSpaces(text);
  }

  // Convert all tabs to spaces first
  const normalizedLines = lines.map(tabsToSpaces);

  // Find minimum indent (ignoring empty lines)
  let minIndent = Infinity;
  for (const line of normalizedLines) {
    if (line.trim().length === 0) continue;
    const indent = getLeadingWhitespace(line).length;
    minIndent = Math.min(minIndent, indent);
  }

  if (minIndent === Infinity) minIndent = 0;

  // Remove common indent and apply base indent
  return normalizedLines
    .map((line, index) => {
      if (line.trim().length === 0) {
        // Preserve empty lines
        return "";
      }

      // First line: don't add base indent (cursor already positioned)
      if (index === 0) {
        return line.slice(minIndent);
      }

      // Other lines: remove common indent, add base indent
      return baseIndent + line.slice(minIndent);
    })
    .join("\n");
}
