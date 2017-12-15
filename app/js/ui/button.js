const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Container {
  constructor(el) {
    super(el);

    this.state = false;
    this.onPress = undefined;

    this.el.addEventListener('mousedown', this);

    // this.el.addEventListener('mouseup', this);
    // this.el.addEventListener('mouseout', this);
    // this.el.addEventListener('mouseover', this);
  }

  setState(state) {
    if (state) {
      if (!this.state) this.addClass('selected');
    } else {
      if (this.state) this.removeClass('selected');
    }
    this.state = state;
  }

  endCapture() {
    window.removeEventListener('mouseup', this);
    window.removeEventListener('blur', this);
  }

  onBlur(event) {
    this.endCapture();
  }

  onMouseDown(event) {
    // console.log('down');
    this.addClass('selected');
    window.addEventListener('mouseup', this);
    window.addEventListener('blur', this);
  }

  onMouseUp(event) {
    // console.log('up');
    this.removeClass('selected');
    if (event.target === this.el && this.onPress) {
      this.onPress(this);
    }
    this.endCapture();
  }

  onMouseOut(event) {
    // if (app.mouseDownTargetTag) {
    //   if (app.mouseDownTargetTag === this.tag) {
    //     this.removeClass('selected');
    //   }
    // } else {
    // }
    this.removeClass('hover');
  }

  onMouseOver(event) {
    // if (app.mouseDownTargetTag) {
    //   if (app.mouseDownTargetTag === this.tag) {
    //     this.addClass('selected');
    //   }
    // } else {
    // }
    this.addClass('hover');
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
