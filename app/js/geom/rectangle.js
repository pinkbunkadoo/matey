
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

Rectangle.prototype.containsPoint = function(x, y, margin) {
  margin = isNaN(margin) ? 0 : margin;
  var left = this.x - margin;
  var top = this.y - margin;
  var width = this.width + margin * 2;
  var height = this.height + margin * 2;
  return (x > left && x < left + width && y > top && y < top + height);
}

module.exports = Rectangle;
