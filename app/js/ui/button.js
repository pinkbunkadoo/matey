const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Container {
  constructor(el) {
    super(el);

    this.state = false;
    // this.callback = undefined;

    this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('mouseup', this);
    // this.el.addEventListener('mouseout', this);
    // this.el.addEventListener('mouseover', this);
  }

  setState(state) {
    if (state != this.state) {
      this.state = state;
      this.update();
    }
  }

  update() {
    this.removeClass('down');
    if (this.state) {
      this.addClass('down');
    }
  }

  toggle() {
    this.setState(!this.state);
  }

  onMouseDown(event) {
    app.capture(this);
  }

  onMouseUp(event) {
    if (event.target === this.el) {
      this.emit('pressed');
    }
    app.release(this);

    this.update();
  }

  onMouseOut(event) {
  }

  onMouseOver(event) {
  }

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
    else if (event.type === 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = Button;
