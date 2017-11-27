const Base = require('./base');
const Container = require('./container');

function List(params) {
  Container.call(this, params);
  this.el.classList.add('list');
  this.selection = null;

  this.onSelect = params.onSelect;

  this.el.addEventListener('mousedown', this);
  this.el.addEventListener('wheel', this);
}

List.prototype = Object.create(Container.prototype);
List.prototype.constructor = List;

List.prototype.addItem = function(item) {
  this.add(item);
}

List.prototype.insertItem = function(index, item) {
  this.insert(index, item);
}

List.prototype.select = function(index) {
  // console.log('List.prototype.select', index);
  var item = this.get(index);
  if (this.selection) {
    this.selection.deselect();
  }
  item.select();
  this.selection = item;

  if (item.el.offsetTop + item.el.offsetHeight > this.el.scrollTop + this.el.offsetHeight) {
    this.el.scrollTop = item.el.offsetTop + item.el.offsetHeight - this.el.offsetHeight;
  }
  else if (item.el.offsetTop < this.el.scrollTop) {
    this.el.scrollTop = item.el.offsetTop;
  }
}

List.prototype.removeItem = function(index) {
}

List.prototype.onMouseDown = function(event) {
  var target = event.target;
  if (target === this.el || target.parentElement === this.el) {
    this.grabbed = true;
    window.addEventListener('mousemove', this);
    window.addEventListener('mouseup', this);
    if (target.classList.contains('list-item')) {
      // console.log(target.data);
      // var data = target.data;
      // var old = this.selection;
      // this.select(parseInt(data));
      if (this.onSelect) {
        this.onSelect({ item: this.get(target.data), current: this.selection });
      }
    }
  }
}

List.prototype.onMouseMove = function(event) {
}

List.prototype.onMouseUp = function(event) {
  if (this.grabbed) {
    window.removeEventListener('mousemove', this);
    window.removeEventListener('mouseup', this);
    this.grabbed = false;
  }
}

List.prototype.onWheel = function(event) {
  var target = event.target;
  if (target === this.el || target.parentElement === this.el) {
    var amount = event.deltaY / Math.abs(event.deltaY);
    if (amount > 0) {
      this.el.scrollTop = this.el.scrollTop + 16;
    } else {
      this.el.scrollTop = this.el.scrollTop - 16;
    }
  }
}

List.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type == 'mousemove') {
    this.onMouseMove(event);
  }
  else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type == 'wheel') {
    this.onWheel(event);
  }
}

module.exports = List;
