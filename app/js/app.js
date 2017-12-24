const Const = require('./const');
const Geom = require('./geom/');
const Transform = require('./transform');
const Util = require('./util');
const Color = require('./color');
const Stroke = require('./stroke');
const Selection = require('./selection');
const DisplayList = require('./display_list');
const Sequence = require('./sequence');
const Tool = require('./tools/tool');
// const HistoryPanel = require('./ui/panels/history_panel');
// const PropertiesPanel = require('./ui/panels/properties_panel');
// const StrokeProperties = require('./ui/panels/properties/stroke_properties');
// const Panels = require('./ui/panels/');
// const Options = require('./ui/options');
const Container = require('./ui/container');
const Tools = require('./ui/custom/tools');
const Controls = require('./ui/custom/controls');
const Settings = require('./ui/custom/settings');
const Paper = require('./ui/custom/paper');
// const Status = require('./ui/custom/status');
const FrameList = require('./ui/custom/frame_list');
const FrameListMarker = require('./ui/custom/frame_list_marker');
const Actions = require('./actions/');
// const HistoryState = require('./history_state');
const Loader = require('./loader');

const {ipcRenderer} = require('electron');
const fs = require('fs');
const GIFEncoder = require('gifencoder');

var app = {
  width: 0, height: 0,
  unit: 1.0,
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
  position: 0,
  frame: null,
  fps: 12,
  selection: null,
  captureTarget: null,
  modal: false
}

app.getOverlayContext = () => {
  return app.paper.overlayCanvas.getContext('2d');
}

app.setDocumentName = (name) => {
  app.documentName = name;
  document.title = app.name + ' — ' + app.documentName;
}

app.render = () => {
  // console.log('app.render');
  app.paper.displayList.clear();

  if (app.onion) {
    if (app.position > 0) {
      let frame = app.sequence.frames[app.position - 1];
      for (let i = 0; i < frame.strokes.length; i++) {
        let stroke = frame.strokes[i];
        let thickness = stroke.selected ? Const.LINE_WIDTH*2 : Const.LINE_WIDTH;
        let color = Const.COLOR_ONION; //stroke.selected ? Const.COLOR_SELECTION : stroke.color;
        app.paper.displayList.add({ points: stroke.points, color: color, fill: stroke.fill, thickness: thickness });
      }
    }
  }

  for (let i = 0; i < app.frame.strokes.length; i++) {
    let stroke = app.frame.strokes[i];
    let thickness = stroke.selected ? Const.LINE_WIDTH*2 : Const.LINE_WIDTH;
    let color = stroke.selected ? Const.COLOR_SELECTION : stroke.color;
    app.paper.displayList.add({ points: stroke.points, color: color, fill: stroke.fill, thickness: thickness });
  }

  // if (!app.selection.isEmpty()) {
  //   // console.log('render', app.selection.items);
  //   for (let i = 0; i < app.selection.items.length; i++) {
  //     let stroke = app.selection.items[i];
  //     app.paper.addDisplayItem({ points: stroke.points, color: Const.COLOR_SELECTION, thickness: Const.LINE_WIDTH * 2 });
  //   }
  // }

  app.paper.render();
}

app.setCaptureTarget = (target) => {
  app.captureTarget = target;
}

app.setMode = (desired) => {
  if (desired !== app.mode) {
    app.mode = desired;
    if (app.mode === 'pan') {
      app.setCursor('hand');
    } else {
      if (app.paper.tool) app.setCursor(app.paper.tool.cursor);
    }
  }
}

app.setTool = (name) => {
  app.paper.setTool(name);
  app.ui.tools.setTool(name);

  // if (app.tool !== app.tools[name]) {
    // if (app.tool) {
    //   app.tool.blur();
    //   app.previousTool = app.tool;
    // }
    // app.tool = app.tools[name];
    // app.tool.focus();
    // app.setCursor(app.tool.cursor);
    // app.ui.tools.setTool(name);
    // app.paper.tool = app.tool;
  // }
}

app.setCursor = (name) => {
  app.paper.el.style.cursor = app.cursors[name];
  app.cursor = name;
  // console.log('cursor', name);
}

app.getColor = () => {
  return app.ui.tools.getColor();
}

app.getFill = () => {
  return app.ui.tools.getFill();
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
  var p = app.paper.screenToWorld(x, y);
  var selection = null;
  var radius = 4 / app.paper.scale;

  var strokes = app.frame.strokes;

  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i];
    if (stroke.hitTest(p.x, p.y, radius)) {
      selection = stroke;
      break;
    }
  }

  return selection;
}

app.select = (stroke) => {
  if (stroke) {
    app.selection.add(stroke);
    // this.fuse(stroke, true);
  }
}

app.deselect = (stroke) => {
  if (stroke) {
    // this.fuse(stroke);
    app.selection.remove(stroke);
  } else {
     if (!app.selection.isEmpty()) {
      var strokes = app.selection.items.slice(0);
      app.selection.clear();
      // console.log('strokes', strokes);
      for (var i = 0; i < strokes.length; i++) {
        // this.fuse(strokes[i]);
      }
    }
  }
}

app.marqueeSelect = (p1, p2) => {
  // let p1 = new Point(xmin, ymin);
  // let p2 = new Point(xmax, ymax);

  // p1 = this.screenToWorld(p1.x, p1.y);
  // p2 = this.screenToWorld(p2.x, p2.y);

  let xmin = p1.x;
  let ymin = p1.y;
  let xmax = p2.x;
  let ymax = p2.y;

  let candidates = [];
  let frame = app.frame;

  let edges = [
    [ xmin, ymin, xmin, ymax ],
    [ xmin, ymin, xmax, ymin ],
    [ xmax, ymin, xmax, ymax ],
    [ xmin, ymax, xmax, ymax ]];

  for (let i = 0; i < frame.strokes.length; i++) {
    let stroke = frame.strokes[i];
    let intersect = false;

    for (let j = 1; j < stroke.points.length; j++) {
      let p1 = stroke.points[j - 1];
      let p2 = stroke.points[j];

      if (j == 1) {
        if (Util.pointInRect(p1.x, p1.y, xmin, ymin, xmax, ymax)) {
          intersect = true;
          break;
        }
      }

      for (let k = 0; k < edges.length; k++) {
        let edge = edges[k];
        let result = Util.intersect(p1.x, p1.y, p2.x, p2.y, edge[0], edge[1], edge[2], edge[3]);
        if (result && result.seg1 && result.seg2) {
          intersect = true;
          break;
        }
      }

      if (intersect) break;
    }
    if (intersect) candidates.push(stroke);
  }

  app.selection.clear();
  app.selection.add(candidates);
  // return selection;
}

app.deleteSelected = () => {
  let set = app.selection.items;
  let result = app.frame.strokes.filter(element => !set.includes(element));
  app.selection.clear();
  app.frame.strokes = result;
  app.updateFrameListThumbnail(app.frame);
  app.render();
}

app.moveSelected = (dx, dy) => {
  for (var i = 0; i < app.selection.items.length; i++) {
    var item = app.selection.items[i];
    var points = item.points;
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      p.x = p.x + dx / app.paper.scale;
      p.y = p.y + dy / app.paper.scale;
    }
  }
}

app.updateFrameLabel = () => {
  // app.ui.frameListBar.setFrame(sequence.position + 1, sequence.size());
  // app.ui.frameList.render({ cmd: 'update', index: app.position + 1, total: app.sequence.size() });
}

app.updateFrameListMarker = () => {
  let width = app.ui.frameList.el.offsetWidth;
  let total = app.ui.frameList.container.el.scrollWidth;
  let size = total > width ? ((width / total) * width) >> 0 : width;
  let offset = Math.ceil((app.ui.frameList.el.scrollLeft / app.ui.frameList.el.scrollWidth) * width);
  app.ui.frameListMarker.render({ cmd: 'update', size: size, offset: offset });
}

app.updateFrameListThumbnail = (frame) => {
  var index = app.sequence.frames.indexOf(frame);
  // var frame = sequence.frames[index];
  var scale = app.ui.frameList.thumbnailWidth / Const.WIDTH;
  var width = app.ui.frameList.thumbnailWidth;
  var height = app.ui.frameList.thumbnailHeight;
  var frameListItem = app.ui.frameList.get(index);

  if (frameListItem) {
    let canvas = frameListItem.canvas;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    // ctx.setTransform(scale, 0, 0, scale, 0, 0);

    let displayList = new DisplayList();

    let transform = new Transform(0, 0, scale);

    for (var i = 0; i < frame.strokes.length; i++) {
      let stroke = frame.strokes[i];
      displayList.add({points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: Const.LINE_WIDTH * scale});
    }
    // console.log(displayList);
    app.paper.renderDisplayListToCanvas(canvas, displayList, transform);

    // var ctx = frameListItem.canvas.getContext('2d')
    // ctx.fillStyle = 'white';
    // ctx.clearRect(0, 0, width, height);
    // ctx.fillRect(0, 0, width, height);
    // ctx.setTransform(scale, 0, 0, scale, 0, 0);
    //
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = Const.COLOR_STROKE.toHexString();
    //
    // for (var i = 0; i < frame.strokes.length; i++) {
    //   var stroke = frame.strokes[i];
    //   ctx.beginPath();
    //   ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    //   for (var j = 0; j < stroke.points.length; j++) {
    //     var point = stroke.points[j];
    //     ctx.lineTo(point.x, point.y);
    //   }
    //   ctx.stroke();
    // }
    //
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

app.go = (index) => {
  // console.log('go', index, app.sequence.size());
  // app.sequence.go(index);
  let frame = app.sequence.getFrame(index);
  if (frame) {
    app.position = index;
    app.frame = frame;
    app.ui.frameList.render({ cmd: 'select', index: app.position });
    app.ui.controls.setFrame(app.position + 1, app.sequence.size());
    app.selection.clear();
    app.render();
    app.updateFrameListMarker();
  }
}

app.first = () => {
  app.go(0);
}

app.last = () => {
  app.go(app.sequence.size() - 1);
}

app.next = () => {
  app.go(app.position + 1);
}

app.previous = () => {
  app.go(app.position - 1);
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
  app.ui.frameList.render({ cmd: 'frameAdd' });
  app.go(app.sequence.size() - 1);
  app.updateFrameListMarker();
  app.updateFrameListThumbnail(app.frame);
  app.updateFrameLabel();
}

app.removeFrame = () => {
  if (app.sequence.size() > 1) {
    app.sequence.remove(app.position);
    app.ui.frameList.render({ cmd: 'frameRemove', index: app.position });
    if (app.position >= app.sequence.size()) {
      app.go(app.sequence.size() - 1);
    } else {
      app.go(app.position);
    }
  }
}

app.export = () => {
  ipcRenderer.send('export');
}

app.addAction = (action) => {
  // sequence.addAction(new Actions.Pencil());
  // app.sequence.frame.history.add(new HistoryState(action, app.sequence.frame.copy()));
  // app.ui.history.render({ cmd: 'add', id: sequence.frame.history.marker, title: action.name });
  // app.ui.history.render({ cmd: 'select', index: sequence.frame.history.marker });
}

app.createPath = (ctx, points, dx, dy) => {
  console.log('createPath');
}

app.strokeFromPoints = (sourcePoints, convertToWorld) => {
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
  return new Stroke({ points: points });
}

app.createStroke = (points, color, fill) => {
  var stroke = app.strokeFromPoints(points, true);
  stroke.setColor(color);
  stroke.setFill(fill);
  app.frame.addStroke(stroke);
  app.updateFrameListThumbnail(app.frame);
  app.render();
  // console.log('createStroke', app.frame.strokes.length, stroke.points);
}

app.setStrokeFill = (fill) => {
  for (var i = 0; i < app.selection.items.length; i++) {
    var element = app.selection.items[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
}

app.reposition = () => {
  app.width = window.innerWidth;
  app.height = window.innerHeight - app.ui.frameList.el.offsetHeight -  app.ui.frameListMarker.el.offsetHeight;

  app.paper.resize(app.width, app.height);

  app.ui.settings.el.style.left = (((app.width / 2) - (app.ui.settings.el.offsetWidth/2)) >> 0) + 'px';
  app.ui.tools.el.style.top = (((app.height / 2) - (app.ui.tools.el.offsetHeight/2)) >> 0) + 'px';
  app.ui.controls.el.style.left = (((app.width / 2) - (app.ui.controls.el.offsetWidth/2)) >> 0) + 'px';

  app.ui.controls.el.style.bottom = (app.ui.frameList.el.offsetHeight + app.ui.frameListMarker.el.offsetHeight - 4) + 'px';
  // app.ui.controls.el.style.top = (app.paper.el.offsetTop + app.paper.el.offsetHeight - 200) + 'px';

  app.updateFrameListMarker();
  app.render();
}

app.setModal = function(value) {
  if (app.modal !== value) {
    app.modal = value ? true : false;
    app.ui.modal.style.visibility = app.modal ? 'visible' : 'hidden';

    if (app.modal) {
      app.ui.modal.style.cursor = app.cursors[app.cursor];
    }
  }
}

app.capture = (captor, modal=false) => {
  if (captor) {
    app.captureTarget = captor;
    app.setModal(modal);
  }
  // document.body.style.filter = 'blur(1px)';
  // document.body.style.filter = 'hue-rotate(90deg)';
  // document.body.style.filter = 'brightness(90%)';
  // console.log('capture', modal);
}

app.release = (captor) => {
  if (captor) {
    if (captor === app.captureTarget) {
      app.captureTarget = null;
      if (app.modal) app.setModal(false);
      // document.body.style.filter = '';
    } else {
      console.log('app.release', 'mismatch');
    }
  } else {
    console.log('app.release', 'null');
  }
}

function defaultEventHandler(event) {
  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  } else {
    if (app.paper && event.target === app.paper.el) {
      app.paper.handleEvent(event);
    }
  }
}

function mouseEventHandler(event) {
  // app.cursorX = event.clientX;
  // app.cursorY = event.clientY;

  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  } else {
    if (app.paper && event.target === app.paper.el) {
      app.paper.handleEvent(event);
    } else {
      // if (app.handler[event.target.id]) {
      //   app.handler[event.target.id]
      // }
    }
  }
}

function onClick(event) {
  mouseEventHandler(event);
}

function onMouseDown(event) {
  app.mouseLeft = event.buttons & 1;
  if (app.mode === 'pan') {
  } else {
    mouseEventHandler(event);
  }
}

function onMouseUp(event) {
  app.mouseLeft = event.buttons & 1;
  if (app.mode === 'pan') {
    // if (!app.keys[' '] && event.button === 0) {
    //   // app.mode = null;
    //   app.setMode('pan');
    // }
    if (!app.mouseLeft && !app.keys[' ']) {
      app.setMode(null);
    }
  } else {
    mouseEventHandler(event);
  }
}

function fadeComponent(component) {
  if (component.fadeTimerId != null && component.fadeTimerId != undefined) {
    clearTimeout(component.fadeTimerId);
  }
  component.fadeTimerId = setTimeout(() => {
    if (component.isMouseOver() && app.captureTarget instanceof Tool) {
      fadeComponent(component);
    } else {
      component.el.style.opacity = 1;
      component.el.style.pointerEvents = 'auto';
      component.fadeTimerId = null;
    }
  }, 100);
  component.el.style.pointerEvents = 'none';
  component.el.style.opacity = 0.1;
}

function onMouseMove(event) {
  app.cursorX = event.clientX;
  app.cursorY = event.clientY;

  if (app.mode === 'pan' && event.buttons & 1) {
    app.paper.panCameraBy(-event.movementX / app.paper.scale, -event.movementY / app.paper.scale);
  } else {
    if (app.captureTarget instanceof Tool) {
      if (app.ui.settings.isMouseOver()) {
        fadeComponent(app.ui.settings);
      } else if (app.ui.controls.isMouseOver()) {
        fadeComponent(app.ui.controls);
      } else if (app.ui.tools.isMouseOver()) {
        fadeComponent(app.ui.tools);
      }
    }

    mouseEventHandler(event);
  }
}

function onMouseOut(event) {
  mouseEventHandler(event);
}

function onMouseOver(event) {
  mouseEventHandler(event);
}

function onWheel(event) {
  defaultEventHandler(event);
}

function onKeyDown(event) {
  app.keys[event.key] = true;

  if (this.mode === 'pan') {

  } else {
    // app.rerouteEvent(event);
    if (app.captureTarget) {
      app.captureTarget.handleEvent(event);
    } else {
      if (event.key == 'b' && !event.repeat) {
        app.setTool('pencil');
      }
      else if (event.key == 'p' && !event.repeat) {
        app.setTool('polygon');
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
        // app.paper.center();
        // app.render();
        app.setTool('hand');
      }
      else if (event.key === '.' && !event.repeat) {
        app.go(app.position + 1);
        // app.sequence.next();
        // app.ui.frameList.render({ cmd: 'select', index: app.position });
        // app.render();
      }
      else if (event.key === ',' && !event.repeat) {
        app.go(app.position - 1);
        // app.sequence.previous();
        // app.ui.frameList.render({ cmd: 'select', index: app.position });
        // app.render();
      }
      else if (event.key === 'n' && !event.repeat) {
        app.newFrame();

      } else if (event.key === ' ' && !event.repeat) {
        app.setMode('pan');

      } else if (event.key === 'Backspace' && !event.repeat) {
        if (event.ctrlKey) {
          // app.setMode('pan');
          app.removeFrame();
        }
      } else if (event.key === 'Delete' && !event.repeat) {
        app.deleteSelected();

      } else if (event.key === 't' && !event.repeat) {
        console.log('theme');
        if (app.ui.main.el.classList.contains('light')){
          app.ui.main.el.classList.remove('light');
          app.ui.main.el.classList.add('dark');
        } else {
          app.ui.main.el.classList.remove('dark');
          app.ui.main.el.classList.add('light');
        }
        // app.deleteSelected();

      } else {
        app.paper.handleEvent(event);
      }
    }
  }
}

function onKeyUp(event) {
  app.keys[event.key] = false;
  // app.rerouteEvent(event);
  if (app.mode === 'pan') {
    if (event.key === ' ') {
      if (!app.mouseLeft) {
        // console.log('pan-off');
        app.setMode(null);
        // app.mode = null;
      }
    }
  } else {
    if (app.captureTarget) {
      app.captureTarget.handleEvent(event);
    } else {
      app.paper.handleEvent(event);
    }
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

function onResize() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.reposition();
      window.resizeTimeoutId = 0;
    }, 66);
  }
}

function onFocus(event) {
  if (app.captureTarget) app.release();
  app.paper.handleEvent(event);
}

function onBlur(event) {
  if (app.captureTarget) app.release();
  app.paper.handleEvent(event);
  // app.rerouteEvent(event);

  // if (app.captureTarget) {
  //   app.captureTarget.handleEvent(event);
  // }
  // app.setCaptureTarget(null);
}

function onPaste(event) {
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
}

function onCopy(event) {
  // var target = tags[mouseTargetTag];
  // if (target) {
  //   target.handleEvent(event);
  // }
}

function initEventListeners() {
  window.addEventListener('click', onClick);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mouseover', onMouseOver);
  window.addEventListener('mouseout', onMouseOut);
  window.addEventListener('wheel', onWheel);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onResize);
  window.addEventListener('copy', onCopy);
  window.addEventListener('paste', onPaste);
}

window.onload = () => {
  console.log('startup');

  window.app = app;

  app.name = 'Scribbler';
  app.setDocumentName('untitled.scribble');

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.sequence = new Sequence();
  app.selection = new Selection();

  // bitmap cursors
  app.cursors['pointer'] = 'url(./images/cursor_pointer.png) 1 1, auto';
  app.cursors['pencil'] = 'url(./images/cursor_pencil.png) 1 1, auto';
  app.cursors['line'] = 'url(./images/cursor_line.png) 3 3, auto';
  app.cursors['hand'] = 'url(./images/cursor_hand.png) 12 12, auto';
  app.cursors['zoomin'] = 'url(./images/cursor_zoomin.png) 7 7, auto';
  app.cursors['zoomout'] = 'url(./images/cursor_zoomout.png) 7 7, auto';

  app.ui.main = new Container();
  app.ui.main.el = document.getElementById('main');

  app.ui.tools = new Tools();
  app.ui.tools.on('tool-change', (params) => {
    app.setTool(params.tool);
  });

  app.paper = new Paper();
  app.paper.on('zoom', (params) => {
    // status.setZoom(params.scale)
  });
  app.paper.on('pick', (params) => {
  });
  app.paper.on('change-mode', (params) => {
    app.setMode(params.mode);
  });
  // app.paper.on('request-capture', (params) => {
    // // setMode(params.mode);
    // if (params.state)
    //   app.setCaptureTarget(app.paper);
    // else
    //   app.setCaptureTarget(null);
  // });

  app.ui.frameList = new FrameList();
  app.ui.frameList.setThumbnailSize(128, 80);
  app.ui.frameList.on('select', (params) => {
    app.go(params.index);
  });
  app.ui.frameList.on('new-frame', (params) => {
    app.newFrame();
  });
  app.ui.frameList.on('scroll', () => {
    app.updateFrameListMarker();
  });

  app.ui.frameListMarker = new FrameListMarker({ id: 'frame-list-marker', fromDOMElement: true });

  app.ui.controls = new Controls();
  app.ui.controls.on('onion', (state) => {
    app.onion = state;
    app.render();
  });
  app.ui.controls.on('frame-change', (value) => {
    if (value > 0 && value <= app.sequence.size()) {
      app.go(value - 1);
      // app.ui.controls.setFrame(value);
    } else {
      app.ui.controls.setFrame(app.position + 1, app.sequence.size());
    }
  });

  app.ui.controls.setFps(app.fps);

  app.ui.settings = new Settings();
  // console.log(app.ui.settings);

  app.ui.modal = document.getElementById('modal');

  app.ui.main.setVisible(true);

  app.setTool('pencil');
  app.newFrame();

  initEventListeners();
  app.reposition();
}

function saveAnimatedGIF(filename) {
  let canvas = document.createElement('canvas');
  canvas.width = app.paper.width;
  canvas.height = app.paper.height;

  let ctx = canvas.getContext('2d');
  let transform = new Transform(0, 0);

  const encoder = new GIFEncoder(app.paper.width, app.paper.height);
  encoder.createReadStream().pipe(fs.createWriteStream(filename));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000/12);

  let displayList = new DisplayList();

  for (let i = 0; i < app.sequence.frames.length; i++) {
    let frame = app.sequence.frames[i];
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    displayList.clear();

    for (let i = 0; i < frame.strokes.length; i++) {
      let stroke = frame.strokes[i];
      displayList.add({ points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: Const.LINE_WIDTH });
    }

    app.paper.renderDisplayListToCanvas(canvas, displayList, transform);
    encoder.addFrame(ctx);
  }

  encoder.finish();

  // canvas.toBlob((blob) => {
  //   var r = new FileReader();
  //      r.onloadend = function () {
  //        fs.writeFileSync(filename, new Uint8Array(r.result));
  //    };
  //    r.readAsArrayBuffer(blob);
  //
  // }, 'image/png');
}

ipcRenderer.on('export', (event, filename) => {
  let extension = filename.substring(filename.lastIndexOf('.') + 1);

  if (extension === 'gif') {
    saveAnimatedGIF(filename);

  } else {
    // let data = '1234567890';
    // var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    // svg.setAttribute('width', app.paper.width);
    // svg.setAttribute('height', app.paper.height);
    // svg.appendChild(document.createTextNode('\n'));
    //
    // let node = document.createElement('polygon');
    // node.setAttribute('points', '50 160, 55 180, 70 180, 60 190, 65 205, 50 195, 35 205, 40 190, 30 180, 45 180');
    // node.setAttribute('fill', 'black');
    // svg.appendChild(node);
    // svg.appendChild(document.createTextNode('\n'));
    //
    // fs.writeFileSync(filename, svg.outerHTML);
  }

})
