const Emitter = require('../emitter');

function Base(params) {
  Emitter.call(this);

  params = params || {};

  this.name = params.name;

  this.el = document.createElement('div');

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

module.exports = Base;
