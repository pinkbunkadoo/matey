const Color = require('../color');
const Base = require('./base');
const Container = require('./container');

class Icon extends Container {
  constructor(params={}) {
    super(params);

    // this.addClass('icon');

    this.resource = params.resource;

    if (!this.el.firstChild) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      // svg.setAttribute('fill', 'red');
      svg.style.pointerEvents = 'none';

      var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.resource);
      svg.appendChild(svguse);

      this.el.appendChild(svg);
    }

    this.initialFill = this.el.firstChild.style.fill;

    if (params.color) {
      this.setColor(params.color);
    }
  }

  setColor(color) {
    if (color instanceof Color) {
      this.color = color.copy();
      this.el.firstChild.style.fill = color.toHexString();
    } else {
      this.color = null;
      this.el.firstChild.style.fill = this.initialFill;
    }
  }

  getColor() {
    return this.color;
  }

  // setInvert(value) {
  //   if (value)
  //     this.addClass('invert');
  //   else
  //     this.removeClass('invert');
  // }
}

module.exports = Icon;
