const Container = require('./container');
const Icon = require('./icon');

function ToolButton(params) {
  Container.call(this, params);

  this.image = params.image;
  this.width = params.width;
  this.height = params.height;
  this.state = false;

  this.addClass('tool-button');

  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  if (this.image) {
    this.icon = new Icon({ resource: this.image, width: app.icons[this.image].width, height: app.icons[this.image].height });
    this.add(this.icon);
  }

  this.onPress = params.onPress;

  this.el.addEventListener('mousedown', this);
}

ToolButton.prototype = Object.create(Container.prototype);
ToolButton.prototype.constructor = ToolButton;

ToolButton.prototype.setState = function(state) {
  if (state) {
    if (!this.state) this.addClass('selected');
    // this.icon.setInvert(true);
  } else {
    if (this.state) this.removeClass('selected');
    // this.icon.setInvert(false);
  }
  this.state = state;
}

ToolButton.prototype.onMouseDown = function(event) {
  // event.preventDefault();
  // event.stopPropagation();
  // this.onPress ? this.onPress() : null;
  if (this.onPress) {
    this.onPress(this);
  }
}

ToolButton.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type === 'mouseover') {
    this.onMouseOver(event);
  }
  else if (event.type === 'mouseout') {
    this.onMouseOut(event);
  }
}

module.exports = ToolButton;
