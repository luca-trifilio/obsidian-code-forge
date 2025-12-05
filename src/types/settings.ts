/**
 * Theme source options
 */
export type ThemeSource = "auto" | "bundled" | "custom";

/**
 * Bundled theme names
 */
export type BundledTheme = "dracula" | "solarized-dark" | "solarized-light" | "nord" | "one-dark";

/**
 * Paste behavior options
 */
export type PasteBehavior = "smart" | "raw";

/**
 * Line number display options
 */
export type LineNumbersDisplay = "always" | "hover" | "never";

/**
 * Code block header position
 */
export type HeaderPosition = "top" | "bottom" | "none";

/**
 * Theme token overrides
 */
export interface ThemeTokenOverrides {
  keyword?: string;
  string?: string;
  comment?: string;
  function?: string;
  variable?: string;
  type?: string;
  number?: string;
  operator?: string;
  punctuation?: string;
  tag?: string;
}

/**
 * Language-specific settings
 */
export interface LanguageSettings {
  enabled: boolean;
  alias?: string;
}

/**
 * Plugin settings interface
 */
export interface CodeForgeSettings {
  // General
  enabled: boolean;
  debugMode: boolean;

  // Syntax highlighting
  highlightingEnabled: boolean;

  // Theme
  themeSource: ThemeSource;
  bundledTheme: BundledTheme;
  themeDark: BundledTheme;
  themeLight: BundledTheme;
  autoSyncTheme: boolean;
  tokenOverrides: ThemeTokenOverrides;

  // Paste handling
  smartPasteEnabled: boolean;
  defaultPasteBehavior: PasteBehavior;
  autoDetectLanguage: boolean;
  autoWrapInCodeBlock: boolean;

  // UI - Code block
  showHeader: boolean;
  headerPosition: HeaderPosition;
  showLanguageIcon: boolean;
  showCopyButton: boolean;
  copyButtonFeedback: "toast" | "icon" | "both";

  // UI - Line numbers
  lineNumbers: LineNumbersDisplay;
  lineNumbersStartFrom: number;

  // UI - Folding
  enableFolding: boolean;
  persistFoldState: boolean;
  foldByDefault: boolean;

  // UI - Highlighting
  enableLineHighlighting: boolean;
  enableDiffMode: boolean;

  // Languages
  languageSettings: Record<string, LanguageSettings>;
  excludedLanguages: string[];

  // Performance
  maxLinesSync: number;
  cacheEnabled: boolean;
  cacheMaxSize: number;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: CodeForgeSettings = {
  // General
  enabled: true,
  debugMode: false,

  // Syntax highlighting
  highlightingEnabled: true,

  // Theme
  themeSource: "auto",
  bundledTheme: "dracula",
  themeDark: "dracula",
  themeLight: "solarized-light",
  autoSyncTheme: true,
  tokenOverrides: {},

  // Paste handling
  smartPasteEnabled: true,
  defaultPasteBehavior: "smart",
  autoDetectLanguage: true,
  autoWrapInCodeBlock: false,

  // UI - Code block
  showHeader: true,
  headerPosition: "top",
  showLanguageIcon: true,
  showCopyButton: true,
  copyButtonFeedback: "both",

  // UI - Line numbers
  lineNumbers: "hover",
  lineNumbersStartFrom: 1,

  // UI - Folding
  enableFolding: true,
  persistFoldState: true,
  foldByDefault: false,

  // UI - Highlighting
  enableLineHighlighting: true,
  enableDiffMode: true,

  // Languages
  languageSettings: {},
  excludedLanguages: [],

  // Performance
  maxLinesSync: 500,
  cacheEnabled: true,
  cacheMaxSize: 100,
};
