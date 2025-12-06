<div align="center">

<img src="https://obsidian.md/images/obsidian-logo-gradient.svg" width="100" height="100" alt="Obsidian">

# Code Forge

Modern syntax highlighting for Obsidian using [Shiki](https://shiki.style/).

</div>

## Features

**Shiki-Powered Highlighting**
- 150+ languages supported (20 bundled, others lazy-loaded)
- Consistent colors in Read and Edit modes
- CSS variables adapt to your Obsidian theme

**Smart Paste**
- Preserves original indentation when pasting code
- Normalizes tabs to spaces (2-space indent)
- Works automatically in code blocks

## Installation

### Community Plugins (Recommended)
1. Open Settings → Community plugins
2. Search for "Code Forge"
3. Install and enable

### BRAT (Beta Testing)
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. Add beta plugin: `luca-trifilio/obsidian-code-forge`

### Manual
1. Download latest release from [Releases](https://github.com/luca-trifilio/obsidian-code-forge/releases)
2. Extract to `{vault}/.obsidian/plugins/code-forge/`
3. Enable in Settings → Community plugins

## How It Works

Code Forge replaces Obsidian's default code highlighting with Shiki, providing accurate syntax highlighting that matches your IDE.

The plugin uses CSS variables so colors automatically adapt to your theme:

```css
--shiki-code-keyword     /* if, const, function */
--shiki-code-string      /* "hello" */
--shiki-code-comment     /* // comment */
--shiki-code-function    /* myFunction() */
--shiki-code-property    /* obj.property */
--shiki-code-value       /* 42, true */
--shiki-code-punctuation /* {}, (), ; */
```

Theme developers can define these variables. Fallback colors are provided for themes that don't.

## Bundled Languages

Always available without network requests:

```
javascript, typescript, python, java, c, cpp, csharp,
go, rust, ruby, php, swift, kotlin, html, css, json,
yaml, markdown, bash, sql
```

All other Shiki-supported languages are loaded on-demand.

## Compatibility

- Obsidian Desktop (macOS, Windows, Linux)
- Obsidian Mobile (iOS, Android)

## Credits

Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)

---

<div align="center">

**Made with ❤️ for the Obsidian community**

[Report Bug](https://github.com/luca-trifilio/obsidian-code-forge/issues/new?labels=bug) • [Request Feature](https://github.com/luca-trifilio/obsidian-code-forge/issues/new?labels=enhancement)

</div>
