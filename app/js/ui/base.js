// const Emitter = require('../emitter');
const Rectangle = require('../geom/rectangle');
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

    this.bounds = new Rectangle();

    // this.el.onresize = (event) => {
    //   this.bounds.x = this.el.offsetLeft;
    //   this.bounds.y = this.el.offsetTop;
    //   this.bounds.width = this.el.offsetWidth;
    //   this.bounds.height = this.el.offsetHeight;
    // }
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

  getBounds() {
    let rect = this.el.getBoundingClientRect();
    return new Rectangle(rect.left, rect.top, rect.width, rect.height);
  }

  isVisible() {
    return (this.el.style.visibility === 'visible');
  }

  handleEvent(event) {
  }


}

module.exports = Base;
