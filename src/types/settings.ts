/**
 * Plugin settings interface
 *
 * Philosophy: Less is more. The plugin works out-of-the-box.
 * Focus on best syntax highlighting, delegate UI to themes.
 */
export interface CodeForgeSettings {
  // Internal (not exposed in UI)
  cacheEnabled: boolean;
  cacheMaxSize: number;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: CodeForgeSettings = {
  cacheEnabled: true,
  cacheMaxSize: 100,
};
