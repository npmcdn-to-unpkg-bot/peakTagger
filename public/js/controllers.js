app.controller('HomeController', function($scope, locateService) {
  new Promise(function(resolve) {
    locateService.locate(resolve);
  }).then(function(position) {
    locateService.position = position;
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
  });
});

app.controller('MainController', function($scope, $http, locateService) {
  $scope.view = {};
  var lat = locateService.position.coords.latitude, lon = locateService.position.coords.longitude;
  // GETS MOUNTAIN DATA FROM INTERNAL API
  var url = `/${lat}/${lon}`;
  console.log(url);
  $http.get(url).then(function(data) {
    $scope.view.mountains = data.data;
    console.log(data);
  })
});

app.controller('MapController', function($scope, locateService) {
  $scope.view = {};
  var lat = locateService.position.coords.latitude;
  var lng = locateService.position.coords.longitude;
  $scope.view.map = { center: { latitude: lat, longitude: lng }, zoom: 13 };
});
