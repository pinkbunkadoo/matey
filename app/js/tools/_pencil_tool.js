const Const = require('../const');
const Util = require('../util');
const Point = require('../geom/point');
const Stroke = require('../stroke');
const Smooth = require('../lib/smooth');
const Tool = require('./tool');

class PencilTool extends Tool {
  constructor() {
    super('pencil');
    this.cursor = 'pencil';
    this.points = [];
  }

  focus() {
  }

  blur() {
    this.endStroke();
  }

  beginStroke() {
    this.drawing = true;
    this.currentX = this.lastX = app.mouseX;
    this.currentY = this.lastY = app.mouseY;

    // this.addPoint(app.mouseX, app.mouseY);
  }

  endStroke() {
    this.drawing = false;

    // if (this.points.length > 2) {
    //   // this.points = Smooth.mcmaster(this.points);
    //   // var before = this.points.length;
    //   this.points = simplify(this.points, 0.5);
    //   // var after = this.points.length;
    //
    //   // console.log(before, after, Math.round(after / before * 100) + '%');
    //   // app.updateFrameListIcon(app.sequence.position);
    //   // app.sequence.addAction(new PencilAction());
    //
    //   this.emit('stroke', { points: this.points });
    // }
    //
    // this.points = [];
    // this.emit('change');
    //
    // app.clearOverlay();

    // this.emitter.emit('render', { points: this.points });
    // app.requestDraw();
  }

  bitmapLine(ctx, x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx>dy ? dx : -dy)/2;

    while (true) {
      // this.drawBitmap(bitmap, x0 - ((bitmap.width * 0.5) >> 0), y0 - ((bitmap.height * 0.5) >> 0));
      ctx.fillRect(x0 - 1, y0 - 1, 2, 2);

      if (x0 === x1 && y0 === y1) break;
      var e2 = err;
      if (e2 > -dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
    }
  }

  render() {
    // console.log('render');
    // var ctx = app.paper.getBitmapContext();
    //
    // ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    // ctx.strokeStyle = 'lightblue';
    //
    // ctx.moveTo(this.lastX, this.lastY);
    // ctx.lineTo(this.currentX, this.currentY);
    //
    // ctx.stroke();
    // app.paper.drawLine(this.lastX, this.lastY, this.currentX, this.currentY);

    var ctx = app.paper.getBitmapContext();

    var p1 = app.paper.screenToWorld(this.lastX, this.lastY);
    var p2 = app.paper.screenToWorld(this.currentX, this.currentY);

    // ctx.fillStyle = 'lightblue';
    // this.bitmapLine(ctx, p1.x, p1.y, p2.x, p2.y);

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    // if (points.length == 2) ctx.closePath();

    ctx.strokeStyle = 'lightskyblue';
    ctx.stroke();

  }

  onMouseMove(event) {
    this.currentX = app.mouseX;
    this.currentY = app.mouseY;

    if (this.drawing) {
      // this.addPoint(app.mouseX, app.mouseY);

      // Smooth.exp(this.points);
      // Smooth.simple(this.points);

      // this.render();
      // app.requestDraw();
      // console.log('change');
      this.emit('change');
      // this.render();
    }

    this.lastX = this.currentX;
    this.lastY = this.currentY;
  }

  onMouseDown(event) {
    if (event.button == 0) {
      this.beginStroke();
    }
  }

  onMouseUp(event) {
    // this.addPoint(app.mouseX, app.mouseY);
    this.endStroke();
  }

  onKeyDown(event) {
    // if (event.key === 'u') {
    // }
  }

  handleEvent(event) {
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
}

module.exports = PencilTool;
