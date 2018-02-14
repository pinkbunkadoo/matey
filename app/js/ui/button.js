const Base = require('./base');
const Container = require('./container');
const Icon = require('./icon');
const Label = require('./label');

class Button extends Base {
  constructor(params={}) {
    params.el = params.el || document.createElement('button');
    super(params);

    if (params.id) this.el.id = params.id;

    this.title = params.title;
    this.iconResourceName = params.resource;
    this.svg = null;

    if (!this.title) {
      if (this.el.firstElementChild instanceof SVGSVGElement) {
        this.svg = this.el.firstElementChild;
      } else {
         if (this.el.textContent) {
           this.title = this.el.textContent;
         } else {
           if (this.iconResourceName) {
             // console.log(this.iconResourceName)
             var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
             svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
             svg.setAttribute('width', '100%');
             svg.setAttribute('height', '100%');
             svg.style.pointerEvents = 'none';

             var svguse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
             svguse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/icons.svg#nullColor');
             svg.appendChild(svguse);

             this.el.appendChild(svg);
             this.svg = svg;
           }
         }
      }
    }

    if (this.title) {
      this.el.innerHTML = '';
      this.textContainer = new Container();
      this.textContainer.setStyle({
        flex: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        // border: '1px solid black'
      })
      this.textContainer.el.innerHTML = this.title;
      this.textContainer.addClass('text');
      // this.add(this.textContainer);
      this.el.appendChild(this.textContainer.el);
      this.setStyle({ width: 'auto' });
      this.addClass('text');
    } else {
      // this.el.style.width = '2.4em';
    }

    // this.el.style.height = '2.4em';

    // this.el.draggable = "true";
    // this.addClass('button');

    this.state = false;

    this.el.addEventListener('click', this);
    this.el.addEventListener('mousedown', this);
    // this.el.addEventListener('drag', () => {
    //   console.log('drag');
    // });
  }

  setState(state) {
    if (state != this.state) {
      this.state = state;
      this.update();
    }
  }

  update() {
    this.removeClass('pressed');
    if (this.state) {
      this.addClass('pressed');
    }
  }

  toggle() {
    this.setState(!this.state);
  }

  onClick(event) {
    this.emit('click', this);
    this.update();
  }

  onMouseDown(event) {
    // App.capture(this);
    this.emit('down', this);
  }

  onMouseUp(event) {
    // App.release(this);
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.onClick(event);
    }
    else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }

}

module.exports = Button;
