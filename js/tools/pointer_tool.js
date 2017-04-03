var Tool = require('./tool.js');

function PointerTool() {
  Tool.call(this, 'pointer');
}

PointerTool.prototype = Object.create(Tool.prototype);
PointerTool.prototype.constructor = PointerTool;

PointerTool.prototype.onMouseDown = function(event) {
  if (app.highlighted) {
    // if (event.altKey) {
    //   app.removeSelection(app.highlighted);
    // } else {
      // app.addSelection(app.highlighted);
    // }
    app.toggleSelection(app.highlighted);
  }
}

PointerTool.prototype.onMouseMove = function(event) {
  if (app.highlighted && event.buttons == 1) {
    if (event.altKey) {
      app.removeSelection(app.highlighted);
    } else {
      app.addSelection(app.highlighted);
    }
  }
}


module.exports = PointerTool;
