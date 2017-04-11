// var app = require('../../app.js');
var simplify = require('../lib/simplify.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');
var Point = require('../base/point.js');
var Smooth = require('../lib/smooth.js');

// console.log(app);

function PencilTool() {
  Tool.call(this, 'pencil');
  this.points = [];
  // this.snapshot = document.createElement('canvas');
}

PencilTool.prototype = Object.create(Tool.prototype);
PencilTool.prototype.constructor = PencilTool;

PencilTool.prototype.focus = function() {
}

PencilTool.prototype.blur = function() {
  this.endStroke();
}

PencilTool.prototype.beginStroke = function() {
  this.drawing = true;
  // this.points.push(new Point(event.clientX, event.clientY));
}

PencilTool.prototype.endStroke = function() {
  if (this.points.length > 2) {

    // this.points = Smooth.mcmaster(this.points);
    this.points = simplify(this.points, 0.5);

    // console.log(this.points.length);

    for (var i = 0; i < this.points.length; i++) {
      this.points[i] = app.screenToWorld(this.points[i].x, this.points[i].y);
    }

    var stroke = new Stroke(this.points);
    app.addStroke(stroke);
  }
  this.points = [];
  this.drawing = false;
  app.clearOverlay();
}

PencilTool.prototype.draw = function() {
  app.clearOverlay();
  var ctx = app.overlay.getContext('2d');
  // ctx.clearRect(0, 0, app.overlay.width, app.overlay.height);

  if (this.points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (var i = 1; i < this.points.length; i++) {
      var p = this.points[i];
      ctx.lineTo((p.x), (p.y));
    }

    ctx.lineTo(app.mouseX, app.mouseY);

    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  }
  app.requestDraw();
}

PencilTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    var p = new Point(event.clientX, event.clientY)
    this.points.push(p);

    Smooth.exp(this.points);
    // Smooth.simple(this.points);
    this.draw();
  }
}

PencilTool.prototype.onMouseOut = function(event) {}

PencilTool.prototype.onMouseOver = function(event) {}

PencilTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    this.beginStroke();
  }
}

PencilTool.prototype.onMouseUp = function(event) {
  this.points.push(new Point(event.clientX, event.clientY));
  this.endStroke();
}


module.exports = PencilTool;
