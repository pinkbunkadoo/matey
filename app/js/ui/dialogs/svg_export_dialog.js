const Container = require('../container');
const Spacer = require('../spacer');
const Label = require('../label');
const Button = require('../button');
const TextField = require('../text_field');
const Dialog = require('../dialog');

class SVGExportDialog extends Dialog {
  constructor(params={}) {
    super(params);

    this.setTitle('Export SVG Settings...');
    this.content = new Container();
    this.content.setStyle({
      flexDirection: 'column'
    });

    this.content.add(new Label({title:'Frame Range:'}));
    let rangeContainer = new Container();
    this.rangeStart = new TextField({ name: 'rangeStart' });
    this.rangeStart.setStyle({
      width: '3em',
      maxlength: 3
    });
    rangeContainer.add(this.rangeStart);
    rangeContainer.add(new Spacer({ width: 2, height: 2 }));
    this.rangeEnd = new TextField({ name: 'rangeEnd' });
    this.rangeEnd.setStyle({
      width: '3em',
      maxlength: 3
    });
    rangeContainer.add(this.rangeEnd);
    this.content.add(rangeContainer);

    this.content.add(new Spacer({ width: 2, height: 2 }));

    let buttonContainer = new Container();
    this.exportButton = new Button({ title: 'Export' });
    buttonContainer.add(this.exportButton);

    this.content.add(buttonContainer);

    this.setContent(this.content);
  }
}

module.exports = SVGExportDialog;
