import { Plugin } from "obsidian";
import { CodeForgeSettings, DEFAULT_SETTINGS } from "@/types/settings";
import { CodeForgeSettingTab } from "@/ui/settings-tab";
import { ShikiEngine, createShikiPostProcessor } from "@/engine";
import { createShikiViewPlugin } from "@/editor";
import { createPasteHandler } from "@/paste";

export default class CodeForgePlugin extends Plugin {
  settings: CodeForgeSettings = DEFAULT_SETTINGS;
  shikiEngine: ShikiEngine | null = null;

  override async onload(): Promise<void> {
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new CodeForgeSettingTab(this.app, this));

    // Phase 1 - Initialize Shiki engine with CSS variable theme
    this.shikiEngine = new ShikiEngine();

    // Register markdown post processor for syntax highlighting in Reading view
    this.registerMarkdownPostProcessor(
      createShikiPostProcessor(this.shikiEngine)
    );

    // Register editor extension for Live Preview / Source mode highlighting
    this.registerEditorExtension(createShikiViewPlugin(this.shikiEngine));

    // Register paste handler for smart code paste
    this.registerEditorExtension(createPasteHandler());
  }

  override onunload(): void {
    // Dispose Shiki engine to free resources
    if (this.shikiEngine) {
      this.shikiEngine.dispose();
      this.shikiEngine = null;
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
