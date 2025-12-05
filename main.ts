import { Plugin } from "obsidian";
import { CodeForgeSettings, DEFAULT_SETTINGS } from "@/types/settings";
import { CodeForgeSettingTab } from "@/ui/settings-tab";

export default class CodeForgePlugin extends Plugin {
  settings: CodeForgeSettings = DEFAULT_SETTINGS;

  override async onload(): Promise<void> {
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new CodeForgeSettingTab(this.app, this));

    // TODO: Phase 1 - Initialize Shiki engine
    // TODO: Phase 2 - Register editor extensions for multi-mode support
    // TODO: Phase 3 - Register paste handlers
    // TODO: Phase 4 - Register markdown post processor for UI components

    console.log("Code Forge plugin loaded");
  }

  override onunload(): void {
    console.log("Code Forge plugin unloaded");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
