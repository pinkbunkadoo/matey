const DisplayList = require('./display_list');
const Surface = require('./surface');

class Renderer {
  constructor() {
    this.displayList = new DisplayList();
  }

  constructPath(ctx, points, transform) {
    if (points.length) {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        let point = points[i], p;
        if (transform) {
          p = transform.apply(point);
        }
        i == 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
    }
  }

  renderPath(surface, points, params) {
    if (points.length) {
      let transform = params.transform;
      let scale = transform ? transform.scale : 1;

      let ctx = surface.getContext();
      ctx.save();

      ctx.lineWidth = params.thickness ? params.thickness * scale : App.lineWidth * scale;
      ctx.fillStyle = params.fill ? params.fill.toHexString() : 'transparent';
      ctx.strokeStyle = params.color ? params.color.toHexString() : 'transparent';

      if (params.dashed) {
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'lightgray';
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      this.constructPath(ctx, points, params.transform);

      if (params.opacity !== undefined) {
        ctx.globalAlpha = params.opacity;
      }
      ctx.fill();

      if (params.operation !== undefined)
        ctx.globalCompositeOperation = params.operation;
      else
        ctx.globalCompositeOperation = 'source-over';

      ctx.stroke();
      ctx.restore();
    }
  }

  renderDisplayItem(surface, item, transform=null) {
    let points = item.points;
    if (points.length) {
      this.renderPath(surface, points, {
        color: item.color, fill: item.fill,
        thickness: item.thickness, opacity: item.opacity,
        transform: item.transform || transform,
        operation: item.operation,
        dashed: item.dashed
      });
    }
  }

  renderToSurface(surface, transform) {
    for (let i = 0; i < this.displayList.items.length; i++) {
      let item = this.displayList.items[i];
      this.renderDisplayItem(surface, item, transform);
    }
  }

}

module.exports = Renderer;
