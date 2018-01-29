const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');
const Label = require('./label');

class ToolButton extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('tool-button');

    if (params.id) this.el.id = params.id;

    this.text = params.text;
    this.iconResourceName = params.resource;
    this.svg = null;

    if (!this.text) {
      if (this.el.firstChild instanceof SVGSVGElement) {
        this.icon = new Icon({ svg: this.el.firstChild });
        this.add(this.icon);
      } else {
        if (this.iconResourceName) {
          this.icon = new Icon({ resource: this.iconResourceName });
          this.add(this.icon);
        }
      }
    }

    this.state = false;

    params.width !== undefined ? this.el.style.width = params.width: null;
    params.height !== undefined ? this.el.style.height = params.height: null;

    this.el.addEventListener('mousedown', this);
  }

  setState(state) {
    if (state != this.state) {
      this.state = state;
      this.update();
    }
  }

  setIcon(resource) {
    // console.log('setIcon', resource);
    this.remove(this.icon);
    this.icon = new Icon({ resource: resource, color: 'white' });
    this.add(this.icon);
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
    // this.emit('click', this);
    // this.update();
  }

  onMouseDown(event) {
    this.emit('pressed', this);
  }

  onMouseUp(event) {
  }

  handleEvent(event) {
    if (event.type === 'click') {
      // this.onClick(event);
    }
    else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }

}

module.exports = ToolButton;
