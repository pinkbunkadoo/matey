const Base = require('./base');

class TextField extends Base {
  constructor(params={}) {
    super(params);

    this.el.onchange = (event) => {
      this.emit('change', event.target.value);
      this.el.blur();
      // console.log('change');
    };

    this.el.onfocus = (event) => {
      // console.log('focus', this.el.tabIndex);
      this.el.select();
      app.capture(this);
    };

    this.el.onblur = (event) => {
      // console.log('blur');
      app.release(this);
    };
  }

  set(value) {
    this.el.value = value;
  }

  render(params) {
    if (params.cmd === 'show') {
      this.set(params.value);
    }
  }

}

module.exports = TextField;
