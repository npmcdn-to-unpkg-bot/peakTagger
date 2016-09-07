var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');
var xpath = require('xpath')
var DOMParser = require('xmldom').DOMParser;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


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

router.get('/peaknamesearch/:name', function(req, res, next) {
  var name = req.params.name;
  var url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=[peak]+${name}`;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else if (error) {
      console.log(error);
    }
  })
});


router.get('/peaklookup/:osm_id', function(req, res, next) {
  knex('peaks')
    .where('osm_id', req.params.osm_id)
    .first()
    .then(function(peak) {
      if (peak) {
        res.json(peak)
      } else {
        request(`https://www.openstreetmap.org/api/0.6/node/${req.params.osm_id}`, function (error, response, body) {
          if (!error, response.statusCode === 200) {
            var doc = new DOMParser().parseFromString(body, 'text/xml');
            var nodes = xpath.select("//node", doc);
            var tags = xpath.select("//tag", doc);
            var peak = {};
            peak.osm_id = parseInt(nodes[0].attributes[0].value);
            peak.lat = nodes[0].attributes[7].value;
            peak.lon = nodes[0].attributes[8].value;
            for (var i = 0; i < tags.length; i++) {
              if (tags[i].attributes[0].value === 'ele') peak.ele = parseInt(tags[i].attributes[1].value);
              if (tags[i].attributes[0].value === 'name') peak.name = tags[i].attributes[1].value;
            }
            knex('peaks').insert(peak).then(function() {
              res.json(peak);
            });
          }
        })
      }
  })
});


router.post('/signin', function(req, res, next) {
  knex('users')
    .where({email: req.body.email.toLowerCase()})
    .first()
    .then(function(data) {
      if (!data) {
        res.send('Sorry, that email/password combination is invalid.')
      }
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({token: jwt.sign(user, process.env.SECRET)});
      } else {
        res.send('Sorry, that email/password combination is invalid.')
      }
    });
});


router.post('/signup', function(req, res, next) {
  // console.log(req.body.password);
  if (!req.body.email || !req.body.password) {
    console.log('error message');
    res.send('Please enter a valid email and password.')
  } else {
    var password = bcrypt.hashSync(req.body.password, 8);
    knex('users')
      .where({email: req.body.email.toLowerCase()})
      .then(function(data) {
        if (data.length) {
          console.log('email in use');
          res.send('Sorry. That email is already in our system.')
        } else {
          console.log(req.body.email);
          console.log(password);
          knex('users')
            .insert({
              email: req.body.email.toLowerCase(),
              password: password
            })
            .returning(id)
            // .then(function(input) {
            //   console.log('still okay');
            //   return Promise.resolve(Array.isArray(input) ? inputp[0] : input)
            // })
            .then(function(id) {
              console.log('send token');
              res.json({token: jwt.sign(user, process.env.SECRET)});
              // $location.path('/browse');
            })
            .catch(function(err) {
              next(err);
            });
        }
      })
      .catch(function(err) {
        next(err);
      });
  }
});


router.get('/signout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
