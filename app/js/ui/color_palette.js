const Base = require('./base');
const Container = require('./container');
const Icon = require('./icon');
const Color = require('../color');

class ColorPalette extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('color-palette');
    this.entries = [];

    this.size = 32 * App.unit;

    // this.marker = new Base();
    // this.marker.addClass('color-palette-marker');
    // this.marker.setStyle({
    //   width: (this.size / 4) + 'px',
    //   height: (this.size / 4) + 'px'
    // });
    // this.add(this.marker);

    this.container = new Container();
    this.add(this.container);

    let swatch = new Container();
    swatch.addClass('color-palette-null');
    swatch.setStyle({
      width: this.size + 'px',
      height: this.size + 'px',
    });
    let nullColor = new Icon({ resource: 'nullColor' });
    nullColor.setStyle({
      // fill: 'rgba(0, 0, 0, 0.5)'
    })
    swatch.add(nullColor);
    this.container.add(swatch);

    this.setIndex(-1);

    this.el.addEventListener('click', (event) => {
      let index = this.container.children.findIndex((element) => {
        return (element.el === event.target);
      })
      if (index != -1) {
        if (this.index == index)
          this.setIndex(-1);
        else
          this.setIndex(index);
      }
    })
  }

  setIndex(index) {
    // this.index = index;
    // if (index >= 0) {
    //   this.marker.show()
    //   this.marker.el.style.top = ((this.index * this.size) + this.size / 2 - this.size / 8) + 'px';
    //   this.marker.el.style.left = (this.size / 2 - this.size / 8) + 'px';
    //   let c = Color.inverse(this.entries[index]);
    //   if (this.entries[index].equals(Color.Gray)) {
    //     c = new Color(0, 0, 0)
    //   }
    //   this.marker.el.style.fill = c.toHexString();
    // } else {
    //   this.marker.hide();
    // }
  }

  addEntries(colors) {
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      this.entries.push(color.copy());
      let swatch = new Container();
      swatch.addClass('color-palette-item');
      swatch.setStyle({
        width: this.size + 'px',
        height: this.size + 'px',
        background: color.toHexString()
      });
      this.container.add(swatch);
    }
  }

}

module.exports = ColorPalette;
