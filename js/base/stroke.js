
function Stroke(points) {
  this.points = (points ? points : []);
  // log
}

Stroke.prototype.constructor = Stroke;

Stroke.prototype.copy = function() {
  var stroke = new Stroke();
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    stroke.points.push(point.copy());
  }
  return stroke;
}


// McMaster Smoothing Algorithm

Stroke.smooth = function(points) {
	var nL = [];
	var len = points.length;
	if (len < 5) { return points };
	var j, avX, avY;
	var i = len;
	while (i--) {
		if (i == len - 1 || i == len - 2 || i == 1 || i == 0) {
			// nL[i] = { x: points[i].x, y: points[i].y };
      nL[i] = new Point(points[i].x, points[i].y);
		} else {
			j = 5;
			avX = 0; avY = 0;
			while (j--) {
				avX += points[i + 2 - j].x;
        avY += points[i + 2 - j].y;
			}
			avX = avX / 5;
      avY = avY / 5;
			// nL[i] = nL[i] = { x: (points[i].x + avX) / 2, y: (points[i].y + avY) / 2 };
      nL[i] = nL[i] = new Point((points[i].x + avX) / 2, (points[i].y + avY) / 2);
		}
	}
	return nL;
}


module.exports = Stroke;

