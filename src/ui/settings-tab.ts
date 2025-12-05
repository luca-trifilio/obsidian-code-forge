import { App, PluginSettingTab, Setting } from "obsidian";
import type CodeForgePlugin from "../../main";

export class CodeForgeSettingTab extends PluginSettingTab {
  plugin: CodeForgePlugin;

  constructor(app: App, plugin: CodeForgePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("code-forge-settings");

    // Header
    containerEl.createEl("h1", { text: "Code Forge" });
    containerEl.createEl("p", {
      text: "Modern syntax highlighting with Shiki.",
      cls: "setting-item-description",
    });

    // UI Section
    containerEl.createEl("h2", { text: "Interface" });

    new Setting(containerEl)
      .setName("Show copy button")
      .setDesc("Display a copy button in the code block header")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showCopyButton).onChange(async (value) => {
          this.plugin.settings.showCopyButton = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
