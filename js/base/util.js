
var util = {};

util.distance = function(p1, p2) {
  var x = p1.x - p2.x;
  var y = p1.y - p2.y;
  return Math.sqrt(x * x + y * y);
}

util.areaOfTriangle = function(p1, p2, p3) {
  // return Math.abs((t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) - (t[0][0] - t[1][0]) * (t[2][1] - t[0][1]));
  return Math.abs((p1.x - p3.x) * (p2.y - p1.y) - (p1.x - p2.x) * (p3.y - p1.y));
}


