
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.constructor = Point;

Point.prototype.copy = function() {
  return new Point(this.x, this.y);
}

Point.prototype.toString = function() {
  // return '('+(this.x).toFixed(1)+','+(this.y).toFixed(1)+')';
  return '('+this.x+','+this.y+')';
}


module.exports = Point;