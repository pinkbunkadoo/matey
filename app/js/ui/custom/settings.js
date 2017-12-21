const Base = require('../base');
const Container = require('../container');
const Button = require('../button');

class Settings extends Container {
  constructor(el) {
    super(el);

    this.buttons = [];
    this.buttons['export'] = new Button(this.el.querySelector('#settings-export'));
    this.buttons['gif'] = new Button(this.el.querySelector('#settings-gif'));
    this.buttons['settings'] = new Button(this.el.querySelector('#settings-settings'));

    this.buttons['export'].on('pressed', () => {
      app.export();
    });
    this.buttons['settings'].on('pressed', () => {  });

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = '2em';
      this.buttons[name].el.style.height = '2em';
    }
  }
}

module.exports = Settings;
