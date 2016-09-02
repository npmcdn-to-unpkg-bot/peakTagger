var app = angular.module('peakTagger', ['ui.router', 'uiGmapgoogle-maps', 'openlayers-directive']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', {
      url: '/',
      controller: "HomeController",
      templateUrl: "partials/home.html"
    })
    .state('peaksearch', {
      url: '/peaksearch',
      controller: "PeakSearchController",
      templateUrl: "partials/peaksearch.html"
    })
    .state('peaks', {
      url: '/peaks',
      controller: "PeaksController",
      templateUrl: "partials/peaks.html"
    })
    .state('peak', {
      url: '/peak',
      controller: "PeakController",
      templateUrl: "partials/peak.html"
    })
    $locationProvider.html5Mode(true);
})
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyChjSUhv_DsG4b_zS9XpI4WTwf0A0BxmCU',
        libraries: 'weather,geometry,visualization'
    });
});
