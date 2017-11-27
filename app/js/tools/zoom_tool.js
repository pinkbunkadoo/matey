const Tool = require('./tool');

function ZoomTool() {
  Tool.call(this, 'zoom');
  this.cursor = 'zoomin';
}

ZoomTool.prototype = Object.create(Tool.prototype);
ZoomTool.prototype.constructor = ZoomTool;

ZoomTool.prototype.focus = function() {
  // app.setCursor('zoomin');
}

ZoomTool.prototype.render = function() {

}

ZoomTool.prototype.onKeyDown = function(event) {
  if (event.altKey && !event.repeat) {
    app.setCursor('zoomout');
  }
}

ZoomTool.prototype.onKeyUp = function(event) {
  if (event.altKey == false) {
    app.setCursor('zoomin');
  }
}

ZoomTool.prototype.onMouseDown = function(event) {
  if (event.altKey || event.button === 2) {
    this.emit('zoom-out');
  }
  else if (event.button === 0) {
    this.emit('zoom-in');
  }
}

ZoomTool.prototype.onMouseMove = function(event) {
}

ZoomTool.prototype.onMouseUp = function(event) {
}

ZoomTool.prototype.handleEvent = function(event) {
  // console.log('ZoomTool.prototype.handleEvent');
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


module.exports = ZoomTool;
