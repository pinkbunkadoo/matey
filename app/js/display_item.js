const Point = require('./geom/point');

class DisplayItem {
  constructor(params={}) {
    this.points = [];
    if (params.points instanceof Array) {
      for (var i = 0; i < params.points.length; i++) {
        let p = params.points[i];
        if (p instanceof Point) {
          this.points.push(p.copy());
        }
      }
    }
    this.color = params.color !== undefined ? params.color.copy() : null;
    this.fill = params.fill !== undefined ? params.fill.copy() : null;
    this.thickness = params.thickness !== undefined ? params.thickness : 1;
    this.transform = params.transform !== undefined ? params.transform.copy() : null;
  }

}

module.exports = DisplayItem;
