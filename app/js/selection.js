const Fragment = require('./fragment');

function Selection() {
  this.strokes = [];
  this.fragments = [];
}

Selection.prototype.constructor = Selection;

Selection.prototype = {
  add: function(stroke, offsets) {
    this.strokes.push(stroke);
    this.fragments.push(offsets);
  },
  remove: function(stroke) {
    var index = this.strokes.indexOf(stroke);
    if (index !== -1) {
      this.strokes.splice(index, 1);
    }
  },
  clear: function() {
    this.strokes = [];
    this.fragments = [];
  }
}

module.exports = Selection;