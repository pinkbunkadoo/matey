const Util = require('../util');
const Point = require('../geom/point');
const Stroke = require('../stroke');
const Tool = require('./tool');
const Smooth = require('../lib/smooth');

class KnifeTool extends Tool {
  constructor() {
    super('knife');

    this.cursor = 'pointer';
    this.points = [];
    this.intersections = [];
  }

  focus() {
    this.points = [];
    this.intersections = [];
    this.drawing = false;
  }

  blur() {
    this.endStroke();
  }

  beginStroke() {
    this.drawing = true;
    this.points = [];
    this.intersections = [];
    this.opacity = 1.0;
  }

  getIntersections() {
    var intersections = [];
    for (var i = 1; i < this.points.length; i++) {
      var p1 = this.points[i - 1];
      var p2 = this.points[i];

      p1 = App.screenToWorld(p1.x, p1.y);
      p2 = App.screenToWorld(p2.x, p2.y);

      for (var j = 0; j < App.sequence.frame.strokes.length; j++) {
        var stroke = App.sequence.frame.strokes[j];
        for (var k = 1; k < stroke.points.length; k++) {
          var p3 = stroke.points[k - 1];
          var p4 = stroke.points[k];
          var int = Util.intersect(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
          if (int && int.seg1 && int.seg2) {
            intersections.push(int);
            break;
          }
        }
      }
    }
    return intersections;
  }

  endStroke() {
    this.points.push(new Point(App.mouseX, App.mouseY));
    if (this.points.length > 2) {

      this.intersections = this.getIntersections();

      function opacityTimer() {
        this.opacity = this.opacity - 0.1;
        // this.opacity = ((this.opacity * 10) >> 0) / 10;
        if (this.opacity < 0) {
          clearInterval(this.opacityTimerId);
          this.opacity = 0;
        }
        // App.requestDraw();
      }
      this.opacityTimerId = setInterval(opacityTimer.bind(this), 1000/30);

    }
    this.points = [];
    this.drawing = false;
    // App.requestDraw();
  }

  render(ctx) {
    if (this.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for (var i = 1; i < this.points.length; i++) {
        var p = this.points[i];
        ctx.lineTo(p.x, p.y);
      }

      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'dodgerblue';
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';

    for (var i = 0; i < this.intersections.length; i++) {
      var int = this.intersections[i];
      if (int) {
        var p = App.worldToScreen(int.x, int.y);
        x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  onMouseMove(event) {
    if (this.drawing) {
      var p = new Point(event.clientX, event.clientY)
      this.points.push(p);

      Smooth.simple(this.points);

      this.intersections = this.getIntersections();

      // App.requestDraw();
    }
  }

  onMouseDown(event) {
    if (event.button == 0) {
      this.beginStroke();
    }
  }

  onMouseUp(event) {
    this.endStroke();
  }
}

module.exports = KnifeTool;
