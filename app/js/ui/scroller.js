const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');

function Scroller(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('scroller');

  this.grabber = new Base({ style: { position: 'absolute', height: '3px' } });
  this.grabber.addClass('grabber');
  this.add(this.grabber);

  this.page = 0;
  this.total = 0;
  this.offset = 0;
}

Scroller.prototype = Object.create(Container.prototype);
Scroller.prototype.constructor = Scroller;

Scroller.prototype.adjust = function(params) {
  // console.log(params);
  // console.log('adjust');

  this.offset = params.offset ? params.offset : this.offset;
  this.page = params.page ? params.page : this.page;
  this.total = params.total ? params.total : this.total;

  var width = ((this.page / this.total) * this.el.offsetWidth) >> 0;
  this.grabber.el.style.width = width + 'px';

  // console.log(this.page, this.total, this.offset);
  // this.grabber.el.left = ((this.el.offsetWidth * this.offset) >> 0) + 'px';
  // console.log(width);
}

module.exports = Scroller;
