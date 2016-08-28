app.service('locateService', function() {
  // FINDS CURRENT POSITION
  this.locate = function(resolve) {
    var browserSupportFlag;
    var position = {};
    if (navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
         resolve(position);
      })
    }
  }
  // SAVES CURRENT POSITION
  this.position = {};
});
