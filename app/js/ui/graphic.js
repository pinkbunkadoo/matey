const Base = require('./base');

class Graphic extends Base {
  constructor(params = {}) {
    super();

    this.image = params.image;

    this.el.style.width = this.image.width + 'px';
    this.el.style.height = this.image.height + 'px';
    
    this.el.appendChild(this.image);
  }
}

module.exports = Graphic;
