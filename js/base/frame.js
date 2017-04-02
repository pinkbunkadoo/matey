
function Frame() {
  this.strokes = [];
}

Frame.prototype.constructor = Frame;


Frame.prototype.copy = function() {
  var frame = new Frame();
  for (var i = 0; i < this.strokes.length; i++) {
    var stroke = this.strokes[i];
    frame.addStroke(stroke.copy());
  }
  return frame;
}


Frame.prototype.addStroke = function(stroke) {
  this.strokes.push(stroke);
}

Frame.prototype.removeStroke = function(stroke) {
  var index = this.strokes.indexOf(stroke);
  if (index != -1) {
    this.strokes.splice(index, 1);
  }
}


module.exports = Frame;
