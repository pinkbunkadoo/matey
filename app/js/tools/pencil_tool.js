const Util = require('../util');
const Point = require('../geom/point');
const Transform = require('../transform');
const Stroke = require('../stroke');
const Tool = require('./tool');

const Smooth = require('../lib/smooth');
const simplify = require('../lib/simplify');

class PencilTool extends Tool {
  constructor() {
    super('pencil');
    this.cursor = 'pencil';
    this.cursorInverted = 'pencil_inverted';
  }

  reset() {
    this.points = [];
    this.drawing = false;
  }

  focus() {
    this.reset();
  }

  blur() {
  }

  addPoint(x, y) {
    this.points.push(new Point(x, y));
    // console.log(x, y);
  }

  beginStroke(mx, my) {
    // console.log('begin');
    App.capture(this);
    // console.log('beginStroke');
    this.drawing = true;
    // var mx = event.clientX - App.paper.el.offsetLeft;
    // var my = event.clientY - App.paper.el.offsetTop;
    this.addPoint(mx, my);
  }

  endStroke() {
    App.release(this);
    this.drawing = false;
    if (this.points.length > 2) {
      // console.log(this.points.length);
      // this.points = Smooth.mcmaster(this.points);
      this.points = simplify(this.points, 0.4, true);
      // console.log(this.points.length);
      App.createStroke(this.points, App.getStrokeColor(), App.getFillColor());
    }
    this.points = [];
  }

  render(ctx) {
    if (this.drawing) {
      App.paper.renderPath(
        ctx,
        this.points,
        {
          color: App.getStrokeColor(),
          fill: App.getFillColor(),
          thickness: App.lineWidth,
          transform: new Transform()
        }
      );

      // ctx.beginPath();
      // for (var i = 0; i < this.points.length; i++) {
      //   var point = this.points[i];
      //   var x = point.x, y = point.y;
      //   if (i == 0)
      //     ctx.moveTo(x, y);
      //   else
      //     ctx.lineTo(x, y);
      // }
      // let color = App.getStrokeColor();
      // ctx.lineWidth = App.lineWidth;
      // ctx.strokeStyle = color ? color.toHexString() : App.colors.stroke.toHexString();
      // ctx.stroke();
    }
  }

  onMouseDown(event) {
    if (event.buttons === 1) {
      var mx = event.clientX;
      var my = event.clientY;
      this.beginStroke(mx, my);
    }
  }

  onMouseUp(event) {
    var mx = event.clientX;
    var my = event.clientY;
    this.addPoint(mx, my);
    this.endStroke();
  }

  onMouseMove(event) {
    var mx = event.clientX;
    var my = event.clientY;

    if (this.drawing) {
      this.addPoint(mx, my);
      // Smooth.exp(this.points);
      Smooth.simple(this.points);
      App.render();
    }
  }

  onKeyDown(event) {
    if (event.key === 'u') {
    }
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
    else if (event.type === 'mousemove') {
      this.onMouseMove(event);
    }
  }
}

module.exports = PencilTool;
