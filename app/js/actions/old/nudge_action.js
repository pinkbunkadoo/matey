const Action = require('./action');

function NudgeAction(dx, dy) {
  Action.call(this, 'Nudge');
  this.dx = dx;
  this.dy = dy;
}

NudgeAction.prototype = Object.create(Action.prototype);
NudgeAction.prototype.constructor = NudgeAction;

module.exports = NudgeAction;
