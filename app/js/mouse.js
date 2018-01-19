
class Mouse {
  static getPosition(event) {
    return { x: event.clientX, y: event.clientY };
  }
  static isLeftButtonDown(event) {
    return (event.buttons === 1);
  }
}

module.exports = Mouse;
