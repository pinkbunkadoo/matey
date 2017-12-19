const Const = require('../../const');
const Point = require('../../geom/point');
const Base = require('../base');
const Tools = require('../../tools/');
const Stroke = require('../../stroke');

class Paper extends Base {
  constructor(el) {
    super(el);

    this.canvasWidth = this.el.offsetWidth;
    this.canvasHeight = this.el.offsetHeight;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.pointerEvents = 'none';
    // this.canvas.style.background = 'blue';
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

    this.tool = null;
    this.mode = null;

    this.tools = {};
    this.tools.pointer = new Tools.Pointer();
    this.tools.pointer.on('marquee', (params) => {
      // var p1 = this.screenToWorld(params.xmin, params.ymin);
      // var p2 = this.screenToWorld(params.xmax, params.ymax);
      //
      // app.marqueeSelect(p1.x, p1.y, p2.x, p2.y);
      //
      // if (app.selection.items.length === 1)
      //   app.showProperties(app.selection.items[0]);
      // else
      //   app.showProperties();
      //
      // app.render();
    });
    this.tools.pointer.on('pick', (params) => {
      if (app.selection.items.length === 1)
        app.showProperties(params.stroke);
      else
        app.showProperties();
      app.render();
    });
    this.tools.pointer.on('moved', (params) => {
      app.updateFrameListThumbnail(app.frame);
      app.render();
    });
    this.tools.pointer.on('drag', (params) => {
      // app.updateFrameListIcon(app.sequence.frame);
      app.render();
    });
    this.tools.pointer.on('delete', (params) => {
      app.deleteSelected();
      // app.addAction(new Actions.Delete());
      app.updateFrameListThumbnail(app.frame);
      app.render();
    });
    this.tools.pointer.on('change', (params) => {
      // console.log('change');
      app.render();
    });

    this.tools.pencil = new Tools.Pencil();
    this.tools.pencil.on('stroke', (params) => {
      app.createStroke(params.points, app.getColor(), app.getFill());
    });
    this.tools.pencil.on('change', (params) => {
      // console.log('change');
      app.render();
    });

    this.tools.line = new Tools.Line();
    this.tools.line.on('stroke', (params) => {
      // console.log('line-stroke');
      app.createStroke(params.points, app.getColor(), app.getFill());
      // app.addAction(new Actions.Line());
    });
    this.tools.line.on('change', (params) => {
      app.render();
    });

    this.tools.polygon = new Tools.Polygon();
    this.tools.polygon.on('change', (params) => {
      this.render();
    });
    this.tools.polygon.on('stroke', (params) => {
      // app.createStroke(params.points);
      app.createStroke(params.points, app.getColor(), app.getFill());
    });

    this.tools.hand = new Tools.Hand();
    this.tools.hand.on('pan', (params) => {
      var dx = params.dx, dy = params.dy;
      dx = dx / this.scale;
      dy = dy / this.scale;
      this.panCameraBy(dx, dy);
      app.render();
    });

    this.tools.zoom = new Tools.Zoom();
    this.tools.zoom.on('cursor-change', (params) => {
      app.setCursor(params.cursor);
    });
    this.tools.zoom.on('zoom-in', (params) => {
      this.zoomIn();
      app.render();
    });
    this.tools.zoom.on('zoom-out', (params) => {
      this.zoomOut();
      app.render();
    });

    // this.setTool('pencil');
    // this.setMode('tool');

    // this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('mousemove', this);
    // window.addEventListener('keydown', this);
    // window.addEventListener('keyup', this);

    this.dislayList = [];
    this.mouseDown = false;

    this.cursorX = 0;
    this.cursorY = 0;
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
    // console.log(x, y);
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

  setTool(name) {
    let tool = this.tools[name];

    if (tool !== this.tool) {
      if (this.tool) {
        this.tool.blur();
      }
      this.tool = tool;
      this.tool.focus();
      this.setCursor(this.tool.cursor);

      // if (app.tool) {
      //   app.tool.blur();
      //   app.previousTool = app.tool;
      // }
      // app.tool = app.tools[name];
      // app.tool.focus();
      // app.setCursor(app.tool.cursor);
      // app.ui.tools.setTool(name);
      // app.ui.paper.tool = app.tool;
      // }
    }
  }

  setCursor(name) {
    // this.cursor = name;
    // this.el.style.cursor = app.cursors[name];
    app.setCursor(name);
  }

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

  clear() {
    var ctx = this.canvas.getContext('2d');
    // ctx.save();

    ctx.fillStyle = Const.COLOR_WORKSPACE.toHexString();
    // ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    var p1 = this.worldToScreen(0, 0);
    ctx.fillStyle = Const.COLOR_PAPER.toHexString();
    ctx.lineWidth = 1;
    // ctx.setLineDash([2, 4]);
    // ctx.lineDashOffset = 5;
    ctx.strokeStyle = 'rgba(180, 180, 180, 1)';
    ctx.beginPath();
    ctx.rect((p1.x >> 0) + 0.5, (p1.y >> 0) + 0.5, this.width * this.scale, this.height * this.scale);
    ctx.stroke();
    ctx.fill();

    ctx.restore();
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

  // setMode(mode) {
  //   this.mode = mode;
  //   // console.log(mode);
  //   this.emit('change-mode', { mode: mode });
  // }

  // beginCapture() {
  //   app.capture(this);
  // }
  //
  // endCapture() {
  //   app.release();
  // }
  //
  onFocus(event) {
    if (this.tool) {
      this.tool.focus();
    }
    // console.log('paper-focus');
  }

  onBlur(event) {
    // this.endCapture();

    this.mode = null;

    if (this.tool) {
      this.tool.blur();
    }
    // console.log('paper-blur');
  }

  onMouseDown(event) {
    this.mouseDown = true;

    // if (event.button === 0) {
    //   this.beginCapture();
    // }

    // if (this.mode === 'pan') {
    //   this.beginCapture();
    // } else {
    // }
    if (this.tool) {
      this.tool.handleEvent(event);
    }
  }

  onMouseUp(event) {
    // if (this.mode === 'pan') {
    //   this.endCapture();
    //   if (event.buttons === 1) {
    //     this.setMode('tool');
    //   }
    // } else {
    //   // if (this.tool) this.tool.handleEvent(event);
    // }

    // if (this.tool) this.tool.handleEvent(event);
    this.mouseDown = false;
  }

  onMouseMove(event) {
    if (document.pointerLockElement === this.canvas) {
      this.cursorX += event.movementX;
      this.cursorY += event.movementY;
    } else {
      this.cursorX = event.clientX;
      this.cursorY = event.clientY;
    }

    // if (this.tool) this.tool.handleEvent(event);

    if (this.mode === 'pan') {
      // if (event.buttons === 1) {
      //   var dx = -event.movementX / this.scale;
      //   var dy = -event.movementY / this.scale;
      //   this.panCameraBy(dx, dy);
      //   this.render();
      // }
    } else {
      // if (this.tool) this.tool.handleEvent(event);
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

  onKeyDown(event) {
    // if (this.mode ===) {
    //
    // }
    // if (event.key === Const.KEY_PAN) {
    //   event.preventDefault();
    //   if (!event.repeat) {
    //     if (!this.mouseDown) {
    //       this.setMode('pan');
    //     }
    //   }
    // } else {
    //   if (this.tool) {
    //     this.tool.handleEvent(event);
    //   }
    // }

  }

  onKeyUp(event) {
    // if (event.key === Const.KEY_PAN) {
    //    if (!this.mouseDown) {
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
    else if (event.type === 'focus') {
      this.onFocus(event);
    }
  }
}

module.exports = Paper;
