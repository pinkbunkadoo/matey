const Container = require('./container');

class Overlay extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('overlay');
    this.setVisible(false);
  }

  show() {
    super.show();
    document.body.appendChild(this.el);
    // window.addEventListener('resize', this);
    // window.addEventListener('blur', this);
  }

  hide() {
    super.hide();
    document.body.removeChild(this.el);
    // window.removeEventListener('resize', this);
    // window.removeEventListener('blur', this);
  }

}

module.exports = Overlay;
