const Action = require('./action.js');

function PencilAction(strokes) {
  Action.call(this, 'pencil');

  this.strokes = [];
  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i].copy();
    this.strokes.push(stroke);
  }
}

PencilAction.prototype = Object.create(Action.prototype);
PencilAction.prototype.constructor = PencilAction;

PencilAction.prototype = {
  do: function() {
    app.setStrokes(this.strokes);
  },
  undo: function() {
    app.setStrokes(this.strokes);
  },
  redo: function() {
    app.setStrokes(this.strokes);
  }
};

module.exports = PencilAction;
