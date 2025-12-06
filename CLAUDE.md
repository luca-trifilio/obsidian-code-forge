# Code Forge - Obsidian Plugin

## Project Overview

Code Forge is an Obsidian plugin that provides modern syntax highlighting using Shiki, with consistent colors across Read and Edit modes.

## Quick Start

```bash
npm install    # Install dependencies
npm run dev    # Start development (watch mode)
npm run build  # Production build
npm run test   # Run tests
npm run lint   # Run ESLint
```

## Project Structure

```
obsidian-code-forge/
├── main.ts                      # Plugin entry point
├── src/
│   ├── types/                   # TypeScript interfaces
│   │   └── settings.ts          # Settings interface (minimal)
│   ├── engine/                  # Shiki highlighting engine
│   │   ├── shiki-engine.ts      # Core engine with lazy loading
│   │   ├── post-processor.ts    # MarkdownPostProcessor (Read mode)
│   │   └── index.ts             # Exports
│   ├── editor/                  # CodeMirror 6 integration
│   │   ├── ShikiViewPlugin.ts   # ViewPlugin for Edit mode
│   │   └── index.ts             # Exports
│   ├── themes/                  # Theme system
│   │   ├── ObsidianTheme.ts     # TextMate scope → CSS var mappings
│   │   ├── ThemeMapper.ts       # Placeholder hex → CSS var replacement
│   │   └── index.ts             # Exports
│   └── ui/                      # UI components
│       └── settings-tab.ts      # Settings UI
├── tests/                       # Test files
│   └── __mocks__/               # Obsidian API mocks
├── docs/                        # Documentation
│   └── PROJECT_PLAN.md          # Detailed project plan
└── .github/workflows/           # CI/CD pipelines
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Keep functions small and focused
- No unnecessary abstractions

### Testing
- Write tests for public APIs
- Mock Obsidian API using `tests/__mocks__/obsidian.ts`
- Run `npm test` before committing

### Git Workflow
1. Create feature branch from `main`
2. Make changes and write tests
3. Open PR with label: `release:patch`, `release:minor`, or `release:major`
4. CI creates beta release for BRAT testing
5. Merge PR to trigger release

## Key Decisions

- **Theme**: CSS variables that adapt to active Obsidian theme (no bundled themes)
- **Bundle Strategy**: Top 20 languages bundled, others lazy-loaded
- **Settings**: Minimal - no user-facing settings currently
- **UI**: No custom UI - focus on highlighting only

## Architecture

### Shiki Integration
- ShikiEngine class with lazy grammar loading
- MarkdownPostProcessor for Reading view
- ShikiViewPlugin (CodeMirror 6) for Edit mode
- Cache for performance (internal, not configurable)

### Theme System (CSS Variables)
- ObsidianTheme defines TextMate scope → CSS variable mappings
- ThemeMapper replaces CSS vars with placeholder hex for Shiki, then restores
- Fallback colors in styles.css for themes that don't define `--shiki-code-*`

### CSS Variables Used
```css
--shiki-code-background
--shiki-code-normal
--shiki-code-keyword
--shiki-code-function
--shiki-code-property
--shiki-code-string
--shiki-code-comment
--shiki-code-value
--shiki-code-important
--shiki-code-punctuation
```

## Progress

### Phase 1: Shiki Engine ✅ DONE
- [x] ShikiEngine with lazy loading
- [x] MarkdownPostProcessor for Reading view
- [x] CSS variables theme (ObsidianTheme + ThemeMapper)
- [x] Fallback colors in styles.css

### Phase 2: Edit Mode ✅ DONE
- [x] ShikiViewPlugin for CodeMirror 6
- [x] Syntax tree parsing for code blocks
- [x] Token-to-decoration mapping
- [x] Color consistency with Read mode

### Phase 3: Paste Handling
- [ ] Intercept paste in code blocks
- [ ] Preserve indentation

### Phase 4: Polish & Release
- [ ] Cross-platform testing
- [ ] Documentation
- [ ] Community plugin submission

## Credits

- Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)
- CSS variables theme mapping based on their ObsidianTheme implementation
