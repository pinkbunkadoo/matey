// var app = require('../../app.js');
var simplify = require('../lib/simplify.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');
var Point = require('../base/point.js');
var Smooth = require('../lib/smooth.js');

function LineTool() {
  Tool.call(this, 'line');
  this.points = [];
}

LineTool.prototype = Object.create(Tool.prototype);
LineTool.prototype.constructor = LineTool;

LineTool.prototype.focus = function() {
}

LineTool.prototype.blur = function() {
  this.endStroke();
}

LineTool.prototype.addPoint = function(x, y) {
  var p = new Point(x, y);
  // console.log(p.toString());
  this.points.push(p);
}

LineTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.addPoint(app.mouseX, app.mouseY);
}

LineTool.prototype.endStroke = function() {

  // if (this.points.length == 2) {
  //   var p = this.points[this.points.length-1];
  //   this.addPoint(p.x+0.1, p.y);
  // }

  for (var i = 0; i < this.points.length; i++) {
    this.points[i] = app.screenToWorld(this.points[i].x, this.points[i].y);
  }

  var stroke = new Stroke(this.points);
  app.addStroke(stroke);
  this.drawing = false;
  this.points = [];
  app.clearOverlay();
}

LineTool.prototype.draw = function() {
  app.clearOverlay();

  var ctx = app.overlay.getContext('2d');
  ctx.save();

  // ctx.translate(0.5, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  if (this.points.length) {
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = 'gray';

    if (this.points.length > 1) {
      var p = this.points[0];

      ctx.beginPath();

      // ctx.moveTo(p.x, p.y);
      // ctx.lineTo(this.points[1].x, this.points[1].y);
      // ctx.stroke();

      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        // x = Math.round(p.x)+0.5, y = Math.round(p.y)+0.5;
        x = p.x, y = p.y;
        if (i == 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
      }

      // if (this.points.length == 2)
      //   ctx.closePath();

      ctx.stroke();
    }
    p = this.points[this.points.length - 1];
    ctx.strokeStyle = 'skyblue';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(app.mouseX, app.mouseY);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.restore();

  app.requestDraw();
}

LineTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    // var y = event.clientY;
    // if (event.shiftKey) {
    //   y = this.points[0].y;
    // }

    // var p = new Point(app.mouseX, app.mouseY);
    // this.points.push(p);

    // Smooth.simple(this.points);

    this.draw();
  }
}

LineTool.prototype.onMouseOut = function(event) {}

LineTool.prototype.onMouseOver = function(event) {}

LineTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    if (this.points.length == 0) {
      this.beginStroke();
    } else {
      this.addPoint(app.mouseX, app.mouseY);
    }
  } else {
    this.endStroke();
  }
}

LineTool.prototype.onMouseUp = function(event) {
  // this.points.push(new Point(app.mouseX, app.mouseY));

    // this.endStroke();
}


LineTool.prototype.onKeyDown = function(event) {
  if (event.key === 'Escape') {
    this.endStroke();
  }
}


module.exports = LineTool;
