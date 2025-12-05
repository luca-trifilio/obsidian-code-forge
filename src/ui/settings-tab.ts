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

    // Header
    containerEl.createEl("h1", { text: "Code Forge" });
    containerEl.createEl("p", {
      text: "Modern syntax highlighting, smart paste, and advanced UI for code blocks.",
      cls: "setting-item-description",
    });

    // General section
    containerEl.createEl("h2", { text: "General" });

    new Setting(containerEl)
      .setName("Enable plugin")
      .setDesc("Toggle all Code Forge features on/off")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enabled).onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Debug mode")
      .setDesc("Show debug information in the console")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.debugMode).onChange(async (value) => {
          this.plugin.settings.debugMode = value;
          await this.plugin.saveSettings();
        })
      );

    // Syntax Highlighting section
    containerEl.createEl("h2", { text: "Syntax Highlighting" });

    new Setting(containerEl)
      .setName("Enable syntax highlighting")
      .setDesc("Use Shiki for modern syntax highlighting")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.highlightingEnabled).onChange(async (value) => {
          this.plugin.settings.highlightingEnabled = value;
          await this.plugin.saveSettings();
        })
      );

    // Theme section
    containerEl.createEl("h2", { text: "Theme" });

    new Setting(containerEl)
      .setName("Theme source")
      .setDesc("Where to get the color theme from")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", "Auto (sync with Obsidian)")
          .addOption("bundled", "Bundled theme")
          .addOption("custom", "Custom overrides")
          .setValue(this.plugin.settings.themeSource)
          .onChange(async (value) => {
            this.plugin.settings.themeSource = value as "auto" | "bundled" | "custom";
            await this.plugin.saveSettings();
            this.display(); // Refresh to show/hide related settings
          })
      );

    if (this.plugin.settings.themeSource === "bundled") {
      new Setting(containerEl)
        .setName("Dark mode theme")
        .setDesc("Theme to use in dark mode")
        .addDropdown((dropdown) =>
          dropdown
            .addOption("github-dark", "GitHub Dark")
            .addOption("dracula", "Dracula")
            .addOption("nord", "Nord")
            .addOption("one-dark-pro", "One Dark Pro")
            .addOption("vitesse-dark", "Vitesse Dark")
            .setValue(this.plugin.settings.themeDark)
            .onChange(async (value) => {
              this.plugin.settings.themeDark = value as typeof this.plugin.settings.themeDark;
              await this.plugin.saveSettings();
            })
        );

      new Setting(containerEl)
        .setName("Light mode theme")
        .setDesc("Theme to use in light mode")
        .addDropdown((dropdown) =>
          dropdown
            .addOption("github-light", "GitHub Light")
            .addOption("solarized-light", "Solarized Light")
            .addOption("vitesse-light", "Vitesse Light")
            .setValue(this.plugin.settings.themeLight)
            .onChange(async (value) => {
              this.plugin.settings.themeLight = value as typeof this.plugin.settings.themeLight;
              await this.plugin.saveSettings();
            })
        );
    }

    // Paste Handling section
    containerEl.createEl("h2", { text: "Paste Handling" });

    new Setting(containerEl)
      .setName("Smart paste")
      .setDesc("Preserve indentation when pasting code")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.smartPasteEnabled).onChange(async (value) => {
          this.plugin.settings.smartPasteEnabled = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Auto-detect language")
      .setDesc("Automatically detect the language of pasted code")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoDetectLanguage).onChange(async (value) => {
          this.plugin.settings.autoDetectLanguage = value;
          await this.plugin.saveSettings();
        })
      );

    // UI section
    containerEl.createEl("h2", { text: "UI Components" });

    new Setting(containerEl)
      .setName("Show header")
      .setDesc("Display a header with language name above code blocks")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showHeader).onChange(async (value) => {
          this.plugin.settings.showHeader = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Show language icon")
      .setDesc("Display the language icon in the header")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showLanguageIcon).onChange(async (value) => {
          this.plugin.settings.showLanguageIcon = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Show copy button")
      .setDesc("Display a copy button on code blocks")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showCopyButton).onChange(async (value) => {
          this.plugin.settings.showCopyButton = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Line numbers")
      .setDesc("When to show line numbers")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("always", "Always")
          .addOption("hover", "On hover")
          .addOption("never", "Never")
          .setValue(this.plugin.settings.lineNumbers)
          .onChange(async (value) => {
            this.plugin.settings.lineNumbers = value as "always" | "hover" | "never";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable folding")
      .setDesc("Allow collapsing code blocks")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableFolding).onChange(async (value) => {
          this.plugin.settings.enableFolding = value;
          await this.plugin.saveSettings();
        })
      );

    // Performance section
    containerEl.createEl("h2", { text: "Performance" });

    new Setting(containerEl)
      .setName("Max lines for sync highlighting")
      .setDesc("Code blocks larger than this will be highlighted asynchronously")
      .addSlider((slider) =>
        slider
          .setLimits(100, 2000, 100)
          .setValue(this.plugin.settings.maxLinesSync)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.maxLinesSync = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable cache")
      .setDesc("Cache highlighted code blocks for better performance")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.cacheEnabled).onChange(async (value) => {
          this.plugin.settings.cacheEnabled = value;
          await this.plugin.saveSettings();
        })
      );
  }
}
