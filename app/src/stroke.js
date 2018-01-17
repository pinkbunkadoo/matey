const Util = require('./util');
const Color = require('./color');
const Point = require('./geom/point');
const Vector = require('./geom/vector');
const Rectangle = require('./geom/rectangle');
const Fragment = require('./fragment');

class Stroke extends Fragment {
  constructor(params) {
    super();
    this.points = params.points ? params.points : [];
    this.color = params.color ? params.color : null;
    this.fill = params.fill ? params.fill : null;
    this.alpha = 1.0;
    this.selected = params.selected ? params.selected : false;
    this.calculateBounds();
  }

  copy() {
    let points = [];
    for (let i = 0; i < this.points.length; i++) {
      points.push(this.points[i].copy());
    }
    let stroke = new Stroke({ points: points, color: this.color, fill: this.fill, selected: this.selected });
    return stroke;
  }

  calculateBounds() {
    this.bounds = Rectangle.fromObject(Util.calculatePolygonBounds(this.points));
  }

  setColor(color) {
    this.color = color;
  }

  setFill(color) {
    this.fill = color;
  }

  getBounds() {
    return this.bounds;
  }

  hitTest(x, y, radius) {
    var p = new Point(x, y);
    var selection = false;
    var stroke = this;

    for (var j = 1; j < this.points.length; j++) {
      var point = this.points[j];
      if (j > 0) {
        var a = this.points[j - 1];
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
    return selection;
  }

}

module.exports = Stroke;
