const Action = require('./action.js');

function ClipAction(strokes) {
  Action.call(this, 'clip');
  this.strokes = [];
  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i].copy();
    this.strokes.push(stroke);
  }
}

ClipAction.prototype = Object.create(Action.prototype);
ClipAction.prototype.constructor = ClipAction;

ClipAction.prototype = {
  do: function() {
    app.setStrokes(this.strokes);
  }
  // undo: function() {
  //   app.frame.strokes = action.strokes;
  // },
  // redo: function() {
  //   app.frame.strokes = action.strokes;
  // }
};

module.exports = ClipAction;
