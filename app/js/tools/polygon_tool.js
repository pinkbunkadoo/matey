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
    this.cursorInverted = 'line_inverted';
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
    // this.endPath();
    // this.endStroke();
  }

  addPoint(x, y) {
    x = Math.round(x), y = Math.round(y);
    this.points.push(new Point(x, y));
    // console.log(this.points.length);
  }

  beginPath(x, y) {
    this.drawing = true;
    this.addPoint(x, y);
    this.mx = x;
    this.my = y;

    app.capture(this);

    // console.log('poly-begin');

    // console.log('beginStroke');

    // window.addEventListener('mouseup', this);
    // app.paper.canvas.addEventListener('mousemove', this);
    // // window.addEventListener('mousemove', this);
    // window.addEventListener('mousedown', this);
    // window.addEventListener('blur', this);

    // window.addEventListener('pointerlockchange', (event) => {
    //   console.log('pointerlockchange');
    // });
    // window.addEventListener('pointerlockerror', (event) => {
    //   console.log('pointerlockerror');
    // });
    //
    // app.paper.canvas.requestPointerLock = app.paper.canvas.requestPointerLock || app.paper.canvas.mozRequestPointerLock;
    // app.paper.canvas.requestPointerLock();
  }

  endPath() {
    // console.log('endpath');

    if (this.drawing) {
      this.drawing = false;

      if (this.points.length > 1) {
        app.createStroke(this.points, app.getColor(), app.getFill());
        // this.emit('stroke', { points: this.points });
      } else {
        app.render();
      }

      this.points = [];
      app.release(this);
    }

    // window.removeEventListener('mouseup', this);
    // // window.removeEventListener('mousemove', this);
    // window.removeEventListener('mousedown', this);
    // app.paper.canvas.removeEventListener('mousemove', this);
    // window.removeEventListener('blur', this);
    //
    // document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    // // Attempt to unlock
    // document.exitPointerLock();

    // console.log('poly-end');
  }

  render(ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (this.drawing && this.points.length) {
      ctx.lineWidth = Const.LINE_WIDTH;
      ctx.strokeStyle = Const.COLOR_STROKE.toHexString();

      if (this.points.length >= 1) {
        // console.log('poly.render');

        ctx.beginPath();

        for (var i = 0; i < this.points.length; i++) {
          let p = this.points[i];
          let x = p.x, y = p.y;
          if (i == 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
        }

        ctx.lineTo(this.mx, this.my);

        ctx.stroke();
        // console.log(this.points.length);
      }
    }
  }

  onMouseDown(event) {
    // console.log('down', event.target);

    var mx = app.cursorX; //event.clientX;// - app.paper.el.offsetLeft;
    var my = app.cursorY; //event.clientY;// - app.paper.el.offsetTop;

    if (event.buttons & 1) {
      if (this.drawing) {
        // console.log('addpoint');
        this.addPoint(mx, my);
        // this.emit('change');
      } else {
        // console.log('begindrawing');
        this.beginPath(mx, my);
        // this.emit('change');
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
      this.endPath();
    }
    // this.drawing = false;
  }

  onMouseMove(event) {
    if (this.drawing) {
      this.mx = app.cursorX;
      this.my = app.cursorY;

      app.render();
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

  onKeyDown(event) {
    if (event.key === 'Escape' && !event.repeat) {
      this.endPath();
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
