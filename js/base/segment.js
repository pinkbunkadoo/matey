
var Segment = function(point) {
  this.point = point;
}

Segment.prototype.constructor = Segment;

Segment.prototype = {
  copy: function() {
    return new Segment(this.point.copy());
  }
}
