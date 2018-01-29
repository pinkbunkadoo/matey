const Base = require('./base');

class Label extends Base {
  constructor(params = {}) {
    params.el = params.el || document.createElement('label');
    super(params);

    if (params.title) {
      this.set(params.title);
    }
    if (params.forElement) {
      this.el.forElement = params.forElement;
    }
  }

  set(value) {
    this.el.innerHTML = value;
  }

  render(params) {
    if (params.cmd === 'show') {
      this.set(params.value);
    }
  }

}

module.exports = Label;
