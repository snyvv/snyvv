var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'snyvv' });
});

/* about */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'ABOUT | snyvv' });
});

/* portfolio */
router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'PORTFOLIO | snyvv' });
});

/* contact */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'CONTACT | snyvv' });
});

module.exports = router;