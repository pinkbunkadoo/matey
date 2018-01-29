const Container = require('../container');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Icon = require('../icon');
const Tray = require('../tray');
const TrayButton = require('../tray_button');
const Spacer = require('../spacer');
const Divider = require('../divider');

class FrameListTray extends Tray {
  constructor(params={}) {
    super(params);

    this.first = new Container({ el: document.getElementById('frame-list-first') });
    this.last = new Container({ el: document.getElementById('frame-list-last') });
    this.add(this.first);
    this.add(this.last);

    this.first.el.onmousedown = () => {
      this.emit('first');
    }
    this.last.el.onmousedown = () => {
      this.emit('last');
    }

    this.frameListNew = new Container({ el: document.getElementById('frame-list-new') });
    // this.frameListNew.addClass('frame-list-new');
    let icon = new Icon({ resource: 'plus' });
    icon.el.style.width = (32 * App.unit) + 'px';
    icon.el.style.height = (32 * App.unit) + 'px';
    icon.el.style.pointerEvents = 'none';
    this.frameListNew.add(icon);

    this.frameListNew.el.onmousedown = (event) => {
      if (event.shiftKey)
        this.emit('duplicate');
      else
        this.emit('new');
    };

    this.add(this.frameListNew);
  }
}

module.exports = FrameListTray;
