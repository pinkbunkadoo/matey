
function Tracer() {}

Tracer.trace = function(pixels, width, height) {
  var bitmap = new Array(width * height);
  var graph = [];
  var paths = [];

  var WHITE = 0;
  var BLACK = 1;

  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;

  function at(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return bitmap[y * width + x];
    }
    return WHITE;
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
      if (pixel === BLACK) {
        nodes[scanx] = new PathNode(new Point(scanx, scany));
        while(bitmap[scany * width + scanx] === BLACK && scanx < width) {
          scanx++;
        }
        nodes[scanx] = new PathNode(new Point(scanx, scany));
      }
    }

    for (var scanx = 0; scanx <= width; scanx++) {
      var a = at(scanx - 1, scany - 1);
      var b = at(scanx, scany - 1);
      if (!nodes[scanx]) {
        if ((a == WHITE && b == BLACK) || (a == BLACK && b == WHITE)) {
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

  for (var i = 0; i < pixels.length; i++) {
    var value = pixels[i];
    if (value != 0) {
      bitmap[i] = BLACK;
    } else {
      bitmap[i] = WHITE;
    }
  }

  for (var scany = 0; scany < height; scany++) {
    var nodes = getNodes(scany);
    graph[scany] = nodes;
  }

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

  graph = graph.filter(function(element) {
    return element.length > 0;
  });
}

module.exports = Tracer;

