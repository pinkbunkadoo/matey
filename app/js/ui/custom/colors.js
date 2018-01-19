const Color = require('../../color');
const Container = require('../container');
const Icon = require('../icon');
const Spacer = require('../spacer');
const ColorSwatch = require('../color_swatch');
const Panel = require('../panel');
const ColorPalette = require('../color_palette');

class Colors extends Panel {
  constructor(params={}) {
    params.el = document.getElementById('colors');
    super(params);

    this.container = new Container({ el: document.getElementById('colors-container'), name: 'colors' });
    this.container.setStyle({
      alignItems: 'center',
      width: '6.5em'
    })
    this.container.setStyle({ flexDirection: 'column' });

    this.stroke = new ColorSwatch({ el: document.getElementById('colors-stroke'), name: 'stroke', resource: 'stroke' });
    this.fill = new ColorSwatch({ el: document.getElementById('colors-fill'), name: 'fill' });

    this.container.add(this.stroke);
    this.container.add(this.fill);

    this.add(this.container);

    this.stroke.el.onmousedown = (event) => {
      // console.log('stroke');
      this.stroke.emit('down', this);
    }

    this.fill.el.onmousedown = (event) => {
      // console.log('fill');
      this.fill.emit('down', this);
    }
  }

  setStrokeColor(color) {
    // console.log('setStrokeColor', color);
    this.stroke.setColor(color);
  }

  setFillColor(color) {
    // console.log('setFillColor', color);
    this.fill.setColor(color);
  }

  getStrokeColor() {
    return this.stroke.getColor();
  }

  getFillColor() {
    return this.fill.getColor();
  }

}

module.exports = Colors;
