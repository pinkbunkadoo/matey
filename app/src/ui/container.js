const Base = require('./base');

class Container extends Base {
  constructor(params={}) {
    super(params);
    this.addClass('container');
    this.children = [];
  }

  addDomElement(element) {
    if (!this.el.contains(element)) this.el.appendChild(element);
  }

  removeDomElement(element) {
    if (this.el.contains(element)) this.el.removeChild(element);
  }

  add(child) {
    this.children.push(child);
    this.addDomElement(child.el);
  }

  insert(index, child) {
    var before = this.children[index];
    this.children.splice(index, 0, child);
    if (before) {
      this.el.insertBefore(child.el, before.el);
    } else {
      this.el.appendChild(child.el);
    }
  }

  remove(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
      this.removeDomElement(child.el);
      this.children.splice(index, 1);
    }
  }

  get(index) {
    return this.children[index];
  }

  getByName(name) {
    for (var i = 0; i < this.children.length; i++) {
      let child = this.children[i];
      if (child.name === name) {
        return child;
      }
      else if (child instanceof Container) {
        let found = child.getByName(name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // getComponentById(id) {
  //   let component = this.el.querySelector('#' + id);
  //   return component;
  // }

  removeAll() {
    // console.log('clear', this.children);
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      this.el.removeChild(child.el);
      // console.log('removeChild', i);
    }
    this.children = [];
  }
}

module.exports = Container;
