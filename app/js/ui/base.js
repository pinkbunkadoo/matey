// const Emitter = require('../emitter');
const EventEmitter = require('events').EventEmitter;

class Base extends EventEmitter {
  constructor(el) {
    super();

    // this.name = params.name;

    this.el = el ? el : document.createElement('div');

    // if (params.tag) {
    //   this.tag = params.tag;
    //   this.el.dataset.tag = this.tag;
    //   // app.registerTag({ tag: this.tag, control: this });
    //
    // } else if (params.id) {
    //   this.tag = params.id;
    //   this.el.dataset.tag = this.tag;
    //   this.el.id = this.tag;
    //   // app.registerTag({ tag: this.tag, control: this });
    // }

    this.addClass('ui');

    // if (params.style) {
    //   for (var i in params.style) {
    //     this.el.style[i] = params.style[i];
    //   }
    // }
    //
    // if (params.classes) {
    //   for(var i in params.classes) {
    //     this.addClass(params.classes[i]);
    //   }
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

  isVisible() {
    return (this.el.style.visibility === 'visible');
  }

  handleEvent(event) {
  }
}

module.exports = Base;
