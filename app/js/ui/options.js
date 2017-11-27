const Container = require('./container');
const ToolButton = require('./tool_button');

function Options(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('options');

}

Options.prototype = Object.create(Container.prototype);
Options.prototype.constructor = Options;

Options.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    // this.onMouseDown(event);
  } else if (event.type == 'mouseup') {
    // this.onMouseUp(event);
  } else if (event.type == 'mousemove') {
    // this.onMouseMove(event);
  }
}

module.exports = Options;
