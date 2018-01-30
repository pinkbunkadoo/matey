const Container = require('../container');
const Tray = require('../tray');
const TrayButton = require('../tray_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');

class ToolsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.toolNames = ['pencil', 'line', 'polygon', 'pointer', 'hand', 'zoom'];
    this.buttons = [];
    this.tool = null;

    this.collapser = new TrayButton({ el: document.getElementById('tools-tray-lock'), name: 'collapser', width: 1.2, height: 1.2, padding: .6 })
    this.collapser.on('pressed', () => {
      this.toggleRollout();
    });
    this.add(this.collapser);

    for (let i = 0; i < this.toolNames.length; i++) {
      let name = this.toolNames[i];
      let el = document.getElementById('tools-tray-' + name);
      if (el) {
        this.buttons[name] = new TrayButton({ el: el, name: name });
      }
    }

    this.toolButton = new TrayButton({ el: document.getElementById('tools-tray-tool'), width: 6.4, height: 6.4, padding: 3 });
    this.toolButton.on('pressed', () => {
      this.toggleRollout();
    });
    this.add(this.toolButton);

    this.rollout = new Container({ el: document.getElementById('tools-rollout') });
    this.add(this.rollout);

    for (let i = 0; i < this.toolNames.length; i++) {
      let name = this.toolNames[i];
      this.buttons[name].on('pressed', () => { this.onToolSelect(name); });
      this.rollout.add(this.buttons[name]);
    }

    this.locked = true;
    this.cooldownDefault = 2;

    this.el.addEventListener('mousemove', this);
    this.el.addEventListener('pointerenter', this);
    this.el.addEventListener('pointerleave', this);
  }

  startCooldown() {
    this.cooldown = this.cooldownDefault;
    if (!this.cooldownTimerId) {
      this.cooldownTimerId = setInterval(() => {
        this.cooldown--;
        if (this.cooldown == 0) {
          this.stopCooldown();
          this.hideRollout();
        }
      }, 1000);
    }
  }

  stopCooldown() {
    clearInterval(this.cooldownTimerId);
    this.cooldownTimerId = null;
  }

  hideRollout() {
    this.rollout.hide();
    this.rollout.el.style.height = 0;
    this.collapser.el.style.transform = 'scale(1, -1)';
    // this.collapser.hide();
  }

  showRollout() {
    this.rollout.show();
    this.rollout.el.style.height = 'auto';
    this.collapser.el.style.transform = 'scale(1, 1)';
    // this.collapser.show();
  }

  toggleRollout() {
    if (this.rollout.isVisible()) {
      this.hideRollout();
    } else {
      this.showRollout();
    }
  }

  onToolSelect(name) {
    if (name !== this.tool) {
      this.setTool(name);
      this.emit('tool-change', { tool: name });
    }
  }

  setTool(name) {
    if (name !== this.tool) {
      if (this.tool) {
        this.buttons[this.tool].setState(false);
      }
      this.tool = name;
      this.buttons[this.tool].setState(true);
      this.toolButton.setIcon(name);
    }
  }

  onMouseMove(event) {
    this.cooldown = this.cooldownDefault;
  }

  onPointerEnter(event) {
  }

  onPointerLeave(event) {
    if (!this.locked)
      this.startCooldown();
  }

  handleEvent(event) {
    if (event.type == 'mousemove') {
      this.onMouseMove(event);
    }
    else if (event.type == 'pointerenter') {
      this.onPointerEnter(event);
    }
    else if (event.type == 'pointerleave') {
      this.onPointerLeave(event);
    }
  }

}

module.exports = ToolsTray;
