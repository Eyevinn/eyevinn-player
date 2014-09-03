var http = require('http');
var url = require('url');
var Throttle = require('throttle');

var currentbps = 1000 * 1024;
var throttler = new Throttle({ "bps": currentbps });

function handler(req, resp) {
  var options = url.parse(req.url);
  options.method = req.method;
  options.headers = req.headers;
  
  var proxyRequest = http.request(options);
  
  console.log("Proxying request", options);
  
  proxyRequest.on('response', function (proxyResponse) {
    var doThrottle = false;
  	if(options.hostname != 'localhost' && options.hostname != '127.0.0.1') {
  	  doThrottle = true;
  	}
  	resp.setHeader('x-throttle-proxy', doThrottle ? 'throttled' : 'skipped');
  	resp.setHeader('via', 'throttle-proxy');
  	resp.writeHead(proxyResponse.statusCode, proxyResponse.headers);
  	if (doThrottle) {
      console.log("Throttling at: " + (currentbps/1000) + " kbps");
      proxyResponse.pipe(throttle).pipe(resp);
    } else {
      proxyResponse.pipe(resp);
    }
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
  throttler = new Throttle({ "bps": currentbps });
};
exports.getSpeed = function() {
  return currentbps;
};
