// var app = require('../app.js');
var simplify = require('../lib/simplify.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');

// console.log(tools);

function PencilTool() {
  Tool.call(this, 'pencil');
  this.points = [];
  this.snapshot = document.createElement('canvas');
}

PencilTool.prototype = Object.create(Tool.prototype);
PencilTool.prototype.constructor = PencilTool;


PencilTool.prototype.focus = function() {
}


PencilTool.prototype.blur = function() {
  this.endStroke();
}


PencilTool.prototype.endStroke = function() {
  if (this.points.length > 2) {
    // this.points = PencilTool.mcsmooth(this.points);b
    this.points = simplify(this.points, 0.5);

    for (var i = 0; i < this.points.length; i++) {
      this.points[i] = app.screenToWorld(this.points[i].x, this.points[i].y);
    }

    var stroke = new Stroke(this.points);
    app.addStroke(stroke);
    // console.log(stroke);
  }
  this.points = [];
  this.drawing = false;
}


PencilTool.prototype.draw = function() {
  var ctx = app.getContext();

  ctx.drawImage(this.snapshot, 0, 0);

  // ctx.stroke();
  var points = this.points;
  var p0 = points[0];
  // ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  for (var i = 1; i < points.length; ++i) {
      var p = points[i];
      ctx.lineTo(p.x, p.y);
  }

  // ctx.lineTo(app.mouseX, app.mouseY);

  // ctx.lineWidth = 6;
  // ctx.strokeStyle = 'white';
  // ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'gray';
  ctx.stroke();

  // var ctx = app.getContext();
  // ctx.drawImage(this.canvas, 0, 0);
}

//http://jsfiddle.net/xup4T/

PencilTool.smoothLength = 2;

PencilTool.expsmooth = function (ps) {
  // console.log('exp');
  var a = 0.4;
  var p = ps[ps.length - 1];
  var p1 = ps[ps.length - 2];
  ps[ps.length - 1] = new Point(
      p.x * a + p1.x * (1 - a),
      p.y * a + p1.y * (1 - a)
    );
}


PencilTool.smooth = function (ps) {
  for (var i = 0; i < PencilTool.smoothLength; ++i) {
    var j = ps.length - i - 2;
    var p0 = ps[j];
    var p1 = ps[j + 1];
    var a = 0.2;
    var p = new Point(
        p0.x * (1 - a) + p1.x * a,
        p0.y * (1 - a) + p1.y * a
      );
    ps[j] = p;
  }
}


// McMaster Smoothing Algorithm

PencilTool.mcsmooth = function(points) {
	var nL = [];
	var len = points.length;
  var avg = 5;
	if (len < avg) { return points };
	var j, avX, avY;
	var i = len;
	while (i--) {
		if (i == len - 1 || i == len - 2 || i == 1 || i == 0) {
			// nL[i] = { x: points[i].x, y: points[i].y };
      nL[i] = new Point(points[i].x, points[i].y);
		} else {
			j = avg;
			avX = 0; avY = 0;
			while (j--) {
				avX += points[i + 2 - j].x;
        avY += points[i + 2 - j].y;
			}
			avX = avX / avg;
      avY = avY / avg;
			// nL[i] = nL[i] = { x: (points[i].x + avX) / 2, y: (points[i].y + avY) / 2 };
      nL[i] = nL[i] = new Point((points[i].x + avX) / 2, (points[i].y + avY) / 2);
		}
	}
	return nL;
}


PencilTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    // var p = new Point((event.clientX >> 0) + 0.5, (event.clientY >> 0) + 0.5);
    var p = new Point(event.clientX, event.clientY)
    this.points.push(p);

    if (this.points.length > PencilTool.smoothLength) {
      PencilTool.expsmooth(this.points);
      // this.points.push(new Point(event.clientX, event.clientY));
      this.draw();
    }

  }
}

PencilTool.prototype.onMouseOut = function(event) {}

PencilTool.prototype.onMouseOver = function(event) {}

PencilTool.prototype.onMouseDown = function(event) {
  // console.log('pencil down', event.button);
  if (event.button == 0) {
    this.drawing = true;
    // this.down = true;
    // this.points = [ app.screenToWorld(app.startX, app.startY) ];
    this.points.push(new Point(event.clientX, event.clientY));
    // this.canvas = document.createElement('canvas');
    this.snapshot.width = app.canvas.width;
    this.snapshot.height = app.canvas.height;

    var ctx = this.snapshot.getContext('2d');
    ctx.drawImage(app.canvas, 0, 0);
  }
}

PencilTool.prototype.onMouseUp = function(event) {
  // this.down = false;
  this.points.push(new Point(event.clientX, event.clientY));
  this.endStroke();
}


module.exports = PencilTool;
