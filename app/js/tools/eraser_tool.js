// var app = require('../app.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');
var Tracer = require('../base/tracer.js');
var simplify = require('../lib/simplify.js');
var Smooth = require('../lib/smooth.js');

// console.log(tools);
var BRUSH_8 = 'images/brush_8x8.png';
var BRUSH_16 = 'images/brush_16x16.png';

function EraserTool() {
  Tool.call(this, 'eraser');
  this.snapshot = document.createElement('canvas');
}

EraserTool.prototype = Object.create(Tool.prototype);
EraserTool.prototype.constructor = EraserTool;


EraserTool.prototype.focus = function() {
  // console.log(app.images[BRUSH_16]);
}


EraserTool.prototype.blur = function() {
  this.endStroke();
}

EraserTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.snapshot.width = app.canvas.width;
  this.snapshot.height = app.canvas.height;
  // var ctx = this.snapshot.getContext('2d');
  // ctx.drawImage(app.canvas, 0, 0);
}

EraserTool.prototype.endStroke = function() {
  if (this.drawing) {
    var ctx = this.snapshot.getContext('2d');
    var imageData = ctx.getImageData(0, 0, this.snapshot.width, this.snapshot.height);
    var paths = Tracer.trace(imageData.data, this.snapshot.width, this.snapshot.height);
    // console.log(paths);
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var points = [];
      if (path.isClockwise()) {
        for (var j = 0; j < path.points.length; j++) {
          var p = path.points[j];
          var p2 = app.screenToWorld(p.x, p.y);
          points.push(p2);
        }
      } else {
        for (var j = path.points.length - 1; j >= 0; j--) {
          var p = path.points[j];
          var p2 = app.screenToWorld(p.x, p.y);
          points.push(p2);
        }
      }
      points = Smooth.smooth(points);
      // points = Smooth.smooth(points);
      points = simplify(points, 1);
      app.addStroke(new Stroke(points));
    }

    app.requestDraw();
    this.drawing = false;
  }
}


EraserTool.prototype.draw = function() {
  var ctx = this.snapshot.getContext('2d');

  var d = util.distance(app.previousMouseX, app.previousMouseY, app.mouseX, app.mouseY);

  ctx.fillStyle = 'blue';

  var px = (app.mouseX + app.previousMouseX) / 2;
  var py = (app.mouseY + app.previousMouseY) / 2;

  // while (d > 1) {
    // ctx.beginPath();
    // ctx.arc(px, py, 4, 0, Math.PI*2);
    // ctx.fill();
  //   px = (app.mouseX + px) / 2;
  //   py = (app.mouseY + py) / 2;
  //
  //   d = util.distance(px, py, app.mouseX, app.mouseY);
  // }
  var image = app.images[BRUSH_16];
  ctx.drawImage(image, px - image.width / 2, py - image.height / 2);


  // ctx.fillStyle = 'black';
  // ctx.beginPath();
  // ctx.arc(app.mouseX, app.mouseY, 4, 0, Math.PI*2);
  // ctx.fill();



  var image = app.images[BRUSH_16];
  ctx.drawImage(image, app.mouseX - image.width / 2, app.mouseY - image.height / 2);

  ctx = app.getContext();
  ctx.drawImage(this.snapshot, 0, 0);
}

EraserTool.prototype.onMouseMove = function(event) {
  if (event.buttons === 1) {
    this.draw();
  }
}

EraserTool.prototype.onMouseOut = function(event) {}

EraserTool.prototype.onMouseOver = function(event) {}

EraserTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    this.beginStroke();
  }
}

EraserTool.prototype.onMouseUp = function(event) {
  this.endStroke();
}


module.exports = EraserTool;
