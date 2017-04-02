
var app = {};

app.mode = null;
app.tool = null;

app.points = null;
app.canvas = null;
app.strokes = [];
app.scale = 1.0;
app.tx = 0;
app.ty = 0;
app.startX = 0;
app.startY = 0;
app.width = 640;
app.height = 400;
app.toolButtons = [];
app.selection = [];

app.frame = null;
app.frames = [];
app.frameNo = 0;

var COLOR_STROKE = 'rgb(128, 128, 128)';


app.init = function(canvas) {
  console.log('init');

  app.container = document.getElementById('container');

  app.canvas = canvas;
  app.canvas.style.backgroundColor = 'lightgray';
  app.canvas.width = window.innerWidth;
  app.canvas.height = window.innerHeight;
  app.tx = app.width / 2;
  app.ty = app.height / 2;

  app.initEventListeners();

  var toolsEl = document.createElement('div');
  toolsEl.style.display = 'flex';
  toolsEl.style.padding = '4px';
  toolsEl.style.flexDirection = 'column';
  toolsEl.style.alignItems = 'center';
  toolsEl.style.position = 'absolute';
  toolsEl.style.left = '32px';
  toolsEl.style.top = '64px';
  toolsEl.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';

  // app.toolButtons = [];
  app.tools = [];
  app.tools['pointer'] = new Pointer();
  app.tools['pencil'] = new Pencil();

  var toolButton = new ToolButton('./images/pointer.svg');
  toolsEl.appendChild(toolButton.getElement());
  app.toolButtons['pointer'] = toolButton;
  toolButton.onMouseDown = function() {
    app.setTool(app.tools['pointer']);
  }

  toolButton = new ToolButton('./images/pencil.svg');
  toolsEl.appendChild(toolButton.getElement());
  app.toolButtons['pencil'] = toolButton;
  toolButton.onMouseDown = function() {
    app.setTool(app.tools['pencil']);
  }

  document.body.appendChild(toolsEl);

  app.setMode('tool');
  app.setTool(app.tools['pencil']);

  app.frame = new Frame();
  app.frames.push(app.frame);

  // var p = new Point(5, 5);
  // console.log(p);
  // var p2 = p.copy();
  // console.log(p2);

  app.step();
  // app.draw();
}


app.setTool = function(tool) {
  if (app.tool) app.toolButtons[app.tool.name].setState(false);
  app.tool = tool;
  app.toolButtons[tool.name].setState(true);
  // console.log(tool);
}


app.setMode = function(mode) {
  app.mode = mode;
}


app.panCameraBy = function(x, y) {
  app.tx = app.tx + x;
  app.ty = app.ty + y;
}


app.zoomCameraBy = function(x) {
  app.scale = app.scale + x;
  app.scale = (app.scale < 0.5) ? 0.5 : app.scale;
  app.scale = (app.scale > 5) ? 5 : app.scale;
  // app.scale = app.scale < 0.5 ? 0.5 : app.scale;
  // app.scale = app.scale < 5 ? 5 : app.scale;
}


app.screenToWorld = function(x, y) {
  var widthHalf = (app.canvas.width / 2) >> 0;
  var heightHalf = (app.canvas.height / 2) >> 0;

  var px = x - widthHalf;
  var py = y - heightHalf;

  var sx = px / app.scale;
  var sy = py / app.scale;

  var tx = sx + app.tx;
  var ty = sy + app.ty;

  return new Point(tx, ty);
}


app.worldToScreen = function(x, y) {
  var tx = x - app.tx;
  var ty = y - app.ty;

  var sx = (tx * app.scale);
  var sy = (ty * app.scale);

  var widthHalf = (app.canvas.width / 2) >> 0;
  var heightHalf = (app.canvas.height / 2) >> 0;

  return new Point(sx + widthHalf, sy + heightHalf);

}


app.createPath = function(ctx, points) {
  ctx.beginPath();

  var x, y;
  var m = (app.scale % (app.scale >> 0)) == 0;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var p = app.worldToScreen(point.x, point.y);

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
}


app.addStroke = function(stroke) {
  app.frame.addStroke(stroke);
  // console.log(app.frame.strokes);
}


app.addSelection = function(stroke) {
  var index = app.selection.indexOf(stroke);
  if (index == -1) {
    app.selection.push(stroke);
  } else {
    app.selection.splice(index, 1);
  }
}


app.goFrame = function(frameNo) {
  if (frameNo >= 0 && frameNo < app.frames.length) {
    app.frameNo = frameNo;
    app.frame = app.frames[frameNo];
  }
}


app.insertFrame = function(frame, index) {
  app.frames.splice(index, 0, frame);
  app.frameNo = index;
  app.frame = frame;
}


app.draw = function() {
  var ctx = app.canvas.getContext('2d');
  // ctx.scale(3, 3);
  ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);

  ctx.save();

  var p = app.worldToScreen(0, 0);
  var p2 = app.worldToScreen(app.width, app.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(p.x, p.y, p2.x - p.x, p2.y - p.y);

  app.highlighted = null;

  for (var i = 0; i < app.frame.strokes.length; i++) {
    var stroke = app.frame.strokes[i];

    app.createPath(ctx, stroke.points);
    ctx.lineWidth = 8;

    if (ctx.isPointInStroke(app.mouseX, app.mouseY)) {
      app.highlighted = stroke;
    }

    if (app.selection.includes(stroke)) {
      ctx.strokeStyle = 'red';
    } else {
      ctx.strokeStyle = COLOR_STROKE;
    }

    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (app.tool) {
    app.tool.draw(ctx);
  }

  // if (app.highlighted) {
  //   app.createPath(ctx, app.highlighted);
  //   ctx.globalAlpha = 1;
  //   ctx.strokeStyle = 'red';
  //   ctx.lineWidth = 2;
  //   ctx.stroke();
  //   ctx.globalAlpha = 1;
  // }

  ctx.textBaseline = 'top';
  ctx.fillStyle = 'blue';
  ctx.font = '24px sans-serif';
  var text = (app.frameNo + 1) + '/' + app.frames.length;
  var tm = ctx.measureText(text);
  ctx.fillText(text, (window.innerWidth / 2) - tm.width / 2, 10);

  ctx.restore();
}


app.pause = function() {
  app.paused = true;
}


app.resume = function() {
  app.paused = false;
  app.step();
}


app.step = function() {
  if (!app.paused) {
    window.requestAnimationFrame(app.step);
    app.draw();
  }
}


app.onMouseDown = function(event) {
  if (event.buttons == 4) {
    event.preventDefault();
  }

  app.startX = event.clientX, app.startY = event.clientY;
  app.downTarget = event.target;

  if (event.target === app.canvas) {
    if (event.shiftKey) {
      app.setMode('drag');

    } else if (event.ctrlKey) {
      app.setMode('zoom');

    } else {
      app.tool.onMouseDown(event);
    }
  }
}


app.onMouseUp = function(event) {
  if (app.mode == 'tool') {
    app.tool.onMouseUp(event);

  } else {
    if (app.mode == 'zoom') {
      var x = Math.abs(event.clientX - app.startX), y = Math.abs(event.clientY - app.startY);
      if (x < 2 && y < 2) {
        app.scale = 1.0;
      }
    }
    app.setMode('tool');
  }

  app.downTarget = null;
}


app.onMouseMove = function(event) {
  var x = event.clientX, y = event.clientY;

  app.mouseX = x, app.mouseY = y;

  if (app.mode == 'tool') {
    app.tool.onMouseMove(event);

  } else if (app.mode == 'drag') {
    var dx = x - app.previousMouseX, dy = y - app.previousMouseY;
    app.panCameraBy(-dx / app.scale, -dy / app.scale);

  } else if (app.mode == 'zoom') {
    var dx = x - app.previousMouseX, dy = y - app.previousMouseY;
    app.zoomCameraBy((dx * app.scale) * 0.002);
  }

  app.previousMouseX = x, app.previousMouseY = y;
}


app.onMouseOut = function(event) {
  if (app.mode == 'tool') {
    app.tool.onMouseOut(event);
  }
}


app.onResize = function() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.canvas.width = window.innerWidth;
      app.canvas.height = window.innerHeight;
      window.resizeTimeoutId = 0;
    }, 100);
  }
}


app.onWheel = function(event) {
  // app.scale = app.scale - (event.deltaY / Math.abs(event.deltaY))*0.5;
  // if (app.scale <= 0.5) app.scale = 0.5;
}


app.onBlur = function(event) {
  app.pause();
  // console.log('blur');
}


app.onFocus = function(event) {
  app.resume();
  // console.log('resume');
}


app.onKeyDown = function(event) {
  if (event.key == 'q') {
    app.setTool(app.tools['pointer']);

  } else if (event.key == 'p') {
    app.setTool(app.tools['pencil']);

  } else if (event.key == '+') {

  } else if (event.key == 'ArrowLeft') {
    if (event.ctrlKey) {
      if (event.altKey) {
        app.insertFrame(app.frame.copy(), app.frameNo - 1);
      } else {
        app.insertFrame(new Frame(), app.frameNo - 1);
      }
    } else {
      app.goFrame(app.frameNo - 1);
    }

  } else if (event.key == 'ArrowRight') {
    console.log('right');
    console.log(event);
    if (event.ctrlKey) {
      console.log('ctrl');
      if (event.altKey) {
        app.insertFrame(app.frame.copy(), app.frameNo + 1);
      } else {
        app.insertFrame(new Frame(), app.frameNo + 1);
      }
    } else {
      app.goFrame(app.frameNo + 1);
    }
  }
}


app.onContextMenu = function(event) {
  event.preventDefault();
}


app.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    app.onMouseDown(event);
  } else if (event.type == 'mouseup') {
    app.onMouseUp(event);
  } else if (event.type == 'mousemove') {
    app.onMouseMove(event);
  } else if (event.type == 'wheel') {
    app.onWheel(event);
  } else if (event.type == 'resize') {
    app.onResize(event);
  } else if (event.type == 'blur') {
    app.onBlur(event);
  } else if (event.type == 'focus') {
    app.onFocus(event);
  } else if (event.type == 'keydown') {
    app.onKeyDown(event);
  } else if (event.type == 'contextmenu') {
    app.onContextMenu(event);
  }
}

app.initEventListeners = function() {
  window.addEventListener('mousedown', app);
  window.addEventListener('mouseup', app);
  window.addEventListener('mousemove', app);
  window.addEventListener('wheel', app);
  window.addEventListener('scroll', app);
  window.addEventListener('resize', app);
  window.addEventListener('blur', app);
  window.addEventListener('focus', app);
  window.addEventListener('keydown', app);
  window.addEventListener('contextmenu', app);
}
