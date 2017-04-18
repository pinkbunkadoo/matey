const Action = require('./action.js');

function MoveAction(options) {
  Action.call(this, 'move');

  this.options;
}

MoveAction.prototype = Object.create(Action.prototype);
MoveAction.prototype.constructor = MoveAction;

MoveAction.prototype = {
  do: function() {
    // app.setStrokes(this.strokes);
  }
};

module.exports = MoveAction;
