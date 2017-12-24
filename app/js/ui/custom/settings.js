const Base = require('../base');
const Container = require('../container');
const Tray = require('../tray');
const Button = require('../button');

class Settings extends Tray {
  constructor() {
    super();

    this.el = document.getElementById('settings');

    this.buttons = [];
    this.buttons['export'] = new Button({ id: 'settings-export', fromDOMElement: true });
    this.buttons['gif'] = new Button({ id: 'settings-gif', fromDOMElement: true });
    this.buttons['settings'] = new Button({ id: 'settings-settings', fromDOMElement: true });

    this.buttons['export'].on('pressed', () => {
      app.export();
    });
    this.buttons['settings'].on('pressed', () => {  });

    for (let name in this.buttons) {
      if (this.buttons[name].svg) {
        // console.log(this.buttons[name].svg.constructor);
        this.buttons[name].el.style.width = (16 * app.unit) + 'px';
      }
      this.buttons[name].el.style.height = (16 * app.unit) + 'px';
    }
  }
}

module.exports = Settings;
