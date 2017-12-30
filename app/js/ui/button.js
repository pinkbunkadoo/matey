const Base = require('./base');
const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Container {
  constructor(params={}) {
    params.el = params.el || document.createElement('button');
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

    if (this.text) {
      this.addClass('text');
    }

    this.el.style.width = params.width || this.el.style.width;
    this.el.style.height = params.height || this.el.style.height;

    // this.el.draggable = "true";
    // this.addClass('button');

    this.state = false;

    this.el.addEventListener('click', this);
    this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('drag', () => {
    //   console.log('drag');
    // });
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
    this.emit('click', this);
    this.update();
  }

  onMouseDown(event) {
    // app.capture(this);
    this.emit('down', this);
  }

  onMouseUp(event) {
    // app.release(this);
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
