var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');


/* GET pelayan firman listing. */
router.get('/', function (req, res, next) {
  //query
  connection.query('SELECT * FROM pelayan_firman', function (err, rows) {
      if (err) {
          req.flash('error', err);
          res.render('posts', {
              data: ''
          });
      } else {
          res.render('pelayan_firman/index', {
              data: rows
          });
      }
  });
});

/* GET pelayan firman list. */
router.get('/json', function (req, res, next) {
  //query
  connection.query('SELECT * FROM pelayan_firman', function (err, rows) {
      if (err) {
          req.flash('error', err);
          res.json({
              data: ''
          });
      } else {
          res.json({
              data: rows
          });
      }
  });
});

module.exports = router;
