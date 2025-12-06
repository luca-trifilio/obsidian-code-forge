import { describe, it, expect } from "vitest";
import {
  INDENT_SIZE,
  INDENT_UNIT,
  getLeadingWhitespace,
  tabsToSpaces,
  getIndentLevel,
  createIndent,
  normalizeIndentation,
} from "../src/paste/indentation";

describe("indentation utilities", () => {
  describe("constants", () => {
    it("should have INDENT_SIZE of 2", () => {
      expect(INDENT_SIZE).toBe(2);
    });

    it("should have INDENT_UNIT of 2 spaces", () => {
      expect(INDENT_UNIT).toBe("  ");
    });
  });

  describe("getLeadingWhitespace", () => {
    it("should return empty string for no whitespace", () => {
      expect(getLeadingWhitespace("hello")).toBe("");
    });

    it("should return leading spaces", () => {
      expect(getLeadingWhitespace("  hello")).toBe("  ");
    });

    it("should return leading tabs", () => {
      expect(getLeadingWhitespace("\thello")).toBe("\t");
    });

    it("should return mixed whitespace", () => {
      expect(getLeadingWhitespace("  \t hello")).toBe("  \t ");
    });

    it("should return all whitespace for whitespace-only string", () => {
      expect(getLeadingWhitespace("   ")).toBe("   ");
    });

    it("should return empty string for empty input", () => {
      expect(getLeadingWhitespace("")).toBe("");
    });
  });

  describe("tabsToSpaces", () => {
    it("should convert single tab to 2 spaces", () => {
      expect(tabsToSpaces("\t")).toBe("  ");
    });

    it("should convert multiple tabs", () => {
      expect(tabsToSpaces("\t\t")).toBe("    ");
    });

    it("should convert tabs in middle of string", () => {
      expect(tabsToSpaces("a\tb")).toBe("a  b");
    });

    it("should not modify string without tabs", () => {
      expect(tabsToSpaces("hello world")).toBe("hello world");
    });

    it("should handle mixed tabs and spaces", () => {
      expect(tabsToSpaces("  \thello")).toBe("    hello");
    });

    it("should handle empty string", () => {
      expect(tabsToSpaces("")).toBe("");
    });
  });

  describe("getIndentLevel", () => {
    it("should return 0 for no indentation", () => {
      expect(getIndentLevel("")).toBe(0);
    });

    it("should return 1 for 2 spaces", () => {
      expect(getIndentLevel("  ")).toBe(1);
    });

    it("should return 2 for 4 spaces", () => {
      expect(getIndentLevel("    ")).toBe(2);
    });

    it("should floor partial indents", () => {
      expect(getIndentLevel("   ")).toBe(1); // 3 spaces = 1 level
    });

    it("should convert tabs and calculate level", () => {
      expect(getIndentLevel("\t")).toBe(1); // 1 tab = 2 spaces = 1 level
    });

    it("should handle mixed tabs and spaces", () => {
      expect(getIndentLevel("\t  ")).toBe(2); // tab + 2 spaces = 4 spaces = 2 levels
    });
  });

  describe("createIndent", () => {
    it("should return empty string for level 0", () => {
      expect(createIndent(0)).toBe("");
    });

    it("should return 2 spaces for level 1", () => {
      expect(createIndent(1)).toBe("  ");
    });

    it("should return 4 spaces for level 2", () => {
      expect(createIndent(2)).toBe("    ");
    });

    it("should return 6 spaces for level 3", () => {
      expect(createIndent(3)).toBe("      ");
    });
  });

  describe("normalizeIndentation", () => {
    describe("single line", () => {
      it("should return single line as-is (with tabs converted)", () => {
        expect(normalizeIndentation("hello", "")).toBe("hello");
      });

      it("should convert tabs in single line", () => {
        expect(normalizeIndentation("\thello", "")).toBe("  hello");
      });
    });

    describe("multi-line without base indent", () => {
      it("should preserve relative indentation", () => {
        const input = "function foo() {\n  return 1;\n}";
        const expected = "function foo() {\n  return 1;\n}";
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should remove common leading indent", () => {
        const input = "  line1\n  line2\n  line3";
        const expected = "line1\nline2\nline3";
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should preserve relative indentation when removing common", () => {
        const input = "  function foo() {\n    return 1;\n  }";
        const expected = "function foo() {\n  return 1;\n}";
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should convert tabs to spaces", () => {
        const input = "\tline1\n\t\tline2\n\tline3";
        const expected = "line1\n  line2\nline3";
        expect(normalizeIndentation(input, "")).toBe(expected);
      });
    });

    describe("multi-line with base indent", () => {
      it("should add base indent to subsequent lines", () => {
        const input = "line1\nline2\nline3";
        const expected = "line1\n  line2\n  line3";
        expect(normalizeIndentation(input, "  ")).toBe(expected);
      });

      it("should not add base indent to first line", () => {
        const input = "function foo() {\n  return 1;\n}";
        const expected = "function foo() {\n    return 1;\n  }";
        expect(normalizeIndentation(input, "  ")).toBe(expected);
      });

      it("should handle deeper base indent", () => {
        const input = "if (x) {\n  y();\n}";
        const expected = "if (x) {\n      y();\n    }";
        expect(normalizeIndentation(input, "    ")).toBe(expected);
      });
    });

    describe("empty lines", () => {
      it("should preserve empty lines", () => {
        const input = "line1\n\nline3";
        const expected = "line1\n\nline3";
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should not add indent to empty lines", () => {
        const input = "line1\n\nline3";
        const expected = "line1\n\n  line3";
        expect(normalizeIndentation(input, "  ")).toBe(expected);
      });

      it("should handle multiple empty lines", () => {
        const input = "line1\n\n\nline4";
        const expected = "line1\n\n\n  line4";
        expect(normalizeIndentation(input, "  ")).toBe(expected);
      });
    });

    describe("edge cases", () => {
      it("should handle all empty lines", () => {
        const input = "\n\n";
        const expected = "\n\n";
        expect(normalizeIndentation(input, "  ")).toBe(expected);
      });

      it("should handle whitespace-only lines", () => {
        const input = "line1\n   \nline3";
        // whitespace-only line is trimmed to empty
        expect(normalizeIndentation(input, "")).toContain("line1");
        expect(normalizeIndentation(input, "")).toContain("line3");
      });

      it("should handle Windows line endings", () => {
        // Note: split('\n') handles this, \r stays with content
        const input = "line1\r\nline2";
        const result = normalizeIndentation(input, "");
        expect(result).toContain("line1");
      });
    });

    describe("real-world code examples", () => {
      it("should handle JavaScript function", () => {
        const input = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;
        const expected = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should handle Python with indentation", () => {
        const input = `def greet(name):
    print(f"Hello, {name}")
    return True`;
        // Common indent (0) removed, relative preserved
        const expected = `def greet(name):
    print(f"Hello, {name}")
    return True`;
        expect(normalizeIndentation(input, "")).toBe(expected);
      });

      it("should handle code pasted into indented context", () => {
        const input = `if (condition) {
  doSomething();
}`;
        // Base indent of 4 spaces (inside a function)
        const expected = `if (condition) {
      doSomething();
    }`;
        expect(normalizeIndentation(input, "    ")).toBe(expected);
      });

      it("should handle nested code blocks", () => {
        const input = `class Foo {
  constructor() {
    this.value = 1;
  }
}`;
        const expected = `class Foo {
  constructor() {
    this.value = 1;
  }
}`;
        expect(normalizeIndentation(input, "")).toBe(expected);
      });
    });
  });
});
