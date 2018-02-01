const Smooth = require('../lib/smooth');
const simplify = require('../lib/simplify');
const Util = require('../util');
const Point = require('../geom/point');
const Transform = require('../transform');
const Stroke = require('../stroke');
const Tool = require('./tool');
const DisplayItem = require('../display_item');

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
  }

  beginStroke(mx, my) {
    App.capture(this);
    this.drawing = true;
    this.addPoint(mx, my);
  }

  endStroke() {
    App.release(this);
    this.drawing = false;
    if (this.points.length > 2) {
      // this.points = Smooth.mcmaster(this.points);

      this.points = simplify(this.points, 0.4, true);
      App.createStroke({ points: this.points, color: App.getStrokeColor(), fill: App.getFillColor() });
    }
    this.points = [];
  }

  render(ctx) {
    if (this.drawing) {
      let color = App.getStrokeColor();
      let fill = App.getFillColor();
      let displayItem = new DisplayItem({
        points: this.points,
        color: color,
        fill: fill,
        thickness: App.lineWidth,
        transform: new Transform(0, 0),
        dashed: (color === null && fill === null)
      });
      App.paper.addDisplayItem(displayItem);

      // App.paper.renderPath(ctx, this.points,
      //   {
      //     color: App.getStrokeColor(),
      //     fill: App.getFillColor(),
      //     thickness: App.lineWidth,
      //     transform: new Transform()
      //   }
      // );
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
