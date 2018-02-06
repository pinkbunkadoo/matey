
class Svg {
  static createElement(params={}) {
    let el = document.createElementNS('http://www.w3.org/2000/svg', params.type);
    for (let name in params.attributes) {
      el.setAttribute(name, params.attributes[name]);
    }
    params.id !== undefined ? el.id = params.id : null;
    return el;
  }
}

module.exports = Svg;
