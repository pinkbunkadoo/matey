const Color = require('../color');
const Base = require('./base');
const Container = require('./container');

class Icon extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('icon');
    this.resource = params.resource;
    this.svg = params.svg || null;

    if (this.svg) {
      this.el.appendChild(this.svg);
    } else {
      if (this.el.firstChild instanceof SVGSVGElement) {
        this.svg = this.el.firstChild;
      } else {
        if (this.resource) {
          this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          this.svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
          this.svg.classList.add('svg-icon');

          var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.resource);
          this.svg.appendChild(svguse);

          this.el.appendChild(this.svg);
        }
      }
    }

    this.initialFill = this.el.firstChild ? this.el.firstChild.style.fill : 'red';

    if (params.color) {
      this.setColor(params.color);
    }
    params.width ? this.el.style.minWidth = this.el.style.width = params.width + 'em' : null;
    params.height ? this.el.style.minHeight = this.el.style.height = params.height + 'em' : null;
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
