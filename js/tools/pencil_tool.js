// var app = require('../app.js');
var simplify = require('../lib/simplify.js');
var Tool = require('./tool.js');
var Stroke = require('../base/stroke.js');

// console.log(tools);

function PencilTool() {
  Tool.call(this, 'pencil');
  this.points = [];
}

PencilTool.prototype = Object.create(Tool.prototype);
PencilTool.prototype.constructor = PencilTool;

PencilTool.prototype.draw = function(ctx) {
  if (this.points) {
    app.createPath(ctx, this.points);
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  }
}

PencilTool.prototype.onMouseMove = function(event) {
  if (this.down) {
    // console.log('draw');
    var p = app.screenToWorld(app.mouseX, app.mouseY);
    this.points.push(p);
  }
}

PencilTool.prototype.onMouseOut = function(event) {}

PencilTool.prototype.onMouseOver = function(event) {}

PencilTool.prototype.onMouseDown = function(event) {
  // console.log('pencil down', event.button);
  if (event.button == 0) {
    this.down = true;
    this.points = [ app.screenToWorld(app.startX, app.startY) ];
  }
}

PencilTool.prototype.onMouseUp = function(event) {
  this.down = false;
  // console.log(this.points);
  if (this.points.length > 2) {
    this.points = Stroke.smooth(this.points);
    this.points = simplify(this.points, 0.5/app.scale);
    var stroke = new Stroke(this.points);
    app.addStroke(stroke);
    // console.log(stroke);
  }
  this.points = [];
}


module.exports = PencilTool;
