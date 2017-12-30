const Base = require('./base');

class Spacer extends Base {
  constructor(params = {}) {
    super(params);

    this.addClass('spacer');

    if (params.width !== undefined) {
      this.el.style.minWidth = this.el.style.width = params.width + 'em';
    } else {
      this.el.style.flex = 'auto';
    }

    if (params.height !== undefined) {
      this.el.style.minHeight = this.el.style.height = params.height + 'em';
    } else {
      // this.el.style.flex = 'auto';
    }
  }
}

module.exports = Spacer;
