import { Plugin } from "obsidian";
import { CodeForgeSettings, DEFAULT_SETTINGS } from "@/types/settings";
import { CodeForgeSettingTab } from "@/ui/settings-tab";
import { ShikiEngine, createShikiPostProcessor } from "@/engine";

export default class CodeForgePlugin extends Plugin {
  settings: CodeForgeSettings = DEFAULT_SETTINGS;
  shikiEngine: ShikiEngine | null = null;

  override async onload(): Promise<void> {
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new CodeForgeSettingTab(this.app, this));

    // Phase 1 - Initialize Shiki engine
    this.shikiEngine = new ShikiEngine({
      theme: this.settings.bundledTheme,
    });

    // Register markdown post processor for syntax highlighting in Reading view
    this.registerMarkdownPostProcessor(
      createShikiPostProcessor(this.shikiEngine)
    );

    // TODO: Phase 2 - Register editor extensions for multi-mode support
    // TODO: Phase 3 - Register paste handlers
    // TODO: Phase 4 - Register UI components (header, copy button, etc.)

    console.log("Code Forge plugin loaded");
  }

  override onunload(): void {
    // Dispose Shiki engine to free resources
    if (this.shikiEngine) {
      this.shikiEngine.dispose();
      this.shikiEngine = null;
    }
    console.log("Code Forge plugin unloaded");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
