const Container = require('../container');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Icon = require('../icon');
const Tray = require('../tray');
const TrayButton = require('../tray_button');
const Spacer = require('../spacer');
const Divider = require('../divider');

class ColorsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.stroke = new ColorSwatch({ el: document.getElementById('colors-tray-stroke'), name: 'stroke', type: 'stroke' });
    this.fill = new ColorSwatch({ el: document.getElementById('colors-tray-fill'), name: 'fill', type: 'fill' });

    this.add(this.stroke);
    this.add(this.fill);
  }

  setStrokeColor(color) {
    this.stroke.setColor(color);
  }

  setFillColor(color) {
    this.fill.setColor(color);
  }

  getStrokeColor() {
    return this.stroke.getColor();
  }

  getFillColor() {
    return this.fill.getColor();
  }

}

module.exports = ColorsTray;
