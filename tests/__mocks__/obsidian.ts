/**
 * Obsidian API Mock for testing
 */

import { vi } from "vitest";

export class Plugin {
  app: App;
  manifest: PluginManifest;

  constructor() {
    this.app = new App();
    this.manifest = {
      id: "code-forge",
      name: "Code Forge",
      version: "0.1.0",
      minAppVersion: "0.15.0",
      description: "Test plugin",
      author: "Test",
      authorUrl: "",
      isDesktopOnly: false,
    };
  }

  loadData = vi.fn().mockResolvedValue({});
  saveData = vi.fn().mockResolvedValue(undefined);

  addSettingTab = vi.fn();
  registerMarkdownPostProcessor = vi.fn();
  registerEditorExtension = vi.fn();
  registerEvent = vi.fn();
  addCommand = vi.fn();
}

export class App {
  vault: Vault;
  workspace: Workspace;

  constructor() {
    this.vault = new Vault();
    this.workspace = new Workspace();
  }
}

export class Vault {
  read = vi.fn().mockResolvedValue("");
  cachedRead = vi.fn().mockResolvedValue("");
  create = vi.fn().mockResolvedValue(undefined);
  modify = vi.fn().mockResolvedValue(undefined);
  delete = vi.fn().mockResolvedValue(undefined);
  rename = vi.fn().mockResolvedValue(undefined);
  getAbstractFileByPath = vi.fn().mockReturnValue(null);
  adapter = {
    read: vi.fn().mockResolvedValue(""),
    write: vi.fn().mockResolvedValue(undefined),
    exists: vi.fn().mockResolvedValue(false),
  };
}

export class Workspace {
  getActiveViewOfType = vi.fn().mockReturnValue(null);
  on = vi.fn();
  off = vi.fn();
  trigger = vi.fn();
}

export class PluginSettingTab {
  app: App;
  plugin: Plugin;
  containerEl: HTMLElement;

  constructor(app: App, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = document.createElement("div");
  }

  display(): void {
    // Override in implementation
  }

  hide(): void {
    // Override in implementation
  }
}

export class Setting {
  settingEl: HTMLElement;
  infoEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.settingEl = document.createElement("div");
    this.infoEl = document.createElement("div");
    this.nameEl = document.createElement("div");
    this.descEl = document.createElement("div");
    this.controlEl = document.createElement("div");
    containerEl.appendChild(this.settingEl);
  }

  setName(name: string): this {
    this.nameEl.textContent = name;
    return this;
  }

  setDesc(desc: string): this {
    this.descEl.textContent = desc;
    return this;
  }

  addToggle(cb: (toggle: Toggle) => void): this {
    const toggle = new Toggle();
    cb(toggle);
    return this;
  }

  addDropdown(cb: (dropdown: Dropdown) => void): this {
    const dropdown = new Dropdown();
    cb(dropdown);
    return this;
  }

  addSlider(cb: (slider: Slider) => void): this {
    const slider = new Slider();
    cb(slider);
    return this;
  }

  addText(cb: (text: TextComponent) => void): this {
    const text = new TextComponent();
    cb(text);
    return this;
  }

  addButton(cb: (button: ButtonComponent) => void): this {
    const button = new ButtonComponent();
    cb(button);
    return this;
  }
}

class Toggle {
  value = false;

  setValue(value: boolean): this {
    this.value = value;
    return this;
  }

  onChange(cb: (value: boolean) => void): this {
    return this;
  }
}

class Dropdown {
  value = "";

  addOption(value: string, display: string): this {
    return this;
  }

  setValue(value: string): this {
    this.value = value;
    return this;
  }

  onChange(cb: (value: string) => void): this {
    return this;
  }
}

class Slider {
  value = 0;

  setLimits(min: number, max: number, step: number): this {
    return this;
  }

  setValue(value: number): this {
    this.value = value;
    return this;
  }

  setDynamicTooltip(): this {
    return this;
  }

  onChange(cb: (value: number) => void): this {
    return this;
  }
}

class TextComponent {
  value = "";

  setValue(value: string): this {
    this.value = value;
    return this;
  }

  setPlaceholder(placeholder: string): this {
    return this;
  }

  onChange(cb: (value: string) => void): this {
    return this;
  }
}

class ButtonComponent {
  setButtonText(text: string): this {
    return this;
  }

  setCta(): this {
    return this;
  }

  onClick(cb: () => void): this {
    return this;
  }
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  minAppVersion: string;
  description: string;
  author: string;
  authorUrl: string;
  isDesktopOnly: boolean;
}

export class Notice {
  constructor(message: string, timeout?: number) {
    // Mock notice
  }
}

export class MarkdownView {
  editor: Editor;
  file: TFile | null = null;

  constructor() {
    this.editor = new Editor();
  }
}

export class Editor {
  getValue = vi.fn().mockReturnValue("");
  setValue = vi.fn();
  getLine = vi.fn().mockReturnValue("");
  setLine = vi.fn();
  getCursor = vi.fn().mockReturnValue({ line: 0, ch: 0 });
  setCursor = vi.fn();
  replaceRange = vi.fn();
  replaceSelection = vi.fn();
  getSelection = vi.fn().mockReturnValue("");
}

export class TFile {
  path: string;
  name: string;
  basename: string;
  extension: string;

  constructor(path: string = "test.md") {
    this.path = path;
    this.name = path.split("/").pop() || path;
    this.basename = this.name.replace(/\.[^.]+$/, "");
    this.extension = this.name.split(".").pop() || "";
  }
}

export class TFolder {
  path: string;
  name: string;

  constructor(path: string = "folder") {
    this.path = path;
    this.name = path.split("/").pop() || path;
  }
}

export type EventRef = { unload: () => void };

// Mock functions
export const addIcon = vi.fn();
export const setIcon = vi.fn();
export const getIcon = vi.fn().mockReturnValue(null);
