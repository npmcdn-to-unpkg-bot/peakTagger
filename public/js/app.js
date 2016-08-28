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
    .state('peak', {
      url: '/peak',
      controller: "PeakController",
      templateUrl: "partials/peak.html"
    })
    $locationProvider.html5Mode(true);
});
