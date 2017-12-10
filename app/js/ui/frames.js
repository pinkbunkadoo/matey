const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');
const Divider = require('./divider');
const Label = require('./label');
const Icon = require('./icon');
const Button = require('./button');
const Scroller = require('./scroller');

const FrameList = require('./frame_list');
const FrameListItem = require('./frame_list_item');
const Frame = require('../frame');

function Frames(params) {
  Container.call(this, params);

  var self = this;

  this.addClass('frames');

  this.width = params.width || 64;
  this.height = params.height || 36;

  this.items = [];
  this.selection = null;

  // this.mainContainer = new Container();
  // this.mainContainer.addClass('frames');

  this.inner = new Container();
  this.inner.addClass('frames-inner');

  this.frameList = new FrameList({ tag: 'frame-list', width: this.width, height: this.height });
  this.frameList.bind('select', function(params) {
    self.emit('select', params);
  });
  // this.inner.add(this.frameList);

  temp = new Container({ style: { background: 'pink', flex: 'auto', height: '20px' } });
  this.inner.add(temp);

  temp = new Container({ style: { background: 'purple', width: '20px', height: '20px' } });
  this.inner.add(temp);


  this.frameListNew = new Container({tag: 'frames-new' });
  this.frameListNew.addClass('frame-list-new');

  this.icon = new Icon({ resource: 'plus', width: app.icons['plus'].width, height: app.icons['plus'].width, invert: true });
  this.frameListNew.add(this.icon);

  this.frameListNew.el.onclick = function(event) {
    // console.log('click');
    self.emit('new');
  }

  this.add(this.inner);

  // this.add(this.frameListNew);

  // this.mainContainer.add(this.inner);

  this.buttonsContainer = new Container();
  this.buttonsContainer.addClass('frames-buttons');

  var buttonWidth = 24, buttonHeight = 20;

  var button = new Button({ tag: 'frames_new', image: 'new', width: buttonWidth, height: buttonHeight });
  button.onPress = (function() {
    // app.sequence.insert(new Frame(), app.sequence.position);
    // app.sequence.go(app.sequence.position);
    self.emit('new-frame');
  });
  // this.add(button);

  var button = new Button({ tag: 'frames_copy', image: 'copy', width: buttonWidth, height: buttonHeight });
  button.onPress = (function() {
    // self.emit(' ');
    // app.sequence.insert(app.sequence.frame.copy(), app.sequence.position + 1);
  });
  // this.add(button);

  var button = new Button({ tag: 'frames_delete', image: 'trash', width: buttonWidth, height: buttonHeight });
  button.onPress = (function() {
    self.emit('remove-frame');
    // var position = app.sequence.position;
    // app.sequence.remove();
    // if (position >= app.sequence.frames.length)
    //   app.sequence.end();
    // else
    //   app.sequence.go(position);
    // app.updateFrameList({ action: 'remove', index: position });
  });
  // this.add(button);

  // this.add(new Divider({ orientation: 'vertical' }));

  this.buttonsContainer.add(new Button({ tag: 'frames_first', image: 'first', width: buttonWidth, height: buttonHeight }));
  this.buttonsContainer.add(new Button({ tag: 'frames_play', image: 'play', width: buttonWidth, height: buttonHeight }));
  this.buttonsContainer.add(new Button({ tag: 'frames_last', image: 'last', width: buttonWidth, height: buttonHeight }));

  this.buttonsContainer.add(new Divider({ orientation: 'vertical', style: { height: '10px' } }));

  button = new Button({ tag: 'frames_loop', image: 'loop', width: buttonWidth, height: buttonHeight })
  button.onPress = function(button) {
    button.setState(!button.state);
    self.emit('loop', { value: button.state });
  };
  this.buttonsContainer.add(button);

  this.buttonsContainer.add(new Divider({ orientation: 'vertical', style: { height: '10px' } }));

  button = new Button({ tag: 'frames_onion', image: 'onion', width: buttonWidth, height: buttonHeight });
  button.onPress = function(button) {
    button.setState(!button.state);
    self.emit('onion', { value: button.state });
  };
  this.buttonsContainer.add(button);

  this.buttonsContainer.add(new Divider({ orientation: 'vertical', style: { height: '10px' } }));

  this.frameIndicator = new Label({ title: 'frame', style: { flex: 'auto' } });
  this.buttonsContainer.add(this.frameIndicator);

  this.add(this.buttonsContainer);

  // this.add(this.mainContainer);

  this.grab = false;
}

Frames.prototype = Object.create(Container.prototype);
Frames.prototype.constructor = Frames;

Frames.prototype.addFrame = function() {
}

Frames.prototype.insertFrame = function(index) {

}

Frames.prototype.removeFrame = function(index) {
}

Frames.prototype.removeAll = function() {
}

Frames.prototype.get = function(index) {
}

Frames.prototype.select = function(index) {
}

Frames.prototype.adjust = function(params) {
}

Frames.prototype.render = function(params) {

  if (params.cmd === 'select') {
    // this.select(params.index);
    this.frameList.select(params.index);
  }
  else if (params.cmd === 'frameAdd') {
    // this.addFrame();
    this.frameList.addFrame();
  }
  else if (params.cmd === 'frameInsert') {
    // this.insertFrame(params.index);
    this.frameList.insertFrame(params.index);
  }
  else if (params.cmd === 'frameRemove') {
    // this.removeFrame(params.index);
    this.frameList.removeFrame(params.index);
  }
  else if (params.cmd === 'removeAll') {
    // this.removeAll();
    this.frameList.removeAll();
  }
  else if (params.cmd === 'update') {
    this.frameIndicator.setTitle(params.index + ' / ' + params.total);
    // FrameListBar.prototype.setFrame = function(value1, value2) {
    //   this.frame.setTitle(value1 + ' / ' + value2);
    // }
  }
}

Frames.prototype.onMouseDown = function(event) {
}

Frames.prototype.onMouseUp = function(event) {
}

Frames.prototype.onMouseMove = function(event) {
}

Frames.prototype.onWheel = function(event) {
}

Frames.prototype.handleEvent = function(event) {
  // if (event.type == 'mousedown') {
  //   console.log('mousedown');
  //   this.onMouseDown(event);
  // }
  // else if (event.type == 'mouseup') {
  //   this.onMouseUp(event);
  // }
  // else if (event.type == 'mousemove') {
  //   this.onMouseMove(event);
  // }
  // else if (event.type == 'wheel') {
  //   this.onWheel(event);
  // }
  // else if (event.type == 'resize') {
  //   // this.onResize(event);
  // }
}


module.exports = Frames;
