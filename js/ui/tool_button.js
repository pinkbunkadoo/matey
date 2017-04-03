
var Loader = require('../loader/loader.js');

function ToolButton(url) {
  this.el = document.createElement('div');
  this.el.style.width = '40px';
  this.el.style.height = '32px';
  this.el.style.borderRadius = '4px';
  this.el.style.boxSizing = 'border-box';
  // this.el.style.border = '1px solid black';
  this.el.style.display = 'flex';
  this.el.style.alignItems = 'center';
  this.el.style.justifyContent = 'center';

  // this.image = new Image();
  // this.image.src = url;
  // this.image.ondragstart = function() { return false; };
  // this.image.style.pointerEvents = 'none';
  this.container = document.createElement('div');
  this.container.style.display = 'flex';
  this.container.style.alignItems = 'center';
  this.container.style.justifyContent = 'center';
  this.container.style.pointerEvents = 'none';
  Loader.load(url, this.onLoad.bind(this));

  this.url = url;
  this.state = false;

  this.el.appendChild(this.container);

  var self = this;

  this.el.onmouseover = function(event) {
    // if (event.buttons == 0 && self.state == false) {
    if (self.state == false && !app.downTarget) {
      event.target.style.border = '1px solid gray';
      event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
  }

  this.el.onmouseout = function(event) {
    event.target.style.border = 'unset';
    if (self.state == false) {
      event.target.style.backgroundColor = 'unset';
    }
  }

  this.el.onmousedown = function(event) {
    self.onMouseDown ? self.onMouseDown() : null;
  }
}

ToolButton.prototype.constructor = ToolButton;

ToolButton.prototype.getElement = function() {
  return this.el;
}

ToolButton.prototype.setState = function(state) {
  this.state = state;
  if (state) {
    this.el.style.backgroundColor = 'white';
    this.el.style.border = 'unset';
  } else {
    this.el.style.backgroundColor = 'unset';
  }
}

ToolButton.prototype.onLoad = function(event) {
  // this.container.innerHTML = event.target.responseText;
  this.container.appendChild(event.target.responseXML.documentElement);
}

module.exports = ToolButton;
