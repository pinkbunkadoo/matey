const Label = require('../label');
const Checkbox = require('../checkbox');
const Tray = require('../tray');
const Container = require('../container');
const Icon = require('../icon');
const Button = require('../button');

class SettingsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.label = new Label({ id: 'temp', text: 'This is the label text.' });
    this.container.add(this.label);

    this.button = new Button({ id: 'button', text: 'Button' });
    this.container.add(this.button);

    this.container.el.style.width = '200px'
    this.container.el.style.height = '200px'

    this.checkbox = new Checkbox();
    this.container.add(this.checkbox);
  }

  onMouseDown(event) {
    // console.log('window-tray down', event.target);
    // if (!this.getBounds().containsPoint(event.clientX, event.clientY)) {
      // this.hide();
    // }
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
  }
}

module.exports = SettingsTray;
