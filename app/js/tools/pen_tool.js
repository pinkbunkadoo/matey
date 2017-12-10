const Const = require('../const');
const Util = require('../util');
const Point = require('../geom/point');
const Stroke = require('../stroke');
const Smooth = require('../lib/smooth');
const Tool = require('./tool');

function PenTool() {
  Tool.call(this, 'pen');
  this.cursor = 'pencil';
  this.points = [];
}

PenTool.prototype = Object.create(Tool.prototype);
PenTool.prototype.constructor = PenTool;

PenTool.prototype.focus = function() {
}

PenTool.prototype.blur = function() {
  this.endStroke();
}

PenTool.prototype.addPoint = function(x, y) {
  this.points.push(new Point(x, y));
}

PenTool.prototype.beginStroke = function() {
  this.drawing = true;
  var mx = event.clientX - app.paper.el.offsetLeft;
  var my = event.clientY - app.paper.el.offsetTop;
  this.addPoint(mx, my);
}

PenTool.prototype.endStroke = function() {
  this.drawing = false;

  if (this.points.length > 2) {
    // this.points = Smooth.mcmaster(this.points);
    // var before = this.points.length;
    this.points = simplify(this.points, 0.5);
    // var after = this.points.length;

    // console.log(before, after, Math.round(after / before * 100) + '%');
    // app.updateFrameListIcon(app.sequence.position);
    // app.sequence.addAction(new PenAction());

    // console.log('end');

    this.emit('stroke', { points: this.points });
  }

  this.points = [];
  this.emit('change');

  // app.clearOverlay();

  // this.emitter.emit('render', { points: this.points });
  // app.requestDraw();
}

PenTool.prototype.render = function() {

  if (this.drawing) app.paper.renderPath(this.points, { screen: true });

//   app.clearOverlay();
//   var ctx = app.getOverlayContext();
//
//   ctx.lineCap = 'round';
//   ctx.lineJoin = 'round';
//
//   if (this.points.length && this.drawing) {
//
//     // ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
//
//     ctx.beginPath();
//     var p = this.points[0];
//     var x = p.x, y = p.y;
//     // x = Math.round(x), y = Math.round(y);
//
//     ctx.moveTo(x, y);
//
//     for (var i = 1; i < this.points.length; i++) {
//       var p = this.points[i];
//       var x = p.x, y = p.y;
//       ctx.lineTo(x, y);
//     }
//
//     // ctx.lineWidth = Const.LINE_WIDTH;
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = Const.color.STROKE;
//     ctx.stroke();
//
//     // ctx.font = '12px sans-serif';
//     // ctx.fillStyle = 'blue';
//     // var text = '' + y;
//     // text = text.substring(0, text.indexOf('.') + 2);
//     // text = text + ' ' + this.points.length;
//     // ctx.fillText(text, 100, 100);
// //
//     // ctx.setTransform(1, 0, 0, 1, 0, 0);
//   }
}

PenTool.prototype.onMouseMove = function(event) {

  var mx = event.clientX - app.paper.el.offsetLeft;
  var my = event.clientY - app.paper.el.offsetTop;

  // console.log(mx, my);

  if (this.drawing) {

    // this.addPoint(app.mouseX, app.mouseY);
    this.addPoint(mx, my);

    // Smooth.exp(this.points);
    Smooth.simple(this.points);

    // this.render();
    // app.requestDraw();
    // console.log('change');
    this.emit('change');
    // this.render();
  }
}

PenTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    this.beginStroke();
    // console.log('beginstroke');
  }
}

PenTool.prototype.onMouseUp = function(event) {
  var mx = event.clientX - app.paper.el.offsetLeft;
  var my = event.clientY - app.paper.el.offsetTop;
  this.addPoint(mx, my);
  this.endStroke();
}

PenTool.prototype.onKeyDown = function(event) {
  if (event.key === 'u') {
  }
}

PenTool.prototype.handleEvent = function(event) {
  if (event.type === 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type === 'mousemove') {
    this.onMouseMove(event);
  }
  else if (event.type === 'mouseup') {
    this.onMouseUp(event);
  }
}


module.exports = PenTool;
