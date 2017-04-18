
const Point = require('../geom/point.js');
const Stroke = require('../stroke.js');
const PencilAction = require('../action/pencil_action.js');
const Smooth = require('../lib/smooth.js');
const Tool = require('./tool.js');

function PencilTool() {
  Tool.call(this, 'pencil');
  this.points = [];
}

PencilTool.prototype = Object.create(Tool.prototype);
PencilTool.prototype.constructor = PencilTool;

PencilTool.prototype.focus = function() {
}

PencilTool.prototype.blur = function() {
  this.endStroke();
}

// PencilTool.prototype.undo = function(action) {
//   if (action instanceof PencilAction) {
//   console.log(action.stroke);
// }

PencilTool.prototype.addPoint = function(x, y) {
  this.points.push(new Point(x, y));
}

PencilTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.addPoint(app.mouseX, app.mouseY);
}

PencilTool.prototype.endStroke = function() {
  if (this.points.length > 2) {

    // this.points = Smooth.mcmaster(this.points);
    this.points = simplify(this.points, 0.5);

    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i];
      var x = p.x, y = p.y;
      this.points[i] = app.screenToWorld(x, y);
    }

    var stroke = new Stroke(this.points);
    app.addStroke(stroke);

    var action = new PencilAction(app.frame.strokes);
    app.createUndo(action);
  }

  this.points = [];
  this.drawing = false;

  app.requestDraw();
}

PencilTool.prototype.draw = function(ctx) {
  // app.clearOverlay();
  // var ctx = app.overlay.getContext('2d');
  // ctx.clearRect(0, 0, app.overlay.width, app.overlay.height);
  // ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  if (this.points.length >= 1) {
    ctx.beginPath();
    var p = this.points[0];
    var x = p.x, y = p.y;
    // x = Math.round(x), y = Math.round(y);

    ctx.moveTo(x, y);

    for (var i = 1; i < this.points.length; i++) {
      var p = this.points[i];
      var x = p.x, y = p.y;

      ctx.lineTo(x, y);
    }

    ctx.lineWidth = app.scale < 1 ? 1 : LINE_WIDTH * app.scale;
    ctx.strokeStyle = COLOR_STROKE;
    ctx.stroke();

    // ctx.font = '12px sans-serif';
    // ctx.fillStyle = 'blue';
    // var text = '' + y;
    // text = text.substring(0, text.indexOf('.') + 2);
    // text = text + ' ' + this.points.length;
    // ctx.fillText(text, 100, 100);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);


  // app.requestDraw();
}

PencilTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    this.addPoint(app.mouseX, app.mouseY);

    // Smooth.exp(this.points);
    Smooth.simple(this.points);

    app.requestDraw();
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
