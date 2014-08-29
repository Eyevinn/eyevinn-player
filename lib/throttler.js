var http = require('http');
var url = require('url');
var Throttle = require('throttle');

var currentbps = 1000 * 1024;

function handler(req, resp) {
  console.log("Throttling at: " + currentbps + " bps");
}

function run() {
  var proxy = http.createServer(function(req, resp) {
    handler(req, resp);
  });
  proxy.listen(4000);
}

exports.run = run;
exports.setSpeed = function(speed) {
  currentbps = speed;
  console.log("Current speed " + currentbps + " bps");
};
exports.getSpeed = function() {
  return currentbps;
};
