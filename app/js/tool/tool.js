
function Tool(name) {
  this.name = name;
}

Tool.prototype.constructor = Tool;

Tool.prototype.focus = function() {}
Tool.prototype.blur = function() {}
Tool.prototype.draw = function() {}
Tool.prototype.undo = function() {}
Tool.prototype.onMouseMove = function(event) {}
Tool.prototype.onMouseOut = function(event) {}
Tool.prototype.onMouseOver = function(event) {}
Tool.prototype.onMouseDown = function(event) {}
Tool.prototype.onMouseUp = function(event) {}
Tool.prototype.onKeyUp = function(event) {}
Tool.prototype.onKeyDown = function(event) {}

module.exports = Tool;
