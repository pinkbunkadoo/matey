const Util = require('../util');
const Const = require('../const');
const Base = require('./base');
const Label = require('./label');
const Spacer = require('./spacer');
const Graphic = require('./graphic');
const Container = require('./container');
const ToolButton = require('./tool_button');

function Status(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('status');

  this.view = new Container({ style: { flexDirection: 'row', alignItems: 'center', flex: 'auto' }});

  this.zoom = new Label({ title: 'zoom', style: { width: '3em' } });
  this.view.add(this.zoom);

  this.view.add(new Spacer({ width: 20, height: 20 }));

  var self = this;

  // var button = new ToolButton({ image: 'onion', width: 24, height: 20 });
  // button.onPress = function(button) {
  //   button.setState(!button.state);
  //   self.emit('onion', { value: button.state });
  // };
  // this.view.add(button);

  // this.frame = new Label({ title: 'frame', style: { fontSize: '13px', flex: 'auto' } });

  // this.frameButtons = new Container({ style: { flexDirection: 'row' } });
  //
  // var button = new ToolButton({ image: 'new', width: 24, height: 20 });
  // button.onPress = (function() {
  //   // app.sequence.insert(new Frame(), app.sequence.position);
  //   // app.sequence.go(app.sequence.position);
  // });
  // this.frameButtons.add(button);
  //
  // var button = new ToolButton({ image: 'copy', width: 24, height: 20 });
  // button.onPress = (function() {
  //   // app.sequence.insert(app.sequence.frame.copy(), app.sequence.position + 1);
  // });
  // this.frameButtons.add(button);
  //
  // var button = new ToolButton({ image: 'delete', width: 23, height: 20 });
  // button.onPress = (function() {
  //   // var position = app.sequence.position;
  //   // app.sequence.remove();
  //   // if (position >= app.sequence.frames.length)
  //   //   app.sequence.end();
  //   // else
  //   //   app.sequence.go(position);
  //   // app.updateFrameList({ action: 'remove', index: position });
  // });
  // this.frameButtons.add(button);

  this.add(this.view);
  // this.add(this.frame);
  // this.add(this.frameButtons);
}

Status.prototype = Object.create(Container.prototype);
Status.prototype.constructor = Status;

Status.prototype.setZoom = function(value) {
  this.zoom.setTitle((value * 100) + '%');
}

Status.prototype.setFrame = function(value1, value2) {
  // this.frame.setTitle(value1 + ' / ' + value2);
}

Status.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    // this.onMouseDown(event);
  } else if (event.type == 'mouseup') {
    // this.onMouseUp(event);
  } else if (event.type == 'mousemove') {
    // this.onMouseMove(event);
  }
}

module.exports = Status;
