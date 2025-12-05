import { describe, it, expect } from "vitest";
import { getLanguageIcon, getLanguageDisplayName } from "../src/ui/icons/language-icons";

describe("Language Icons", () => {
  describe("getLanguageIcon", () => {
    it("should return SVG for known languages", () => {
      const icon = getLanguageIcon("javascript");
      expect(icon).toContain("<svg");
      expect(icon).toContain("</svg>");
    });

    it("should be case insensitive", () => {
      const lower = getLanguageIcon("javascript");
      const upper = getLanguageIcon("JAVASCRIPT");
      expect(lower).toBe(upper);
    });

    it("should return default icon for unknown languages", () => {
      const icon = getLanguageIcon("unknownlang");
      expect(icon).toContain("<svg");
    });

    it("should return icons for common languages", () => {
      const languages = [
        "javascript",
        "typescript",
        "python",
        "java",
        "go",
        "rust",
        "ruby",
        "php",
        "html",
        "css",
        "json",
        "yaml",
        "markdown",
        "bash",
        "sql",
      ];

      for (const lang of languages) {
        const icon = getLanguageIcon(lang);
        expect(icon, `Icon for ${lang}`).toContain("<svg");
      }
    });

    it("should handle language aliases", () => {
      expect(getLanguageIcon("js")).toContain("<svg");
      expect(getLanguageIcon("ts")).toContain("<svg");
      expect(getLanguageIcon("py")).toContain("<svg");
      expect(getLanguageIcon("rb")).toContain("<svg");
      expect(getLanguageIcon("rs")).toContain("<svg");
      expect(getLanguageIcon("sh")).toContain("<svg");
      expect(getLanguageIcon("yml")).toContain("<svg");
      expect(getLanguageIcon("md")).toContain("<svg");
    });
  });

  describe("getLanguageDisplayName", () => {
    it("should return proper display names", () => {
      expect(getLanguageDisplayName("javascript")).toBe("JavaScript");
      expect(getLanguageDisplayName("typescript")).toBe("TypeScript");
      expect(getLanguageDisplayName("python")).toBe("Python");
      expect(getLanguageDisplayName("java")).toBe("Java");
    });

    it("should be case insensitive", () => {
      expect(getLanguageDisplayName("JAVASCRIPT")).toBe("JavaScript");
      expect(getLanguageDisplayName("Python")).toBe("Python");
    });

    it("should handle aliases", () => {
      expect(getLanguageDisplayName("js")).toBe("JavaScript");
      expect(getLanguageDisplayName("ts")).toBe("TypeScript");
      expect(getLanguageDisplayName("py")).toBe("Python");
      expect(getLanguageDisplayName("rb")).toBe("Ruby");
      expect(getLanguageDisplayName("rs")).toBe("Rust");
    });

    it("should uppercase unknown languages", () => {
      expect(getLanguageDisplayName("unknownlang")).toBe("UNKNOWNLANG");
      expect(getLanguageDisplayName("foo")).toBe("FOO");
    });

    it("should handle common languages", () => {
      expect(getLanguageDisplayName("go")).toBe("Go");
      expect(getLanguageDisplayName("rust")).toBe("Rust");
      expect(getLanguageDisplayName("cpp")).toBe("C++");
      expect(getLanguageDisplayName("csharp")).toBe("C#");
      expect(getLanguageDisplayName("html")).toBe("HTML");
      expect(getLanguageDisplayName("css")).toBe("CSS");
      expect(getLanguageDisplayName("json")).toBe("JSON");
      expect(getLanguageDisplayName("yaml")).toBe("YAML");
      expect(getLanguageDisplayName("sql")).toBe("SQL");
      expect(getLanguageDisplayName("bash")).toBe("Bash");
    });
  });
});
