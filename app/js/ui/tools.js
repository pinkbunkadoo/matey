const Container = require('./container');
const ToolButton = require('./tool_button');
// const Panel = require('../panel');
const Spacer = require('./spacer');

function Tools() {
  Container.call(this);

  this.addClass('tools');

  this.buttons = [];

  var buttonContainer = new Container({ style: { flexDirection: 'column', alignItems: 'center' }});

  // console.log(app.icons['pointer'].width);
  var self = this;

  var button = new ToolButton({ tag: 'tools_pointer', image: 'pointer', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('pointer'); };
  buttonContainer.add(button);
  this.buttons['pointer'] = button;

  button = new ToolButton({ tag: 'tools_pen', image: 'pencil', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('pen'); };
  buttonContainer.add(button);
  this.buttons['pen'] = button;

  // button = new ToolButton({ image: 'pencil', width: 48, height: 36 });
  // button.onPress = function() { self._setToolNotify('pencil'); };
  // buttonContainer.add(button);
  // this.buttons['pencil'] = button;

  button = new ToolButton({ tag: 'tools_line', image: 'line', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('line'); };
  buttonContainer.add(button);
  this.buttons['line'] = button;

  button = new ToolButton({ tag: 'tools_polygon', image: 'polygon', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('polygon'); };
  buttonContainer.add(button);
  this.buttons['polygon'] = button;

  // button = new ToolButton({ image: 'knife', width: 48, height: 36 });
  // button.onPress = function() { self._setToolNotify('knife'); };
  // buttonContainer.add(button);
  // this.buttons['knife'] = button;

  button = new ToolButton({ tag: 'tools_hand', image: 'hand', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('hand'); };
  buttonContainer.add(button);
  this.buttons['hand'] = button;


  button = new ToolButton({ tag: 'tools_zoom', image: 'zoom', width: 48, height: 36 });
  button.onPress = function() { self._setToolNotify('zoom'); };
  buttonContainer.add(button);
  this.buttons['zoom'] = button;

  this.add(buttonContainer);

  // this.panels.tools.add(buttonContainer);
  // this.setPane(buttonContainer);

  // this.tool = 'pointer';
}

Tools.prototype = Object.create(Container.prototype);
Tools.prototype.constructor = Tools;

Tools.prototype._setToolNotify = function(name) {
  this.setTool(name);
  this.emit('tool-change', { tool: name });
}

Tools.prototype.setTool = function(name) {
  if (this.tool) {
    this.buttons[this.tool].setState(false);
    // this.buttons[this.tool].removeClass('selected');
  }
  this.tool = name;
  // console.log(name);
  this.buttons[this.tool].setState(true);
  // this.buttons[this.tool].addClass('selected');
}

module.exports = Tools;
