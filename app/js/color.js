
class Color {
  constructor(r, g, b, a) {
    this.r = r != undefined ? r : 0;
    this.g = g != undefined ? g : 0;
    this.b = b != undefined ? b : 0;
    this.a = a != undefined ? a : 255;
  }

  equals(color) {
    return (this.r == color.r && this.g == color.g && this.b == color.b);
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  toHexString() {
    var r = this.r, g = this.g, b = this.b, a = this.a;
    r = (r > 0xf ? r.toString(16) : '0' + r.toString(16));
    g = (g > 0xf ? g.toString(16) : '0' + g.toString(16));
    b = (b > 0xf ? b.toString(16) : '0' + b.toString(16));
    // a = (a > 0xf ? a.toString(16) : '0' + a.toString(16));
    // return '#' + r + g + b + a;
    return '#' + r + g + b;
  }

  static fromObject(obj={}) {
    return new Color(obj.r, obj.g, obj.b, obj.a);
  }

  static inverse(color) {
    return new Color(255 - color.r, 255 - color.g, 255 - color.b);
  }

  static fromHexString(text) {
    var s = text.trim();
    var r = 0, g = 0, b = 0, a = 255;

    if (s[0] === '#') {
      s = s.substring(1);
      if (s.length === 3) {
        r = parseInt(s[0], 16), g = parseInt(s[1], 16), b = parseInt(s[2], 16);
      } else if (s.length == 4) {
        r = parseInt(s[0], 16), g = parseInt(s[1], 16), b = parseInt(s[2], 16), a = parseInt(s[3], 16);
      } else if (s.length == 6) {
        r = parseInt(s[0] + s[1], 16), g = parseInt(s[2] + s[3], 16), b = parseInt(s[4] + s[5], 16);
      } else if (s.length == 8) {
        r = parseInt(s[0] + s[1], 16), g = parseInt(s[2] + s[3], 16), b = parseInt(s[4] + s[5], 16), a = parseInt(s[6] + s[7], 16);
      }
    }

    return new Color(r, g, b, a);
  }

}

module.exports = Color;
