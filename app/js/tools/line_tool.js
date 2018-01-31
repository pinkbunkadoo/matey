const Util = require('../util');
const Transform = require('../transform');
const DisplayItem = require('../display_item');
const Point = require('../geom/point');
const Vector = require('../geom/vector');
const Stroke = require('../stroke');
const Tool = require('./tool');
const Smooth = require('../lib/smooth');

class LineTool extends Tool {
  constructor() {
    super('line');
    this.cursor = 'line';
    this.cursorInverted = 'line_inverted';
    this.reset();
  }

  reset() {
    this.points = [];
    this.mx = 0;
    this.my = 0;
    this.drawing = false;
  }

  focus() {
    this.reset();
  }

  blur() {
    // this.reset();
  }

  addPoint(x, y) {
    x = Math.round(x), y = Math.round(y);
    this.points.push(new Point(x, y));
    // console.log(x, y);
  }

  beginStroke(x, y) {
    this.drawing = true;
    // var mx = event.clientX - App.paper.el.offsetLeft;
    // var my = event.clientY - App.paper.el.offsetTop;
    this.addPoint(x, y);
    this.addPoint(x, y);

    // window.addEventListener('mouseup', this);
    // window.addEventListener('mousemove', this);
    // window.addEventListener('blur', this);
    App.capture(this);
  }

  endStroke() {
    // console.log('end');
    // this.addPoint(App.mouseX, App.mouseY);
    if (this.drawing) {
      this.drawing = false;
      if (this.points.length > 1) {
        // App.updateFrameListIcon(App.sequence.position);
        // App.sequence.addAction(new LineAction());
        // this.emit('stroke', { points: this.points });
        App.createStroke(this.points, App.getStrokeColor(), null);
      } else {
        App.render();
      }
      this.points = [];
      App.release(this);
    }
    // this.emit('change');
    // this.endCapture();
  }

  render(ctx) {
    if (this.drawing) {
      // ctx.beginPath();
      // let color = App.getStrokeColor();
      // ctx.strokeStyle = color ? color.toHexString() : App.colors.stroke.toHexString();
      // for (let i = 0; i < this.points.length; i++) {
      //   let point = this.points[i];
      //   let x = point.x, y = point.y;
      //   if (i == 0)
      //     ctx.moveTo(x, y);
      //   else
      //     ctx.lineTo(x, y);
      // }
      // ctx.stroke();
      let transform = new Transform();
      let color = App.getStrokeColor();
      let fill = App.getFillColor();

      App.paper.addDisplayItem(new DisplayItem({
        points: this.points,
        color: color ? color : App.colors.stroke,
        fill: null,
        thickness: App.lineWidth,
        transform: transform,
        dashed: (color == null)
      }));

    }
  }

  onMouseDown(event) {
    // console.log('mousedown_line');

    var mx = event.clientX;// - App.paper.el.offsetLeft;
    var my = event.clientY;// - App.paper.el.offsetTop;

    if (event.buttons === 1) {
      // console.log('hey');
      this.beginStroke(mx, my);

    //   if (this.points.length == 0) {
    //     this.beginStroke();
    //   } else {
    //     this.addPoint(this.mx, this.my);
    //   }
    // } else {
    //   this.endStroke();
    }
  }

  onMouseUp(event) {
    // this.points.push(new Point(App.mouseX, App.mouseY));
    // this.endStroke();
    this.endStroke();
    // this.drawing = false;
  }

  onMouseMove(event) {
    // console.log('mousemove_line');

    let mx = App.cursorX; // - App.paper.el.offsetLeft;
    let my = App.cursorY;// - App.paper.el.offsetTop;

    if (this.drawing) {
      this.points[1].x = mx;
      this.points[1].y = my;

      // this.emit('change');
      App.render();

      // // console.log(App.mouseX);
      //
      //
      // // var mx = App.mouseX;
      // // var my = App.mouseY;
      //
      // if (event.shiftKey) {
      //   if (this.points.length) {
      //     var p = this.points[this.points.length - 1];
      //     var cx = mx - p.x;
      //     var cy = my - p.y;
      //
      //     var vx = cx;
      //     var vy = cy;
      //
      //     // var r = Math.abs(vy / vx);
      //
      //     var v = new Vector(cx, cy);
      //     v.normalize();
      //
      //     // directions
      //     var dx = cx / (cx !== 0 ? Math.abs(cx) : 1);
      //     var dy = cy / (cy !== 0 ? Math.abs(cy) : 1);
      //
      //     if (v.x < 0.4 && v.x > -0.4) {
      //       vx = 0;
      //     } else {
      //       if (Math.abs(cy) > Math.abs(cx)) {
      //         vx = Math.abs(cy) * dx;
      //       }
      //     }
      //     if (v.y < 0.4 && v.y > -0.4) {
      //       vy = 0;
      //     } else {
      //       if (Math.abs(cx) > Math.abs(cy)) {
      //         vy = Math.abs(cx) * dy;
      //       }
      //     }
      //
      //     mx = p.x + vx;
      //     my = p.y + vy;
      //   }
      // }
      //
      // this.mx = mx;
      // this.my = my;

      // this.render();
    }
  }

  onKeyDown(event) {
    if (event.key === 'Escape' && !event.repeat) {
      this.endStroke();
    }
  }

  handleEvent(event) {
    // console.log(event.type);
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
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = LineTool;
