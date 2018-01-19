const Util = require('../util');
const Geom = require('../geom/');
const Tool = require('./tool');

class HandTool extends Tool {
  constructor() {
    super('hand');
    this.cursor = 'hand';
  }

  reset() {
    this.dragging = false;
  }

  focus() {
    this.reset();
  }

  blur() {
  }

  beginDrag() {
    this.dragging = true;
  }

  endDrag() {
    this.dragging = false;
  }


  render() {
  }

  onMouseDown(event) {
    App.capture(this);
    // window.addEventListener('mouseup', this);
    // window.addEventListener('mousemove', this);
    // window.addEventListener('blur', this);
  }

  onMouseUp(event) {
    App.release(this);
    // this.endCapture();
  }

  onMouseMove(event) {
    if (event.buttons === 1) {
      var dx = -event.movementX / App.paper.scale;
      var dy = -event.movementY / App.paper.scale;
      App.paper.panCameraBy(dx, dy);
      App.paper.render();
      // this.emit('pan', { dx: dx, dy: dy });
    }
  }

  onKeyDown(event) {
  }

  onKeyUp(event) {
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mousemove') {
      this.onMouseMove(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
    else if (event.type === 'keydown') {
      this.onKeyDown(event);
    }
    else if (event.type === 'keyup') {
      this.onKeyUp(event);
    }
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = HandTool;
