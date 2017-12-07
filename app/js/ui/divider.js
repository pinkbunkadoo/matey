const Base = require('./base');

function Divider(params = {}) {
  Base.call(this, params);
  this.addClass('divider');

  if (params.orientation === 'horizontal') {
    this.addClass('horizontal');
  } else {
    this.addClass('vertical');
  }
}

Divider.prototype = Object.create(Base.prototype);
Divider.prototype.constructor = Divider;

module.exports = Divider;
