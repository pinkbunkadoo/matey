
var Point = require('../base/point.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');

var Smooth = require('../lib/smooth.js');
var simplify = require('../lib/simplify.js');


function KnifeTool() {
  Tool.call(this, 'knife');
  this.points = [];
  this.intersections = [];
  // this.snapshot = document.createElement('canvas');
}

KnifeTool.prototype = Object.create(Tool.prototype);
KnifeTool.prototype.constructor = KnifeTool;

KnifeTool.prototype.focus = function() {
}

KnifeTool.prototype.blur = function() {
  this.endStroke();
}

KnifeTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.points = [];
  // this.points.push(new Point(app.mouseX, app.mouseY));
  // this.snapshot.width = app.canvas.width;
  // this.snapshot.height = app.canvas.height;

  // var ctx = this.snapshot.getContext('2d');
  // ctx.drawImage(app.canvas, 0, 0);
}

KnifeTool.prototype.endStroke = function() {
  this.points.push(new Point(app.mouseX, app.mouseY));
  if (this.points.length > 2) {
    this.points = simplify(this.points, 0.5);

    for (var i = 0; i < this.points.length; i++) {
      this.points[i] = app.screenToWorld(this.points[i].x, this.points[i].y);
    }

    // var stroke = new Stroke(this.points);
    // app.addStroke(stroke);
  }
  this.intersections = [];
  this.points = [];
  this.drawing = false;
  app.clearOverlay();
}

KnifeTool.prototype.draw = function() {

  app.clearOverlay();
  var ctx = app.overlay.getContext('2d');
  // ctx.clearRect(0, 0, app.overlay.width, app.overlay.height);

  if (this.points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (var i = 1; i < this.points.length; i++) {
      var p = this.points[i];
      ctx.lineTo(p.x, p.y);
    }

    ctx.lineTo(app.mouseX, app.mouseY);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'skyblue';
    ctx.stroke();

    ctx.fillStyle = 'red';

    // if (this.intersections.length > 0) {
    //   for (var i = 0; i < this.intersections.length; i++) {
    //     var int = this.intersections[i];
    //     ctx.fillRect(int.x-2, int.y-2, 4, 4);
    //   }
    // }

    for (var i = 0; i < this.intersections.length; i++) {
      var int = this.intersections[i];

      if (int) {
        var p = app.worldToScreen(int.x, int.y);
        ctx.fillRect(p.x-2, p.y-2, 4, 4);
      }
    }
  }
  app.requestDraw();
}

KnifeTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    var p = new Point(event.clientX, event.clientY)
    this.points.push(p);

    Smooth.exp(this.points);

    if (this.points.length > 2) {
      // this.intersections = app.getIntersections(this.points);
      var p1 = this.points[this.points.length - 2];
      var p2 = this.points[this.points.length - 1];

      p1 = app.screenToWorld(p1.x, p1.y);
      p2 = app.screenToWorld(p2.x, p2.y);

      for (var i = 0; i < app.frame.strokes.length; i++) {
        var stroke = app.frame.strokes[i];
        for (var j = 1; j < stroke.points.length; j++) {
          var p3 = stroke.points[j-1];
          var p4 = stroke.points[j];
          var int = util.intersect(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
          if (int) {
            if (int.seg1 && int.seg2) {
              this.intersections.push(int);
              break;
            }
          }
        }
      }
    }

    this.draw();
  }
}

KnifeTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    this.beginStroke();
  }
}

KnifeTool.prototype.onMouseUp = function(event) {
  this.endStroke();
}


module.exports = KnifeTool;
