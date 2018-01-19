
class History {
  constructor() {
    this.items = [];
    this.default = null;
    this.marker = 0;
  }

  add(action) {
    if (this.marker < this.items.length) {
      this.items = this.items.slice(0, this.marker);
    }
    this.items.push(action);
    if (this.items.length > 20) this.items.shift();
    this.marker = this.items.length;
  }

  atEnd() {
    return this.marker == this.items.length;
  }

  atBeginning() {
    return this.marker == 0;
  }

  isEmpty() {
    return this.items.length == 0;
  }

  getAction() {
    return this.marker > 0 ? this.items[this.marker - 1] : null;
  }

  go(index) {
    this.marker = index;
  }

  back() {
    var action;
    if (this.marker > 0) {
      this.marker--;
    }
    return this.marker;
  }

  forward() {
    var action;
    if (this.marker < this.items.length) {
      this.marker++;
    }
    return this.marker;
  }
}

module.exports = History;
