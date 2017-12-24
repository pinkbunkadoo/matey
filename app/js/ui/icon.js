const Base = require('./base');

class Icon extends Base {
  constructor(params = {}) {
    super();
    
    this.resource = params.resource;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.classList.add('icon');

    var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.resource);
    svg.appendChild(svguse);

    this.el.appendChild(svg);
  }

  // setInvert(value) {
  //   if (value)
  //     this.addClass('invert');
  //   else
  //     this.removeClass('invert');
  // }
}

module.exports = Icon;
