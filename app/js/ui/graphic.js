const Base = require('./base');

function Graphic(params) {
  params = params || {};
  Base.call(this, params);

  this.image = params.image;

  this.el.style.width = this.image.width + 'px';
  this.el.style.height = this.image.height + 'px';
  this.el.appendChild(this.image);
}

Graphic.prototype = Object.create(Base.prototype);
Graphic.prototype.constructor = Graphic;

module.exports = Graphic;
