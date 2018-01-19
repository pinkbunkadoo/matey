const Color = require('../../color');
const Label = require('../label');
const Checkbox = require('../checkbox');
const Tray = require('../tray');
const Container = require('../container');
const Icon = require('../icon');
const Button = require('../button');
const ColorSwatch = require('../color_swatch');
const ColorPalette = require('../color_palette');

class ColorPaletteTray extends Tray {
  constructor(params={}) {
    super(params);

    // this.setTitle('Colors');

    // this.canvas = document.createElement('canvas');
    // this.canvas.width = 256 * App.unit;
    // this.canvas.height = 32 * App.unit;

    // this.canvasContainer = new Container();
    // this.canvasContainer.setStyle({
    //   height: this.canvas.height + 'px'
    // })
    // this.canvasContainer.addClass('color-ramp');
    //
    // this.canvasContainer.el.appendChild(this.canvas);
    //
    // this.container.add(this.canvasContainer);

    // this.okayButton = new Button({ text: 'Okay' });
    // this.container.add(this.okayButton);

    this.paletteContainer = new Container();

    this.palette = new ColorPalette();

    this.entries = [
      Color.Black,
      new Color(32, 32, 32),
      new Color(64, 64, 64),
      new Color(96, 96, 96),
      new Color(128, 128, 128),
      new Color(160, 160, 160),
      new Color(192, 192, 192),
      new Color(224, 224, 224),
      Color.White
    ];

    this.palette.addEntries(this.entries);
    this.paletteContainer.add(this.palette);

    this.container.add(this.paletteContainer);

    // this.okayButton = new Button({ resource: 'nullColor' });
    // this.paletteContainer.add(this.okayButton);


    this.index = 4;

    // this.draw();
  }

  draw() {
    // let ctx = this.canvas.getContext('2d');
    // let width = this.canvas.width;
    // let height = this.canvas.height;
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, width, height);
    //
    // let imageData = ctx.getImageData(0, 0, width, height);
    // let pixels = imageData.data;
    //
    // for (let y = 0; y < height; y++) {
    //   for (let v = 0, x = 0; x < width; x++) {
    //     let index = (y * width + x) * 4;
    //     pixels[index + 0] = (v * 32) >> 0;
    //     pixels[index + 1] = (v * 32) >> 0;
    //     pixels[index + 2] = (v * 32) >> 0;
    //     pixels[index + 3] = 255;
    //     if (x % 32 == 0) v++;
    //   }
    // }
    //
    // ctx.putImageData(imageData, 0, 0);
    //
    // if (this.index >= 0) {
    //   ctx.strokeStyle = 'white';
    //   ctx.fillStyle = 'black';
    //   ctx.beginPath();
    //   ctx.rect(this.index * 32 + 14, 14, 4, 4);
    //   ctx.stroke();
    //   ctx.fill();
    // }
  }

  setColor(index) {
    this.index = index;
  }

  onMouseDown(event) {
    this.emit('down', this);
  }

  handleEvent(event) {
    if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
  }
}

module.exports = ColorPaletteTray;
