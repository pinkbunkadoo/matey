const Base = require('../base');
const Container = require('../container');
const Panel = require('../panel');
const Button = require('../button');

class Settings extends Panel {
  constructor(params={}) {
    params.el = document.getElementById('settings');
    super(params);

    this.buttons = [];
    this.buttons['export'] = new Button({ el: document.getElementById('settings-export'), name: 'export' });
    // this.buttons['gif'] = new Button({ el: document.getElementById('settings-gif'), name: 'gif' });
    this.buttons['settings'] = new Button({ el: document.getElementById('settings-settings'), name: 'settings' });

    for (name in this.buttons) {
      this.add(this.buttons[name]);
    }

    for (let name in this.buttons) {
      if (this.buttons[name].text) {
        this.buttons[name].el.style.width = 'auto';
      }
      // this.buttons[name].el.style.height = (20 * app.unit) + 'px';
    }
  }

  updateComponent(params) {
    if (params.id === 'settings') {
      this.buttons['settings'].setState(params.value);
    }
  }
}

module.exports = Settings;
