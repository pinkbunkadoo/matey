const Container = require('./container');

class Overlay extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('overlay');
    this.setVisible(false);
    this.el.style.cursor = 'default';
  }

  show() {
    super.show();
    if (!document.body.contains(this.el)) document.body.appendChild(this.el);
    // console.log('overlay.show');
    // window.addEventListener('resize', this);
    // window.addEventListener('blur', this);
  }

  hide() {
    super.hide();
    if (document.body.contains(this.el)) document.body.removeChild(this.el);
    // console.log('overlay.hide');
    // window.removeEventListener('resize', this);
    // window.removeEventListener('blur', this);
  }

}

module.exports = Overlay;
