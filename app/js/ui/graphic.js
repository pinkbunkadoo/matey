const Base = require('./base');

class Graphic extends Base {
  constructor(image) {
    super();
    this.image = image;
    this.el.style.width = this.image.width + 'px';
    this.el.style.height = this.image.height + 'px';
    this.el.style.overflow = 'hidden';
    this.el.appendChild(this.image);
  }
}

module.exports = Graphic;
