var hsrandom = angular.module("hsrandom", ['contenteditable']);

angular.module('hsrandom').controller('main', ['$scope', function(scope) {

  scope.socket = new WebSocket("ws://localhost:9800", "protocolOne");
  scope.loading = true;

  scope.socket.onerror = function(event) {
    scope.loading = false;
    scope.error = true;
  };

  scope.socket.onopen = function(event) {
    scope.loading = false;
  }

  scope.obj = {
    p1: 0,
    p2: 0,
    timeDiff: 0,
    names: {
      p1: 'Player 1',
      p2: 'Player 2'
    }

  };

  scope.socket.onmessage = function (event) {
    console.log('recieved', event.data);
    var cardData = JSON.parse(event.data);
    scope.obj = cardData;
    scope.$apply();
  }

  scope.$watchCollection('obj.names', function(value, old) {
    if(scope.obj.names.p1 === 'Player 1' && scope.obj.names.p2 === 'Player 2') return false;
    scope.socket.send(JSON.stringify({
      command: 'updateNames',
      names: {
        p1: scope.obj.names.p1,
        p2: scope.obj.names.p2}
      }
    ));
  });

  scope.reroll = function() {
    scope.socket.send(JSON.stringify({command: 'reroll'}));
  };

  setInterval(function() {
    scope.obj.timeDiff = Math.round((Date.now() - scope.obj.time)/1000);
    scope.$apply();
  }, 1000);
}]);
 