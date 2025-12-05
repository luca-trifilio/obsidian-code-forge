import { App, PluginSettingTab } from "obsidian";
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

    // Info
    containerEl.createEl("p", {
      text: "Code Forge provides enhanced syntax highlighting using Shiki. It works automatically with your theme's code block styling.",
      cls: "setting-item-description",
    });

    // CSS Variables info
    containerEl.createEl("h2", { text: "Theme Customization" });
    containerEl.createEl("p", {
      text: "Theme authors can customize syntax colors by defining these CSS variables:",
      cls: "setting-item-description",
    });

    const codeEl = containerEl.createEl("pre");
    codeEl.createEl("code", {
      text: `--shiki-code-background
--shiki-code-normal
--shiki-code-keyword
--shiki-code-function
--shiki-code-string
--shiki-code-comment
--shiki-code-value`,
    });
  }
}
