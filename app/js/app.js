const Const = require('./const');
const Util = require('./util');
const Tools = require('./tools/');
const ToolsPalette = require('./ui/tools');
const Stroke = require('./display/stroke');
const Sequence = require('./sequence');
const Geom = require('./geom/');
const Panels = require('./ui/panels/');
const Container = require('./ui/container');
const StrokeProperties = require('./ui/panels/properties/stroke_properties');
const Options = require('./ui/options');
const Paper = require('./ui/paper');
const Status = require('./ui/status');
const FrameList = require('./ui/frame_list');
const FrameListBar = require('./ui/frame_list_bar');
const Actions = require('./actions/');
const HistoryState = require('./history_state');
const Loader = require('./loader');

var app = {};

app.preload = function() {
  console.log('preload');
  app.loadImages();
}

app.startup = function() {
  console.log('startup');

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.settings = {};

  app.cursors = {};
  app.cursors['pointer'] = 'url(./images/cursor_pointer.png) 1 1, auto';
  app.cursors['pencil'] = 'url(./images/cursor_pencil.png) 1 1, auto';
  app.cursors['line'] = 'url(./images/cursor_line.png) 3 3, auto';
  app.cursors['hand'] = 'url(./images/cursor_hand.png) 12 12, auto';
  app.cursors['zoomin'] = 'url(./images/cursor_zoomin.png) 7 7, auto';
  app.cursors['zoomout'] = 'url(./images/cursor_zoomout.png) 7 7, auto';

  app.regions = {};
  app.regions['outer'] = new Container({ classes: [ 'outer' ] });

  app.regions['header'] = new Container({ classes: [ 'header' ] });
  app.regions['content'] = new Container({ classes: [ 'content' ] });
  app.regions['footer'] = new Container({ classes: [ 'footer' ] });

  app.regions['outer'].add(app.regions['header']);
  app.regions['outer'].add(app.regions['content']);
  app.regions['outer'].add(app.regions['footer']);

  app.regions['tools'] = new Container({ classes: [ 'tools' ] });
  app.regions['content'].add(app.regions['tools']);

  app.regions['workspace'] = new Container({ classes: [ 'workspace' ] });
  app.regions['content'].add(app.regions['workspace']);

  app.regions['properties'] = new Container({ classes: [ 'properties' ] });
  app.regions['content'].add(app.regions['properties']);

  document.body.appendChild(app.regions['outer'].el);

  // var w = window.innerWidth - app.regions['tools'].el.offsetWidth - app.regions['properties'].el.offsetWidth;
  // var h = window.innerHeight - app.regions['header'].el.offsetHeight - app.regions['footer'].el.offsetHeight - 128;

  app.paper = new Paper();
  app.paper.bind('zoom', function(params) {
    app.status.setZoom(params.scale)
  });
  app.paper.bind('pick', function(params) {
  });

  app.regions['workspace'].add(app.paper);

  // document.body.appendChild(app.paper.el);


  app.ui = {};

  app.ui.options = new Options();
  app.regions['header'].add(app.ui.options);


  app.ui.tools = new ToolsPalette();
  app.ui.tools.bind('tool-change', function(params) {
    app.setTool(params.tool);
  });
  app.regions['tools'].add(app.ui.tools);
  // document.body.appendChild(app.ui.tools.el);

  // app.ui.properties = new Panels.Properties({ left: window.innerWidth - 192 - 16, top: 16, width: 192, height: 192 });
  app.ui.properties = new Panels.Properties();
  app.ui.properties.bind('stroke-fill-change', function(params) {
    app.sequence.selection.elements[0].fill = params.fill;
  });
  app.regions['properties'].add(app.ui.properties);
  // document.body.appendChild(app.ui.properties.el);

  app.ui.strokeProperties = new StrokeProperties();
  app.ui.strokeProperties.bind('fill-change', function(params) {
    // console.log('fill-change', params.fill);
    app.setStrokeFill(params.fill);
    app.render();
    // self.emit('stroke-fill-change', params);
  });

  // app.ui.history = new Panels.History();
  // app.ui.history.bind('select', function(params) {
  //   app.ui.history.render({ cmd: 'select', index: params.id });
  //   app.sequence.setHistoryIndex(params.id);
  // });
  // app.regions['properties'].add(app.ui.history);

  app.ui.status = new Status();
  app.regions['footer'].add(app.ui.status);
  // document.body.appendChild(app.ui.status.el);

  // app.ui.frameList = new FrameList({ width: Const.WIDTH / 8, height: Const.HEIGHT / 8 });
  app.ui.frameList = new FrameList({ width: Const.WIDTH * (64 / Const.HEIGHT) >> 0, height: 64 });
  app.ui.frameList.bind('create', function(params) {
    app.newFrame();
  });
  app.ui.frameList.bind('select', function(params) {
    app.go(params.index);
  });
  app.regions['workspace'].add(app.ui.frameList);

  app.ui.frameListBar = new FrameListBar();
  app.ui.frameListBar.bind('new-frame', function(params) {
    app.newFrame();
  });
  app.ui.frameListBar.bind('onion', function(params) {
    // app.paper.setOnion(params.value);
    app.settings['onion'] = true;
    app.render();
  });
  // app.ui.frameListBar.bind('select', function(params) {
  //   app.go(params.index);
  // });
  app.regions['workspace'].add(app.ui.frameListBar);

  // app.ui.frameListScroller = new Scroller();
  // this.add(app.ui.frameListScroller);
  // document.body.appendChild(app.ui.frameList.el);
  // console.log(app.ui.frameList.el.offsetWidth);

  app.overlayContainer = document.createElement('div');
  app.overlayContainer.style.position = 'absolute';
  app.overlayContainer.style.left = '0px';
  app.overlayContainer.style.top = '0px';
  app.overlayContainer.style.pointerEvents = 'none';

  app.overlay = document.createElement('canvas');
  app.overlay.width = 500;
  app.overlay.height = 500;
  // app.overlay.style.background = 'rgba(0, 0, 255, 0.2)';
  app.overlayContainer.appendChild(app.overlay);
  document.body.appendChild(app.overlayContainer);


  app.sequence = new Sequence();
  app.newFrame();

  window.sequence = app.sequence;

  app.tools = {};

  app.tools.pointer = new Tools.Pointer();
  app.tools.pointer.bind('marquee', function(params) {
    var p1 = app.paper.screenToWorld(params.xmin, params.ymin);
    var p2 = app.paper.screenToWorld(params.xmax, params.ymax);

    app.marqueeSelect(p1.x, p1.y, p2.x, p2.y);

    if (app.sequence.selection.elements.length === 1)
      app.showProperties(app.sequence.selection.elements[0]);
    else
      app.showProperties();

    app.render();
  });
  app.tools.pointer.bind('pick', function(params) {
    if (app.sequence.selection.elements.length === 1)
      app.showProperties(params.stroke);
    else
      app.showProperties();
    app.render();
  });
  app.tools.pointer.bind('moved', function(params) {
    app.updateFrameListIcon(app.sequence.frame);
    app.render();
  });
  app.tools.pointer.bind('drag', function(params) {
    // app.updateFrameListIcon(app.sequence.frame);
    app.render();
  });
  app.tools.pointer.bind('delete', function(params) {
    sequence.deleteSelected();
    app.addAction(new Actions.Delete());
    app.render();
  });
  app.tools.pointer.bind('change', function(params) {
    // console.log('change');
    app.render();
  });

  // app.tools.pointer = new Tools.Pointer();

  app.tools.pen = new Tools.Pen();
  app.tools.pen.bind('stroke', function(params) {
    app.createStroke(params.points);
    // app.addAction(new Actions.Pencil());
  });
  app.tools.pen.bind('change', function(params) {
    app.render();
  });

  app.tools.pencil = new Tools.Pencil();
  app.tools.pencil.bind('stroke', function(params) {
    // app.createStroke(params.points);
    // console.log('stroke');
    // app.addAction(new Actions.Pencil());
  });
  app.tools.pencil.bind('change', function(params) {
    app.render();
  });

  app.tools.line = new Tools.Line();
  app.tools.line.bind('stroke', function(params) {
    app.createStroke(params.points);
    app.addAction(new Actions.Line());
  });
  app.tools.line.bind('change', function(params) {
    app.render();
  });

  app.tools.knife = new Tools.Knife();

  app.tools.zoom = new Tools.Zoom();
  app.tools.zoom.bind('zoom-in', function(params) {
    app.paper.zoomIn();
    app.ui.status.setZoom(app.paper.scale);
    app.render();
  });
  app.tools.zoom.bind('zoom-out', function(params) {
    app.paper.zoomOut();
    app.ui.status.setZoom(app.paper.scale);
    app.render();
  });

  app.reposition();
  app.render();

  app.setTool('pen');
  app.setMode('tool');

  app.ui.status.setZoom(1);
  app.ui.frameListBar.setFrame(1, 1);

  app.key = [];

  app.initEventListeners();
}

app.loadImages = function() {
  app.icons = [];
  Loader.load('./images/icons.svg', function(event) {
    var svg = event.target.responseXML.documentElement;
    for (var i = 0; i < svg.children.length; i++) {
      var child = svg.children[i];
      app.icons[child.id] = { width: child.viewBox.baseVal.width, height: child.viewBox.baseVal.height };
      // console.log(child.id, app.icons[child.id]);
    }
    document.body.appendChild(svg);
    app.startup();
  });
}

app.clearOverlay = function() {
    var ctx = app.getOverlayContext();
    ctx.clearRect(0, 0, app.overlay.width, app.overlay.height);
}

app.getOverlayContext = function() {
  // return app.paper.overlay.getContext('2d');
  return app.overlay.getContext('2d');
}

app.render = function() {

  app.paper.clear();

  // render previous frame

  if (app.settings['onion']) {
    if (app.sequence.position > 0) {
      var frame = app.sequence.frames[app.sequence.position - 1];
      for (var i = 0; i < frame.strokes.length; i++) {
        var stroke = frame.strokes[i];
        app.paper.renderPath(stroke.points, { strokeStyle: 'lightgray', fill: stroke.fill ? 'white' : undefined });
      }
    }
  }

  // render unselected strokes

  for (var i = 0; i < app.sequence.frame.strokes.length; i++) {
    var stroke = app.sequence.frame.strokes[i];
    // if (stroke.selected) {
      // app.paper.renderStroke(stroke, { strokeStyle: 'dodgerblue', lineWidth: 2 } );
    // } else {
      app.paper.renderPath(stroke.points, { fill: stroke.fill ? 'white' : undefined });
    // }
  }

  // render selected strokes

  for (var i = 0; i < app.sequence.selection.elements.length; i++) {
    var element = app.sequence.selection.elements[i];
    if (element instanceof Stroke) {
      app.paper.renderPath(element.points, { strokeStyle: Const.color.strokeSelected, lineWidth: 2, fill: element.fill ? 'red' : undefined });
    }
  }

  // render vertices

  if (app.settings['dots']) {
    for (var i = 0; i < app.sequence.frame.strokes.length; i++) {
      var stroke = app.sequence.frame.strokes[i];
      app.paper.renderDots(stroke);
    }
  }

  app.paper.renderBitmap();

  if (app.tool) app.tool.render();
}

app.setMode = function(mode) {
  if (app.mode !== mode) {
    app.mode = mode;
    if (app.mode === 'pan') {
      app.setCursor('hand');
    } else {
      if (app.tool) app.setCursor(app.tool.cursor);
    }
  }
}

app.setTool = function(name) {
  if (app.tool !== app.tools[name]) {
    if (app.tool) app.tool.blur();
    app.tool = app.tools[name];
    app.tool.focus();
    app.setCursor(app.tool.cursor);
    app.ui.tools.setTool(name);
  }
}

app.setCursor = function(name) {
  app.paper.el.style.cursor = app.cursors[name];
}

app.undo = function() {
  app.sequence.undo();
  // app.ui.history.render({ cmd: 'select', index: app.sequence.frame.history.marker });
}

app.redo = function() {
  app.sequence.redo();
}

app.hitTest = function(x, y) {
  // var p = new Point(x, y);
  var p = app.paper.screenToWorld(x, y);
  var selection = null;
  var radius = 4 / app.paper.scale;

  var strokes = app.sequence.frame.strokes;

  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i];
    if (stroke.hitTest(p.x, p.y, radius)) {
      selection = stroke;
      break;
    }
  }

  return selection;
}

app.marqueeSelect = function(xmin, ymin, xmax, ymax) {

  var candidates = [];
  // var intersect = false;
  var frame = app.sequence.frame;

  var edges = [
    [ xmin, ymin, xmin, ymax ],
    [ xmin, ymin, xmax, ymin ],
    [ xmax, ymin, xmax, ymax ],
    [ xmin, ymax, xmax, ymax ]];

  for (var i = 0; i < frame.strokes.length; i++) {
    var stroke = frame.strokes[i];
    var intersect = false;

    for (var j = 1; j < stroke.points.length; j++) {
      var p1 = stroke.points[j - 1];
      var p2 = stroke.points[j];

      if (j == 1) {
        if (Util.pointInRect(p1.x, p1.y, xmin, ymin, xmax, ymax)) {
          intersect = true;
          break;
        }
      }

      for (var k = 0; k < edges.length; k++) {
        var edge = edges[k];
        var result = Util.intersect(p1.x, p1.y, p2.x, p2.y, edge[0], edge[1], edge[2], edge[3]);
        if (result && result.seg1 && result.seg2) {
          intersect = true;
          break;
        }
      }

      if (intersect) break;
    }
    if (intersect) candidates.push(stroke);
  }

  app.sequence.selection.clear();
  app.sequence.selection.add(candidates);

  // return selection;
};

app.createPath = function(ctx, points, dx, dy) {
  // ctx.beginPath();
  //
  // dx = dx || 0;
  // dy = dy || 0;
  //
  // for (var i = 0; i < points.length; i++) {
  //   var point = points[i];
  //   var p = app.paper.worldToScreen(point.x, point.y);
  //   var x = p.x + dx, y = p.y + dy;
  //   if (i == 0)
  //     ctx.moveTo(x, y);
  //   else
  //     ctx.lineTo(x, y);
  // }
  // if (points.length == 2) ctx.closePath();
}

// app.translateSelected = function(dx, dy) {
// }

app.strokeFromPoints = function(sourcePoints, convertToWorld) {
  var points = [];
  for (var i = 0; i < sourcePoints.length; i++) {
    var p = sourcePoints[i];
    var x = p.x, y = p.y;
    if (convertToWorld) {
      points[i] = app.paper.screenToWorld(x, y);
    } else {
      points[i] = new Point(x, y);
    }
  }
  return new Stroke(points);
}

app.updateFrameListIcon = function(frame) {
  var index = app.sequence.frames.indexOf(frame);
  // var frame = app.sequence.frames[index];
  var scale = app.ui.frameList.width / Const.WIDTH;
  var width = app.ui.frameList.width;
  var height = app.ui.frameList.height;
  var frameIcon = app.ui.frameList.get(index);

  if (frameIcon) {
    var ctx = frameIcon.canvas.getContext('2d')
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = Const.COLOR_STROKE;

    for (var i = 0; i < frame.strokes.length; i++) {
      var stroke = frame.strokes[i];
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (var j = 0; j < stroke.points.length; j++) {
        var point = stroke.points[j];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

app.go = function(index) {
  app.sequence.go(index);
  app.ui.frameList.render({ cmd: 'select', index: index });

  var items = [];
  for (var i = 0; i < app.sequence.frame.history.states.length; i++) {
    var state = app.sequence.frame.history.states[i];
    items.push({ id: i, title: state.action.name });
  }
  // app.ui.history.render({ cmd: 'populate', items: items });
  // app.ui.history.render({ cmd: 'select', index: app.sequence.frame.history.marker });
  app.render();
}

app.showProperties = function(object) {
  if (object instanceof Stroke) {
    // app.ui.properties.render({ cmd: 'show', object: object });
    app.ui.properties.setPane(app.ui.strokeProperties);
    app.ui.strokeProperties.render({ cmd: 'show', object: object });

  } else {
    // app.ui.properties.render({ cmd: 'clear' });
    app.ui.properties.setPane();
  }
}

app.newFrame = function() {
  app.sequence.add();
  app.sequence.end();

  app.ui.frameList.render({ cmd: 'frameAdd' });
  app.ui.frameList.render({ cmd: 'select', index: app.sequence.position });
  app.updateFrameListIcon(app.sequence.frame);

  app.sequence.frame.history.add(new HistoryState(new Actions.New(), app.sequence.frame.copy()));
  // app.ui.history.render({ cmd: 'populate', items: [{ id: app.sequence.frame.history.marker, title: 'New' }] });
  // app.ui.history.render({ cmd: 'select', index: app.sequence.frame.history.marker });

  app.render();
}

app.addAction = function(action) {
  // app.sequence.addAction(new Actions.Pencil());
  app.sequence.frame.history.add(new HistoryState(action, app.sequence.frame.copy()));
  // app.ui.history.render({ cmd: 'add', id: app.sequence.frame.history.marker, title: action.name });
  // app.ui.history.render({ cmd: 'select', index: app.sequence.frame.history.marker });
}

app.createStroke = function(points) {
  var stroke = app.strokeFromPoints(points, true);
  app.sequence.frame.addStroke(stroke);
  app.updateFrameListIcon(app.sequence.frame);
  app.render();
}

app.setStrokeFill = function(fill) {
  for (var i = 0; i < app.sequence.selection.elements.length; i++) {
    var element = app.sequence.selection.elements[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
}

app.onMouseDown = function(event) {
  // app.mouseX = event.clientX;
  // app.mouseY = event.clientY;

  app.mouseX = event.clientX - event.target.offsetLeft;
  app.mouseY = event.clientY - event.target.offsetTop;

  app.mouseDownX = app.mouseX;
  app.mouseDownY = app.mouseY;

  app.mouseLeft = (event.button === 0);
  app.mouseTarget = event.target;
  app.downTarget = event.target;

  if (event.buttons === 4) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (event.target === app.paper.el) {
    // console.log('paper');
    if (app.mode === 'pan') {
    } else {
      app.tool.handleEvent(event);
    }
    // app.paper.handleEvent(event);
  }
}

app.onMouseMove = function(event) {
  var previousX = app.mouseX;
  var previousY = app.mouseY;

  app.mouseX = event.clientX - event.target.offsetLeft;
  app.mouseY = event.clientY - event.target.offsetTop;

  // console.log(app.mouseX);
  // app.mouseX = event.clientX;
  // app.mouseY = event.clientY;

  app.mouseDeltaX = app.mouseX - previousX;
  app.mouseDeltaY = app.mouseY - previousY;

  if (app.mode === 'pan') {
    if (event.buttons === 1) {
      app.paper.panCameraBy(-app.mouseDeltaX / app.paper.scale, -app.mouseDeltaY / app.paper.scale);
      app.render();
    }
  } else {
    app.tool.handleEvent(event);
  }

  // app.paper.handleEvent(event);
}

app.onMouseUp = function(event) {
  app.mouseX = event.clientX - event.target.offsetLeft;
  app.mouseY = event.clientY - event.target.offsetTop;

  app.mouseLeft = (event.button === 0) ? false : app.mouseLeft;

  if (app.mode === 'pan') {
    if (!app.key[Const.KEY_DRAG] && event.button === 0) {
      app.setMode('tool');
    }
  } else {
    if (app.tool && app.mouseTarget == app.paper.el) app.tool.handleEvent(event);
  }
}

app.onKeyDown = function(event) {
  app.key[event.key] = true;

  if (event.key === Const.KEY_DRAG) {
    event.preventDefault();
    if (!event.repeat) {
      if (!app.mouseLeft) {
        app.setMode('pan');
      }
    }
  }
  else if (event.key == 'b' && !event.repeat) {
    app.setTool('pencil');
  }
  else if (event.key == 'q' && !event.repeat) {
    app.setTool('pointer');
  }
  else if (event.key == 'z' && !event.repeat) {
    if (event.ctrlKey)
      app.undo();
    else
      app.setTool('zoom');
  }
  else if (event.key === 'd' && !event.repeat) {
    // app.paper.showDots = !app.paper.showDots;
    app.settings['dots'] = !app.settings['dots'];
    app.render();
  }
  else if (event.key === 'h' && !event.repeat) {
    app.paper.center();
    app.render();
  }
  else if (event.key === '.' && !event.repeat) {
    app.sequence.next();
    app.ui.frameList.render({ cmd: 'select', index: app.sequence.position });
    app.render();
  }
  else if (event.key === ',' && !event.repeat) {
    app.sequence.previous();
    app.ui.frameList.render({ cmd: 'select', index: app.sequence.position });
    app.render();
  }
  else if (event.key === 'n' && !event.repeat) {
    app.newFrame();
    // app.sequence.next();
    // app.ui.frameList.render({ cmd: 'select', index: app.sequence.position });
    // app.render();
  }
  else {
    if (app.tool) app.tool.handleEvent(event);
  }
}

app.onKeyUp = function(event) {
  delete app.key[event.key];

  if (event.key === Const.KEY_DRAG) {
     if (!app.mouseLeft) {
       app.setMode('tool');
     }
  } else {
    if (app.tool) app.tool.handleEvent(event);
  }
}

app.repositionPanels = function() {
  // app.ui.history.reposition();
  // app.ui.properties.reposition();
  // app.ui.tools.reposition();r
}

app.reposition = function() {
  // var width = window.innerWidth - 64 - 256, height = window.innerHeight - 48 - 32;
  app.width = window.innerWidth;
  app.height = window.innerHeight;

  var width = window.innerWidth - app.regions['tools'].el.offsetWidth - app.regions['properties'].el.offsetWidth;
  var height = window.innerHeight - app.regions['header'].el.offsetHeight - app.regions['footer'].el.offsetHeight
    - app.ui.frameList.el.offsetHeight - app.ui.frameListBar.el.offsetHeight;

  app.paper.resize(width, height);

  app.overlay.width = width;
  app.overlay.height = height;
  app.overlayContainer.style.width = width + 'px';
  app.overlayContainer.style.height = height + 'px';
  app.overlayContainer.style.left = app.paper.el.offsetLeft + 'px';
  app.overlayContainer.style.top = app.paper.el.offsetTop + 'px';

  // console.log(window.innerHeight - app.regions['header'].el.offsetHeight - app.regions['footer'].el.offsetHeight - app.ui.frameList.el.offsetHeight);
  // console.log(app.ui.frameList.el.offsetHeight);

  // app.ui.frameList.el.style.width = (window.innerWidth - app.regions['tools'].el.offsetWidth - app.regions['properties'].el.offsetWidth) + 'px';
  app.ui.frameList.adjust();
  // app.ui.frameListScroller.adjust({ page: app.ui.frameList.el.offsetWidth, total: this.container.el.offsetWidth });
}

app.onResize = function() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.reposition();
      window.resizeTimeoutId = 0;
      // app.repositionPanels();
      app.render();
    }, 50);
  }
}

app.handleEvent = function(event) {
  if (event.type === 'mousedown') {
    app.onMouseDown(event);
  }
  else if (event.type === 'mousemove') {
    app.onMouseMove(event);
  }
  else if (event.type === 'mouseup') {
    app.onMouseUp(event);
  }
  else if (event.type === 'keydown') {
    app.onKeyDown(event);
  }
  else if (event.type === 'keyup') {
    app.onKeyUp(event);
  }
  else if (event.type === 'resize') {
    app.onResize(event);
  }
}

app.initEventListeners = function() {
  window.addEventListener('mousedown', this);
  window.addEventListener('mousemove', this);
  window.addEventListener('mouseup', this);
  window.addEventListener('keydown', this);
  window.addEventListener('keyup', this);
  window.addEventListener('resize', this);
}

window.app = app;
window.simplify = require('./lib/simplify');

window.onload = function(event) {
  app.preload();
};
