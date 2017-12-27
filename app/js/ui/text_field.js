const Base = require('./base');

class TextField extends Base {
  constructor(params={}) {
    params.el = params.el || document.createElement('input');
    super(params);

    // this.el.style['-webkit-user-select'] = 'none';
    // this.el.disabled = 'disabled';

    this.el.onchange = (event) => {
      this.emit('change', event.target.value);
      this.el.blur();
    };

    this.el.onfocus = (event) => {
      this.el.select();
      // app.capture(this);
    };

    this.el.onblur = (event) => {
      // app.release(this);
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
