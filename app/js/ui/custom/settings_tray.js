const Container = require('../container');
const Tray = require('../tray');
const TrayButton = require('../tray_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');

class SettingsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.buttons = [];
    this.buttons['export'] = new TrayButton({ el: document.getElementById('settings-tray-export'), name: 'export' });
    this.buttons['settings'] = new TrayButton({ el: document.getElementById('settings-tray-settings'), name: 'settings' });

    for (name in this.buttons) {
      this.add(this.buttons[name]);
    }

    this.buttons['export'].on('pressed', () => {
      this.emit('export', this.buttons['export']);
    });

    this.buttons['settings'].on('pressed', () => {
      this.emit('settings', this.buttons['settings']);
    });
  }

}

module.exports = SettingsTray;
