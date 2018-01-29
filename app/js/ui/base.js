const Rectangle = require('../geom/rectangle');
const EventEmitter = require('events').EventEmitter;

class Base extends EventEmitter {
  constructor(params={}) {
    super();

    if (params.el) {
      this.el = params.el;
    } else {
      this.el = document.createElement('div');
    }

    this.addClass('ui');
    this.name = params.name;
  }

  addClass(className) {
    if (this.el) this.el.classList.add(className);
  }

  removeClass(className) {
    if (this.el) this.el.classList.remove(className);
  }

  setStyle(options) {
    for (let property in options) {
      this.el.style[property] = options[property];
    }
  }

  getDOMElement() {
    if (this.el) return this.el;
  }

  setVisible(value) {
    if (this.el) this.el.style.visibility = value ? 'visible' : 'hidden';
  }

  getBounds() {
    if (this.el) {
      let rect = this.el.getBoundingClientRect();
      return new Rectangle(rect.left, rect.top, rect.width, rect.height);
    }
  }

  isVisible() {
    if (this.el) return (this.el.style.visibility == 'visible' || this.el.style.visibility == '');
  }

  show() {
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }

  handleEvent(event) {
  }
}

module.exports = Base;
