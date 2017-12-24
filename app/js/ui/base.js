// const Emitter = require('../emitter');
const EventEmitter = require('events').EventEmitter;

class Base extends EventEmitter {
  constructor(params={}) {
    super();
    if (params.fromDOMElement) {
        this.el = document.getElementById(params.id);
    } else {
      this.el = document.createElement('div');
      if (params.id) {
        this.id = params.id;
        this.el.id = this.id;
      }
      this.addClass('ui');
    }
  }

  addClass(className) {
    this.el.classList.add(className);
  }

  removeClass(className) {
    this.el.classList.remove(className);
  }

  getDOMElement() {
    return this.el;
  }

  setVisible(value) {
    this.el.style.visibility = value ? 'visible' : 'hidden';
  }

  isVisible() {
    return (this.el.style.visibility === 'visible');
  }

  handleEvent(event) {
  }

}

module.exports = Base;
