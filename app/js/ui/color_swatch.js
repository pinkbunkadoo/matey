const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');

class ColorSwatch extends Base {
  constructor(params={}) {
    super(params);

    this.addClass('color-swatch');

    // this.el.style.width = '18px';
    // this.el.style.height = '18px';

    // this.color = params.color ? params.color.copy() : new Color()
    // this.nullColorIcon = new Icon({ resource: 'nullcolor', width: app.icons['nullcolor'].width, height: app.icons['nullcolor'].height });

    this.nullColorIcon = new Icon({ resource: 'checker' });
    // this.nullColorIcon.el.style.width = (16 * app.unit) + 'px';
    // this.nullColorIcon.el.style.height = (16 * app.unit) + 'px';
    // this.add(this.nullColorIcon);

    this.setColor(null);

    // this.setColor(params.color);

    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('dblclick', this);
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    if (color instanceof Color) {
      this.removeClass('null');
      this.color = color.copy();
      this.el.style.backgroundColor = this.color.toHexString();
      this.el.innerHTML = '';
      // this.el.style.backgroundClip = 'content-box';
      // this.nullColorIcon.setVisible(false);
    } else {
      this.addClass('null');
      this.color = null;
      this.el.style.backgroundColor = 'transparent';
      this.el.innerHTML = '<svg class="icon"><use xlink:href="./images/icons.svg#checker"></svg>'
      // this.nullColorIcon.setVisible(true);
      // this.el.style.backgroundImage = 'url("./images/icons.svg")';
      // this.el.style.fill = 'white';
    }
  }

  onMouseDown(event) {
    if (event.buttons & 2) {
      // console.log('down');
      // if (this.color) {
      //   this.setColor(null);
      // } else {
      //   this.setColor(Color.Black);
      // }
    }
  }

  onMouseUp(event) {
  }

  onDblClick(event) {
    if (this.color) {
      this.setColor(null);
    } else {
      this.setColor(Color.Black);
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
    if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
    if (event.type === 'dblclick') {
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
