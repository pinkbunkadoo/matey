
function Action(name) {
  this.name = name;
}

Action.prototype.constructor = Action;

Action.prototype.do = function() {}
Action.prototype.undo = function() {}
Action.prototype.redo = function() {}

module.exports = Action;
