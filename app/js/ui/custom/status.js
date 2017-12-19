const Util = require('../../util');
const Const = require('../../const');
const Base = require('../base');
const Label = require('../label');
const Spacer = require('../spacer');
const Graphic = require('../graphic');
const Container = require('../container');
const ToolButton = require('../tool_button');
const Button = require('../button');

function Status(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('status');
  // this.el.style.height = '31px';

  var self = this;

  this.view = new Container({ style: { flexDirection: 'row', alignItems: 'center', flex: 'auto' }});

  this.zoom = new Label({ title: 'zoom', style: { width: '3em' } });
  this.view.add(this.zoom);

  var button = new Button({ tag: 'status_center', label: 'C', height: 20 })
  button.onPress = function(button) {
    self.emit('center');
  };
  this.view.add(button);

  this.add(this.view);
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
