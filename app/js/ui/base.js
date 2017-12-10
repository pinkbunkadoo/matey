const Emitter = require('../emitter');

function Base(params) {
  Emitter.call(this);

  params = params || {};

  this.name = params.name;

  this.el = document.createElement('div');

  if (params.tag) {
    this.el.dataset.tag = params.tag;
    this.tag = params.tag;
    app.registerTag({ tag: params.tag, control: this });

  } else if (params.id) {
    this.el.id = params.id;
    this.tag = params.id;
    app.registerTag({ tag: this.tag, control: this });
  }

  this.addClass('ui');

  if (params.style) {
    for (var i in params.style) {
      this.el.style[i] = params.style[i];
    }
  }

  if (params.classes) {
    for(var i in params.classes) {
      this.addClass(params.classes[i]);
    }
  }
}

Base.prototype = Object.create(Emitter.prototype);
Base.prototype.constructor = Base;

Base.prototype.addClass = function(className) {
  this.el.classList.add(className);
}

Base.prototype.removeClass = function(className) {
  this.el.classList.remove(className);
}

Base.prototype.setVisible = function(value) {
  this.el.style.visibility = value ? 'visible' : 'hidden';
}

Base.prototype.isVisible = function() {
  return (this.el.style.visibility === 'visible');
}

Base.prototype.handleEvent = function(event) {
}

module.exports = Base;
