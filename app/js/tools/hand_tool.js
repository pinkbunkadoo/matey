const Const = require('../const');
const Util = require('../util');
const Geom = require('../geom/');
const Tool = require('./tool');

class HandTool extends Tool {
  constructor() {
    super('hand');
    this.cursor = 'hand';
    this.dragging = false;
  }

  focus() {
    console.log('hand');
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

  endCapture() {
    window.removeEventListener('mouseup', this);
    window.removeEventListener('mousemove', this);
    window.removeEventListener('blur', this);
  }

  onBlur(event) {
    this.endCapture();
  }

  onMouseDown(event) {
    window.addEventListener('mouseup', this);
    window.addEventListener('mousemove', this);
    window.addEventListener('blur', this);
  }

  onMouseUp(event) {
    this.endCapture();
  }

  onMouseMove(event) {
    if (event.buttons === 1) {
      var dx = -event.movementX;
      var dy = -event.movementY;
      this.emit('change', { dx: dx, dy: dy });
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
