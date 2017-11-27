const Emitter = require('../emitter');

function Tool(name) {
  Emitter.call(this);
  this.name = name;
  this.cursor = null;
}

Tool.prototype = Object.create(Emitter.prototype);
Tool.prototype.constructor = Tool;

Tool.prototype.focus = function() {}
Tool.prototype.blur = function() {}

Tool.prototype.handleEvent = function() {}

module.exports = Tool;
