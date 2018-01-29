const Container = require('./container');
const Overlay = require('./overlay');
const MenuItem = require('./menu_item');

class Menu extends Container {
  constructor() {
    super();

    this.addClass('overlay');

    this.items = [];

    this.container = new Container();
    this.container.addClass('menu');
    this.add(this.container);

    this.el.addEventListener('click', this);
  }

  addItem(params) {
    let item = new MenuItem({
      title: params.title,
      shortcut: params.shortcut,
      icon: params.icon,
      click: params.click
    });
    this.items.push(item);
    this.container.add(item);
  }

  show(x, y) {
    document.body.appendChild(this.el);

    let menu = this.container;
    if (x + menu.el.offsetWidth > window.innerWidth) {
      x = window.innerWidth - menu.el.offsetWidth;
    }
    if (y + menu.el.offsetHeight > window.innerHeight) {
      y = window.innerHeight - menu.el.offsetHeight;
    }
    menu.el.style.left = x + 'px';
    menu.el.style.top = y + 'px';

    window.addEventListener('resize', this);
    window.addEventListener('blur', this);
  }

  hide() {
    document.body.removeChild(this.el);
    window.removeEventListener('resize', this);
    window.removeEventListener('blur', this);
  }

  onClick(event) {
    this.hide();
  }

  onResize(event) {
    this.hide();
  }

  onBlur(event) {
    this.hide();
  }

  handleEvent(event) {
    if (event.type == 'click') {
      this.onClick(event);
    }
    else if (event.type == 'resize') {
      this.onResize(event);
    }
    else if (event.type == 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = Menu;
