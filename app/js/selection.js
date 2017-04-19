const Fragment = require('./fragment');

function Selection() {
  this.fragments = [];
  this.strokes = [];
}

Selection.prototype.constructor = Selection;

Selection.prototype = {
  add: function(fragment) {
    this.fragments.push(fragment);
  },
  remove: function(fragment) {
    var index = this.fragments.indexOf(fragment);
    if (index !== -1) {
      this.fragments.splice(index, 1);
    }
  },
  clear: function() {
    this.fragments = [];
  }
}

module.exports = Selection;
