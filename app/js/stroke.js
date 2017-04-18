const Rectangle = require('./geom/rectangle.js');

function Stroke(points) {
  this.points = (points ? points : []);
  this.calculateBounds();
}

Stroke.prototype.constructor = Stroke;

Stroke.prototype.copy = function() {
  var stroke = new Stroke();
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    stroke.points.push(point.copy());
  }
  return stroke;
}

Stroke.prototype.getBounds = function() {
  this.calculateBounds();
  return this.bounds;
}

Stroke.prototype.calculateBounds = function() {
  var minx = Number.POSITIVE_INFINITY;
  var miny = Number.POSITIVE_INFINITY;
  var maxx = Number.NEGATIVE_INFINITY;
  var maxy = Number.NEGATIVE_INFINITY;

  if (this.points.length > 0) {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i];
      minx = (p.x < minx ? p.x : minx);
      miny = (p.y < miny ? p.y : miny);
      maxx = (p.x > maxx ? p.x : maxx);
      maxy = (p.y > maxy ? p.y : maxy);
    }
    this.bounds = new Rectangle(minx, miny, maxx - minx, maxy - miny);
  }
}


module.exports = Stroke;

