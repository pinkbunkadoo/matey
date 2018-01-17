const Geom = require('./geom/');
const Transform = require('./transform');
const Util = require('./util');
const Color = require('./color');
const Stroke = require('./stroke');
const DisplayList = require('./display_list');
const Selection = require('./selection');
const Sequence = require('./sequence');
const Tool = require('./tools/tool');
const History = require('./history');

const SequenceAction = require('./actions/sequence_action');
const SequenceActionType = require('./actions/sequence_action_type');
const PaperAction = require('./actions/paper_action');
const PaperActionType = require('./actions/paper_action_type');

const Base = require('./ui/base');
const Container = require('./ui/container');
const Paper = require('./ui/custom/paper');
const Tools = require('./ui/custom/tools');
const Colors = require('./ui/custom/colors');
const Controls = require('./ui/custom/controls');
const Settings = require('./ui/custom/settings');
const FrameList = require('./ui/custom/frame_list');
const FrameListMap = require('./ui/custom/frame_list_map');
const SettingsTray = require('./ui/trays/settings_tray');
const ColorWheel = require('./ui/custom/color_wheel');

const { ipcRenderer } = require('electron');
const fs = require('fs');
const GIFEncoder = require('gifencoder');

let app = {
  WIDTH: 640,
  HEIGHT: 400,

  colors: {
    stroke: new Color(85, 85, 85),
    selection: Color.fromHexString('#2db9f0'),
    onion: new Color(160, 240, 160),
    paper: new Color(255, 255, 255),
    workspace: new Color(128, 128, 128)
    // WORKSPACE_DARK: new Color(52, 52, 52),
  },

  cursors: {
    pointer: 'url(./images/cursor_pointer.png) 1 1, auto',
    pencil: 'url(./images/cursor_pencil.png) 1 1, auto',
    pencil_inverted: 'url(./images/cursor_pencil_inverted.png) 1 1, auto',
    line: 'url(./images/cursor_line.png) 3 3, auto',
    line_inverted: 'url(./images/cursor_line_inverted.png) 3 3, auto',
    hand: 'url(./images/cursor_hand.png) 12 12, auto',
    zoomin: 'url(./images/cursor_zoomin.png) 7 7, auto',
    zoomout: 'url(./images/cursor_zoomout.png) 7 7, auto'
  },

  shortcuts: {
    pan: ' ',
    pencil: 'p',
    line: 'l',
    pointer: 'q',
    newFrame: 'n'
  },

  lineWidth: 1.2,
  zoomLevels: [ 0.25, 0.5, 0.75, 1.0, 1.5, 2, 3, 5 ],

  unit: 1,
  width: 0,
  height: 0,
  history: null,
  settings: [],
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
  modal: false,
  theme: 'light',
  thumbnails: []
};

app.getOverlayContext = () => {
  return app.paper.overlayCanvas.getContext('2d');
}

app.setDocumentName = (name) => {
  app.documentName = name;
  document.title = app.name + ' — ' + app.documentName;
}

app.render = () => {
  app.paper.displayList.clear();

  if (app.onion) {
    if (app.position > 0) {
      let frame = app.sequence.frames[app.position - 1];
      for (let i = 0; i < frame.strokes.length; i++) {
        let stroke = frame.strokes[i];
        let thickness = stroke.selected ? app.lineWidth*2 : app.lineWidth;
        let color = app.colors.onion; //stroke.selected ? app.COLOR_SELECTION : stroke.color;
        app.paper.displayList.add({ points: stroke.points, color: color, fill: null, thickness: thickness });
      }
    }
  }

  for (let i = 0; i < app.frame.strokes.length; i++) {
    let stroke = app.frame.strokes[i];
    let thickness = stroke.selected ? app.lineWidth*2 : app.lineWidth;
    let color = stroke.selected ? app.colors.selection : stroke.color;
    app.paper.displayList.add({ points: stroke.points, color: color, fill: stroke.fill, thickness: thickness });
  }

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
}

app.setCursor = (name) => {
  app.paper.setCursor(name);
}

app.setStrokeColor = (color) => {
  app.strokeColor = color ? color.copy() : null;
  app.ui.colors.setStrokeColor(app.strokeColor);
}

app.setFillColor = (color) => {
  app.fillColor = color ? color.copy() : null;
  app.ui.colors.setFillColor(app.fillColor);
}

app.getStrokeColor = () => {
  // return app.ui.tools.getColor();
  return app.strokeColor;
}

app.getFillColor = () => {
  return app.fillColor;
  // return app.ui.tools.getFill();
}

app.hitTest = (x, y) => {
  // console.log('hitTest', x, y);
  let p = app.paper.screenToWorld(x, y);
  let selection = null;
  let margin = 4 / app.paper.scale;
  for (let i = app.frame.strokes.length - 1; i >= 0; i--) {
    let stroke = app.frame.strokes[i];
    if (stroke.getBounds().grow(margin).containsPoint(p.x, p.y)) {
      if (stroke.hitTest(p.x, p.y, margin)) {
        selection = stroke;
      } else if (stroke.fill) {
        if (Util.pointInPolygon(stroke.points, p.x, p.y)) {
          selection = stroke;
        }
      }
    }
    if (selection) break;
  }
  return selection;
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

app.select = (stroke) => {
  app.selection.add(stroke);
}

app.deselect = (stroke) => {
  if (stroke) {
    app.selection.remove(stroke);
  } else {
     if (!app.selection.isEmpty()) {
      var strokes = app.selection.items.slice(0);
      app.selection.clear();
      for (var i = 0; i < strokes.length; i++) {
      }
    }
  }
}

app.marqueeSelect = (p1, p2) => {
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
  app.render();
}

app.deleteSelected = () => {
  let undoState = app.frame.getState();
  app.frame.strokes = app.frame.strokes.filter(element => !app.selection.items.includes(element));
  app.selection.clear();
  app.addPaperAction(PaperActionType.DELETE_STROKE, undoState);
  app.updateFrameListThumbnail(app.position);
  app.render();
}

app.setFrameDirty = () => {
  let position = app.position;
  if (!app.thumbnails[position]) {
    app.thumbnails[position] = setTimeout(() => {
      app.thumbnails[position] = null;
      app.updateFrameListThumbnail(position);
    }, 100);
  }

}

app.bringForward = () => {
  let undoState = app.frame.getState();
  app.frame.strokes.forEach((element, index) => {
    if (app.selection.includes(element)) {
      element.z = index + 1;
    } else {
      element.z = index - 1;
    }
  });
  app.frame.strokes.sort((a, b) => { return a.z - b.z; })
  app.addPaperAction(PaperActionType.STROKE_ORDER, undoState);
  app.render();
}

app.sendBack = () => {
  let undoState = app.frame.getState();
  app.frame.strokes.forEach((element, index) => {
    if (app.selection.includes(element)) {
      element.z = index - 1;
    } else {
      element.z = index + 1;
    }
  });
  app.frame.strokes.sort((a, b) => { return a.z - b.z; })
  app.addPaperAction(PaperActionType.STROKE_ORDER, undoState);
  app.render();
}

app.moveSelected = (dx, dy) => {
  let undoState = app.frame.getState();

  for (var i = 0; i < app.selection.items.length; i++) {
    var item = app.selection.items[i];
    var points = item.points;
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      p.x = p.x + dx / app.paper.scale;
      p.y = p.y + dy / app.paper.scale;
    }
    item.calculateBounds();
  }
  app.addPaperAction(PaperActionType.MOVE, undoState);
}

app.updateFrameLabel = () => {
  app.ui.controls.setFrame(app.position + 1, app.sequence.size());
  app.reposition();
}

app.updateFrameListMap = () => {
  let width = app.ui.frameList.el.offsetWidth;
  let total = app.ui.frameList.container.el.scrollWidth;
  let size = total > width ? ((width / total) * width) >> 0 : width;
  let offset = Math.ceil((app.ui.frameList.el.scrollLeft / app.ui.frameList.el.scrollWidth) * width);
  app.ui.frameListMap.render({ cmd: 'update', size: size, offset: offset });
}

app.updateFrameListThumbnail = (index) => {
  let width = 128 * app.unit;
  let height = 80 * app.unit;
  let frame = app.sequence.getFrame(index);
  let scale = (width) / app.WIDTH;
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let displayList = new DisplayList();
  let transform = new Transform(0, 0, scale);

  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < frame.strokes.length; i++) {
    let stroke = frame.strokes[i];
    displayList.add({points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: app.lineWidth * 2});
  }
  app.paper.renderDisplayListToCanvas(canvas, displayList, transform);

  app.ui.frameList.render({ cmd: 'updateThumbnail', canvas: canvas, index: index });
}

app.go = (index) => {
  let frame = app.sequence.getFrame(index);
  if (frame) {
    app.position = index;
    app.frame = frame;
    app.history = app.frame.history;
    app.selection.clear();

    app.ui.frameList.render({ cmd: 'select', index: app.position });

    app.updateFrameListMap();
    app.updateFrameLabel();
    app.updateHistoryPanel();

    app.render();
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

// app.showTray = (tray, x, y) => {
//   if (tray && tray !== app.tray) {
//     // console.log(tray.el);
//     setTimeout(() => {
//       if (!app.tray) {
//         document.body.appendChild(tray.el);
//         tray.show();
//
//         // let rect = component.el.getBoundingClientRect();
//         // let x = rect.left - tray.el.offsetWidth / 2 + rect.width / 2;
//         // let y = rect.top + rect.height + (4 * app.unit);
//         x = window.innerWidth / 2 - tray.el.offsetWidth / 2;
//         y = window.innerHeight / 2 - tray.el.offsetHeight / 2;
//
//         tray.el.style.left = x + 'px';
//         tray.el.style.top = y + 'px';
//
//         app.tray = tray;
//       }
//     });
//   }
// }
//
// app.hideTray = () => {
//   if (app.tray) {
//     app.tray.hide();
//     app.tray = null;
//   }
// }

app.hideOverlay = () => {
  for (var i = 0; i < app.ui.overlay.children.length; i++) {
    app.ui.overlay.remove(app.ui.overlay.children[i]);
  }
  app.ui.overlay.hide();
}

app.showColorWheel = (callback) => {
  app.ui.overlay.show();
  let colorWheel = new ColorWheel({ callback: callback });
  app.ui.overlay.add(colorWheel);
}

app.hideColorWheel = () => {
  if (app.ui.colorWheel) app.ui.colorWheel.hide();
}

app.newFrame = () => {
  app.sequence.add();
  app.ui.frameList.render({ cmd: 'frameAdd' });
  app.go(app.sequence.size() - 1);

  // app.addPaperAction(PaperActionType.INITIAL);

  app.updateFrameListMap();
  app.updateFrameListThumbnail(app.position);
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

app.toggleTheme = () => {
  app.theme = app.theme === 'light' ? 'dark' : 'light';
  document.getElementById('css').href = './css/' + app.theme + '.css';
  app.render();
}

app.export = () => {
  ipcRenderer.send('export');
}

app.setState = (state) => {
  if (state) {
    app.frame.setStrokes(state.strokes);
    app.selection.clear();
    let list = app.frame.strokes.filter(element => element.selected);
    app.selection.add(list);
    app.setFrameDirty();
    app.render();
  }
}

app.updateHistoryPanel = () => {
  // app.ui.history.innerHTML = '';
  // for (var i = 0; i < app.history.items.length; i++) {
  //   let action = app.history.items[i];
  //   let div = document.createElement('div');
  //   div.innerHTML = action.type + ' ' + (action.undoState ? 'undo' : 'null');
  //   if (app.history.marker === i + 1) {
  //     div.innerHTML += '<br>x<br>';
  //   } else {
  //   }
  //   app.ui.history.appendChild(div);
  // }
}

app.undo = () => {
  console.log('undo');
  if (!app.history.isEmpty() && !app.history.atBeginning()) {
    let action = app.history.getAction();
    // if (action.frameIndex !== app.position) app.go(action.frameIndex);
    if (action.undoState) app.setState(action.undoState);
    app.history.back();
  }
  app.updateHistoryPanel();
}

app.redo = () => {
  console.log('redo');
  if (!app.history.isEmpty() && !app.history.atEnd()) {
    app.history.forward();
    let action = app.history.getAction();
    // if (action.frameIndex !== app.position) app.go(action.frameIndex);
    if (action.state) app.setState(action.state);
  }
  app.updateHistoryPanel();
}

app.addPaperAction = (type, undoState) => {
  let action = new PaperAction({
    type: type,
    state: app.frame.getState(),
    undoState: undoState,
    frameIndex: app.position
  })
  app.history.add(action);
  app.updateHistoryPanel();
  // console.log(app.history.marker, app.history.items);
}

app.createStroke = (points, color, fill) => {
  let undoState = app.frame.getState();
  let stroke = app.strokeFromPoints(points, true);
  stroke.setColor(color);
  stroke.setFill(fill);
  app.frame.addStroke(stroke);
  app.addPaperAction(PaperActionType.NEW_STROKE, undoState);
  app.updateFrameListThumbnail(app.position);
  app.render();
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
  app.height = window.innerHeight - app.ui.frameList.el.offsetHeight - app.ui.frameListMap.el.offsetHeight;

  app.paper.resize(app.width, app.height);

  app.ui.settings.el.style.left = (((app.width / 2) - (app.ui.settings.el.offsetWidth/2)) >> 0) + 'px';
  app.ui.tools.el.style.top = (((app.height / 2) - (app.ui.tools.el.offsetHeight/2)) >> 0) + 'px';
  app.ui.colors.el.style.top = (((app.height / 2) - (app.ui.colors.el.offsetHeight/2)) >> 0) + 'px';
  app.ui.controls.el.style.left = (((app.width / 2) - (app.ui.controls.el.offsetWidth/2)) >> 0) + 'px';
  app.ui.controls.el.style.bottom = (app.ui.frameList.el.offsetHeight + app.ui.frameListMap.el.offsetHeight - 8) + 'px';

  app.updateFrameListMap();
  app.render();
}

app.setModal = function(value) {
  console.log('setModal');
}

app.capture = (captor, modal=false) => {
  if (captor) {
    app.captureTarget = captor;
    if (captor instanceof Base) {
      captor.el.style.pointerEvents = 'auto';
      document.body.style.pointerEvents = 'none';
    }
  }
}

app.release = (captor) => {
  if (captor) {
    if (captor === app.captureTarget) {
      app.captureTarget = null;
      if (captor instanceof Base) {
        captor.el.style.pointerEvents = 'auto';
      }
      document.body.style.pointerEvents = 'auto';
    } else {
      console.log('app.release', 'mismatch');
    }
  } else {
    console.log('app.release', 'null');
  }
}

function fadeComponent(component) {
  if (component.fadeTimerId != null && component.fadeTimerId != undefined) {
    clearTimeout(component.fadeTimerId);
  }
  component.fadeTimerId = setTimeout(() => {
    if (component.getBounds().containsPoint(app.cursorX, app.cursorY, 8) && app.captureTarget instanceof Tool) {
      fadeComponent(component);
    } else {
      component.el.style.opacity = 1;
      component.el.style.pointerEvents = 'auto';
      component.fadeTimerId = null;
    }
  }, 100);
  component.el.style.pointerEvents = 'none';
  component.el.style.opacity = 0;
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
  if (app.captureTarget) {
    app.captureTarget.handleEvent(event);
  } else {
    if (app.paper && event.target === app.paper.el) {
      app.paper.handleEvent(event);
    }
  }
}

function onClick(event) {
}

function onMouseDown(event) {
  app.mouseLeft = event.buttons & 1;
  if (app.mode === 'pan') {
  } else {
    // if (app.tray) {
    //   if (!app.tray.getBounds().containsPoint(app.cursorX, app.cursorY)) {
    //     app.hideTray();
    //   }
    // }
    if (app.paper && event.target === app.paper.el) {
      app.paper.handleEvent(event);
    }
    // mouseEventHandler(event);
  }
}

function onMouseUp(event) {
  app.mouseLeft = event.buttons & 1;
  if (app.mode === 'pan') {
    if (!app.mouseLeft && !app.keys[' ']) {
      panOff();
    }
  } else {
    mouseEventHandler(event);
  }
}

function onMouseMove(event) {
  app.cursorX = event.clientX;
  app.cursorY = event.clientY;

  if (app.mode === 'pan' && event.buttons & 1) {
    app.paper.panCameraBy(-event.movementX / app.paper.scale, -event.movementY / app.paper.scale);
  } else {
    if (app.captureTarget instanceof Tool) {
      if (app.ui.settings.getBounds().containsPoint(app.cursorX, app.cursorY, 8)) {
        fadeComponent(app.ui.settings);
      } else if (app.ui.controls.getBounds().containsPoint(app.cursorX, app.cursorY, 8)) {
        fadeComponent(app.ui.controls);
      } else if (app.ui.tools.getBounds().containsPoint(app.cursorX, app.cursorY, 8)) {
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

  // !event.repeat ? console.log(event.key) : 0;

  if (this.mode === 'pan') {

  } else {
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
      else if (event.key == 'Z' && !event.repeat) {
        if (event.ctrlKey) app.redo();
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
        app.setTool('hand');
      }
      else if (event.key === '.' && !event.repeat) {
        app.go(app.position + 1);
      }
      else if (event.key === ',' && !event.repeat) {
        app.go(app.position - 1);
      }
      else if (event.key === 'n' && !event.repeat) {
        app.newFrame();
      }
      else if (event.key === ' ' && !event.repeat) {
        panOn();
      }
      else if (event.key === 'Backspace' && !event.repeat) {
        if (event.ctrlKey) {
          app.removeFrame();
        }
      }
      else if (event.key === 't' && !event.repeat) {
        app.toggleTheme();
      }
      else {
        app.paper.handleEvent(event);
      }
    }
  }
}

function panOn() {
  app.setMode('pan');
}

function panOff() {
  app.setMode(null);
}

function onKeyUp(event) {
  app.keys[event.key] = false;
  if (app.mode === 'pan') {
    if (event.key === ' ') {
      if (!app.mouseLeft) {
        panOff();
      }
    }
  } else {
    if (app.captureTarget) {
      app.captureTarget.handleEvent(event);
    } else {
      app.paper.handleEvent(event);
    }
  }
}

function onResize() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      app.reposition();
      window.resizeTimeoutId = 0;
    }, 66);
  }
  if (app.tray) app.hideTray();
}

function onFocus(event) {
  if (app.captureTarget) app.release(app.captureTarget);
  app.paper.handleEvent(event);
  app.render();
}

function onBlur(event) {
  if (app.captureTarget) app.release(app.captureTarget);
  app.paper.handleEvent(event);
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
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseover', onMouseOver);
  window.addEventListener('mouseout', onMouseOut);
  window.addEventListener('wheel', onWheel);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('copy', onCopy);
  window.addEventListener('paste', onPaste);
  window.addEventListener('resize', onResize);
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
}

window.onload = () => {
  console.log('startup');

  window.app = app;

  app.name = 'Scribbler';
  app.setDocumentName('untitled.scribble');

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.history = new History();
  app.sequence = new Sequence();
  app.selection = new Selection();

  document.body.style.fontSize = (10 * app.unit) + 'px';

  app.ui.main = new Container({ el: document.getElementById('main') });
  app.ui.content = new Container({ el: document.getElementById('content') });
  app.ui.modal = document.getElementById('modal');
  app.ui.overlay = new Container({ el: document.getElementById('overlay') });

  app.ui.overlay.el.onmousedown = (event) => {
    // app.ui.overlay.hide();
    // if (event.target === app.ui.overlay.el) {
      // app.ui.overlay.hide();
      app.hideOverlay();
    // }
    // console.log(event.target);
  }


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

  app.ui.colors = new Colors();
  // app.ui.colors.on('color-change', (params) => {
    // app.setStrokeColor(params.color);
  // });
  // app.ui.colors.on('fill-change', (params) => {
    // app.setFillColor(params.color);
  // });

  app.ui.colors.getByName('stroke').on('down', (component) => {
    app.showColorWheel((color) => {
      app.setStrokeColor(color);
    });
  });
  app.ui.colors.getByName('fill').on('down', (component) => {
    app.showColorWheel((color) => {
      app.setFillColor(color);
    });
  });

  // app.ui.colors.setColor(app.getStrokeColor());
  // app.ui.colors.setFill(app.getFillColor());

  app.ui.frameList = new FrameList();
  app.ui.frameList.setThumbnailSize(128 * app.unit, 80 * app.unit);
  app.ui.frameList.on('select', (params) => {
    app.go(params.index);
  });
  app.ui.frameList.on('new-frame', (params) => {
    app.newFrame();
  });
  app.ui.frameList.on('scroll', () => {
    app.updateFrameListMap();
  });

  app.ui.frameListMap = new FrameListMap({ el: document.getElementById('frame-list-map'), name: 'frame-list-map' });

  app.ui.controls = new Controls();
  app.ui.controls.on('first', (state) => {
    app.first();
  });
  app.ui.controls.on('last', (state) => {
    app.last();
  });
  app.ui.controls.on('onion', (state) => {
    app.onion = state;
    app.render();
  });
  app.ui.controls.on('frame-change', (value) => {
    if (value > 0 && value <= app.sequence.size()) {
      app.go(value - 1);
    } else {
      app.ui.controls.setFrame(app.position + 1, app.sequence.size());
    }
  });

  app.ui.controls.setFps(app.fps);

  app.ui.settings = new Settings();
  app.ui.settings.getByName('settings').on('down', (component) => {
    // let tray = app.ui.settingsTray;
    // if (app.tray === tray) {
    //   app.hideTray();
    // } else {
    //   app.showTray(tray, 0, 0);
    // }
  });
  app.ui.settings.getByName('export').on('click', (component) => {
    app.export();
  });

  app.ui.settingsTray = new SettingsTray();
  app.ui.settingsTray.on('show', () => {
    app.ui.settings.updateComponent({ id: 'settings', value: true });
  });
  app.ui.settingsTray.on('hide', () => {
    app.ui.settings.updateComponent({ id: 'settings', value: false });
  });

  app.ui.history = document.getElementById('history');
  // document.body.appendChild(app.ui.history);

  // app.ui.colorPaletteTray = new ColorPaletteTray();
  // app.ui.colorWheel = new ColorWheel();
  // app.ui.colorWheel.on('color', (color) => {
  //   app.setStrokeColor(color);
  //   // console.log(color);
  // });
  //
  // app.ui.overlay.add(app.ui.colorWheel);

  app.setStrokeColor(app.colors.stroke);
  app.setFillColor(null);

  app.ui.main.show();

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
      displayList.add({ points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: app.lineWidth });
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
