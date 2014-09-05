/*
The MIT License (MIT)

Copyright (c) 2014 Exceeds Your Expecations Vinn AB

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

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var throttler = require('./throttler');

var port = 5000;
var router = express.Router();
var stream = "http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
  res.json({ message: 'This is the Eyevinn throttler API' });
});

router.route('/throttler')
  .put(function(req, res) {
    var speed = req.body.speed;
    if (speed) {
      throttler.setSpeed(speed);
    }
    res.json({ "speed": throttler.getSpeed() });
  })
  .get(function(req, res) {
    res.json({ "speed": throttler.getSpeed() });
  });
  
router.route('/stream')
  .put(function(req, res) {
    stream = req.body.stream;
    res.json({ "stream": stream });    
  })
  .get(function(req, res) {
    res.json({ "stream": stream });
  });
  
app.use('/api', router);
app.listen(port);
console.log("Started API server");
