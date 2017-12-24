const Container = require('./container');

class Tray extends Container {
  constructor() {
    super();
  }

  isMouseOver() {
    let mx = app.cursorX;
    let my = app.cursorY;
    let x = this.el.offsetLeft;
    let y = this.el.offsetTop;
    let width = this.el.offsetWidth;
    let height = this.el.offsetHeight;
    return (mx > x && mx < x + width && my > y && my < y + height);
  }

}

module.exports = Tray;
