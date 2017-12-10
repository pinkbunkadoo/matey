const Graphic = require('./graphic');
const Container = require('./container');
const Label = require('./label');
const Spacer = require('./spacer');

function FrameListItem(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('frame-list-item');

  this.width = params.width || 64;
  this.height = params.height || 40;

  // this.height = this.height + 16;
  // this.add(new Spacer({ width: this.width, height: 6 }));
  // console.log(this.height);

  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';
  this.el.style.background = 'yellow';

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  // this.canvas.style.pointerEvents = 'none';

  this.graphic = new Graphic({ image: this.canvas });
  // this.graphic.el.style.pointerEvents = 'none';
  // this.add(this.graphic);

  // this.numberContainer = new Container({ style: { boxSizing: 'border-box', width: this.width + 'px', height: this.height + 'px', borderRadius: '4px' }});
  this.numberContainer = new Container({ style: { position: 'absolute', pointerEvents: 'none' } });
  this.number = new Label({ title: 0, style: { padding: '4px 6px 4px 6px' } });
  this.numberContainer.add(this.number);
  this.add(this.numberContainer);

  // this.el.addEventListener('mousedown', function(event) {
  //   console.log('mousedown item');
  // });
}

FrameListItem.prototype = Object.create(Container.prototype);
FrameListItem.prototype.constructor = FrameListItem;

FrameListItem.prototype.setNumber = function(data) {
  this.el.dataset.index = data;
  this.number.setTitle(data);
}

FrameListItem.prototype.select = function() {
  this.number.el.style.background = 'dodgerblue';
  this.number.el.style.color = 'white';
  this.numberContainer.el.style.border = '0px solid dodgerblue'
  // this.highlight.el.style.opacity = 1;
}


FrameListItem.prototype.deselect = function() {
  this.number.el.style.background = 'rgba(0,0,0,0)';
  this.number.el.style.color = 'gray';
  this.numberContainer.el.style.border = '0px solid rgba(0,0,0,0)'
  // this.highlight.el.style.opacity = 1;
}

FrameListItem.prototype.handleEvent = function(event) {
  // console.log('handle');
  if (event.type === 'click') {
    // console.log('click');
    // this.emit('select', this);
  }
}

module.exports = FrameListItem;
