
const simplify = require('./js/lib/simplify.js');
const util = require("./js/util.js");

const Point = require('./js/geom/point.js');
const Vector = require('./js/geom/vector.js');

const PointerTool = require('./js/tool/pointer_tool.js');
const PencilTool = require('./js/tool/pencil_tool.js');
const LineTool = require('./js/tool/line_tool.js');
const KnifeTool = require('./js/tool/knife_tool.js');
const ZoomTool = require('./js/tool/zoom_tool.js');
const ClipTool = require('./js/tool/clip_tool.js');

const PencilAction = require('./js/action/pencil_action.js');

const Spacer = require('./js/ui/spacer');
const ToolButton = require('./js/ui/tool_button');

const Frame = require('./js/frame.js');
const Loader = require('./js/loader.js');

const COLOR_STROKE = 'rgb(128, 128, 128)';
const COLOR_PAPER = 'rgb(248, 248, 248)';
const KEY_DRAG = ' ';
const LINE_WIDTH = 1.2;

const PREFIX = './';

const ZOOM_LEVELS = [ 0.25, 0.5, 0.75, 1.0, 1.5, 2, 3, 5 ];

var imagesToLoad = [
  'images/brush_8x8.png',
  'images/brush_16x16.png',
  'images/icon_pointer.svg',
  'images/icon_pencil.svg',
  'images/icon_line.svg',
  'images/icon_zoom.svg',
  'images/icon_knife.svg',
  'images/icon_clip.svg',
  'images/icon_onion.svg',
  'images/icon_new.svg',
  'images/icon_copy.svg',
  'images/icon_delete.svg'
];

var App = function() {
  this.imageCount = imagesToLoad.length;
  this.images = {};

  this.mode = null;
  this.tool = null;
  this.points = null;
  this.strokes = [];
  this.scale = 1.0;
  this.startX = 0;
  this.startY = 0;
  this.width = 640;
  this.height = 360;
  this.tx = (this.width / 2) >> 0;
  this.ty = (this.height / 2) >> 0;
  this.toolButtons = [];
  this.selection = [];
  this.frame = null;
  this.frames = [];
  this.frameNo = 0;
  this.key = [];

  this.dots = false;
  this.onion = false;

  this.history = [];

  this.showZoom = false;
  this.dirty = true;

  document.addEventListener('DOMContentLoaded', this.startup.bind(this));
};

App.prototype.constructor = App;

App.prototype = {

startup: function() {
  console.log('startup');
  // console.log(__dirname);

  this.loadImages();
},

loadUI: function() {
  this.container = document.getElementById('container');

  this.canvas = document.getElementById('surface');
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.overlay = document.createElement('canvas');
  this.overlay.width = window.innerWidth;
  this.overlay.height = window.innerHeight;

  this.background = document.createElement('canvas');
  this.background.width = this.width;
  this.background.height = this.height;

  this.cursors = [];
  this.cursors['pointer'] = 'url(' + PREFIX + '/images/cursor_pointer.png) 1 1, auto';
  this.cursors['pencil'] = 'url(' + PREFIX + '/images/cursor_pencil.png) 1 1, auto';
  this.cursors['line'] = 'url(' + PREFIX + '/images/cursor_line.png) 3 3, auto';
  this.cursors['hand'] = 'url(' + PREFIX + '/images/cursor_hand.png) 12 12, auto';
  this.cursors['zoomin'] = 'url(' + PREFIX + '/images/cursor_zoomin.png) 7 7, auto';
  this.cursors['zoomout'] = 'url(' + PREFIX + '/images/cursor_zoomout.png) 7 7, auto';

  this.initEventListeners();

  var toolsEl = document.createElement('div');
  toolsEl.className = 'toolsEl';
  toolsEl.style.display = 'flex';
  toolsEl.style.padding = '4px';
  toolsEl.style.flexDirection = 'column';
  toolsEl.style.alignItems = 'center';
  toolsEl.style.position = 'fixed';
  toolsEl.style.left = '0px';
  toolsEl.style.top = '0px';
  toolsEl.style.borderRadius = '0 6px 6px 0';
  toolsEl.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  this.toolsEl = toolsEl;

  this.tools = [];
  this.tools['pointer'] = new PointerTool();
  this.tools['pencil'] = new PencilTool();
  this.tools['line'] = new LineTool();
  this.tools['clip'] = new ClipTool();
  this.tools['knife'] = new KnifeTool();
  this.tools['zoom'] = new ZoomTool();

  var toolButton = new ToolButton(app.images['images/icon_pointer.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['clip'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('clip');
  });

  toolButton = new ToolButton(app.images['images/icon_pencil.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['pencil'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('pencil');
  });

  toolButton = new ToolButton(app.images['images/icon_line.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['line'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('line');
  });

  toolButton = new ToolButton(app.images['images/icon_knife.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['knife'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('knife');
  });

  toolButton = new ToolButton(app.images['images/icon_zoom.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['zoom'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('zoom');
  });

  document.body.appendChild(toolsEl);

  var statusEl = document.createElement('div');
  statusEl.style.display = 'flex';
  statusEl.style.flexDirection = 'row';
  statusEl.style.position = 'absolute';
  statusEl.style.alignItems = 'center';
  statusEl.style.bottom = '0px';
  statusEl.style.height = '32px';
  statusEl.style.width = '100%';
  statusEl.style.paddingLeft = '8px';
  statusEl.style.paddingRight = '8px';
  statusEl.style.boxSizing = 'border-box';
  statusEl.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  statusEl.style.cursor = 'default';
  this.statusEl = statusEl;

  var viewEl = document.createElement('div');
  viewEl.style.display = 'flex';
  viewEl.style.flexDirection = 'row';
  viewEl.style.alignItems = 'center';
  viewEl.style.flex = 'auto';

  var zoomEl = document.createElement('div');
  viewEl.appendChild(zoomEl);
  this.zoomEl = zoomEl;

  viewEl.appendChild((new Spacer(20, 20)).getElement());

  var button = new ToolButton(app.images['images/icon_onion.svg'], 24, 20);
  button.onMouseDown = (function() {
    app.toggleOnion();
    this.setState(app.onion);
  });
  viewEl.appendChild(button.getElement());

  statusEl.appendChild(viewEl);
  this.viewEl = viewEl;

  var frameEl = document.createElement('div');
  // frameEl.style.position = 'fixed';
  // frameEl.style.bottom = "48px";
  frameEl.style.flex = 'auto';
  frameEl.style.fontSize = '13px';
  statusEl.appendChild(frameEl);
  this.frameEl = frameEl;

  var frameButtonsEl = document.createElement('div');
  frameButtonsEl.style.display = 'flex';
  frameButtonsEl.style.flexDirection = 'row';

  var button = new ToolButton(app.images['images/icon_new.svg'], 24, 20);
  button.onMouseDown = (function() {
    app.insertFrame(new Frame(), app.frameNo + 1);
  });
  frameButtonsEl.appendChild(button.getElement());

  var button = new ToolButton(app.images['images/icon_copy.svg'], 24, 20);
  button.onMouseDown = (function() {
    app.insertFrame(app.frame.copy(), app.frameNo + 1);
  });
  frameButtonsEl.appendChild(button.getElement());

  var button = new ToolButton(app.images['images/icon_delete.svg'], 23, 20);
  button.onMouseDown = (function() {
    app.deleteFrame(app.frameNo);
  });
  frameButtonsEl.appendChild(button.getElement());

  statusEl.appendChild(frameButtonsEl);
  this.frameButtonsEl = frameButtonsEl;

  // var spacerEl = document.createElement('div');
  // spacerEl.style.flex = 'auto';
  // statusEl.appendChild(spacerEl);

  document.body.appendChild(statusEl);

  this.frame = new Frame();
  this.frames.push(this.frame);
  this.goFrame(0);

  this.setTool('pencil');
  this.setMode('tool');
  this.updateStatus();

  this.moveTools();

  this.step();
},

loadImages: function() {
  imageCount = imagesToLoad.length;

  function onImageLoad(event) {
    var filename = this.filename.substring(PREFIX.length);
    var ext = this.ext;
    var contentType = event.target.contentType;

    if (contentType === 'image/png') {
      var image = new Image();
      image.src = URL.createObjectURL(event.target.response);
      app.images[filename] = image;

    } else if (contentType === 'image/svg+xml') {
      app.images[filename] = event.target.responseXML.documentElement;
    }

    app.imageCount--;
    if (app.imageCount === 0) {
      app.loadUI();
    }
  }

  for (var i = 0; i < imagesToLoad.length; i++) {
    Loader.load(PREFIX + imagesToLoad[i], onImageLoad);
  }

},

requestDraw: function() {
  this.dirty = true;
},

setCursor: function(name) {
  this.container.style.cursor = this.cursors[name];
},

toggleOnion: function() {
  app.onion = !app.onion;
  app.requestDraw();
},

setTool: function(toolName) {

  if (this.tool !== this.tools[toolName]) {

    if (this.tool) {
      this.toolButtons[this.tool.name].setState(false);
      this.tool.blur();
    }

    if (toolName == 'pencil') {
      this.setCursor('pencil');

    } else if (toolName == 'line') {
      this.setCursor('line');

    } else if (toolName == 'zoom') {
      this.setCursor('zoomin');

    } else {

      this.setCursor('pointer');

    }

    this.tool = this.tools[toolName];
    this.tool.focus();
    this.toolButtons[toolName].setState(true);

  }
},


setMode: function(mode) {
  if (this.mode != mode) {
    // console.log('setMode', mode);

    if (this.mode == 'drag') {
      // this.cursor.innerHTML = '';
    }
    if (mode == 'tool') {
      if (this.tool.name == 'pencil') {
        this.setCursor('pencil');

      } else if (this.tool.name == 'zoom') {
        this.setCursor('zoomin');

      } else {
        this.setCursor('pointer');
      }
    } else if (mode == 'drag') {
      // this.cursor.appendChild(this.cursorHand);
      // this.cursor.style.marginLeft = '-12px';
      // this.cursor.style.marginTop = '-12px';
      // this.setCursor('crosshair');
      // this.container.style.cursor = 'none';
      this.setCursor('hand');
    }
    this.mode = mode;
  }
},

setCameraPosition: function(x, y) {
  this.tx = x;
  this.ty = y;
  this.requestDraw();
},

center: function() {
  this.setCameraPosition((this.width / 2) >> 0, (this.height / 2) >> 0);
  this.setZoom(1);
},

panCameraBy: function(x, y) {
  this.setCameraPosition(this.tx + x, this.ty + y);
},

setZoom: function(value) {
  if (value <= 5 && value >= 0.05) {
    this.scale = ((value * 100) >> 0) / 100;
    if (this.scale == 1) {
      this.tx = this.tx >> 0;
      this.ty = this.ty >> 0;
    }
    this.requestDraw();
    this.updateStatus();
  }
},

zoomIn: function() {
  var level = ZOOM_LEVELS.find(function(element) {
    return element > app.scale;
  });
  if (level) this.setZoom(level);
},


zoomOut: function() {
  var level;
  for (var i = ZOOM_LEVELS.length - 1; i >= 0; i--) {
    level = ZOOM_LEVELS[i]
    if (level < app.scale) break;
  }
  if (level) this.setZoom(level);
},


zoomCameraBy: function(x) {
  var value = this.scale;
  value = value + x;

  this.setZoom(value);
},


screenToWorld: function(x, y) {
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
},


worldToScreen: function(x, y) {
  var tx = x - (this.tx);
  var ty = y - (this.ty);

  var sx = (tx * this.scale);
  var sy = (ty * this.scale);

  var widthHalf = (this.canvas.width / 2) >> 0;
  var heightHalf = (this.canvas.height / 2) >> 0;
  // var widthHalf = (this.canvas.width / 2);
  // var heightHalf = (this.canvas.height / 2);

  return new Point(sx + widthHalf, sy + heightHalf);
},


sendToBackground: function() {
  // var dataURL = this.canvas.toDataURL('image/png');
  // console.log(dataURL, dataURL.length);

  var ctx = this.background.getContext('2d');
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'black';

  for (var i = 0; i < this.frame.strokes.length; i++) {
    ctx.beginPath();
    var stroke = this.frame.strokes[i];
    for (var j = 0; j < stroke.points.length; j++) {
      var p = stroke.points[j];
      var x = p.x, y = p.y;

      if (j == 0)
        ctx.moveTo(x, y);
      else
        ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  this.frame.strokes = [];

  this.requestDraw();

  // for (var i = 0; i < this.frames.strokes.length; i++) {
  //   this.frames.strokes[i]
  // }
  // ctx.drawImage(this.canvas, 0, 0);
},


getStrokeAt: function(x, y, radius) {
  var p = new Point(x, y);
  var selection = null;

  for (var i = 0; i < this.frame.strokes.length; i++) {
    var stroke = this.frame.strokes[i];
    var bounds = stroke.getBounds();
    var xmin = bounds.x - radius;
    var ymin = bounds.y - radius;
    var xmax = bounds.x + bounds.width + radius;
    var ymax = bounds.y + bounds.height + radius;

    if (util.pointInRect(x, y, xmin, ymin, xmax, ymax)) {
      for (var j = 1; j < stroke.points.length; j++) {
        var point = stroke.points[j];
        if (j > 0) {
          var a = stroke.points[j - 1];
          var b = point;
          var c = p;

          var v0 = Vector.subtract(new Vector(b.x, b.y), new Vector(a.x, a.y));
          var v1 = Vector.subtract(new Vector(c.x, c.y), new Vector(a.x, a.y));

          var angle = Vector.angleBetween(v0, v1);
          var adjacent = Vector.dot(v0, v1) / v0.magnitude();
          var opposite = Math.tan(angle) * adjacent;
          var ratio = adjacent / v0.magnitude();

          var v2 = Vector.multiply(v0, ratio);
          var v3 = Vector.subtract(v2, v1);

          if (opposite < radius && adjacent > 0 && adjacent < v0.magnitude()) {
            // selection = { p1: a, p2: b, p3: new Point(a.x + v2.x, a.y + v2.y) };
            selection = stroke;
            break;
          }
        }
      }
    }
    if (selection) break;
  }

  return selection;
},

select: function(region) {
  this.frame.select(region);
  this.requestDraw();
},

selectStroke: function(stroke) {
  this.frame.selectStroke(stroke);
},

invertSelection: function() {
  this.frame.invertSelection();
  this.requestDraw();
},

clearSelection: function() {
  this.frame.clearSelection();
  this.requestDraw();
},

deleteSelected: function() {
  this.frame.deleteSelected();
  this.requestDraw();
},

addStroke: function(stroke) {
  this.frame.addStroke(stroke);
  this.requestDraw();
},

removeStroke: function(stroke) {
  var index = this.frame.strokes.indexOf(stroke);
  if (index !== -1) {
    this.frame.strokes.splice(index, 1);
    this.requestDraw();
  }
},

setStrokes: function(strokes) {
  this.frame.setStrokes(strokes);
  this.requestDraw();
},

updateStatus: function() {
  this.zoomEl.innerHTML = (this.scale * 100) + '%';
  this.frameEl.innerHTML = (this.frameNo+1) + ' / ' + this.frames.length;
},

goFrame: function(index) {
  if (index >= 0 && index < this.frames.length) {
    this.frameNo = index;
    this.frame = this.frames[index];
    this.history = this.frame.history;
    this.requestDraw();
    this.updateStatus();
  }
},

insertFrame: function(frame, index) {
  if (index === undefined) {
    this.frames.push(frame);
    index = this.frames.length - 1;
  } else {
    this.frames.splice(index, 0, frame);
  }
  this.frameNo = this.frames.indexOf(this.frame);
  this.updateStatus();
},

deleteFrame: function(index) {
  var frame = this.frames[index];
  if (frame) {
    if (frame === this.frame) {
      this.frames.splice(index, 1);
      if (this.frames.length == 0)
        this.insertFrame(new Frame());
      this.goFrame(index - 1 < 0 ? 0 : index - 1);
    } else {
      this.frames.splice(index, 1);
      this.frameNo = this.frames.indexOf(this.frame);
    }
  }
  this.updateStatus();
},

// undoAction: function(action) {
//   if (action instanceof PencilAction) {
//     app.removeStroke(action.stroke);
//   } else if (action instanceof ClipAction) {
//     this.frame.strokes = action.strokes;
//   }
// },
//
// doAction: function(action) {
//   if (action instanceof PencilAction) {
//     app.addStroke(action.stroke);
//   } else if (action instanceof ClipAction) {
//     this.frame.strokes = action.strokes;
//   }
// },
//
createUndo: function(action) {
  this.frame.history.add(action);
},

undo: function() {
  this.frame.historyBack();
  // console.log('undo', action);
  // if (action) action.undo();
  // console.log(action);
},

redo: function() {
  this.frame.historyForward();
  // if (action) action.redo();
  // console.log(action);
},

createPath: function(ctx, points) {
  ctx.beginPath();

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var p = this.worldToScreen(point.x, point.y);

    var x = p.x, y = p.y;
    // x = x >> 0, y = y >> 0;

    if (app.scale < 1.0) {
      // x = x >> 0, y = y >> 0;
      // x = Math.round(p.x), y = Math.round(p.y);
    }

    // this.scale < 1 ? (x = p.x >> 0, y = p.y >> 0) : (x = p.x, y = p.y);

    if (i == 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
  // if (points.length == 2) ctx.closePath();
},

getContext: function() {
  return this.canvas.getContext('2d');
},

getOverlayContext: function() {
  return this.overlay.getContext('2d');
},

drawBackground: function(ctx) {
  // var ctx = this.canvas.getContext('2d');
  var p = this.worldToScreen(0, 0);
  // var p2 = this.worldToScreen(this.width, this.height);

  ctx.globalAlpha = 0.1;
  ctx.drawImage(this.background, p.x>>0, p.y>>0, this.width * this.scale, this.height * this.scale);
  ctx.globalAlpha = 1;

},

clearOverlay: function() {
  var ctx = this.overlay.getContext('2d');
  ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
  this.requestDraw();
},

drawOverlay: function(ctx) {
  ctx.drawImage(this.overlay, 0, 0);
},

draw: function() {
  var ctx = this.canvas.getContext('2d');

  if (this.dirty) {
    ctx.fillStyle = '#d0d0d0';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var p1 = this.worldToScreen(0, 0);
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect((p1.x >> 0), (p1.y >> 0), this.width * this.scale, this.height * this.scale);

    this.drawBackground(ctx);

    ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

    if (this.frameNo > 0 && this.onion) {
      ctx.globalAlpha = 0.25;
      this.frames[this.frameNo - 1].draw(ctx);
      ctx.globalAlpha = 1;
    }

    this.frame.draw(ctx);
    this.frame.drawExtras(ctx);

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.dots) {
      ctx.lineWidth = 1;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';

      for (var i = 0; i < this.frame.strokes.length; i++) {
        var stroke = this.frame.strokes[i];
        for (var j = 0; j < stroke.points.length; j++) {
          var p = stroke.points[j];
          p = this.worldToScreen(p.x, p.y);
          var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
          ctx.beginPath();
          ctx.rect(x - 1, y - 1, 3, 3);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    if (this.showZoom) {
      ctx.fillText(this.scale * 100, 10, window.innerHeight - 32);
    }

    if (app.tool) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
      app.tool.draw(ctx);
      ctx.restore();
    }

    this.dirty = false;
  }
},


suspend: function() {
  this.suspended = true;
  window.cancelAnimationFrame(app.frameId);
},


resume: function() {
  this.suspended = false;
  this.step();
},


step: function() {
  if (!app.suspended) {
    // app.dirty = true;
    app.frameId = window.requestAnimationFrame(app.step);
    app.draw();
  }
},


onMouseDown: function(event) {
  if (event.buttons == 4) {
    event.preventDefault();
  }

  this.mouseLeft = (event.button === 0);
  this.mouseMiddle = (event.button === 1);

  this.mouseDownX = event.clientX, this.mouseDownY = event.clientY;
  this.downTarget = event.target;

  if (event.target === this.canvas) {
    if (this.key[KEY_DRAG]) {
      this.setMode('drag');

    // } else if (event.ctrlKey && this.mouseLeft) {
      // this.setMode('zoom');

    } else if (this.mouseMiddle) {
      // console.log('middle');
      this.center();

    } else {
      this.tool.onMouseDown(event);
    }
  }
},


onMouseUp: function(event) {

  this.mouseLeft = false;

  if (this.mode == 'tool') {
    this.tool.onMouseUp(event);

  } else {
    if (this.mode == 'zoom') {
      // var x = Math.abs(event.clientX - this.startX), y = Math.abs(event.clientY - this.startY);
      // if (x < 2 && y < 2) {
      //   this.scale = 1.0;
      // }
      // this.setMode('tool');

    } else if (this.mode == 'drag') {
      if (!this.key[KEY_DRAG] && !this.mouseLeft) {
        this.setMode('tool');
      }
    }
  }

  this.downTarget = null;
},


onMouseMove: function(event) {
  var x = event.clientX, y = event.clientY;

  this.mouseX = x, this.mouseY = y;
  this.mouseDeltaX = x - this.previousMouseX, this.mouseDeltaY = y - this.previousMouseY;

  if (this.mode == 'tool') {
    this.tool.onMouseMove(event);

  } else if (this.mode == 'drag') {
    if (event.buttons == 1) {
      this.panCameraBy(-this.mouseDeltaX / this.scale, -this.mouseDeltaY / this.scale);
    }
  }

  this.previousMouseX = x, this.previousMouseY = y;
},


onMouseOut: function(event) {
  if (this.mode == 'tool') {
    this.tool.onMouseOut(event);
  }
},


onWheel: function(event) {
  // this.zoomCameraBy((event.deltaY * this.scale) * 0.002);
  // if (event.ctrlKey) {
  //   this.zoomCameraBy((event.deltaX * this.scale) * 0.002);
  // } else {
  //   this.panCameraBy((event.deltaX / this.scale) * 0.5, (event.deltaY / this.scale) * 0.5);
  // }
},


onScroll: function(event) {
  event.preventDefault();
  event.stopPropagation();
},

moveTools: function() {
  var top = ((window.innerHeight - app.statusEl.offsetHeight) / 2 - app.toolsEl.offsetHeight / 2) >> 0;
  app.toolsEl.style.top = top + 'px';

  // app.frameEl.style.left = ((window.innerWidth / 2 - app.frameEl.offsetWidth / 2) >> 0) + 'px';
},

onResize: function() {
  // console.log('resize');
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.canvas.width = window.innerWidth;
      app.canvas.height = window.innerHeight;

      app.overlay.width = window.innerWidth;
      app.overlay.height = window.innerHeight;

      window.resizeTimeoutId = 0;
      app.requestDraw();
    }, 100);
  }

  if (window.resizeCooldownId) {
    clearTimeout(window.resizeCooldownId);
  }

  window.resizeCooldownId = setTimeout(function() {
    app.moveTools();
    window.resizeCooldownId = null;
  }, 250);

},


onBlur: function(event) {
  this.suspend();
  // console.log('blur');
},


onFocus: function(event) {
  this.resume();
  // console.log('resume');
},


onKeyDown: function(event) {
  // event.preventDefault();
  // event.stopPropagation();
  // console.log(event.shiftKey &&  event.key === 'z');
  // if (event.shiftKey) {
  //   console.log(event.key);
  // }

  if (event.key == KEY_DRAG) {
    event.preventDefault();

    if (!event.repeat) {
      this.key[KEY_DRAG] = true;

      if (!this.mouseLeft) {
        this.setMode('drag');
      }
    }

  } else if ((event.key == 'Delete' || event.key == 'Backspace') && !event.repeat) {
    this.deleteSelected();

  } else if (event.key == '1' && !event.repeat) {
    this.sendToBackground();

  } else if (event.key == 'd' && !event.repeat) {
    this.dots = !this.dots;
    this.requestDraw();

  // } else if (event.key == 'e' && !event.repeat) {
  //   this.setTool('eraser');
  } else if (event.key == 'k' && !event.repeat) {
    this.setTool('knife');

  } else if (event.key == 'c' && !event.repeat) {
    this.setTool('clip');

  } else if (event.key == 'q' && !event.repeat) {
    this.setTool('clip');

  } else if (event.key == 'b' && !event.repeat) {
    this.setTool('pencil');

  } else if (event.key == 'l' && !event.repeat) {
    this.setTool('line');

  } else if (event.key == 'i' && !event.repeat) {
    if (event.ctrlKey) app.invertSelection();

  } else if ((event.key === 'z' || event.key === 'Z') && !event.repeat) {
    if (event.shiftKey && event.ctrlKey) {
      this.redo();
    } else if (event.ctrlKey) {
      this.undo();
    } else {
      this.setTool('zoom');
    }

  } else if (event.key == '+' && !event.repeat) {

  } else if (event.key == ',') {
    if (event.ctrlKey) {
      if (event.altKey) {
        this.insertFrame(this.frame.copy(), this.frameNo - 1);
      } else {
        this.insertFrame(new Frame(), this.frameNo - 1);
      }
    } else {
      this.goFrame(this.frameNo - 1);
    }

  } else if (event.key == '.') {
    if (event.ctrlKey) {
      if (event.altKey) {
        this.insertFrame(this.frame.copy(), this.frameNo + 1);
      } else {
        this.insertFrame(new Frame(), this.frameNo + 1);
      }
    } else {
      this.goFrame(this.frameNo + 1);
    }
  // } else if (event.key == 'Backspace') {
    // this.deleteSelected();
  }

  if (this.mode == 'tool') this.tool.onKeyDown(event);
},


onKeyUp: function(event) {
  delete this.key[event.key];

  if (this.mode == 'drag' && !this.mouseLeft) {
    this.setMode('tool');
  }

  if (this.mode == 'tool') this.tool.onKeyUp(event);
},


onKeyPress: function(event) {
},


onContextMenu: function(event) {
  event.preventDefault();
},


handleEvent: function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  } else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  } else if (event.type == 'mousemove') {
    this.onMouseMove(event);
  } else if (event.type == 'wheel') {
    this.onWheel(event);
  } else if (event.type == 'scroll') {
    this.onScroll(event);
  } else if (event.type == 'resize') {
    this.onResize(event);
  } else if (event.type == 'blur') {
    this.onBlur(event);
  } else if (event.type == 'focus') {
    this.onFocus(event);
  } else if (event.type == 'keydown') {
    this.onKeyDown(event);
  } else if (event.type == 'keyup') {
    this.onKeyUp(event);
  } else if (event.type == 'keypress') {
    this.onKeyPress(event);
  } else if (event.type == 'contextmenu') {
    this.onContextMenu(event);
  }
},


initEventListeners: function() {
  window.addEventListener('mousedown', app);
  window.addEventListener('mouseup', app);
  window.addEventListener('mousemove', app);
  window.addEventListener('wheel', app);
  window.addEventListener('scroll', app);
  window.addEventListener('resize', app);
  window.addEventListener('blur', app);
  window.addEventListener('focus', app);
  window.addEventListener('keydown', app);
  window.addEventListener('keyup', app);
  // window.addEventListener('keypress', app);
  window.addEventListener('contextmenu', app);
}

};


module.exports = App;
