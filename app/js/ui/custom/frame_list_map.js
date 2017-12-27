const Base = require('../base');
const Container = require('../container');

class FrameListMap extends Container {
  constructor(params={}) {
    super(params);
    this.nodule = new Base();
    this.nodule.addClass('frame-list-map-nodule');
    this.add(this.nodule);
  }

  render(params) {
    if (params.cmd === 'update') {
      // console.log('update');
      this.nodule.el.style.width = params.size + 'px';
      this.nodule.el.style.left = params.offset + 'px';
    }
  }
}

module.exports = FrameListMap;
