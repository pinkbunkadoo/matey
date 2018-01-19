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
    if (event.key === 'Alt' && !event.repeat) {
      App.setCursor('zoomout');
    }
  }

  onKeyUp(event) {
    if (event.key === 'Alt') {
      App.setCursor('zoomin');
    }
  }

  onMouseDown(event) {
    if (event.altKey || event.button === 2) {
      App.paper.zoomOut();
    }
    else if (event.button === 0) {
      App.paper.zoomIn();
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
