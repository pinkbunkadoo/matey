
var Point = require('./app/js/base/point.js')
var Vector = require('./app/js/base/vector.js')

var PointerTool = require('./app/js/tools/pointer_tool.js')
var PencilTool = require('./app/js/tools/pencil_tool.js')
var EraserTool = require('./app/js/tools/eraser_tool.js')
var KnifeTool = require('./app/js/tools/knife_tool.js')
var ZoomTool = require('./app/js/tools/zoom_tool.js')

var ToolButton = require('./app/js/ui/tool_button.js')
var Frame = require('./app/js/base/frame.js')
var Loader = require('./app/js/base/loader.js')

var COLOR_STROKE = 'rgb(128, 128, 128)';
var KEY_DRAG = ' ';
var LINE_WIDTH = 1.3;

// var ZOOM_VALUES = [ 0.05, 0.20, 0.35, 0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 3.00, 4.00, 5.00, 10.00 ];

var prefix = './app/';

var imagesToLoad = [
  'images/brush_8x8.png',
  'images/brush_16x16.png',
  'images/icon_pointer.svg',
  'images/icon_pencil.svg',
  'images/icon_zoom.svg',
  'images/icon_knife.svg'
];

var app = {

init: function() {
  console.log('init');
  console.log(__dirname);

  this.initialised = true;

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
  this.tx = this.width / 2;
  this.ty = this.height / 2;
  this.toolButtons = [];
  this.selection = [];
  this.frame = null;
  this.frames = [];
  this.frameNo = 0;
  this.key = [];
  this.showDots = false;

  this.showZoom = false;
  this.dirty = true;

  this.loadImages();
},

loadUI: function() {
  this.container = document.getElementById('container');
  // this.cursor = document.getElementById('cursor');

  this.canvas = document.getElementById('surface');
  // this.canvas = document.createElement('canvas');
  // this.canvas.style.backgroundColor = 'lightgray';
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.overlay = document.createElement('canvas');
  this.overlay.width = window.innerWidth;
  this.overlay.height = window.innerHeight;

  this.background = document.createElement('canvas');
  this.background.width = this.width;
  this.background.height = this.height;

  // Loader.load('./images/cursor_hand.svg', function(event) {
  //   app.cursorHand = event.target.responseXML.documentElement;
  // });

  this.cursors = [];
  this.cursors['pointer'] = 'url(' + prefix + '/images/cursor_pointer.png) 1 1, auto';
  this.cursors['pencil'] = 'url(' + prefix + '/images/cursor_pencil.png) 2 2, auto';
  this.cursors['hand'] = 'url(' + prefix + '/images/cursor_hand.png) 12 12, auto';
  this.cursors['zoomin'] = 'url(' + prefix + '/images/cursor_zoomin.png) 7 7, auto';
  this.cursors['zoomout'] = 'url(' + prefix + '/images/cursor_zoomout.png) 7 7, auto';

  this.initEventListeners();

  var toolsEl = document.createElement('div');
  toolsEl.style.display = 'flex';
  toolsEl.style.padding = '4px';
  toolsEl.style.flexDirection = 'column';
  toolsEl.style.alignItems = 'center';
  toolsEl.style.position = 'absolute';
  toolsEl.style.left = '0px';
  toolsEl.style.top = '64px';
  toolsEl.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';

  // this.toolButtons = [];

  this.tools = [];
  this.tools['pointer'] = new PointerTool();
  this.tools['pencil'] = new PencilTool();
  this.tools['knife'] = new KnifeTool();
  this.tools['zoom'] = new ZoomTool();

  // console.log(app.images);

  var toolButton = new ToolButton(app.images['images/icon_pointer.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['pointer'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('pointer');
  });

  toolButton = new ToolButton(app.images['images/icon_pencil.svg']);
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['pencil'] = toolButton;
  toolButton.onMouseDown = (function() {
    app.setTool('pencil');
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
  statusEl.style.position = 'fixed';
  statusEl.style.alignItems = 'center';
  statusEl.style.bottom = '0px';
  statusEl.style.height = '32px';
  statusEl.style.width = '100%';
  statusEl.style.paddingLeft = '8px';
  statusEl.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  statusEl.style.cursor = 'default';

  zoomEl = document.createElement('div');
  // zoomEl.style.cursor = 'default';
  // zoomEl.style['-webkit-user-select'] = 'none';
  // zoomEl.style.border = '1px solid gray';
  zoomEl.innerHTML = (this.scale * 100) + '%';

  statusEl.appendChild(zoomEl);
  document.body.appendChild(statusEl);
  this.zoomEl = zoomEl;
  this.statusEl = statusEl;

  this.frame = new Frame();
  this.frames.push(this.frame);

  this.setTool('pencil');
  this.setMode('tool');

  this.step();
  // this.draw();
},

loadImages: function() {
  imageCount = imagesToLoad.length;

  function onImageLoad(event) {
    var filename = this.filename.substring(prefix.length);
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
    Loader.load(prefix + imagesToLoad[i], onImageLoad);
  }

},

requestDraw: function() {
  this.dirty = true;
},


setCursor: function(name) {
  this.container.style.cursor = this.cursors[name];
},


setTool: function(toolName) {

  if (this.tool !== this.tools[toolName]) {

    if (this.tool) {
      this.toolButtons[this.tool.name].setState(false);
      this.tool.blur();
    }

    if (toolName == 'pointer') {
      this.setCursor('pointer');

    } else if (toolName == 'pencil') {
      this.setCursor('pencil');

    } else if (toolName == 'zoom') {
      this.setCursor('zoomin');
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
      if (this.tool.name == 'pointer') {
        this.setCursor('pointer');

      } else if (this.tool.name == 'pencil') {
        this.setCursor('pencil');

      } else if (this.tool.name == 'zoom') {
        this.setCursor('zoomin');

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


panCameraBy: function(x, y) {
  this.tx = this.tx + x;
  this.ty = this.ty + y;

  this.requestDraw();
},


setZoom: function(value) {
  if (value <= 5 && value >= 0.05) {
    this.scale = ((value * 100) >> 0) / 100;
    this.zoomEl.innerHTML = (this.scale * 100) + '%';
    this.requestDraw();
  }
},


zoomIn: function() {
  if (this.scale >= 0.2 && this.scale < 0.5)
    this.setZoom(this.scale + 0.15);

  else if (this.scale >= 0.5 && this.scale < 1.0)
    this.setZoom(this.scale + 0.25);

  else
    this.setZoom(this.scale + 1);
},


zoomOut: function() {
  if (this.scale > 0.5 && this.scale <= 1.0)
    this.setZoom(this.scale - 0.25);

  else if (this.scale > 0.2 && this.scale <= 0.5) {
    this.setZoom(this.scale - 0.15);
    // console.log('0.15');

  } else
    this.setZoom(this.scale - 1);
},


zoomCameraBy: function(x) {
  var value = this.scale;
  value = value + x;

  this.setZoom(value);
},


screenToWorld: function(x, y) {
  var widthHalf = (this.canvas.width / 2) >> 0;
  var heightHalf = (this.canvas.height / 2) >> 0;

  var px = x - widthHalf;
  var py = y - heightHalf;

  var sx = px / this.scale;
  var sy = py / this.scale;

  var tx = sx + this.tx;
  var ty = sy + this.ty;

  return new Point(tx, ty);
},


worldToScreen: function(x, y) {
  var tx = x - this.tx;
  var ty = y - this.ty;

  var sx = (tx * this.scale);
  var sy = (ty * this.scale);

  var widthHalf = (this.canvas.width / 2) >> 0;
  var heightHalf = (this.canvas.height / 2) >> 0;

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
    var bounds = stroke.bounds;
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


getIntersections: function(points) {
  var intersections = [];
  for (var i = 0; i < this.frame.strokes.length; i++) {
    var stroke = this.frame.strokes[i];

    for (var j = 1; j < stroke.points.length; j++) {
      var p1 = stroke.points[j - 1];
      var p2 = stroke.points[j];

      for (var k = 1; k < points.length; k++) {
        var p3 = points[k - 1];
        var p4 = points[k];

        result = util.intersect(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        if (result) {
          intersections.push(result);
        }
      }
    }
  }
  return intersections;
},

// Stroke.prototype.hit = function(x, y, radius) {
//   var p = new StrokePoint(x, y);
//   var selection = null;
//   return selection;
// }


addStroke: function(stroke) {
  this.frame.addStroke(stroke);
  this.requestDraw();
  // console.log(this.frame.strokes);
},


addSelection: function(stroke) {
  var index = this.selection.indexOf(stroke);
  if (index == -1) {
    this.selection.push(stroke);
    this.requestDraw();
  }
},


removeSelection: function(stroke) {
  var index = this.selection.indexOf(stroke);
  if (index != -1) {
    this.selection.splice(index, 1);
    this.requestDraw();
  }
},


deleteSelected: function() {
  // for (var i = 0; i < this.selection.length; i++) {
  //   var stroke = this.selection[i];
  //   this.frame.strokes.splice(i);
  // }
  var filtered = this.frame.strokes.filter(function(value) {
    return (!app.selection.includes(value));
  });
  this.frame.strokes = filtered;
  this.selection = [];
  this.requestDraw();
},


toggleSelection: function(stroke) {
  // console.log('toggle');
  var index = this.selection.indexOf(stroke);
  if (index != -1) {
    this.selection.splice(index, 1);
  } else {
    this.selection.push(stroke);
  }
  this.requestDraw();
},


goFrame: function(frameNo) {
  if (frameNo >= 0 && frameNo < this.frames.length) {
    this.frameNo = frameNo;
    this.frame = this.frames[frameNo];
  }
},


insertFrame: function(frame, index) {
  this.frames.splice(index, 0, frame);
  this.frameNo = index;
  this.frame = frame;
},


createPath: function(ctx, points) {
  ctx.beginPath();

  var x, y;
  // var m = (this.scale % (this.scale >> 0)) == 0;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var p = this.worldToScreen(point.x, point.y);

    // x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
    x = p.x, y = p.y;

    if (i == 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
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
    ctx.save();

    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var p1 = this.worldToScreen(0, 0);
    // var p2 = this.worldToScreen(this.width, this.height);
    // ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillStyle = 'white';
    ctx.fillRect((p1.x >> 0), (p1.y >> 0), this.width * this.scale, this.height * this.scale);

    this.drawBackground(ctx);

    this.drawOverlay(ctx);

    this.highlighted = null;

    for (var i = 0; i < this.frame.strokes.length; i++) {
      var stroke = this.frame.strokes[i];

      this.createPath(ctx, stroke.points);

      if (this.selection.includes(stroke)) {
        ctx.strokeStyle = 'red';
      } else {
        ctx.strokeStyle = COLOR_STROKE;
      }

      ctx.lineWidth = LINE_WIDTH * (this.scale > 1 ? this.scale : 1);
      ctx.stroke();

      // Draw bounding boxes
      // p1 = app.worldToScreen(stroke.bounds.x, stroke.bounds.y);
      // ctx.beginPath();
      // ctx.rect((p1.x>>0) + 0.5, (p1.y>>0) + 0.5, stroke.bounds.width * this.scale, stroke.bounds.height * this.scale);
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'blue';
      // ctx.stroke();

      if (this.showDots) {
        ctx.fillStyle = 'blue';
        for (var j = 0; j < stroke.points.length; j++) {
          var p = this.worldToScreen(stroke.points[j].x, stroke.points[j].y);
          var x = (p.x >> 0), y = (p.y >> 0);
          ctx.fillRect(x - 1, y - 1, 3, 3);
        }
      }

    }

    if (this.showZoom) {
      ctx.fillText(this.scale * 100, 10, window.innerHeight - 32);
    }

    ctx.restore();
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

  this.mouseLeft = (event.button == 0);

  this.startX = event.clientX, this.startY = event.clientY;
  this.downTarget = event.target;

  if (event.target === this.canvas) {
    if (this.key[KEY_DRAG]) {
      this.setMode('drag');

    } else if (event.ctrlKey && event.button == 0) {
      // this.setMode('zoom');

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

  // this.cursor.style.left = x + 'px';
  // this.cursor.style.top = y + 'px';
  // this.cursor.style.display = 'none';

  this.mouseX = x, this.mouseY = y;

  if (this.mode == 'tool') {
    this.tool.onMouseMove(event);

  } else if (this.mode == 'drag') {
    if (event.buttons == 1) {
      var dx = x - this.previousMouseX, dy = y - this.previousMouseY;
      this.panCameraBy(-dx / this.scale, -dy / this.scale);
    }

  } else if (this.mode == 'zoom') {
    // var dx = x - this.previousMouseX, dy = y - this.previousMouseY;
    // this.zoomCameraBy((dx * this.scale) * 0.002);
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
      // document.body.style.zoom = 1;
    }, 100);
  }
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

  if (event.key == KEY_DRAG) {
    event.preventDefault();

    if (!event.repeat) {
      this.key[KEY_DRAG] = true;

      if (!this.mouseLeft) {
        this.setMode('drag');
      }
    }

  } else if (event.key == '1' && !event.repeat) {
    this.sendToBackground();

  } else if (event.key == 'd' && !event.repeat) {
    this.showDots = !this.showDots;
    this.requestDraw();

  // } else if (event.key == 'e' && !event.repeat) {
  //   this.setTool('eraser');
  } else if (event.key == 'k' && !event.repeat) {
    this.setTool('knife');

  } else if (event.key == 'q' && !event.repeat) {
    this.setTool('pointer');

  } else if (event.key == 'b' && !event.repeat) {
    this.setTool('pencil');

  } else if (event.key == 'z' && !event.repeat) {
    this.setTool('zoom');

  } else if (event.key == '+' && !event.repeat) {

  } else if (event.key == 'ArrowLeft') {
    if (event.ctrlKey) {
      if (event.altKey) {
        this.insertFrame(this.frame.copy(), this.frameNo - 1);
      } else {
        this.insertFrame(new Frame(), this.frameNo - 1);
      }
    } else {
      this.goFrame(this.frameNo - 1);
    }

  } else if (event.key == 'ArrowRight') {
    if (event.ctrlKey) {
      if (event.altKey) {
        this.insertFrame(this.frame.copy(), this.frameNo + 1);
      } else {
        this.insertFrame(new Frame(), this.frameNo + 1);
      }
    } else {
      this.goFrame(this.frameNo + 1);
    }
  } else if (event.key == 'Backspace') {
    this.deleteSelected();
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

// module.exports = app;

// window.onload = function() {
//   app.init();

  // document.body.onresize = function(event) {
  //   console.log('resize');
  // }
// };

document.addEventListener('DOMContentLoaded', function() {
  app.init();

});
