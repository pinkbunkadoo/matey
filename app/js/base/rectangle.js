
function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.copy = function() {
  return new Rectangle(this.x, this.y, this.width, this.height);
}


module.exports = Rectangle;