
function Spacer(width, height) {
  this.el = document.createElement('div');
  this.el.style.width = (width ? width : 40) + 'px';
  this.el.style.height = (height ? height : 32) + 'px';
}

Spacer.prototype.constructor = Spacer;

Spacer.prototype.getElement = function() {
  return this.el;
}

module.exports = Spacer;
