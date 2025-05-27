import { App, Editor, ItemView, MarkdownView, Menu, Plugin, PluginSettingTab, Setting } from 'obsidian';
import path from 'path';
import { Canvas, CanvasView } from 'src/@types/Canvas';
import TagStudioCanvasActions from 'src/canvas-tag-actions/canvas-actions';
import TagStudioSearch from 'src/tag-search/tag-search';

const tsPath = '.TagStudio/ts_library.sqlite'

// Remember to rename these classes and interfaces!

interface TagStudioPluginSettings {
    tagStudioExecutableLocation: string;
    tagStudioLibraryLocation: string;
}

const DEFAULT_SETTINGS: TagStudioPluginSettings = {
    tagStudioExecutableLocation: '',
    tagStudioLibraryLocation: ''
}

export default class TagStudioPlugin extends Plugin {
    settings: TagStudioPluginSettings;
    __toTagStudioExecutable: string;
    __canvasTagActions: any;
    __canvasActions: TagStudioCanvasActions;
    __searchActions: TagStudioSearch;

    searchStatus: HTMLSpanElement;
    cursorPosition: HTMLSpanElement;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new TagStudioPluginSettingsTab(this.app, this));
        this.__toTagStudioExecutable = path.relative('', this.settings.tagStudioExecutableLocation);
        // overwrites setting, yikes
        // also I should look into per vault settings
        if (!this.settings.tagStudioLibraryLocation) {
            this.settings.tagStudioLibraryLocation = (this.app.vault.adapter as any).basePath
        }

        this.searchStatus = this.addStatusBarItem().createEl("span");
        this.cursorPosition = this.addStatusBarItem().createEl("span");
        try {
            this.__canvasActions = new TagStudioCanvasActions(this);
            this.__searchActions = new TagStudioSearch(this);
        } catch (e) {
            console.error('Error initializing Tag Studio Plugin', e);
        }

        this.registerEvent(
            this.app.workspace.on('canvas:selection-menu', (menu, canvas) => {
                menu.addItem((item)=> {
                    item
                    .setTitle('Get Cursor Position')
                    .onClick(async () => {
                        console.log(canvas.pointer)
                    })
                })
            })
        )

        this.registerInterval(window.setInterval(() => {
                // @ts-ignore
                let canvas = this.app.workspace.getLeavesOfType('canvas')[0].view.canvas
                if (canvas) {
                    let x = Math.round(canvas.pointer.x);
                    let y = Math.round(canvas.pointer.y);
                    this.cursorPosition.setText(`cursor x:${x} y:${y}`)
                } else {
                    this.cursorPosition.setText("")
                }
            },
            10));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // Credit to Developer-Mike from https://github.com/Developer-Mike/obsidian-advanced-canvas/
    // Source: https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/main/src/main.ts
    getCurrentCanvasView(): CanvasView | null {
    const canvasView = this.app.workspace.getActiveViewOfType(ItemView)
        if (canvasView?.getViewType() !== 'canvas') return null
        return canvasView as CanvasView
    }

    // Credit to Developer-Mike from https://github.com/Developer-Mike/obsidian-advanced-canvas/
    // Source: https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/main/src/main.ts
    getCurrentCanvas(): Canvas | null {
        return this.getCurrentCanvasView()?.canvas || null
    }
}

class TagStudioPluginSettingsTab extends PluginSettingTab {
    plugin: TagStudioPlugin;

    constructor(app: App, plugin: TagStudioPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('.TagStudio Executable Location')
            .setDesc('Location of the .TagStudio executable (Required)')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.tagStudioExecutableLocation)
                .onChange(async (value) => {
                    this.plugin.settings.tagStudioExecutableLocation = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('.TagStudio Library Location')
            .setDesc('Location of the .TagStudio folder, defaults to root if unspecified')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.tagStudioLibraryLocation)
                .onChange(async (value) => {
                    this.plugin.settings.tagStudioLibraryLocation = value;
                    await this.plugin.saveSettings();
                }));
        
    }
}
