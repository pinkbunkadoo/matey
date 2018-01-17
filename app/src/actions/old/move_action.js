const Action = require('./action');

function MoveAction(dx, dy) {
  Action.call(this, 'Move');
  this.dx = dx;
  this.dy = dy;
}

MoveAction.prototype = Object.create(Action.prototype);
MoveAction.prototype.constructor = MoveAction;

// MoveAction.prototype = {
// };

module.exports = MoveAction;
