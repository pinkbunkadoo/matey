const Color = require('../../color');
const Overlay = require('../overlay');
const Container = require('../container');
const Svg = require('../../svg');

class ColorPalette extends Overlay {
  constructor(params={}) {
    super(params);

    this.entries = [
      null,
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
      Color.fromHexString('#ffffff'),
      Color.fromHexString('#dddddd'),
      Color.fromHexString('#bbbbbb'),
      Color.fromHexString('#999999'),
      Color.fromHexString('#777777'),
      Color.fromHexString('#555555'),
      Color.fromHexString('#333333'),
      Color.fromHexString('#000000'),
    ];

    this.container = new Container();
    this.container.addClass('color-palette');

    for (var i = 0; i < this.entries.length; i++) {
      let el = document.createElement('div');
      el.classList.add('color-palette-swatch');
      el.dataset.index = i;
      let color = this.entries[i];
      if (color instanceof Color) {
        el.style.backgroundColor = color.toHexString();
      } else {
        el.style.backgroundColor = 'white';
        let svg = Svg.createElement({ type: 'svg', attributes: { width: '100%', height: '100%' } });
        let shape = Svg.createElement({ type: 'rect', attributes: { x: '5%', y: '45%', width: '90%', height: '10%', fill: 'red' } });
        svg.appendChild(shape);
        svg.style.transform = 'rotate(45deg)';
        svg.style.pointerEvents = 'none';
        el.appendChild(svg);
      }
      this.container.el.appendChild(el);
    }

    this.add(this.container);

    this.callback = params.callback ? params.callback : null;

    this.el.addEventListener('mousedown', this);
  }

  show(params) {
    super.show();
    this.container.setStyle({
      left: params.x + 'px',
      top: params.y + 'px'
    })
  }

  hide() {
    super.hide();
  }

  onClick(event) {
    this.hide();
  }

  onMouseDown(event) {
    let index = event.target.dataset.index;
    // console.log(index);
    let color;
    if (index !== undefined) {
      color = this.entries[Number.parseInt(index)];
    }
    this.hide();

    if (color !== undefined) {
      if (this.callback) {
        this.callback(color);
      }
    }
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
    else if (event.type == 'resize') {
      this.onResize(event);
    }
    else if (event.type == 'blur') {
      this.onBlur(event);
    }
  }

}

module.exports = ColorPalette;
