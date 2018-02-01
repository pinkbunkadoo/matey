const Util = require('./util');
const Color = require('./color');
const Stroke = require('./stroke');
const Transform = require('./transform');
const Renderer = require('./renderer');
const Surface = require('./surface');
const DisplayList = require('./display_list');
const DisplayItem = require('./display_item');
const Selection = require('./selection');
const Sequence = require('./sequence');
const Tool = require('./tools/tool');
const History = require('./history');
const Frame = require('./frame');
const FileHelper = require('./file_helper');

const SequenceAction = require('./actions/sequence_action');
const SequenceActionType = require('./actions/sequence_action_type');
const PaperAction = require('./actions/paper_action');
const PaperActionType = require('./actions/paper_action_type');

const Base = require('./ui/base');
const Container = require('./ui/container');
const Paper = require('./ui/custom/paper');
const ToolsTray = require('./ui/custom/tools_tray');
const ColorsTray = require('./ui/custom/colors_tray');
const ControlsTray = require('./ui/custom/controls_tray');
const FrameListTray = require('./ui/custom/frame_list_tray');
// const FrameListMap = require('./ui/custom/frame_list_map');
const SettingsTray = require('./ui/custom/settings_tray');
const PlaybackOptionsTray = require('./ui/custom/playback_options_tray');
const ColorWheel = require('./ui/custom/color_wheel');
const ColorPalette = require('./ui/custom/color_palette');
const Overlay = require('./ui/overlay');
const Menu = require('./ui/menu');

const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;
const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const nativeMenu = require('./native_menu');

let App = {
  extension: '.matey',
  colors: {
    stroke: new Color(85, 85, 85),
    selection: new Color(255, 96, 16),
    onion: new Color(180, 240, 192),
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
  if (name) {
    App.documentName = name;
    document.title = App.name + ' — ' + App.getDocumentName();
  }
}

App.getDocumentName = () => {
  return App.documentName || 'untitled';
}

App.render = (frameIndex) => {
  App.paper.clearDisplayList();

  if (App.onion) {
    if (App.position > 0) {
      let frame = App.sequence.frames[App.position - 1];
      for (let i = 0; i < frame.strokes.length; i++) {
        let stroke = frame.strokes[i];
        let color = App.colors.onion;
        let item = new DisplayItem({ points: stroke.points, color: color, fill: null, thickness: App.lineWidth });
        App.paper.addDisplayItem(item);
      }
    }
  }

  for (let i = 0; i < App.frame.strokes.length; i++) {
    let stroke = App.frame.strokes[i];
    App.paper.addDisplayItem(new DisplayItem({
      points: stroke.points, color: stroke.color, fill: stroke.fill,
      thickness: App.lineWidth,
      dashed: (stroke.fill === null && stroke.color === null)
    }));
  }

  for (let i = 0; i < App.frame.strokes.length; i++) {
    let stroke = App.frame.strokes[i];
    if (stroke.selected) {
      let item = new DisplayItem({ points: stroke.points, color: App.colors.selection,
        fill: null, thickness: App.lineWidth * 4, opacity: 0.5, operation: 'difference' });
      App.paper.addDisplayItem(item);
    }
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
  App.ui.toolsTray.setTool(name);
}

App.setCursor = (name) => {
  App.paper.setCursor(name);
}

App.setStrokeColor = (color) => {
  App.strokeColor = color ? color.copy() : null;
  App.ui.colorsTray.setStrokeColor(App.strokeColor);
}

App.setFillColor = (color) => {
  App.fillColor = color ? color.copy() : null;
  App.ui.colorsTray.setFillColor(App.fillColor);
}

App.getStrokeColor = () => {
  return App.strokeColor;
}

App.getFillColor = () => {
  return App.fillColor;
}

App.setFps = (fps) => {
  if (fps >= 1 && fps <= 60) {
    App.fps = fps;
    updateFpsField();
    App.markAsChanged();
  }
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

App.selectAll = () => {
  if (App.selection.itemCount == App.frame.strokes.length) {
    App.selection.clear();
  } else {
    App.selection.add(App.frame.strokes);
  }
  App.render();
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

App.setFrameDirty = () => {
  let position = App.position;
  if (!App.thumbnails[position]) {
    App.thumbnails[position] = setTimeout(() => {
      App.thumbnails[position] = null;
      updateFrameListThumbnail(position);
    }, 100);
  }

}



function updateHistoryPanel() {
  App.ui.history.el.innerHTML = '';
  for (var i = 0; i < App.history.items.length; i++) {
    let action = App.history.items[i];
    let div = document.createElement('div');
    div.innerHTML = action.type + ' ' + (action.undoState ? 'undo' : 'null');
    if (App.history.marker === i + 1) {
      div.innerHTML += '<br>x<br>';
    } else {
    }
    App.ui.history.el.appendChild(div);
  }
}

function updateFpsField() {
  App.ui.playbackOptionsTray.getByName('fps').value = App.fps;
}

function updateFrameLabel() {
  // App.ui.controls.setFrame(App.position + 1, App.sequence.size());
  reposition();
}

function updateFrameListMap() {
  // let width = App.frameList.el.offsetWidth;
  // let total = App.frameList.container.el.scrollWidth;
  // let size = total > width ? ((width / total) * width) >> 0 : width;
  // let offset = Math.ceil((App.frameList.el.scrollLeft / App.frameList.el.scrollWidth) * width);
  // App.ui.frameListMap.render({ cmd: 'update', size: size, offset: offset });
}

function updateFrameListThumbnail(index) {
  let width = App.thumbnailWidth;
  let height = App.thumbnailHeight;
  let frame = App.sequence.getFrame(index);
  let scale = (width) / App.paperWidth;

  let renderer = new Renderer();
  let transform = new Transform(0, 0, scale);
  let surface = new Surface({ width: width, height: height });

  for (var i = 0; i < frame.strokes.length; i++) {
    let stroke = frame.strokes[i];
    renderer.displayList.add(new DisplayItem({
      points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: App.lineWidth * 2
    }));
  }

  surface.fill(App.colors.paper);
  renderer.renderToSurface(surface, transform);
  App.frameList.render({ cmd: 'updateThumbnail', canvas: surface.canvas, index: index });
}

App.go = (index) => {
  if (index > App.sequence.size - 1) index = App.sequence.size - 1;
  let frame = App.sequence.getFrame(index);
  if (frame) {
    App.position = index;
    App.frame = frame;
    App.history = App.frame.history;
    App.selection.clear();

    App.frameList.render({ cmd: 'select', index: App.position });

    updateFrameListMap();
    updateFrameLabel();
    updateHistoryPanel();

    App.render();
  }
}

App.first = () => {
  App.go(0);
}

App.last = () => {
  App.go(App.sequence.size - 1);
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

function showOverlay() {
  App.ui.overlay.show();
}

function hideOverlay() {
  App.ui.overlay.hide();
}

function showColorWheel(el, callback) {
  let colorWheel = new ColorWheel({ callback: callback });
  let bounds = el.getBoundingClientRect();
  let x = (bounds.left + bounds.width / 2);
  let y = (bounds.top + bounds.height + 16 * App.unit);
  colorWheel.show(x, y);
}

function hideColorWheel(colorWheel) {
  colorWheel.hide();
}

function showColorPalette(el, callback) {
  let colorPalette = new ColorPalette({ callback: callback });
  let bounds = el.getBoundingClientRect();
  let x = (bounds.left + bounds.width / 2);
  let y = (bounds.top + bounds.height + 16 * App.unit);
  colorPalette.show({ x: x, y: y });
}

function showMenu(menu, x, y) {
  menu.show(x, y);
}

function hideMenu(menu) {
  menu.hide();
}

function toggleHistoryPanel() {
  App.ui.history.isVisible() ? App.ui.history.hide() : App.ui.history.show();
}

App.toggleTheme = () => {
  App.theme = App.theme === 'light' ? 'dark' : 'light';
  document.getElementById('css').href = './css/' + App.theme + '.css';
  App.render();
}

App.renderAnimationFrame = () => {
  App.paper.clearDisplayList();
  let frame = App.sequence.getFrame(App.animationFrameIndex);
  for (let i = 0; i < frame.strokes.length; i++) {
    let stroke = frame.strokes[i];
    let thickness = stroke.selected ? App.lineWidth * 2 : App.lineWidth;
    let color = stroke.selected ? App.colors.selection : stroke.color;
    App.paper.addDisplayItem({ points: stroke.points, color: color, fill: stroke.fill, thickness: thickness });
  }
  App.paper.render();
}

App.step = () => {
  App.animationTime = performance.now();
  App.animationDeltaTime = App.animationTime - App.previousAnimationTime;
  App.animationFrameTime += App.animationDeltaTime;

  if (App.animationFrameTime > 1000 / App.fps) {
    App.animationFrameIndex++;
    if (App.animationFrameIndex < App.sequence.size) {
      App.renderAnimationFrame();
    }
    App.animationFrameTime = App.animationFrameTime - (1000 / App.fps);
  }

  if (App.animationFrameIndex == App.sequence.size) {
    if (App.loop) {
      App.animationFrameIndex = 0;
      App.renderAnimationFrame();
    } else {
      App.stop();
      return;
    }
  }
  App.animationFrameId = requestAnimationFrame(App.step);
  App.previousAnimationTime = App.animationTime;
}

App.play = () => {
  App.playing = true;
  App.animationTime = performance.now();
  App.previousAnimationTime = App.animationTime;
  App.animationFrameTime = 0;
  App.animationFrameIndex = App.position;
  App.frameList.render({ cmd: 'select' });
  App.renderAnimationFrame();
  App.animationFrameId = requestAnimationFrame(App.step);
}

App.stop = () => {
  App.playing = false;
  window.cancelAnimationFrame(App.animationFrameId);
  App.ui.controlsTray.setPlaying(false);
  App.go(App.animationFrameIndex);
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

App.markAsChanged = () => {
  App.changed = true;
}

App.undo = () => {
  if (!App.history.isEmpty() && !App.history.atBeginning()) {
    let action = App.history.getAction();
    if (action.undoState) App.setState(action.undoState);
    App.history.back();
    updateHistoryPanel();
    App.markAsChanged();
  }
}

App.redo = () => {
  if (!App.history.isEmpty() && !App.history.atEnd()) {
    App.history.forward();
    let action = App.history.getAction();
    if (action.state) App.setState(action.state);
    updateHistoryPanel();
    App.markAsChanged();
  }
}

App.addPaperAction = (type, undoState) => {
  let action = new PaperAction({
    type: type,
    state: App.frame.getState(),
    undoState: undoState,
    frameIndex: App.position
  })
  App.history.add(action);
  updateHistoryPanel();
  App.markAsChanged();
}

App.doAction = (type, params) => {
  if (type == 'newFrame') {
    App.newFrame();
  } else if (type == 'insertFrame') {
    App.insertFrame(params);
  } else if (type == 'duplicateFrame') {
    App.duplicateFrame();
  } else if (type == 'removeFrame') {
    App.removeFrame();
  } else if (type == 'createStroke') {
    App.createStroke(params);
  } else if (type == 'deleteSelected') {
    App.deleteSelected();
  } else if (type == 'moveSelected') {
    App.moveSelected(params);
  } else if (type == 'bringForward') {
    App.bringForward();
  } else if (type == 'sendBack') {
    App.sendBack();
  }
  App.markAsChanged();
}

App.newFrame = () => {
  App.insertFrame({ frame: new Frame(), position: App.position + 1 });
}

// frame, position
App.insertFrame = (params) => {
  if (params.frame) {
    let position = params.position !== undefined ? params.position : App.sequence.size;
    App.sequence.insert(params.frame, position);
    App.frameList.render({ cmd: 'frameInsert', index: position });
    App.go(position);
    // updateFrameListMap();
    updateFrameListThumbnail(position);
    // updateFrameLabel();
    App.markAsChanged();
  }
}

App.duplicateFrame = () => {
  App.insertFrame({ frame: App.frame.copy(), position: App.position + 1 });
}

App.removeFrame = () => {
  if (App.sequence.size > 1) {
    App.sequence.remove(App.position);
    App.frameList.render({ cmd: 'frameRemove', index: App.position });
    if (App.position >= App.sequence.size) {
      App.go(App.sequence.size - 1);
    } else {
      App.go(App.position);
    }
    App.markAsChanged();
  }
}

App.deleteSelected = () => {
  if (!App.selection.isEmpty()) {
    let undoState = App.frame.getState();
    App.frame.strokes = App.frame.strokes.filter(element => !App.selection.items.includes(element));
    App.selection.clear();
    App.addPaperAction(PaperActionType.DELETE_STROKE, undoState);
    updateFrameListThumbnail(App.position);
    App.render();
    App.markAsChanged();
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
  App.markAsChanged();
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
  App.markAsChanged();
}

// dx, dy
App.moveSelected = (params) => {
  let dx = params.dx || 0;
  let dy = params.dy || 0;
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
  App.markAsChanged();
}

// points, color, fill
App.createStroke = (params={}) => {
  if (params.points) {
    let undoState = App.frame.getState();
    let stroke = App.strokeFromPoints(params.points, true);
    stroke.setColor(params.color);
    stroke.setFill(params.fill);
    App.frame.addStroke(stroke);
    App.addPaperAction(PaperActionType.NEW_STROKE, undoState);
    updateFrameListThumbnail(App.position);
    App.render();
    App.markAsChanged();
  }
}

App.setStrokeFill = (fill) => {
  for (var i = 0; i < App.selection.items.length; i++) {
    var element = App.selection.items[i];
    if (element instanceof Stroke) {
      element.fill = fill;
    }
  }
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

App.reset = () => {
  App.setFps(6);

  App.sequence = new Sequence();
  App.selection = new Selection();

  App.position = -1;
  App.thumbnails = [];

  App.path = app.getPath('documents');
  App.setDocumentName();
  App.changed = false;

  App.frameList.render({ cmd: 'removeAll' });

  App.setStrokeColor(App.colors.stroke);
  App.setFillColor(null);
  App.setTool('pencil');
}

App.new = () => {
  App.reset();
  App.newFrame();
}

App.open = (filepath) => {
  if (filepath) {
    FileHelper.loadSequenceFromFile(filepath, (sequence) => {
      App.reset();
      App.setDocumentName(path.basename(filepath, App.extension));
      App.path = path.dirname(filepath);

      App.sequence = sequence;
      for (var i = 0; i < sequence.frames.length; i++) {
        let frame = sequence.frames[i];
        App.frameList.render({ cmd: 'frameInsert', index: i });
        updateFrameListThumbnail(i);
      }
      App.go(0);
    });
  } else {
    ipcRenderer.send('open-dialog', App.path);
  }
}

App.save = (filepath) => {
  if (filepath) {
    try {
      // fs.accessSync(filepath, fs.constants.F_OK);
      FileHelper.saveSequence(filepath, App.sequence, () => {
        App.setDocumentName(path.basename(filepath, App.extension));
      });
    } catch (err) {
      console.log('File is not available or does not exist.');
    }
  } else {
    if (App.documentName) {
      let filepath = path.join(App.path, App.documentName + App.extension);
      FileHelper.saveSequence(filepath, App.sequence, () => {
        App.setDocumentName(path.basename(filepath, App.extension));
      });
    } else {
      ipcRenderer.send('save-dialog', path.join(App.path, 'untitled' + App.extension));
    }
  }
}

App.saveAs = (filepath) => {
  if (filepath) {
    App.save(filepath);
  } else {
    filepath = path.join(App.path, App.getDocumentName() + App.extension);
    ipcRenderer.send('save-dialog', filepath);
  }
}

App.exportGIF = (filepath) => {
  if (filepath) {
    FileHelper.exportGIF(filepath, {
        sequence: App.sequence,
        fps: App.fps,
        width: App.paperWidth,
        height: App.paperHeight,
        thickness: App.lineWidth,
        background: App.colors.paper
      },
      () => {}
    );
  } else {
    ipcRenderer.send('export-dialog', App.documentName);
  }
}

App.quit = () => {
  // if (App.neverBeenSaved || App.changed) {
  //   ipcRenderer.send('save-changes-dialog', path.join(App.path, App.documentName + App.extension));
  // }
}

App.quitNow = () => {
  window.close();
}

function fadeComponent(component) {
  component.fadeCooldown = 2;

  if (!component.fadeTimerId) {
    component.el.style.transition = 'opacity .5s';
    component.el.style.pointerEvents = 'none';
    component.el.style.opacity = 0;

    component.fadeTimerId = setInterval(() => {
      if (component.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY) && App.captureTarget instanceof Tool) {
      } else {
        component.fadeCooldown--;
        if (component.fadeCooldown == 0) {
          clearInterval(component.fadeTimerId);
          component.fadeTimerId = null;
          component.el.style.opacity = 1;
          component.el.style.pointerEvents = 'auto';
        }
      }
    }, 500);
  }
}

function reposition() {
  App.width = window.innerWidth;
  App.height = window.innerHeight;

  App.paper.resize(App.width, App.height);
  App.ui.controlsTray.el.style.left = (((App.width / 2) - (App.ui.controlsTray.el.offsetWidth / 2)) >> 0) + 'px';

  // updateFrameListMap();
  App.render();
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
    if (App.paper && event.target === App.paper.el) {
      App.paper.handleEvent(event);
    }
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
      if (App.ui.settingsTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.settingsTray);
      } else if (App.ui.controlsTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.controlsTray);
      } else if (App.ui.toolsTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.toolsTray);
      } else if (App.ui.frameListTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.frameListTray);
      } else if (App.ui.colorsTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.colorsTray);
      } else if (App.ui.playbackOptionsTray.getBounds().grow(8).containsPoint(App.cursorX, App.cursorY)) {
        fadeComponent(App.ui.playbackOptionsTray);
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

  if (this.mode === 'pan') {

  } else {
    if (App.captureTarget) {
      App.captureTarget.handleEvent(event);

    } else {
      if (event.key == 's' && event.ctrlKey && !event.repeat) {
        App.save();
      }
      else if (event.key == 'b' && !event.repeat) {
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
        toggleHistoryPanel();
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
      else if (event.key == 'a' && !event.repeat) {
        App.selectAll();
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
      else if (event.key === 'N' && !event.repeat) {
        App.duplicateFrame();
      }
      else if (event.key === ' ' && !event.repeat) {
        panOn();
      }
      else if (event.key === 'Backspace' && event.ctrlKey && !event.repeat) {
        App.removeFrame();
      }
      else if ((event.key === 'Delete' || event.key === 'Backspace') && !event.repeat) {
        App.deleteSelected();
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
      window.resizeTimeoutId = null;
    }, 1000/30);
  }
}

function onFocus(event) {
  if (App.captureTarget) App.release(App.captureTarget);
  App.paper.handleEvent(event);
  App.render();
  setTimeout(hideOverlay, 100);
}

function onBlur(event) {
  if (App.captureTarget) App.release(App.captureTarget);
  App.paper.handleEvent(event);
  showOverlay();
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

ipcRenderer.on('new', (event) => {
  App.new();
});

ipcRenderer.on('open', (event, filepath) => {
  App.open(filepath);
});

ipcRenderer.on('save', (event, filepath) => {
  App.save(filepath);
});

ipcRenderer.on('save-as', (event, filepath) => {
  App.saveAs(filepath);
});

ipcRenderer.on('export', (event, filepath) => {
  App.exportGIF(filepath);

  // let extension = filename.substring(filename.lastIndexOf('.') + 1);

  // if (extension === 'gif') {
  //   App.exportGifNow(filename);
  //
  // } else {
  //   // let data = '1234567890';
  //   // var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //   // svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  //   // svg.setAttribute('width', App.paper.width);
  //   // svg.setAttribute('height', App.paper.height);
  //   // svg.appendChild(document.createTextNode('\n'));
  //   //
  //   // let node = document.createElement('polygon');
  //   // node.setAttribute('points', '50 160, 55 180, 70 180, 60 190, 65 205, 50 195, 35 205, 40 190, 30 180, 45 180');
  //   // node.setAttribute('fill', 'black');
  //   // svg.appendChild(node);
  //   // svg.appendChild(document.createTextNode('\n'));
  //   //
  //   // fs.writeFileSync(filename, svg.outerHTML);
  // }

});

ipcRenderer.on('quit', (event) => {

});


function ready() {
  console.log('startup');

  window.App = App;

  App.name = 'Matey';

  App.width = window.innerWidth;
  App.height = window.innerHeight;

  App.unit = 1;
  App.paperWidth = 640 * App.unit;
  App.paperHeight = 400 * App.unit;
  App.thumbnailWidth = 112 * App.unit;
  App.thumbnailHeight = 70 * App.unit;
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
  App.position = -1;
  App.fps = 6;
  App.captureTarget = null;
  App.modal = false;
  App.theme = 'default';
  App.thumbnails = [];

  App.menus = [];

  document.body.style.fontSize = (10 * App.unit) + 'px';

  App.ui.main = new Container({ el: document.getElementById('main') });
  App.ui.content = new Container({ el: document.getElementById('content') });
  App.ui.modal = document.getElementById('modal');
  App.ui.overlay = new Overlay();

  App.paper = new Paper({ el: document.getElementById('paper'), width: App.paperWidth, height: App.paperHeight });
  App.paper.on('zoom', (params) => {
    // status.setZoom(params.scale);
  });
  App.paper.on('pick', (params) => {
  });
  App.paper.on('change-mode', (params) => {
    App.setMode(params.mode);
  });

  // App.ui.frameListMap = new FrameListMap({ el: document.getElementById('frame-list-map'), name: 'frame-list-map' });

  App.ui.history = new Container({ el: document.getElementById('history') });
  App.ui.main.add(App.ui.history);
  App.ui.history.hide();

  App.ui.toolsTray = new ToolsTray({ el: document.getElementById('tools-tray') });
  App.ui.toolsTray.on('tool-change', (params) => {
    App.setTool(params.tool);
  });
  App.ui.colorsTray = new ColorsTray({ el: document.getElementById('colors-tray') });
  App.ui.colorsTray.getByName('stroke').on('down', (component) => {
    showColorPalette(component.el, (color) => {
      App.setStrokeColor(color);
    });
  });
  App.ui.colorsTray.getByName('fill').on('down', (component) => {
    showColorPalette(component.el, (color) => {
      App.setFillColor(color);
    });
  });
  App.ui.controlsTray = new ControlsTray({ el: document.getElementById('controls-tray') });
  App.ui.controlsTray.on('play', (component) => {
    if (App.playing) {
      App.stop();
    } else {
      App.play();
    }
    component.setState(App.playing);
  });

  let menu = new Menu();
  menu.addItem({ title: 'New...', shortcut: 'Ctrl+N', icon: 'new-small', click: () => { App.new() }});
  menu.addItem({ title: 'Open...', shortcut: 'Ctrl+O', click: () => { App.open() }});
  menu.addSeparator();
  menu.addItem({ title: 'Save', shortcut: 'Ctrl+S', click: () => { App.save() } });
  menu.addItem({ title: 'Save As...', shortcut: 'Shift+Ctrl+S', click: () => { App.saveAs() } });
  menu.addSeparator();
  menu.addItem({ title: 'Export GIF...', shortcut: 'Ctrl+E', icon: 'export-small', click: () => { App.exportGIF() } });
  menu.addSeparator();
  menu.addItem({ title: 'Quit', shortcut: 'Ctrl+Q', click: () => { App.quit() } });

  App.menus.settings = menu;

  App.ui.settingsTray = new SettingsTray({ el: document.getElementById('settings-tray') });
  App.ui.settingsTray.on('settings', (component) => {
    let bounds = component.el.getBoundingClientRect();
    showMenu(App.menus.settings, bounds.left, bounds.top + component.el.offsetHeight + 10 * App.unit);
  });
  App.ui.frameListTray = new FrameListTray({ el: document.getElementById('frame-list-tray') });
  App.ui.frameListTray.on('first', () => {
    App.first();
  });
  App.ui.frameListTray.on('new', () => {
    App.newFrame();
  });
  App.ui.frameListTray.on('duplicate', () => {
    App.duplicateFrame();
  });
  App.ui.frameListTray.on('last', () => {
    App.last();
  });
  App.ui.frameListTray.on('select', (index) => {
    App.go(index);
  });

  App.frameList = App.ui.frameListTray.getByName('frameList');

  App.ui.playbackOptionsTray = new PlaybackOptionsTray({ el: document.getElementById('playback-options-tray') });
  App.ui.playbackOptionsTray.on('onion', (component) => {
    App.onion = !App.onion;
    component.setState(App.onion);
    App.render();
  });
  App.ui.playbackOptionsTray.on('loop', (component) => {
    App.loop = !App.loop;
    component.setState(App.loop);
    App.render();
  });
  App.ui.playbackOptionsTray.on('fps', (component) => {
    let fps = parseInt(component.value);
    if (Number.isInteger(fps) && fps >= 1 && fps <= 60) {
      App.setFps(fps);
    } else {
      component.value = App.fps;
    }
  });

  nativeMenu.show();

  App.new();

  App.ui.main.show();

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
