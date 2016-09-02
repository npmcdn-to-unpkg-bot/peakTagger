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
      $scope.view.peaks = parsePeaks(data.data);

      var arr = data.data.map(function(peak) {
        var distance = Math.sqrt(Math.pow((lat - parseFloat(peak.lat)), 2) + Math.pow((lon - parseFloat(peak.lon)), 2));
        if (distance < 0) distance = -distance;
        return { name: peak.address.peak, coords: {latitude: peak.lat, longitude: peak.lon}, distance: distance, osm_id: peak.osm_id,
        };
      })
      arr.sort(function(a, b) {
        return a.distance - b.distance;
      })
      $scope.view.peaks = arr.map(function(peak, i) {
        peak.id = i + 1;
        return peak;
      })

    })
  }


// SWITCH TO THIS FUNCTION
  function parsePeaks(arr) {
    arr.map(function(peak) {
      var distance = Math.sqrt(Math.pow((lat - parseFloat(peak.lat)), 2) + Math.pow((lon - parseFloat(peak.lon)), 2));
      if (distance < 0) distance = -distance;
      return { name: peak.address.peak, coords: {latitude: peak.lat, longitude: peak.lon}, distance: distance, osm_id: peak.osm_id,
      };
    })
    arr.sort(function(a, b) {
      return a.distance - b.distance;
    })
    return arr.map(function(peak, i) {
      peak.id = i + 1;
      return peak;
    })
  }



  $scope.markerClick = function(coords) {
    $scope.view.map = { center: { latitude: coords.latitude, longitude: coords.longitude }, zoom: 13 };
    getPeaks(coords.latitude, coords.longitude);
  }

  $scope.searchPeak = function() {
    if ($scope.view.peakname) var url = `/peaknamesearch/${$scope.view.peakname}`;
    else if ($scope.view.town) var url = `/peaktownsearch/${$scope.view.town}`;
    else if ($scope.view.peakname && $scope.view.town) var url = `/peaknametownsearch/${$scope.view.peakname}/${$scope.view.town}`;
    $http.get(url).then(function(data) {
      // $scope.view.peaks = parsePeaks(data.data);


      var arr = data.data.map(function(peak) {
        var distance = Math.sqrt(Math.pow((lat - parseFloat(peak.lat)), 2) + Math.pow((lon - parseFloat(peak.lon)), 2));
        if (distance < 0) distance = -distance;
        return { name: peak.address.peak, coords: {latitude: peak.lat, longitude: peak.lon}, distance: distance, osm_id: peak.osm_id,
        };
      })
      arr.sort(function(a, b) {
        return a.distance - b.distance;
      })
      $scope.view.peaks = arr.map(function(peak, i) {
        peak.id = i + 1;
        return peak;
      })


      $scope.view.map = { center: { latitude: data.data[0].lat, longitude: data.data[0].lon }, zoom: 13 };
    })
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

app.controller('PeakController', ['$scope', '$http', 'olData', 'peakService', function($scope, $http, olData, peakService) {
  $scope.view = {};
  $scope.view.peak = {};
  var lat = parseFloat(peakService.position.latitude), lon = parseFloat(peakService.position.longitude);
  angular.extend($scope.view, {
    center: { lat: lat, lon: lon, zoom: 15 }
  });


  var osm_id = peakService.osm_id;
  $http.get(`/peaklookup/${osm_id}`).then(function(data) { // GETS DATA ON INDIVIDUAL PEAK
    $scope.view.peak = data.data;
    $scope.view.peak.ele = Math.floor(data.data.ele * 3.2808);
  })
}]);
