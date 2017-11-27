
function Selection() {
  this.elements = [];
}

Selection.prototype.constructor = Selection;

Selection.prototype = {
  add: function(item, options) {
    options = options || {};
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        this.add(item[i], options);
      }
    } else {
      if (!this.includes(item)) {
        // console.log('selection add');
        this.elements.push(item);
        item.selected = true;
        // console.log(this.elements);
      }
    }
  },

  remove: function(item) {
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        this.remove(item[i]);
      }
    } else {
      var index = this.elements.indexOf(item);
      if (index !== -1) {
        this.elements.splice(index, 1);
        item.selected = false;
      }
    }
  },

  get: function() {
    return this.elements;
  },

  isEmpty: function() {
    return (this.elements.length == 0);
  },

  includes: function(item) {
    return this.elements.indexOf(item) !== -1;
  },

  clear: function() {
    for (var i = 0; i < this.elements.length; i++) {
      var element = this.elements[i];
      element.selected = false;
    }
    this.elements = [];
  },

  invert: function() {
  }

}

module.exports = Selection;
