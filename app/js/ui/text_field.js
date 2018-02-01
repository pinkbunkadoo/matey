const Base = require('./base');

class TextField extends Base {
  constructor(params={}) {
    params.el = params.el || document.createElement('input');
    super(params);

    // this.el.style.width = (params.width || (16 * App.unit) + 'px');

    this.el.onchange = (event) => {
      this.el.blur();
    };

    this.el.onfocus = (event) => {
      // this.el.select();
    };

    this.el.onblur = (event) => {
    };
  }

  set value(text) {
    this.el.value = text;
  }

  get value() {
    return this.el.value;
  }

}

module.exports = TextField;
