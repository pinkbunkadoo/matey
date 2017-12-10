const Util = require('./util');
const Color = require('./color');
const Point = require('./geom/point');
const Vector = require('./geom/vector');
const Rectangle = require('./geom/rectangle');
const Fragment = require('./fragment');

function Stroke(params) {
  Fragment.call(this);
  this.points = (params.points ? params.points : []);
  this.style = null;
  this.color = params.color ? params.color : null;
  this.fill = params.fill ? params.fill : null;
  this.alpha = 1.0;
  this.selected = params.selected ? params.selected : false;
}

Stroke.prototype = Object.create(Fragment.prototype);
Stroke.prototype.constructor = Stroke;

Stroke.prototype.copy = function() {
  var stroke = new Stroke({ color: this.color, fill: this.fill, selected: false });
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    stroke.points.push(point.copy());
  }
  return stroke;
}

Stroke.prototype.setColor = function(color) {
  this.color = color;
}

Stroke.prototype.setFill = function(color) {
  this.fill = color;
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

Stroke.prototype.hitTest = function(x, y, radius) {
  var p = new Point(x, y);
  var selection = false;
  var stroke = this;
  var bounds = stroke.getBounds();
  var xmin = bounds.x - radius;
  var ymin = bounds.y - radius;
  var xmax = bounds.x + bounds.width + radius;
  var ymax = bounds.y + bounds.height + radius;

  if (Util.pointInRect(x, y, xmin, ymin, xmax, ymax)) {
    for (var j = 1; j < stroke.points.length; j++) {
      var point = stroke.points[j];
      if (j > 0) {
        var a = stroke.points[j - 1];
        var b = point;
        var c = p;

        var v0 = Vector.subtract(new Vector(b.x, b.y), new Vector(a.x, a.y));
        var v1 = Vector.subtract(new Vector(c.x, c.y), new Vector(a.x, a.y));

        var angle = Vector.angleBetween(v0, v1);
        var adjacent = Vector.dot(v0, v1) / v0.magnitude();
        var opposite = Math.tan(angle) * adjacent;
        var ratio = adjacent / v0.magnitude();

        var v2 = Vector.multiply(v0, ratio);
        var v3 = Vector.subtract(v2, v1);

        if (opposite < radius && adjacent > 0 && adjacent < v0.magnitude()) {
          // selection = { p1: a, p2: b, p3: new Point(a.x + v2.x, a.y + v2.y) };
          selection = true;
          break;
        }
      }
    }
  }

  return selection;
}

module.exports = Stroke;
