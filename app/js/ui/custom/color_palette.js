const Base = require('../base');
const Container = require('../container');

class ColorPalette extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('color-palette');
    // this.columns = params.columns ? params.columns : 2;
    // this.el.style.alignItems = 'center';
    // this.el.style.justifyContent = 'center';
    this.entries = [];
  }

  addEntries(colors) {
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      this.entries.push(color.copy());
      let swatch = new Base();
      swatch.addClass('color-palette-item');
      swatch.setStyle({
        // flexWrap: 'nowrap',
        width: '100%',
        height: '3em',
        // width: '3em', minWidth: '3em', minHeight: '3em', height: '3em',
        // border: '1px solid gray',
        background: color.toHexString()
      });
      this.add(swatch);
    }
    // console.log(colors.length);
  }

}

module.exports = ColorPalette;
