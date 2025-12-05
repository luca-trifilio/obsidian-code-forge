# Code Forge - Obsidian Plugin

## Project Overview

Code Forge is an Obsidian plugin that provides modern syntax highlighting using Shiki, smart paste handling, and advanced UI for code blocks.

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
│   │   └── settings.ts          # Settings interface and defaults
│   ├── engine/                  # Shiki highlighting engine
│   ├── theme/                   # Theme bridge and generators
│   ├── paste/                   # Paste interception and handling
│   ├── ui/                      # UI components
│   │   ├── components/          # Header, buttons, line numbers
│   │   ├── icons/               # Language icons
│   │   └── settings-tab.ts      # Settings UI
│   ├── utils/                   # Utilities
│   └── i18n/                    # Internationalization
├── tests/                       # Test files
│   └── __mocks__/               # Obsidian API mocks
└── .github/workflows/           # CI/CD pipelines
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Keep functions small and focused
- Document complex logic with comments

### Testing
- Write tests for all public APIs
- Mock Obsidian API using `tests/__mocks__/obsidian.ts`
- Run `npm test` before committing

### Git Workflow
1. Create feature branch from `main`
2. Make changes and write tests
3. Open PR with appropriate label:
   - `release:patch` - Bug fixes
   - `release:minor` - New features
   - `release:major` - Breaking changes
4. CI will create beta release for testing
5. Merge PR to trigger release

## Key Decisions

- **Bundle Strategy**: Hybrid - Top 20 languages bundled, others lazy-loaded
- **Mobile Support**: High priority - must work on iOS/Android
- **Paste Behavior**: Cmd+V preserves indentation by default
- **Plugin Conflicts**: Show warning only, allow coexistence

## Architecture Notes

### Shiki Integration
- Use `shiki` v3+ for syntax highlighting
- Lazy load grammars for non-bundled languages
- Cache highlighted output for performance

### Theme Bridge
- Read CSS variables from active Obsidian theme
- Generate Shiki theme dynamically
- Watch for theme changes with MutationObserver

### Paste Handling
- Intercept paste via EditorView.domEventHandlers
- Detect if cursor is inside code block
- Preserve original whitespace/indentation

## TODOs

### Phase 1: Shiki Engine ✅
- [x] Integrate Shiki as dependency
- [x] Create ShikiEngine class
- [x] Implement lazy grammar loading
- [x] Create MarkdownPostProcessor
- [x] CSS variables theme (adapts to Obsidian theme)

### Phase 2: Multi-mode Support
- [ ] EditorExtension for Live Preview
- [ ] Decorations for Source mode
- [ ] Sync cache between modes

### Phase 3: Paste Handling
- [ ] Intercept paste events
- [ ] Preserve indentation
- [ ] Auto-detect language

### Phase 4: UI Components
- [ ] Header with language name/icon
- [ ] Copy button with feedback
- [ ] Fold/collapse
- [ ] Line numbers
- [ ] Line highlighting

### Phase 5: Theme Integration
- [ ] CSS variables reader
- [ ] Dynamic theme generator
- [ ] Theme change detection

### Phase 6: Polish
- [ ] Complete settings UI
- [ ] i18n (EN + IT)
- [ ] Documentation
- [ ] Cross-platform testing

## Credits

- Syntax highlighting approach inspired by [obsidian-shiki-plugin](https://github.com/mProjectsCode/obsidian-shiki-plugin) by mProjectsCode (MIT License)
- CSS variables theme mapping based on their ObsidianTheme implementation
