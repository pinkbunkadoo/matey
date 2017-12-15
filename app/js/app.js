const Const = require('./const');
const Util = require('./util');
const Color = require('./color');
const Tools = require('./tools/');
const ToolsPalette = require('./ui/tools');
const ControlPalette = require('./ui/control_palette');
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

var app = {
  width: 0, height: 0,
  settings: [],
  cursors: [],
  ui: [],
  mouseX: 0, mouseY: 0, mouseDownX: 0, mouseDownY: 0,
  mouseLeft: false,
  mouseTarget: null, mouseTargetTag: null,
  mouseDownTargetTag: null, mouseDownTarget: null,
  keys: [],
  tags: [],
  mode: null,
  tool: null,
  tools: [],
  sequence: null,
  captureTarget: null
}

app.getOverlayContext = () => {
  return app.ui.paper.overlayCanvas.getContext('2d');
}


app.render = () => {
  // app.ui.paper.clear();
  // app.ui.paper.clearOverlay();

  // render previous frame

  // if (settings['onion']) {
  //   if (sequence.position > 0) {
  //     var frame = sequence.frames[sequence.position - 1];
  //     for (var i = 0; i < frame.strokes.length; i++) {
  //       var stroke = frame.strokes[i];
  //       app.ui.paper.renderPath(stroke.points, { strokeStyle: Const.color.Onion, fill: stroke.fill ? Color.White : undefined });
  //     }
  //   }
  // }

  // render unselected strokes

  // for (var i = 0; i < sequence.frame.strokes.length; i++) {
  //   var stroke = sequence.frame.strokes[i];
  //   // if (stroke.selected) {
  //     // app.ui.paper.renderStroke(stroke, { strokeStyle: 'dodgerblue', lineWidth: 2 } );
  //   // } else {
  //     app.ui.paper.renderPath(stroke.points, { fill: stroke.fill ? Color.White : undefined });
  //   // }
  // }

  // render selected strokes

  // for (var i = 0; i < sequence.selection.elements.length; i++) {
  //   var element = sequence.selection.elements[i];
  //   if (element instanceof Stroke) {
  //     // app.ui.paper.renderPath(element.points, { strokeStyle: Const.color.Selection, lineWidth: 2, fill: element.fill ? Color.Red : undefined });
  //     app.ui.paper.renderPath(element.points, { strokeStyle: Const.color.Selection, lineWidth: 2, fill: undefined });
  //   }
  // }

  // render vertices

  // if (settings['dots']) {
  //   for (var i = 0; i < sequence.frame.strokes.length; i++) {
  //     var stroke = sequence.frame.strokes[i];
  //     app.ui.paper.renderDots(stroke);
  //   }
  // }

  // app.ui.paper.renderBitmap();

  // if (tool) tool.render(getOverlayContext());
  app.ui.paper.clearDisplayList();

  for (let i = 0; i < app.sequence.frame.strokes.length; i++) {
    let stroke = app.sequence.frame.strokes[i];
    app.ui.paper.addDisplayItem({ points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: Const.LINE_WIDTH });
  }

  for (let i = 0; i < app.sequence.selection.elements.length; i++) {
    let stroke = app.sequence.selection.elements[i];
    app.ui.paper.addDisplayItem({ points: stroke.points, color: Const.COLOR_SELECTION, thickness: Const.LINE_WIDTH * 2 });
  }

  app.ui.paper.render();
}

app.setCaptureTarget = (target) => {
  app.captureTarget = target;
}

app.setMode = (desiredMode) => {
  if (desiredMode !== app.mode) {
    app.mode = desiredMode;
    if (app.mode === 'pan') {
      app.setCursor('hand');
    } else {
      if (app.tool) app.setCursor(app.tool.cursor);
    }
  }
}

app.setTool = (name) => {
  if (app.tool !== app.tools[name]) {
    if (app.tool) {
      app.tool.blur();
      app.previousTool = app.tool;
    }
    app.tool = app.tools[name];
    app.tool.focus();
    app.setCursor(app.tool.cursor);
    app.ui.toolsPalette.setTool(name);
    app.ui.paper.tool = app.tool;
  }
}

app.setCursor = (name) => {
  app.ui.paper.el.style.cursor = app.cursors[name];
}

app.undo = () => {
  // sequence.undo();
  // app.ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });
}

app.redo = () => {
  // sequence.redo();
}

app.hitTest = (x, y) => {
  // console.log('app.hitTest', x, y);
  var p = app.ui.paper.screenToWorld(x, y);
  var selection = null;
  var radius = 4 / app.ui.paper.scale;

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

app.marqueeSelect = (xmin, ymin, xmax, ymax) => {

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
}

app.createPath = (ctx, points, dx, dy) => {
}

app.strokeFromPoints = (sourcePoints, convertToWorld) => {
  var points = [];
  for (var i = 0; i < sourcePoints.length; i++) {
    var p = sourcePoints[i];
    var x = p.x, y = p.y;
    if (convertToWorld) {
      points[i] = app.ui.paper.screenToWorld(x, y);
    } else {
      points[i] = new Point(x, y);
    }
  }
  return new Stroke({ points: points });
}

app.updateFrameLabel = () => {
  // app.ui.frameListBar.setFrame(sequence.position + 1, sequence.size());
  // console.log('update');
  app.ui.frameList.render({ cmd: 'update', index: app.sequence.position + 1, total: app.sequence.size() });
}

app.updateFrameListThumbnail = (frame) => {
  var index = app.sequence.frames.indexOf(frame);
  // var frame = sequence.frames[index];
  var scale = app.ui.frameList.thumbnailWidth / Const.WIDTH;
  var width = app.ui.frameList.thumbnailWidth;
  var height = app.ui.frameList.thumbnailHeight;
  var frameListItem = app.ui.frameList.get(index);

  if (frameListItem) {
    var ctx = frameListItem.canvas.getContext('2d')
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = Const.COLOR_STROKE.toHexString();

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

app.go = (index) => {
  app.sequence.go(index);
  app.ui.frameList.render({ cmd: 'select', index: index });
  // app.updateFrameLabel();

  // var items = [];
  // for (var i = 0; i < sequence.frame.history.states.length; i++) {
  //   var state = sequence.frame.history.states[i];
  //   items.push({ id: i, title: state.action.name });
  // }
  // app.ui.history.render({ cmd: 'populate', items: items });
  // app.ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });

  app.render();
}

app.showProperties = (object) => {
  // if (object instanceof Stroke) {
  //   // app.ui.properties.render({ cmd: 'show', object: object });
  //   app.ui.properties.setPane(app.ui.strokeProperties);
  //   app.ui.strokeProperties.render({ cmd: 'show', object: object });
  //
  // } else {
  //   // app.ui.properties.render({ cmd: 'clear' });
  //   app.ui.properties.setPane();
  // }
}

app.newFrame = () => {
  app.sequence.add();
  app.sequence.end();

  app.ui.frameList.render({ cmd: 'frameAdd' });
  app.ui.frameList.render({ cmd: 'select', index: app.sequence.position });
  app.updateFrameListThumbnail(app.sequence.frame);
  app.updateFrameLabel();

  // sequence.frame.history.add(new HistoryState(new Actions.New(), sequence.frame.copy()));

  // app.ui.history.render({ cmd: 'populate', items: [{ id: sequence.frame.history.marker, title: 'New' }] });
  // app.ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });

  app.render();
}

app.removeFrame = () => {
  if (app.sequence.size() > 1) {
    app.sequence.remove();
    // sequence.go(sequence.position - 1);

    app.ui.frameList.render({ cmd: 'frameRemove', index: app.sequence.position });
    // app.ui.frameList.render({ cmd: 'select', index: sequence.position });

    // updateFrameListIcon(sequence.frame);
    // updateFrameLabel();
    // console.log('remove');
    // render();
    app.go(app.sequence.position);
  }
}

app.addAction = (action) => {
  // sequence.addAction(new Actions.Pencil());
  app.sequence.frame.history.add(new HistoryState(action, app.sequence.frame.copy()));
  // app.ui.history.render({ cmd: 'add', id: sequence.frame.history.marker, title: action.name });
  // app.ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });
}

app.createStroke = (points, color, fill) => {
  // console.log(points, color, fill);
  var stroke = app.strokeFromPoints(points, true);
  // console.log(stroke);
  stroke.setColor(color);
  stroke.setFill(fill);

  app.sequence.frame.addStroke(stroke);
  app.updateFrameListThumbnail(sequence.frame);
  app.render();
}

app.setStrokeFill = (fill) => {
  for (var i = 0; i < app.sequence.selection.elements.length; i++) {
    var element = app.sequence.selection.elements[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
}

app.repositionPanels = () => {
  // app.ui.history.reposition();
  // app.ui.properties.reposition();
  // app.ui.tools.reposition();
}

app.reposition = () => {
  app.width = window.innerWidth;
  app.height = window.innerHeight;

  // var width = window.innerWidth;
  // var height = window.innerHeight;

  app.ui.paper.resize(app.width, app.height);

  // var b = ((width / 2) - (app.ui.frameListBar.el.offsetWidth/2)) >> 0;
  // app.ui.frameListBar.el.style.left = b + 'px';

  pos = ((app.height / 2) - (app.ui.toolsPalette.el.offsetHeight/2)) >> 0;
  app.ui.toolsPalette.el.style.top = pos + 'px';

  pos = ((app.width / 2) - (app.ui.controlPalette.el.offsetWidth/2)) >> 0;
  app.ui.controlPalette.el.style.left = pos + 'px';

}

window.onclick = function(event) {
  // app.ui.paper.handleEvent(event);

  // console.log('window click');
  // event.preventDefault();
  // event.stopPropagation();
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
}

window.onmousedown = function(event) {
  // if (event.target == app.ui.paper.el) {
  //   app.ui.paper.handleEvent(event);
  // }

  // mouseX = event.clientX;
  // mouseY = event.clientY;
  //
  // app.ui.paper.mouseX = mouseX - app.ui.paper.el.offsetLeft;
  // app.ui.paper.mouseY = mouseY - app.ui.paper.el.offsetTop;
  //
  // mouseDownX = mouseX;
  // mouseDownY = mouseY;
  //
  // app.ui.paper.mouseDownX = mouseDownX - app.ui.paper.el.offsetLeft;
  // app.ui.paper.mouseDownY = mouseDownY - app.ui.paper.el.offsetTop;
  //
  // mouseLeft = (event.button === 0);
  //
  // mouseTarget = event.target;
  // mouseTargetTag = event.target.dataset.tag;
  //
  // mouseDownTarget = event.target;
  // mouseDownTargetTag = event.target.dataset.tag;
  //
  // if (event.buttons === 4) {
  //   event.preventDefault();
  //   event.stopPropagation();
  // }
  //
  // if (mouseDownTargetTag === 'paper') {
  //   if (mode === 'pan') {
  //   } else {
  //     tool.handleEvent(event);
  //     // event.preventDefault();
  //     // event.stopPropagation();
  //   }
  // } else {
  //   console.log(mouseTargetTag);
  //   var target = tags[mouseTargetTag];
  //   if (target) {
  //     target.handleEvent(event);
  //   }
  // }
}

window.onmouseup = function(event) {
  // app.ui.paper.handleEvent(event);

  // if (captureTarget) {
  //   captureTarget.handleEvent(event);
  // }

  // mouseX = event.clientX;
  // mouseY = event.clientY;
  //
  // app.ui.paper.mouseX = mouseX - app.ui.paper.el.offsetLeft;
  // app.ui.paper.mouseY = mouseY - app.ui.paper.el.offsetTop;
  //
  // mouseTarget = event.target;
  // mouseTargetTag = event.target.dataset.tag;
  //
  // mouseLeft = (event.button === 0) ? false : mouseLeft;
  //
  // if (mode === 'pan') {
  //   if (!keys[Const.KEY_PAN] && event.button === 0) {
  //     setMode('tool');
  //   }
  // } else {
  //   if (mouseDownTargetTag === 'paper') {
  //     tool.handleEvent(event);
  //     // event.preventDefault();
  //     // event.stopPropagation();
  //   } else {
  //     var target = tags[mouseTargetTag];
  //     if (target) {
  //       target.handleEvent(event);
  //     }
  //   }
  // }
  //
  // mouseDownTargetTag = null;
  // mouseDownTarget = null;
}

window.onmousemove = function(event) {
  // if (captureTarget) {
  //   captureTarget.handleEvent(event);
  // } else {
  //   if (event.target === app.ui.paper.el) {
  //     app.ui.paper.handleEvent(event);
  //   }
  // }

  // var previousX = mouseX;
  // var previousY = mouseY;
  //
  // mouseX = event.clientX;
  // mouseY = event.clientY;
  //
  // // app.ui.paper.mouseX = mouseX - app.ui.paper.el.offsetLeft;
  // // app.ui.paper.mouseY = mouseY - app.ui.paper.el.offsetTop;
  //
  // mouseDeltaX = mouseX - previousX;
  // mouseDeltaY = mouseY - previousY;
  //
  // mouseTarget = event.target;
  // mouseTargetTag = event.target.dataset.tag;
  //
  // if (mode === 'pan') {
  //   if (event.buttons === 1) {
  //
  //     var dx = -mouseDeltaX / app.ui.paper.scale;
  //     var dy = -mouseDeltaY / app.ui.paper.scale;
  //
  //     app.ui.paper.panCameraBy(dx, dy);
  //     render();
  //   }
  // } else {
  //   if (mouseDownTargetTag) {
  //     if (mouseDownTargetTag === 'paper') {
  //       tool.handleEvent(event);
  //       event.preventDefault();
  //       event.stopPropagation();
  //     } else {
  //       var target = tags[mouseDownTargetTag];
  //       if (target) {
  //         target.handleEvent(event);
  //       }
  //     }
  //   } else {
  //     if (mouseTargetTag === 'paper') {
  //       tool.handleEvent(event);
  //     }
  //   }
  // }
}

window.onmouseout = function(event) {
  // app.ui.paper.handleEvent(event);

  // mouseTarget = event.target;
  // mouseTargetTag = event.target.dataset.tag;
  //
  // if (mouseDownTargetTag) {
  //   if (mouseDownTargetTag === mouseTargetTag) {
  //     var target = tags[mouseTargetTag];
  //     if (target) {
  //       // console.log('out', mouseDownTargetTag, mouseTargetTag);
  //       target.handleEvent(event);
  //     }
  //   }
  // } else {
  //   var target = tags[mouseTargetTag];
  //   if (target) {
  //     target.handleEvent(event);
  //   }
  // }
}

window.onmouseover = function(event) {
  // app.ui.paper.handleEvent(event);

  // mouseTarget = event.target;
  // mouseTargetTag = event.target.dataset.tag;
  //
  // if (mouseDownTargetTag) {
  //   if (mouseDownTargetTag === mouseTargetTag) {
  //     var target = tags[mouseTargetTag];
  //     if (target) {
  //       target.handleEvent(event);
  //     }
  //   }
  // } else {
  //   var target = tags[mouseTargetTag];
  //   if (target) {
  //     target.handleEvent(event);
  //   }
  // }
}

window.onkeydown = function(event) {
  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  } else {
    app.ui.paper.handleEvent(event);
  }

  if (event.key == 'b' && !event.repeat) {
    app.setTool('pen');
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
    app.settings['dots'] = !app.settings['dots'];
    app.render();
  }
  else if (event.key === 'h' && !event.repeat) {
    app.ui.paper.center();
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
  }
}

window.onkeyup = function(event) {
  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  } else {
    app.ui.paper.handleEvent(event);
  }

  // delete keys[event.key];
  //
  // if (event.key === Const.KEY_PAN) {
  //    if (!mouseLeft) {
  //      setMode('tool');
  //    }
  // } else {
  //   if (tool) tool.handleEvent(event);
  // }
}

window.onresize = function() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.reposition();
      window.resizeTimeoutId = 0;
      app.render();
    }, 66);
  }
}

window.onblur = function(event) {
  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  }
  app.setCaptureTarget(null);
}

window.onpaste = function(event) {
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
}

window.oncopy = function(event) {
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
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

function startup() {
  console.log('startup');

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  // bitmap cursors
  app.cursors['pointer'] = 'url(./images/cursor_pointer.png) 1 1, auto';
  app.cursors['pencil'] = 'url(./images/cursor_pencil.png) 1 1, auto';
  app.cursors['line'] = 'url(./images/cursor_line.png) 3 3, auto';
  app.cursors['hand'] = 'url(./images/cursor_hand.png) 12 12, auto';
  app.cursors['zoomin'] = 'url(./images/cursor_zoomin.png) 7 7, auto';
  app.cursors['zoomout'] = 'url(./images/cursor_zoomout.png) 7 7, auto';

  app.ui.main = new Container(document.getElementById('main'));

  app.ui.toolsPalette = new ToolsPalette(document.getElementById('tools-palette'));
  app.ui.toolsPalette.on('tool-change', (params) => {
    app.setTool(params.tool);
  });


  app.ui.paper = new Paper(document.getElementById('paper'));
  app.ui.paper.on('zoom', (params) => {
    // status.setZoom(params.scale)
  });
  app.ui.paper.on('pick', (params) => {
  });
  app.ui.paper.on('change-mode', (params) => {
    app.setMode(params.mode);
  });
  app.ui.paper.on('request-capture', (params) => {
    // setMode(params.mode);
    if (params.state)
      app.setCaptureTarget(app.ui.paper);
    else
      app.setCaptureTarget(null);
  });

  app.ui.frameList = new FrameList(document.getElementById('frame-list'));
  app.ui.frameList.setThumbnailSize(128, 80);
  app.ui.frameList.on('select', (params) => {
    app.go(params.index);
  });
  app.ui.frameList.on('new-frame', (params) => {
    app.newFrame();
  });

  app.ui.main.setVisible(true);

  app.ui.controlPalette = new ControlPalette(document.getElementById('control-palette'));

  app.sequence = new Sequence();
  app.newFrame();

  window.sequence = app.sequence;

  app.tools = {};
  app.tools.pointer = new Tools.Pointer();
  app.tools.pointer.on('marquee', (params) => {
    var p1 = app.ui.paper.screenToWorld(params.xmin, params.ymin);
    var p2 = app.ui.paper.screenToWorld(params.xmax, params.ymax);

    app.marqueeSelect(p1.x, p1.y, p2.x, p2.y);

    if (app.sequence.selection.elements.length === 1)
      app.showProperties(app.sequence.selection.elements[0]);
    else
      app.showProperties();

    app.render();
  });
  app.tools.pointer.on('pick', (params) => {
    if (app.sequence.selection.elements.length === 1)
      app.showProperties(params.stroke);
    else
      app.showProperties();
    app.render();
  });
  app.tools.pointer.on('moved', (params) => {
    app.updateFrameListThumbnail(app.sequence.frame);
    app.render();
  });
  app.tools.pointer.on('drag', (params) => {
    // app.updateFrameListIcon(app.sequence.frame);
    app.render();
  });
  app.tools.pointer.on('delete', (params) => {
    app.sequence.deleteSelected();
    // app.addAction(new Actions.Delete());
    app.updateFrameListThumbnail(app.sequence.frame);
    app.render();
  });
  app.tools.pointer.on('change', (params) => {
    // console.log('change');
    app.render();
  });

  app.tools.pencil = new Tools.Pencil();
  app.tools.pencil.on('stroke', (params) => {
    let fill = app.ui.toolsPalette.getFillColor();
    let color = app.ui.toolsPalette.getStrokeColor()
    app.createStroke(params.points, color, fill);
  });
  app.tools.pencil.on('change', (params) => {
    // console.log('change');
    app.render();
  });

  app.tools.line = new Tools.Line();
  app.tools.line.on('stroke', (params) => {
    // console.log('line-stroke');
    app.createStroke(params.points, app.ui.toolsPalette.getStrokeColor(), app.ui.toolsPalette.getFillColor());
    // app.addAction(new Actions.Line());
  });
  app.tools.line.on('change', (params) => {
    app.render();
  });

  app.tools.polygon = new Tools.Polygon();
  app.tools.polygon.on('change', (params) => {
    app.render();
  });
  app.tools.polygon.on('stroke', (params) => {
    // app.createStroke(params.points);
    app.createStroke(params.points, app.ui.toolsPalette.getStrokeColor(), app.ui.toolsPalette.getFillColor());
  });

  // tools.knife = new Tools.Knife();

  app.tools.hand = new Tools.Hand();
  app.tools.hand.on('change', (params) => {
    var dx = params.dx, dy = params.dy;
    dx = dx / app.ui.paper.scale;
    dy = dy / app.ui.paper.scale;
    app.ui.paper.panCameraBy(dx, dy);
    app.render();
  });

  app.tools.zoom = new Tools.Zoom();
  app.tools.zoom.on('cursor-change', (params) => {
    // console.log('cursor-change');
    app.setCursor(params.cursor);
  });
  app.tools.zoom.on('zoom-in', (params) => {
    app.ui.paper.zoomIn();
    // app.ui.status.setZoom(app.ui.paper.scale);
    app.render();
  });
  app.tools.zoom.on('zoom-out', (params) => {
    app.ui.paper.zoomOut();
    // app.ui.status.setZoom(app.ui.paper.scale);
    app.render();
  });

  app.reposition();
  app.render();

  app.setTool('pencil');
  app.setMode('tool');

  // app.ui.status.setZoom(1);
  app.updateFrameLabel();
  // window.app = this;
}

window.onload = () => {
  console.log('load');
  startup();
}

window.app = app;
// ipcRenderer.on('load', startup);
