// const Emitter = require('../emitter');
const Rectangle = require('../geom/rectangle');
const EventEmitter = require('events').EventEmitter;

class Base extends EventEmitter {
  constructor(params={}) {
    super();

    if (params.el) {
      this.el = params.el;
    } else {
      this.el = document.createElement('div');
      // if (params.el) {
      //   this.el = params.el;
      // } else {
      //   if (params.id) this.el = document.getElementById(params.id);
      // }
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
    if (this.el) return (this.el.style.visibility === 'visible');
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
