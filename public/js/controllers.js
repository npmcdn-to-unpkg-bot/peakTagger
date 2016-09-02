app.controller('HeadController', function($scope, $state, locateService, peakService) {
  new Promise(function(resolve) {
    locateService.locate(resolve);
  }).then(function(position) {
    locateService.position = position;
    console.log(position.coords.latitude + ", " + position.coords.longitude);
  });
  $scope.peakSearch = function() {
    peakService.search = $scope.view.search;
    $state.go('peaksearch');
  }
});

app.controller('HomeController', function($scope, locateService) {

});

app.controller('PeaksController', function($scope, $http, locateService, peakService) {
  $scope.view = {};
  $scope.view.peaks = [];
  var lat = locateService.position.coords.latitude, lon = locateService.position.coords.longitude;
  $scope.view.map = { center: { latitude: lat, longitude: lon }, zoom: 13 };
  $scope.view.options = { mapTypeId: 'terrain' };
  getPeaks(lat, lon);
  function getPeaks(lat, lon) {
    $http.get(`/peaksearch/${lat}/${lon}`).then(function(data) { // GETS MOUNTAIN DATA FROM INTERNAL API
      var arr = data.data.map(function(peak) {
        var distance = Math.sqrt(Math.pow((lat - parseFloat(peak.lat)), 2) + Math.pow((lon - parseFloat(peak.lon)), 2));
        if (distance < 0) distance = -distance;
        return { name: peak.address.peak, coords: {latitude: peak.lat, longitude: peak.lon}, distance: distance, osm_id: peak.osm_id,
        // options: { labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'id', labelVisible: true }
        };
      })
      arr.sort(function(a, b) {
        return a.distance - b.distance;
      })

      $scope.view.peaks = arr.map(function(peak, i) {
        console.log(peak);
        peak.id = i + 1;
        return peak;
      })
      console.log($scope.view.peaks);
      // $scope.view.markeroptions = { labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'id', labelVisible: true }
    })
  }

  $scope.view.markerClick = function(coords) {
    $scope.view.map = { center: { latitude: coords.latitude, longitude: coords.longitude }, zoom: 13 };
    getPeaks(coords.latitude, coords.longitude);
  }

  $scope.peakSelect = function(osm_id, coords) {
    peakService.osm_id = osm_id;
    peakService.position = coords;
  }
});

app.controller('PeakSearchController', function($scope, $http, peakService) {
  console.log(peakService.search);
  $http.get(`/peaknamesearch/${peakService.search}`).then(function(data) {
    console.log(data);
  })
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
