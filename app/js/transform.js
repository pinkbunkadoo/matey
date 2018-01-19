const Point = require('./geom/point');

class Transform {
  constructor(x=0, y=0, scale=1, rotation=0) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;
  }

  apply(point) {
    // let tx = point.x + this.x;
    // let ty = point.y + this.y;
    return new Point(point.x*this.scale+this.x, point.y*this.scale+this.y);
  }

  copy() {
    return new Transform(this.x, this.y, this.scale, this.rotation);
  }
}


module.exports = Transform;
