app.controller('HomeController', function($scope, locateService) {
// TODO BUILD COORDS INTO LOCAL STORAGE AND MAKE IT RUN FROM ANY PAGE/STATE
  new Promise(function(resolve) {
    locateService.locate(resolve);
  }).then(function(position) {
    locateService.position = position;
    console.log(position.coords.latitude + ", " + position.coords.longitude);
  });
});

app.controller('MainController', function($scope, $http, locateService, peakService) {
  $scope.view = {};
  var lat = locateService.position.coords.latitude, lon = locateService.position.coords.longitude;
  $scope.view.map = { center: { latitude: lat, longitude: lon }, zoom: 12 };
  $scope.view.options = { mapTypeId: 'terrain' };
  $http.get(`/peaksearch/${lat}/${lon}`).then(function(data) { // GETS MOUNTAIN DATA FROM INTERNAL API
    $scope.view.peaks = data.data;
    $scope.view.markers = data.data.map(function(peak, i) {
      return {id: i, name: peak.address.peak, coords: {latitude: peak.lat, longitude: peak.lon}};
    })
  })
  $scope.peakSelect = function(osm_id, lat, lon) {
    peakService.osm_id = osm_id;
    peakService.position = { lat: lat, lon: lon };
  }
});

app.controller('PeakController', function($scope, $http, peakService) {
  $scope.view = {};
  $scope.view.peak = {};
  var lat = parseFloat(peakService.position.lat), lon = parseFloat(peakService.position.lon);
  angular.extend($scope.view, {
      center: { lat: lat, lon: lon, zoom: 15 }
  });
  var osm_id = peakService.osm_id;
  $http.get(`/peaklookup/${osm_id}`).then(function(data) { // GETS DATA ON INDIVIDUAL PEAK
    $scope.view.peak = data.data;
    console.log(data.data);
    $scope.view.peak.ele = Math.floor(data.data.ele * 3.2808);
  })
});
