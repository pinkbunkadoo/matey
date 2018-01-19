const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');

class ColorSwatch extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('color-swatch');

    this.border = new Icon({ resource: 'swatch-border', color: Color.fromHexString('#404040') });
    this.border.addClass('color-swatch-layer');
    this.add(this.border);

    this.swatch = new Icon({ resource: params.resource? params.resource : 'fill' });
    this.swatch.addClass('color-swatch-layer');
    this.add(this.swatch);

    this.slash = new Icon({ resource: 'slash', color: Color.fromHexString('#0096ff') });
    this.slash.addClass('color-swatch-layer');
    this.add(this.slash);

    this.border.el.style.transition = 'opacity .6s';
    this.slash.el.style.transition = 'opacity .6s';

    // this.el.addEventListener('click', this);
    // this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('dblclick', this);

    this.setColor(params.color);
  }

  getColor() {
    return this.swatch.getColor();
  }

  setColor(color) {
    this.swatch.setColor(color);
    if (color) {
      // this.slash.hide();
      // this.border.show();
      this.slash.el.style.opacity = 0;
      this.border.el.style.opacity = 1;
    } else {
      // this.slash.show();
      // this.border.hide();
      this.slash.el.style.opacity = 1;
      this.border.el.style.opacity = 0;
    }

  }

  onMouseDown(event) {
    // this.emit('down', this);
  }

  onMouseUp(event) {
  }

  onClick() {
    // this.emit('click', this);
  }

  onDblClick(event) {
    // if (this.color) {
    //   this.setColor(null);
    // } else {
    //   this.setColor(this.initialColor);
    // }
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
