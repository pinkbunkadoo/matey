
function Color(r, g, b, a) {
  this.r = r != undefined ? r : 0;
  this.g = g != undefined ? g : 0;
  this.b = b != undefined ? b : 0;
  this.a = a != undefined ? a : 255;
}

Color.prototype.constructor = Color;

Color.prototype.copy = function() {
  return new Color(this.r, this.g, this.b, this.a);
}

Color.fromHexString = function(text) {
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

Color.prototype.toHexString = function() {
  var r = this.r, g = this.g, b = this.b, a = this.a;
  r = (r > 0xf ? r.toString(16) : '0' + r.toString(16));
  g = (g > 0xf ? g.toString(16) : '0' + g.toString(16));
  b = (b > 0xf ? b.toString(16) : '0' + b.toString(16));
  // a = (a > 0xf ? a.toString(16) : '0' + a.toString(16));
  // return '#' + r + g + b + a;
  return '#' + r + g + b;
}

Color.Black = new Color();
Color.White = new Color(255, 255, 255);
Color.Red = new Color(255, 0, 0);
Color.Green = new Color(0, 255, 0);
Color.Blue = new Color(0, 0, 255);

module.exports = Color;
