// var app = require('../app.js');
var simplify = require('../lib/simplify.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');
var Tracer = require('../base/tracer.js');

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
  this.snapshot.width = app.canvas.width;
  this.snapshot.height = app.canvas.height;
  // var ctx = this.snapshot.getContext('2d');
  // ctx.drawImage(app.canvas, 0, 0);
}

EraserTool.prototype.endStroke = function() {
  app.requestDraw();
}


EraserTool.prototype.draw = function() {
  var ctx = this.snapshot.getContext('2d');
  var image = app.images[BRUSH_16];
  ctx.drawImage(image, app.mouseX - image.width/2, app.mouseY - image.height/2);
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
