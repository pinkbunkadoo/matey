const Const = require('../const');
const Util = require('../util');
const Geom = require('../geom/');
const Stroke = require('../stroke');
const Tool = require('./tool');
const Actions = require('../actions/');
const Smooth = require('../lib/smooth');

class PointerTool extends Tool {
  constructor() {
    super('pointer');
    this.cursor = 'pointer';
  }

  reset() {
    this.mode = null;
    this.dragList = [];
    this.dx = 0;
    this.dy = 0;
  }

  focus() {
    this.reset();
  }

  blur() {
  }

  nudge(dx, dy) {
    // var selection = app.selection;
    // var action = sequence.frame.history.get().action;
    //
    // this.moveSelected(dx, dy);
    //
    // if (!(action instanceof Actions.MoveAction) && !(action instanceof Actions.NudgeAction) ||  this.selectionChanged) {
    //   sequence.addAction(new Actions.NudgeAction());
    //   this.selectionChanged = false;
    // } else {
    //   sequence.updateState();
    // }
    //
    // this.emit('moved');
  }

  beginDrag() {
    this.mode = 'drag';
    app.moveSelected(this.dx, this.dy);
    // app.capture(this);
  }

  endDrag() {
    this.dx = 0;
    this.dy = 0;
    this.mode = null;
    app.setFrameDirty();
  }


  beginSelection() {
    this.xmin = Number.POSITIVE_INFINITY;
    this.ymin = Number.POSITIVE_INFINITY;
    this.xmax = Number.NEGATIVE_INFINITY;
    this.ymax = Number.NEGATIVE_INFINITY;
    this.mode = 'select';
  }

  endSelection() {
    this.mode = null;
    let p1 = app.paper.screenToWorld(this.xmin, this.ymin);
    let p2 = app.paper.screenToWorld(this.xmax, this.ymax);
    app.marqueeSelect(p1, p2);
  }

  render(ctx) {
    if (this.mode === 'select') {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
      ctx.lineWidth = 1;
      ctx.globalCompositeOperation = 'difference';
      ctx.strokeStyle = 'gray';
      ctx.setLineDash([ 2, 4 ]);
      ctx.beginPath();
      ctx.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
      ctx.stroke();
      ctx.restore();
    }
  }

  // PointerTool.prototype.getPathBounds(points) {
  //   var minx = Number.POSITIVE_INFINITY;
  //   var miny = Number.POSITIVE_INFINITY;
  //   var maxx = Number.NEGATIVE_INFINITY;
  //   var maxy = Number.NEGATIVE_INFINITY;
  //
  //   var bounds;
  //
  //   if (points.length > 0) {
  //     for (var i = 0; i < points.length; i++) {
  //       var p = points[i];
  //       minx = (p.x < minx ? p.x : minx);
  //       miny = (p.y < miny ? p.y : miny);
  //       maxx = (p.x > maxx ? p.x : maxx);
  //       maxy = (p.y > maxy ? p.y : maxy);
  //     }
  //     bounds = new Rectangle(minx, miny, maxx - minx, maxy - miny);
  //   }
  //   return bounds;
  // }

  onMouseDown(event) {
    // console.log('down');
    let mx = this.mouseDownX = app.cursorX;
    let my = this.mouseDownY = app.cursorY;

    var stroke = app.hitTest(mx, my);

    if (stroke) {
      if (stroke.selected) {
        if (event.shiftKey) {
          app.deselect(stroke);
        }
      } else {
        if (!event.shiftKey) app.deselect();
        app.select(stroke);
      }
    } else {
      if (!event.shiftKey) app.deselect();
    }

    // if (stroke) {
    //   if (stroke.selected) {
    //     if (event.shiftKey) {
    //       app.selection.remove(stroke);
    //       this.fuse(stroke);
    //       this.selectionChanged = true;
    //     }
    //   } else {
    //     app.selection.add(stroke);
    //     this.fuse(stroke);
    //
    //     if (!event.shiftKey) {
    //       var strokes = app.selection.items.slice(0);
    //       app.selection.clear();
    //       for (var i = 0; i < strokes.length; i++) {
    //         if (strokes[i] !== stroke) this.fuse(strokes[i]);
    //       }
    //     }
    //     app.selection.add(stroke);
    //     this.selectionChanged = true;
    //   }
    // } else {
    //   if (!app.selection.isEmpty()) {
    //     this.deselect();
    //     this.selectionChanged = true;
    //   }
    // }

    this.picked = stroke;

    app.render();
    // this.emit('pick', { stroke: this.picked });
    app.capture(this);
  }

  onMouseUp(event) {
    if (this.mode == 'select') {
      this.endSelection();
    } else if (this.mode == 'drag') {
      this.endDrag();
    }
    app.release(this);
  }

  onMouseMove(event) {
    let mx = app.cursorX;
    let my = app.cursorY;

    if (this.mode == 'select') {
      if (mx < this.mouseDownX) {
        this.xmin = mx;
        this.xmax = this.mouseDownX;
      } else {
        this.xmin = this.mouseDownX;
        this.xmax = mx;
      }

      if (my < this.mouseDownY) {
        this.ymin = my;
        this.ymax = this.mouseDownY;
      } else {
        this.ymin = this.mouseDownY;
        this.ymax = my;
      }
      // console.log('select', mx, my);
      // this.emit('change');
      app.render();

    } else if (this.mode == 'drag') {
      // console.log(mx, my);
      var dx = event.movementX, dy = event.movementY;
      app.moveSelected(dx, dy);
      app.render();
      // this.emit('drag');

    } else {
      if (event.buttons & 1) {
        let dx = mx - this.mouseDownX;
        let dy = my - this.mouseDownY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          if (this.picked) {
            this.dx = dx;
            this.dy = dy;
            this.beginDrag();
          } else  {
            this.beginSelection();
          }
        }
      }
    }
  }

  onKeyDown(event) {
    var shiftAmount = event.shiftKey ? 10 : 1;
    if ((event.key === 'Delete' || event.key === 'Backspace') && !event.repeat) {
      // this.emit('delete');
    } else if (event.key === 'ArrowUp') {
      if (event.ctrlKey) {
        app.frame.bringForward(app.selection.items[0]);
        // this.emit('change');
      } else {
        this.nudge(0, -shiftAmount);
      }
    } else if (event.key === 'ArrowDown') {
      if (event.ctrlKey) {
        app.frame.sendBack(app.selection.items[0]);
        // this.emit('change');
      } else {
        this.nudge(0, shiftAmount);
      }
    } else if (event.key === 'ArrowLeft') {
      this.nudge(-shiftAmount, 0);
    } else if (event.key === 'ArrowRight') {
      this.nudge(shiftAmount, 0);
    }
  }

  onKeyUp(event) {
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
    else if (event.type === 'keyup') {
      this.onKeyUp(event);
    }
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = PointerTool;
