
var util = {};

util.distance = function(x1, y1, x2, y2) {
  var x = x1 - x2;
  var y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}

// util.midPoint = function(x1, y1, x2, y2) {
//   var x = x1 - x2;
//   var y = y1 - y2;
//   return new Point(x1 + x2 / 2);
// }

util.intersect = function(x1, y1, x2, y2, x3, y3, x4, y4)
{
  var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1
  };
}


util.pointInRect = function(x, y, xmin, ymin, xmax, ymax) {
  return (x > xmin && x < xmax && y > ymin && y < ymax);
}


util.areaOfTriangle = function(p1, p2, p3) {
  // return Math.abs((t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) - (t[0][0] - t[1][0]) * (t[2][1] - t[0][1]));
  return Math.abs((p1.x - p3.x) * (p2.y - p1.y) - (p1.x - p2.x) * (p3.y - p1.y));
}


util.lineIntersectsRectangle = function(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
    // Completely outside.
    if ((x1 <= xmin && x2 <= xmin) || (y1 <= ymin && y2 <= ymin) || (x1 >= xmax && x2 >= xmax) || (y1 >= ymax && y2 >= ymax))
        return false;

    var m = (y2 - y1) / (x2 - x1);

    var y = m * (xmin - x1) + y1;
    if (y > ymin && y < ymax) return true;

    y = m * (xmax - x1) + y1;
    if (y > ymin && y < ymax) return true;

    var x = (ymin - y1) / m + x1;
    if (x > xmin && x < xmax) return true;

    x = (ymax - y1) / m + x1;
    if (x > xmin && x < xmax) return true;

    return false;
}