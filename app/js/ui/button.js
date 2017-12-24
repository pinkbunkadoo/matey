const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Container {
  constructor(params={}) {
    super(params);

    this.text = null;
    this.type = null;
    this.svg = null;

    if (params.fromDOMElement) {
      if (this.el.firstElementChild === null) {
        this.text = this.el.innerHTML;
        this.type = 'text';
      } else {
        if (this.el.firstElementChild instanceof SVGSVGElement) {
          this.svg = this.el.firstElementChild;
          this.type = 'svg';
        }
      }
    } else {
      this.type = params.type;
      this.text = params.text;
      this.svg = params.svg;

      // let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
      // svg.classList.add('icon');
      //
      // let svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      // svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.resource);
      // svg.appendChild(svguse);
    }

    if (this.text) {
      this.addClass('text');
    }

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
    app.capture(this, true);
  }

  onMouseUp(event) {
    if (this.getBounds().containsPoint(app.cursorX, app.cursorY)) {
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

  static fromDOMElement(el) {
    // let type = null;
    // let text = null;
    // let svg = null;
    // if (el.firstElementChild === null) {
    //   text = el.innerHTML;
    // } else {
    //   if (el.firstElementChild instanceof SVGElement) {
    //     type = 'svg';
    //     svg = el.firstElementChild;
    //   }
    // }
    // let button = new Button({ type: type, text: text, svg: svg, el: el });
    // // button.el = el;
    // // console.log('Button.fromDOMElement', type);
    // return button;
    return null;
  }
}

module.exports = Button;
