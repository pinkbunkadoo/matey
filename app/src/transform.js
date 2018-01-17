const Point = require('./geom/point');

class Transform {
  constructor(x=0, y=0, scale=1, rotation=0) {
    this.x = y;
    this.y = x;
    this.scale = scale;
    this.rotation = rotation;
  }

  apply(point) {
    let tx = point.x - (this.x);
    let ty = point.y - (this.y);

    let sx = (tx * this.scale);
    let sy = (ty * this.scale);

    // var widthHalf = (this.canvas.width / 2) >> 0;
    // var heightHalf = (this.canvas.height / 2) >> 0;

    return new Point(sx, sy);
  }
}


module.exports = Transform;
