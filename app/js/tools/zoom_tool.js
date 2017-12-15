// const
const Tool = require('./tool');

class ZoomTool extends Tool {
  constructor() {
    super('zoom');
    this.cursor = 'zoomin';
  }

  focus() {
  }

  render() {
  }

  onKeyDown(event) {
    // console.log('down');
    if (event.altKey && !event.repeat) {
      // app.setCursor('zoomout');
      this.cursor = 'zoomout';
      this.emit('cursor-change', { cursor: 'zoomout' });
    }
  }

  onKeyUp(event) {
    if (event.altKey == false) {
      // app.setCursor('zoomin');
      this.cursor = 'zoomin';
      this.emit('cursor-change', { cursor: 'zoomin' });
    }
  }

  onMouseDown(event) {
    if (event.altKey || event.button === 2) {
      this.emit('zoom-out');
    }
    else if (event.button === 0) {
      this.emit('zoom-in');
    }
  }

  onMouseMove(event) {
  }

  onMouseUp(event) {
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
  }
}

module.exports = ZoomTool;
