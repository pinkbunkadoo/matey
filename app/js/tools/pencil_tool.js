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

PencilTool.prototype.addPoint = function(x, y) {
  // this.points.push(new Point(x + 0.5, y + 0.5));
  this.points.push(new Point(x, y));
}

PencilTool.prototype.beginStroke = function() {
  this.drawing = true;
  // this.points.push(new Point(app.mouseX + 0.5, app.mouseY + 0.5));
  this.addPoint(app.mouseX, app.mouseY);
}

PencilTool.prototype.endStroke = function() {
  if (this.points.length > 2) {

    // console.log(this.points.length, this.points[0].toString(), this.points[this.points.length-1].toString());

    // this.points = Smooth.mcmaster(this.points);
    this.points = simplify(this.points, 0.5, true);

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
  // ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  if (this.points.length >= 1) {
    ctx.beginPath();
    var p = this.points[0];
    var x = p.x, y = p.y;
    // var x = (p.x >> 0), y = (p.y >> 0);

    // var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
    // var x = p.x + 0.5, y = p.y + 0.5;
    // var x = (p.x >> 0), y = (p.y >> 0);
    // x = Math.round(p.x)+0.5, y = Math.round(p.y)+0.5;

    ctx.moveTo(x, y);
    // var y = this.points[0].y;

    for (var i = 1; i < this.points.length; i++) {
      var p = this.points[i];
      var x = p.x, y = p.y;
      // var x = (p.x >> 0), y = (p.y >> 0);

      // var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
      // var x = p.x + 0.5, y = p.y + 0.5;
      // x = Math.round(p.x)+0.5, y = Math.round(p.y)+0.5;


      ctx.lineTo(x, y);
    }

    // ctx.closePath();
    // ctx.lineTo(app.mouseX, app.mouseY);

    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = 'gray';
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'blue';
    var text = '' + y;
    text = text.substring(0, text.indexOf('.') + 2);
    text = text + ' ' + this.points.length;
    ctx.fillText(text, 100, 100);
  }

  app.requestDraw();
}

PencilTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    // var y = event.clientY;
    // if (event.shiftKey) {
    //   y = this.points[0].y;
    // }
    // var p = new Point(event.clientX, y);
    // this.points.push(p);
    this.addPoint(app.mouseX, app.mouseY);

    Smooth.simple(this.points);
    // this.points = simplify(this.points, 0.5);

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
  // var y = event.clientY;
  // if (event.shiftKey) {
  //   y = this.points[0].y;
  // }
  // this.points.push(new Point(event.clientX, y));
  this.addPoint(app.mouseX, app.mouseY);
  this.endStroke();
}


PencilTool.prototype.onKeyDown = function(event) {
  if (event.key === 'u') {
    // app.requestDraw();
    // this.draw();
    // for (var i = 0; i < this.points.length; i++) {

    // }
    // console.log(this.points.toString());
  }
}


module.exports = PencilTool;
