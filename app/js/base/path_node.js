// var Rectangle = require('./Rectangle.js');

function PathNode(point, prev, next, friend) {
  this.point = point ? point : null;
  this.next = prev ? prev : null;
  this.prev = next ? next : null;
  this.friend = friend ? friend : null;
  this.color = 'red';
  this.visited = false;
}

PathNode.prototype.constructor = PathNode;

PathNode.prototype.toString = function() {
  return this.point.toString();
}

module.exports = PathNode;
