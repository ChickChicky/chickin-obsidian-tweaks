import { App, PluginSettingTab, Setting } from 'obsidian';
import ChickinObsidianPlugin from './main';

export interface ChickinObsidianSettings {
	enableKbd: boolean;
	enableKbdIcons: boolean;
}

export const DEFAULT_SETTINGS: ChickinObsidianSettings = {
	enableKbd: true,
	enableKbdIcons: true,
};

export class ChickinObsidianSettingsTab extends PluginSettingTab {
	plugin: ChickinObsidianPlugin;

	constructor(app: App, plugin: ChickinObsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Enable <kbd>')
			.setDesc('Enable custom rendition of <kbd> tags')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.enableKbd)
					.onChange(async value => {
						iconsSetting.setDisabled(!value);
						this.plugin.settings.enableKbd = value;
						this.plugin.rerenderMd();
						await this.plugin.saveSettings();
					}),
			);

		const iconsSetting = new Setting(containerEl)
			.setName('Enable <kbd> icons')
			.setDesc('Enable icon rendition for specific <kbd> keys using nerd font icons')
			.setDisabled(!this.plugin.settings.enableKbd)
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.enableKbdIcons)
					.onChange(async value => {
						this.plugin.settings.enableKbdIcons = value;
						this.plugin.rerenderMd();
						await this.plugin.saveSettings();
					}),
			);
	}
}
