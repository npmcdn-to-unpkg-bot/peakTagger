var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');
var xpath = require('xpath')
var DOMParser = require('xmldom').DOMParser;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Peak Tagger' });
});

router.get('/peaksearch/:lat/:lon', function(req, res, next) {
  var lat = parseFloat(req.params.lat), lon = parseFloat(req.params.lon), scale = 0.1;
  var url = `https://nominatim.openstreetmap.org/search?format=json&q=[peak]&limit=50&bounded=1&addressdetails=1&viewbox=${lon - scale},${lat + scale},${lon + scale},${lat - scale}`;
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
    }
  })
});

router.get('/peaklookup/:osm_id', function(req, res, next) {

  
  request(`https://www.openstreetmap.org/api/0.6/node/${req.params.osm_id}`, function (error, response, body) {
    if (!error, response.statusCode === 200) {
      var doc = new DOMParser().parseFromString(body, 'text/xml');
      var nodes = xpath.select("//node", doc);
      var tags = xpath.select("//tag", doc);
      var peak = {};
      peak.osm_id = nodes[0].attributes[0].value;
      peak.lat = nodes[0].attributes[7].value;
      peak.lon = nodes[0].attributes[8].value;
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].attributes[0].value === 'ele') peak.ele = tags[i].attributes[1].value;
        if (tags[i].attributes[0].value === 'name') peak.name = tags[i].attributes[1].value;
      }
      console.log(peak);
      res.json(peak)
    }
  })
});

module.exports = router;
