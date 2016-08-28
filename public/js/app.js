var app = angular.module('peakTagger', ['ui.router', 'uiGmapgoogle-maps']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', {
      url: '/',
      controller: "HomeController",
      templateUrl: "partials/home.html"
    })
    .state('main', {
      url: '/main',
      controller: "MainController",
      templateUrl: "partials/main.html"
    })
    .state('map', {
      url: '/map',
      controller: "MapController",
      templateUrl: "partials/map.html"
    })
    $locationProvider.html5Mode(true);
});
