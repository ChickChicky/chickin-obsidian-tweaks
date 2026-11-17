import { MarkdownView, Plugin } from 'obsidian';
import { ChickinObsidianSettings, ChickinObsidianSettingsTab, DEFAULT_SETTINGS } from './settings';

// <kbd> icons
const KBD: Record<string, number> = {
	'win':     0xe70f,
	'windows': 0xe70f,
	'shift': 0xf09c7,
	'maj':   0xf09c7,
	'cmd':      0xf0633,
	'command':  0xf0633,
	'commande': 0xf0633,
	'option': 0xf0635,
	'tab':        0xf443,
	'tabulation': 0xf443,
	'prtscrn':         0xf0a6c,
	'printscreen':     0xf0a6c,
	'imprecran':       0xf0a6c,
	'imprimeecran':    0xf0a6c,
	'impressionecran': 0xf0a6c,
	'home':  0xf0793,
	'debut': 0xf0793,
	'end': 0xf0794,
	'fin': 0xf0794,
	'return': 0xf0311,
	'enter':  0xf0311,
	'entree': 0xf0311,
	'backspace': 0xf0b5c
};

export default class ChickinObsidian extends Plugin {
	settings!: ChickinObsidianSettings

	async onload() {
		await this.loadSettings();

		this.registerMarkdownPostProcessor((element, context) => {
			// apply custom <kbd> style
			if (this.settings.enableKbd) {
				for (const kbd of element.findAll('kbd')) {
					kbd.classList.add('co-kbd');
					// add <kbd> icon
					if (this.settings.enableKbdIcons) {
						const text = kbd.textContent.toLowerCase().normalize('NFD').match(/\w+/g)?.join('')||'';
						const icon = KBD[text];
						if (icon) {
							const span = element.createSpan();
							span.classList.add('nf', 'co-kbd-icon');
							span.textContent = String.fromCodePoint(icon);
							kbd.prepend(span);
						}
					}
				}
			}
		});

		this.addSettingTab(new ChickinObsidianSettingsTab(this.app, this));
	}

	rerenderMd() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (leaf.view instanceof MarkdownView)
				leaf.view.previewMode.rerender(true);
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ChickinObsidianSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
