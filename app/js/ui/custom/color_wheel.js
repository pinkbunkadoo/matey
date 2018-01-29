const Util = require('../../util');
const Color = require('../../color');
const Container = require('../container');

class ColorWheel extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('overlay');

    this.entries1 = [
      Color.fromHexString('#f63b52'),
      Color.fromHexString('#f63bad'),
      Color.fromHexString('#d73bd4'),
      Color.fromHexString('#ba3bfa'),
      Color.fromHexString('#5e3bfa'),
      Color.fromHexString('#1c3bfa'),
      Color.fromHexString('#1c84fa'),
      Color.fromHexString('#1ccffa'),
      Color.fromHexString('#1cf7fa'),
      Color.fromHexString('#20f5b0'),
      Color.fromHexString('#24ee62'),
      Color.fromHexString('#5ef852'),
      Color.fromHexString('#baf852'),
      Color.fromHexString('#f3f852'),
      Color.fromHexString('#f6cf52'),
      Color.fromHexString('#f68452'),
    ];

    this.entries2 = [
      Color.fromHexString('#ffffff'),
      Color.fromHexString('#dddddd'),
      Color.fromHexString('#bbbbbb'),
      Color.fromHexString('#999999'),
      Color.fromHexString('#777777'),
      Color.fromHexString('#555555'),
      Color.fromHexString('#333333'),
      Color.fromHexString('#000000'),
    ];

    this.entries2 = this.entries2.reverse();

    let width = 320 * App.unit;
    let height = 320 * App.unit;

    this.container = new Container();
    this.container.addClass('color-wheel');

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.outerRadius1 = width / 2 - 2;
    this.innerRadius1 = this.outerRadius1 - width / 8;
    this.outerRadius2 = this.innerRadius1 + 1;
    this.innerRadius2 = this.outerRadius2 - width / 8;
    this.nullRadius = (width / 2) * 0.2;

    this.container.el.appendChild(this.canvas);
    this.add(this.container);

    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('mousemove', this);

    this.callback = params.callback ? params.callback : null;
    this.draw();
  }

  drawRing(entries, outer, inner, left=0, top=0) {
    let RADIANS = Math.PI / 180;
    let width = outer * 2;
    let height = outer * 2;
    let count = entries.length;
    let step = (360 / count);

    let w2 = width / 2;
    let h2 = height / 2;

    let ctx = this.canvas.getContext('2d');
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let x = w2, y = 0;
    let px = w2, py = 0;

    ctx.save();

    ctx.translate(left, top);
    ctx.lineWidth = 1.5;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(w2, h2, outer, 0, Math.PI * 2, false);
    ctx.arc(w2, h2, inner, 0, Math.PI * 2, true);
    ctx.clip();

    let angle = (step) * RADIANS;

    for (var i = 0; i < count; i++) {
      x = (px * Math.cos(angle) - py * Math.sin(angle)) * 2;
      y = (px * Math.sin(angle) + py * Math.cos(angle)) * 2;

      ctx.strokeStyle = ctx.fillStyle = entries[i].toHexString();

      ctx.beginPath();
      ctx.moveTo(px + w2, py + h2);

      ctx.lineTo(x + w2, y + h2);
      ctx.lineTo(w2, h2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      px = x;
      py = y;
    }

    ctx.restore();
  }


  draw() {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let w2 = (this.canvas.width / 2);
    let h2 = (this.canvas.height / 2);

    this.drawRing(this.entries1, this.outerRadius1, this.innerRadius1, 2, 2);
    this.drawRing(this.entries2, this.outerRadius2, this.innerRadius2,
      (w2) - this.outerRadius2, (h2) - this.outerRadius2);

    // centre null circle

    ctx.fillStyle = 'gray';
    // ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    // ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w2, h2, this.nullRadius, 0, Math.PI * 2, false);
    ctx.fill();
    // ctx.stroke();

    // ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    // ctx.font = '10px sans-serif';
    // ctx.textBaseline = 'middle';
    // let text = 'None';
    // let tm = ctx.measureText(text);
    // ctx.fillText(text, w2 - tm.width/2, h2);

    // ctx.strokeStyle = ctx.fillStyle = 'rgb(80, 80, 80)';
    // ctx.lineWidth = 6;
    // ctx.beginPath();
    // ctx.arc(w2, h2, w2 * 0.06, 0, Math.PI * 2, false);
    // ctx.fill();

    ctx.lineCap = 'round';
    ctx.lineWidth = 8 * App.unit;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(w2 - w2 / 10, h2 - h2 / 10);
    ctx.lineTo(w2 + w2 / 10, h2 + h2 / 10);
    ctx.stroke();

  }

  colorFromPoint(x, y) {
    let angle = Math.atan2(y - this.canvas.height / 2, x - this.canvas.width / 2) * 180 / Math.PI;
    angle = (angle + 720) % 360;
    let d = Util.distance(this.canvas.width / 2, this.canvas.height / 2, x, y);
    let index;
    let color;
    if (d < this.outerRadius1 && d > this.innerRadius1) {
      // first tier
      index = ((angle / 360) * this.entries1.length) >> 0;
      color = this.entries1[index];
    } else if (d < this.outerRadius2 && d > this.innerRadius2) {
      //second tier
      index = ((angle / 360) * this.entries2.length) >> 0;
      color = this.entries2[index];
    } else if (d < this.nullRadius) {
      color = null;
    }
    return color;
  }

  setCallback(callback) {
    this.callback = callback;
  }

  show(x, y) {
    document.body.appendChild(this.el);
    this.container.setStyle({
      left: x + 'px',
      top: y + 'px'
    });
    window.addEventListener('resize', this);
    window.addEventListener('blur', this);
  }

  hide() {
    document.body.removeChild(this.el);
    window.removeEventListener('resize', this);
    window.removeEventListener('blur', this);
  }

  onMouseDown(event) {
    let color = this.colorFromPoint(event.offsetX, event.offsetY);
    if (color !== undefined) if (this.callback) this.callback(color);
    this.hide();
  }

  onMouseMove(event) {
    let color = this.colorFromPoint(event.offsetX, event.offsetY);
  }

  onResize(event) {
    this.hide();
  }

  onBlur(event) {
    this.hide();
  }

  handleEvent(event) {
    if (event.type == 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type == 'mousemove') {
      this.onMouseMove(event);
    }
    else if (event.type == 'resize') {
      this.onResize(event);
    }
    else if (event.type == 'blur') {
      this.onBlur(event);
    }
  }

}

module.exports = ColorWheel;
