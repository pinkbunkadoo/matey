const Base = require('./base');

class Spacer extends Base {
  constructor(params = {}) {
    super(params);

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
}

module.exports = Spacer;
