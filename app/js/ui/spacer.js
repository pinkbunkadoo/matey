const Base = require('./base');

function Spacer(params = {}) {
  Base.call(this, params);
  this.addClass('spacer');

  if (params.width != undefined) {
    this.width = params.width;
    this.el.style.width = this.width + 'px';
    this.el.style.minWidth = this.width + 'px';
  } else {
    this.el.style.flex = 'auto';

  }

  if (params.height != undefined) {
    this.height = params.height;
    this.el.style.height = this.height + 'px';
    this.el.style.minHeight = this.height + 'px';
  } else {
    // this.el.style.flex = 'auto';
  }

}

Spacer.prototype = Object.create(Base.prototype);
Spacer.prototype.constructor = Spacer;

module.exports = Spacer;
