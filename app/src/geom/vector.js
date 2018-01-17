
function Vector(x, y) {
  this.x = (x === undefined ? 0 : x);
  this.y = (y === undefined ? 0 : y);
}
Vector.prototype.constructor = Vector;


Vector.prototype.toString = function() {
  return "{" + this.x + "," + this.y + "}";
}


Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
}


Vector.prototype.add = function(vector) {
  this.x = this.x + vector.x;
  this.y = this.y + vector.y;
  return this;
}


Vector.prototype.divide = function(vector) {
  this.x = this.x / vector.x;
  this.y = this.y / vector.y;
  return this;
}


Vector.prototype.dot = function(vector) {
  return Vector.dot(this, vector);
}


Vector.prototype.equals = function(vector) {
  return this.x === vector.x && this.y === vector.y;
}


Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}


Vector.prototype.limit = function(max) {
  if (this.magnitude() > max) {
    this.normalize();
    this.scale(max);
  }
}


Vector.prototype.normalize = function() {
  var dot = this.x * this.x + this.y * this.y;
  if (dot > 0 && dot != 1) {
    var inverseLength = 1 / Math.sqrt(dot);
    this.x = this.x * inverseLength;
    this.y = this.y * inverseLength;
  }
  return this;
}


Vector.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
}


Vector.prototype.floor = function() {
  this.x = this.x >> 0;
  this.y = this.y >> 0;
  return this;
}



Vector.prototype.multiply = function(scalar) {
  this.x = this.x * scalar;
  this.y = this.y * scalar;
  return this;
}


Vector.prototype.subtract = function(vector) {
  this.x = this.x - vector.x;
  this.y = this.y - vector.y;
  return this;
}


Vector.prototype.rotate = function(deg) {
  var angle = deg * (Math.PI / 180);
  this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  this.y = this.y * Math.cos(angle) + this.x * Math.sin(angle);
}


Vector.add = function(a, b) {
  return new Vector(a.x + b.x, a.y + b.y);
}


Vector.divide = function(a, b) {
  return new Vector(a.x / b.x, a.y / b.y);
}


Vector.dot = function(a, b) {
  return (a.x * b.x + a.y * b.y);
}


Vector.normalize = function(vector) {
  var out = new Vector();
  var dot = vector.x * vector.x + vector.y * vector.y;
  if (dot > 0) {
    var inverseLength = 1 / Math.sqrt(dot);
    out.x = vector.x * inverseLength;
    out.y = vector.y * inverseLength;
  }
  return out;
}


Vector.multiply = function(vector, scalar) {
  return new Vector(vector.x * scalar, vector.y * scalar);
}


Vector.subtract = function(a, b) {
  return new Vector(a.x - b.x, a.y - b.y);
}


Vector.angleBetween = function(v1, v2) {
  var dot = v1.dot(v2);
  var mag = v1.magnitude() * v2.magnitude();
  // console.log('mag:', mag, dot);
  var theta = (mag != 0 ? Math.acos(dot / mag) : 0);
  if (isNaN(theta)) theta = 0;
  return theta;
}


module.exports = Vector;
