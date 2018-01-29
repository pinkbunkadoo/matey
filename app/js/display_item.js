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
    this.color = params.color ? params.color.copy() : null;
    this.fill = params.fill ? params.fill.copy() : null;
    this.thickness = params.thickness !== undefined ? params.thickness : 1;
    this.opacity = params.opacity !== undefined ? params.opacity : 1;
    this.operation = params.operation !== undefined ? params.operation : 'source-over';
    this.transform = params.transform ? params.transform.copy() : null;
  }

}

module.exports = DisplayItem;
