var Path = require('./path.js');
var PathNode = require('./path_node.js');

function Tracer() {}

Tracer.WHITE = 0;
Tracer.BLACK = 1;

// Tracer.UP = 1;
// Tracer.DOWN = 2;
// Tracer.LEFT = 3;
// Tracer.RIGHT = 4;

Tracer.trace = function(pixels, width, height) {
  // console.log('trace', pixels.length/4, width, height);

  var bitmap = new Array(width * height);
  var graph = [];
  var paths = [];

  function at(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return bitmap[y * width + x];
    }
    return Tracer.WHITE;
  }

  function getSquareCode(x, y) {
    var a = at(x - 1, y - 1);
    var b = at(x, y - 1) << 1;
    var c = at(x - 1, y) << 2;
    var d = at(x, y) << 3;
    return (a | b | c | d);
  }

  function getNodeAt(x, y, alternate) {
    var node = null;
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      for (var i = 0; i < graph.length; i++) {
        var nodes = graph[i];
        var f = nodes.filter(function(element) {
          return (element.point.x === x && element.point.y === y);
        });

        if (f.length === 1)
          return f[0];
        else if (f.length === 2)
          if (alternate === true)
            return f[1];
          else
            return f[0];
      }
    }
    return node;
  }

  function getNodes(scany) {
    var nodes = [];
    for (var scanx = 0; scanx < width; scanx++) {
      var pixel = bitmap[scany * width + scanx];
      if (pixel === Tracer.BLACK) {
        // console.log(scany, 'strip');
        nodes[scanx] = new PathNode(new Point(scanx, scany));
        while(bitmap[scany * width + scanx] === Tracer.BLACK && scanx < width) {
          scanx++;
        }
        nodes[scanx] = new PathNode(new Point(scanx, scany));
      }
    }

    for (var scanx = 0; scanx <= width; scanx++) {
      var a = at(scanx - 1, scany - 1);
      var b = at(scanx, scany - 1);
      if (!nodes[scanx]) {
        if ((a == Tracer.WHITE && b == Tracer.BLACK) || (a == Tracer.BLACK && b == Tracer.WHITE)) {
          var node = new PathNode(new Point(scanx, scany));
          node.color = 'blue';
          nodes[scanx] = node;
        }
      }
    }

    nodes = nodes.filter(function(element) {
      return !(element == null || element == undefined);
    });

    return nodes;
  }

  // Initialise bitmap with imageData

  // console.log(pixels[3 * 32]);

  for (var i = 0, offset = 0; i < pixels.length; i = i + 4, offset++) {
    var value = pixels[i + 3];
    if (value !== 0) {
      bitmap[offset] = Tracer.BLACK;
      // console.log('black', Tracer.BLACK);
    } else {
      bitmap[offset] = Tracer.WHITE;
    }
    // offset++;
  }
  // bitmap[0] = Tracer.BLACK;
  // console.log(bitmap[0]);

  // Scan for runs of black pixels and return a point node graph

  for (var scany = 0; scany < height; scany++) {
    var nodes = getNodes(scany);
    graph[scany] = nodes;
  }

  // Traverse the node graph establishing directional relationships between nodes

  for (var i = 0; i < graph.length; i++) {
    var nodes = graph[i];
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j];

      var e = getSquareCode(node.point.x, node.point.y);

      if (e === 3 || e === 8 || e === 12 || e === 13) {
        // RIGHT
        node.next = nodes[j + 1];
        nodes[j + 1].prev = node;

      } else if (e === 4 || e === 5 || e === 7) {
        // DOWN
        var n = getNodeAt(node.point.x, node.point.y + 1);
        node.next = n;
        n.prev = node;

      } else if (e === 2 || e === 10 || e === 14) {
        // UP
        var n = getNodeAt(node.point.x, node.point.y - 1, true);
        node.next = n;
        n.prev = node;

      } else if (e === 1 || e === 11) {
        // LEFT
        node.next = nodes[j - 1];
        nodes[j - 1].prev = node;

      } else if (e == 6) {
        node.next = getNodeAt(node.point.x, node.point.y + 1);
        node.next.prev = node;
        node.prev = nodes[j - 1];

        var nn = new PathNode(node.point.copy());
        nn.prev = nodes[j + 1];
        nn.next = getNodeAt(node.point.x, node.point.y - 1);
        nn.next.prev = nn;

        nodes.splice(j + 1, 0, nn);
        j++;

      } else if (e == 9) {
        node.next = nodes[j - 1];
        node.next.prev = node;
        node.prev = getNodeAt(node.point.x, node.point.y - 1);

        var nn = new PathNode(node.point.copy());
        nn.prev = getNodeAt(node.point.x, node.point.y + 1);
        nn.next = nodes[j + 1];
        nn.next.prev = nn;

        nodes.splice(j+1, 0, nn);
        j++;
      }
    }
  }

  // Create paths

  for (var scany = 0; scany < height; scany++) {
    var nodes = graph[scany];

    // console.log(scany, nodes.length);

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!node.visited) {
        var root = node;
        var current = root;
        var path = new Path();
        do {
          path.points.push(current.point.copy());
          current.visited = true;
          current = current.next;
        } while (current != root);
        paths.push(path);
      }
    }
  }

  // graph = graph.filter(function(element) {
  //   return element.length > 0;
  // });

  return paths;
}

module.exports = Tracer;

