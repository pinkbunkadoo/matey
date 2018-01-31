
var Util = {};

Util.clamp = function(value, min, max) {
  return (value < min ? min : (value > max ? max : value));
}

Util.extend = function(target, obj) {
  for (prop in obj) {
    var d = Object.getOwnPropertyDescriptor(obj, prop);
    Object.defineProperty(target, prop, d);
  }
}

Util.distance = function(x1, y1, x2, y2) {
  var x = x1 - x2;
  var y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}

Util.intersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
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
    seg2: ub >= 0 && ub <= 1,
    ua: ua,
    ub: ub
  };
}

Util.pointInRect = function(x, y, xmin, ymin, xmax, ymax) {
  return (x > xmin && x < xmax && y > ymin && y < ymax);
}

Util.areaOfTriangle = function(p1, p2, p3) {
  return Math.abs((p1.x - p3.x) * (p2.y - p1.y) - (p1.x - p2.x) * (p3.y - p1.y));
}

Util.lineIntersectsRectangle = function(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
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

Util.calculatePolygonBounds = function(points) {
  var minx = Number.POSITIVE_INFINITY;
  var miny = Number.POSITIVE_INFINITY;
  var maxx = Number.NEGATIVE_INFINITY;
  var maxy = Number.NEGATIVE_INFINITY;
  var bounds = { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
  if (points.length > 0) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      minx = (p.x < minx ? p.x : minx);
      miny = (p.y < miny ? p.y : miny);
      maxx = (p.x > maxx ? p.x : maxx);
      maxy = (p.y > maxy ? p.y : maxy);
    }
    bounds = { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
  }
  return bounds;
}


// Copyright (c) 1970-2003, Wm. Randolph Franklin
// https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html

Util.pointInPolygon = function(points, testx, testy) {
  let i, j, c = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    if (((points[i].y > testy) != (points[j].y > testy)) &&
      (testx < (points[j].x - points[i].x) * (testy - points[i].y) / (points[j].y - points[i].y) + points[i].x))
      c = !c;
  }
  return c;
}

module.exports = Util;
