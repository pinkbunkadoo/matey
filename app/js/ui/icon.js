const Base = require('./base');

class Icon extends Base {
  constructor(params = {}) {
    super();

    this.addClass('icon');

    this.resource = params.resource;
    // this.width = params.width;
    // this.height = params.height;
    //
    // this.el.style.width = (this.width) + 'px';
    // this.el.style.height = (this.height) + 'px';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    if (params.invert) {
      svg.setAttribute('class', 'icon-light');
    } else {
      svg.setAttribute('class', 'icon-dark');
    }

    var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.resource);

    svg.appendChild(svguse);

    this.setInvert(params.invert ? params.invert : false);

    this.el.appendChild(svg);
  }

  setInvert(value) {
    this.invert = value;
    if (this.invert) {
      this.removeClass('dark');
      this.addClass('light');
    } else {
      this.removeClass('light');
      this.addClass('dark');
    }
  }
}

module.exports = Icon;
