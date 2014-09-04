var http = require('http');
var url = require('url');
var Throttle = require('../lib/stream-throttle.js').Throttle;

var currentbps = 4000 * 1024;
var currentsrc;

var throttler = new Throttle({rate: currentbps});

function handler(req, resp) {
  var options = url.parse(req.url);

  options.method = req.method;
  options.headers = req.headers;
  options.host = currentsrc.host;
  options.hostname = currentsrc.hostname;

  var proxyRequest = http.request(options);
  
  proxyRequest.on('response', function(proxyResponse) {
    resp.setHeader('x-throttle-proxy', 'throttled');
    resp.setHeader('via', 'throttle-proxy');
    resp.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    console.log("Throttling at: " + (currentbps/1000) + " kbps");
    //proxyResponse.pipe(throttler).pipe(resp);
    proxyResponse.pipe(resp);
  });  
  
  proxyRequest.on('error', function(err) {
    console.log(err);
    resp.end();
  });

  req.pipe(proxyRequest);  
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
  console.log("Current speed " + (currentbps/1000) + " kbps");
  var throttler = new Throttle({rate: currentbps});
};
exports.getSpeed = function() {
  return currentbps;
};
exports.setSource = function(source) {
  currentsrc = source;
}
exports.getSource = function() {
  return currentsrc;
}
