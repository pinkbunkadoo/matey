const Const = require('../const');
const Point = require('../geom/point');
const Base = require('./base');
const Tools = require('../tools/');
const Stroke = require('../stroke');

class Paper extends Base {
  constructor(el) {
    super(el);

    this.canvasWidth = this.el.offsetWidth;
    this.canvasHeight = this.el.offsetHeight;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.background = 'blue';
    this.el.appendChild(this.canvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.width = this.canvasWidth;
    this.overlayCanvas.height = this.canvasHeight;

    this.scale = 1.0;
    this.width = Const.WIDTH;
    this.height = Const.HEIGHT;

    this.bitmap = document.createElement('canvas');
    this.bitmap.width = this.width;
    this.bitmap.height = this.height;

    this.tx = 0;
    this.ty = 0;

    this.tx = (this.width / 2) >> 0;
    this.ty = (this.height / 2) >> 0;

    this.globalAlpha = 1.0;

    // this.tools = {};
    // this.tools.pointer = new Tools.Pointer();
    // this.tools.pointer.on('marquee', (params) => {
    //   var p1 = this.screenToWorld(params.xmin, params.ymin);
    //   var p2 = this.screenToWorld(params.xmax, params.ymax);
    //
    //   // this.marqueeSelect(p1.x, p1.y, p2.x, p2.y);
    //   this.emit('marquee', p1, p2);
    //
    //   // if (sequence.selection.elements.length === 1)
    //   //   showProperties(sequence.selection.elements[0]);
    //   // else
    //   //   showProperties();
    //
    //   // this.render();
    // });
    // this.tools.pointer.on('pick', (params) => {
    //   // if (sequence.selection.elements.length === 1)
    //   //   showProperties(params.stroke);
    //   // else
    //   //   showProperties();
    //   // this.render();
    // });
    // this.tools.pointer.on('moved', (params) => {
    //   this.emit('moved', params);
    //   // updateFrameListThumbnail(sequence.frame);
    //   // this.render();
    // });
    // this.tools.pointer.on('drag', (params) => {
    //   // app.updateFrameListIcon(app.sequence.frame);
    //   // render();
    // });
    // this.tools.pointer.on('delete', (params) => {
    //   sequence.deleteSelected();
    //   // app.addAction(new Actions.Delete());
    //   updateFrameListThumbnail(sequence.frame);
    //   render();
    // });
    // this.tools.pointer.on('change', (params) => {
    //   // console.log('change');
    //   render();
    // });
    //
    // this.tools.pencil = new Tools.Pencil();
    // this.tools.pencil.on('stroke', (params) => {
    //   // console.log(params.points);
    //   var fill = ui.toolsPalette.getFillColor();
    //   var color = ui.toolsPalette.getStrokeColor()
    //   // console.log(fill, color);
    //   createStroke(params.points, color, fill);
    //   // app.addAction(new Actions.Pencil());
    // });
    // this.tools.pencil.on('change', (params) => {
    //   render();
    // });
    //
    // this.tools.line = new Tools.Line();
    // this.tools.line.on('stroke', (params) => {
    //   createStroke(params.points, ui.toolsPalette.getStrokeColor(), ui.toolsPalette.getFillColor());
    //   // app.addAction(new Actions.Line());
    // });
    // this.tools.line.on('change', (params) => {
    //   render();
    // });
    //
    // this.tools.polygon = new Tools.Polygon();
    // this.tools.polygon.on('change', (params) => {
    //   render();
    // });
    // this.tools.polygon.on('stroke', (params) => {
    //   // app.createStroke(params.points);
    //   createStroke(params.points, ui.toolsPalette.getStrokeColor(), ui.toolsPalette.getFillColor());
    // });
    //
    // this.tools.knife = new Tools.Knife();
    //
    // this.tools.hand = new Tools.Hand();
    // this.tools.hand.on('change', (params) => {
    //   var dx = params.dx, dy = params.dy;
    //   ui.paper.panCameraBy(dx, dy);
    //   render();
    // });
    //
    // this.tools.zoom = new Tools.Zoom();
    // this.tools.zoom.on('zoom-in', (params) => {
    //   ui.paper.zoomIn();
    //   ui.status.setZoom(ui.paper.scale);
    //   render();
    // });
    // this.tools.zoom.on('zoom-out', (params) => {
    //   ui.paper.zoomOut();
    //   ui.status.setZoom(ui.paper.scale);
    //   render();
    // });

    this.tool = null;
    this.mode = null;

    this.el.addEventListener('mousedown', this);

    // window.addEventListener('keydown', this);
    // window.addEventListener('keyup', this);
    this.dislayList = [];
  }

// Paper.prototype.setOnion = function(value) {
//   // console.log('setOnion', value);
//   this.showOnion = value;
// }

  resize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.overlayCanvas.width = this.canvasWidth;
    this.overlayCanvas.height = this.canvasHeight;

    // this.bitmap.width = this.canvasWidth;
    // this.bitmap.height = this.canvasHeight;
    // this.render();
  }

  setCameraPosition(x, y) {
    this.tx = x;
    this.ty = y;
    // this.render();
    // this.draw();
  }

  center() {
    this.setCameraPosition((this.width / 2) >> 0, (this.height / 2) >> 0);
    this.setZoom(1);
  }

  panCameraBy(x, y) {
    this.setCameraPosition(this.tx + x, this.ty + y);
    // console.log(x, y);
  }

  setZoom(value) {
    // console.log('setZoom');
    if (value <= 5 && value >= 0.05) {
      this.scale = ((value * 100) >> 0) / 100;
      if (this.scale == 1) {
        this.tx = this.tx >> 0;
        this.ty = this.ty >> 0;
      }
      // this.render();
      // this.emit('zoom', { scale: this.scale });
    }
  }

  zoomIn() {
    // console.log('zoomIn', this.scale, Const.ZOOM_LEVELS);
    var self = this;
    var level = Const.ZOOM_LEVELS.find(function(element) {
      return element > self.scale;
    });
    // console.log(level);
    if (level) this.setZoom(level);
  }

  zoomOut() {
    var level;
    for (var i = Const.ZOOM_LEVELS.length - 1; i >= 0; i--) {
      level = Const.ZOOM_LEVELS[i]
      if (level < this.scale) break;
    }
    if (level) this.setZoom(level);
  }

  zoomCameraBy(x) {
    var value = this.scale;
    value = value + x;
    this.setZoom(value);
  }

  screenToWorld(x, y) {
    var widthHalf = (this.canvas.width / 2) >> 0;
    var heightHalf = (this.canvas.height / 2) >> 0;
    // var widthHalf = (this.canvas.width / 2);
    // var heightHalf = (this.canvas.height / 2);

    var px = x - widthHalf;
    var py = y - heightHalf;

    var sx = px / this.scale;
    var sy = py / this.scale;

    var tx = sx + this.tx;
    var ty = sy + this.ty;

    return new Point(tx, ty);
  }

  worldToScreen(x, y) {
    var tx = x - (this.tx);
    var ty = y - (this.ty);

    var sx = (tx * this.scale);
    var sy = (ty * this.scale);

    var widthHalf = (this.canvas.width / 2) >> 0;
    var heightHalf = (this.canvas.height / 2) >> 0;
    // var widthHalf = (this.canvas.width / 2);
    // var heightHalf = (this.canvas.height / 2);

    return new Point(sx + widthHalf, sy + heightHalf);
  }

// Paper.prototype.addRenderObject = function(object) {
//   this.renderList.push(object);
// }

// Paper.prototype.addRenderObjects = function(objects) {
//   for (var i = 0; i < objects.length; i++) {
//     this.renderList.push(objects[i]);
//   }
// }

  renderDots(stroke) {
    var ctx = this.canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    for (var j = 0; j < stroke.points.length; j++) {
      var p = stroke.points[j];
      p = this.worldToScreen(p.x, p.y);
      var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
      ctx.beginPath();
      // ctx.rect(x - 1, y - 1, 3, 3);
      ctx.rect(x - 1, y - 1, 2, 2);
      ctx.fill();
      ctx.stroke();
    }
  }


// Paper.prototype.drawLine = function(x1, y1, x2, y2, options) {
//   // var ctx = this.canvas.getContext('2d');
//
//   // ctx.beginPath();
//
//   // var point = points[i];
//   // var x = point.x, y = point.y;
//   //
//   // if (!screen) {
//   //   var p = this.worldToScreen(x, y);
//   //   x = p.x, y = p.y;
//   // }
//
//   var p1 = this.screenToWorld(x1, y1);
//   var p2 = this.screenToWorld(x2, y2);
//
//   var ctx = this.bitmap.getContext('2d');
//
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//
//   // if (points.length == 2) ctx.closePath();
//
//   ctx.strokeStyle = 'lightblue';
//   ctx.stroke();
// }


  renderPath(params = {}) {
    // let ctx = this.canvas.getContext('2d');
    // let points = params.points;
    //
    // if (points) {
    //   var screen = (params.screen != undefined ? params.screen : false);
    //   var fill = (params.fill ? params.fill.toHexString() : null);
    //   var strokeStyle = (params.color ? params.color.toHexString() : Const.COLOR_STROKE.toHexString());
    //   var lineWidth = (params.thickness != undefined ? params.thickness : Const.LINE_WIDTH);
    //   // var alpha = (options.alpha != undefined ? options.alpha : 1.0);
    //
    //   ctx.lineCap = 'round';
    //   ctx.lineJoin = 'round';
    //
    //   ctx.beginPath();
    //
    //   for (var i = 0; i < points.length; i++) {
    //     var point = points[i];
    //     var x = point.x, y = point.y;
    //
    //     if (!screen) {
    //       var p = this.worldToScreen(x, y);
    //       x = p.x, y = p.y;
    //     }
    //     // var x = p.x + dx + 0.5, y = p.y + dy + 0.5;
    //     // var x = p.x + dx, y = p.y + dy;
    //     // var x = p.x, y = p.y;
    //
    //     if (i == 0)
    //       ctx.moveTo(x, y);
    //     else
    //       ctx.lineTo(x, y);
    //   }
    //
    //   // if (points.length == 2) ctx.closePath();
    //
    //   if (fill) {
    //     // ctx.fillStyle = stroke.selected ? 'rgba(30, 144, 255, 0.5)' : 'white';
    //     // ctx.globalAlpha = 0.5;
    //     ctx.fillStyle = fill;
    //     ctx.fill();
    //     ctx.globalAlpha = 1;
    //   }
    //
    //   // ctx.globalAlpha = this.globalAlpha;
    //   ctx.lineWidth = lineWidth; //Const.LINE_WIDTH;
    //   // ctx.strokeStyle = stroke.selected ? 'dodgerblue' : Const.color.STROKE;
    //   // ctx.strokeStyle = Const.color.STROKE;
    //   ctx.strokeStyle = strokeStyle;
    //   ctx.stroke();
    //
    //   // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // }
  }


  getBitmapContext() {
    // return this.bitmap.getContext('2d');
  }


  renderBitmap() {
    // var p1 = this.worldToScreen(0, 0);
    // var ctx = this.canvas.getContext('2d');
    // ctx.globalCompositeOperation = 'multiply';
    // ctx.drawImage(this.bitmap, p1.x, p1.y, this.width * this.scale, this.height * this.scale);
    // ctx.globalCompositeOperation = 'source-over';
  }


  clear() {
    var ctx = this.canvas.getContext('2d');
    // ctx.save();
    ctx.fillStyle = Const.COLOR_WORKSPACE.toHexString();
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    var p1 = this.worldToScreen(0, 0);
    ctx.fillStyle = Const.COLOR_PAPER.toHexString();
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.lineDashOffset = 5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.rect((p1.x >> 0) + 0.5, (p1.y >> 0) + 0.5, this.width * this.scale, this.height * this.scale);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // ctx.fillRect(p1.x >> 0, p1.y >> 0, this.width * this.scale, this.height * this.scale);

    // this.clearOverlay();

    // if (objects) {
    //   for (var i = 0; i < objects.length; i++) {
    //     var obj = objects[i];
    //     if (obj instanceof Stroke) {
    //       ctx.save();
    //       this.renderStroke(ctx, obj);
    //
    //       // var p = this.worldToScreen(obj.points[0].x, obj.points[0].y);
    //       // ctx.fillStyle = 'red';
    //       // ctx.font = '9px Roboto';
    //       // ctx.fillText(i, p.x, p.y - 5);
    //
    //       ctx.restore();
    //     }
    //   }
    // }
    //
    // if (this.overlay) {
    //   ctx.drawImage(this.overlay, 0, 0);
    //   var overlayContext = this.overlay.getContext('2d');
    //   overlayContext.clearRect(0, 0, this.overlay.width, this.overlay.height);
    // }
    // // if (this.tool) this.tool.render(ctx);
    //
    // if (this.showOnion) {
    //   ctx.fillStyle = 'blue';
    //   ctx.font = '9px Roboto';
    //   ctx.fillText('Onion', 100, 100);
    // }
    //
    // if (this.showDots) {
    //   ctx.lineWidth = 1;
    //   ctx.fillStyle = 'white';
    //   ctx.strokeStyle = 'black';
    //
    //   if (objects) {
    //     for (var i = 0; i < objects.length; i++) {
    //       var stroke = objects[i];
    //       for (var j = 0; j < stroke.points.length; j++) {
    //         var p = stroke.points[j];
    //         p = this.worldToScreen(p.x, p.y);
    //         var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
    //         ctx.beginPath();
    //         ctx.rect(x - 1, y - 1, 3, 3);
    //         ctx.fill();
    //         ctx.stroke();
    //       }
    //     }
    //   }
    // }
    //
    // ctx.restore();
  }

  clearOverlay() {
    let ctx = this.overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
  }

  clearDisplayList() {
    this.dislayList = [];
  }

  addDisplayItem(item) {
    this.dislayList.push(item);
    // console.log('display item', item);
  }

  renderDisplayItem(item) {
    let ctx = this.canvas.getContext('2d');
    let points = item.points;

    if (points) {
      let screen = (item.screen != undefined ? item.screen : false);
      let fill = (item.fill ? item.fill.toHexString() : null);
      let strokeStyle = (item.color ? item.color.toHexString() : Const.COLOR_STROKE.toHexString());
      let lineWidth = (item.thickness != undefined ? item.thickness : Const.LINE_WIDTH);
      // var alpha = (options.alpha != undefined ? options.alpha : 1.0);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let x = point.x, y = point.y;

        if (!screen) {
          let p = this.worldToScreen(x, y);
          x = p.x, y = p.y;
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

      if (fill) {
        // ctx.fillStyle = stroke.selected ? 'rgba(30, 144, 255, 0.5)' : 'white';
        // ctx.globalAlpha = 0.5;
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ctx.globalAlpha = this.globalAlpha;
      ctx.lineWidth = lineWidth; //Const.LINE_WIDTH;
      // ctx.strokeStyle = stroke.selected ? 'dodgerblue' : Const.color.STROKE;
      // ctx.strokeStyle = Const.color.STROKE;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();

      // ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  render() {
    this.clear();
    this.clearOverlay();

    if (this.tool) this.tool.render(this.overlayCanvas.getContext('2d'));

    let ctx = this.canvas.getContext('2d');

    // ctx.fillStyle = 'black';
    // ctx.fillRect(0, 0, 100, 100);

    for (let i = 0; i < this.dislayList.length; i++) {
      let item = this.dislayList[i];
      // let color = item.color ? item.color.toHexString() : undefined;
      // let fill = item.fill ? item.fill.toHexString() : undefined;
      // let thickness = item.thickness ? item.thickness : undefined;
      // this.renderPath({ points: item.points, thickness: item.thickness, fill: item.fill, color: item.color });

      this.renderDisplayItem(item);
    }
    // console.log('paper-rendered', this.dislayList.length, 'strokes');

    ctx.drawImage(this.overlayCanvas, 0, 0);
    // if (tool)
    // console.log('paper-render');
  }

  setMode(mode) {
    this.mode = mode;
    this.emit('change-mode', { mode: mode });
  }

  beginMouseCapture() {
    this.emit('request-capture', { state: true });
  }

  endMouseCapture() {
    this.emit('request-capture', { state: false });
  }

  onBlur(event) {
    this.endMouseCapture();
    this.mode = null;
  }

  onMouseDown(event) {
    // console.log('paper-down');
    this.mouseDown = true;

    if (this.mode === 'pan') {
      this.beginMouseCapture();
    } else {
      if (this.tool) {
        this.tool.handleEvent(event);
      }
      // event.preventDefault();
      // event.stopPropagation();
    }

    // console.log('doen');
    // if (event.target === this.el) {
    //   if (this.mode === 'pan') {
    //     // this.setMode('pan');
    //
    //   } else {
    //     this.tool.handleEvent(event);
    //   }
    // }

    // window.addEventListener('mouseup', this);
    // window.addEventListener('mousemove', this);
  }

  onMouseMove(event) {
    if (this.mode === 'pan') {
      if (event.buttons === 1) {
        var dx = -event.movementX / this.scale;
        var dy = -event.movementY / this.scale;
        this.panCameraBy(dx, dy);
        this.render();
      }
    } else {
      if (this.tool) this.tool.handleEvent(event);

      // if (mouseDownTargetTag) {
        // if (mouseDownTargetTag === 'paper') {
        //   this.tool.handleEvent(event);
        //   event.preventDefault();
        //   event.stopPropagation();
        // } else {
          // var target = tags[mouseDownTargetTag];
          // if (target) {
          //   target.handleEvent(event);
          // }
      //   }
      // } else {
      //   // if (mouseTargetTag === 'paper') {
      //   // }
      // }
    }

    // if (this.mode === 'pan') {
    //   if (event.buttons === 1) {
    //     this.panCameraBy(-app.mouseDeltaX / this.scale, -app.mouseDeltaY / this.scale);
    //     this.render();
    //   }
    // } else {
    //   this.tool.handleEvent(event);
    // }
  }

  onMouseUp(event) {
    // if (this.tool) {
    //   this.tool.handleEvent(event);
    // }

    // window.removeEventListener('mouseup', this);
    // window.removeEventListener('mousemove', this);

    if (this.mode === 'pan') {
      if (event.buttons === 1) {
        this.setMode('tool');
      }
      this.endMouseCapture();
    } else {
      if (this.tool) this.tool.handleEvent(event);
    }

    this.mouseDown = false;
  }

  onKeyDown(event) {
    if (event.key === Const.KEY_PAN) {
      event.preventDefault();
      if (!event.repeat) {
        // console.log('pan');
        if (!this.mouseDown) {
          this.setMode('pan');
        }
      }
    } else {
      if (this.tool) {
        this.tool.handleEvent(event);
      }
    }

    // if (event.key === Const.KEY_DRAG) {
    //   event.preventDefault();
    //   if (!event.repeat) {
    //     if (!app.mouseLeft) {
    //       this.setMode('pan');
    //     }
    //   }
    // }
    // else if (event.key === 'd' && !event.repeat) {
    //   this.showDots = !this.showDots;
    //   this.render();
    // }
    // else if (event.key === 'h' && !event.repeat) {
    //   this.center();
    //   this.render();
    // }
    // else {
    //   if (this.tool) this.tool.handleEvent(event);
    // }
  }

  onKeyUp(event) {
    if (event.key === Const.KEY_PAN) {
       if (!this.mouseDown) {
         this.setMode('tool');
       }
    } else {
      if (this.tool) this.tool.handleEvent(event);
    }

    // if (event.key === Const.KEY_DRAG) {
    //    if (!app.mouseLeft) {
    //      this.setMode('tool');
    //    }
    // } else {
    //   if (this.tool) this.tool.handleEvent(event);
    // }
  }



  onPaste(event) {
    // console.log(event.clipboardData.types);
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
    else if (event.type === 'paste') {
      this.onPaste(event);
    }
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = Paper;
