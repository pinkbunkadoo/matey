var Rectangle = require('./Rectangle.js');

function Path(points) {
  this.points = points ? points : [];
  // this.calculateBounds();
}

Path.prototype.constructor = Path;

Path.prototype.copy = function() {
  var path = new Path();
  for (var i = 0; i < this.points.length; i++) {
    path.points.push(this.points[i].copy());
  }
  return path;
}

// Path.prototype.toString = function() {
//   var s = '';
//   for (var i = 0; i < this.points.length; i++) {
//     var point = this.points[i];
//     s = s + ' ' + point.toString();
//   }
//   return s;
// }

Path.prototype.getBounds = function() {
  this.calculateBounds();
  return this.bounds;
}

// clockwise order returns a value of true
Path.prototype.isClockwise = function() {
  var points = this.points;
  var length = points.length;
  var orientation = false;
  if (length > 1) {
    // var first = points[0];
    // var last = points[length - 1];
    var sum = 0;
    for (var i = 0; i < length; i++) {
      // var p1 = (i === length - 1 ? last : this.points[i]);
      // var p2 = (i === length - 1 ? first : this.points[i + 1]);
      var p1 = [i];
      var p2 = [(i + 1) % length];

      var a = (points[(i+1) % length].x - points[i].x) * (points[(i+1) % length].y + points[i].y);

      // var a = (p2.x - p1.x) * (p2.y + p1.y);

      // console.log('a', points[(i+1) % length].x, points[i].x, points[(i+1) % length].y, points[i].y, '('+a+ ')');
      sum = sum + a;
    }
    orientation = (sum >= 0 ? true : false);
    // console.log(sum, orientation);
  }
  return orientation;
}

Path.prototype.calculateBounds = function() {
  var xmin = Number.POSITIVE_INFINITY, ymin = Number.POSITIVE_INFINITY;
  var xmax = Number.NEGATIVE_INFINITY, ymax = Number.NEGATIVE_INFINITY;

  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    if (point.x < xmin) xmin = point.x;
    if (point.y < ymin) ymin = point.y;
    if (point.x > xmax) xmax = point.x;
    if (point.y > ymax) ymax = point.y;
  };

  this.bounds = new Rectangle(xmin, ymin, xmax - xmin, ymax - ymin);
}

// Path.prototype.insert = function(point, index) {
//   if (index !== undefined) {
//     this.points.splice(index, 0, point);
//   } else {
//     this.points.push(point);
//   }
//   this.calculateBounds();
// }

module.exports = Path;
