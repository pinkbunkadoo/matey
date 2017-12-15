const Base = require('./base');
const Container = require('./container');
const Button = require('./button');

class ControlPalette extends Container {
  constructor(el) {
    super(el);

    this.buttons = [];
    this.buttons['first'] = new Button(this.el.querySelector('#control-first'));
    this.buttons['play'] = new Button(this.el.querySelector('#control-play'));
    this.buttons['last'] = new Button(this.el.querySelector('#control-last'));

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = '16px';
      this.buttons[name].el.style.height = '16px';
    }

    this.el.style.height = '32px';

  }
}

module.exports = ControlPalette;
