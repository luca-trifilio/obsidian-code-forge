import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  ShikiEngine,
  BUNDLED_LANGUAGES,
  LANGUAGE_ALIASES,
} from "../src/engine/shiki-engine";
import { extractLanguage } from "../src/engine/post-processor";

describe("ShikiEngine", () => {
  let engine: ShikiEngine;

  beforeEach(() => {
    engine = new ShikiEngine();
  });

  afterEach(() => {
    engine.dispose();
  });

  describe("constructor", () => {
    it("should create instance with default options", () => {
      expect(engine).toBeInstanceOf(ShikiEngine);
    });

    it("should accept custom theme", () => {
      const customEngine = new ShikiEngine({ theme: "nord" });
      expect(customEngine).toBeInstanceOf(ShikiEngine);
      customEngine.dispose();
    });
  });

  describe("resolveLanguage", () => {
    it("should resolve common aliases", () => {
      expect(engine.resolveLanguage("js")).toBe("javascript");
      expect(engine.resolveLanguage("ts")).toBe("typescript");
      expect(engine.resolveLanguage("py")).toBe("python");
      expect(engine.resolveLanguage("rb")).toBe("ruby");
      expect(engine.resolveLanguage("rs")).toBe("rust");
    });

    it("should handle case insensitivity", () => {
      expect(engine.resolveLanguage("JS")).toBe("javascript");
      expect(engine.resolveLanguage("TypeScript")).toBe("typescript");
      expect(engine.resolveLanguage("PYTHON")).toBe("python");
    });

    it("should trim whitespace", () => {
      expect(engine.resolveLanguage("  javascript  ")).toBe("javascript");
      expect(engine.resolveLanguage("\tpython\n")).toBe("python");
    });

    it("should return original if no alias found", () => {
      expect(engine.resolveLanguage("java")).toBe("java");
      expect(engine.resolveLanguage("go")).toBe("go");
    });
  });

  describe("highlight", () => {
    it("should highlight JavaScript code", async () => {
      const code = 'const x = "hello";';
      const result = await engine.highlight(code, "javascript");

      expect(result).toContain("<pre");
      expect(result).toContain("</pre>");
      expect(result).toContain("const");
    });

    it("should highlight using language alias", async () => {
      const code = 'const x = "hello";';
      const result = await engine.highlight(code, "js");

      expect(result).toContain("<pre");
      expect(result).toContain("const");
    });

    it("should handle Python code", async () => {
      const code = 'def hello():\n    print("Hello")';
      const result = await engine.highlight(code, "python");

      expect(result).toContain("<pre");
      expect(result).toContain("def");
    });

    it("should fallback to text for unknown languages", async () => {
      const code = "some random text";
      const result = await engine.highlight(code, "unknownlang123");

      expect(result).toContain("<pre");
      expect(result).toContain("some random text");
    });
  });

  describe("loadLanguage", () => {
    it("should load bundled languages immediately", async () => {
      const result = await engine.loadLanguage("javascript");
      expect(result).toBe(true);
      expect(engine.isLanguageLoaded("javascript")).toBe(true);
    });

    it("should handle language aliases when loading", async () => {
      const result = await engine.loadLanguage("js");
      expect(result).toBe(true);
      expect(engine.isLanguageLoaded("js")).toBe(true);
    });
  });

  describe("getLoadedLanguages", () => {
    it("should return bundled languages after init", async () => {
      // Trigger initialization
      await engine.highlight("test", "javascript");

      const loaded = engine.getLoadedLanguages();
      expect(loaded).toContain("javascript");
      expect(loaded).toContain("typescript");
      expect(loaded).toContain("python");
    });
  });

  describe("dispose", () => {
    it("should clear loaded languages", async () => {
      await engine.highlight("test", "javascript");
      expect(engine.getLoadedLanguages().length).toBeGreaterThan(0);

      engine.dispose();
      expect(engine.getLoadedLanguages().length).toBe(0);
    });
  });
});

describe("BUNDLED_LANGUAGES", () => {
  it("should contain top programming languages", () => {
    expect(BUNDLED_LANGUAGES).toContain("javascript");
    expect(BUNDLED_LANGUAGES).toContain("typescript");
    expect(BUNDLED_LANGUAGES).toContain("python");
    expect(BUNDLED_LANGUAGES).toContain("java");
    expect(BUNDLED_LANGUAGES).toContain("go");
    expect(BUNDLED_LANGUAGES).toContain("rust");
  });

  it("should have exactly 20 languages", () => {
    expect(BUNDLED_LANGUAGES.length).toBe(20);
  });
});

describe("LANGUAGE_ALIASES", () => {
  it("should map common aliases", () => {
    expect(LANGUAGE_ALIASES["js"]).toBe("javascript");
    expect(LANGUAGE_ALIASES["ts"]).toBe("typescript");
    expect(LANGUAGE_ALIASES["py"]).toBe("python");
    expect(LANGUAGE_ALIASES["sh"]).toBe("bash");
    expect(LANGUAGE_ALIASES["yml"]).toBe("yaml");
  });
});

describe("extractLanguage", () => {
  it("should extract language from class", () => {
    const el = document.createElement("code");
    el.className = "language-javascript";
    expect(extractLanguage(el)).toBe("javascript");
  });

  it("should handle multiple classes", () => {
    const el = document.createElement("code");
    el.className = "some-class language-python another-class";
    expect(extractLanguage(el)).toBe("python");
  });

  it("should return text for no language class", () => {
    const el = document.createElement("code");
    el.className = "some-other-class";
    expect(extractLanguage(el)).toBe("text");
  });

  it("should check parent pre element", () => {
    const pre = document.createElement("pre");
    pre.className = "language-rust";
    const code = document.createElement("code");
    pre.appendChild(code);

    expect(extractLanguage(code)).toBe("rust");
  });
});
