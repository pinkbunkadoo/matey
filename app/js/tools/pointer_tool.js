const Util = require('../util');
const Transform = require('../transform');
const Color = require('../color');
const DisplayItem = require('../display_item');
const DisplayList = require('../display_list');
const Stroke = require('../stroke');
const Tool = require('./tool');
const Smooth = require('../lib/smooth');

class PointerTool extends Tool {
  constructor() {
    super('pointer');
    this.cursor = 'pointer';
  }

  reset() {
    this.mode = null;
    this.list = [];
    this.transform = new Transform();
  }

  focus() {
    this.reset();
  }

  blur() {
  }

  nudge(dx, dy) {
    // var selection = App.selection;
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
    this.list = new DisplayList();
    this.transform = new Transform();
    // App.moveSelected(this.dx, this.dy);

    for (var i = 0; i < App.selection.items.length; i++) {
      let item = App.selection.items[i];
      let displayItem = new DisplayItem({ points: item.points, color: new Color(64, 64, 64), thickness: App.lineWidth, operation: 'difference' });
      this.list.add(displayItem);
    }
    // console.log(this.items.length);
  }

  endDrag() {
    let dx = this.transform.x;
    let dy = this.transform.y;
    this.reset();
    App.moveSelected(dx, dy);
    // App.setFrameDirty();
  }


  beginSelection() {
    this.xmin = Number.POSITIVE_INFINITY;
    this.ymin = Number.POSITIVE_INFINITY;
    this.xmax = Number.NEGATIVE_INFINITY;
    this.ymax = Number.NEGATIVE_INFINITY;
    this.mode = 'select';
  }

  endSelection() {
    let p1 = App.paper.screenToWorld(this.xmin, this.ymin);
    let p2 = App.paper.screenToWorld(this.xmax, this.ymax);
    this.reset();
    App.marqueeSelect(p1, p2);
  }

  render(ctx) {
    if (this.mode == 'select') {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
      ctx.lineWidth = 0.5;
      ctx.globalCompositeOperation = 'difference';
      ctx.strokeStyle = 'gray';
      ctx.setLineDash([ 2, 4 ]);
      ctx.beginPath();
      ctx.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
      ctx.stroke();
      ctx.restore();

    } else if (this.mode == 'drag') {
      let transform = App.paper.getWorldToScreenTransform();
      transform.x += this.transform.x;
      transform.y += this.transform.y;
      App.paper.renderDisplayList(ctx, this.list, transform);
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
    let mx = this.mouseDownX = App.cursorX;
    let my = this.mouseDownY = App.cursorY;
    let stroke;

    stroke = App.hitTest(mx, my);

    if (stroke) {
      if (stroke.selected) {
        if (event.shiftKey) {
          App.deselect(stroke);
        }
      } else {
        if (!event.shiftKey) App.deselect();
        App.select(stroke);
      }
    } else {
      if (!event.shiftKey) App.deselect();
    }

    // if (stroke) {
    //   if (stroke.selected) {
    //     if (event.shiftKey) {
    //       App.selection.remove(stroke);
    //       this.fuse(stroke);
    //       this.selectionChanged = true;
    //     }
    //   } else {
    //     App.selection.add(stroke);
    //     this.fuse(stroke);
    //
    //     if (!event.shiftKey) {
    //       var strokes = App.selection.items.slice(0);
    //       App.selection.clear();
    //       for (var i = 0; i < strokes.length; i++) {
    //         if (strokes[i] !== stroke) this.fuse(strokes[i]);
    //       }
    //     }
    //     App.selection.add(stroke);
    //     this.selectionChanged = true;
    //   }
    // } else {
    //   if (!App.selection.isEmpty()) {
    //     this.deselect();
    //     this.selectionChanged = true;
    //   }
    // }

    this.picked = stroke;

    App.render();
    App.capture(this);
  }

  onMouseUp(event) {
    if (this.mode == 'select') {
      this.endSelection();
    } else if (this.mode == 'drag') {
      this.endDrag();
    }
    App.release(this);
  }

  onMouseMove(event) {
    let mx = App.cursorX;
    let my = App.cursorY;

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
      App.render();

    } else if (this.mode == 'drag') {
      let dx = event.movementX;
      let dy = event.movementY;
      // App.moveSelected(dx, dy);
      this.transform.x += dx;
      this.transform.y += dy;

      App.render();

    } else {
      if (event.buttons & 1) {
        let dx = mx - this.mouseDownX;
        let dy = my - this.mouseDownY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          if (this.picked) {
            this.transform.x = dx;
            this.transform.y = dy;
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

    if (event.key === ']') {
      App.bringForward();

    } else if (event.key === '[') {
      App.sendBack();

    } else if (event.key === 'ArrowUp') {
      if (event.ctrlKey) {
      } else {
        this.nudge(0, -shiftAmount);
      }
    } else if (event.key === 'ArrowDown') {
      if (event.ctrlKey) {
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
