const Container = require('./container');
const ToolButton = require('./tool_button');
const Color = require('../color');
const ColorSwatch = require('./color_swatch');
const Spacer = require('./spacer');
const Divider = require('./divider');

function Tools() {
  Container.call(this);

  var self = this;
  this.buttons = [];

  this.addClass('tools-palette');

  var buttonContainer = new Container({ style: { flexDirection: 'column', alignItems: 'center' }});

  var button = new ToolButton({ tag: 'tools_pointer', image: 'pointer', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('pointer'); };
  buttonContainer.add(button);
  this.buttons['pointer'] = button;

  button = new ToolButton({ tag: 'tools_pen', image: 'pencil', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('pen'); };
  buttonContainer.add(button);
  this.buttons['pen'] = button;

  // button = new ToolButton({ image: 'pencil', width: 48, height: 36 });
  // button.onPress = function() { self._setToolNotify('pencil'); };
  // buttonContainer.add(button);
  // this.buttons['pencil'] = button;

  button = new ToolButton({ tag: 'tools_line', image: 'line', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('line'); };
  buttonContainer.add(button);
  this.buttons['line'] = button;

  button = new ToolButton({ tag: 'tools_polygon', image: 'polygon', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('polygon'); };
  buttonContainer.add(button);
  this.buttons['polygon'] = button;

  // button = new ToolButton({ image: 'knife', width: 48, height: 36 });
  // button.onPress = function() { self._setToolNotify('knife'); };
  // buttonContainer.add(button);
  // this.buttons['knife'] = button;

  button = new ToolButton({ tag: 'tools_zoom', image: 'zoom', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('zoom'); };
  buttonContainer.add(button);
  this.buttons['zoom'] = button;

  button = new ToolButton({ tag: 'tools_hand', image: 'hand', width: 48, height: 36 });
  button.onPress = function() { self.onToolSelect('hand'); };
  buttonContainer.add(button);
  this.buttons['hand'] = button;

  this.add(buttonContainer);

  this.add(new Divider({ orientation: 'horizontal', style: { width: '32px' } }))

  var colorContainer = new Container({ style: { justifyContent: 'center' }});

  this.strokeColor = new ColorSwatch({ tag: 'stroke_color', color: Color.Black });
  colorContainer.add(this.strokeColor);
  this.strokeColor.bind('color-change', function(color) {
    // self.emit()
  });

  colorContainer.add(new Spacer({ width: 3, height: 2 }));

  this.fillColor = new ColorSwatch({ tag: 'fill_color', color: Color.White });
  colorContainer.add(this.fillColor);

  this.add(colorContainer);
}

Tools.prototype = Object.create(Container.prototype);
Tools.prototype.constructor = Tools;

Tools.prototype.onToolSelect = function(name) {
  this.setTool(name);
  this.emit('tool-change', { tool: name });
}

Tools.prototype.setTool = function(name) {
  if (this.tool) {
    this.buttons[this.tool].setState(false);
  }
  this.tool = name;
  this.buttons[this.tool].setState(true);
}

Tools.prototype.getStrokeColor = function() {
  return this.strokeColor.getColor();
}

Tools.prototype.getFillColor = function() {
  return this.fillColor.getColor();
}

module.exports = Tools;
