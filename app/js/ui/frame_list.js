const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');
const Scroller = require('./scroller');

const FrameListItem = require('./frame_list_item');
const Frame = require('../frame');

function FrameList(params) {
  Container.call(this, params);

  this.addClass('frame-list');

  this.width = params.width || 64;
  this.height = params.height || 36;

  // this.width = params.width || 48;
  // this.height = params.height || 27;

  this.items = [];
  this.selection = null;

  this.mainContainer = new Container();
  this.mainContainer.addClass('frame-list-main-container');

  this.container = new Container({ style: { border: '0px solid black', flexDirection: 'row', pointerEvents: 'none' } });

  // this.container.add(new Base({ style: { width: this.width + 'px', height: '6px' } }));
  // this.frameContainer = new Container({ style: { height: '70px' } } );
  // this.marker = new Base({ style: { position: 'absolute', background: 'dodgerblue', width: this.width + 'px', height: '6px' } });
  // this.frameContainer.add(this.marker);

  // this.container.add(this.frameContainer);

  this.mainContainer.add(this.container);

  // var self = this;

  // this.creator = new Container({ style: { minWidth: this.width + 'px', width: this.width + 'px', height: this.height + 'px' } });
  // this.creator.addClass('frame-list-item-create');
  // this.creator.el.onclick = function(event) {
  //   self.emit('create');
  // };
  // this.add(this.creator);
  // this.container.add(this.creator);
  this.add(this.mainContainer);


  // this.scroller = new Scroller({ style: { height: '12px' } });
  // this.add(this.scroller);

  // this.el.addEventListener('mousedown', this);
  // this.el.addEventListener('mousemove', this);
  // this.el.addEventListener('mouseup', this);
  // this.el.addEventListener('wheel', this);
  // window.addEventListener('resize', this);
  this.grab = false;
}

FrameList.prototype = Object.create(Container.prototype);
FrameList.prototype.constructor = FrameList;

// FrameList.prototype.notifyChange = function(params) {
//   if (this.onChange) {
//     this.onChange(params);
//   }
// }
//
FrameList.prototype.addFrame = function() {

  // this.container.remove(this.creator);

  var item = new FrameListItem({ width: this.width, height: this.height });
  this.items.push(item);
  // this.frameContainer.add(item);
  this.container.add(item);
  item.setNumber(this.items.length);

  // this.notifyChange({ type: 'insert', index: index });
  // this.container.add(this.creator);
}

FrameList.prototype.insertFrame = function(index) {

  // this.container.remove(this.creator);

  var item = new FrameListItem({ width: this.width, height: this.height });
  this.items.splice(index, 0, item);
  // this.frameContainer.insert(index, item);
  this.container.insert(index, item);
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].setNumber(i + 1);
  }

  // this.container.add(this.creator);
  // this.notifyChange({ type: 'insert', index: index });
}

FrameList.prototype.removeFrame = function(index) {
  // this.frameContainer.remove(this.items[index]);
  this.container.remove(this.items[index]);
  this.items.splice(index, 1);
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].setNumber(i + 1);
  }
  // this.notifyChange({ type: 'remove', index: index });
}

FrameList.prototype.removeAll = function() {
  this.clear();
  this.items = [];
  this.selection = null;
  // this.notifyChange({ type: 'insert', index: index });
}

FrameList.prototype.get = function(index) {
  return this.items[index];
}

FrameList.prototype.select = function(index) {
  // console.log('select', index);
  if (this.selection) {
    this.selection.removeClass('selected');
    this.selection.deselect();
  }

  this.selection = this.items[index];
  this.selection.addClass('selected');

  this.selection.select();

  // this.marker.el.style.top = (this.selection.el.offsetTop - this.marker.el.offsetHeight) + 'px';
  // this.marker.el.style.left = (this.selection.el.offsetLeft) + 'px';

  var item = this.selection;

  // var width = this.frameContainer.el.offsetWidth;
  var width = this.container.el.scrollWidth;
  // console.log(width);

  // console.log(width, el.offsetLeft);
  // console.log(item.el.offsetLeft, item.el.offsetWidth, this.container.el.scrollLeft);

  if (item.el.offsetLeft + item.el.offsetWidth > this.mainContainer.el.scrollLeft + this.mainContainer.el.offsetWidth) {
    // console.log('greater');
    // console.log(item.el.offsetLeft, item.el.offsetWidth, this.el.scrollLeft);
    // this.container.el.scrollLeft = 50;

    this.mainContainer.el.scrollLeft = item.el.offsetLeft;

    // this.container.el.scrollLeft = el.width - el.offsetLeft;
    // this.el.scrollLeft = el.offsetLeft + el.offsetWidth * 2 - width;
    // this.container.el.scrollLeft = el.offsetLeft + el.offsetWidth - width;
    // this.container.el.scrollLeft = el.offsetLeft;
    // console.log(el.offsetLeft);
    // this.el.scrollLeft = 50;
    // console.log('this.frameContainer.el.offsetWidth', this.frameContainer.el.offsetWidth);
    // console.log('this.el.offsetWidth', this.el.offsetWidth);
    // console.log('this.container.el.offsetWidth', this.container.el.offsetWidth);
  } else if (item.el.offsetLeft < this.mainContainer.el.scrollLeft) {
    // console.log('smaller');
    this.mainContainer.el.scrollLeft = item.el.offsetLeft;
    // this.el.scrollLeft = el.offsetLeft;
    // this.container.el.scrollLeft = el.offsetLeft;
  } else {
    // console.log('nothing');
  }

  // console.log(this.el.scrollLeft, el.offsetLeft);

  // this.frameContainer.el.scrollLeft = el.offsetLeft;
}

FrameList.prototype.adjust = function(params) {

  // this.scroller.adjust({ page: this.el.offsetWidth, total: this.frameContainer.el.scrollWidth });

  // console.log();
}

FrameList.prototype.render = function(params) {

  if (params.cmd === 'select') {
    this.select(params.index);
  }
  else if (params.cmd === 'frameAdd') {
    this.addFrame();
  }
  else if (params.cmd === 'frameInsert') {
    this.insertFrame(params.index);
  }
  else if (params.cmd === 'frameRemove') {
    this.removeFrame(params.index);
  }
  else if (params.cmd === 'removeAll') {
    this.removeAll();
  }

  // this.scroller.adjust({ page: this.el.offsetWidth, total: this.frameContainer.el.scrollWidth });
}

FrameList.prototype.onMouseDown = function(event) {
  var target = event.target;
  // console.log('down', target);

  // if (target === this.el) {
  //   console.log('down');
  //
  // } else if (target.data !== undefined) {
  //   this.emit('select', { index: parseInt(target.data) - 1 });
  // }

  // if (this.grab) {
  //
  // } else {
  //
  // }
}

FrameList.prototype.onMouseUp = function(event) {

  var target = event.target;
  // console.log('up');

  // console.log('up');

  if (this.grab) {

  } else {
    var mx = app.mouseX - this.el.offsetLeft + this.mainContainer.el.scrollLeft;
    // console.log(mx);
    // console.log();
    var index = Math.floor(mx / this.width);


    if (index < this.items.length) {
      // console.log(index+1);
      this.emit('select', { index: index });
    }
    // if (target.data !== undefined) {

    // }
  }

  this.grab = false;
  // console.log(this.grab);
}

FrameList.prototype.onMouseMove = function(event) {
  // console.log('onMouseMove');
  if (this.grab) {
    // console.log('grabbging');
    this.mainContainer.el.scrollLeft -= event.movementX;
  } else {
    if (app.mouseLeft) {
      if (Math.abs(app.mouseDownX - app.mouseX) > 3) {
        this.grab = true;
      }
    }
  }
}

FrameList.prototype.onWheel = function(event) {
  // if (event.deltaY > 0) {
  //   this.el.scrollLeft = this.el.scrollLeft + ((this.width * 0.5) >> 0);
  // } else {
  //   this.el.scrollLeft = this.el.scrollLeft - ((this.width * 0.5) >> 0);
  // }
}

FrameList.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type == 'mouseup') {
    // console.log('upup');
    this.onMouseUp(event);
  }
  else if (event.type == 'mousemove') {
    // console.log('upup');
    this.onMouseMove(event);
  }
  else if (event.type == 'wheel') {
    this.onWheel(event);
  }
  else if (event.type == 'resize') {
    // this.onResize(event);
  }
}


module.exports = FrameList;
