
function Fragment(stroke, start, end, inside) {
  // stroke in question
  this.stroke = (stroke == undefined ? null : stroke);
   // index of start and end of selection
  this.start = (start == undefined ? 0 : start);
  this.end = (end == undefined ? 0 : end);

  this.inside = (inside == undefined ? true : inside);
}

Fragment.prototype.constructor = Fragment;

Fragment.prototype = {
}

module.exports = Fragment;