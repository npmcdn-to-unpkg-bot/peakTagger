var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Peak Tagger' });
});

router.get('/:lat/:lon', function(req, res, next) {
  var lat = parseFloat(req.params.lat), lon = parseFloat(req.params.lon), scale = 0.1;
  var url = `https://nominatim.openstreetmap.org/search?format=json&q=[peak]&limit=50&bounded=1&addressdetails=1&viewbox=${lon - scale},${lat + scale},${lon + scale},${lat - scale}`;
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
    }
  })
});

module.exports = router;
