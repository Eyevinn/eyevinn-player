/*
The MIT License (MIT)

Copyright (c) 2014 Exceeds Your Expectations Vinn AB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var http = require('http');
var url = require('url');
var Throttle = require('../lib/stream-throttle.js').Throttle;

var currentbps = 4000 * 1024;

function handler(req, resp) {
  var options = url.parse(req.url);

  options.method = req.method;
  options.headers = req.headers;

  var found = options.query.match(/hostname=(.*)&port=(\d+)$/);
  if (found) {
    var host = found[1];  
    options.headers.host = host;
    options.host = host;
    options.hostname = host;
    if (found[2] != 0) {
      options.port = found[2];
    }
    var m = options.query.match(/(.*)(.hostname=.*&port=.*)$/);
    if (m) {
      options.query = m[1];
      options.search = options.query;
    } else {
      options.query = options.search = "";
    }
  }  
  console.log("Proxying request to: " + url.format(options));
  var proxyRequest = http.request(options);
  
  proxyRequest.on('response', function(proxyResponse) {
    resp.setHeader('x-throttle-proxy', 'throttled');
    resp.setHeader('via', 'throttle-proxy');
    resp.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    console.log("Throttling at: " + (currentbps/1000) + " kbps (" + currentbps/8 + " Bps)");
    proxyResponse.pipe(new Throttle({rate: currentbps/8})).pipe(resp);
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
};
exports.getSpeed = function() {
  return currentbps;
};
