const Base = require('./base');

class Spacer extends Base {
  constructor(params = {}) {
    super(params);

    if (params.width !== undefined) {
      this.el.style.minWidth = this.el.style.width = params.width + 'em';
    }

    if (params.height !== undefined) {
      this.el.style.minHeight = this.el.style.height = params.height + 'em';
    }
  }
}

module.exports = Spacer;
