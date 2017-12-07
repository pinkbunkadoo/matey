const Graphic = require('./graphic');
const Container = require('./container');
const Label = require('./label');
const Spacer = require('./spacer');

function FrameListItem(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('frame-list-item');

  this.width = params.width || 64;
  this.height = params.height || 36;

  // this.height = this.height + 16;
  // this.add(new Spacer({ width: this.width, height: 6 }));
  // console.log(this.height);

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.canvas.style.pointerEvents = 'none';

  this.graphic = new Graphic({ image: this.canvas });
  this.graphic.el.style.pointerEvents = 'none';
  this.add(this.graphic);

  this.number = new Label({ title: 0, style: {  position: 'absolute', paddingTop: '2px', paddingLeft: '2px' } });
  // this.number = new Label({ title: 0, style: { top: '-14px', position: 'relative', paddingTop: '2px', paddingLeft: '2px' } });
  this.add(this.number);

  // this.highlight = new Container({ style: { position: 'absolute', boxSizing: 'border-box', border: '1px solid red', width: this.width + 'px', height: this.height + 'px' } });
  // this.highlight.el.style.opacity = 0;
  // this.add(this.highlight);

}

FrameListItem.prototype = Object.create(Container.prototype);
FrameListItem.prototype.constructor = FrameListItem;

FrameListItem.prototype.setNumber = function(data) {
  this.el.data = data;
  this.number.setTitle(data);
  // console.log('setNumber', data);
  // this.
}

FrameListItem.prototype.select = function() {
  // this.highlight.el.style.opacity = 1;
}

module.exports = FrameListItem;
