const Base = require('./base');

class Label extends Base {
  constructor(params = {}) {
    super(params);
    // this.addClass('label');
    if (params.text) {
      // this.text = params.text;
      this.set(params.text);
    } else {

    }
  }

  set(text) {
    this.el.innerHTML = text;
  }

  render(params) {
    if (params.cmd === 'show') {
      this.set(params.value);
    }
  }

}

module.exports = Label;
