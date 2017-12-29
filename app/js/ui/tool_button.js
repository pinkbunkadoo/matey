const Container = require('./container');
const Button = require('./button');
const Icon = require('./icon');
const Label = require('./label');

class ToolButton extends Button {
  constructor(params={}) {
    // Button.call(this, params);
    super(params);
    this.addClass('tool');
  }

  // ToolButton.prototype = Object.create(Button.prototype);
  // ToolButton.prototype.constructor = ToolButton;

  onMouseDown(event) {
    this.emit('pressed');
    // this.addClass('down');
    // if (this.onPress) {
    //   this.onPress(this);
    //   console.log('down');
    // }
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

  // static fromDOMElement(el) {
  //   let type = null;
  //   let text = null;
  //   let svg = null;
  //   if (el.firstElementChild === null) {
  //     text = el.innerHTML;
  //   } else {
  //     if (el.firstElementChild instanceof SVGElement) {
  //       type = 'svg';
  //       svg = el.firstElementChild;
  //     }
  //   }
  //   let button = new ToolButton({ type: type, text: text, svg: svg });
  //   return button;
  // }

}

module.exports = ToolButton;
