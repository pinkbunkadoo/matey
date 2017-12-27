const Base = require('./base');
const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Container {
  constructor(params={}) {
    super(params);

    if (params.id) {
      this.el.id = params.id;
    }

    this.text = params.text;
    this.svg = null;

    if (this.text) {
      this.el.innerHTML = this.text;
    } else {
      if (this.el.firstElementChild instanceof SVGSVGElement) {
        this.svg = this.el.firstElementChild;
      } else {
         if (this.el.textContent) {
           this.text = this.el.textContent;
         }
      }
    }

    this.addClass('button');

    this.state = false;

    this.el.addEventListener('click', this);
    this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('mouseup', this);
  }

  setState(state) {
    if (state != this.state) {
      this.state = state;
      this.update();
    }
  }

  update() {
    this.removeClass('pressed');
    if (this.state) {
      this.addClass('pressed');
    }
  }

  toggle() {
    this.setState(!this.state);
  }

  onClick(event) {
    // console.log('onClick', event.target);
    this.emit('pressed', this);
    this.update();
  }

  onMouseDown(event) {
    // console.log('onMouseDown', event.target);
    app.capture(this);
    // document.body.style.pointerEvents = 'none';
    // this.el.style.pointerEvents = 'auto';
  }

  onMouseUp(event) {
    // console.log('onMouseUp', event.target);
    // document.body.style.pointerEvents = 'initial';
    app.release(this);
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.onClick(event);
    }
    else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }

}

module.exports = Button;
