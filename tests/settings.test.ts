import { describe, it, expect } from "vitest";
import { DEFAULT_SETTINGS, CodeForgeSettings } from "../src/types/settings";

describe("Settings", () => {
  describe("DEFAULT_SETTINGS", () => {
    it("should have all required properties", () => {
      expect(DEFAULT_SETTINGS).toBeDefined();
      expect(DEFAULT_SETTINGS.cacheEnabled).toBe(true);
      expect(DEFAULT_SETTINGS.cacheMaxSize).toBe(100);
    });
  });

  describe("Type safety", () => {
    it("should allow valid setting values", () => {
      const settings: CodeForgeSettings = {
        cacheEnabled: false,
        cacheMaxSize: 50,
      };

      expect(settings.cacheEnabled).toBe(false);
      expect(settings.cacheMaxSize).toBe(50);
    });

    it("should merge with defaults correctly", () => {
      const userSettings: Partial<CodeForgeSettings> = {
        cacheMaxSize: 200,
      };

      const merged = { ...DEFAULT_SETTINGS, ...userSettings };

      expect(merged.cacheEnabled).toBe(true); // From defaults
      expect(merged.cacheMaxSize).toBe(200); // From user
    });
  });
});
