var Pointer = require('./js/tools/pointer.js')
var Pencil = require('./js/tools/pencil.js')
var Point = require('./js/base/point.js')
var ToolButton = require('./js/ui/tool_button.js')
var Frame = require('./js/base/frame.js')

var COLOR_STROKE = 'rgb(128, 128, 128)';

var app = {

init: function() {
  console.log('init');

  this.initialised = true;

  this.mode = null;
  this.tool = null;
  this.points = null;
  this.canvas = null;
  this.strokes = [];
  this.scale = 1.0;
  this.tx = 0;
  this.ty = 0;
  this.startX = 0;
  this.startY = 0;
  this.width = 640;
  this.height = 320;
  this.toolButtons = [];
  this.selection = [];
  this.frame = null;
  this.frames = [];
  this.frameNo = 0;
  this.key = [];

  this.container = document.getElementById('container');
  this.canvas = document.getElementById('surface');
  this.canvas.style.backgroundColor = 'lightgray';
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.tx = this.width / 2;
  this.ty = this.height / 2;

  // this.container.style.cursor = 'url(images/cursor_pencil.svg) 1 1, auto';

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
  this.tools['pointer'] = new Pointer();
  this.tools['pencil'] = new Pencil();

  // console.log(this.tools);

  var toolButton = new ToolButton('images/pointer.svg');
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['pointer'] = toolButton;
  toolButton.onMouseDown = function() {
    this.setTool('pointer');
  }

  toolButton = new ToolButton('images/pencil.svg');
  toolsEl.appendChild(toolButton.getElement());
  this.toolButtons['pencil'] = toolButton;
  toolButton.onMouseDown = function() {
    this.setTool('pencil');
  }

  document.body.appendChild(toolsEl);

  this.setTool('pencil');
  this.setMode('tool');

  this.frame = new Frame();
  this.frames.push(this.frame);

  // var p = new Point(5, 5);
  // console.log(p);
  // var p2 = p.copy();
  // console.log(p2);

  this.step();
  // this.draw();
},


setTool: function(toolName) {
  // console.log('setTool', this.tools);
  if (this.tool) this.toolButtons[this.tool.name].setState(false);
  this.tool = this.tools[toolName];
  this.toolButtons[this.tool.name].setState(true);

  if (this.tool.name == 'pointer') {
    this.container.style.cursor = 'default';
  } else if (this.tool.name == 'pencil') {
    this.container.style.cursor = 'url(images/cursor_pencil.svg) 2 2, auto';
  }
},


setMode: function(mode) {
  if (mode == 'tool') {
    if (this.tool.name == 'pointer') {
      this.container.style.cursor = 'pointer';

    } else if (this.tool.name == 'pencil') {
      this.container.style.cursor = 'url(images/cursor_pencil.svg) 2 2, auto';

    }
  } else if (mode == 'drag') {
    this.container.style.cursor = 'url(images/cursor_hand.svg) 1 1, auto';
  }
  this.mode = mode;
},


panCameraBy: function(x, y) {
  this.tx = this.tx + x;
  this.ty = this.ty + y;
},


zoomCameraBy: function(x) {
  this.scale = this.scale + x;
  this.scale = (this.scale < 0.5) ? 0.5 : this.scale;
  this.scale = (this.scale > 5) ? 5 : this.scale;
  // this.scale = this.scale < 0.5 ? 0.5 : this.scale;
  // this.scale = this.scale < 5 ? 5 : this.scale;
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


createPath: function(ctx, points) {
  ctx.beginPath();

  var x, y;
  var m = (this.scale % (this.scale >> 0)) == 0;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var p = this.worldToScreen(point.x, point.y);

    if (m) {
      x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
    } else {
      x = p.x, y = p.y;
    }

    // x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;

    if (i == 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
},


addStroke: function(stroke) {
  this.frame.addStroke(stroke);
  // console.log(this.frame.strokes);
},


addSelection: function(stroke) {
  var index = this.selection.indexOf(stroke);
  if (index == -1) {
    this.selection.push(stroke);
  }
},


removeSelection: function(stroke) {
  var index = this.selection.indexOf(stroke);
  if (index != -1) {
    this.selection.splice(index, 1);
  }
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


draw: function() {
  var ctx = this.canvas.getContext('2d');
  // ctx.scale(3, 3);
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  ctx.save();

  var p = this.worldToScreen(0, 0);
  var p2 = this.worldToScreen(this.width, this.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(p.x, p.y, p2.x - p.x, p2.y - p.y);

  this.highlighted = null;

  for (var i = 0; i < this.frame.strokes.length; i++) {
    var stroke = this.frame.strokes[i];

    this.createPath(ctx, stroke.points);
    ctx.lineWidth = 8;

    if (ctx.isPointInStroke(this.mouseX, this.mouseY)) {
      this.highlighted = stroke;
    }

    if (this.selection.includes(stroke)) {
      ctx.strokeStyle = 'red';
    } else {
      ctx.strokeStyle = COLOR_STROKE;
    }

    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (this.tool) {
    this.tool.draw(ctx);
  }

  // if (this.highlighted) {
  //   this.createPath(ctx, this.highlighted);
  //   ctx.globalAlpha = 1;
  //   ctx.strokeStyle = 'red';
  //   ctx.lineWidth = 2;
  //   ctx.stroke();
  //   ctx.globalAlpha = 1;
  // }

  ctx.textBaseline = 'top';
  ctx.fillStyle = 'blue';
  ctx.font = '24px sans-serif';
  var text = (this.frameNo + 1) + '/' + this.frames.length;
  var tm = ctx.measureText(text);
  ctx.fillText(text, (window.innerWidth / 2) - tm.width / 2, 10);

  ctx.restore();
},


pause: function() {
  this.paused = true;
},


resume: function() {
  this.paused = false;
  this.step();
},


step: function() {
  if (!this.paused) {
    window.requestAnimationFrame(app.step);
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
    if (this.key[' ']) {
      this.setMode('drag');

    } else if (event.ctrlKey) {
      this.setMode('zoom');

    } else {
      this.tool.onMouseDown(event);
    }
  }
},


onMouseUp: function(event) {

  if (event.button == 0) this.mouseLeft = false;

  if (this.mode == 'tool') {
    this.tool.onMouseUp(event);

  } else {
    if (this.mode == 'zoom') {
      var x = Math.abs(event.clientX - this.startX), y = Math.abs(event.clientY - this.startY);
      if (x < 2 && y < 2) {
        this.scale = 1.0;
      }
      this.setMode('tool');

    } else if (this.mode == 'drag') {
      if (!this.key[' '] && !this.mouseLeft) {
        this.setMode('tool');
      }
    }
  }

  this.downTarget = null;
},


onMouseMove: function(event) {
  var x = event.clientX, y = event.clientY;

  this.mouseX = x, this.mouseY = y;

  if (this.mode == 'tool') {
    this.tool.onMouseMove(event);

  } else if (this.mode == 'drag') {
    if (event.buttons == 1) {
      var dx = x - this.previousMouseX, dy = y - this.previousMouseY;
      this.panCameraBy(-dx / this.scale, -dy / this.scale);
    }

  } else if (this.mode == 'zoom') {
    var dx = x - this.previousMouseX, dy = y - this.previousMouseY;
    this.zoomCameraBy((dx * this.scale) * 0.002);
  }

  this.previousMouseX = x, this.previousMouseY = y;
},


onMouseOut: function(event) {
  if (this.mode == 'tool') {
    this.tool.onMouseOut(event);
  }
},


onResize: function() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.canvas.width = window.innerWidth;
      app.canvas.height = window.innerHeight;
      window.resizeTimeoutId = 0;
    }, 100);
  }
},


onWheel: function(event) {
  // this.scale = this.scale - (event.deltaY / Math.abs(event.deltaY))*0.5;
  // if (this.scale <= 0.5) this.scale = 0.5;
},


onBlur: function(event) {
  this.pause();
  // console.log('blur');
},


onFocus: function(event) {
  this.resume();
  // console.log('resume');
},


onKeyDown: function(event) {

  if (event.key == ' ' && !event.repeat) {
    this.key[event.key] = true;

    if (!this.mouseLeft) {
      this.setMode('drag');
    }

    // this.container.style.cursor = 'url(images/cursor_hand.svg) 1 1, auto';
    // this.container.style.opacity = '0.5';

  } else if (event.key == 'q' && !event.repeat) {
    this.setTool('pointer');

  } else if (event.key == 'p' && !event.repeat) {
    this.setTool('pencil');

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
  }
},


onKeyUp: function(event) {
  delete this.key[event.key];

  if (this.mode == 'drag' && !this.mouseLeft) {
    this.setMode('tool');
  }
  // this.container.style.cursor = 'unset';
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
  window.addEventListener('contextmenu', app);
}

};


document.addEventListener('DOMContentLoaded', function() {
  app.init();
});

