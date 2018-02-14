const Base = require('./base');

class TextField extends Base {
  constructor(params={}) {
    if (!params.el) {
        params.el = document.createElement('input');
        params.el.type = 'text';
    }
    super(params);

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
