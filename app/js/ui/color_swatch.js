const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');

class ColorSwatch extends Container {
  constructor(params = {}) {
    super(params);

    this.addClass('color-swatch');

    // this.el.style.width = '18px';
    // this.el.style.height = '18px';

    // this.color = params.color ? params.color.copy() : new Color()
    // this.nullColorIcon = new Icon({ resource: 'nullcolor', width: app.icons['nullcolor'].width, height: app.icons['nullcolor'].height });

    this.nullColorIcon = new Icon({ resource: 'nullcolor' });
    this.nullColorIcon.el.style.width = '1em';
    this.nullColorIcon.el.style.height = '1em';
    this.add(this.nullColorIcon);

    this.setColor(params.color);
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    if (color instanceof Color) {
      this.color = color.copy();
      this.el.style.background = this.color.toHexString();
      this.nullColorIcon.setVisible(false);
    } else {
      this.color = null;
      this.el.style.background = 'transparent';
      this.nullColorIcon.setVisible(true);
    }
  }

  onMouseDown(event) {
    if (event.button === 2) {
      this.setColor(null);
    }
  }

  onCopy(event) {
    var text = this.color.toHexString();
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  }

  onPaste(event) {
    var text = event.clipboardData.getData('text/plain');
    if (text[0] !== '#') text = '#' + text;
    this.setColor(Color.fromHexString(text));
    this.emit('color-change', this.color);
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'copy') {
      this.onCopy(event);
    }
    else if (event.type === 'paste') {
      this.onPaste(event);
    }

  }
}

module.exports = ColorSwatch;
