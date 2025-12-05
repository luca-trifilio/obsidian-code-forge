/**
 * Plugin settings interface
 *
 * Philosophy: Less is more. The plugin works out-of-the-box.
 * Only expose settings that users actually need to customize.
 */
export interface CodeForgeSettings {
  // UI
  showCopyButton: boolean;

  // Internal (not exposed in UI)
  cacheEnabled: boolean;
  cacheMaxSize: number;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: CodeForgeSettings = {
  // UI
  showCopyButton: true,

  // Internal
  cacheEnabled: true,
  cacheMaxSize: 100,
};
