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

  // this.number = new Label({ title: 0, style: {  position: 'absolute', paddingTop: '2px', paddingLeft: '2px' } });
  // this.number = new Label({ title: 0, style: { top: '-14px', position: 'relative', paddingTop: '2px', paddingLeft: '2px' } });

  this.numberContainer = new Container({ style: { position: 'absolute', boxSizing: 'border-box', width: this.width + 'px', height: this.height + 'px' }});
  this.number = new Label({ title: 0, style: { position: 'absolute', padding: '4px' } });
  this.numberContainer.add(this.number)
  this.add(this.numberContainer);
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
  this.number.el.style.background = 'dodgerblue';
  this.number.el.style.color = 'white';
  this.numberContainer.el.style.border = '3px solid dodgerblue'
  // this.highlight.el.style.opacity = 1;
}


FrameListItem.prototype.deselect = function() {
  this.number.el.style.background = 'rgba(0,0,0,0)';
  this.number.el.style.color = 'gray';
  this.numberContainer.el.style.border = '3px solid rgba(0,0,0,0)'
  // this.highlight.el.style.opacity = 1;
}

module.exports = FrameListItem;
