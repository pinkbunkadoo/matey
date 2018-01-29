const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');
const Svg = require('../svg');

class ColorSwatch extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('color-swatch');

    this.type = params.type || 'stroke';

    this.width = 3.2;
    this.height = 3.2;
    this.padding = .4;

    let w = this.width + this.padding * 2;
    let h = this.height + this.padding * 2;

    this.el.style.width = w + 'em';
    this.el.style.height = h + 'em';

    this.svg = Svg.createElement({ type: 'svg', attributes: {
      'xmlns:xlink': 'http://www.w3.org/1999/xlink', width: this.width + 'em', height: this.height + 'em' }});
    this.svg.classList.add('svg-icon');

    let svg, mask;

    // console.log(this.type);

    svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em' }});
    svg.id = this.type + '-background';
    svg.classList.add('color-swatch-background');
    this.svg.appendChild(svg);

    // normal display

    mask = Svg.createElement({ type: 'mask' });
    svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2.5) + 'em', fill: 'white' }});
    mask.appendChild(svg);
    if (this.type == 'stroke') {
      svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 4) + 'em', fill: 'black' }});
      mask.appendChild(svg);
    }
    mask.id = this.type + '-icon-mask';
    this.svg.appendChild(mask);

    svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em', mask: 'url(#' + this.type + '-icon-mask)' }});
    svg.id = this.type + '-icon';
    svg.style.pointerEvents = 'none';
    this.svg.appendChild(svg);

    // no color display

    mask = Svg.createElement({ type: 'mask' });
    svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2.5) + 'em', fill: 'white' }});
    mask.appendChild(svg);
    if (this.type == 'stroke') {
      svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 4) + 'em', fill: 'black' }});
      mask.appendChild(svg);
    }
    svg = Svg.createElement({ type: 'rect', attributes: { x: 0, y: (h / 2 - 0.3) + 'em', width: (w) + 'em', height: .6 + 'em', fill: 'black' }});
    svg.style.transformOrigin = w / 2 + 'em ' + h / 2 + 'em';
    svg.style.transform = 'rotate(45deg)';
    mask.appendChild(svg);

    mask.id = this.type + '-nothing-mask';
    this.svg.appendChild(mask);

    svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em', mask: 'url(#' + this.type + '-nothing-mask)' }});
    svg.id = this.type + '-nothing';
    svg.style.pointerEvents = 'none';
    svg.classList.add('color-swatch-foreground');
    this.svg.appendChild(svg);

    this.el.appendChild(this.svg);

    this.el.addEventListener('mousedown', () => {
      this.emit('down', this);
    });

    this.setColor(params.color);
  }

  getColor() {
    // return this.swatch.getColor();
  }

  setColor(color) {
    let iconEl = this.svg.querySelector('#' + this.type+ '-icon');
    let nothingEl = this.svg.querySelector('#' + this.type + '-nothing');
    // iconEl.style.transition = 'opacity .4s';
    // nothingEl.style.transition = 'opacity .4s';
    if (color) {
      iconEl.style.fill = color.toHexString();
      iconEl.style.opacity = 1;
      nothingEl.style.opacity = 0;
      // iconEl.style.visibility = 'visible';
      // nothingEl.style.visibility = 'hidden';
    } else {
      iconEl.style.opacity = 0;
      nothingEl.style.opacity = 1;
      // iconEl.style.visibility = 'hidden';
      // nothingEl.style.visibility = 'visible';
    }
  }

  onCopy(event) {
    var text = this.color.toHexString();
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  }

  onPaste(event) {
    var text = event.clipboardData.getData('text/plain');
    if (text[0] !== '#') text = '#' + text;
    this.setColor(Color.fromHexString(text));
    this.emit('color-change', this.color);
  }

}

module.exports = ColorSwatch;
