var express = require('express');
var router = express.Router();


router.get('/api', function(req, res, next) {
  jwt.verify(req.token, process.env.SECRET, function(err) {
    if (!err) {
      next();
    } else {
      res.status(400).send("Not found.")
    }
  })
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
