var express = require('express');
var router = express.Router();

// import list pasal
var pasal = require('../public/data/list_pasal.json');
var ayat = require('../public/data/bible.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Pasal List
router.get('/pasal', function (req, res, next) {
  res.json({
      data: pasal
  });
});

// Ayat List
router.get('/ayat', function (req, res, next) {
  res.json({
      data: ayat
  });
});

module.exports = router;
