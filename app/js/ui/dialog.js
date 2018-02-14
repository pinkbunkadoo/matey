const Container = require('./container');
const Label = require('./label');
const Overlay = require('./overlay');

class Dialog extends Overlay {
  constructor(params={}) {
    super(params);
    this.container = new Container();
    // this.container.setStyle({ flexDirection: 'column' });
    this.container.addClass('dialog');
    
    this.titleContainer = new Container();
    this.titleContainer.addClass('dialog-title');

    this.contentContainer = new Container();
    this.contentContainer.addClass('dialog-content');
    // this.contentContainer.setStyle({ flexDirection: 'column' });
    this.container.add(this.titleContainer);
    this.container.add(this.contentContainer);
    this.add(this.container);
  }

  setTitle(title) {
    this.titleContainer.removeAll();
    this.titleContainer.add(new Label({ title: title }));
  }

  setContent(content) {
    this.contentContainer.removeAll();
    this.contentContainer.add(content);
  }
}

module.exports = Dialog;
