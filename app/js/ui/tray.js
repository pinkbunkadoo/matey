const Base = require('./base');
const Container = require('./container');
const Label = require('./label');
const Icon = require('./icon');

class Tray extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('tray');
  }

  onMouseDown() {
  }

  onMouseMove() {
  }

  handleEvent(event) {
    if (event.type == 'mousedown') {
      this.onMouseDown(event);
    } else if (event.type == 'mouseup') {
      this.onMouseUp(event);
    } else if (event.type == 'mousemove') {
      this.onMouseMove(event);
    }

  }
}

module.exports = Tray;
