const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');
const Divider = require('./divider');
const Label = require('./label');
const Icon = require('./icon');
const Button = require('./button');
const Scroller = require('./scroller');

const FrameListItem = require('./frame_list_item');
const Frame = require('../frame');

function FrameList(params) {
  Container.call(this, params);

  var self = this;

  // this.addClass('frame-list');

  this.width = params.width || 64;
  this.height = params.height || 40;

  this.items = [];
  this.selection = null;

  // this.frameListContainer = new Container();
  // this.frameListContainer.addClass('frame-list');

  this.container = new Container({ style: { flexDirection: 'row', pointerEvents: 'none' } });
  this.add(this.container);

  // this.add(this.frameListContainer);

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

  var item = this.selection;

  var width = this.container.el.scrollWidth;

  if (item.el.offsetLeft + item.el.offsetWidth > this.el.scrollLeft + this.el.offsetWidth) {
    this.el.scrollLeft = item.el.offsetLeft - this.el.offsetWidth + item.el.offsetWidth;

  } else if (item.el.offsetLeft < this.el.scrollLeft) {
    this.el.scrollLeft = item.el.offsetLeft;

  } else {
  }
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
  else if (params.cmd === 'update') {
    // this.frameIndicator.setTitle(params.index + ' / ' + params.total);

    // FrameListBar.prototype.setFrame = function(value1, value2) {
    //   this.frame.setTitle(value1 + ' / ' + value2);
    // }
  }

  // this.scroller.adjust({ page: this.el.offsetWidth, total: this.frameContainer.el.scrollWidth });
}

FrameList.prototype.onMouseDown = function(event) {
  var target = event.target;

  // console.log();
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
  // console.log('up');
  var target = event.target;

  if (this.grab) {

  } else {
    // var mx = app.mouseX - this.el.offsetLeft + this.frameListContainer.el.scrollLeft;
    var mx = app.mouseX - this.el.offsetLeft + this.el.scrollLeft;

    var index = Math.floor(mx / this.width);

    if (index < this.items.length) {
      // console.log(index);
      this.emit('select', { index: index });
    }
  }

  this.grab = false;
}

FrameList.prototype.onMouseMove = function(event) {
  if (this.grab) {
    this.el.scrollLeft -= event.movementX;
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
    // console.log('mousedown');
    this.onMouseDown(event);
  }
  else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type == 'mousemove') {
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
