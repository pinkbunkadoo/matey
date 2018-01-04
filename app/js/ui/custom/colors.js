const Color = require('../../color');
const Container = require('../container');
const Spacer = require('../spacer');
const ColorSwatch = require('../color_swatch');
const Panel = require('../panel');
const ColorPalette = require('./color_palette');

class Colors extends Panel {
  constructor(params={}) {
    params.el = document.getElementById('colors');
    super(params);

    this.colorsContainer = new Container({ el: document.getElementById('colors-container'), name: 'colors' });
    this.colorSwatch = new ColorSwatch({ el: document.getElementById('colors-color'), name: 'color', color: app.colors.STROKE });
    this.fillSwatch = new ColorSwatch({ el: document.getElementById('colors-fill'), name: 'fill', color: null });
    this.colorsContainer.add(this.colorSwatch);
    this.colorsContainer.add(this.fillSwatch);

    this.add(this.colorsContainer);
    this.add(new Spacer({ width: 1, height: 0.5 }));

    this.paletteContainer = new Container();
    this.paletteContainer.setStyle({
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    });

    this.palette = new ColorPalette();
    // this.palette.setStyle({ flexWrap: 'wrap', width: '4.5em' });
    this.palette.setStyle({
      // background: 'pink',
      display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      flexWrap: 'wrap',
      // borderRadius: '4px',
      // backgroundClip: 'padding-box',
      // width: '100%',
      // gridTemplateColumns: 'repeat(1, 1fr)',
      // gridGap: '1px',
      // background: 'gray',
      // padding: '1px'
      width: '5em'

    });
    this.palette.addEntries([ Color.White, Color.Black, Color.Red, Color.Green, Color.Blue ]);

    this.paletteContainer.add(this.palette);
    this.add(this.paletteContainer);
  }

  setColor(color) {
    this.colorSwatch.setColor(color);
  }

  setFill(color) {
    this.fillSwatch.setColor(color);
  }

  getColor() {
    return this.colorSwatch.getColor();
  }

  getFill() {
    return this.fillSwatch.getColor();
  }

}

module.exports = Colors;
