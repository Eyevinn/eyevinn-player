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

var eyevinnPlayer = angular.module('eyevinnplayer', []);
var url = require('url');
var request = require('request');

var player;
var apithrottle = 'http://localhost:5000/api/throttler';
var apistream = 'http://localhost:5000/api/stream';

function mainController($scope, $http) {
  $scope.formPlayer = {};
  $scope.statusText = '';
  
  $http.get(apistream)
    .success(function(data) {
      $scope.formPlayer.stream = data.stream;
    })
    .error(function(data) {
      console.log("Error: " + data);
    });
    
  $scope.loadStream = function() {
    $http.put(apistream, $scope.formPlayer)
      .success(function(data) {
        loadVideo($scope.formPlayer.stream);
      })
      .error(function(data) {
        console.log("Error: " + data);
      });
  };
  
  $scope.setStatusText = function(t) {
    $scope.statusText = t;
  };
           
  videojs('video').ready(function() {
    player = this;
    loadVideo($scope.formPlayer.stream);
  });  
}

function loadVideo(stream) {
  player.pause();
  try {
    player.src([ { type: "application/x-mpegURL", src: stream } ]);
    player.play();
  } catch (err) {
    console.log("Error: " + err);
  }
}

function getSpeed(callback) {
  var speed;
  request(apithrottle, function(err, resp, body) {
    var data = JSON.parse(body);
    speed = data.speed;
    callback(speed);
  });
}

function setSpeed(speed) {
  var request = require('request');
  var tdata = { "speed": speed };
  request.put(apithrottle, { form: tdata }, function(err, resp, body) {
    var data = JSON.parse(body);
  });
}