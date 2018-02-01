const Util = require('../util');
const Point = require('../geom/point');
const Vector = require('../geom/vector');
const DisplayItem = require('../display_item');
const Transform = require('../transform');
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
  }

  beginPath(x, y) {
    this.drawing = true;
    this.addPoint(x, y);
    this.mx = x;
    this.my = y;

    App.capture(this);

  }

  endPath() {
    if (this.drawing) {
      this.drawing = false;

      if (this.points.length > 1) {
        App.createStroke({ points: this.points, color: App.getStrokeColor(), fill: App.getFillColor() });
      } else {
        App.render();
      }

      this.points = [];
      App.release(this);
    }
  }

  render(ctx) {
    if (this.drawing && this.points.length) {
      let transform = new Transform();
      let color = App.getStrokeColor();
      let fill = App.getFillColor();

      App.paper.addDisplayItem(new DisplayItem({
        points: this.points,
        color: color,
        fill: fill,
        thickness: App.lineWidth,
        transform: transform,
        dashed: (color === null && (fill === null || this.points.length == 2))
      }));

      App.paper.addDisplayItem(new DisplayItem({
        points: [ this.points[this.points.length - 1], new Point(this.mx, this.my) ],
        color: color ? color : App.colors.stroke,
        fill: null,
        thickness: App.lineWidth,
        transform: transform,
        dashed: true
      }));

      // App.paper.renderPath(ctx, this.points, {
      //     color: App.getStrokeColor(),
      //     fill: App.getFillColor(),
      //     thickness: App.lineWidth,
      //     transform: transform
      //   }
      // );
      //
      // App.paper.renderPath(ctx, [ this.points[this.points.length - 1], new Point(this.mx, this.my) ], {
      //     color: null,
      //     fill: null,
      //     thickness: App.lineWidth,
      //     transform: transform
      //   }
      // );

    }
  }

  onMouseDown(event) {
    // console.log('down', event.target);

    var mx = App.cursorX; //event.clientX;// - App.paper.el.offsetLeft;
    var my = App.cursorY; //event.clientY;// - App.paper.el.offsetTop;

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
      App.render();
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
    if (event.button == 2) {
      this.endPath();
    }
    // this.drawing = false;
  }

  onMouseMove(event) {
    if (this.drawing) {
      this.mx = App.cursorX;
      this.my = App.cursorY;

      App.render();
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
    } else {
      // if (App.mouseLeft) {
      //   if (Math.abs(App.mouseDownX - App.mouseX) > 3) {
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
