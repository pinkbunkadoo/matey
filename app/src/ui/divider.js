const Base = require('./base');

class Divider extends Base {
  constructor(params = {}) {
    super(params);

    this.addClass('divider');

    if (params.orientation === 'horizontal') {
      this.addClass('horizontal');
    } else {
      this.addClass('vertical');
    }
  }
}

module.exports = Divider;
