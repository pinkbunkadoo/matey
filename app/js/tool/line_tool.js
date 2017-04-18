const Point = require('../geom/point.js');
const Vector = require('../geom/vector.js');
const Stroke = require('../stroke.js');
const Tool = require('./tool.js');
const Smooth = require('../lib/smooth.js');

function LineTool() {
  Tool.call(this, 'line');
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
  // var p = new Point(x, y);
  // var x = p.x, y = p.y;
  x = Math.round(x), y = Math.round(y);
  // console.log(p.toString());
  this.points.push(new Point(x, y));
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

  if (this.points.length > 1) {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i];
      // var x = p.x, y = p.y;
      p = app.screenToWorld(p.x, p.y);
      var x = Math.round(p.x), y = Math.round(p.y);

      this.points[i] = new Point(x, y);
    }
    var stroke = new Stroke(this.points);
    app.addStroke(stroke);
  }

  this.drawing = false;
  this.points = [];

  // app.clearOverlay();
  app.requestDraw();
}

LineTool.prototype.draw = function(ctx) {
  // app.clearOverlay();

  // var ctx = app.overlay.getContext('2d');
  // ctx.save();

  // ctx.translate(0.5, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  if (this.points.length) {
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = COLOR_STROKE;

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

      if (this.points.length == 2)
        ctx.closePath();

      ctx.stroke();
    }

    var mx = this.mx, my = this.my;
    p = this.points[this.points.length - 1];

    ctx.strokeStyle = 'lightgray';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(mx, my);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // ctx.restore();

  // app.requestDraw();
}

LineTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
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

    // this.draw();
    app.requestDraw();
  }
}

LineTool.prototype.onMouseOut = function(event) {}

LineTool.prototype.onMouseOver = function(event) {}

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
  if (event.key === 'Escape') {
    this.endStroke();
  }
}


module.exports = LineTool;
