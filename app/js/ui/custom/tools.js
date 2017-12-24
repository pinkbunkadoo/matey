const EventEmitter = require('events').EventEmitter;
const Const = require('../../const');
const Container = require('../container');
const Tray = require('../tray');
const ToolButton = require('../tool_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');

class Tools extends Tray {
  constructor() {
    super();

    this.el = document.getElementById('tools');

    this.buttons = [];
    this.buttons['pointer'] = new ToolButton({id: 'tools-pointer', fromDOMElement:true});
    this.buttons['pencil'] = new ToolButton({id: 'tools-pencil', fromDOMElement:true});
    this.buttons['line'] = new ToolButton({id: 'tools-line', fromDOMElement:true});
    this.buttons['polygon'] = new ToolButton({id: 'tools-polygon', fromDOMElement:true});
    this.buttons['hand'] = new ToolButton({id: 'tools-hand', fromDOMElement:true});
    this.buttons['zoom'] = new ToolButton({id: 'tools-zoom', fromDOMElement:true});

    this.tools = null;

    this.buttons['pointer'].on('pressed', () => { this.onToolSelect('pointer'); });
    this.buttons['pencil'].on('pressed', () => { this.onToolSelect('pencil'); });
    this.buttons['line'].on('pressed', () => { this.onToolSelect('line'); });
    this.buttons['polygon'].on('pressed', () => { this.onToolSelect('polygon'); });
    this.buttons['hand'].on('pressed', () => { this.onToolSelect('hand'); });
    this.buttons['zoom'].on('pressed', () => { this.onToolSelect('zoom'); });

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = (32 * app.unit) + 'px';
      this.buttons[name].el.style.height = (32 * app.unit) + 'px';
      this.buttons[name].el.style.paddingLeft = (12 * app.unit) + 'px';
      this.buttons[name].el.style.paddingRight = (12 * app.unit) + 'px';
    }

    this.colorsContainer = new Container({id: 'tools-colors', fromDOMElement:true});

    this.colorSwatch = new ColorSwatch({id: 'tools-color', fromDOMElement:true});
    this.fillSwatch = new ColorSwatch({id: 'tools-fill', fromDOMElement:true});
    this.colorsContainer.add(this.colorSwatch);
    this.colorsContainer.add(this.fillSwatch);

    this.colorSwatch.setColor(Const.COLOR_STROKE);
    // this.colorSwatch.setColor(Const.COLOR_STROKE);

    // this.colorSwatch.on('pressed')

    // var colorContainer = new Container({ style: { justifyContent: 'center' }});
    //
    // this.strokeColor = new ColorSwatch({ tag: 'stroke_color', color: Color.Black });
    // colorContainer.add(this.strokeColor);
    // this.strokeColor.on('color-change', (color) => {
    //   // self.emit()
    // });
    //
    // colorContainer.add(new Spacer({ width: 3, height: 2 }));
    //
    // this.fillColor = new ColorSwatch({ tag: 'fill_color', color: Color.White });
    // colorContainer.add(this.fillColor);
    //
    // this.add(colorContainer);
  }

  onToolSelect(name) {
    this.setTool(name);
    this.emit('tool-change', { tool: name });
  }

  setTool(name) {
    if (this.tool) {
      this.buttons[this.tool].setState(false);
    }
    this.tool = name;
    this.buttons[this.tool].setState(true);
  }

  getColor() {
    return this.colorSwatch.getColor();
  }

  getFill() {
    return this.fillSwatch.getColor();
  }
}

module.exports = Tools;
