
function Loader() {
}

Loader.load = function(url, callback) {
  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

  var ajax = new XMLHttpRequest();
  ajax.open("GET", url, true);

  if (ext === 'png') {
    ajax.responseType = "blob";
    ajax.contentType = 'image/png';
  } else if (ext === 'svg') {
    ajax.contentType = 'image/svg+xml';
  }

  ajax.send();
  ajax.onload = callback.bind({ filename: url, ext: ext });
}

module.exports = Loader;
