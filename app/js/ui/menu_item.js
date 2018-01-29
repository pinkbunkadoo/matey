const Spacer = require('./spacer');
const Label = require('./label');
const Container = require('./container');
const Icon = require('./icon');

class MenuItem extends Container {
  constructor(params={}) {
    super();

    this.title = params.title;
    this.shortcut = params.shortcut;
    this.icon = params.icon;
    this.click = params.click;

    if (this.icon) {
      let icon = new Icon({ resource: this.icon });
      icon.addClass('menu-item-icon');
      this.add(icon);
    } else {
      let spacer = new Spacer();
      spacer.addClass('menu-item-icon');
      this.add(spacer);
    }

    this.titleLabel = new Label({ title: this.title });
    this.titleLabel.addClass('menu-item-title');
    this.add(this.titleLabel);

    this.shortcutLabel = new Label({ title: this.shortcut });
    this.shortcutLabel.addClass('menu-item-shortcut');
    this.add(this.shortcutLabel);

    this.addClass('menu-item');

    this.el.addEventListener('mousedown', () => {
    });

    this.el.addEventListener('click', () => {
      if (this.click) this.click();
    });
  }
}

module.exports = MenuItem;
