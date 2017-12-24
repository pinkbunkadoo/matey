const Const = require('../const');
const Util = require('../util');
const Point = require('../geom/point');
const Stroke = require('../stroke');
const Tool = require('./tool');

const Smooth = require('../lib/smooth');
const simplify = require('../lib/simplify');

class PencilTool extends Tool {
  constructor() {
    super('pencil');
    this.cursor = 'pencil';
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
    app.capture(this);
    // console.log('beginStroke');
    this.drawing = true;
    // var mx = event.clientX - app.paper.el.offsetLeft;
    // var my = event.clientY - app.paper.el.offsetTop;
    this.addPoint(mx, my);
  }

  endStroke() {
    // console.log('end');
    app.release(this);

    this.drawing = false;

    if (this.points.length > 2) {
      // console.log(this.points.length);
      this.points = simplify(this.points, 0.2);
      app.createStroke(this.points, app.getColor(), app.getFill());
      // console.log(this.points.length);
      // this.emit('stroke', { points: this.points });
    }

    this.points = [];

    // app.render();

    // this.emit('change');
    // app.clearOverlay();
    // this.emitter.emit('render', { points: this.points });
    // app.requestDraw();
  }

  render(ctx) {

    if (this.drawing) {
      ctx.beginPath();

      for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i];
        var x = point.x, y = point.y;

        if (i == 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
      }

      // ctx.lineTo(app.paper.cursorX, app.paper.cursorY);

      ctx.lineWidth = Const.LINE_WIDTH;
      ctx.strokeStyle = Const.COLOR_STROKE.toHexString();
      ctx.stroke();
    }
  }

  beginCapture() {
    // window.addEventListener('mouseup', this);
    // window.addEventListener('mousemove', this);
    // window.addEventListener('blur', this);
  }

  endCapture() {
    // window.removeEventListener('mouseup', this);
    // window.removeEventListener('mousemove', this);
    // window.removeEventListener('blur', this);
  }

  onBlur(event) {
    // this.endCapture();
  }

  onMouseDown(event) {
    if (event.buttons === 1) {
      var mx = event.clientX;// - app.paper.el.offsetLeft;
      var my = event.clientY;// - app.paper.el.offsetTop;
      this.beginStroke(mx, my);
      // this.beginCapture();
    }
  }

  onMouseUp(event) {
    var mx = event.clientX; // - app.paper.el.offsetLeft;
    var my = event.clientY; // - app.paper.el.offsetTop;
    this.addPoint(mx, my);
    this.endStroke();
    // this.endCapture();
  }

  onMouseMove(event) {
    var mx = event.clientX; // - app.paper.el.offsetLeft;
    var my = event.clientY; // - app.paper.el.offsetTop;

    if (this.drawing) {
      this.addPoint(mx, my);
      // if (event.ctrlKey) {

      // Smooth.exp(this.points);
      Smooth.simple(this.points);

      // let point = this.points[this.points.length - 1];
      // point.x = mx;
      // point.y = my;

      // this.addPoint(mx, my);
      //
      // }
      // this.emit('change');
      app.render();
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
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = PencilTool;
