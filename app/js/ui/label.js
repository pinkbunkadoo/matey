const Base = require('./base');

function Label(params) {
  Base.call(this, params);

  this.title = params.title;

  this.addClass('label');
  this.el.innerHTML = this.title;

  // this.el.style.padding = '4px';
  // this.el.style.pointerEvents = 'none';
  // console.log(this.el.style);
}

Label.prototype = Object.create(Base.prototype);
Label.prototype.constructor = Label;

Label.prototype.setTitle = function(title) {
  // console.log('serTitle', title);
  this.title = title;
  this.el.innerHTML = this.title;
}

module.exports = Label;
