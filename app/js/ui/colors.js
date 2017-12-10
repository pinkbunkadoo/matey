const Container = require('./container');
const ToolButton = require('./tool_button');
// const Panel = require('../panel');
const Spacer = require('./spacer');

function Colors() {
  Container.call(this);

  this.addClass('tools-palette');

  this.buttons = [];

  var container = new Container({ style: { flexDirection: 'column', alignItems: 'center' }});

  this.add(container);
}

Colors.prototype = Object.create(Container.prototype);
Colors.prototype.constructor = Colors;

module.exports = Tools;
