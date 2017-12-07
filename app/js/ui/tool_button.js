const Container = require('./container');
const Button = require('./button');
const Icon = require('./icon');
const Label = require('./label');

function ToolButton(params) {
  Button.call(this, params);
}

ToolButton.prototype = Object.create(Button.prototype);
ToolButton.prototype.constructor = ToolButton;

ToolButton.prototype.onMouseDown = function(event) {
  if (this.onPress) {
    this.onPress(this);
  }
}

ToolButton.prototype.onMouseUp = function(event) {
}

ToolButton.prototype.onMouseOver = function(event) {
  this.addClass('hover');
}

ToolButton.prototype.onMouseOut = function(event) {
  this.removeClass('hover');
}

ToolButton.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type === 'mouseover') {
    this.onMouseOver(event);
  }
  else if (event.type === 'mouseout') {
    this.onMouseOut(event);
  }
}

module.exports = ToolButton;
