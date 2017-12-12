(function () {

const Const = require('./const');
const Util = require('./util');
const Color = require('./color');
const Tools = require('./tools/');
const ToolsPalette = require('./ui/tools');
const Stroke = require('./stroke');
const Sequence = require('./sequence');
const Geom = require('./geom/');
const HistoryPanel = require('./ui/panels/history_panel');
const PropertiesPanel = require('./ui/panels/properties_panel');
const StrokeProperties = require('./ui/panels/properties/stroke_properties');
const Panels = require('./ui/panels/');
const Container = require('./ui/container');
const Options = require('./ui/options');
const Paper = require('./ui/paper');
const Status = require('./ui/status');
// const Frames = require('./ui/frames');
const FrameList = require('./ui/frame_list');
// const FrameListBar = require('./ui/frame_list_bar');
// const FrameListNew = require('./ui/frame_list_new');
const Actions = require('./actions/');
const HistoryState = require('./history_state');
const Loader = require('./loader');

var width, height;
var settings;
var cursors;
var ui;
var mouseX, mouseY, mouseDownX, mouseDownY;
var mouseTarget, mouseTargetTag;
var mouseDownTargetTag, mouseDownTarget;
var keys;
var tags;
var mode;
var tool;
var tools;
var sequence;

function startup() {
  console.log('startup');

  width = window.innerWidth;
  height = window.innerHeight;

  tags = {};
  keys = {};
  settings = {};

  // bitmap cursors
  cursors = {};
  cursors['pointer'] = 'url(./images/cursor_pointer.png) 1 1, auto';
  cursors['pencil'] = 'url(./images/cursor_pencil.png) 1 1, auto';
  cursors['line'] = 'url(./images/cursor_line.png) 3 3, auto';
  cursors['hand'] = 'url(./images/cursor_hand.png) 12 12, auto';
  cursors['zoomin'] = 'url(./images/cursor_zoomin.png) 7 7, auto';
  cursors['zoomout'] = 'url(./images/cursor_zoomout.png) 7 7, auto';

  ui = {};
  ui.main = new Container({ id: 'main' });
  document.body.appendChild(ui.main.getDOMElement());

  ui.toolsPalette = new ToolsPalette();
  ui.toolsPalette.bind('tool-change', function(params) {
    setTool(params.tool);
  });
  ui.main.add(ui.toolsPalette);
  // app.ui.left.add(app.ui.toolsPalette);

  ui.paper = new Paper({ id: 'paper' });
  ui.paper.bind('zoom', function(params) {
    // status.setZoom(params.scale)

  });
  ui.paper.bind('pick', function(params) {
  });
  // app.ui.main.add(app.ui.paper);

  ui.frameList = new FrameList({ id: 'frame-list' });
  ui.main.add(ui.frameList);


  sequence = new Sequence();
  newFrame();

  window.sequence = sequence;

  tools = {};

  tools.pointer = new Tools.Pointer();
  tools.pointer.bind('marquee', function(params) {
    var p1 = ui.paper.screenToWorld(params.xmin, params.ymin);
    var p2 = ui.paper.screenToWorld(params.xmax, params.ymax);

    marqueeSelect(p1.x, p1.y, p2.x, p2.y);

    if (sequence.selection.elements.length === 1)
      showProperties(sequence.selection.elements[0]);
    else
      showProperties();

    render();
  });
  tools.pointer.bind('pick', function(params) {
    if (sequence.selection.elements.length === 1)
      showProperties(params.stroke);
    else
      showProperties();
    render();
  });
  tools.pointer.bind('moved', function(params) {
    updateFrameListIcon(sequence.frame);
    render();
  });
  tools.pointer.bind('drag', function(params) {
    // app.updateFrameListIcon(app.sequence.frame);
    render();
  });
  tools.pointer.bind('delete', function(params) {
    sequence.deleteSelected();
    // app.addAction(new Actions.Delete());
    updateFrameListIcon(sequence.frame);
    render();
  });
  tools.pointer.bind('change', function(params) {
    // console.log('change');
    render();
  });

  // app.tools.pointer = new Tools.Pointer();

  tools.pen = new Tools.Pen();
  tools.pen.bind('stroke', function(params) {
    // console.log(params.points);
    var fill = ui.toolsPalette.getFillColor();
    var color = ui.toolsPalette.getStrokeColor()
    // console.log(fill, color);
    createStroke(params.points, color, fill);
    // app.addAction(new Actions.Pencil());
  });
  tools.pen.bind('change', function(params) {
    render();
  });

  tools.pencil = new Tools.Pencil();
  tools.pencil.bind('stroke', function(params) {
    // app.createStroke(params.points);
    // console.log('stroke');
    // app.addAction(new Actions.Pencil());
  });
  tools.pencil.bind('change', function(params) {
    render();
  });

  tools.line = new Tools.Line();
  tools.line.bind('stroke', function(params) {
    createStroke(params.points, ui.toolsPalette.getStrokeColor(), ui.toolsPalette.getFillColor());
    // app.addAction(new Actions.Line());
  });
  tools.line.bind('change', function(params) {
    render();
  });

  tools.polygon = new Tools.Polygon();
  tools.polygon.bind('change', function(params) {
    render();
  });
  tools.polygon.bind('stroke', function(params) {
    // app.createStroke(params.points);
    createStroke(params.points, ui.toolsPalette.getStrokeColor(), ui.toolsPalette.getFillColor());
  });

  tools.knife = new Tools.Knife();

  tools.hand = new Tools.Hand();
  tools.hand.bind('change', function(params) {
    var dx = params.dx, dy = params.dy;
    ui.paper.panCameraBy(dx, dy);
    render();
  });

  tools.zoom = new Tools.Zoom();
  tools.zoom.bind('zoom-in', function(params) {
    ui.paper.zoomIn();
    ui.status.setZoom(ui.paper.scale);
    render();
  });
  tools.zoom.bind('zoom-out', function(params) {
    ui.paper.zoomOut();
    ui.status.setZoom(ui.paper.scale);
    render();
  });

  reposition();
  render();

  setTool('pen');
  setMode('tool');

  // ui.status.setZoom(1);
  updateFrameLabel();
}

function getOverlayContext() {
  return ui.paper.overlayCanvas.getContext('2d');
}


function render() {

  ui.paper.clear();
  ui.paper.clearOverlay();

  // render previous frame

  if (settings['onion']) {
    if (sequence.position > 0) {
      var frame = sequence.frames[sequence.position - 1];
      for (var i = 0; i < frame.strokes.length; i++) {
        var stroke = frame.strokes[i];
        ui.paper.renderPath(stroke.points, { strokeStyle: Const.color.Onion, fill: stroke.fill ? Color.White : undefined });
      }
    }
  }

  // render unselected strokes

  for (var i = 0; i < sequence.frame.strokes.length; i++) {
    var stroke = sequence.frame.strokes[i];
    // if (stroke.selected) {
      // ui.paper.renderStroke(stroke, { strokeStyle: 'dodgerblue', lineWidth: 2 } );
    // } else {
      ui.paper.renderPath(stroke.points, { fill: stroke.fill ? Color.White : undefined });
    // }
  }

  // render selected strokes

  for (var i = 0; i < sequence.selection.elements.length; i++) {
    var element = sequence.selection.elements[i];
    if (element instanceof Stroke) {
      // ui.paper.renderPath(element.points, { strokeStyle: Const.color.Selection, lineWidth: 2, fill: element.fill ? Color.Red : undefined });
      ui.paper.renderPath(element.points, { strokeStyle: Const.color.Selection, lineWidth: 2, fill: undefined });
    }
  }

  // render vertices

  if (settings['dots']) {
    for (var i = 0; i < sequence.frame.strokes.length; i++) {
      var stroke = sequence.frame.strokes[i];
      ui.paper.renderDots(stroke);
    }
  }

  // ui.paper.renderBitmap();

  if (tool) tool.render();

  ui.paper.render();
}

function setMode(mode) {
  if (mode !== mode) {
    mode = mode;
    if (mode === 'pan') {
      setCursor('hand');
    } else {
      if (tool) setCursor(tool.cursor);
    }
  }
}

function setTool(name) {
  if (tool !== tools[name]) {
    if (tool) {
      tool.blur();
      previousTool = tool;
    }
    tool = tools[name];
    tool.focus();
    setCursor(tool.cursor);
    ui.toolsPalette.setTool(name);
  }
}

function setCursor(name) {
  ui.paper.el.style.cursor = cursors[name];
}

function undo() {
  // sequence.undo();
  // ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });
}

function redo() {
  // sequence.redo();
}

function hitTest(x, y) {
  // var p = new Point(x, y);
  var p = ui.paper.screenToWorld(x, y);
  var selection = null;
  var radius = 4 / ui.paper.scale;

  var strokes = sequence.frame.strokes;

  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i];
    if (stroke.hitTest(p.x, p.y, radius)) {
      selection = stroke;
      break;
    }
  }

  return selection;
}

function marqueeSelect(xmin, ymin, xmax, ymax) {

  var candidates = [];
  // var intersect = false;
  var frame = sequence.frame;

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

  sequence.selection.clear();
  sequence.selection.add(candidates);

  // return selection;
};

function createPath(ctx, points, dx, dy) {
}

function strokeFromPoints(sourcePoints, convertToWorld) {
  var points = [];
  for (var i = 0; i < sourcePoints.length; i++) {
    var p = sourcePoints[i];
    var x = p.x, y = p.y;
    if (convertToWorld) {
      points[i] = ui.paper.screenToWorld(x, y);
    } else {
      points[i] = new Point(x, y);
    }
  }
  return new Stroke({ points: points });
}

function updateFrameLabel() {
  // ui.frameListBar.setFrame(sequence.position + 1, sequence.size());
  // console.log('update');
  ui.frameList.render({ cmd: 'update', index: sequence.position + 1, total: sequence.size() });
}

function updateFrameListIcon(frame) {
  var index = sequence.frames.indexOf(frame);
  // var frame = sequence.frames[index];
  var scale = ui.frameList.width / Const.WIDTH;
  var width = ui.frameList.width;
  var height = ui.frameList.height;
  var frameIcon = ui.frameList.get(index);

  if (frameIcon) {
    var ctx = frameIcon.canvas.getContext('2d')
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = Const.color.Stroke.toHexString();

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

function go(index) {
  sequence.go(index);
  ui.frameList.render({ cmd: 'select', index: index });
  updateFrameLabel();

  // var items = [];
  // for (var i = 0; i < sequence.frame.history.states.length; i++) {
  //   var state = sequence.frame.history.states[i];
  //   items.push({ id: i, title: state.action.name });
  // }
  // ui.history.render({ cmd: 'populate', items: items });
  // ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });

  render();
}

function showProperties(object) {
  if (object instanceof Stroke) {
    // ui.properties.render({ cmd: 'show', object: object });
    ui.properties.setPane(ui.strokeProperties);
    ui.strokeProperties.render({ cmd: 'show', object: object });

  } else {
    // ui.properties.render({ cmd: 'clear' });
    ui.properties.setPane();
  }
}

function newFrame() {
  sequence.add();
  sequence.end();

  ui.frameList.render({ cmd: 'frameAdd' });
  ui.frameList.render({ cmd: 'select', index: sequence.position });
  updateFrameListIcon(sequence.frame);
  updateFrameLabel();

  // sequence.frame.history.add(new HistoryState(new Actions.New(), sequence.frame.copy()));

  // ui.history.render({ cmd: 'populate', items: [{ id: sequence.frame.history.marker, title: 'New' }] });
  // ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });

  render();
}

function removeFrame() {
  if (sequence.size() > 1) {
    sequence.remove();
    // sequence.go(sequence.position - 1);

    ui.frameList.render({ cmd: 'frameRemove', index: sequence.position });
    // ui.frameList.render({ cmd: 'select', index: sequence.position });

    // updateFrameListIcon(sequence.frame);
    // updateFrameLabel();
    // console.log('remove');
    // render();
    go(sequence.position);
  }
}

function addAction(action) {
  // sequence.addAction(new Actions.Pencil());
  sequence.frame.history.add(new HistoryState(action, sequence.frame.copy()));
  // ui.history.render({ cmd: 'add', id: sequence.frame.history.marker, title: action.name });
  // ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });
}

function createStroke(points, color, fill) {
  // console.log(points, color, fill);
  var stroke = strokeFromPoints(points, true);
  // console.log(stroke);
  stroke.setColor(color);
  stroke.setFill(fill);
  sequence.frame.addStroke(stroke);
  updateFrameListIcon(sequence.frame);
  render();
}

function setStrokeFill(fill) {
  for (var i = 0; i < sequence.selection.elements.length; i++) {
    var element = sequence.selection.elements[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
}

function repositionPanels() {
  // ui.history.reposition();
  // ui.properties.reposition();
  // ui.tools.reposition();
}

function reposition() {
  width = window.innerWidth;
  height = window.innerHeight;

  // var width = window.innerWidth - ui.left.el.offsetWidth;
  // var height = window.innerHeight - ui.header.el.offsetHeight - ui.footer.el.offsetHeight
    // - ui.frameList.el.offsetHeight - ui.frameListBar.el.offsetHeight;

  var width = window.innerWidth;
  var height = window.innerHeight;

  ui.paper.resize(width, height);

  // var b = ((width / 2) - (ui.frameListBar.el.offsetWidth/2)) >> 0;
  // ui.frameListBar.el.style.left = b + 'px';

  b = ((height / 2) - (ui.toolsPalette.el.offsetHeight/2)) >> 0;
  ui.toolsPalette.el.style.top = b + 'px';

  // b = ((width / 2) - (ui.frameList.el.offsetWidth/2)) >> 0;
  // ui.frameList.el.style.left = b + 'px';

  // ui.frames.adjust();
}

window.onclick = function(event) {
  // console.log('window click');
  // event.preventDefault();
  // event.stopPropagation();
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
}

window.onmousedown = function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  ui.paper.mouseX = mouseX - ui.paper.el.offsetLeft;
  ui.paper.mouseY = mouseY - ui.paper.el.offsetTop;

  mouseDownX = mouseX;
  mouseDownY = mouseY;

  ui.paper.mouseDownX = mouseDownX - ui.paper.el.offsetLeft;
  ui.paper.mouseDownY = mouseDownY - ui.paper.el.offsetTop;

  mouseLeft = (event.button === 0);

  mouseTarget = event.target;
  mouseTargetTag = event.target.dataset.tag;

  mouseDownTarget = event.target;
  mouseDownTargetTag = event.target.dataset.tag;

  if (event.buttons === 4) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (mouseDownTargetTag === 'paper') {
    if (mode === 'pan') {
    } else {
      tool.handleEvent(event);
      // event.preventDefault();
      // event.stopPropagation();
    }
  } else {
    console.log(mouseTargetTag);
    var target = tags[mouseTargetTag];
    if (target) {
      target.handleEvent(event);
    }
  }
}

window.onmouseup = function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  ui.paper.mouseX = mouseX - ui.paper.el.offsetLeft;
  ui.paper.mouseY = mouseY - ui.paper.el.offsetTop;

  mouseTarget = event.target;
  mouseTargetTag = event.target.dataset.tag;

  mouseLeft = (event.button === 0) ? false : mouseLeft;

  if (mode === 'pan') {
    if (!keys[Const.KEY_PAN] && event.button === 0) {
      setMode('tool');
    }
  } else {
    if (mouseDownTargetTag === 'paper') {
      tool.handleEvent(event);
      // event.preventDefault();
      // event.stopPropagation();
    } else {
      var target = tags[mouseTargetTag];
      if (target) {
        target.handleEvent(event);
      }
    }
  }

  mouseDownTargetTag = null;
  mouseDownTarget = null;
}

window.onmousemove = function(event) {
  var previousX = mouseX;
  var previousY = mouseY;

  mouseX = event.clientX;
  mouseY = event.clientY;

  // ui.paper.mouseX = mouseX - ui.paper.el.offsetLeft;
  // ui.paper.mouseY = mouseY - ui.paper.el.offsetTop;

  mouseDeltaX = mouseX - previousX;
  mouseDeltaY = mouseY - previousY;

  mouseTarget = event.target;
  mouseTargetTag = event.target.dataset.tag;

  if (mode === 'pan') {
    if (event.buttons === 1) {

      var dx = -mouseDeltaX / ui.paper.scale;
      var dy = -mouseDeltaY / ui.paper.scale;

      ui.paper.panCameraBy(dx, dy);
      render();
    }
  } else {
    if (mouseDownTargetTag) {
      if (mouseDownTargetTag === 'paper') {
        tool.handleEvent(event);
        event.preventDefault();
        event.stopPropagation();
      } else {
        var target = tags[mouseDownTargetTag];
        if (target) {
          target.handleEvent(event);
        }
      }
    } else {
      if (mouseTargetTag === 'paper') {
        tool.handleEvent(event);
      }
    }
  }
}

window.onmouseout = function(event) {
  mouseTarget = event.target;
  mouseTargetTag = event.target.dataset.tag;

  if (mouseDownTargetTag) {
    if (mouseDownTargetTag === mouseTargetTag) {
      var target = tags[mouseTargetTag];
      if (target) {
        // console.log('out', mouseDownTargetTag, mouseTargetTag);
        target.handleEvent(event);
      }
    }
  } else {
    var target = tags[mouseTargetTag];
    if (target) {
      target.handleEvent(event);
    }
  }
}

window.onmouseover = function(event) {
  mouseTarget = event.target;
  mouseTargetTag = event.target.dataset.tag;

  if (mouseDownTargetTag) {
    if (mouseDownTargetTag === mouseTargetTag) {
      var target = tags[mouseTargetTag];
      if (target) {
        target.handleEvent(event);
      }
    }
  } else {
    var target = tags[mouseTargetTag];
    if (target) {
      target.handleEvent(event);
    }
  }
}

window.onkeydown = function(event) {
  keys[event.key] = true;

  if (event.key === Const.KEY_PAN) {
    event.preventDefault();
    if (!event.repeat) {
      if (!mouseLeft) {
        setMode('pan');
      }
    }
  }
  else if (event.key == 'b' && !event.repeat) {
    setTool('pen');
  }
  else if (event.key == 'q' && !event.repeat) {
    setTool('pointer');
  }
  else if (event.key == 'z' && !event.repeat) {
    if (event.ctrlKey)
      undo();
    else
      setTool('zoom');
  }
  else if (event.key === 'd' && !event.repeat) {
    settings['dots'] = !settings['dots'];
    render();
  }
  else if (event.key === 'h' && !event.repeat) {
    ui.paper.center();
    render();
  }
  else if (event.key === '.' && !event.repeat) {
    sequence.next();
    ui.frameList.render({ cmd: 'select', index: sequence.position });
    render();
  }
  else if (event.key === ',' && !event.repeat) {
    sequence.previous();
    ui.frameList.render({ cmd: 'select', index: sequence.position });
    render();
  }
  else if (event.key === 'n' && !event.repeat) {
    newFrame();
  }
  else {
    if (tool) tool.handleEvent(event);
  }
}

window.onkeyup = function(event) {
  delete keys[event.key];

  if (event.key === Const.KEY_PAN) {
     if (!mouseLeft) {
       setMode('tool');
     }
  } else {
    if (tool) tool.handleEvent(event);
  }
}

window.onresize = function() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      reposition();
      window.resizeTimeoutId = 0;
      render();
    }, 66);
  }
}

window.onpaste = function(event) {
  var target = tags[mouseTargetTag];
  if (target) {
    target.handleEvent(event);
  }
}

window.oncopy = function(event) {
  var target = tags[mouseTargetTag];
  if (target) {
    target.handleEvent(event);
  }
}

// handleEvent = function(event) {
//   if (event.type === 'click') {
//     onClick(event);
//   }
//   else if (event.type === 'mousedown') {
//     onMouseDown(event);
//   }
//   else if (event.type === 'mouseup') {
//     onMouseUp(event);
//   }
//   else if (event.type === 'mousemove') {
//     onMouseMove(event);
//   }
//   else if (event.type === 'mouseover') {
//     onMouseOver(event);
//   }
//   else if (event.type === 'mouseout') {
//     onMouseOut(event);
//   }
//   else if (event.type === 'keydown') {
//     onKeyDown(event);
//   }
//   else if (event.type === 'keyup') {
//     onKeyUp(event);
//   }
//   else if (event.type === 'resize') {
//     onResize(event);
//   }
//   else if (event.type === 'paste') {
//     onPaste(event);
//   }
//   else if (event.type === 'copy') {
//     onCopy(event);
//   }
// }

// initEventListeners = function() {
//   window.addEventListener('click', this);
//   window.addEventListener('mousedown', this);
//   window.addEventListener('mousemove', this);
//   window.addEventListener('mouseup', this);
//   window.addEventListener('mouseover', this);
//   window.addEventListener('mouseout', this);
//   window.addEventListener('keydown', this);
//   window.addEventListener('keyup', this);
//   window.addEventListener('resize', this);
//   window.addEventListener('copy', this);
//   window.addEventListener('paste', this);
// }

window.onload = () => {
  console.log('load');
  startup();
}
// ipcRenderer.on('load', startup);

window.onmousedown = (e) => {
  console.log('onmousedown');
}

window.onclick = (e) => {
  console.log('click');
}

window.app = this;
window.simplify = require('./lib/simplify');

}());
