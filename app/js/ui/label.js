const Base = require('./base');

class Label extends Base {
  constructor(params = {}) {
    super();

    this.addClass('label');

    this.title = params.title;
    this.el.innerHTML = this.title;
  }

  setTitle(title) {
    // console.log('serTitle', title);
    this.title = title;
    this.el.innerHTML = this.title;
  }
}

module.exports = Label;
