const Point = require('../geom/point.js');
const Stroke = require('../stroke.js');
const Tool = require('./tool.js');
const Smooth = require('../lib/smooth.js');

function KnifeTool() {
  Tool.call(this, 'knife');
  this.points = [];
  this.intersections = [];
}

KnifeTool.prototype = Object.create(Tool.prototype);
KnifeTool.prototype.constructor = KnifeTool;

KnifeTool.prototype.focus = function() {
  this.points = [];
  this.intersections = [];
  this.drawing = false;
}

KnifeTool.prototype.blur = function() {
  this.endStroke();
}

KnifeTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.points = [];
  this.intersections = [];
  this.opacity = 1.0;
}

KnifeTool.prototype.getIntersections = function() {
  var intersections = [];
  for (var i = 1; i < this.points.length; i++) {
    var p1 = this.points[i - 1];
    var p2 = this.points[i];

    p1 = app.screenToWorld(p1.x, p1.y);
    p2 = app.screenToWorld(p2.x, p2.y);

    for (var j = 0; j < app.frame.strokes.length; j++) {
      var stroke = app.frame.strokes[j];
      for (var k = 1; k < stroke.points.length; k++) {
        var p3 = stroke.points[k - 1];
        var p4 = stroke.points[k];
        var int = util.intersect(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        if (int && int.seg1 && int.seg2) {
          intersections.push(int);
          break;
        }
      }
    }
  }
  return intersections;
}

KnifeTool.prototype.endStroke = function() {
  this.points.push(new Point(app.mouseX, app.mouseY));
  if (this.points.length > 2) {

    this.intersections = this.getIntersections();

    function opacityTimer() {
      this.opacity = this.opacity - 0.1;
      this.opacity = ((this.opacity * 10) >> 0) / 10;
      if (this.opacity < 0) {
        clearInterval(this.opacityTimerId);
        this.opacity = 0;
      }
      app.requestDraw();
      // console.log('timer', this.opacity);
    }
    this.opacityTimerId = setInterval(opacityTimer.bind(this), 1000/30);

  }
  this.points = [];
  this.drawing = false;
  app.requestDraw();
}

KnifeTool.prototype.draw = function(ctx) {

  if (this.points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (var i = 1; i < this.points.length; i++) {
      var p = this.points[i];
      ctx.lineTo(p.x, p.y);
    }

    // ctx.lineTo(app.mouseX, app.mouseY);
    // ctx.globalAlpha = this.opacity;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'skyblue';
    ctx.stroke();
    // ctx.globalAlpha = 1;
  }

  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'red';

  ctx.globalAlpha = this.opacity;

  for (var i = 0; i < this.intersections.length; i++) {
    var int = this.intersections[i];

    if (int) {
      var p = app.worldToScreen(int.x, int.y);
      x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
      ctx.beginPath();
      ctx.rect(x - 1, y - 1, 2, 2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
}

KnifeTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    var p = new Point(event.clientX, event.clientY)
    this.points.push(p);

    Smooth.simple(this.points);

    this.intersections = this.getIntersections();

    app.requestDraw();
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
