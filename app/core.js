var eyevinnPlayer = angular.module('eyevinnplayer', []);

var player;

function mainController($scope, $http) {
  $scope.formPlayer = {};
  
  $http.get('http://localhost:5000/api/stream')
    .success(function(data) {
      $scope.formPlayer.stream = data.stream;
    })
    .error(function(data) {
      console.log("Error: " + data);
    });
    
  $scope.loadStream = function() {
    $http.put('http://localhost:5000/api/stream', $scope.formPlayer)
      .success(function(data) {
        loadVideo($scope.formPlayer.stream);
      })
      .error(function(data) {
        console.log("Error: " + data);
      });
  };
       
  videojs('video').ready(function() {
    player = this;
    loadVideo($scope.formPlayer.stream);
  });  
}

function loadVideo(stream) {
  try {
    player.pause();
    player.src([ { type: "application/x-mpegURL", src: stream } ]);
    player.play();
  } catch (err) {
    console.log("Error: " + err);
  }
}

function setSpeed(speed) {
  console.log(speed);
}
