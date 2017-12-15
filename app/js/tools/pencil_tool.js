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
    this.points = [];
  }

  focus() {
    // console.log('focus');
  }

  blur() {
    this.endStroke();
  }

  addPoint(x, y) {
    this.points.push(new Point(x, y));
  }

  beginStroke(mx, my) {
    // console.log('beginStroke');
    this.drawing = true;
    // var mx = event.clientX - app.paper.el.offsetLeft;
    // var my = event.clientY - app.paper.el.offsetTop;
    this.addPoint(mx, my);
  }

  endStroke() {
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

  render(ctx) {

    // ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    //
    // var screen = (options.screen != undefined ? options.screen : false);
    // var fill = (options.fill ? options.fill.toHexString() : null);
    // var strokeStyle = (options.strokeStyle ? options.strokeStyle.toHexString() : Const.color.Stroke.toHexString());
    // var lineWidth = (options.lineWidth != undefined ? options.lineWidth : Const.LINE_WIDTH);
    // var alpha = (options.alpha != undefined ? options.alpha : 1.0);

    ctx.beginPath();

    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i];
      var x = point.x, y = point.y;

      if (!screen) {
        // var p = this.worldToScreen(x, y);
        // x = p.x, y = p.y;
      }
      // var x = p.x + dx + 0.5, y = p.y + dy + 0.5;
      // var x = p.x + dx, y = p.y + dy;
      // var x = p.x, y = p.y;

      if (i == 0)
        ctx.moveTo(x, y);
      else
        ctx.lineTo(x, y);
    }

    // if (points.length == 2) ctx.closePath();

    // if (fill) {
    //   ctx.fillStyle = fill;
    //   ctx.fill();
    //   ctx.globalAlpha = 1;
    // }

    ctx.lineWidth = Const.LINE_WIDTH;
    ctx.strokeStyle = Const.COLOR_STROKE.toHexString();
    ctx.stroke();

    // if (this.drawing) app.paper.renderPath(this.points, { screen: true });

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

  endCapture() {
    window.removeEventListener('mouseup', this);
    window.removeEventListener('mousemove', this);
    window.removeEventListener('blur', this);
  }

  onBlur(event) {
    this.endCapture();
  }

  onMouseDown(event) {
    // console.log('pencil-down');
    if (event.buttons === 1) {
      var mx = event.clientX;// - app.paper.el.offsetLeft;
      var my = event.clientY;// - app.paper.el.offsetTop;
      this.beginStroke(mx, my);

      window.addEventListener('mouseup', this);
      window.addEventListener('mousemove', this);
      window.addEventListener('blur', this);
    }
  }

  onMouseUp(event) {
    var mx = event.clientX;// - app.paper.el.offsetLeft;
    var my = event.clientY;// - app.paper.el.offsetTop;
    this.addPoint(mx, my);
    this.endStroke();
    this.endCapture();
  }

  onMouseMove(event) {
    // console.log('pencil-move');

    var mx = event.clientX;// - app.paper.el.offsetLeft;
    var my = event.clientY;// - app.paper.el.offsetTop;

    if (this.drawing) {
      // this.addPoint(app.mouseX, app.mouseY);
      this.addPoint(mx, my);
      // Smooth.exp(this.points);
      Smooth.simple(this.points);
      this.emit('change');
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
    else if (event.type === 'mousemove') {
      this.onMouseMove(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }
}

module.exports = PencilTool;
