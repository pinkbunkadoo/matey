const Base = require('./base');
const Container = require('./container');
const Color = require('../color');
const Icon = require('./icon');
const Label = require('./label');
const Svg = require('../svg');

class TrayButton extends Container {
  constructor(params={}) {
    super(params);

    this.addClass('tray-button');

    if (params.id) this.el.id = params.id;

    this.title = params.title;
    this.iconResourceName = params.icon || this.el.dataset.icon;
    this.svg = null;

    this.width = params.width || 3.2;
    this.height = params.height || 3.2;
    this.padding = params.padding || 1.4;

    if (!this.title) {
      if (this.iconResourceName) {
        this.el.style.width = (this.width + this.padding * 2) + 'em';
        this.el.style.height = (this.height + this.padding * 2) + 'em';

        let w = this.width + this.padding * 2;
        let h = this.height + this.padding * 2;

        this.svg = Svg.createElement({ type: 'svg', attributes: { 'xmlns:xlink': 'http://www.w3.org/1999/xlink', width: this.width + 'em', height: this.height + 'em' }});
        this.svg.classList.add('svg-icon');

        let svg, mask;

        mask = Svg.createElement({ type: 'mask' });
        svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em', fill: 'white' }});
        mask.appendChild(svg);
        // svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2 - 0.15) + 'em', fill: 'black' }});
        // mask.appendChild(svg);
        mask.id = this.name + '-mask';
        this.svg.appendChild(mask);

        // let filter = Svg.createElement({ type: 'filter' });
        // filter.id = this.name + '-filter';
        // let fe = Svg.createElement({ type: 'feGaussianBlur', attributes: { in: 'SourceGraphic', stdDeviation: '1' } });
        // filter.appendChild(fe);
        // this.svg.appendChild(filter);

        svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em', mask: 'url(#' + this.name + '-mask)' }});
        // svg = Svg.createElement({ type: 'circle', attributes: { cx: (w / 2) + 'em', cy: (h / 2) + 'em', r: (w / 2) + 'em' }});
        svg.classList.add('tray-button-background');
        this.svg.appendChild(svg);

        svg = Svg.createElement({ type: 'use', attributes: {
          x: (w / 2 - (this.width / 2)) + 'em',
          y: (h / 2 - (this.height / 2)) + 'em',
          width: (this.width) + 'em', height: (this.height) + 'em'
        }});
        svg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + this.iconResourceName);
        svg.style.pointerEvents = 'none';
        svg.id = this.name + '-icon';
        this.svg.appendChild(svg);

        this.el.appendChild(this.svg);
      }
    }

    this.state = false;

    this.el.addEventListener('mousedown', this);
  }

  setState(state) {
    if (state != this.state) {
      this.state = state;
      this.update();
    }
  }

  setIcon(resource) {
    let el = this.svg.querySelector('#' + this.name + '-icon');
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#' + resource);
  }

  update() {
    this.removeClass('pressed');
    if (this.state) {
      this.addClass('pressed');
    }
  }

  toggle() {
    this.setState(!this.state);
  }

  onClick(event) {
    // this.emit('click', this);
    // this.update();
  }

  onMouseDown(event) {
    this.emit('pressed', this);
  }

  onMouseUp(event) {
  }

  handleEvent(event) {
    if (event.type === 'click') {
      // this.onClick(event);
    }
    else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }

}

module.exports = TrayButton;
