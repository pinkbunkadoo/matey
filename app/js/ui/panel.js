const Util = require('../util');
const Const = require('../const');
const Base = require('./base');
const Label = require('./label');
const Spacer = require('./spacer');
const Graphic = require('./graphic');
const Container = require('./container');

function Panel(params) {
  params = params || {};
  Container.call(this, params);

  this.title = params.title || '';
  this.addClass('panel');

  if (params.left) this.el.style.left = params.left + 'px';
  if (params.top) this.el.style.top = params.top + 'px';
  if (params.width) this.el.style.width = params.width + 'px';
  if (params.height) this.el.style.height = params.height + 'px';

  this.heading = new Container({ classes: ['panel-heading'] });
  this.heading.add(new Spacer({ width: 12, height: 20 }));
  this.heading.add(new Label({ title: this.title }));
  this.add(this.heading);

  this.pane = new Container({ style: { flexDirection: 'column', flex: 'auto' } });
  this.add(this.pane);
  this.add(new Spacer({ width: 4, height: 4 }));

  this.el.addEventListener('mousedown', this);

  this.grabbed = false;

  Panel.stack.push(this);
  // console.log('stack', Panel.stack.length);
}

Panel.prototype = Object.create(Container.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.setPane = function(content) {
  this.pane.removeAll();
  if (content) this.pane.add(content);
}

Panel.prototype.reposition = function() {
  var x = (this.el.offsetLeft);
  x = Util.clamp(x, 0, window.innerWidth - this.el.offsetWidth);
  var y = (this.el.offsetTop);
  y = Util.clamp(y, 0, window.innerHeight - this.el.offsetHeight);
  this.el.style.left = x + 'px';
  this.el.style.top = y + 'px';
}

Panel.prototype.onMouseMove = function(event) {
  if (event.buttons & 1 && this.grabbed) {
    event.preventDefault();

    if (!this.locked) {
      var x = (this.el.offsetLeft + event.movementX);
      var y = (this.el.offsetTop + event.movementY);

      this.el.style.left = x + 'px';
      this.el.style.top = y + 'px';
    }
  }
}

Panel.prototype.onMouseDown = function(event) {
  // console.log(event.target);
  if (event.buttons & 1 && (event.target.parentElement == this.el || event.target == this.el)) {
    this.grabbed = true;
    window.addEventListener('mouseup', this);
    window.addEventListener('mousemove', this);

    var index = Panel.stack.indexOf(this);
    if (index !== -1) {
      Panel.stack.splice(index, 1);
      Panel.stack.push(this);
      for (var i = 0; i < Panel.stack.length; i++) {
        Panel.stack[i].el.style.zIndex = i;
      }
    }

  }

}

Panel.prototype.onMouseUp = function(event) {
  event.preventDefault();
  this.grabbed = false;
  // console.log('up');
  this.reposition();

  window.removeEventListener('mouseup', this);
  window.removeEventListener('mousemove', this);
}


Panel.prototype.handleEvent = function(event) {
  if (event.type == 'mousedown') {
    this.onMouseDown(event);
  } else if (event.type == 'mouseup') {
    this.onMouseUp(event);
  } else if (event.type == 'mousemove') {
    this.onMouseMove(event);
  }
}

Panel.stack = [];

module.exports = Panel;
