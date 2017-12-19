
class Selection {
  constructor() {
    this.items = [];
  }

  add(item, options) {
    options = options || {};
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        this.add(item[i], options);
      }
    } else {
      if (!this.includes(item)) {
        this.items.push(item);
        item.selected = true;
      }
    }
  }

  remove(item) {
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        this.remove(item[i]);
      }
    } else {
      var index = this.items.indexOf(item);
      if (index !== -1) {
        this.items.splice(index, 1);
        item.selected = false;
      }
    }
  }

  get() {
    return this.items;
  }

  isEmpty() {
    return (this.items.length == 0);
  }

  includes(item) {
    return this.items.indexOf(item) !== -1;
  }

  clear() {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.selected = false;
    }
    this.items = [];
  }

  invert() {
  }

}

module.exports = Selection;
