const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

function Button(params) {
  Container.call(this, params);

  this.addClass('button');

  this.image = params.image;
  this.text = params.label;

  this.width = params.width;
  this.height = params.height;
  this.toggle = params.toggle;
  this.state = false;

  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  if (this.image) {
    var scale = 1;
    // var w = (app.icons[this.image].width * scale) >> 0;
    // var h = (app.icons[this.image].height * scale) >> 0;
    var w = 16, h = 16;
    this.icon = new Icon({ resource: this.image, width: w, height: h });
    this.add(this.icon);

  } else if (this.text) {
    this.label = new Label({ title: this.text });
    this.add(this.label);
    this.el.style.paddingLeft = '8px';
    this.el.style.paddingRight = '8px';
  }

  this.onPress = params.onPress;
}

Button.prototype = Object.create(Container.prototype);
Button.prototype.constructor = Button;

Button.prototype.setState = function(state) {
  if (state) {
    if (!this.state) this.addClass('selected');
  } else {
    if (this.state) this.removeClass('selected');
  }
  this.state = state;
}

Button.prototype.onMouseDown = function(event) {
  this.addClass('selected');
}

Button.prototype.onMouseUp = function(event) {
  this.removeClass('selected');
  if (this.onPress) {
    this.onPress(this);
  }
}

Button.prototype.onMouseOut = function(event) {
  if (app.mouseDownTargetTag) {
    if (app.mouseDownTargetTag === this.tag) {
      this.removeClass('selected');
    }
  } else {
  }
  this.removeClass('hover');
}

Button.prototype.onMouseOver = function(event) {
  if (app.mouseDownTargetTag) {
    if (app.mouseDownTargetTag === this.tag) {
      this.addClass('selected');
    }
  } else {
  }
  this.addClass('hover');
}

Button.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type === 'mouseover') {
    this.onMouseOver(event);
  }
  else if (event.type === 'mouseout') {
    this.onMouseOut(event);
  }
}

module.exports = Button;
