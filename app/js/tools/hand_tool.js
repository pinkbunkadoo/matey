const Const = require('../const');
const Util = require('../util');
const Geom = require('../geom/');
const Tool = require('./tool');

function HandTool() {
  Tool.call(this, 'hand');
  this.cursor = 'hand';

  this.dragging = false;
}

HandTool.prototype = Object.create(Tool.prototype);
HandTool.prototype.constructor = HandTool;

HandTool.prototype.focus = function() {
}

HandTool.prototype.blur = function() {
}

HandTool.prototype.beginDrag = function() {
  this.dragging = true;
}

HandTool.prototype.endDrag = function() {
  this.dragging = false;
}


HandTool.prototype.render = function() {
}

HandTool.prototype.onMouseMove = function(event) {
  if (app.mouseLeft) {
    // var dx = -app.mouseDeltaX / app.paper.scale;
    // var dy = -app.mouseDeltaY / app.paper.scale;
    dx = -event.movementX / app.paper.scale;
    dy = -event.movementY / app.paper.scale;
    this.emit('change', { dx: dx, dy: dy });
  }
}

HandTool.prototype.onMouseDown = function(event) {
}

HandTool.prototype.onMouseUp = function(event) {
}

HandTool.prototype.onKeyDown = function(event) {
}

HandTool.prototype.onKeyUp = function(event) {
}

HandTool.prototype.handleEvent = function(event) {
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

module.exports = HandTool;
