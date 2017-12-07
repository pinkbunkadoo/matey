const Base = require('./base');

function Icon(params) {
  params = params || {};
  Base.call(this, params);

  this.addClass('icon');

  this.resource = params.resource;
  this.width = params.width;
  this.height = params.height;

  this.el.style.width = (this.width) + 'px';
  this.el.style.height = (this.height) + 'px';

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  svg.setAttribute('width', this.width);
  svg.setAttribute('height', this.height);
  // svg.setAttribute('fill', 'green');
  svg.setAttribute('class', 'icon-dark');

  var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + this.resource);

  svg.appendChild(svguse);

  this.setInvert(params.invert ? params.invert : false);

  this.el.appendChild(svg);
}

Icon.prototype = Object.create(Base.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.setInvert = function(value) {
  // console.log('vadf');
  this.invert = value;
  if (this.invert) {
    this.removeClass('dark');
    this.addClass('light');
    // console.log('invert');
  } else {
    this.removeClass('light');
    this.addClass('dark');
  }
}

module.exports = Icon;
