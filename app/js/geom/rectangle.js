
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

Rectangle.prototype.grow = function(margin) {
  this.x -= margin, this.y -= margin, this.width += margin * 2, this.height += margin * 2;
  return this;
}

Rectangle.prototype.containsPoint = function(x, y) {
  return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
}

Rectangle.fromObject = function(obj) {
  return new Rectangle(obj.x, obj.y, obj.width, obj.height);
}

module.exports = Rectangle;
