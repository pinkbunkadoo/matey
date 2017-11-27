const Const = require('../const');
const Util = require('../util');
const Point = require('../geom/point');
const Vector = require('../geom/vector');
const Stroke = require('../display/stroke');
const Tool = require('./tool');
const Smooth = require('../lib/smooth');
const LineAction = require('../actions/line_action');

function LineTool() {
  Tool.call(this, 'line');
  this.cursor = 'line';
  this.points = [];
  this.mx = app.mouseX;
  this.my = app.mouseY;
}

LineTool.prototype = Object.create(Tool.prototype);
LineTool.prototype.constructor = LineTool;

LineTool.prototype.focus = function() {
}

LineTool.prototype.blur = function() {
  this.endStroke();
}

LineTool.prototype.addPoint = function(x, y) {
  x = Math.round(x), y = Math.round(y);
  this.points.push(new Point(x, y));
  // console.log(x, y);
}

LineTool.prototype.beginStroke = function() {
  this.drawing = true;
  this.addPoint(app.mouseX, app.mouseY);
}

LineTool.prototype.endStroke = function() {
  if (this.points.length > 1) {
    // app.updateFrameListIcon(app.sequence.position);
    // app.sequence.addAction(new LineAction());
    this.emit('stroke', { points: this.points });
  }

  this.drawing = false;
  this.points = [];

  this.emit('change');
}

LineTool.prototype.render = function() {
  var ctx = app.getOverlayContext();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  if (this.points.length && this.drawing) {
    ctx.lineWidth = Const.LINE_WIDTH;
    ctx.strokeStyle = Const.color.STROKE;

    if (this.points.length > 1) {
      var p = this.points[0];

      ctx.beginPath();

      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        x = p.x, y = p.y;
        if (i == 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
      }

      if (this.points.length == 2) ctx.closePath();

      ctx.stroke();
    }

    var mx = this.mx, my = this.my;
    p = this.points[this.points.length - 1];

    ctx.save();
    // ctx.globalCompositeOperation = 'difference';
    // ctx.lineWidth = 1;
    ctx.lineWidth = Const.LINE_WIDTH;
    ctx.strokeStyle = Const.color.STROKE; //'dodgerblue';
    // ctx.setLineDash([3, 4]);
    
    // ctx.lineDashOffset = Util.distance(p.x, p.y, mx, my);
    // ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x >> 0, p.y >> 0);
    ctx.lineTo(mx >> 0, my >> 0);
    // ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // ctx.setTransform(1, 0, 0, 1, 0, 0);
}

LineTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    // console.log(app.mouseX);
    var mx = app.mouseX;
    var my = app.mouseY;

    if (event.shiftKey) {
      if (this.points.length) {
        var p = this.points[this.points.length - 1];
        var cx = mx - p.x;
        var cy = my - p.y;

        var vx = cx;
        var vy = cy;

        // var r = Math.abs(vy / vx);

        var v = new Vector(cx, cy);
        v.normalize();

        // directions
        var dx = cx / (cx !== 0 ? Math.abs(cx) : 1);
        var dy = cy / (cy !== 0 ? Math.abs(cy) : 1);

        if (v.x < 0.4 && v.x > -0.4) {
          vx = 0;
        } else {
          if (Math.abs(cy) > Math.abs(cx)) {
            vx = Math.abs(cy) * dx;
          }
        }
        if (v.y < 0.4 && v.y > -0.4) {
          vy = 0;
        } else {
          if (Math.abs(cx) > Math.abs(cy)) {
            vy = Math.abs(cx) * dy;
          }
        }

        mx = p.x + vx;
        my = p.y + vy;
      }
    }

    this.mx = mx;
    this.my = my;

    this.render();
    // this.emit('change');
    // this.draw();
    // app.requestDraw();
  }
}

LineTool.prototype.onMouseDown = function(event) {
  if (event.button == 0) {
    if (this.points.length == 0) {
      this.beginStroke();
    } else {
      this.addPoint(this.mx, this.my);
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
  if (event.key === 'Escape' && !event.repeat) {
    this.endStroke();
  }
}

LineTool.prototype.handleEvent = function(event) {
  if (event.type === 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type === 'mousemove') {
    this.onMouseMove(event);
  }
  else if (event.type === 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type === 'keydown') {
    this.onKeyDown(event);
  }
}

module.exports = LineTool;
