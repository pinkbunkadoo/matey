const Base = require('./base');
const Container = require('./container');
const Icon = require('./icon');

class Tray extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('tray');

    // this.tagIcon = new Icon({ resource: 'tag' });
    this.tagIcon = new Base();
    this.tagIcon.addClass('tray-tag');

    // this.tagIcon.el.style.width = (16 * app.unit) + 'px';
    // this.tagIcon.el.style.height = (16 * app.unit) + 'px';
    // this.tagIcon.el.style.marginTop = (-0 * app.unit) + 'px';

    // this.tagIcon.el.style.left = (100 - 8 * app.unit) + 'px';
    this.add(this.tagIcon);

    this.container = new Container();
    this.container.addClass('tray-container');
    this.add(this.container);

    this.addClass('invert');
  }

  handleEvent(event) {
    if (event.type == 'mousedown') {
      this.onMouseDown(event);
    } else if (event.type == 'mouseup') {
      this.onMouseUp(event);
    } else if (event.type == 'mousemove') {
      this.onMouseMove(event);
    }
  }
}

module.exports = Tray;
