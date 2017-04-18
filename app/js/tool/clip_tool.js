const Point = require('../geom/point');
const Rectangle = require('../geom/rectangle');
const Vector = require('../geom/vector');
const Stroke = require('../stroke');
const Fragment = require('../fragment');
const Tool = require('./tool');
const ClipAction = require('../action/clip_action');
const SelectAction = require('../action/select_action');
const Smooth = require('../lib/smooth');

function ClipTool() {
  Tool.call(this, 'clip');
}

ClipTool.prototype = Object.create(Tool.prototype);
ClipTool.prototype.constructor = ClipTool;

ClipTool.prototype.focus = function() {
  this.clear();
  this.dragging = false;
  this.drawing = false;
}

ClipTool.prototype.blur = function() {
}

ClipTool.prototype.clear = function() {
  this.selection = [];
  this.leftovers = [];
  this.moved = false;
  this.picked = null;
}

ClipTool.prototype.moveSelected = function(x, y) {

  if (!this.moved) {
    for (var i = 0; i < this.selection.length; i++) {
      var path = this.selection[i];
      app.removeStroke(path.stroke);
      path.stroke = new Stroke(path.points);
      app.addStroke(path.stroke);
    }

    for (var i = 0; i < this.leftovers.length; i++) {
      var path = this.leftovers[i];
      app.removeStroke(path.stroke);
      path.stroke = new Stroke(path.points);
      app.addStroke(path.stroke);
    }

    var action = new ClipAction(app.frame.strokes);
    app.createUndo(action);

    this.leftovers = [];
  }

  for (var i = 0; i < this.selection.length; i++) {
    var path = this.selection[i];
    for (var j = 0; j < path.points.length; j++) {
      var point = path.points[j];
      point.x = point.x + x;
      point.y = point.y + y;
    }
  }

  this.moved = true;
  app.requestDraw();
}

ClipTool.prototype.deleteSelected = function() {
  if (this.selection.length) {

    for (var i = 0; i < this.selection.length; i++) {
      var path = this.selection[i];
      app.removeStroke(path.stroke);
    }

    for (var i = 0; i < this.leftovers.length; i++) {
      var path = this.leftovers[i];
      app.addStroke(new Stroke(path.points));
    }

    var action = new ClipAction(app.frame.strokes);
    app.createUndo(action);

    this.clear();
    app.requestDraw();
  }
}

ClipTool.prototype.beginSelection = function() {
  this.xmin = Number.POSITIVE_INFINITY;
  this.ymin = Number.POSITIVE_INFINITY;
  this.xmax = Number.NEGATIVE_INFINITY;
  this.ymax = Number.NEGATIVE_INFINITY;
  this.clear();
  this.drawing = true;
  // app.select(null);
}

ClipTool.prototype.endSelection = function() {
  if (this.drawing) {
    var p = app.screenToWorld(this.xmin, this.ymin);
    var region = new Rectangle(p.x, p.y, (this.xmax - this.xmin) / app.scale, (this.ymax - this.ymin) / app.scale);

    app.select(region);
    app.createUndo(new SelectAction({ region: region }));
    // console.log(region);
  }

  this.drawing = false;
  app.requestDraw();
}

ClipTool.prototype.draw = function(ctx) {
  if (this.drawing) {
    ctx.lineWidth = 1;
    ctx.globalCompositionOperation = 'difference';
    ctx.strokeStyle = 'gray';
    ctx.setLineDash([ 2, 4 ]);
    ctx.beginPath();
    ctx.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    ctx.stroke();
  }
}

ClipTool.prototype.getPathBounds = function(points) {
  var minx = Number.POSITIVE_INFINITY;
  var miny = Number.POSITIVE_INFINITY;
  var maxx = Number.NEGATIVE_INFINITY;
  var maxy = Number.NEGATIVE_INFINITY;

  var bounds;

  if (points.length > 0) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      minx = (p.x < minx ? p.x : minx);
      miny = (p.y < miny ? p.y : miny);
      maxx = (p.x > maxx ? p.x : maxx);
      maxy = (p.y > maxy ? p.y : maxy);
    }
    bounds = new Rectangle(minx, miny, maxx - minx, maxy - miny);
  }
  return bounds;
}

ClipTool.prototype.hit = function(points, x, y, radius) {
  var p = new Point(x, y);
  var found = null;

  // for (var i = 0; i < this.frame.strokes.length; i++) {
    // var stroke = this.frame.strokes[i];
    var bounds = this.getPathBounds(points, x, y);
    var xmin = bounds.x - radius;
    var ymin = bounds.y - radius;
    var xmax = bounds.x + bounds.width + radius;
    var ymax = bounds.y + bounds.height + radius;

    if (util.pointInRect(x, y, xmin, ymin, xmax, ymax)) {
      for (var j = 1; j < points.length; j++) {
        var point = points[j];
        if (j > 0) {
          var a = points[j - 1];
          var b = point;
          var c = p;

          var v0 = Vector.subtract(new Vector(b.x, b.y), new Vector(a.x, a.y));
          var v1 = Vector.subtract(new Vector(c.x, c.y), new Vector(a.x, a.y));

          var angle = Vector.angleBetween(v0, v1);
          var adjacent = Vector.dot(v0, v1) / v0.magnitude();
          var opposite = Math.tan(angle) * adjacent;
          var ratio = adjacent / v0.magnitude();

          var v2 = Vector.multiply(v0, ratio);
          var v3 = Vector.subtract(v2, v1);

          if (opposite < radius && adjacent > 0 && adjacent < v0.magnitude()) {
            // selection = { p1: a, p2: b, p3: new Point(a.x + v2.x, a.y + v2.y) };
            found = points;
            break;
          }
        }
      }
    }
    // if (selection) break;
  // }

  return found;
}

ClipTool.prototype.onKeyDown = function(event) {
  var shiftAmount = event.shiftKey ? 10 : 1;
  if ((event.key === 'Delete' || event.key === 'Backspace') && !event.repeat) {
    this.deleteSelected();
  } else if (event.key === 'ArrowUp') {
    this.moveSelected(0, -shiftAmount);
  } else if (event.key === 'ArrowDown') {
    this.moveSelected(0, shiftAmount);
  } else if (event.key === 'ArrowLeft') {
    this.moveSelected(-shiftAmount, 0);
  } else if (event.key === 'ArrowRight') {
    this.moveSelected(shiftAmount, 0);
  }
}

ClipTool.prototype.onMouseMove = function(event) {
  if (this.drawing) {
    if (app.mouseX < app.mouseDownX) {
      this.xmin = app.mouseX;
      this.xmax = app.mouseDownX;
    } else {
      this.xmin = app.mouseDownX;
      this.xmax = app.mouseX;
    }

    if (app.mouseY < app.mouseDownY) {
      this.ymin = app.mouseY;
      this.ymax = app.mouseDownY;
    } else {
      this.ymin = app.mouseDownY;
      this.ymax = app.mouseY;
    }
    app.requestDraw();

  } else if (this.dragging) {
    var dx = app.mouseDeltaX, dy = app.mouseDeltaY;
    app.moveSelected(dx, dy);

  } else {
    if (event.buttons === 1) {
      if (this.picked) {
        this.dragging = true;
      } else  {
        var dx = Math.abs(app.mouseX - app.mouseDownX), dy = Math.abs(app.mouseY - app.mouseDownY);
        if (dx > 2 || dy > 2) this.beginSelection();
      }
    }
  }
}

ClipTool.prototype.onMouseDown = function(event) {
  var p = app.screenToWorld(app.mouseX, app.mouseY);
  var selected;

  for (var i = 0; i < this.selection.length; i++) {
    var path = this.selection[i];
    var result = this.hit(path.points, p.x, p.y, 4 / app.scale);
    if (result) {
      selected = path;
      break;
    }
  }

  if (selected) {
    // var clear = false;
    // if (event.shiftKey) {
    //   var index = this.selection.indexOf(selected);
    //   if (index !== -1) {
    //     this.selection.splice(index, 1);
    //   }
    // } else {
    //   this.picked = selected;
    // }

  } else {
    if (!event.shiftKey) app.clearSelection();

    var stroke = app.getStrokeAt(p.x, p.y, 4 / app.scale);
    if (stroke) {
      app.selectStroke(stroke);
      // var path = { stroke: stroke, points: stroke.points };
      // this.selection.push(path);
      // this.picked = path;
      // this.picked = stroke;
    } else {
      app.select(null);
    }
  }

  app.requestDraw();
}

ClipTool.prototype.endDrag = function() {
  this.dragging = false;
  this.picked = false;
}

ClipTool.prototype.onMouseUp = function(event) {
  if (this.drawing) {
    this.endSelection();
  } else if (this.dragging) {
    this.endDrag();
  }
}


module.exports = ClipTool;
