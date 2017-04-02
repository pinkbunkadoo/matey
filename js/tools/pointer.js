
function Pointer() {
  Tool.call(this, 'pointer');
}

Pointer.prototype = Object.create(Tool.prototype);
Pointer.prototype.constructor = Pointer;

Pointer.prototype.onMouseDown = function(event) {
  if (app.highlighted) {
    app.addSelection(app.highlighted);
  }
}
