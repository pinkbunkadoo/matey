const Point = require('../geom/point.js');

function Smooth() {
}

Smooth.AVERAGE = 5;

// McMaster Smoothing Algorithm

Smooth.mcmaster = function(points) {
	var nL = [];
	var len = points.length;
  // var avg = 5;
	if (len < Smooth.AVERAGE) { return points };
	var j, avX, avY;
	var i = len;
	while (i--) {
		if (i == len - 1 || i == len - 2 || i == 1 || i == 0) {
			// nL[i] = { x: points[i].x, y: points[i].y };
      nL[i] = new Point(points[i].x, points[i].y);
		} else {
			j = Smooth.AVERAGE;
			avX = 0; avY = 0;
			while (j--) {
				avX += points[i + 2 - j].x;
        avY += points[i + 2 - j].y;
			}
			avX = avX / Smooth.AVERAGE;
      avY = avY / Smooth.AVERAGE;
			// nL[i] = nL[i] = { x: (points[i].x + avX) / 2, y: (points[i].y + avY) / 2 };
      nL[i] = nL[i] = new Point((points[i].x + avX) / 2, (points[i].y + avY) / 2);
		}
	}
	return nL;
}

//http://jsfiddle.net/xup4T/

Smooth.LIMIT = 4; // original value 4

Smooth.exp = function (ps, f) {
	if (ps.length > Smooth.LIMIT) {
		var a = (f == undefined ? 0.2 : f); // original value 0.2
	  var p = ps[ps.length - 1];
	  var p1 = ps[ps.length - 2];
	  ps[ps.length - 1] = new Point(
	      p.x * a + p1.x * (1 - a),
	      p.y * a + p1.y * (1 - a)
	    );
	}
}

Smooth.simple = function (ps) {
	if (ps.length > Smooth.LIMIT) {
		var a = 0.4; // original value 0.2
	  for (var i = 0; i < Smooth.LIMIT; ++i) {
	    var j = ps.length - i - 2;
	    var p0 = ps[j];
	    var p1 = ps[j + 1];
	    var p = new Point(
	        p0.x * (1 - a) + p1.x * a,
	        p0.y * (1 - a) + p1.y * a
	      );
	    ps[j] = p;
	  }
	}
}


module.exports = Smooth;
