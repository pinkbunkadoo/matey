const Const = require('../const');
const Util = require('../util');
const Point = require('../geom/point');
const Vector = require('../geom/vector');
const Stroke = require('../stroke');
const Tool = require('./tool');

class PolygonTool extends Tool {
  constructor() {
    super('polygon');

    this.cursor = 'line';
    this.points = [];

    this.mx = 0; //app.mouseX;
    this.my = 0; //app.mouseY;

    this.drawing = false;
  }

  focus() {
  }

  blur() {
    this.endStroke();
  }

  addPoint(x, y) {
    x = Math.round(x), y = Math.round(y);
    this.points.push(new Point(x, y));
  }

  beginStroke(x, y) {
    this.drawing = true;
    this.addPoint(x, y);
    this.mx = x;
    this.my = y;
  }

  endStroke() {
    if (this.points.length > 1) {
      this.emit('stroke', { points: this.points });
    }

    this.drawing = false;
    this.points = [];

    this.emit('change');
  }

  render(ctx) {

    if (this.drawing) {
      // app.paper.renderPath(this.points, { screen: true });
      // var last = this.points[this.points.length - 1];
      // var mp = new Point(this.mx, this.my);
      // app.paper.renderPath([ last, mp ], { screen: true });
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (this.points.length) {
      ctx.lineWidth = Const.LINE_WIDTH;
      ctx.strokeStyle = Const.COLOR_STROKE;

      if (this.points.length > 1) {
        var p = this.points[0];

        ctx.beginPath();

        for (var i = 0; i < this.points.length; i++) {
          let p = this.points[i];
          let x = p.x, y = p.y;
          if (i == 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
        }

        // if (this.points.length == 2) ctx.closePath();

        ctx.stroke();
      }

      let mx = this.mx, my = this.my;
      p = this.points[this.points.length - 1];

      // ctx.save();
      // ctx.globalCompositeOperation = 'difference';
      // ctx.lineWidth = 1;
      ctx.lineWidth = Const.LINE_WIDTH;
      ctx.strokeStyle = Const.COLOR_STROKE; //'dodgerblue';
      // ctx.setLineDash([3, 4]);

      // ctx.beginPath();
      // ctx.moveTo(p.x >> 0, p.y >> 0);
      // ctx.lineTo(mx >> 0, my >> 0);
      // ctx.stroke();
      // ctx.restore();
    }

    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  onMouseMove(event) {
    var mx = event.clientX;//- app.paper.el.offsetLeft;
    var my = event.clientY;// - app.paper.el.offsetTop;

    if (this.drawing) {
      // this.points[1].x = mx;
      // this.points[1].y = my;

      this.emit('change');

      this.mx = mx;
      this.my = my;

      // // console.log(app.mouseX);
      //
      //
      // // var mx = app.mouseX;
      // // var my = app.mouseY;
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
    } else {
      // if (app.mouseLeft) {
      //   if (Math.abs(app.mouseDownX - app.mouseX) > 3) {
      //   }
      // }
    }
  }

  onMouseDown(event) {
    var mx = event.clientX;// - app.paper.el.offsetLeft;
    var my = event.clientY;// - app.paper.el.offsetTop;

    if (event.button == 0) {
      if (this.drawing) {
        // console.log('addpoint');
        this.addPoint(mx, my);
        this.emit('change');
      } else {
        // console.log('begindrawing');
        this.beginStroke(mx, my);
        this.emit('change');
      }
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
    // this.points.push(new Point(app.mouseX, app.mouseY));
    // this.endStroke();
    if (event.button == 2) {
      this.endStroke();
    }
    // this.drawing = false;
  }

  onKeyDown(event) {
    if (event.key === 'Escape' && !event.repeat) {
      this.endStroke();
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
    else if (event.type === 'keydown') {
      this.onKeyDown(event);
    }
  }
}

module.exports = PolygonTool;
