const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');

function ColorSwatch(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('color-swatch');

  this.el.style.width = '18px';
  this.el.style.height = '18px';

  // this.color = params.color ? params.color.copy() : new Color()

  // this.nullColorIcon = new Icon({ resource: 'nullcolor', width: app.icons['nullcolor'].width, height: app.icons['nullcolor'].height });
  this.nullColorIcon = new Icon({ resource: 'nullcolor', width: 16, height: 16 });
  this.add(this.nullColorIcon);

  this.setColor(params.color);
}

ColorSwatch.prototype = Object.create(Container.prototype);
ColorSwatch.prototype.constructor = ColorSwatch;

ColorSwatch.prototype.getColor = function() {
  return this.color;
}

ColorSwatch.prototype.setColor = function(color) {
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

ColorSwatch.prototype.onMouseDown = function(event) {
  if (event.button === 2) {
    this.setColor(null);
  }
}

ColorSwatch.prototype.onCopy = function(event) {
  var text = this.color.toHexString();
  event.clipboardData.setData('text/plain', text);
  event.preventDefault();
}

ColorSwatch.prototype.onPaste = function(event) {
  var text = event.clipboardData.getData('text/plain');
  if (text[0] !== '#') text = '#' + text;
  this.setColor(Color.fromHexString(text));
  this.emit('color-change', this.color);
}

ColorSwatch.prototype.handleEvent = function(event) {
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

module.exports = ColorSwatch;
