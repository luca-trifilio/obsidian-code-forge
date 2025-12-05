import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";

/**
 * Top 20 most common languages - bundled for instant highlighting
 */
export const BUNDLED_LANGUAGES: BundledLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "bash",
];

/**
 * Language aliases mapping common names to Shiki language IDs
 */
export const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  rs: "rust",
  cs: "csharp",
  "c++": "cpp",
  "c#": "csharp",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  jsx: "javascript",
  tsx: "typescript",
  text: "plaintext",
  plain: "plaintext",
  txt: "plaintext",
};

export interface ShikiEngineOptions {
  theme?: BundledTheme;
  defaultLanguage?: string;
}

/**
 * ShikiEngine - Manages Shiki highlighter instance with lazy loading
 *
 * Features:
 * - Lazy initialization (highlighter created on first use)
 * - Top 20 languages bundled for instant highlighting
 * - Dynamic language loading for other languages
 * - Language alias resolution
 * - Caching of loaded languages
 */
export class ShikiEngine {
  private highlighter: Highlighter | null = null;
  private initPromise: Promise<Highlighter> | null = null;
  private loadedLanguages: Set<string> = new Set();
  private theme: BundledTheme;
  private defaultLanguage: string;

  constructor(options: ShikiEngineOptions = {}) {
    this.theme = options.theme ?? "github-dark";
    this.defaultLanguage = options.defaultLanguage ?? "plaintext";
  }

  /**
   * Initialize the highlighter with bundled languages
   * Called lazily on first highlight request
   */
  private async init(): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = createHighlighter({
      themes: [this.theme],
      langs: BUNDLED_LANGUAGES,
    }).then((highlighter) => {
      this.highlighter = highlighter;
      BUNDLED_LANGUAGES.forEach((lang) => this.loadedLanguages.add(lang));
      return highlighter;
    });

    return this.initPromise;
  }

  /**
   * Resolve language alias to Shiki language ID
   */
  resolveLanguage(lang: string): string {
    const normalized = lang.toLowerCase().trim();
    return LANGUAGE_ALIASES[normalized] ?? normalized;
  }

  /**
   * Check if a language is already loaded
   */
  isLanguageLoaded(lang: string): boolean {
    const resolved = this.resolveLanguage(lang);
    return this.loadedLanguages.has(resolved);
  }

  /**
   * Load a language dynamically if not already loaded
   */
  async loadLanguage(lang: string): Promise<boolean> {
    const resolved = this.resolveLanguage(lang);

    if (this.loadedLanguages.has(resolved)) {
      return true;
    }

    const highlighter = await this.init();

    try {
      await highlighter.loadLanguage(resolved as BundledLanguage);
      this.loadedLanguages.add(resolved);
      return true;
    } catch (error) {
      console.warn(`[Code Forge] Failed to load language: ${lang}`, error);
      return false;
    }
  }

  /**
   * Highlight code with the specified language
   *
   * @param code - The code to highlight
   * @param lang - The language identifier (supports aliases)
   * @returns HTML string with highlighted code
   */
  async highlight(code: string, lang: string): Promise<string> {
    const highlighter = await this.init();
    const resolved = this.resolveLanguage(lang);

    // Try to load language if not already loaded
    if (!this.loadedLanguages.has(resolved)) {
      const loaded = await this.loadLanguage(resolved);
      if (!loaded) {
        // Fallback to default language
        return highlighter.codeToHtml(code, {
          lang: this.defaultLanguage,
          theme: this.theme,
        });
      }
    }

    try {
      return highlighter.codeToHtml(code, {
        lang: resolved as BundledLanguage,
        theme: this.theme,
      });
    } catch (error) {
      console.warn(`[Code Forge] Highlight error for ${lang}:`, error);
      // Fallback to plain text
      return highlighter.codeToHtml(code, {
        lang: this.defaultLanguage,
        theme: this.theme,
      });
    }
  }

  /**
   * Get highlighted tokens for more granular control
   * Useful for custom rendering or line-by-line processing
   */
  async getTokens(code: string, lang: string) {
    const highlighter = await this.init();
    const resolved = this.resolveLanguage(lang);

    if (!this.loadedLanguages.has(resolved)) {
      await this.loadLanguage(resolved);
    }

    const effectiveLang = this.loadedLanguages.has(resolved)
      ? resolved
      : this.defaultLanguage;

    return highlighter.codeToTokens(code, {
      lang: effectiveLang as BundledLanguage,
      theme: this.theme,
    });
  }

  /**
   * Update the theme
   */
  async setTheme(theme: BundledTheme): Promise<void> {
    this.theme = theme;

    if (this.highlighter) {
      await this.highlighter.loadTheme(theme);
    }
  }

  /**
   * Get list of loaded languages
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages);
  }

  /**
   * Dispose the highlighter and free resources
   */
  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
    }
    this.initPromise = null;
    this.loadedLanguages.clear();
  }
}
