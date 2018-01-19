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

let App = {
  // WIDTH: 640,
  // HEIGHT: 400,
  //
  colors: {
    stroke: new Color(85, 85, 85),
    selection: Color.fromHexString('#2db9f0'),
    onion: new Color(160, 240, 160),
    paper: new Color(255, 255, 255),
    workspace: new Color(128, 128, 128)
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

  lineWidth: 1.2,
  zoomLevels: [ 0.25, 0.5, 0.75, 1.0, 1.5, 2, 3, 5 ]
};

App.getOverlayContext = () => {
  return App.paper.overlayCanvas.getContext('2d');
}

App.setDocumentName = (name) => {
  App.documentName = name;
  document.title = App.name + ' — ' + App.documentName;
}

App.render = () => {
  App.paper.displayList.clear();
  if (App.onion) {
    if (App.position > 0) {
      let frame = App.sequence.frames[App.position - 1];
      for (let i = 0; i < frame.strokes.length; i++) {
        let stroke = frame.strokes[i];
        let thickness = stroke.selected ? App.lineWidth*2 : App.lineWidth;
        let color = App.colors.onion; //stroke.selected ? App.COLOR_SELECTION : stroke.color;
        App.paper.displayList.add({ points: stroke.points, color: color, fill: null, thickness: thickness });
      }
    }
  }

  for (let i = 0; i < App.frame.strokes.length; i++) {
    let stroke = App.frame.strokes[i];
    let thickness = stroke.selected ? App.lineWidth*2 : App.lineWidth;
    let color = stroke.selected ? App.colors.selection : stroke.color;
    App.paper.displayList.add({ points: stroke.points, color: color, fill: stroke.fill, thickness: thickness });
  }
  App.paper.render();
}

App.setCaptureTarget = (target) => {
  App.captureTarget = target;
}

App.setMode = (desired) => {
  if (desired !== App.mode) {
    App.mode = desired;
    if (App.mode === 'pan') {
      App.setCursor('hand');
    } else {
      if (App.paper.tool) App.setCursor(App.paper.tool.cursor);
    }
  }
}

App.setTool = (name) => {
  App.paper.setTool(name);
  App.ui.tools.setTool(name);
}

App.setCursor = (name) => {
  App.paper.setCursor(name);
}

App.setStrokeColor = (color) => {
  App.strokeColor = color ? color.copy() : null;
  App.ui.colors.setStrokeColor(App.strokeColor);
}

App.setFillColor = (color) => {
  App.fillColor = color ? color.copy() : null;
  App.ui.colors.setFillColor(App.fillColor);
}

App.getStrokeColor = () => {
  return App.strokeColor;
}

App.getFillColor = () => {
  return App.fillColor;
}

App.hitTest = (x, y) => {
  let p = App.paper.screenToWorld(x, y);
  let selection = null;
  let margin = 4 / App.paper.scale;
  for (let i = App.frame.strokes.length - 1; i >= 0; i--) {
    let stroke = App.frame.strokes[i];
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

App.strokeFromPoints = (sourcePoints, convertToWorld) => {
  var points = [];
  for (var i = 0; i < sourcePoints.length; i++) {
    var p = sourcePoints[i];
    var x = p.x, y = p.y;
    if (convertToWorld) {
      points[i] = App.paper.screenToWorld(x, y);
    } else {
      points[i] = new Point(x, y);
    }
  }
  return new Stroke({ points: points });
}

App.select = (stroke) => {
  App.selection.add(stroke);
}

App.deselect = (stroke) => {
  if (stroke) {
    App.selection.remove(stroke);
  } else {
     if (!App.selection.isEmpty()) {
      var strokes = App.selection.items.slice(0);
      App.selection.clear();
      for (var i = 0; i < strokes.length; i++) {
      }
    }
  }
}

App.marqueeSelect = (p1, p2) => {
  let xmin = p1.x;
  let ymin = p1.y;
  let xmax = p2.x;
  let ymax = p2.y;

  let candidates = [];
  let frame = App.frame;

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

  App.selection.clear();
  App.selection.add(candidates);
  // return selection;
  App.render();
}

App.deleteSelected = () => {
  if (!App.selection.isEmpty()) {
    let undoState = App.frame.getState();
    App.frame.strokes = App.frame.strokes.filter(element => !App.selection.items.includes(element));
    App.selection.clear();
    App.addPaperAction(PaperActionType.DELETE_STROKE, undoState);
    App.updateFrameListThumbnail(App.position);
    App.render();
  }
}

App.setFrameDirty = () => {
  let position = App.position;
  if (!App.thumbnails[position]) {
    App.thumbnails[position] = setTimeout(() => {
      App.thumbnails[position] = null;
      App.updateFrameListThumbnail(position);
    }, 100);
  }

}

App.bringForward = () => {
  let undoState = App.frame.getState();
  App.frame.strokes.forEach((element, index) => {
    if (App.selection.includes(element)) {
      element.z = index + 1;
    } else {
      element.z = index - 1;
    }
  });
  App.frame.strokes.sort((a, b) => { return a.z - b.z; })
  App.addPaperAction(PaperActionType.STROKE_ORDER, undoState);
  App.render();
}

App.sendBack = () => {
  let undoState = App.frame.getState();
  App.frame.strokes.forEach((element, index) => {
    if (App.selection.includes(element)) {
      element.z = index - 1;
    } else {
      element.z = index + 1;
    }
  });
  App.frame.strokes.sort((a, b) => { return a.z - b.z; })
  App.addPaperAction(PaperActionType.STROKE_ORDER, undoState);
  App.render();
}

App.moveSelected = (dx, dy) => {
  let undoState = App.frame.getState();

  for (var i = 0; i < App.selection.items.length; i++) {
    var item = App.selection.items[i];
    var points = item.points;
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      p.x = p.x + dx / App.paper.scale;
      p.y = p.y + dy / App.paper.scale;
    }
    item.calculateBounds();
  }
  App.addPaperAction(PaperActionType.MOVE, undoState);
  App.setFrameDirty();
  App.render();
}

App.updateFrameLabel = () => {
  App.ui.controls.setFrame(App.position + 1, App.sequence.size());
  reposition();
}

App.updateFrameListMap = () => {
  let width = App.ui.frameList.el.offsetWidth;
  let total = App.ui.frameList.container.el.scrollWidth;
  let size = total > width ? ((width / total) * width) >> 0 : width;
  let offset = Math.ceil((App.ui.frameList.el.scrollLeft / App.ui.frameList.el.scrollWidth) * width);
  App.ui.frameListMap.render({ cmd: 'update', size: size, offset: offset });
}

App.updateFrameListThumbnail = (index) => {
  let width = 128 * App.unit;
  let height = 80 * App.unit;
  let frame = App.sequence.getFrame(index);
  let scale = (width) / App.paperWidth;
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
    displayList.add({points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: App.lineWidth * 2});
  }
  App.paper.renderDisplayListToCanvas(canvas, displayList, transform);

  App.ui.frameList.render({ cmd: 'updateThumbnail', canvas: canvas, index: index });
}

App.go = (index) => {
  let frame = App.sequence.getFrame(index);
  if (frame) {
    App.position = index;
    App.frame = frame;
    App.history = App.frame.history;
    App.selection.clear();

    App.ui.frameList.render({ cmd: 'select', index: App.position });

    App.updateFrameListMap();
    App.updateFrameLabel();
    App.updateHistoryPanel();

    App.render();
  }
}

App.first = () => {
  App.go(0);
}

App.last = () => {
  App.go(App.sequence.size() - 1);
}

App.next = () => {
  App.go(App.position + 1);
}

App.previous = () => {
  App.go(App.position - 1);
}

// App.showTray = (tray, x, y) => {
//   if (tray && tray !== App.tray) {
//     // console.log(tray.el);
//     setTimeout(() => {
//       if (!App.tray) {
//         document.body.appendChild(tray.el);
//         tray.show();
//
//         // let rect = component.el.getBoundingClientRect();
//         // let x = rect.left - tray.el.offsetWidth / 2 + rect.width / 2;
//         // let y = rect.top + rect.height + (4 * App.unit);
//         x = window.innerWidth / 2 - tray.el.offsetWidth / 2;
//         y = window.innerHeight / 2 - tray.el.offsetHeight / 2;
//
//         tray.el.style.left = x + 'px';
//         tray.el.style.top = y + 'px';
//
//         App.tray = tray;
//       }
//     });
//   }
// }
//
// App.hideTray = () => {
//   if (App.tray) {
//     App.tray.hide();
//     App.tray = null;
//   }
// }

App.hideOverlay = () => {
  for (var i = 0; i < App.ui.overlay.children.length; i++) {
    App.ui.overlay.remove(App.ui.overlay.children[i]);
  }
  App.ui.overlay.hide();
}

App.showColorWheel = (callback) => {
  App.ui.overlay.show();
  let colorWheel = new ColorWheel({ callback: callback });
  App.ui.overlay.add(colorWheel);
}

App.hideColorWheel = () => {
  if (App.ui.colorWheel) App.ui.colorWheel.hide();
}

App.newFrame = () => {
  App.sequence.add();
  App.ui.frameList.render({ cmd: 'frameAdd' });
  App.go(App.sequence.size() - 1);

  // App.addPaperAction(PaperActionType.INITIAL);

  App.updateFrameListMap();
  App.updateFrameListThumbnail(App.position);
  App.updateFrameLabel();
}

App.removeFrame = () => {
  if (App.sequence.size() > 1) {
    App.sequence.remove(App.position);
    App.ui.frameList.render({ cmd: 'frameRemove', index: App.position });
    if (App.position >= App.sequence.size()) {
      App.go(App.sequence.size() - 1);
    } else {
      App.go(App.position);
    }
  }
}

App.toggleTheme = () => {
  App.theme = App.theme === 'light' ? 'dark' : 'light';
  document.getElementById('css').href = './css/' + App.theme + '.css';
  App.render();
}

App.export = () => {
  ipcRenderer.send('export');
}

App.setState = (state) => {
  if (state) {
    App.frame.setStrokes(state.strokes);
    App.selection.clear();
    let list = App.frame.strokes.filter(element => element.selected);
    App.selection.add(list);
    App.setFrameDirty();
    App.render();
  }
}

App.updateHistoryPanel = () => {
  App.ui.history.innerHTML = '';
  for (var i = 0; i < App.history.items.length; i++) {
    let action = App.history.items[i];
    let div = document.createElement('div');
    div.innerHTML = action.type + ' ' + (action.undoState ? 'undo' : 'null');
    if (App.history.marker === i + 1) {
      div.innerHTML += '<br>x<br>';
    } else {
    }
    App.ui.history.appendChild(div);
  }
}

App.undo = () => {
  console.log('undo');
  if (!App.history.isEmpty() && !App.history.atBeginning()) {
    let action = App.history.getAction();
    // if (action.frameIndex !== App.position) App.go(action.frameIndex);
    if (action.undoState) App.setState(action.undoState);
    App.history.back();
  }
  App.updateHistoryPanel();
}

App.redo = () => {
  console.log('redo');
  if (!App.history.isEmpty() && !App.history.atEnd()) {
    App.history.forward();
    let action = App.history.getAction();
    // if (action.frameIndex !== App.position) App.go(action.frameIndex);
    if (action.state) App.setState(action.state);
  }
  App.updateHistoryPanel();
}

App.addPaperAction = (type, undoState) => {
  let action = new PaperAction({
    type: type,
    state: App.frame.getState(),
    undoState: undoState,
    frameIndex: App.position
  })
  App.history.add(action);
  App.updateHistoryPanel();
  // console.log(App.history.marker, App.history.items);
}

App.createStroke = (points, color, fill) => {
  let undoState = App.frame.getState();
  let stroke = App.strokeFromPoints(points, true);
  stroke.setColor(color);
  stroke.setFill(fill);
  App.frame.addStroke(stroke);
  App.addPaperAction(PaperActionType.NEW_STROKE, undoState);
  App.updateFrameListThumbnail(App.position);
  App.render();
}

App.setStrokeFill = (fill) => {
  for (var i = 0; i < App.selection.items.length; i++) {
    var element = App.selection.items[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
}

function reposition() {
  App.width = window.innerWidth;
  App.height = window.innerHeight - App.ui.frameList.el.offsetHeight - App.ui.frameListMap.el.offsetHeight;

  App.paper.resize(App.width, App.height);

  App.ui.settings.el.style.left = (((App.width / 2) - (App.ui.settings.el.offsetWidth/2)) >> 0) + 'px';
  App.ui.tools.el.style.top = (((App.height / 2) - (App.ui.tools.el.offsetHeight/2)) >> 0) + 'px';
  App.ui.colors.el.style.top = (((App.height / 2) - (App.ui.colors.el.offsetHeight/2)) >> 0) + 'px';
  App.ui.controls.el.style.left = (((App.width / 2) - (App.ui.controls.el.offsetWidth/2)) >> 0) + 'px';
  App.ui.controls.el.style.bottom = (App.ui.frameList.el.offsetHeight + App.ui.frameListMap.el.offsetHeight - 8) + 'px';

  App.updateFrameListMap();
  App.render();
}

App.setModal = function(value) {
  console.log('setModal');
}

App.capture = (captor, modal=false) => {
  if (captor) {
    App.captureTarget = captor;
    if (captor instanceof Base) {
      captor.el.style.pointerEvents = 'auto';
      document.body.style.pointerEvents = 'none';
    }
  }
}

App.release = (captor) => {
  if (captor) {
    if (captor === App.captureTarget) {
      App.captureTarget = null;
      if (captor instanceof Base) {
        captor.el.style.pointerEvents = 'auto';
      }
      document.body.style.pointerEvents = 'auto';
    } else {
      console.log('App.release', 'mismatch');
    }
  } else {
    console.log('App.release', 'null');
  }
}

function saveAnimatedGIF(filename) {
  let canvas = document.createElement('canvas');
  canvas.width = App.paper.width;
  canvas.height = App.paper.height;

  let ctx = canvas.getContext('2d');
  let transform = new Transform(0, 0);

  const encoder = new GIFEncoder(App.paper.width, App.paper.height);
  encoder.createReadStream().pipe(fs.createWriteStream(filename));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000/12);

  let displayList = new DisplayList();

  for (let i = 0; i < App.sequence.frames.length; i++) {
    let frame = App.sequence.frames[i];
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    displayList.clear();

    for (let i = 0; i < frame.strokes.length; i++) {
      let stroke = frame.strokes[i];
      displayList.add({ points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: App.lineWidth });
    }

    App.paper.renderDisplayListToCanvas(canvas, displayList, transform);
    encoder.addFrame(ctx);
  }

  encoder.finish();
}

function fadeComponent(component) {
  if (component.fadeTimerId != null && component.fadeTimerId != undefined) {
    clearTimeout(component.fadeTimerId);
  }
  component.fadeTimerId = setTimeout(() => {
    if (component.getBounds().containsPoint(App.cursorX, App.cursorY, 8) && App.captureTarget instanceof Tool) {
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
  if (App.captureTarget) {
    App.captureTarget.handleEvent(event);
  } else {
    if (App.paper && event.target === App.paper.el) {
      App.paper.handleEvent(event);
    }
  }
}

function mouseEventHandler(event) {
  if (App.captureTarget) {
    App.captureTarget.handleEvent(event);
  } else {
    if (App.paper && event.target === App.paper.el) {
      App.paper.handleEvent(event);
    }
  }
}

function onClick(event) {
}

function onMouseDown(event) {
  App.mouseLeft = event.buttons & 1;
  if (App.mode === 'pan') {
  } else {
    // if (App.tray) {
    //   if (!App.tray.getBounds().containsPoint(App.cursorX, App.cursorY)) {
    //     App.hideTray();
    //   }
    // }
    if (App.paper && event.target === App.paper.el) {
      App.paper.handleEvent(event);
    }
    // mouseEventHandler(event);
  }
}

function onMouseUp(event) {
  App.mouseLeft = event.buttons & 1;
  if (App.mode === 'pan') {
    if (!App.mouseLeft && !App.keys[' ']) {
      panOff();
    }
  } else {
    mouseEventHandler(event);
  }
}

function onMouseMove(event) {
  App.cursorX = event.clientX;
  App.cursorY = event.clientY;

  if (App.mode === 'pan' && event.buttons & 1) {
    App.paper.panCameraBy(-event.movementX / App.paper.scale, -event.movementY / App.paper.scale);
  } else {
    if (App.captureTarget instanceof Tool) {
      if (App.ui.settings.getBounds().containsPoint(App.cursorX, App.cursorY, 8)) {
        fadeComponent(App.ui.settings);
      } else if (App.ui.controls.getBounds().containsPoint(App.cursorX, App.cursorY, 8)) {
        fadeComponent(App.ui.controls);
      } else if (App.ui.tools.getBounds().containsPoint(App.cursorX, App.cursorY, 8)) {
        fadeComponent(App.ui.tools);
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
  App.keys[event.key] = true;

  // !event.repeat ? console.log(event.key) : 0;

  if (this.mode === 'pan') {

  } else {
    if (App.captureTarget) {
      App.captureTarget.handleEvent(event);

    } else {
      if (event.key == 'b' && !event.repeat) {
        App.setTool('pencil');
      }
      else if (event.key == 'p' && !event.repeat) {
        App.setTool('polygon');
      }
      else if (event.key == 'l' && !event.repeat) {
        App.setTool('line');
      }
      else if (event.key == 'q' && !event.repeat) {
        App.setTool('pointer');
      }
      else if (event.key == 'u' && !event.repeat) {
        App.ui.history.hidden = !App.ui.history.hidden;
      }
      else if (event.key == 'Z' && !event.repeat) {
        if (event.ctrlKey) App.redo();
      }
      else if (event.key == 'z' && !event.repeat) {
        if (event.ctrlKey)
          App.undo();
        else
          App.setTool('zoom');
      }
      else if (event.key === 'd' && !event.repeat) {
        App.settings['dots'] = !App.settings['dots'];
        App.render();
      }
      else if (event.key === 'h' && !event.repeat) {
        App.setTool('hand');
      }
      else if (event.key === '.' && !event.repeat) {
        App.go(App.position + 1);
      }
      else if (event.key === ',' && !event.repeat) {
        App.go(App.position - 1);
      }
      else if (event.key === 'n' && !event.repeat) {
        App.newFrame();
      }
      else if (event.key === ' ' && !event.repeat) {
        panOn();
      }
      else if (event.key === 'Backspace' && event.ctrlKey && !event.repeat) {
        App.removeFrame();
      }
      else if (event.key === 't' && !event.repeat) {
        App.toggleTheme();
      }
      else {
        App.paper.handleEvent(event);
      }
    }
  }
}

function panOn() {
  App.setMode('pan');
}

function panOff() {
  App.setMode(null);
}

function onKeyUp(event) {
  App.keys[event.key] = false;
  if (App.mode === 'pan') {
    if (event.key === ' ') {
      if (!App.mouseLeft) {
        panOff();
      }
    }
  } else {
    if (App.captureTarget) {
      App.captureTarget.handleEvent(event);
    } else {
      App.paper.handleEvent(event);
    }
  }
}

function onResize() {
  if (!window.resizeTimeoutId) {
    window.resizeTimeoutId = setTimeout(function() {
      reposition();
      window.resizeTimeoutId = 0;
    }, 66);
  }
  // if (App.tray) App.hideTray();
}

function onFocus(event) {
  if (App.captureTarget) App.release(App.captureTarget);
  App.paper.handleEvent(event);
  App.render();
}

function onBlur(event) {
  if (App.captureTarget) App.release(App.captureTarget);
  App.paper.handleEvent(event);
}

function onVisibilityChange(event) {

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

  document.addEventListener('visibilitychange', onVisibilityChange);
}

ipcRenderer.on('export', (event, filename) => {
  let extension = filename.substring(filename.lastIndexOf('.') + 1);

  if (extension === 'gif') {
    saveAnimatedGIF(filename);

  } else {
    // let data = '1234567890';
    // var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    // svg.setAttribute('width', App.paper.width);
    // svg.setAttribute('height', App.paper.height);
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

function ready() {
  console.log('startup');

  window.App = App;

  App.name = 'Matey';
  App.setDocumentName('untitled.matey');

  App.width = window.innerWidth;
  App.height = window.innerHeight;

  App.unit = 1;
  App.paperWidth = 640;
  App.paperHeight = 400;
  App.settings = [];
  App.ui = [],
  App.mouseX = 0;
  App.mouseY = 0;
  App.mouseDownX = 0;
  App.mouseDownY = 0;
  App.mouseLeft = false;
  App.mouseTarget = null;
  App.mouseTargetTag = null;
  App.mouseDownTargetTag = null;
  App.mouseDownTarget = null;
  App.keys = [];
  App.tags = [];
  App.mode = null;
  App.tool = null;
  App.tools = [];
  App.position = 0;
  App.frame = null;
  App.fps = 12;
  App.captureTarget = null;
  App.modal = false;
  App.theme = 'light';
  App.thumbnails = [];

  App.history = new History();
  App.sequence = new Sequence();
  App.selection = new Selection();

  document.body.style.fontSize = (10 * App.unit) + 'px';

  App.ui.main = new Container({ el: document.getElementById('main') });
  App.ui.content = new Container({ el: document.getElementById('content') });
  App.ui.modal = document.getElementById('modal');
  App.ui.overlay = new Container({ el: document.getElementById('overlay') });

  App.ui.overlay.el.onmousedown = (event) => {
    // App.ui.overlay.hide();
    // if (event.target === App.ui.overlay.el) {
      // App.ui.overlay.hide();
      App.hideOverlay();
    // }
    // console.log(event.target);
  }


  App.ui.tools = new Tools();
  App.ui.tools.on('tool-change', (params) => {
    App.setTool(params.tool);
  });

  App.paper = new Paper({ el: document.getElementById('paper'), width: App.paperWidth, height: App.paperHeight });
  App.paper.on('zoom', (params) => {
    // status.setZoom(params.scale)
  });
  App.paper.on('pick', (params) => {
  });
  App.paper.on('change-mode', (params) => {
    App.setMode(params.mode);
  });

  App.ui.colors = new Colors();
  // App.ui.colors.on('color-change', (params) => {
    // App.setStrokeColor(params.color);
  // });
  // App.ui.colors.on('fill-change', (params) => {
    // App.setFillColor(params.color);
  // });

  App.ui.colors.getByName('stroke').on('down', (component) => {
    App.showColorWheel((color) => {
      App.setStrokeColor(color);
    });
  });
  App.ui.colors.getByName('fill').on('down', (component) => {
    App.showColorWheel((color) => {
      App.setFillColor(color);
    });
  });

  // App.ui.colors.setColor(App.getStrokeColor());
  // App.ui.colors.setFill(App.getFillColor());

  App.ui.frameList = new FrameList();
  App.ui.frameList.setThumbnailSize(128 * App.unit, 80 * App.unit);
  App.ui.frameList.on('select', (params) => {
    App.go(params.index);
  });
  App.ui.frameList.on('new-frame', (params) => {
    App.newFrame();
  });
  App.ui.frameList.on('scroll', () => {
    App.updateFrameListMap();
  });

  App.ui.frameListMap = new FrameListMap({ el: document.getElementById('frame-list-map'), name: 'frame-list-map' });

  App.ui.controls = new Controls();
  App.ui.controls.on('first', (state) => {
    App.first();
  });
  App.ui.controls.on('last', (state) => {
    App.last();
  });
  App.ui.controls.on('onion', (state) => {
    App.onion = state;
    App.render();
  });
  App.ui.controls.on('frame-change', (value) => {
    if (value > 0 && value <= App.sequence.size()) {
      App.go(value - 1);
    } else {
      App.ui.controls.setFrame(App.position + 1, App.sequence.size());
    }
  });

  App.ui.controls.setFps(App.fps);

  App.ui.settings = new Settings();
  App.ui.settings.getByName('settings').on('down', (component) => {
    // let tray = App.ui.settingsTray;
    // if (App.tray === tray) {
    //   App.hideTray();
    // } else {
    //   App.showTray(tray, 0, 0);
    // }
  });
  App.ui.settings.getByName('export').on('click', (component) => {
    App.export();
  });

  App.ui.settingsTray = new SettingsTray();
  App.ui.settingsTray.on('show', () => {
    App.ui.settings.updateComponent({ id: 'settings', value: true });
  });
  App.ui.settingsTray.on('hide', () => {
    App.ui.settings.updateComponent({ id: 'settings', value: false });
  });

  App.ui.history = document.getElementById('history');
  // App.ui.history.style.visibility = 'visible';

  App.setStrokeColor(App.colors.stroke);
  App.setFillColor(null);

  App.ui.main.show();

  App.setTool('pencil');
  App.newFrame();

  initEventListeners();
  reposition();
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    ready();
  }, false);
} else {
  window.onload = function() {
    ready();
  }
}
