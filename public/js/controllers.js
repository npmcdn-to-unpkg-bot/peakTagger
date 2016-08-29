app.controller('HomeController', function($scope, locateService) {
  new Promise(function(resolve) {
    locateService.locate(resolve);
  }).then(function(position) {
    locateService.position = position;
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
  });
});

app.controller('MainController', function($scope, $http, locateService, peakService) {
  $scope.view = {};
  var lat = locateService.position.coords.latitude, lon = locateService.position.coords.longitude;
  $http.get(`/peaksearch/${lat}/${lon}`).then(function(data) { // GETS MOUNTAIN DATA FROM INTERNAL API
    $scope.view.peaks = data.data;
  })
  $scope.peakInit = function(osm_id) {
    peakService.osm_id = osm_id;
  }
});

app.controller('MapController', function($scope, locateService) {
  $scope.view = {};
  var lat = locateService.position.coords.latitude;
  var lng = locateService.position.coords.longitude;
  $scope.view.map = { center: { latitude: lat, longitude: lng }, zoom: 13 };
});

app.controller('PeakController', function($scope, $http, peakService) {
  $scope.view = {};
  var osm_id = peakService.osm_id;
  $http.get(`/peaklookup/${osm_id}`).then(function(data) { // GETS DATA ON INDIVIDUAL PEAK
    $scope.view.peak = data.data;
  })
})
