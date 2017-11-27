const Container = require('./container');
const Spacer = require('./spacer');
const ToolButton = require('./tool_button');
const Label = require('./label');

function FrameListBar(params) {
  params = params || {};
  Container.call(this, params);

  var self = this;

  this.addClass('button-bar');

  this.frameButtons = new Container({ style: { flexDirection: 'row' } });

  var button = new ToolButton({ image: 'new', width: 24, height: 20 });
  button.onPress = (function() {
    // app.sequence.insert(new Frame(), app.sequence.position);
    // app.sequence.go(app.sequence.position);
    self.emit('new-frame');
  });
  this.frameButtons.add(button);

  var button = new ToolButton({ image: 'copy', width: 24, height: 20 });
  button.onPress = (function() {
    self.emit(' ');
    // app.sequence.insert(app.sequence.frame.copy(), app.sequence.position + 1);
  });
  this.frameButtons.add(button);

  var button = new ToolButton({ image: 'delete', width: 23, height: 20 });
  button.onPress = (function() {
    // var position = app.sequence.position;
    // app.sequence.remove();
    // if (position >= app.sequence.frames.length)
    //   app.sequence.end();
    // else
    //   app.sequence.go(position);
    // app.updateFrameList({ action: 'remove', index: position });
  });
  this.frameButtons.add(button);

  var button = new ToolButton({ image: 'onion', width: 24, height: 20 });
  button.onPress = function(button) {
    button.setState(!button.state);
    self.emit('onion', { value: button.state });
  };
  this.frameButtons.add(button);

  this.frame = new Label({ title: 'frame', style: { fontSize: '9px', flex: 'auto' } });

  this.add(this.frameButtons);
  this.add(new Spacer());
  this.add(this.frame);
}

FrameListBar.prototype = Object.create(Container.prototype);
FrameListBar.prototype.constructor = FrameListBar;

FrameListBar.prototype.setFrame = function(value1, value2) {
  this.frame.setTitle(value1 + ' / ' + value2);
}


module.exports = FrameListBar;
