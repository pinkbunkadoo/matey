
var Point = require('../base/point.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');

var Smooth = require('../lib/smooth.js');
var simplify = require('../lib/simplify.js');


function KnifeTool() {
  Tool.call(this, 'knife');
  this.points = [];
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
  this.points.push(new Point(event.clientX, event.clientY));
  // this.snapshot.width = app.canvas.width;
  // this.snapshot.height = app.canvas.height;

  // var ctx = this.snapshot.getContext('2d');
  // ctx.drawImage(app.canvas, 0, 0);
}

KnifeTool.prototype.endStroke = function() {
  if (this.points.length > 2) {
    this.points = simplify(this.points, 0.5);

    for (var i = 0; i < this.points.length; i++) {
      this.points[i] = app.screenToWorld(this.points[i].x, this.points[i].y);
    }

    // var stroke = new Stroke(this.points);
    // app.addStroke(stroke);
  }
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
  }
  app.requestDraw();
}

KnifeTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    var p = new Point(event.clientX, event.clientY)
    this.points.push(p);

    Smooth.exp(this.points);
    this.draw();
  }
}

KnifeTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    this.beginStroke();
  }
}

KnifeTool.prototype.onMouseUp = function(event) {
  this.points.push(new Point(event.clientX, event.clientY));
  this.endStroke();
}


module.exports = KnifeTool;
