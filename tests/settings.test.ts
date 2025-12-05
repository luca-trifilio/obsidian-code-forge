import { describe, it, expect } from "vitest";
import { DEFAULT_SETTINGS, CodeForgeSettings } from "../src/types/settings";

describe("Settings", () => {
  describe("DEFAULT_SETTINGS", () => {
    it("should have all required properties", () => {
      expect(DEFAULT_SETTINGS).toBeDefined();
      expect(DEFAULT_SETTINGS.enabled).toBe(true);
      expect(DEFAULT_SETTINGS.highlightingEnabled).toBe(true);
      expect(DEFAULT_SETTINGS.smartPasteEnabled).toBe(true);
    });

    it("should have valid theme settings", () => {
      expect(DEFAULT_SETTINGS.themeSource).toBe("auto");
      expect(DEFAULT_SETTINGS.bundledTheme).toBe("dracula");
      expect(DEFAULT_SETTINGS.autoSyncTheme).toBe(true);
    });

    it("should have valid UI settings", () => {
      expect(DEFAULT_SETTINGS.showHeader).toBe(true);
      expect(DEFAULT_SETTINGS.showCopyButton).toBe(true);
      expect(DEFAULT_SETTINGS.lineNumbers).toBe("hover");
      expect(DEFAULT_SETTINGS.enableFolding).toBe(true);
    });

    it("should have valid performance settings", () => {
      expect(DEFAULT_SETTINGS.maxLinesSync).toBe(500);
      expect(DEFAULT_SETTINGS.cacheEnabled).toBe(true);
      expect(DEFAULT_SETTINGS.cacheMaxSize).toBe(100);
    });

    it("should have valid paste settings", () => {
      expect(DEFAULT_SETTINGS.defaultPasteBehavior).toBe("smart");
      expect(DEFAULT_SETTINGS.autoDetectLanguage).toBe(true);
      expect(DEFAULT_SETTINGS.autoWrapInCodeBlock).toBe(false);
    });
  });

  describe("Type safety", () => {
    it("should allow valid theme source values", () => {
      const settings: Partial<CodeForgeSettings> = {
        themeSource: "auto",
      };
      expect(settings.themeSource).toBe("auto");

      settings.themeSource = "bundled";
      expect(settings.themeSource).toBe("bundled");

      settings.themeSource = "custom";
      expect(settings.themeSource).toBe("custom");
    });

    it("should allow valid line numbers display values", () => {
      const settings: Partial<CodeForgeSettings> = {
        lineNumbers: "always",
      };
      expect(settings.lineNumbers).toBe("always");

      settings.lineNumbers = "hover";
      expect(settings.lineNumbers).toBe("hover");

      settings.lineNumbers = "never";
      expect(settings.lineNumbers).toBe("never");
    });
  });
});
