app.controller('HeadController', function($scope, $state, locateService, peakService) {
  $scope.view = {};
  // $scope.view.locate = false;
  new Promise(function(resolve) {
    locateService.locate(resolve);
  }).then(function(position) {
    locateService.position = position;
    // $scope.view.locate = true;
    // if (position.complete) {
      $('.loading').hide();
      $('.peaksLink').show();
    // }
    console.log(position.coords.latitude + ", " + position.coords.longitude);
  });
  $scope.peakSearch = function() {
    peakService.search = $scope.view.search;
    $state.go('peaksearch');
  }
  $scope.signOut = function() {
    localStorage.jwt = "";
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
        peak.options = {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: peak.id};
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
    else if ($scope.view.place) var url = `/peaknamesearch/${$scope.view.place}`;
    else if ($scope.view.peakname && $scope.view.place) var url = `/peaknamesearch/${$scope.view.peakname}+${$scope.view.place}`;
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

// app.controller('RoutetestController', function($scope, $http, locateService, uiGmapGoogleMapApi) {
//   $scope.view = {};
//   var lat = locateService.position.coords.latitude, lon = locateService.position.coords.longitude;
//   $scope.view.map = { center: { latitude: lat, longitude: lon }, zoom: 13 };
//   $scope.view.options = { mapTypeId: 'terrain' };
//   uiGmapGoogleMapApi.then(function(){
//     $scope.view.polylines = {
//       path: [{latitude: -105.253847,longitude: 40.005177},{latitude: -105.254374,longitude: 40.005181},{latitude: -105.254392,longitude: 40.006605},{latitude: -105.254843,longitude: 40.007069},{latitude: -105.259412,longitude: 40.007214},{latitude: -105.259981,longitude: 40.007974},{latitude: -105.266299,longitude: 40.008135},{latitude: -105.267351,longitude: 40.008361},{latitude: -105.269343,longitude: 40.009435},{latitude: -105.27374,longitude: 40.009467},{latitude: -105.276756,longitude: 40.010508},{latitude: -105.282295,longitude: 40.010498},{latitude: -105.283457,longitude: 40.013424},{latitude: -105.283239,longitude: 40.015101},{latitude: -105.284903,longitude: 40.02044},{latitude: -105.293037,longitude: 40.020545},{latitude: -105.29408,longitude: 40.02064},{latitude: -105.296162,longitude: 40.021552},{latitude: -105.29806,longitude: 40.021506},{latitude: -105.299186,longitude: 40.025008},{latitude: -105.29978,longitude: 40.025598},{latitude: -105.300202,longitude: 40.026763},{latitude: -105.303372,longitude: 40.029973},{latitude: -105.304538,longitude: 40.032573},{latitude: -105.305724,longitude: 40.033992},{latitude: -105.305314,longitude: 40.03441}]
//     }
//   });
// });

app.controller('AuthController', function($scope, $http) {
  $scope.view = {};
  // var blah = {blah: "blah"};
// TEST
  // $http.post('/signup', blah).then(function() {
  //
  // })

  $scope.sendSignIn = function() {
    // var username = $scope.view.signin.email, password = $scope.view.signin.password;
    $http.post('/signin', $scope.view.signin).then(function(res) {
      console.log(res);
      localStorage.jwt = res.data.token;
    })
  }

  $scope.sendSignUp = function() {
    $http.post('/signup', $scope.view.signup).then(function(res) {
      console.log(res);
      localStorage.jwt = res.data.token;
    })
  }

  $scope.useApi = function() {
    $http.get('/api').then(function(res) {
      $scope.view.response = res.data;
    })
  }
});
