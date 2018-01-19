
class Point {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Point(this.x, this.y);
  }

  toString() {
    return '('+this.x+','+this.y+')';
  }
}

module.exports = Point;
