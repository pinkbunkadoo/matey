
class DisplayList {
  constructor() {
    
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  clear() {
    this.items = [];
  }
}

module.exports = DisplayList;
