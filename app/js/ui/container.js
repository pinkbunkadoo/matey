const Base = require('./base');

function Container(params) {
  Base.call(this, params);
  this.addClass('container');
  this.children = [];
}

Container.prototype = Object.create(Base.prototype);
Container.prototype.constructor = Container;

Container.prototype.addDomElement = function(element) {
  this.el.appendChild(element);
}

Container.prototype.removeDomElement = function(element) {
  this.el.removeChild(element);
}

Container.prototype.add = function(child) {
  this.children.push(child);
  this.addDomElement(child.el);
}

Container.prototype.insert = function(index, child) {
  // console.log('insert', index);
  var before = this.children[index];
  // this.children.push(child);
  this.children.splice(index, 0, child);

  // console.log(index, child, this.children);

  if (before) {
    this.el.insertBefore(child.el, before.el);
  } else {
    this.el.appendChild(child.el);
  }
  // this.addDomElement(child.el);
}

Container.prototype.remove = function(child) {
  var index = this.children.indexOf(child);
  if (index !== -1) {
    this.removeDomElement(child.el);
    this.children.splice(index, 1);
  }
}

Container.prototype.get = function(index) {
  return this.children[index];
}


Container.prototype.getByName = function(name) {
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].name == name) {
      return this.children[i];
    }
  }
  return null;
}

Container.prototype.removeAll = function() {
  // console.log('clear', this.children);
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];
    this.el.removeChild(child.el);
    // console.log('removeChild', i);
  }
  this.children = [];
}


module.exports = Container;
