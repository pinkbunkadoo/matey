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

  focus() {
    this.mode = null;
    this.dragList = [];
    // app.setCursor('pointer');
    // this.render();
    this.emit('change');
    // app.requestDraw();
  }

  blur() {
    this.emit('change');
  }

  moveSelected(dx, dy) {
    for (var i = 0; i < sequence.selection.elements.length; i++) {
      var element = sequence.selection.elements[i];
      var points = element.points;
      for (var j = 0; j < points.length; j++) {
        var p = points[j];
        p.x = p.x + dx / app.paper.scale;
        p.y = p.y + dy / app.paper.scale;
      }
    }
    // this.emit('change');
  }

  nudge(dx, dy) {
    // var selection = sequence.selection;
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
    this.moveSelected(this.dx, this.dy);
    this.emit('drag');
  }

  endDrag() {
    // var state = app.sequence.frame.history.get();
    // var action = state.action;

    // this.moveSelected(this.dx, this.dy);

    // if ((!(action instanceof MoveAction) && !(action instanceof NudgeAction)) ||  this.selectionChanged) {
    //   action = new MoveAction();
    //   app.sequence.addAction(action);
    //   this.selectionChanged = false;
    // } else {
    //   app.sequence.updateState();
    // }

    this.dx = 0;
    this.dy = 0;
    this.mode = null;

    this.emit('moved');
  }


  beginSelection() {
    this.xmin = Number.POSITIVE_INFINITY;
    this.ymin = Number.POSITIVE_INFINITY;
    this.xmax = Number.NEGATIVE_INFINITY;
    this.ymax = Number.NEGATIVE_INFINITY;
    this.mode = 'select';
    this.beginCapture();
  }

  endSelection() {
    this.emit('marquee', { xmin: this.xmin, ymin: this.ymin, xmax: this.xmax, ymax: this.ymax });
    this.mode = null;
    this.emit('change');
    this.endCapture();
  }

  render(ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineWidth = Const.LINE_WIDTH * 2;

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

  beginCapture() {
    window.addEventListener('mouseup', this);
    window.addEventListener('mousemove', this);
    window.addEventListener('blur', this);
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
    var mx = event.clientX;
    var my = event.clientY;

    // this.emit('pick', mx, my);

    var stroke = app.hitTest(mx, my);

    if (stroke) {
      if (stroke.selected) {
        if (event.shiftKey) {
          sequence.deselect(stroke);
        }
      } else {
        if (!event.shiftKey) sequence.deselect();
        sequence.select(stroke);
      }
    } else {
      if (!event.shiftKey) sequence.deselect();
    }

    // if (stroke) {
    //   if (stroke.selected) {
    //     if (event.shiftKey) {
    //       sequence.selection.remove(stroke);
    //       this.fuse(stroke);
    //       this.selectionChanged = true;
    //     }
    //   } else {
    //     sequence.selection.add(stroke);
    //     this.fuse(stroke);
    //
    //     if (!event.shiftKey) {
    //       var strokes = sequence.selection.elements.slice(0);
    //       sequence.selection.clear();
    //       for (var i = 0; i < strokes.length; i++) {
    //         if (strokes[i] !== stroke) this.fuse(strokes[i]);
    //       }
    //     }
    //     sequence.selection.add(stroke);
    //     this.selectionChanged = true;
    //   }
    // } else {
    //   if (!sequence.selection.isEmpty()) {
    //     this.deselect();
    //     this.selectionChanged = true;
    //   }
    // }

    this.picked = stroke;

    this.emit('pick', { stroke: this.picked });
  }

  onMouseUp(event) {
    if (this.mode == 'select') {
      this.endSelection();

    } else if (this.mode == 'drag') {
      this.endDrag();
    }
  }

  onMouseMove(event) {
    var mx = event.clientX;
    var my = event.clientY;

    if (this.mode == 'select') {
      if (mx < app.paper.mouseDownX) {
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
      this.emit('change');
      // this.render();
      // app.requestDraw();

    } else if (this.mode == 'drag') {
      // var dx = app.mouseDeltaX, dy = app.mouseDeltaY;
      var dx = event.movementX, dy = event.movementY;
      // console.log(dx, dy);

      // event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop

      this.moveSelected(dx, dy);
      this.emit('drag');

    } else {
      // console.log(app.downTarget);
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
      // sequence.deleteSelected();
      // sequence.addAction(new DeleteAction());
      this.emit('delete');
      // app.message({ type: 'selectionDeleted' });

    } else if (event.key === 'ArrowUp') {
      if (event.ctrlKey) {
        sequence.frame.bringForward(sequence.selection.elements[0]);
        this.emit('change');
      } else {
        this.nudge(0, -shiftAmount);
      }
    } else if (event.key === 'ArrowDown') {
      if (event.ctrlKey) {
        sequence.frame.sendBack(sequence.selection.elements[0]);
        this.emit('change');
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
