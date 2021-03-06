const Point = require('../../geom/point');
const Transform = require('../../transform');
const Surface = require('../../surface');
const Renderer = require('../../renderer');
const DisplayList = require('../../display_list');
const Stroke = require('../../stroke');

const Base = require('../base');
const Tools = require('../../tools/');

class Paper extends Base {
  constructor(params={}) {
    super(params);

    this.canvasWidth = this.el.offsetWidth;
    this.canvasHeight = this.el.offsetHeight;

    this.scale = 1.0;
    this.width = params.width || 320;
    this.height = params.height || 200;

    this.tx = 0;
    this.ty = 0;

    this.tx = (this.width / 2) >> 0;
    this.ty = (this.height / 2) >> 0;

    this.globalAlpha = 1.0;

    this.tool = null;
    this.mode = null;

    this.tools = {};
    this.tools.pointer = new Tools.Pointer();
    this.tools.pencil = new Tools.Pencil();
    this.tools.line = new Tools.Line();
    this.tools.polygon = new Tools.Polygon();
    this.tools.hand = new Tools.Hand();
    this.tools.zoom = new Tools.Zoom();

    this.mouseDown = false;

    this.cursorX = 0;
    this.cursorY = 0;

    this.surface = new Surface({ width: this.canvasWidth, height: this.canvasHeight });
    this.renderer = new Renderer();

    this.el.appendChild(this.surface.canvas);
  }

  resize(width, height) {
    this.surface.resize(width, height);
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCameraPosition(x, y) {
    this.tx = x;
    this.ty = y;

    let xmax = this.width / 2;
    let ymax = this.height / 2;

    if (this.tx < 0) {
      this.tx = 0;
    } else if (this.tx > this.width) {
      this.tx = this.width;
    }

    if (this.ty < 0) {
      this.ty = 0;
    } else if (this.ty > this.height) {
      this.ty = this.height;
    }
  }

  setCursor(name) {
    if (name === undefined) {
      this.el.style.cursor = App.cursors[this.tool.cursor];
    } else {
      this.el.style.cursor = App.cursors[name];
    }
  }

  center() {
    this.setCameraPosition((this.width / 2) >> 0, (this.height / 2) >> 0);
    this.setZoom(1);
    this.render();
  }

  panCameraBy(x, y) {
    this.setCameraPosition(this.tx + x, this.ty + y);
    this.render();
  }

  setZoom(value) {
    if (value <= 5 && value >= 0.05) {
      this.scale = ((value * 100) >> 0) / 100;
      if (this.scale == 1) {
        this.tx = this.tx >> 0;
        this.ty = this.ty >> 0;
      }
    }
  }

  zoomIn() {
    var self = this;
    var level = App.zoomLevels.find(function(element) {
      return element > self.scale;
    });
    if (level) this.setZoom(level);
    this.render();
  }

  zoomOut() {
    var level;
    for (var i = App.zoomLevels.length - 1; i >= 0; i--) {
      level = App.zoomLevels[i]
      if (level < this.scale) break;
    }
    if (level) this.setZoom(level);
    this.render();
  }

  zoomCameraBy(x) {
    var value = this.scale;
    value = value + x;
    this.setZoom(value);
  }

  getScreenToWorldTransform() {
    // let t = new Transform();
    // var widthHalf = (this.canvas.width / 2);
    // var heightHalf = (this.canvas.height / 2);
    // t.x = -widthHalf;
    // t.y = -heightHalf;
    // t.scale = 1 / this.scale;
    // return t;
  }

  screenToWorld(x, y) {
    // var widthHalf = (this.canvasWidth / 2) >> 0;
    // var heightHalf = (this.canvasHeight / 2) >> 0;
    var widthHalf = (this.canvasWidth / 2);
    var heightHalf = (this.canvasHeight / 2);

    var px = x - widthHalf;
    var py = y - heightHalf;

    var sx = px / this.scale;
    var sy = py / this.scale;

    var tx = sx + this.tx;
    var ty = sy + this.ty;

    return new Point(tx, ty);
  }

  getWorldToScreenTransform() {
    return new Transform(
      (this.canvasWidth / 2) - this.tx * this.scale,
      (this.canvasHeight / 2) - this.ty * this.scale,
      this.scale
    );
  }

  worldToScreen(x, y) {
    var tx = x - (this.tx);
    var ty = y - (this.ty);

    var sx = (tx * this.scale);
    var sy = (ty * this.scale);

    // var widthHalf = (this.canvasWidth / 2) >> 0;
    // var heightHalf = (this.canvasHeight / 2) >> 0;
    var widthHalf = (this.canvasWidth / 2);
    var heightHalf = (this.canvasHeight / 2);

    return new Point(sx + widthHalf, sy + heightHalf);
  }

  setTool(name) {
    let tool = this.tools[name];
    if (tool) {
      if (tool !== this.tool) {
        if (this.tool) {
          this.tool.blur();
        }
        this.tool = tool;
        this.tool.focus();
        this.setCursor(this.tool.cursor);
      }
    } else {
      console.log('setTool', name, 'doesn\'t exist');
    }
  }

  addDisplayItem(item) {
    this.renderer.displayList.add(item);
  }

  clearDisplayList() {
    this.renderer.displayList.clear();
  }

  render() {
    this.surface.clear();

    let ctx = this.surface.getContext();
    ctx.save();
    ctx.fillStyle = App.colors.workspace.toHexString();
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    let p1 = this.worldToScreen(0, 0);
    ctx.fillStyle = App.colors.paper.toHexString();
    ctx.fillRect((p1.x >> 0), (p1.y >> 0), this.width * this.scale, this.height * this.scale);
    ctx.restore();

    if (this.tool) {
      ctx.save();
      this.tool.render(ctx);
      ctx.restore();
    }

    let transform = this.getWorldToScreenTransform();
    this.renderer.renderToSurface(this.surface, transform);

    // let ctx = this.canvas.getContext('2d');
    // ctx.save();
    // this.renderDisplayList(ctx, this.displayList);
    // ctx.drawImage(this.overlayCanvas, 0, 0);
    // ctx.restore();
  }

  updateCursor() {
    let x = App.cursorX;
    let y = App.cursorY;
    let ctx = this.canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let data = imageData.data;
    let index = (y * this.canvas.width + x) * 4;
    let avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
    if (avg <= 128) {
      this.setCursor(this.tool.cursorInverted);
    } else {
      this.setCursor(this.tool.cursor);
    }
  }

  // enableInteraction() {
  //   this.el.pointerEvents = 'auto';
  // }
  //
  // disableInteraction() {
  //   this.el.pointerEvents = 'none';
  // }

  onFocus(event) {
    if (this.tool) {
      this.tool.focus();
    }
  }

  onBlur(event) {
    this.mode = null;
    if (this.tool) {
      this.tool.blur();
    }
  }

  onMouseDown(event) {
    this.mouseDown = true;

    if (event.button === 1) {
      event.preventDefault();
      event.stopPropagation();
      this.center();
    }

    if (this.tool) {
      this.tool.handleEvent(event);
    }
  }

  onMouseUp(event) {
    this.mouseDown = false;
  }

  onMouseMove(event) {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  onKeyDown(event) {
    if (this.tool) this.tool.handleEvent(event);
  }

  onKeyUp(event) {
    if (this.tool) this.tool.handleEvent(event);
  }

  onPaste(event) {
    // console.log(event.clipboardData.types);
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
    else if (event.type === 'mousemove') {
      this.onMouseMove(event);
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
