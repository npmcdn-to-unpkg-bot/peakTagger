var app = angular.module('peakTagger', ['ui.router', 'uiGmapgoogle-maps', 'openlayers-directive']);

app.config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  $httpProvider.interceptors.push('jwtInterceptor');
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
    .state('routetest', {
      url: '/routetest',
      controller: "RoutetestController",
      templateUrl: "partials/routetest.html"
    })
    .state('auth', {
      url: '/auth',
      controller: "AuthController",
      templateUrl: "partials/auth.html"
    })
    $locationProvider.html5Mode(true);
})
.service('jwtInterceptor', function jwtInterceptor(){
  return {
    request: function(config){
      config.headers.Authorization = 'Bearer ' + localStorage.jwt;
      return config;
    }
  };
})
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyChjSUhv_DsG4b_zS9XpI4WTwf0A0BxmCU',
        libraries: 'weather,geometry,visualization'
    });
});
