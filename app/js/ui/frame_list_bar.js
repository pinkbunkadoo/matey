const Container = require('./container');
const Spacer = require('./spacer');
const ToolButton = require('./tool_button');
const Button = require('./button');
const Label = require('./label');
const Divider = require('./divider');

function FrameListBar(params) {
  params = params || {};
  Container.call(this, params);

  var self = this;

  this.addClass('frame-list-bar');

  // this.frameButtons = new Container({ style: { flexDirection: 'row' } });
  var buttonWidth = 24, buttonHeight = 20;

  var button = new Button({ tag: 'frames_new', image: 'new', width: buttonWidth, height: buttonHeight });
  button.onPress = (function() {
    // app.sequence.insert(new Frame(), app.sequence.position);
    // app.sequence.go(app.sequence.position);
    self.emit('new-frame');
  });
  this.add(button);

  var button = new Button({ tag: 'frames_copy', image: 'copy', width: buttonWidth, height: buttonHeight });
  button.onPress = (function() {
    // self.emit(' ');
    // app.sequence.insert(app.sequence.frame.copy(), app.sequence.position + 1);
  });
  this.add(button);

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
  // this.frameButtons.add(button);
  this.add(button);

  // this.add(new Spacer({ width: 8 }));

  // this.add(this.frameButtons);

  this.add(new Divider({ orientation: 'vertical' }));

  // this.add(new Spacer({ width: 20 }));
  this.add(new Button({ tag: 'frames_first', image: 'first', width: buttonWidth, height: buttonHeight }));
  this.add(new Button({ tag: 'frames_play', image: 'play', width: buttonWidth, height: buttonHeight }));
  this.add(new Button({ tag: 'frames_last', image: 'last', width: buttonWidth, height: buttonHeight }));

  this.add(new Divider({ orientation: 'vertical' }));

  button = new Button({ tag: 'frames_loop', image: 'loop', width: buttonWidth, height: buttonHeight })
  this.add(button);
  button.onPress = function(button) {
    button.setState(!button.state);
    self.emit('loop', { value: button.state });
  };

  this.add(new Divider({ orientation: 'vertical' }));

  button = new Button({ tag: 'frames_onion', image: 'onion', width: buttonWidth, height: buttonHeight });
  button.onPress = function(button) {
    button.setState(!button.state);
    self.emit('onion', { value: button.state });
  };
  this.add(button);

  this.add(new Divider({ orientation: 'vertical' }));

  this.frame = new Label({ title: 'frame', style: { flex: 'auto' } });
  this.add(this.frame);

  this.add(new Spacer({width: 20}));

}

FrameListBar.prototype = Object.create(Container.prototype);
FrameListBar.prototype.constructor = FrameListBar;

FrameListBar.prototype.setFrame = function(value1, value2) {
  this.frame.setTitle(value1 + ' / ' + value2);
}


module.exports = FrameListBar;
