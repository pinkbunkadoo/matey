const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');

class ColorSwatch extends Base {
  constructor(params={}) {
    super(params);

    this.addClass('color-swatch');

    // this.nullColorIcon = new Icon({ resource: 'checker' });
    this.initialColor = params.color ? params.color : null;
    this.setColor(this.initialColor);

    this.el.addEventListener('click', this);
    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('dblclick', this);
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    if (this.color !== color) {
      if (color instanceof Color) {
        this.removeClass('null');
        this.color = color.copy();
        this.el.style.backgroundColor = this.color.toHexString();
        this.el.innerHTML = '';
      } else {
        this.addClass('null');
        this.color = null;
        this.el.style.backgroundColor = 'transparent';
        this.el.innerHTML = '<svg class="icon"><g><use xlink:href="./images/icons.svg#nullColor"></g></svg>'
      }
    }
  }

  onMouseDown(event) {
    this.emit('down', this);
  }

  onMouseUp(event) {
  }

  onClick() {
    this.emit('click', this);
  }

  onDblClick(event) {
    if (this.color) {
      this.setColor(null);
    } else {
      this.setColor(this.initialColor);
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
    if (event.type === 'click') {
      this.onClick(event);
    }
    else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
    else if (event.type === 'dblclick') {
      this.onDblClick(event);
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
