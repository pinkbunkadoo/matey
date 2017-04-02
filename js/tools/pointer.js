var Tool = require('./tool.js');

function Pointer() {
  Tool.call(this, 'pointer');
}

Pointer.prototype = Object.create(Tool.prototype);
Pointer.prototype.constructor = Pointer;

Pointer.prototype.onMouseDown = function(event) {
  if (app.highlighted) {
    if (event.altKey) {
      app.removeSelection(app.highlighted);
    } else {
      app.addSelection(app.highlighted);
    }
  }
}

Pointer.prototype.onMouseMove = function(event) {
  if (app.highlighted && event.buttons == 1) {
    if (event.altKey) {
      app.removeSelection(app.highlighted);
    } else {
      app.addSelection(app.highlighted);
    }
  }
}


module.exports = Pointer;
