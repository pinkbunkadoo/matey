const Base = require('./base');

class TextField extends Base {
  constructor(params={}) {
    params.el = params.el || document.createElement('input');
    super(params);

    // this.el.style.fontSize = (12 * app.unit) + 'px';
    this.el.style.width = (params.width || (16 * app.unit) + 'px');

    // this.el.style['-webkit-user-select'] = 'none';
    // this.el.disabled = 'disabled';
    // this.el.style.cursor = 'text';

    this.el.onchange = (event) => {
      this.emit('change', event.target.value);
      this.el.blur();
    };

    this.el.onfocus = (event) => {
      // this.el.select();
    };

    this.el.onblur = (event) => {
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
