
function Pencil() {
  Tool.call(this, 'pencil');
  this.points = [];
}

Pencil.prototype = Object.create(Tool.prototype);
Pencil.prototype.constructor = Pencil;

Pencil.prototype.draw = function(ctx) {
  if (this.points) {
    app.createPath(ctx, this.points);
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  }
}

Pencil.prototype.onMouseMove = function(event) {
  if (event.buttons == 1) {
    var p = app.screenToWorld(app.mouseX, app.mouseY);
    this.points.push(p);
  }
}

Pencil.prototype.onMouseOut = function(event) {}

Pencil.prototype.onMouseOver = function(event) {}

Pencil.prototype.onMouseDown = function(event) {
  this.points = [ app.screenToWorld(app.startX, app.startY) ];
}

Pencil.prototype.onMouseUp = function(event) {
  if (this.points.length > 2) {
    this.points = Stroke.smooth(this.points);
    this.points = simplify(this.points, 0.5);
    var stroke = new Stroke(this.points);
    app.addStroke(stroke);
    // console.log(stroke);
  }
  this.points = [];
}
