
var Path = function() {
  this.segments = [];
}

Path.prototype.constructor = Path;

Path.prototype = {
  addSegment: function(segment) {
    this.segments.push(segment);
  },
  copy: function() {
    var path = new Path();
    for (var i = 0; i < this.segments.length; i++) {
      path.addSegment(this.segments[i].copy());
    }
    return path;
  }
}

// McMaster Smoothing Algorithm

Path.smooth = function(points) {
	var nL = [];
	var len = points.length;
	if (len < 5) { return points };
	var j, avX, avY;
	var i = len;
	while (i--) {
		if (i == len - 1 || i == len - 2 || i == 1 || i == 0) {
			nL[i] = { x: points[i].x, y: points[i].y };
		} else {
			j = 5;
			avX = 0; avY = 0;
			while (j--) {
				avX += points[i + 2 - j].x;
        avY += points[i + 2 - j].y;
			}
			avX = avX / 5;
      avY = avY / 5;
			nL[i] = nL[i] = { x: (points[i].x + avX) / 2, y: (points[i].y + avY) / 2 };
		}
	}
	return nL;
}

