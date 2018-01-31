
class Surface {
  constructor(params) {
    this.width = params.width || 0;
    this.height = params.height || 0;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  resize(width, height) {
    this.width = width || 0;
    this.height = height || 0;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  clear() {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fill(color) {
    var ctx = this.canvas.getContext('2d');
    color ? ctx.fillStyle = color.toHexString() : null;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getContext() {
    return this.canvas.getContext('2d');
  }
}

module.exports = Surface;
