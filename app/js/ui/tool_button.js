const Container = require('./container');
const Button = require('./button');
const Icon = require('./icon');
const Label = require('./label');

class ToolButton extends Button {
  constructor(el) {
    // Button.call(this, params);
    super(el);
  }

  // ToolButton.prototype = Object.create(Button.prototype);
  // ToolButton.prototype.constructor = ToolButton;

  onMouseDown(event) {
    this.addClass('selected');
    if (this.onPress) {
      this.onPress(this);
    }
  }

  onMouseUp(event) {
  }

  // onMouseOver(event) {
  //   this.addClass('hover');
  // }
  //
  // onMouseOut(event) {
  //   this.removeClass('hover');
  // }

  handleEvent(event) {
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
}

module.exports = ToolButton;
