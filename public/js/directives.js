// app.directive('headerDirective', function() {
//   return {
//     templateUrl: 'partials/header.html',
//     controller: function($scope, $state, locateService) {
//       new Promise(function(resolve) {
//         locateService.locate(resolve);
//       }).then(function(position) {
//         locateService.position = position;
//         console.log(position.coords.latitude + ", " + position.coords.longitude);
//       });
//       $scope.peakSearch = function() {
//         console.log($scope.view.peak);
//         $state.go('peaks');
//       }
//     }
//   };
// });
